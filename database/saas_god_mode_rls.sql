-- ==============================================================================
-- AURA SAAS ENTERPRISE - GOD MODE (PLATFORM_ADMIN / ROOT ACCESS)
-- BYPASS TOTAL DE RLS & TABELA DE AUDITORIA ROOT
-- ==============================================================================

-- 1. Criação / Atualização do Tipo e Funções Auxiliares de Root
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
    CREATE TYPE user_role_enum AS ENUM (
      'PLATFORM_ADMIN',
      'SUPER_ADMIN',
      'ADMIN',
      'MANAGER',
      'PROFESSIONAL',
      'RECEPTIONIST',
      'CLIENT'
    );
  ELSE
    -- Garantir que PLATFORM_ADMIN existe no enum
    ALTER TYPE user_role_enum ADD VALUE IF NOT EXISTS 'PLATFORM_ADMIN' BEFORE 'SUPER_ADMIN';
  END IF;
END $$;

-- 2. Tabela de Auditoria Root (audit_logs_root)
-- Registra TODAS as ações feitas pelo usuário mestre / dev@aura.com.br
CREATE TABLE IF NOT EXISTS audit_logs_root (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email VARCHAR(255) NOT NULL,
  actor_role VARCHAR(50) NOT NULL DEFAULT 'PLATFORM_ADMIN',
  action VARCHAR(100) NOT NULL, -- e.g.: 'IMPERSONATE_START', 'IMPERSONATE_END', 'PLAN_UPGRADE', 'RESET_PASSWORD', 'SUSPEND_TENANT', 'BYPASS_QUERY'
  target_business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  target_business_name VARCHAR(255),
  target_user_id UUID,
  target_user_email VARCHAR(255),
  details TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices de auditoria
CREATE INDEX IF NOT EXISTS idx_audit_logs_root_actor ON audit_logs_root(actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_root_action ON audit_logs_root(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_root_target_biz ON audit_logs_root(target_business_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_root_created_at ON audit_logs_root(created_at DESC);

-- RLS para a tabela de auditoria: APENAS PLATFORM_ADMIN pode ler os logs
ALTER TABLE audit_logs_root ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Apenas Platform Admin lê logs de auditoria root" ON audit_logs_root;
CREATE POLICY "Apenas Platform Admin lê logs de auditoria root"
ON audit_logs_root
FOR SELECT
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
);

DROP POLICY IF EXISTS "Inserção de auditoria root permitida pelo sistema" ON audit_logs_root;
CREATE POLICY "Inserção de auditoria root permitida pelo sistema"
ON audit_logs_root
FOR INSERT
WITH CHECK (true);

-- 3. Função de verificação se o usuário logado é PLATFORM_ADMIN
CREATE OR REPLACE FUNCTION auth.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND (role = 'PLATFORM_ADMIN' OR email = 'dev@aura.com.br')
  );
$$;

-- 4. Função auxiliar para obter o business_id do usuário logado
CREATE OR REPLACE FUNCTION auth.get_user_business_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT business_id FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- ==============================================================================
-- POLÍTICAS GLOBAIS DE BYPASS TOTAL (GOD MODE) + ISOLAMENTO POR UNIDADE
-- Lógica: Mostre se (auth.is_platform_admin()) OU se (business_id = auth.get_user_business_id())
-- ==============================================================================

-- 4.1. TABELA APPOINTMENTS (AGENDAMENTOS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso Global Super Admin ou Isolamento por Unidade" ON appointments;
DROP POLICY IF EXISTS "appointments_tenant_isolation" ON appointments;

CREATE POLICY "Acesso Global Super Admin ou Isolamento por Unidade"
ON appointments
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
);

-- 4.2. TABELA INVENTORY_ITEMS (ESTOQUE)
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso Global Super Admin ou Isolamento por Unidade" ON inventory_items;
DROP POLICY IF EXISTS "inventory_tenant_isolation" ON inventory_items;

CREATE POLICY "Acesso Global Super Admin ou Isolamento por Unidade"
ON inventory_items
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
);

-- 4.3. TABELA FINANCIAL_TRANSACTIONS (FINANCEIRO)
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso Global Super Admin ou Isolamento por Unidade" ON financial_transactions;
DROP POLICY IF EXISTS "finance_tenant_isolation" ON financial_transactions;

CREATE POLICY "Acesso Global Super Admin ou Isolamento por Unidade"
ON financial_transactions
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
);

-- 4.4. TABELA CLIENTS (CLIENTES / PRONTUÁRIOS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso Global Super Admin ou Isolamento por Unidade" ON clients;
DROP POLICY IF EXISTS "clients_tenant_isolation" ON clients;

CREATE POLICY "Acesso Global Super Admin ou Isolamento por Unidade"
ON clients
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
);

-- 4.5. TABELA SERVICES (SERVIÇOS & PROCEDIMENTOS)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso Global Super Admin ou Isolamento por Unidade" ON services;
DROP POLICY IF EXISTS "services_tenant_isolation" ON services;

CREATE POLICY "Acesso Global Super Admin ou Isolamento por Unidade"
ON services
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
  OR
  is_public = true -- Vitrine pública permitida para leitura
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
);

-- 4.6. TABELA PROFESSIONALS (EQUIPE / ESTETAS)
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso Global Super Admin ou Isolamento por Unidade" ON professionals;
DROP POLICY IF EXISTS "professionals_tenant_isolation" ON professionals;

CREATE POLICY "Acesso Global Super Admin ou Isolamento por Unidade"
ON professionals
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
);

-- 4.7. TABELA UNITS (UNIDADES & FILIAIS)
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso Global Super Admin ou Isolamento por Unidade" ON units;

CREATE POLICY "Acesso Global Super Admin ou Isolamento por Unidade"
ON units
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
);

-- 4.8. TABELA PROFILES (USUÁRIOS DO SISTEMA)
-- Proteção especial: Perfis com is_root = true ou role = 'PLATFORM_ADMIN'
-- são invisíveis para donos de clínicas comuns e relatórios de funcionários
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso Global Super Admin ou Isolamento por Unidade" ON profiles;
DROP POLICY IF EXISTS "profiles_tenant_isolation" ON profiles;

CREATE POLICY "Acesso Global Super Admin ou Isolamento por Unidade"
ON profiles
FOR ALL
USING (
  -- Se for PLATFORM_ADMIN, tem visão total de todos os usuários
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR (
    -- Donos de clínica veem usuários da sua unidade, mas NUNCA usuários root
    business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
    AND role != 'PLATFORM_ADMIN'
    AND COALESCE(is_root, false) = false
  )
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR (
    business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
    AND role != 'PLATFORM_ADMIN'
  )
);

-- 4.9. TABELA BUSINESSES (ESTABELECIMENTOS / TENANTS)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso Global Super Admin ou Dono da Unidade" ON businesses;

CREATE POLICY "Acesso Global Super Admin ou Dono da Unidade"
ON businesses
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  id = (SELECT business_id FROM profiles WHERE id = auth.uid())
  OR
  status = 'active' -- Vitrine pública para visualização de dados básicos
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  id = (SELECT business_id FROM profiles WHERE id = auth.uid())
);

-- 4.10. TABELA BUSINESS_MODULES (LICENCIAMENTO DE MÓDULOS)
ALTER TABLE business_modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso Global Super Admin ou Modulos da Unidade" ON business_modules;

CREATE POLICY "Acesso Global Super Admin ou Modulos da Unidade"
ON business_modules
FOR ALL
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
  OR 
  business_id = (SELECT business_id FROM profiles WHERE id = auth.uid())
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'PLATFORM_ADMIN'
);
