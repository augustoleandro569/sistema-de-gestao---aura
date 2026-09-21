// src/modules/business/MarketingManager.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Eye,
  MousePointer2,
  Users,
  Share2,
  Sparkles,
  TrendingUp,
  X,
  Check,
  Calendar,
  Tag,
  Building2,
  SlidersHorizontal,
  DollarSign,
  ArrowUpRight,
  Trash2,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Flame,
  Percent,
  MessageSquare
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { useBusiness } from '../../core/BusinessContext';
import { useLayout } from '../../layouts/LayoutContext';
import { ContentPost, Service, Unit } from '../../types';

// Componente de Card de Métrica Executiva
interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  subtitle?: string;
  isPositive?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  subtitle,
  isPositive = true,
}) => (
  <div className="bg-white rounded-[32px] p-6 border border-aura-linen shadow-luminous flex flex-col justify-between hover:shadow-soft-glow transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <span className="text-xs font-bold uppercase tracking-wider text-aura-taupe">{title}</span>
      <div className="w-10 h-10 rounded-2xl bg-aura-linen/60 text-aura-charcoal flex items-center justify-center">
        {icon}
      </div>
    </div>
    <div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-aura-charcoal">{value}</h3>
        {change && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : 'bg-rose-50 text-rose-700 border border-rose-200/60'
            }`}
          >
            <TrendingUp size={11} />
            {change}
          </span>
        )}
      </div>
      {subtitle && <p className="text-[11px] text-aura-taupe mt-1">{subtitle}</p>}
    </div>
  </div>
);

export const MarketingManager: React.FC = () => {
  const { currentBusiness, setPublicProfileSlug } = useBusiness();
  const { setCurrentTab } = useLayout();

  // Estados locais
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'Portfolio' | 'Promoções' | 'Dicas'>('all');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [selectedPostDetail, setSelectedPostDetail] = useState<ContentPost | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  // Listas de Serviços e Unidades da Clínica
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);

  // Campos da Ficha de Conversão (Novo Post)
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formContentBody, setFormContentBody] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formCategory, setFormCategory] = useState<'Portfolio' | 'Promoções' | 'Dicas'>('Portfolio');
  const [formMarketplaceTag, setFormMarketplaceTag] = useState<'Antes e Depois' | 'Dica' | 'Promoção'>('Antes e Depois');
  const [formLinkedServiceId, setFormLinkedServiceId] = useState<string>('');
  const [formUnitId, setFormUnitId] = useState<string>('');
  const [formDiscountPercent, setFormDiscountPercent] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Presets de Imagens de Alta Resolução Estética para Testes Rápidos
  const aestheticPresets = [
    {
      title: 'Glow Facial',
      url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Microinfusão',
      url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Labial Natural',
      url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Drenagem Corporal',
      url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // Carregar dados reativos
  const loadData = () => {
    const allPosts = dataService.getContentPosts();
    // Filtra posts prioritários da organização ativa ou gera lista abrangente
    setPosts(allPosts);
    setAvailableServices(dataService.getServices());
    setAvailableUnits(dataService.getUnits().filter(u => u.status === 'active'));
  };

  useEffect(() => {
    loadData();
    const unsub = dataService.subscribe(() => {
      loadData();
      setVersion(v => v + 1);
    });
    return unsub;
  }, []);

  // Preenche serviço e unidade padrão ao abrir o modal
  useEffect(() => {
    if (availableServices.length > 0 && !formLinkedServiceId) {
      setFormLinkedServiceId(availableServices[0].id);
    }
    if (availableUnits.length > 0 && !formUnitId) {
      setFormUnitId(availableUnits[0].id);
    }
  }, [availableServices, availableUnits, formLinkedServiceId, formUnitId]);

  // Métricas agregadas da clínica no Marketplace
  const metrics = useMemo(() => {
    const totalViews = posts.reduce((sum, p) => sum + (p.viewsCount || 1400), 0);
    const totalClicks = posts.reduce((sum, p) => sum + (p.clicksCount || 65), 0);
    const totalFollowers = posts.reduce((sum, p) => sum + (p.followersGained || 16), 0);
    const engagementRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '4.8';
    const totalRoi = posts.reduce((sum, p) => sum + (p.roiEstimated || (p.clicksCount || 40) * 35), 0);

    return {
      totalViews: totalViews.toLocaleString('pt-BR'),
      totalClicks: totalClicks.toLocaleString('pt-BR'),
      totalFollowers: totalFollowers.toLocaleString('pt-BR'),
      engagementRate: `${engagementRate}%`,
      totalRoi: `R$ ${totalRoi.toLocaleString('pt-BR')}`,
    };
  }, [posts, version]);

  // Posts filtrados por categoria na grid
  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') return posts;
    if (activeFilter === 'Promoções') {
      return posts.filter(p => p.category === 'Promoções' || (p.promoDiscountPercent && p.promoDiscountPercent > 0));
    }
    return posts.filter(p => p.category === activeFilter);
  }, [posts, activeFilter, version]);

  // Manipulação de Upload de Imagem (Leitura Local com Preview)
  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  // Salvar Novo Post com Ficha de Conversão Completa
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Informe o título da publicação.');
      return;
    }

    const selectedService = availableServices.find(s => s.id === formLinkedServiceId);
    const selectedUnit = availableUnits.find(u => u.id === formUnitId);

    const fallbackImg = aestheticPresets[0].url;

    setIsSubmitting(true);

    try {
      const created = dataService.createContentPost({
        title: formTitle,
        description: formDescription,
        contentBody: formContentBody || formDescription,
        imageUrl: formImageUrl || fallbackImg,
        category: formCategory,
        status: 'published',
        linkedServiceId: formLinkedServiceId || undefined,
        linkedServiceName: selectedService?.name || undefined,
        promoDiscountPercent: formDiscountPercent > 0 ? formDiscountPercent : undefined,
        unitId: formUnitId || undefined,
        unitName: selectedUnit?.name || undefined,
        marketplaceTag: formMarketplaceTag,
        viewsCount: Math.floor(Math.random() * 200 + 450),
        clicksCount: Math.floor(Math.random() * 30 + 15),
        followersGained: Math.floor(Math.random() * 8 + 3),
        roiEstimated: (selectedService?.price || 250) * (formDiscountPercent > 0 ? (1 - formDiscountPercent / 100) : 1) * 3,
      });

      // Feedback visual elegante
      setNotification(`Publicação "${created.title}" ativada no Aura App!`);
      setTimeout(() => setNotification(null), 4000);

      // Limpa formulário
      setFormTitle('');
      setFormDescription('');
      setFormContentBody('');
      setFormImageUrl('');
      setFormDiscountPercent(0);
      setIsNewPostModalOpen(false);
    } catch (err) {
      console.error('Erro ao criar publicação:', err);
      alert('Não foi possível publicar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Excluir Post
  const handleDeletePost = (id: string) => {
    if (window.confirm('Deseja realmente desativar esta publicação do Marketplace?')) {
      dataService.deleteContentPost(id);
      setSelectedPostDetail(null);
      setNotification('Publicação removida do feed com sucesso.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Compartilhar Post
  const handleSharePost = (post: ContentPost) => {
    const url = `${window.location.origin}/app/explorar`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setNotification('Link do procedimento copiado para a área de transferência!');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24 font-sans text-aura-charcoal">
      
      {/* HEADER LIMPO: FOCO EM MARKETING E CRESCIMENTO */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.3em]">Aura Growth & Marketplace</p>
          <h1 className="text-3xl sm:text-4xl font-serif text-aura-charcoal">Marketing & Presença Digital</h1>
          <p className="text-sm text-aura-taupe max-w-2xl">
            Gerencie sua vitrine e acompanhe como seu conteúdo impacta o agendamento direto no Aura App.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setCurrentTab('whatsapp');
            }}
            className="h-12 px-5 bg-white border border-aura-linen rounded-full text-xs font-bold tracking-wider text-aura-charcoal hover:bg-aura-linen transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <MessageSquare size={15} className="text-emerald-600" />
            <span>Automação WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentTab('vitrine');
            }}
            className="h-12 px-5 bg-white border border-aura-linen rounded-full text-xs font-bold tracking-wider text-aura-charcoal hover:bg-aura-linen transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <ExternalLink size={15} />
            <span>Ver Vitrine Pública</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewPostModalOpen(true)}
            className="h-12 px-8 bg-aura-charcoal text-white rounded-full text-xs font-bold tracking-widest hover:bg-black hover:shadow-soft-glow active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Plus size={18} />
            <span>NOVA PUBLICAÇÃO</span>
          </button>
        </div>
      </header>

      {/* NOTIFICAÇÃO TOAST */}
      {notification && (
        <div className="max-w-md mx-auto">
          <div className="bg-aura-charcoal text-white px-5 py-3 rounded-full text-xs font-medium shadow-2xl flex items-center justify-center gap-2 border border-white/20 animate-in fade-in zoom-in-95">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* 2. MÉTRICAS DE PERFORMANCE NO MARKETPLACE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Visualizações no Feed"
          value={metrics.totalViews}
          change="+15%"
          icon={<Eye size={20} />}
          subtitle="Consumidoras impactadas nos últimos 30 dias"
        />
        <MetricCard
          title="Cliques em Agendar"
          value={metrics.totalClicks}
          change="+8%"
          icon={<MousePointer2 size={20} />}
          subtitle="Leads direcionados direto para a sua agenda"
        />
        <MetricCard
          title="Novos Seguidores"
          value={metrics.totalFollowers}
          change="+12%"
          icon={<Users size={20} />}
          subtitle="Clientes acompanhando novidades da clínica"
        />
        <MetricCard
          title="Engajamento Real"
          value={metrics.engagementRate}
          icon={<Sparkles size={20} />}
          subtitle="Taxa média de conversão visual em clique"
        />
      </div>

      {/* 3. GESTÃO DE CONTEÚDO (GRID DE POSTS) */}
      <section className="bg-white rounded-[48px] p-6 sm:p-10 shadow-luminous border border-aura-linen space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-aura-linen/60 pb-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-aura-charcoal">
              Publicações Ativas no Marketplace
            </h2>
            <p className="text-xs text-aura-taupe mt-0.5">
              Fotos que alimentam o feed de descoberta e o perfil da clínica no Aura App.
            </p>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex gap-2 bg-aura-linen/40 p-1.5 rounded-2xl border border-aura-linen">
            {(['all', 'Portfolio', 'Promoções', 'Dicas'] as const).map((cat) => {
              const label = cat === 'all' ? 'Todos' : cat;
              const isSelected = activeFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-aura-charcoal text-white shadow-xs'
                      : 'text-aura-taupe hover:text-aura-charcoal'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de Conteúdo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* BOTÃO ADICIONAR (SLOT VAZIO / FIRST ACTION) */}
          <button
            type="button"
            onClick={() => setIsNewPostModalOpen(true)}
            className="aspect-[4/5] border-2 border-dashed border-aura-linen rounded-[32px] flex flex-col items-center justify-center gap-4 text-aura-taupe hover:border-aura-rose hover:text-aura-charcoal hover:bg-aura-pearl/50 transition-all cursor-pointer group p-6 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-aura-linen/70 group-hover:bg-aura-rose/20 text-aura-charcoal flex items-center justify-center transition-colors">
              <ImageIcon size={26} className="text-aura-charcoal group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest block text-aura-charcoal">
                Adicionar Resultado
              </span>
              <span className="text-[10px] text-aura-taupe mt-1 block">
                Vincule foto a um serviço da agenda
              </span>
            </div>
          </button>

          {/* LISTA DE POSTS ATIVOS */}
          {filteredPosts.map((post) => {
            const views = post.viewsCount || 1840;
            const clicks = post.clicksCount || 42;
            const tagLabel = post.marketplaceTag || (post.category === 'Portfolio' ? 'Antes e Depois' : post.category);

            return (
              <div
                key={post.id}
                onClick={() => setSelectedPostDetail(post)}
                className="group relative aspect-[4/5] bg-aura-pearl rounded-[32px] overflow-hidden border border-aura-linen transition-all duration-300 hover:shadow-soft-glow hover:-translate-y-1 cursor-pointer"
              >
                {/* Imagem do Procedimento */}
                <img
                  src={post.imageUrl || aestheticPresets[0].url}
                  alt={post.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />

                {/* Badge de Tag Superior */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-wider text-aura-charcoal shadow-xs border border-white/50">
                    {tagLabel}
                  </span>
                  {post.promoDiscountPercent && post.promoDiscountPercent > 0 && (
                    <span className="px-2.5 py-1 bg-rose-500 text-white rounded-full text-[9px] font-bold tracking-wide shadow-xs flex items-center gap-1">
                      <Percent size={10} />
                      {post.promoDiscountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Overlay de Status & Métricas (Visão Lojista) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-aura-rose mb-1 truncate">
                    {post.linkedServiceName || post.title}
                  </p>
                  <h4 className="text-sm font-serif font-bold text-white leading-snug line-clamp-1 mb-3">
                    {post.title}
                  </h4>

                  <div className="flex justify-between items-center pt-2 border-t border-white/20">
                    <div className="flex gap-4 items-center">
                      <span
                        className="flex items-center gap-1 text-[10px] font-bold text-white/90"
                        title="Visualizações no Marketplace"
                      >
                        <Eye size={13} className="text-white/70" />
                        {views > 1000 ? `${(views / 1000).toFixed(1)}k` : views}
                      </span>
                      <span
                        className="flex items-center gap-1 text-[10px] font-bold text-emerald-300"
                        title="Cliques no botão Agendar"
                      >
                        <MousePointer2 size={13} />
                        {clicks}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSharePost(post);
                      }}
                      className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 active:scale-95 transition-all text-white cursor-pointer"
                      title="Copiar link"
                    >
                      <Share2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MODAL: FICHA DE CONVERSÃO (Onde a Mágica Acontece) */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] max-w-2xl w-full p-6 sm:p-10 shadow-2xl border border-aura-linen my-8 space-y-6">
            
            {/* Header da Ficha */}
            <div className="flex justify-between items-start border-b border-aura-linen pb-4">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-aura-rose">
                  <Sparkles size={14} />
                  <span>Ficha de Conversão de Conteúdo</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-aura-charcoal mt-1">
                  Criar Nova Publicação no Aura App
                </h3>
                <p className="text-xs text-aura-taupe mt-0.5">
                  Vincule a mídia a um serviço específico da agenda para ativar o botão &quot;Agendar Agora&quot;.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                className="w-9 h-9 rounded-full bg-aura-linen flex items-center justify-center text-aura-charcoal hover:bg-aura-charcoal hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-6">
              
              {/* 1. Mídia / Upload da Foto */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-aura-charcoal block uppercase tracking-wider">
                  1. Mídia do Procedimento (Foto ou Resultado)
                </label>

                {formImageUrl ? (
                  <div className="relative aspect-video max-h-56 rounded-2xl overflow-hidden border border-aura-linen bg-aura-pearl group">
                    <img src={formImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormImageUrl('')}
                      className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`aspect-video max-h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 p-6 cursor-pointer transition-all text-center ${
                      isDragging
                        ? 'border-aura-charcoal bg-aura-linen/40'
                        : 'border-aura-linen hover:border-aura-taupe bg-aura-pearl/30'
                    }`}
                  >
                    <UploadCloud size={32} className="text-aura-taupe" />
                    <p className="text-xs font-bold text-aura-charcoal">
                      Arraste uma foto aqui ou clique para selecionar
                    </p>
                    <p className="text-[11px] text-aura-taupe">Formatos aceitos: JPG, PNG ou WebP</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleProcessFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {/* Presets Rápidos de Fotos Estéticas */}
                {!formImageUrl && (
                  <div className="pt-2">
                    <span className="text-[10px] text-aura-taupe uppercase font-bold tracking-wider block mb-2">
                      Ou selecione uma foto de exemplo da curadoria:
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {aestheticPresets.map((preset) => (
                        <button
                          key={preset.title}
                          type="button"
                          onClick={() => setFormImageUrl(preset.url)}
                          className="h-16 rounded-xl overflow-hidden relative border border-aura-linen group cursor-pointer"
                        >
                          <img src={preset.url} alt={preset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1">
                            <span className="text-[9px] font-bold text-white truncate">{preset.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Título & Legenda */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-aura-charcoal block">Título da Publicação</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ex: Transformação Facial Glow & Revitalização Labial"
                    className="w-full bg-aura-linen/30 border border-aura-linen rounded-2xl px-4 py-3 text-xs text-aura-charcoal placeholder:text-aura-charcoal/40 font-medium outline-hidden focus:border-aura-charcoal transition-colors"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-aura-charcoal block">Legenda / Explicação do Protocolo</label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Descreva a técnica aplicada, produtos utilizados e os benefícios que a paciente sentirá..."
                    className="w-full bg-aura-linen/30 border border-aura-linen rounded-2xl px-4 py-3 text-xs text-aura-charcoal placeholder:text-aura-charcoal/40 font-medium outline-hidden focus:border-aura-charcoal transition-colors resize-none"
                  />
                </div>
              </div>

              {/* 3. A INTELIGÊNCIA DE VÍNCULO (Conversão em Agendamento) */}
              <div className="bg-aura-pearl p-5 rounded-3xl border border-aura-linen space-y-4">
                <div className="flex items-center gap-2">
                  <MousePointer2 size={16} className="text-aura-rose" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-aura-charcoal">
                    Inteligência de Vínculo com a Agenda
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Serviço Vinculado */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-aura-charcoal flex items-center gap-1">
                      <span>Serviço Vinculado</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formLinkedServiceId}
                      onChange={(e) => setFormLinkedServiceId(e.target.value)}
                      className="w-full bg-white border border-aura-linen rounded-2xl px-3.5 py-3 text-xs text-aura-charcoal font-medium outline-hidden focus:border-aura-charcoal transition-colors cursor-pointer"
                    >
                      {availableServices.map((srv) => (
                        <option key={srv.id} value={srv.id}>
                          {srv.name} (R$ {srv.price})
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-aura-taupe block">
                      Ao tocar em &quot;Agendar&quot;, este serviço será selecionado.
                    </span>
                  </div>

                  {/* Localização / Unidade */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-aura-charcoal flex items-center gap-1">
                      <Building2 size={13} />
                      <span>Unidade / Localização</span>
                    </label>
                    <select
                      value={formUnitId}
                      onChange={(e) => setFormUnitId(e.target.value)}
                      className="w-full bg-white border border-aura-linen rounded-2xl px-3.5 py-3 text-xs text-aura-charcoal font-medium outline-hidden focus:border-aura-charcoal transition-colors cursor-pointer"
                    >
                      {availableUnits.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-aura-taupe block">
                      Exibirá a distância para as clientes no mapa.
                    </span>
                  </div>

                  {/* Tag de Marketplace */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-aura-charcoal flex items-center gap-1">
                      <Tag size={13} />
                      <span>Tag de Marketplace</span>
                    </label>
                    <select
                      value={formMarketplaceTag}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setFormMarketplaceTag(val);
                        if (val === 'Antes e Depois') setFormCategory('Portfolio');
                        else if (val === 'Promoção') setFormCategory('Promoções');
                        else setFormCategory('Dicas');
                      }}
                      className="w-full bg-white border border-aura-linen rounded-2xl px-3.5 py-3 text-xs text-aura-charcoal font-medium outline-hidden focus:border-aura-charcoal transition-colors cursor-pointer"
                    >
                      <option value="Antes e Depois">Antes e Depois (Portfólio Real)</option>
                      <option value="Dica">Dica de Especialista</option>
                      <option value="Promoção">Promoção por Tempo Limitado</option>
                    </select>
                  </div>

                  {/* Desconto Promocional (Opcional) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-aura-charcoal flex items-center gap-1">
                      <Percent size={13} />
                      <span>Desconto Promocional (% OFF)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={formDiscountPercent || ''}
                      onChange={(e) => setFormDiscountPercent(Number(e.target.value))}
                      placeholder="Ex: 15 (opcional)"
                      className="w-full bg-white border border-aura-linen rounded-2xl px-4 py-3 text-xs text-aura-charcoal placeholder:text-aura-charcoal/40 font-medium outline-hidden focus:border-aura-charcoal transition-colors"
                    />
                    <span className="text-[10px] text-aura-taupe block">
                      Ativa o selo de destaque no feed do consumidor.
                    </span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="flex-1 py-3.5 rounded-full border border-aura-linen text-xs font-bold text-aura-taupe hover:bg-aura-linen transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-full bg-aura-charcoal text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  <span>{isSubmitting ? 'Publicando...' : 'Publicar no Aura App'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: DETALHES DO POST & ROI (Ativo de Negócio da Lojista) */}
      {selectedPostDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-aura-linen space-y-6">
            <div className="flex justify-between items-start border-b border-aura-linen pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-aura-rose">
                  Ativo de Negócio • Marketplace
                </span>
                <h3 className="text-lg font-serif font-bold text-aura-charcoal mt-1 line-clamp-1">
                  {selectedPostDetail.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPostDetail(null)}
                className="w-8 h-8 rounded-full bg-aura-linen flex items-center justify-center text-aura-charcoal hover:bg-aura-charcoal hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Prévia da Foto */}
            <div className="aspect-video rounded-2xl overflow-hidden border border-aura-linen relative">
              <img
                src={selectedPostDetail.imageUrl || aestheticPresets[0].url}
                alt={selectedPostDetail.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase text-white tracking-wider">
                {selectedPostDetail.marketplaceTag || selectedPostDetail.category}
              </div>
            </div>

            {/* Painel de ROI e Conversão */}
            <div className="grid grid-cols-3 gap-2 bg-aura-pearl p-4 rounded-2xl border border-aura-linen text-center">
              <div>
                <span className="text-[10px] text-aura-taupe uppercase font-bold block">Visualizações</span>
                <span className="text-base font-bold text-aura-charcoal">
                  {selectedPostDetail.viewsCount?.toLocaleString('pt-BR') || '2.480'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-aura-taupe uppercase font-bold block">Cliques Agendar</span>
                <span className="text-base font-bold text-emerald-700">
                  {selectedPostDetail.clicksCount || '85'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-aura-taupe uppercase font-bold block">ROI Estimado</span>
                <span className="text-base font-bold text-aura-rose">
                  R$ {selectedPostDetail.roiEstimated?.toLocaleString('pt-BR') || '1.850'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-aura-taupe">
              <p>
                <strong>Serviço:</strong> {selectedPostDetail.linkedServiceName || 'Geral / Consulta'}
              </p>
              <p>
                <strong>Unidade:</strong> {selectedPostDetail.unitName || 'Todas as Unidades'}
              </p>
              <p className="line-clamp-2 italic">
                &quot;{selectedPostDetail.description || selectedPostDetail.title}&quot;
              </p>
            </div>

            {/* Ações */}
            <div className="flex gap-2 pt-2 border-t border-aura-linen">
              <button
                type="button"
                onClick={() => handleDeletePost(selectedPostDetail.id)}
                className="p-3 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Desativar publicação"
              >
                <Trash2 size={16} />
              </button>

              <button
                type="button"
                onClick={() => {
                  handleSharePost(selectedPostDetail);
                }}
                className="flex-1 py-3 bg-white border border-aura-linen rounded-2xl text-xs font-bold text-aura-charcoal hover:bg-aura-linen transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Share2 size={14} />
                <span>Compartilhar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPostDetail(null);
                  setCurrentTab('vitrine');
                }}
                className="flex-1 py-3 bg-aura-charcoal text-white rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Eye size={14} />
                <span>Ver no Feed</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MarketingManager;
