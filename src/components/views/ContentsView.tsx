import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Image as ImageIcon,
  Filter,
  BookOpen,
  Camera,
  Sparkles,
  Megaphone,
  X,
  Calendar,
  CheckCircle,
  Clock,
  Share2,
  Trash2,
  FileEdit,
  Send,
  Eye,
  Building2,
  UserCheck,
  UploadCloud,
  Check
} from 'lucide-react';
import { ContentPost, ContentPostCategory, ContentPostStatus } from '../../types';
import { dataService } from '../../services/dataService';
import { useBusiness } from '../../core/BusinessContext';

export const Contents: React.FC = () => {
  const { currentBusiness } = useBusiness();
  const [filterCategory, setFilterCategory] = useState<string>('Todos');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ContentPost | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);

  // New Content Form State (matching content_posts schema)
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ContentPostCategory>('Dicas');
  const [newStatus, setNewStatus] = useState<ContentPostStatus>('published');
  const [newDescription, setNewDescription] = useState('');
  const [newContentBody, setNewContentBody] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentOrg = dataService.getOrganization();
  const currentProfile = dataService.getProfile();

  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setNewImageUrl(result);
      setUploadedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const loadPosts = () => {
    const list = dataService.getContentPosts();
    setPosts(list);
  };

  useEffect(() => {
    loadPosts();
    const unsubscribe = dataService.subscribe(loadPosts);
    return () => unsubscribe();
  }, []);

  const categories = ['Todos', 'Dicas', 'Portfolio', 'Novidades', 'Informativos'];

  const filteredPosts = posts.filter((item) => {
    // Category match
    if (filterCategory !== 'Todos' && filterCategory !== 'all') {
      const catNorm = item.category === 'Antes e Depois' ? 'Portfolio' : item.category;
      const filterNorm = filterCategory === 'Antes e Depois' ? 'Portfolio' : filterCategory;
      if (catNorm !== filterNorm) return false;
    }
    // Status match
    if (filterStatus !== 'all' && item.status !== filterStatus) {
      return false;
    }
    return true;
  });

  const handleCreateContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    dataService.createContentPost({
      title: newTitle.trim(),
      description: newDescription.trim(),
      content_body: newContentBody.trim() || newDescription.trim(),
      contentBody: newContentBody.trim() || newDescription.trim(),
      image_url: newImageUrl.trim() || (newCategory === 'Portfolio' ? 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c' : undefined),
      imageUrl: newImageUrl.trim() || (newCategory === 'Portfolio' ? 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c' : undefined),
      category: newCategory,
      status: newStatus,
      author_id: currentProfile.id,
      authorId: currentProfile.id,
      businessId: currentBusiness?.id || 'biz-sublime-01',
      business_id: currentBusiness?.id || 'biz-sublime-01',
      businessName: currentBusiness?.name || 'Sublime Estética Avançada',
      businessSlug: currentBusiness?.slug || 'sublime-estetica',
    });

    setNewTitle('');
    setNewDescription('');
    setNewContentBody('');
    setNewImageUrl('');
    setUploadedFileName('');
    setUploadMode('upload');
    setNewStatus('published');
    setIsNewModalOpen(false);
  };

  const handleToggleStatus = (id: string, currentStatus: ContentPostStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus: ContentPostStatus = currentStatus === 'published' ? 'draft' : 'published';
    dataService.updateContentPost(id, { status: nextStatus });
  };

  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir esta publicação?')) {
      dataService.deleteContentPost(id);
      if (selectedArticle?.id === id) {
        setSelectedArticle(null);
      }
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Hoje';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    } catch {
      return 'Recente';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* HEADER DE CONTEÚDO */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-graphite font-display tracking-tight">Central de Conteúdos</h1>
          <p className="text-aesthetic-graphite/60 text-sm">
            Gerencie publicações, informativos e registros de portfólio vinculados à organização
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-graphite text-white px-6 py-3 rounded-full hover:bg-black transition-all shadow-lg active:scale-[0.98] cursor-pointer"
          >
            <Plus size={20} />
            <span className="font-semibold text-xs tracking-wider uppercase">NOVO CONTEÚDO</span>
          </button>
        </div>
      </header>

      {/* FILTROS RÁPIDOS & STATUS TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-aesthetic-bege/40">
        {/* Categorias */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => {
            const isActive = filterCategory === cat || (cat === 'Todos' && filterCategory === 'all');
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-graphite text-white border-graphite shadow-sm'
                    : 'border-aesthetic-bege text-graphite hover:bg-aesthetic-nude bg-white'
                }`}
              >
                {cat === 'Portfolio' ? 'Antes e Depois' : cat}
              </button>
            );
          })}
        </div>

        {/* Filtro por Status da Publicação */}
        <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-aesthetic-bege/50 shrink-0">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
              filterStatus === 'all' ? 'bg-white text-graphite shadow-2xs font-semibold' : 'text-aesthetic-graphite/60 hover:text-graphite'
            }`}
          >
            Todos ({posts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('published')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
              filterStatus === 'published' ? 'bg-emerald-50 text-emerald-800 shadow-2xs font-semibold' : 'text-aesthetic-graphite/60 hover:text-graphite'
            }`}
          >
            Publicados ({posts.filter(p => p.status === 'published').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('draft')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
              filterStatus === 'draft' ? 'bg-amber-50 text-amber-900 shadow-2xs font-semibold' : 'text-aesthetic-graphite/60 hover:text-graphite'
            }`}
          >
            Rascunhos ({posts.filter(p => p.status === 'draft').length})
          </button>
        </div>
      </div>

      {/* GRID DE CONTEÚDO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPosts.map((item) => {
          const isPhotoCard = Boolean(item.imageUrl || item.image_url);
          const isDraft = item.status === 'draft';
          const displayedImg = item.imageUrl || item.image_url;
          const bodyPreview = item.description || item.content_body || item.contentBody || '';

          if (isPhotoCard) {
            return (
              <div
                key={item.id}
                onClick={() => setSelectedArticle(item)}
                className="group bg-white rounded-[24px] overflow-hidden border border-aesthetic-bege/30 shadow-premium hover:shadow-xl transition-all cursor-pointer flex flex-col relative"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#FAF7F2]">
                  <img
                    src={displayedImg}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    alt={item.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-1.5">
                    <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-3 py-1 rounded-full uppercase text-graphite tracking-wide shadow-xs">
                      {item.category === 'Portfolio' ? 'Portfólio' : item.category}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs backdrop-blur-sm ${
                        isDraft ? 'bg-amber-100/90 text-amber-800' : 'bg-emerald-100/90 text-emerald-800'
                      }`}
                    >
                      {isDraft ? 'Rascunho' : 'Publicado'}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    <button
                      type="button"
                      title={isDraft ? 'Publicar este post' : 'Mudar para rascunho'}
                      onClick={(e) => handleToggleStatus(item.id, item.status, e)}
                      className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-colors"
                    >
                      <Send size={12} />
                    </button>
                    <button
                      type="button"
                      title="Excluir post"
                      onClick={(e) => handleDeletePost(item.id, e)}
                      className="p-1.5 rounded-full bg-black/40 hover:bg-rose-600 backdrop-blur-sm text-white transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-rose-700 font-bold mb-2 uppercase tracking-widest">
                      <Camera size={12} />
                      {item.category}
                    </div>
                    <h3 className="text-lg font-semibold text-graphite leading-tight mb-2 group-hover:text-rose-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-aesthetic-graphite/60 line-clamp-2">
                      {bodyPreview}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-aesthetic-bege/40 flex items-center justify-between text-xs text-aesthetic-graphite/60">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {formatDate(item.createdAt || item.created_at)}
                    </span>
                    <span className="font-semibold text-graphite hover:underline">Ver caso →</span>
                  </div>
                </div>
              </div>
            );
          }

          // Text / Educational Tip Card
          return (
            <div
              key={item.id}
              onClick={() => setSelectedArticle(item)}
              className="group bg-aesthetic-nude/30 rounded-[24px] overflow-hidden border border-aesthetic-bege/30 shadow-premium flex flex-col cursor-pointer hover:shadow-md transition-all relative"
            >
              <div className="p-8 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-[10px] text-rose-700 font-bold uppercase tracking-widest">
                    <BookOpen size={12} />
                    {item.category}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isDraft ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isDraft ? 'Rascunho' : 'Publicado'}
                    </span>
                    <button
                      type="button"
                      title="Excluir post"
                      onClick={(e) => handleDeletePost(item.id, e)}
                      className="text-aesthetic-graphite/40 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-display text-graphite leading-tight mb-4">
                  {item.title}
                </h3>
                <p className="text-sm text-aesthetic-graphite/70 mb-6 flex-1 line-clamp-4">
                  {bodyPreview}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-aesthetic-bege/30">
                  <span className="text-xs font-bold text-graphite border-b border-graphite w-fit pb-1 group-hover:text-rose-700 group-hover:border-rose-700 transition-all tracking-wider">
                    LER CONTEÚDO COMPLETO
                  </span>
                  <span className="text-[11px] text-aesthetic-graphite/50 font-medium">
                    {formatDate(item.createdAt || item.created_at)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-aesthetic-bege/40 max-w-lg mx-auto">
          <BookOpen className="w-12 h-12 text-aesthetic-graphite/30 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-graphite mb-1">Nenhum conteúdo encontrado</h3>
          <p className="text-sm text-aesthetic-graphite/60 mb-4">
            Altere os filtros de status/categoria ou crie uma nova publicação.
          </p>
          <button
            type="button"
            onClick={() => {
              setFilterCategory('Todos');
              setFilterStatus('all');
            }}
            className="px-4 py-2 rounded-full bg-graphite text-white text-xs font-semibold cursor-pointer"
          >
            Limpar Filtros
          </button>
        </div>
      )}

      {/* MODAL: LER CONTEÚDO COMPLETO */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-aesthetic-bege/40 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-aesthetic-bege/40">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                  {selectedArticle.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    selectedArticle.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {selectedArticle.status === 'draft' ? 'Rascunho' : 'Publicado'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-graphite transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {(selectedArticle.imageUrl || selectedArticle.image_url) && (
              <div className="w-full h-64 rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src={selectedArticle.imageUrl || selectedArticle.image_url}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div>
              <h2 className="text-2xl font-serif font-display text-graphite mb-2">
                {selectedArticle.title}
              </h2>
              <div className="text-xs text-aesthetic-graphite/60 flex items-center gap-3 mb-4 flex-wrap">
                <span className="flex items-center gap-1 font-medium">
                  <UserCheck size={14} className="text-rose-700" />
                  {selectedArticle.authorName || 'Corpo Clínico'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 size={14} />
                  {currentOrg.name}
                </span>
                <span>•</span>
                <span>Publicado em {formatDate(selectedArticle.createdAt || selectedArticle.created_at)}</span>
              </div>

              <div className="text-sm text-graphite/80 leading-relaxed space-y-4">
                <p className="font-medium text-graphite">{selectedArticle.description}</p>
                <p>{selectedArticle.content_body || selectedArticle.contentBody || selectedArticle.description}</p>
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-aesthetic-bege/30 text-xs text-graphite/70">
                  <p className="font-semibold text-graphite mb-1">🏛️ Diretrizes da Organização:</p>
                  <p>Conteúdo submetido às políticas de conformidade estética e privacidade da clínica. Id: <code className="text-[10px] font-mono">{selectedArticle.id}</code></p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-aesthetic-bege/40">
              <button
                type="button"
                onClick={(e) => {
                  handleToggleStatus(selectedArticle.id, selectedArticle.status, e);
                  setSelectedArticle({
                    ...selectedArticle,
                    status: selectedArticle.status === 'published' ? 'draft' : 'published',
                  });
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedArticle.status === 'published'
                    ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {selectedArticle.status === 'published' ? 'Mudar para Rascunho' : 'Publicar Agora'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 rounded-full bg-graphite text-white text-xs font-semibold hover:bg-black transition-all cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOVO CONTEÚDO (Schema content_posts) */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-aesthetic-bege/40 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-aesthetic-bege/40">
              <div>
                <h3 className="text-xl font-bold font-serif text-graphite font-display">Novo Conteúdo</h3>
                <p className="text-xs text-aesthetic-graphite/60">Tabela <code>content_posts</code> com RLS por organização</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-graphite transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateContent} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-graphite mb-1">Categoria (category)</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege bg-white focus:outline-none focus:ring-2 focus:ring-graphite/20"
                  >
                    <option value="Dicas">Dicas</option>
                    <option value="Portfolio">Portfolio / Antes e Depois</option>
                    <option value="Novidades">Novidades</option>
                    <option value="Informativos">Informativos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-graphite mb-1">Status inicial</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege bg-white focus:outline-none focus:ring-2 focus:ring-graphite/20"
                  >
                    <option value="published">Publicado (published)</option>
                    <option value="draft">Rascunho (draft)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-graphite mb-1">Título (title) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cuidados essenciais pós-procedimento a laser"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege focus:outline-none focus:ring-2 focus:ring-graphite/20 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-graphite mb-1">Resumo (description)</label>
                <input
                  type="text"
                  placeholder="Breve descrição visível nos cards de listagem..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege focus:outline-none focus:ring-2 focus:ring-graphite/20 text-xs"
                />
              </div>

              {/* IMAGEM E UPLOAD NO STORAGE BUCKET 'contents' */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-graphite text-xs">
                    Imagem da Publicação (storage: contents)
                  </label>
                  <div className="flex items-center gap-1 bg-[#FAF7F2] p-0.5 rounded-lg border border-aesthetic-bege/40 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setUploadMode('upload')}
                      className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                        uploadMode === 'upload'
                          ? 'bg-white text-graphite shadow-2xs font-semibold'
                          : 'text-aesthetic-graphite/60 hover:text-graphite'
                      }`}
                    >
                      Upload Arquivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('url')}
                      className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                        uploadMode === 'url'
                          ? 'bg-white text-graphite shadow-2xs font-semibold'
                          : 'text-aesthetic-graphite/60 hover:text-graphite'
                      }`}
                    >
                      Link URL
                    </button>
                  </div>
                </div>

                {uploadMode === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleProcessFile(e.target.files[0]);
                        }
                      }}
                    />

                    {!newImageUrl ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
                          isDragging
                            ? 'border-graphite bg-[#FAF7F2] scale-[1.01]'
                            : 'border-aesthetic-bege/80 hover:border-graphite/40 bg-[#FAF7F2]/40 hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-white shadow-2xs flex items-center justify-center text-graphite">
                          <UploadCloud size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-graphite">
                            Arraste uma foto ou clique para selecionar
                          </p>
                          <p className="text-[10px] text-aesthetic-graphite/60 mt-0.5">
                            Formatos PNG, JPG, WebP suportados
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                          <Check size={10} />
                          <span>bucket_id: 'contents' • upload seguro por org</span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-aesthetic-bege/60 bg-white p-3 flex items-center gap-3">
                        <img
                          src={newImageUrl}
                          alt="Preview"
                          className="w-14 h-14 object-cover rounded-xl border border-aesthetic-bege/40 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-graphite truncate">
                            {uploadedFileName || 'imagem_selecionada.jpg'}
                          </p>
                          <p className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5">
                            <Check size={11} /> Pronto para gravação em storage.objects ('contents')
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[10px] text-graphite hover:underline font-medium px-2 py-1"
                          >
                            Substituir
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNewImageUrl('');
                              setUploadedFileName('');
                            }}
                            className="p-1 rounded-full text-aesthetic-graphite/50 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newImageUrl}
                      onChange={(e) => {
                        setNewImageUrl(e.target.value);
                        setUploadedFileName('');
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege focus:outline-none focus:ring-2 focus:ring-graphite/20 text-xs"
                    />
                    {newImageUrl && (
                      <div className="mt-2 flex items-center gap-2 p-2 bg-[#FAF7F2] rounded-xl border border-aesthetic-bege/30">
                        <img
                          src={newImageUrl}
                          alt="Preview"
                          className="w-8 h-8 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <span className="text-[10px] text-aesthetic-graphite/70 truncate flex-1">
                          Preview de imagem externa vinculada
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-graphite mb-1">Conteúdo Completo (content_body)</label>
                <textarea
                  rows={4}
                  placeholder="Texto aprofundado, protocolos recomendados ou detalhes do portfólio..."
                  value={newContentBody}
                  onChange={(e) => setNewContentBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege focus:outline-none focus:ring-2 focus:ring-graphite/20 resize-none text-xs"
                />
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-aesthetic-bege/30 flex items-center justify-between text-[11px] text-aesthetic-graphite/70">
                <span>Org: <strong>{currentOrg.name}</strong></span>
                <span>Autor: <strong>{currentProfile.name}</strong></span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-aesthetic-bege/40">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-aesthetic-bege text-graphite font-semibold hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-graphite text-white font-semibold hover:bg-black shadow-md cursor-pointer"
                >
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { Contents as ContentsView };
export default Contents;
