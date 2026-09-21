-- ==============================================================================
-- 2. ISOLAMENTO DE DADOS MULTI-TENANT (ROW LEVEL SECURITY - RLS)
-- Infraestrutura SaaS Aura Estética
-- ==============================================================================

-- Função auxiliar para obter o business_id do usuário logado
CREATE OR REPLACE FUNCTION auth.get_user_business_id()
RETURNS UUID AS $$
  SELECT business_id FROM profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Função auxiliar para verificar se o usuário é SUPER_ADMIN da plataforma
CREATE OR REPLACE FUNCTION auth.is_platform_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ==============================================================================
-- RLS: TABELA DE ESTABELECIMENTOS (BUSINESSES)
-- ==============================================================================
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Visitantes e clientes podem ler dados públicos do estabelecimento pelo slug (para a vitrine pública)
CREATE POLICY "Public profile can be viewed by anyone"
ON businesses FOR SELECT
USING (status = 'active');

-- Donos e membros gerenciam seu próprio estabelecimento
CREATE POLICY "Tenants manage own business"
ON businesses FOR ALL
USING (
  auth.is_platform_super_admin() 
  OR id = auth.get_user_business_id()
  OR owner_id = auth.uid()
);

-- ==============================================================================
-- RLS: TABELA DE MÓDULOS CONTRATADOS (BUSINESS_MODULES)
-- ==============================================================================
ALTER TABLE business_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants see own subscribed modules"
ON business_modules FOR SELECT
USING (
  auth.is_platform_super_admin()
  OR business_id = auth.get_user_business_id()
);

CREATE POLICY "Super admins manage business modules"
ON business_modules FOR ALL
USING (auth.is_platform_super_admin());

-- ==============================================================================
-- RLS: AGENDAMENTOS (APPOINTMENTS)
-- Isolamento absoluto: Estabelecimentos veem apenas seus próprios agendamentos
-- ==============================================================================
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Estabelecimentos veem apenas seus proprios agendamentos"
ON appointments FOR ALL
USING (
  auth.is_platform_super_admin()
  OR business_id = auth.get_user_business_id()
);

-- ==============================================================================
-- RLS: CLIENTES (CLIENTS)
-- ==============================================================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Estabelecimentos veem apenas seus proprios clientes"
ON clients FOR ALL
USING (
  auth.is_platform_super_admin()
  OR business_id = auth.get_user_business_id()
);

-- ==============================================================================
-- RLS: SEGURANÇA E ISOLAMENTO DE PAPÉIS (ESTOQUE & FINANCEIRO)
-- Regra Estrita: Usuário com role CLIENT nunca terá permissão de leitura
-- em tabelas como inventory_items ou financial_transactions
-- ==============================================================================
CREATE OR REPLACE FUNCTION auth.is_clinic_staff()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
      AND role IN ('ADMIN', 'MANAGER', 'PROFESSIONAL', 'RECEPTIONIST', 'SUPER_ADMIN', 'PLATFORM_ADMIN')
      AND role != 'CLIENT'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ==============================================================================
-- RLS: ESTOQUE (INVENTORY_ITEMS) & FICHA TÉCNICA (SERVICE_MATERIALS)
-- ==============================================================================
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_materials ENABLE ROW LEVEL SECURITY;

-- Regra de Ouro: Clientes (CLIENT) não possuem permissão de leitura em tabelas de gestão
CREATE POLICY "Bloqueio Total para Clientes em Dados de Gestão"
ON inventory_items
FOR SELECT
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) != 'CLIENT'
);

CREATE POLICY "Estabelecimentos veem apenas seus proprios insumos de estoque"
ON inventory_items FOR ALL
USING (
  (auth.is_platform_super_admin() OR (auth.is_clinic_staff() AND business_id = auth.get_user_business_id()))
);

CREATE POLICY "Bloqueio Total para Clientes em Custos e Fichas Tecnicas"
ON service_materials
FOR SELECT
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) != 'CLIENT'
);

CREATE POLICY "Estabelecimentos veem apenas suas proprias fichas tecnicas"
ON service_materials FOR ALL
USING (
  (auth.is_platform_super_admin() OR (auth.is_clinic_staff() AND business_id = auth.get_user_business_id()))
);

-- ==============================================================================
-- RLS: FINANCEIRO (FINANCIAL_TRANSACTIONS)
-- Usuários CLIENT são estritamente bloqueados nesta tabela
-- ==============================================================================
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bloqueio Total para Clientes em Transacoes Financeiras"
ON financial_transactions
FOR SELECT
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) != 'CLIENT'
);

CREATE POLICY "Estabelecimentos veem apenas suas proprias movimentacoes financeiras"
ON financial_transactions FOR ALL
USING (
  (auth.is_platform_super_admin() OR (auth.is_clinic_staff() AND business_id = auth.get_user_business_id()))
);

-- ==============================================================================
-- RLS: SERVIÇOS & PROFISSIONAIS (SERVICES & PROFESSIONALS)
-- ==============================================================================
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public services can be viewed for public booking"
ON services FOR SELECT
USING (
  status = 'ativo' 
  OR business_id = auth.get_user_business_id() 
  OR auth.is_platform_super_admin()
);

CREATE POLICY "Tenants manage their services"
ON services FOR ALL
USING (
  auth.is_platform_super_admin()
  OR business_id = auth.get_user_business_id()
);
