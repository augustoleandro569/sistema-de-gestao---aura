-- Bucket de Armazenamento para Conteúdos ('contents')
INSERT INTO storage.buckets (id, name, public)
VALUES ('contents', 'contents', true)
ON CONFLICT (id) DO NOTHING;

-- Habilitar RLS na tabela de storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Permitir que usuários autenticados subam arquivos para sua própria organização
CREATE POLICY "Upload de imagens por organização" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'contents' AND auth.role() = 'authenticated');

-- Permitir que qualquer pessoa veja as imagens (Público)
CREATE POLICY "Visualização pública de conteúdos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'contents');
