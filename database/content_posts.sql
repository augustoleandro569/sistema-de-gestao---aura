-- Tabela de Conteúdos
CREATE TABLE IF NOT EXISTS content_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  title TEXT NOT NULL,
  description TEXT,
  content_body TEXT,
  image_url TEXT,
  category TEXT, -- 'Dicas', 'Portfolio', 'Novidades', etc.
  status TEXT DEFAULT 'draft', -- 'draft', 'published'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  author_id UUID REFERENCES profiles(id)
);

-- Habilitar RLS
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;

-- Política de RLS para isolamento multitenant por organização
CREATE POLICY "Users can manage their organization's content"
ON content_posts FOR ALL
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- ==============================================================================
-- STORAGE: Bucket de Conteúdos ('contents') e Políticas de Segurança
-- ==============================================================================

-- Criar bucket se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('contents', 'contents', true)
ON CONFLICT (id) DO NOTHING;

-- Habilitar RLS em storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Permitir que usuários autenticados subam arquivos para sua própria organização
CREATE POLICY "Upload de imagens por organização" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'contents' AND auth.role() = 'authenticated');

-- Permitir que qualquer pessoa veja as imagens (Público)
CREATE POLICY "Visualização pública de conteúdos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'contents');

