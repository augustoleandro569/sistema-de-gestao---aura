-- ==============================================================================
-- CONTROLE DE ESTOQUE & FICHA TÉCNICA DE SERVIÇOS (POSTGRESQL / SUPABASE)
-- Sublime Estética & Bem-Estar
-- ==============================================================================

-- Habilita extensão uuid se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. TABELA DE ITENS DE ESTOQUE (INVENTORY ITEMS)
-- ==============================================================================
-- Itens de Estoque
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  current_quantity DECIMAL NOT NULL DEFAULT 0,
  min_quantity DECIMAL NOT NULL DEFAULT 0,
  cost_price DECIMAL NOT NULL, -- Preço de compra
  unit_measure TEXT, -- 'ml', 'g', 'un'
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  category TEXT DEFAULT 'Geral',
  supplier TEXT,
  last_restocked_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. VÍNCULO SERVIÇO X MATERIAL (FICHA TÉCNICA)
-- ==============================================================================
-- Vínculo Serviço x Material (Ficha Técnica)
CREATE TABLE IF NOT EXISTS service_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  quantity_used DECIMAL NOT NULL, -- Quanto usa por serviço
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(service_id, item_id)
);

-- ==============================================================================
-- ÍNDICES DE PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_inventory_items_org_id ON inventory_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_current_quantity ON inventory_items(current_quantity);
CREATE INDEX IF NOT EXISTS idx_inventory_items_min_quantity ON inventory_items(min_quantity);

CREATE INDEX IF NOT EXISTS idx_service_materials_service_id ON service_materials(service_id);
CREATE INDEX IF NOT EXISTS idx_service_materials_item_id ON service_materials(item_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_materials ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso por organização
CREATE POLICY "Acesso a itens de estoque da mesma organizacao"
ON inventory_items FOR ALL
USING (
  organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Acesso a ficha tecnica de servicos da mesma organizacao"
ON service_materials FOR ALL
USING (
  service_id IN (
    SELECT s.id FROM services s 
    WHERE s.organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
  )
);

-- ==============================================================================
-- VIEW ANALÍTICA: CUSTO TOTAL DE MATERIAL POR SERVIÇO (FICHA TÉCNICA)
-- ==============================================================================
CREATE OR REPLACE VIEW view_service_material_costs AS
SELECT 
  sm.service_id,
  s.name AS service_name,
  s.base_price AS service_price,
  COUNT(sm.id) AS total_materials_count,
  COALESCE(SUM(sm.quantity_used * ii.cost_price), 0) AS total_material_cost,
  (s.base_price - COALESCE(SUM(sm.quantity_used * ii.cost_price), 0)) AS gross_margin_after_materials
FROM services s
LEFT JOIN service_materials sm ON sm.service_id = s.id
LEFT JOIN inventory_items ii ON ii.id = sm.item_id
GROUP BY sm.service_id, s.name, s.base_price;
