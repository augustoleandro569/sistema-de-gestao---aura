-- ==============================================================================
-- TABELA DE CLIENTES & PRONTUÁRIO ESTÉTICO (POSTGRESQL / SUPABASE)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  photo_url TEXT,
  total_spent NUMERIC(10, 2) DEFAULT 0.00,
  appointments_count INTEGER DEFAULT 0,
  average_ticket NUMERIC(10, 2) DEFAULT 0.00,
  satisfaction_score NUMERIC(3, 2) DEFAULT 5.00,
  last_appointment_date DATE,
  next_appointment_date DATE,
  recommended_return_date DATE,
  return_status TEXT DEFAULT 'em_dia', -- 'retorno_hoje', 'retorno_proximo', 'retorno_atrasado', 'em_dia', 'inativo'
  segment TEXT DEFAULT 'novo', -- 'novo', 'recorrente', 'vip', 'em_risco', 'inativo'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- COMPLEMENTO DA TABELA DE CLIENTES (MIGRAÇÃO SOLICITADA)
-- ==============================================================================

-- Complemento da tabela de clientes
ALTER TABLE clients ADD COLUMN IF NOT EXISTS cpf TEXT UNIQUE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS registration_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS lgpd_consent BOOLEAN DEFAULT FALSE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS medical_notes TEXT; -- Importante para estética

-- ==============================================================================
-- ÍNDICES DE PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_clients_org_id ON clients(organization_id);
CREATE INDEX IF NOT EXISTS idx_clients_cpf ON clients(cpf);
CREATE INDEX IF NOT EXISTS idx_clients_whatsapp ON clients(whatsapp);
CREATE INDEX IF NOT EXISTS idx_clients_registration_completed ON clients(registration_completed);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) & POLÍTICAS MULTITENANT
-- ==============================================================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados acessam clientes de sua organização"
ON clients FOR ALL
USING (
  organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
