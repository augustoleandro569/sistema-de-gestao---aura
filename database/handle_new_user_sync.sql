-- ==============================================================================
-- FLUXO DE IDENTIDADE PROPRIETÁRIO AURA
-- Reconciliação do gatilho e schema com foco em Segurança Jurídica (CPF ÚNICO)
-- CPF como Primary Key de Negócio para Prontuários e Bloqueio de Duplicidade
-- ==============================================================================

-- 1. Garante restrição de unicidade para CPF na tabela de clientes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_clients_cpf'
  ) THEN
    ALTER TABLE public.clients ADD CONSTRAINT uq_clients_cpf UNIQUE (cpf);
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- 2. Função de Sincronização de Identidade Proprietária Aura
CREATE OR REPLACE FUNCTION public.handle_new_user_sync()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
  v_avatar_url TEXT;
  v_email TEXT;
  v_cpf TEXT;
  v_whatsapp TEXT;
  v_org_id UUID;
  v_clean_cpf TEXT;
BEGIN
  -- Extração de dados da identidade proprietária (metadata ou campos diretos)
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );
  v_avatar_url := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    NULL
  );
  v_email := LOWER(TRIM(NEW.email));
  v_cpf := COALESCE(NEW.raw_user_meta_data->>'cpf', '');
  v_whatsapp := COALESCE(NEW.raw_user_meta_data->>'whatsapp', NEW.raw_user_meta_data->>'phone', '');

  -- Normalização de CPF (apenas números)
  v_clean_cpf := REGEXP_REPLACE(v_cpf, '\D', '', 'g');

  -- Obter organização padrão se existir
  SELECT id INTO v_org_id FROM public.organizations LIMIT 1;

  -- 1. Sincroniza ou insere na tabela profiles
  INSERT INTO public.profiles (
    id,
    organization_id,
    full_name,
    email,
    role,
    avatar_url,
    cpf,
    phone,
    status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    v_org_id,
    v_full_name,
    v_email,
    'CLIENT',
    v_avatar_url,
    v_clean_cpf,
    v_whatsapp,
    'active',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    email = EXCLUDED.email,
    cpf = COALESCE(NULLIF(EXCLUDED.cpf, ''), profiles.cpf),
    phone = COALESCE(NULLIF(EXCLUDED.phone, ''), profiles.phone),
    updated_at = NOW();

  -- 2. Gerenciamento do Cliente por Chave Única de Negócio (CPF)
  -- Se o CPF estiver presente, vincula ou atualiza o cliente existente
  IF v_clean_cpf <> '' AND LENGTH(v_clean_cpf) = 11 THEN
    INSERT INTO public.clients (
      organization_id,
      name,
      cpf,
      email,
      phone,
      whatsapp,
      photo_url,
      registration_completed,
      lgpd_consent,
      created_at,
      updated_at
    )
    VALUES (
      v_org_id,
      v_full_name,
      v_clean_cpf,
      v_email,
      v_whatsapp,
      v_whatsapp,
      v_avatar_url,
      TRUE,
      TRUE,
      NOW(),
      NOW()
    )
    ON CONFLICT (cpf) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      phone = COALESCE(NULLIF(EXCLUDED.phone, ''), clients.phone),
      whatsapp = COALESCE(NULLIF(EXCLUDED.whatsapp, ''), clients.whatsapp),
      registration_completed = TRUE,
      updated_at = NOW();
  ELSE
    -- Caso o usuário tenha sido inserido sem CPF, cria registro preliminar
    IF NOT EXISTS (SELECT 1 FROM public.clients WHERE email = v_email) THEN
      INSERT INTO public.clients (
        organization_id,
        name,
        email,
        phone,
        whatsapp,
        photo_url,
        registration_completed,
        lgpd_consent,
        created_at,
        updated_at
      )
      VALUES (
        v_org_id,
        v_full_name,
        v_email,
        v_whatsapp,
        v_whatsapp,
        v_avatar_url,
        FALSE, -- Bloqueado até fornecer o CPF
        TRUE,
        NOW(),
        NOW()
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger disparado após inserção ou atualização no schema de autenticação
DROP TRIGGER IF EXISTS on_auth_user_created_sync ON auth.users;

CREATE TRIGGER on_auth_user_created_sync
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_sync();
