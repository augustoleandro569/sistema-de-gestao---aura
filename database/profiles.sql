-- ==============================================================================
-- 1. Definição dos Cargos
-- ==============================================================================
CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'PROFESSIONAL', 'RECEPTIONIST', 'CLIENT');

-- ==============================================================================
-- 2. Tabela de Perfis (Profiles)
-- ==============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'CLIENT',
  specialty TEXT, -- Ex: 'Design de Sobrancelhas', 'Estética Avançada'
  avatar_url TEXT,
  status TEXT DEFAULT 'active', -- active, inactive, pending_invite
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. Segurança RLS (Row Level Security)
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Exemplo: Clientes só veem o próprio perfil
CREATE POLICY "Clients can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Exemplo: Admin vê todos os perfis da sua organização
CREATE POLICY "Admins can view all profiles in org" 
ON profiles FOR ALL 
USING (role = 'ADMIN' AND organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- ==============================================================================
-- ÍNDICES RECOMENDADOS DE PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

