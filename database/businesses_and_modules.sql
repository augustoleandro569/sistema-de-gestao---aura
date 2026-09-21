-- ==============================================================================
-- 1. MODELAGEM DE DADOS MULTI-TENANT ENTERPRISE (O NOVO CORE)
-- Infraestrutura SaaS Aura Estética
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela Mestra de Estabelecimentos (Tenants)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- Ex: auraestetica.com/perfil/studio-bella
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  plan_type TEXT DEFAULT 'pro', -- 'free', 'pro', 'premium', 'enterprise'
  status TEXT DEFAULT 'active', -- 'active', 'suspended', 'blocked'
  logo_url TEXT,
  cover_url TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  city TEXT DEFAULT 'São Paulo',
  state TEXT DEFAULT 'SP',
  description TEXT,
  instagram TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Módulos da Plataforma (Platform Modules)
CREATE TABLE IF NOT EXISTS platform_modules (
  id TEXT PRIMARY KEY, -- 'inventory', 'finance', 'whatsapp', 'pricing', 'appointments'
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  icon_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Módulos Ativos por Estabelecimento (Feature Gating)
CREATE TABLE IF NOT EXISTS business_modules (
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  module_id TEXT REFERENCES platform_modules(id) ON DELETE CASCADE,
  status BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (business_id, module_id)
);

-- ==============================================================================
-- MIGRAÇÃO DE TABELAS EXISTENTES: ADIÇÃO DE business_id
-- ==============================================================================

-- 4. Adiciona business_id às tabelas existentes (com fallback para organization_id)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id) ON DELETE CASCADE;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id) ON DELETE CASCADE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id) ON DELETE CASCADE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id) ON DELETE CASCADE;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id) ON DELETE CASCADE;
ALTER TABLE service_materials ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id) ON DELETE CASCADE;
ALTER TABLE financial_transactions ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id) ON DELETE CASCADE;
ALTER TABLE loyalty_cards ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id) ON DELETE CASCADE;
ALTER TABLE content_posts ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id) ON DELETE CASCADE;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id) ON DELETE CASCADE;
ALTER TABLE units ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id) ON DELETE CASCADE;

-- Índices de Alta Performance para Multi-Tenancy
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_business_modules_business_id ON business_modules(business_id);
CREATE INDEX IF NOT EXISTS idx_profiles_business_id ON profiles(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_business_id ON appointments(business_id);
CREATE INDEX IF NOT EXISTS idx_clients_business_id ON clients(business_id);
CREATE INDEX IF NOT EXISTS idx_services_business_id ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_business_id ON inventory_items(business_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_business_id ON financial_transactions(business_id);

-- ==============================================================================
-- SEED INICIAL DE MÓDULOS E ESTABELECIMENTOS DE EXEMPLO
-- ==============================================================================

INSERT INTO platform_modules (id, name, description, base_price, icon_name)
VALUES 
  ('appointments', 'Agenda & Agendamento Online', 49.90, 'Calendar'),
  ('pricing', 'Calculadora de Precificação & Ficha Técnica', 39.90, 'Calculator'),
  ('inventory', 'Controle de Estoque & Auditoria de Insumos', 49.90, 'Box'),
  ('finance', 'Gestão Financeira, DRE & Fluxo de Caixa', 59.90, 'DollarSign'),
  ('whatsapp', 'Automações & Lembretes WhatsApp', 69.90, 'Zap')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_price = EXCLUDED.base_price;
