-- ==============================================================================
-- AURA: O IFOOD DA BELEZA & ESTÉTICA
-- Arquitetura de Dados: Marketplace, Social Layer (Followers), Catálogo Global & Comissões
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1.1 TABELA DE UNIDADES COM COORDENADAS GEO-ESPACIAIS (PARA O MAPA & PROXIMIDADE)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'units' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE units ADD COLUMN latitude DOUBLE PRECISION;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'units' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE units ADD COLUMN longitude DOUBLE PRECISION;
  END IF;
END $$;

-- 2. TABELA DE SEGUIDORES (SOCIAL LAYER)
-- Permite que qualquer usuário final siga clínicas para receber conteúdos, novidades e promoções no Feed
CREATE TABLE IF NOT EXISTS shop_followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, business_id)
);

CREATE INDEX IF NOT EXISTS idx_shop_followers_business ON shop_followers(business_id);
CREATE INDEX IF NOT EXISTS idx_shop_followers_profile ON shop_followers(profile_id);

-- 3. TABELA DE DESTAQUES E ADS DO MARKETPLACE (MONETIZAÇÃO)
-- Clínicas contratam destaques no topo da busca ou na fita de destaques da semana
CREATE TABLE IF NOT EXISTS marketplace_ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  tier VARCHAR(50) DEFAULT 'top_search', -- 'top_search', 'banner_feed', 'categoria_destaque'
  badge_label VARCHAR(50) DEFAULT 'Destaque Aura',
  weekly_fee NUMERIC(10,2) DEFAULT 149.00,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INTEGRAÇÃO DE ORIGEM E COMISSÕES NOS AGENDAMENTOS
-- Adiciona tracking de canal de aquisição (Marketplace Aura vs Direto/Balcão)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'origin'
  ) THEN
    ALTER TABLE appointments ADD COLUMN origin VARCHAR(30) DEFAULT 'direct'; -- 'marketplace' ou 'direct'
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'marketplace_commission_percent'
  ) THEN
    ALTER TABLE appointments ADD COLUMN marketplace_commission_percent NUMERIC(5,2) DEFAULT 10.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'marketplace_commission_amount'
  ) THEN
    ALTER TABLE appointments ADD COLUMN marketplace_commission_amount NUMERIC(10,2) DEFAULT 0.00;
  END IF;
END $$;

-- 5. ATUALIZAÇÃO DA TABELA DE CONTEÚDOS (FEED SOCIAL DO MARKETPLACE)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content_posts' AND column_name = 'publish_to_marketplace'
  ) THEN
    ALTER TABLE content_posts ADD COLUMN publish_to_marketplace BOOLEAN DEFAULT TRUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content_posts' AND column_name = 'linked_service_id'
  ) THEN
    ALTER TABLE content_posts ADD COLUMN linked_service_id UUID REFERENCES services(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content_posts' AND column_name = 'promo_discount_percent'
  ) THEN
    ALTER TABLE content_posts ADD COLUMN promo_discount_percent NUMERIC(5,2) DEFAULT 0.00;
  END IF;
END $$;

-- 6. ÍNDICE E VIEW CONSOLIDADA DE BUSCA GLOBAL (GLOBAL SEARCH INDEX)
-- Consolida procedimentos de todas as clínicas ativas para busca rápida no Marketplace estilo iFood
CREATE OR REPLACE VIEW v_marketplace_services_catalog AS
SELECT 
  s.id AS service_id,
  s.name AS service_name,
  s.description AS service_description,
  s.price AS service_price,
  s.duration_minutes,
  s.image_url AS service_image,
  c.name AS category_name,
  b.id AS business_id,
  b.name AS business_name,
  b.slug AS business_slug,
  b.logo_url AS business_logo,
  b.cover_url AS business_cover,
  b.city AS business_city,
  b.address AS business_address,
  b.rating AS business_rating,
  b.reviews_count AS business_reviews_count,
  COUNT(DISTINCT f.id) AS followers_count,
  COALESCE(BOOL_OR(a.status = 'active'), FALSE) AS has_active_ad
FROM services s
JOIN service_categories c ON s.category_id = c.id
JOIN businesses b ON s.business_id = b.id
LEFT JOIN shop_followers f ON f.business_id = b.id
LEFT JOIN marketplace_ads a ON a.business_id = b.id AND a.status = 'active'
WHERE b.status = 'active' AND s.status = 'ativo'
GROUP BY 
  s.id, s.name, s.description, s.price, s.duration_minutes, s.image_url,
  c.name, b.id, b.name, b.slug, b.logo_url, b.cover_url, b.city, b.address,
  b.rating, b.reviews_count;

-- 7. POLÍTICAS DE SEGURANÇA RLS (ROW LEVEL SECURITY)
ALTER TABLE shop_followers ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver suas próprias conexões de seguidores
CREATE POLICY shop_followers_user_select ON shop_followers
  FOR SELECT
  USING (profile_id = auth.uid() OR auth.uid() IN (
    SELECT profile_id FROM business_members WHERE business_id = shop_followers.business_id
  ));

-- Usuários autenticados podem seguir e deixar de seguir livremente
CREATE POLICY shop_followers_user_insert ON shop_followers
  FOR INSERT
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY shop_followers_user_delete ON shop_followers
  FOR DELETE
  USING (profile_id = auth.uid());

-- 8. VIEW DO FEED DO CONSUMIDOR (FOLLOWER FEED)
-- Esta query busca posts apenas das clínicas que o usuário logado segue
CREATE OR REPLACE VIEW follower_feed AS
SELECT 
    cp.*, 
    b.name as business_name, 
    b.slug as business_slug,
    b.logo_url as business_logo
FROM content_posts cp
JOIN businesses b ON cp.business_id = b.id
JOIN shop_followers sf ON sf.business_id = b.id
WHERE sf.profile_id = auth.uid()
ORDER BY cp.created_at DESC;
