// src/components/contents/ImageUpload.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';

export interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  initialUrl?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess, initialUrl, className = '' }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialUrl || null);

  useEffect(() => {
    if (initialUrl !== undefined) {
      setPreview(initialUrl || null);
    }
  }, [initialUrl]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      // 1. Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('contents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Pegar a URL Pública
      const { data } = supabase.storage.from('contents').getPublicUrl(filePath);
      
      setPreview(data.publicUrl);
      onUploadSuccess(data.publicUrl);

    } catch (error) {
      alert('Erro ao subir imagem!');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="relative group cursor-pointer block">
        <div className={`
          mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-[24px] transition-all
          ${preview ? 'border-emerald-400 bg-emerald-50/10' : 'border-aesthetic-bege hover:border-rose-300 bg-aesthetic-off-white'}
        `}>
          {preview ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">Trocar Imagem</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-center">
              {uploading ? (
                <Loader2 className="mx-auto h-12 w-12 text-rose-400 animate-spin" />
              ) : (
                <Upload className="mx-auto h-12 w-12 text-aesthetic-bege group-hover:text-rose-400 transition-colors" />
              )}
              <div className="flex text-sm text-graphite">
                <span className="relative font-semibold">Subir foto do serviço</span>
                <input type="file" className="sr-only" onChange={handleUpload} disabled={uploading} accept="image/*" />
              </div>
              <p className="text-xs text-aesthetic-graphite/50">PNG, JPG até 10MB</p>
            </div>
          )}
        </div>
      </label>
    </div>
  );
};

export default ImageUpload;
