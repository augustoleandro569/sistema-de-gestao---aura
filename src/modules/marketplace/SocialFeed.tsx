// src/modules/marketplace/SocialFeed.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { AuraLogoV3 } from '../../components/ui/AuraLogoV3';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Calendar,
  MapPin,
  Share2,
  Home as HomeIcon,
  Sparkles,
  User,
  CheckCircle2,
  Send,
  X,
  Store,
  ChevronRight,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../core/BusinessContext';
import { useLayout } from '../../layouts/LayoutContext';
import { BookingModal } from '../../components/marketplace/BookingModal';
import { ContentPost } from '../../types';

export interface SocialFeedProps {
  onBookService?: (businessId: string, serviceName?: string, serviceId?: string) => void;
  onViewClinic?: (businessSlug: string) => void;
  hideBottomNav?: boolean;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({
  onBookService,
  onViewClinic,
  hideBottomNav = false,
}) => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { setPublicProfileSlug } = useBusiness();
  const { setCurrentTab, openNewAppointment } = useLayout();

  const profileId = userProfile?.id || 'profile-client-01';

  // Estados de navegação e filtros
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [bookModalState, setBookModalState] = useState<{
    isOpen: boolean;
    businessId: string;
    serviceName?: string;
  }>({
    isOpen: false,
    businessId: 'biz-01',
  });
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});
  const [savedPosts, setSavedPosts] = useState<{ [postId: string]: boolean }>({});
  const [expandedText, setExpandedText] = useState<{ [postId: string]: boolean }>({});
  const [version, setVersion] = useState(0);

  // Escuta atualizações do dataService (curtidas, novos posts de marketing do Aura Business, etc.)
  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setVersion(v => v + 1);
    });
    return unsub;
  }, []);

  const storyCategories = [
    { id: 'Novidades', label: 'Novidades', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80' },
    { id: 'Promoções', label: 'Promoções', img: 'https://images.unsplash.com/photo-1512290900672-1f41d9c1543b?auto=format&fit=crop&w=400&q=80' },
    { id: 'Limpeza de Pele', label: 'Limpeza de Pele', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80' },
    { id: 'Cílios', label: 'Cílios', img: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=400&q=80' },
    { id: 'Massagem', label: 'Massagem', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80' },
  ];

  // Feed de posts integrados com Aura Business
  const rawPosts = useMemo(() => {
    const list = dataService.getMarketplaceFeed({ profileId });
    if (list && list.length > 0) return list;

    // Fallback de alta fidelidade Luminous Luxury caso inicial
    const businesses = dataService.getAllBusinesses();
    const b1 = businesses[0] || { id: 'biz-01', name: 'Sublime Estética', slug: 'sublime-estetica' };
    const b2 = businesses[1] || { id: 'biz-02', name: 'Clínica L\'Élixir', slug: 'clinica-lelixir' };

    return [
      {
        id: 'post-luxury-01',
        organizationId: b1.id,
        businessId: b1.id,
        businessName: 'Sublime Estética',
        businessSlug: b1.slug,
        title: 'Limpeza de Pele Profunda ✨',
        description:
          'O segredo para uma pele de porcelana está na extração correta por sucção ultrassônica e na hidratação balanceada com ácido hialurônico de baixo peso molecular.',
        imageUrl:
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1080&q=85',
        category: 'Limpeza de Pele',
        status: 'published' as const,
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        linkedServiceName: 'Limpeza de Pele Profunda ✨',
        viewsCount: 1420,
        clicksCount: 124,
      },
      {
        id: 'post-luxury-02',
        organizationId: b2.id,
        businessId: b2.id,
        businessName: 'Clínica L\'Élixir',
        businessSlug: b2.slug,
        title: 'Preenchimento Labial Russo & Definição',
        description:
          'Resultados sutis que valorizam o contorno natural sem exageros. Protocolo desenvolvido com cânula atraumática e anestesia tópica de alto conforto.',
        imageUrl:
          'https://images.unsplash.com/photo-1512290900672-1f41d9c1543b?auto=format&fit=crop&w=1080&q=85',
        category: 'Facial',
        status: 'published' as const,
        createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        linkedServiceName: 'Preenchimento Labial',
        viewsCount: 2980,
        clicksCount: 289,
      },
    ] as ContentPost[];
  }, [profileId, version]);

  // Filtro por Story/Categoria selecionada
  const filteredPosts = useMemo(() => {
    if (!selectedStory) return rawPosts;
    return rawPosts.filter(p => {
      const matchCat = p.category?.toLowerCase().includes(selectedStory.toLowerCase());
      const matchTitle = p.title?.toLowerCase().includes(selectedStory.toLowerCase());
      const matchDesc = p.description?.toLowerCase().includes(selectedStory.toLowerCase());
      return matchCat || matchTitle || matchDesc;
    });
  }, [rawPosts, selectedStory]);

  const followedIds = useMemo(() => {
    return dataService.getFollowedBusinessIds(profileId);
  }, [profileId, version]);

  const handleToggleLike = (postId: string) => {
    dataService.togglePostLike(profileId, postId);
    setVersion(v => v + 1);
  };

  const handleToggleFollow = (bizId: string) => {
    dataService.toggleFollowBusiness(bizId, profileId);
    setVersion(v => v + 1);
  };

  const handleShare = (post: ContentPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `${post.businessName} no Aura: ${post.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedPostId(post.id);
      setTimeout(() => setCopiedPostId(null), 2500);
    }
  };

  const handleBook = (businessId: string, serviceName?: string, serviceId?: string) => {
    if (onBookService) {
      onBookService(businessId, serviceName, serviceId);
    } else {
      setBookModalState({
        isOpen: true,
        businessId,
        serviceName,
      });
    }
  };

  const handleNavigateClinic = (slug?: string) => {
    if (!slug) return;
    if (onViewClinic) {
      onViewClinic(slug);
    } else {
      setPublicProfileSlug(slug);
      navigate(`/perfil/${slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-aura-pearl pb-28 selection:bg-aura-rose/30 selection:text-aura-charcoal">
      {/* HEADER FIXO COM A NOVA LOGO INTERATIVA */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-aura-linen px-4 sm:px-8 py-3.5 flex justify-between items-center shadow-xs transition-all">
        <AuraLogoV3 size="sm" variant="app" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

        <div className="flex items-center gap-3">
          {/* Indicador de Geolocalização de Luxo */}
          <div
            onClick={() => navigate('/app/mapa')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-aura-linen/60 rounded-full border border-aura-rose/20 cursor-pointer hover:bg-white hover:border-aura-rose transition-all shadow-2xs"
          >
            <MapPin size={13} className="text-aura-rose shrink-0" />
            <span className="text-[10px] font-bold text-aura-charcoal uppercase tracking-widest">
              Jardins, SP
            </span>
          </div>

          {/* Avatar do Usuário Conectado */}
          <div
            onClick={() => navigate('/app/perfil')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-aura-rose/20 cursor-pointer hover:scale-105 active:scale-95 transition-all flex items-center justify-center font-bold text-xs text-aura-charcoal"
          >
            {userProfile?.avatar ? (
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{userProfile?.name?.charAt(0) || 'A'}</span>
            )}
          </div>
        </div>
      </header>

      {/* FEED DE HISTÓRIAS / DESTAQUES RÁPIDOS */}
      <section className="px-4 sm:px-6 py-6 sm:py-8 flex gap-5 sm:gap-6 overflow-x-auto scrollbar-hide">
        {storyCategories.map((cat, i) => {
          const isSelected = selectedStory === cat.id;
          return (
            <div
              key={i}
              onClick={() => setSelectedStory(isSelected ? null : cat.id)}
              className="flex flex-col items-center gap-2.5 shrink-0 group cursor-pointer"
            >
              <div
                className={`w-16 h-16 rounded-[24px] p-1 transition-all duration-300 group-hover:rotate-6 ${
                  isSelected
                    ? 'border-2 border-aura-charcoal ring-2 ring-aura-rose/40'
                    : 'border-2 border-aura-rose/60 hover:border-aura-rose'
                }`}
              >
                <div className="w-full h-full bg-aura-linen rounded-[18px] overflow-hidden shadow-inner">
                  <img
                    src={cat.img}
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <span
                className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${
                  isSelected ? 'text-aura-charcoal' : 'text-aura-taupe group-hover:text-aura-charcoal'
                }`}
              >
                {cat.label}
              </span>
            </div>
          );
        })}
      </section>

      {/* TIMELINE DE CONTEÚDO */}
      <main className="max-w-xl mx-auto px-4 space-y-8 sm:space-y-12">
        {selectedStory && (
          <div className="flex items-center justify-between px-3 py-2 bg-white/70 backdrop-blur-md rounded-2xl border border-aura-linen text-xs text-aura-charcoal">
            <span className="font-medium text-[11px]">
              Filtrando por: <strong>{selectedStory}</strong>
            </span>
            <button
              onClick={() => setSelectedStory(null)}
              className="text-[10px] font-bold uppercase text-aura-rose hover:underline cursor-pointer"
            >
              Limpar filtro
            </button>
          </div>
        )}

        {filteredPosts.map(post => {
          const bizId = post.businessId || post.organizationId;
          const isFollowing = followedIds.includes(bizId);
          const likeStatus = dataService.getPostLikeStatus(profileId, post.id);
          const isLiked = likeStatus.liked;
          const likesCount = likeStatus.count;
          const isSaved = !!savedPosts[post.id];
          const isTextExpanded = !!expandedText[post.id];

          return (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="bg-white rounded-[44px] sm:rounded-[48px] border border-aura-linen shadow-luminous overflow-hidden group transition-all"
            >
              {/* Topo do Post: Clínica & Relação Social */}
              <div className="p-5 sm:p-6 flex justify-between items-center">
                <div
                  onClick={() => handleNavigateClinic(post.businessSlug)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-2xl bg-aura-rose/10 flex items-center justify-center p-0.5 border border-aura-rose/20 overflow-hidden">
                    {post.businessLogo ? (
                      <img
                        src={post.businessLogo}
                        alt={post.businessName}
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#FAF5EB] rounded-[14px] flex items-center justify-center font-serif font-bold text-xs text-[#C5A059]">
                        {post.businessName?.charAt(0) || 'A'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-aura-charcoal hover:text-aura-rose transition-colors">
                      {post.businessName || 'Sublime Estética'}
                    </h4>
                    <p className="text-[10px] text-aura-taupe font-medium uppercase tracking-tight">
                      Há 2 horas • Jardins
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleFollow(bizId)}
                  className={`text-[10px] font-bold px-4 py-1.5 rounded-full uppercase transition-all cursor-pointer ${
                    isFollowing
                      ? 'text-aura-rose bg-aura-rose/10 hover:bg-aura-rose hover:text-white'
                      : 'text-white bg-aura-charcoal hover:bg-black'
                  }`}
                >
                  {isFollowing ? 'Seguindo' : '+ Seguir'}
                </button>
              </div>

              {/* Mídia Principal com Smart Service Overlay */}
              <div className="relative aspect-square bg-aura-linen overflow-hidden">
                <img
                  src={
                    post.imageUrl ||
                    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1080&q=85'
                  }
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Overlay Inteligente de Serviço (Aura Sync: Conversão Silenciosa) */}
                <div className="absolute bottom-6 sm:bottom-8 left-4 sm:left-6 right-4 sm:right-6">
                  <div className="bg-white/55 backdrop-blur-2xl border border-white/40 rounded-[28px] sm:rounded-[32px] p-4 sm:p-5 flex justify-between items-center shadow-2xl transition-all hover:bg-white/70">
                    <div className="pr-2">
                      <p className="text-[9px] sm:text-[10px] font-bold text-aura-charcoal uppercase tracking-widest opacity-70">
                        Procedimento do Post
                      </p>
                      <p className="text-xs sm:text-sm font-serif text-aura-charcoal font-bold truncate max-w-[200px] sm:max-w-none">
                        {post.linkedServiceName || post.title}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleBook(
                          bizId,
                          post.linkedServiceName || post.title,
                          post.linkedServiceId
                        )
                      }
                      className="bg-aura-charcoal text-white px-5 sm:px-6 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-black active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
                    >
                      <Calendar size={13} className="text-aura-rose" /> Agendar
                    </button>
                  </div>
                </div>
              </div>

              {/* Rodapé Social com Métricas Reais */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-5 sm:gap-6 text-aura-charcoal">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className="hover:text-aura-rose transition-colors cursor-pointer group/heart active:scale-125"
                    aria-label="Curtir post"
                  >
                    <Heart
                      size={24}
                      strokeWidth={1.5}
                      className={
                        isLiked
                          ? 'fill-rose-500 text-rose-500 scale-110'
                          : 'group-hover/heart:text-aura-rose'
                      }
                    />
                  </button>

                  <button
                    onClick={() =>
                      setExpandedCommentsPostId(
                        expandedCommentsPostId === post.id ? null : post.id
                      )
                    }
                    className="hover:text-aura-rose transition-colors cursor-pointer"
                    aria-label="Comentários"
                  >
                    <MessageCircle size={24} strokeWidth={1.5} />
                  </button>

                  <button
                    onClick={() => handleShare(post)}
                    className="hover:text-aura-rose transition-colors cursor-pointer relative"
                    aria-label="Compartilhar"
                  >
                    <Share2 size={24} strokeWidth={1.5} />
                    {copiedPostId === post.id && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-aura-charcoal text-white text-[9px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                        Link copiado!
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      setSavedPosts(prev => ({ ...prev, [post.id]: !isSaved }))
                    }
                    className="ml-auto hover:text-aura-rose transition-colors cursor-pointer"
                    aria-label="Salvar na coleção"
                  >
                    <Bookmark
                      size={24}
                      strokeWidth={1.5}
                      className={isSaved ? 'fill-aura-charcoal text-aura-charcoal' : ''}
                    />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-aura-charcoal">
                    {likesCount} curtidas
                  </p>

                  <p className="text-xs sm:text-sm text-aura-charcoal/80 leading-relaxed font-light">
                    <span className="font-bold text-aura-charcoal mr-2">
                      {post.businessSlug || 'sublime_estetica'}
                    </span>
                    {isTextExpanded
                      ? post.description || post.title
                      : (post.description || post.title).slice(0, 110)}
                    {(post.description || post.title).length > 110 && !isTextExpanded && (
                      <span
                        onClick={() =>
                          setExpandedText(prev => ({ ...prev, [post.id]: true }))
                        }
                        className="text-aura-taupe hover:text-aura-charcoal cursor-pointer ml-1 font-medium"
                      >
                        ... mais
                      </span>
                    )}
                  </p>
                </div>

                {/* Comentários Expandidos */}
                <AnimatePresence>
                  {expandedCommentsPostId === post.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 border-t border-aura-linen/60 space-y-3"
                    >
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        <div className="text-xs flex items-start gap-2">
                          <strong className="text-aura-charcoal shrink-0">juliana.paes:</strong>
                          <span className="text-aura-taupe">Fiz semana passada e minha pele está perfeita! Recomendo muito ✨</span>
                        </div>
                        <div className="text-xs flex items-start gap-2">
                          <strong className="text-aura-charcoal shrink-0">beatriz_m:</strong>
                          <span className="text-aura-taupe">Qual o valor médio desse protocolo?</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Adicione um comentário..."
                          value={commentInput[post.id] || ''}
                          onChange={e =>
                            setCommentInput(prev => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          className="flex-1 bg-aura-pearl border border-aura-linen rounded-full px-4 py-2 text-xs text-aura-charcoal placeholder:text-aura-taupe focus:outline-none focus:border-aura-rose"
                        />
                        <button
                          type="button"
                          className="p-2 rounded-full bg-aura-charcoal text-white hover:bg-black transition-colors"
                        >
                          <Send size={12} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.article>
          );
        })}
      </main>

      {/* BARRA DE NAVEGAÇÃO INFERIOR OTIMIZADA */}
      {!hideBottomNav && (
        <nav className="fixed bottom-0 w-full bg-white/85 backdrop-blur-xl border-t border-aura-linen px-8 sm:px-12 py-3.5 flex justify-between items-center z-50 shadow-lg">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              navigate('/app');
            }}
            className="p-2 text-aura-charcoal hover:text-black transition-colors flex flex-col items-center gap-1 cursor-pointer"
          >
            <HomeIcon size={22} />
            <span className="text-[8px] font-bold uppercase tracking-widest">Início</span>
          </button>

          <button
            onClick={() => navigate('/app/mapa')}
            className="p-2 text-aura-taupe hover:text-aura-charcoal transition-colors flex flex-col items-center gap-1 cursor-pointer"
          >
            <MapPin size={22} />
            <span className="text-[8px] font-bold uppercase tracking-widest">Mapa</span>
          </button>

          {/* Botão Central 'Novo Momento' com Rotação Táctil */}
          <div className="relative -top-5">
            <button
              onClick={() => openNewAppointment()}
              title="Agendar Novo Procedimento"
              className="w-14 h-14 bg-aura-charcoal text-white rounded-[22px] shadow-soft-glow flex items-center justify-center rotate-45 hover:rotate-0 transition-all duration-500 group cursor-pointer active:scale-95"
            >
              <Calendar
                size={24}
                className="-rotate-45 group-hover:rotate-0 transition-all text-white/95"
              />
            </button>
          </div>

          <button
            onClick={() => navigate('/app/clinicas')}
            className="p-2 text-aura-taupe hover:text-aura-charcoal transition-colors flex flex-col items-center gap-1 cursor-pointer"
          >
            <Sparkles size={22} />
            <span className="text-[8px] font-bold uppercase tracking-widest">Clínicas</span>
          </button>

          <button
            onClick={() => navigate('/app/perfil')}
            className="p-2 text-aura-taupe hover:text-aura-charcoal transition-colors flex flex-col items-center gap-1 cursor-pointer"
          >
            <User size={22} />
            <span className="text-[8px] font-bold uppercase tracking-widest">Perfil</span>
          </button>
        </nav>
      )}

      {/* MODAL DE AGENDAMENTO SILENCIOSO (AURA SYNC) */}
      {bookModalState.isOpen && (
        <BookingModal
          businessId={bookModalState.businessId}
          initialServiceQuery={bookModalState.serviceName}
          onClose={() =>
            setBookModalState(prev => ({ ...prev, isOpen: false }))
          }
          onSuccess={() => {
            setBookModalState(prev => ({ ...prev, isOpen: false }));
          }}
        />
      )}
    </div>
  );
};

export default SocialFeed;
