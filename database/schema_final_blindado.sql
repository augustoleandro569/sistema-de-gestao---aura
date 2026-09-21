-- ==============================================================================
-- AURA SAAS - SCHEMA FINAL E BLINDADO (CONSOLIDADO)
-- Arquitetura Desacoplada: Identidade Global (profiles) vs Afiliação Local (business_members / business_customers)
-- Eliminação Definitiva de Single Point of Failure (SPOF)
-- ==============================================================================

-- Habilitar extensões essenciais
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TIPOS E ENUMS (O esqueleto das permissões)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM (
      'PLATFORM_ADMIN',
      'OWNER',
      'ADMIN',
      'MANAGER',
      'PROFESSIONAL',
      'RECEPTIONIST',
      'CLIENT'
    );
  END IF;
END $$;

-- 2. TABELA DE NEGÓCIOS (TENANTS)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID, -- Referência ao profile ID
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PERFIS GLOBAIS (Identidade Única Global)
-- ATENÇÃO: NÃO CONTÉM organization_id nem business_id.
-- Um usuário é único na plataforma Aura e pode frequentar múltiplas clínicas!
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  cpf TEXT UNIQUE, -- Chave de segurança nacional (Validação Global de Unicidade)
  whatsapp TEXT,
  avatar_url TEXT,
  global_role user_role DEFAULT 'CLIENT', -- PLATFORM_ADMIN (God Mode) é definido aqui
  registration_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AFILIAÇÃO DE EQUIPE (Vínculo Staff -> Clínica)
CREATE TABLE IF NOT EXISTS business_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  unit_id UUID, -- Unidade principal de atuação
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, profile_id)
);

-- 5. RELACIONAMENTO CLIENTE (Vínculo Cliente -> Clínica)
-- Permite que o mesmo usuário seja cliente da Clínica A e da Clínica B
-- mantendo selos de fidelidade e prontuários médicos isolados por estabelecimento!
CREATE TABLE IF NOT EXISTS business_customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  loyalty_stamps INTEGER DEFAULT 0,
  medical_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, profile_id)
);

-- 6. ÍNDICES DE PERFORMANCE E INTEGRIDADE
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_cpf ON profiles(cpf);
CREATE INDEX IF NOT EXISTS idx_profiles_global_role ON profiles(global_role);

CREATE INDEX IF NOT EXISTS idx_business_members_biz ON business_members(business_id);
CREATE INDEX IF NOT EXISTS idx_business_members_prof ON business_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_business_members_role ON business_members(role);
CREATE INDEX IF NOT EXISTS idx_business_members_unit ON business_members(unit_id);

CREATE INDEX IF NOT EXISTS idx_business_customers_biz ON business_customers(business_id);
CREATE INDEX IF NOT EXISTS idx_business_customers_prof ON business_customers(profile_id);

-- ==============================================================================
-- GESTÃO DE MÓDULOS (VENDA POR RECURSO / ADD-ONS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS business_modules (
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (business_id, module_id)
);

-- Função para validar acesso a módulo no banco de dados antes de processar query
CREATE OR REPLACE FUNCTION check_module_access(target_business_id UUID, module_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM business_modules 
    WHERE business_id = target_business_id 
    AND module_id = module_name 
    AND status = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- TESTES DE ESTRESSE DAS REGRAS DE SEGURANÇA (RLS BLINDADO)
-- ==============================================================================

-- Habilitar RLS em todas as tabelas sensíveis
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 1. Políticas de Perfis Globais
DROP POLICY IF EXISTS "Usuário vê próprio perfil global" ON profiles;
CREATE POLICY "Usuário vê próprio perfil global" ON profiles
FOR SELECT USING (
  auth.uid() = id OR (SELECT global_role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
);

-- 2. Teste 1: O "Modo Deus" (PLATFORM_ADMIN)
-- O usuário dev@aura.com precisa ignorar o business_id
DROP POLICY IF EXISTS "God Mode Access" ON appointments;
CREATE POLICY "God Mode Access" ON appointments
FOR ALL USING (
  (SELECT global_role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
);

-- 3. Teste 2: Isolamento de Unidade e Hierarquia de Staff
-- Profissionais veem apenas sua unidade vinculada.
-- Dono (OWNER) e Administrador (ADMIN) veem todas as unidades da empresa.
DROP POLICY IF EXISTS "Staff Unit Isolation" ON appointments;
CREATE POLICY "Staff Unit Isolation" ON appointments
FOR SELECT USING (
  unit_id = (
    SELECT unit_id FROM business_members 
    WHERE profile_id = auth.uid() 
      AND business_id = appointments.business_id
  )
  OR
  (
    SELECT role FROM business_members 
    WHERE profile_id = auth.uid() 
      AND business_id = appointments.business_id
  ) IN ('OWNER', 'ADMIN')
);

-- 4. Isolamento para Clientes na Clínica
DROP POLICY IF EXISTS "Cliente vê seus agendamentos na clínica" ON appointments;
CREATE POLICY "Cliente vê seus agendamentos na clínica" ON appointments
FOR SELECT USING (
  client_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM business_customers
    WHERE business_id = appointments.business_id
      AND profile_id = auth.uid()
  )
);
