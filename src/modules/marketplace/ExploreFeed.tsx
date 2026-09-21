// src/modules/marketplace/ExploreFeed.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Calendar,
  Bookmark,
  Share2,
  Sparkles,
  CheckCircle2,
  Send,
  ArrowRight,
  Store,
  Tag
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../core/BusinessContext';
import { useLayout } from '../../layouts/LayoutContext';
import { ContentPost } from '../../types';
import { AuraBrand } from '../../components/ui/AuraBrand';

interface ExploreFeedProps {
  onBookService?: (businessId: string, serviceName?: string, serviceId?: string) => void;
  onViewClinic?: (businessSlug: string) => void;
}

export const ExploreFeed: React.FC<ExploreFeedProps> = ({ onBookService, onViewClinic }) => {
  const { userProfile } = useAuth();
  const { setPublicProfileSlug } = useBusiness();
  const { setCurrentTab } = useLayout();

  const profileId = userProfile?.id || 'profile-client-01';

  // 1. Estado dos Filtros de Categoria
  const [selectedCategory, setSelectedCategory] = useState<string>('Para Você');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInputText, setCommentInputText] = useState<{ [postId: string]: string }>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  // Escuta alterações reativas no dataService
  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setVersion(v => v + 1);
    });
    return unsub;
  }, []);

  const categories = ['Para Você', 'Facial', 'Corporal', 'Cílios', 'Promoções'];

  // Clínicas seguidas pelo perfil ativo
  const followedIds = useMemo(() => {
    return dataService.getFollowedBusinessIds(profileId);
  }, [profileId, version]);

  // Lista de posts curados da comunidade
  const allPosts = useMemo(() => {
    return dataService.getMarketplaceFeed({ profileId });
  }, [profileId, version]);

  // Filtragem inteligente por categoria
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'Para Você') {
      return allPosts;
    }
    if (selectedCategory === 'Promoções') {
      return allPosts.filter(p => (p.promoDiscountPercent && p.promoDiscountPercent > 0) || (p.promo_discount_percent && p.promo_discount_percent > 0));
    }
    if (selectedCategory === 'Facial') {
      return allPosts.filter(p => {
        const text = `${p.category || ''} ${p.title || ''} ${p.linkedServiceName || ''} ${p.description || ''}`.toLowerCase();
        return text.includes('facial') || text.includes('pele') || text.includes('glow') || text.includes('acne') || text.includes('peeling') || text.includes('harmoniza');
      });
    }
    if (selectedCategory === 'Corporal') {
      return allPosts.filter(p => {
        const text = `${p.category || ''} ${p.title || ''} ${p.linkedServiceName || ''} ${p.description || ''}`.toLowerCase();
        return text.includes('corporal') || text.includes('drenagem') || text.includes('massagem') || text.includes('detox') || text.includes('spa');
      });
    }
    if (selectedCategory === 'Cílios') {
      return allPosts.filter(p => {
        const text = `${p.category || ''} ${p.title || ''} ${p.linkedServiceName || ''} ${p.description || ''}`.toLowerCase();
        return text.includes('cílios') || text.includes('cilios') || text.includes('lash') || text.includes('sobrancelha') || text.includes('olhar');
      });
    }
    return allPosts;
  }, [allPosts, selectedCategory]);

  // Ações sociais
  const handleToggleFollow = (businessId: string) => {
    dataService.toggleFollowBusiness(profileId, businessId);
  };

  const handleToggleLike = (postId: string) => {
    dataService.togglePostLike(profileId, postId);
  };

  const handleToggleBookmark = (postId: string) => {
    dataService.togglePostBookmark(profileId, postId);
  };

  const handleShare = (postId: string) => {
    const url = `${window.location.origin}/app/explorar#post-${postId}`;
    navigator.clipboard?.writeText(url);
    setCopiedPostId(postId);
    setTimeout(() => setCopiedPostId(null), 2500);
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputText[postId]?.trim();
    if (!text) return;
    const authorName = userProfile?.full_name || userProfile?.name || 'Cliente Aura';
    dataService.addPostComment(postId, authorName, text);
    setCommentInputText(prev => ({ ...prev, [postId]: '' }));
  };

  const handleOpenClinicProfile = (businessSlug?: string) => {
    if (!businessSlug) return;
    if (onViewClinic) {
      onViewClinic(businessSlug);
    } else if (setPublicProfileSlug) {
      setPublicProfileSlug(businessSlug);
      setCurrentTab('vitrine');
    }
  };

  const handleDirectBooking = (post: ContentPost & { businessId?: string; linkedServiceName?: string; linkedServiceId?: string }) => {
    const targetBusinessId = post.businessId || post.business_id || 'biz-sublime-01';
    const targetServiceName = post.linkedServiceName || post.title || 'Limpeza de Pele Glow ✨';
    const targetServiceId = post.linkedServiceId || post.linked_service_id;

    if (onBookService) {
      onBookService(targetBusinessId, targetServiceName, targetServiceId);
    } else {
      // Fallback: Redireciona para a vitrine da clínica com procedimento em destaque
      handleOpenClinicProfile(post.businessSlug || 'sublime-estetica');
    }
  };

  // Fallback para imagens estéticas de altíssima resolução se a mídia for ausente
  const getProcedureImage = (post: ContentPost, index: number) => {
    if (post.imageUrl && !post.imageUrl.includes('placeholder')) return post.imageUrl;
    if (post.image_url && !post.image_url.includes('placeholder')) return post.image_url;

    const beautyLibrary = [
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=85',
    ];
    return beautyLibrary[index % beautyLibrary.length];
  };

  return (
    <div className="min-h-screen bg-aura-pearl pb-28 text-aura-charcoal">
      {/* 1. FILTROS DE CATEGORIA (Scroll Horizontal Sticky com Luminous Luxury Blur) */}
      <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-aura-linen px-6 py-4 flex gap-3 overflow-x-auto scrollbar-hide shadow-xs">
        <div className="max-w-xl mx-auto w-full flex gap-2.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer select-none ${
                  isSelected
                    ? 'bg-aura-charcoal text-white shadow-lg scale-102 ring-2 ring-aura-rose/50'
                    : 'bg-white text-aura-charcoal/50 border border-aura-linen hover:text-aura-charcoal hover:border-aura-taupe/30 hover:bg-aura-linen/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. FEED DE CONTEÚDO (Cards de Alto Impacto e Alto Desejo) */}
      <main className="max-w-xl mx-auto p-4 space-y-8 mt-2">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-[48px] p-10 text-center border border-aura-linen shadow-luminous space-y-4">
            <div className="w-14 h-14 rounded-full bg-aura-linen text-aura-taupe flex items-center justify-center mx-auto">
              <Sparkles size={24} />
            </div>
            <h3 className="font-serif font-bold text-lg text-aura-charcoal">
              Nenhuma transformação encontrada nesta categoria
            </h3>
            <p className="text-xs text-aura-charcoal/60 leading-relaxed max-w-sm mx-auto">
              Seja o primeiro a conferir novos protocolos ou explore todas as publicações na aba <strong>Para Você</strong>.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('Para Você')}
              className="px-6 py-2.5 rounded-full bg-aura-charcoal text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-all cursor-pointer"
            >
              Ver Todas as Publicações
            </button>
          </div>
        ) : (
          filteredPosts.map((post, index) => {
            const businessId = post.businessId || post.business_id || 'biz-sublime-01';
            const isFollowed = followedIds.includes(businessId);
            const likeStatus = dataService.getPostLikeStatus(profileId, post.id);
            const isBookmarked = dataService.isPostBookmarked(profileId, post.id);
            const comments = dataService.getPostComments(post.id);
            const isCommentsOpen = expandedCommentsPostId === post.id;
            const procedureImage = getProcedureImage(post, index);
            const serviceName = post.linkedServiceName || post.title || 'Limpeza de Pele Glow ✨';
            const discountPercent = post.promoDiscountPercent || post.promo_discount_percent;

            return (
              <article
                key={post.id}
                id={`post-${post.id}`}
                className="bg-white rounded-[48px] overflow-hidden border border-aura-linen shadow-luminous group transition-all duration-300 hover:shadow-soft-glow"
              >
                {/* Header do Post: Info da Clínica */}
                <div className="p-6 flex justify-between items-center">
                  <div
                    onClick={() => handleOpenClinicProfile(post.businessSlug)}
                    className="flex items-center gap-3 cursor-pointer group/clinic select-none"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-aura-linen border border-aura-rose/30 p-0.5 overflow-hidden shrink-0 shadow-2xs group-hover/clinic:border-aura-rose transition-colors">
                      <img
                        src={
                          post.businessLogo ||
                          'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=150&q=80'
                        }
                        alt={post.businessName || 'Clínica Aura'}
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-aura-charcoal group-hover/clinic:text-aura-taupe transition-colors">
                          {post.businessName || 'Sublime Estética & Bem-estar'}
                        </h4>
                        <CheckCircle2 size={13} className="text-aura-gold shrink-0" />
                      </div>
                      <p className="text-[10px] text-aura-taupe font-medium uppercase tracking-tighter mt-0.5">
                        {post.businessSlug === 'sublime-estetica'
                          ? 'Jardins, São Paulo'
                          : 'São Paulo, SP'}
                      </p>
                    </div>
                  </div>

                  {/* Botão Seguir / Seguindo */}
                  <button
                    type="button"
                    onClick={() => handleToggleFollow(businessId)}
                    className={`h-8 px-4 text-[10px] font-bold rounded-full transition-all cursor-pointer select-none tracking-wider ${
                      isFollowed
                        ? 'bg-aura-linen text-aura-charcoal/70 border border-aura-border hover:bg-aura-border'
                        : 'border border-aura-rose text-aura-charcoal hover:bg-aura-rose hover:text-aura-charcoal shadow-xs'
                    }`}
                  >
                    {isFollowed ? 'SEGUINDO' : 'SEGUIR'}
                  </button>
                </div>

                {/* Mídia: Foto do Procedimento (Aspect Ratio 4:5 de Alto Impacto) */}
                <div className="relative aspect-[4/5] bg-aura-linen overflow-hidden">
                  <img
                    src={procedureImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Badges Flutuantes Superiores (Categoria & Desconto Especial) */}
                  <div className="absolute top-5 left-5 flex items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-aura-charcoal text-[9px] font-bold uppercase tracking-widest border border-white/80 shadow-xs">
                      {post.category || 'Antes & Depois'}
                    </span>
                    {discountPercent && (
                      <span className="px-3 py-1.5 rounded-full bg-aura-gold text-white text-[9px] font-bold tracking-tight shadow-soft-glow flex items-center gap-1">
                        <Tag size={10} />
                        -{discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Marca D'água Proprietária da Ligatura Aura */}
                  <div className="absolute top-4 right-4 z-10 opacity-70 hover:opacity-100 transition-opacity bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 pointer-events-none">
                    <AuraBrand size="sm" subtitle="" accentColor="#FFFFFF" className="h-4" />
                  </div>

                  {/* CTA INTEGRADO: AGENDAMENTO DIRETO (Vi o resultado -> Gostei -> Agendei) */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[88%] z-10">
                    <button
                      type="button"
                      onClick={() => handleDirectBooking(post)}
                      className="w-full bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl shadow-2xl flex justify-between items-center group/btn hover:scale-[1.02] active:scale-98 transition-all cursor-pointer border border-white/80"
                    >
                      <div className="text-left pr-2 truncate">
                        <p className="text-[9px] font-bold text-aura-taupe uppercase tracking-widest">
                          Procedimento
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-aura-charcoal truncate">
                          {serviceName}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 bg-aura-charcoal text-white px-3.5 sm:px-4 py-2 rounded-2xl shadow-sm shrink-0 group-hover/btn:bg-black transition-colors">
                        <Calendar size={14} className="text-aura-rose" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Agendar</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Rodapé: Interação Social, Legenda e Comentários */}
                <div className="p-6 sm:p-8 space-y-4">
                  {/* Barra de Ações Rápidas */}
                  <div className="flex items-center gap-6 text-aura-charcoal">
                    {/* Curtir */}
                    <button
                      type="button"
                      onClick={() => handleToggleLike(post.id)}
                      className="flex items-center gap-1.5 hover:scale-110 active:scale-95 transition-transform cursor-pointer group/like"
                      title="Curtir resultado"
                    >
                      <Heart
                        size={22}
                        strokeWidth={1.5}
                        className={`transition-colors ${
                          likeStatus.liked
                            ? 'fill-rose-500 text-rose-500'
                            : 'text-aura-charcoal group-hover/like:text-rose-500'
                        }`}
                      />
                      {likeStatus.count > 0 && (
                        <span className="text-xs font-bold text-aura-charcoal/80">
                          {likeStatus.count}
                        </span>
                      )}
                    </button>

                    {/* Comentários */}
                    <button
                      type="button"
                      onClick={() => setExpandedCommentsPostId(isCommentsOpen ? null : post.id)}
                      className="flex items-center gap-1.5 hover:scale-110 active:scale-95 transition-transform cursor-pointer group/comm"
                      title="Ver comentários e dúvidas"
                    >
                      <MessageCircle
                        size={22}
                        strokeWidth={1.5}
                        className="text-aura-charcoal group-hover/comm:text-aura-taupe transition-colors"
                      />
                      {comments.length > 0 && (
                        <span className="text-xs font-bold text-aura-charcoal/80">
                          {comments.length}
                        </span>
                      )}
                    </button>

                    {/* Compartilhar */}
                    <button
                      type="button"
                      onClick={() => handleShare(post.id)}
                      className="relative hover:scale-110 active:scale-95 transition-transform cursor-pointer text-aura-charcoal hover:text-aura-taupe"
                      title="Copiar link"
                    >
                      <Share2 size={20} strokeWidth={1.5} />
                      {copiedPostId === post.id && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-aura-charcoal text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md animate-in fade-in">
                          Copiado!
                        </span>
                      )}
                    </button>

                    {/* Salvar na Coleção */}
                    <button
                      type="button"
                      onClick={() => handleToggleBookmark(post.id)}
                      className="ml-auto hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      title={isBookmarked ? 'Salvo' : 'Salvar inspiração'}
                    >
                      <Bookmark
                        size={22}
                        strokeWidth={1.5}
                        className={
                          isBookmarked
                            ? 'fill-aura-gold text-aura-gold'
                            : 'text-aura-charcoal hover:text-aura-gold transition-colors'
                        }
                      />
                    </button>
                  </div>

                  {/* Legenda do Post */}
                  <div className="space-y-1.5">
                    <p className="text-xs sm:text-sm text-aura-charcoal/80 leading-relaxed italic font-serif">
                      "{post.description || post.contentBody || 'Um resultado apaixonante de hoje! O protocolo Glow Skin foca na renovação celular profunda e hidratação com ativos biocompatíveis.'}"
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-aura-taupe font-medium">
                      <span>#AuraEstética</span>
                      <span>#ResultadosReais</span>
                      <span>#{serviceName.replace(/\s+/g, '')}</span>
                    </div>
                  </div>

                  {/* Gaveta de Comentários Interativa */}
                  {isCommentsOpen && (
                    <div className="pt-4 border-t border-aura-linen space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <h5 className="text-[10px] font-bold text-aura-taupe uppercase tracking-wider">
                        Dúvidas & Comentários ({comments.length})
                      </h5>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {comments.length === 0 ? (
                          <p className="text-xs text-aura-charcoal/50 italic">
                            Nenhum comentário ainda. Faça a primeira pergunta para a especialista!
                          </p>
                        ) : (
                          comments.map((comm) => (
                            <div
                              key={comm.id}
                              className="p-2.5 rounded-2xl bg-aura-linen/60 border border-aura-linen text-xs space-y-1"
                            >
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="font-bold text-aura-charcoal">{comm.authorName}</span>
                                <span className="text-aura-charcoal/40">{comm.createdAt}</span>
                              </div>
                              <p className="text-aura-charcoal/80 leading-snug">{comm.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Input de Novo Comentário */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddComment(post.id);
                        }}
                        className="flex items-center gap-2 pt-1"
                      >
                        <input
                          type="text"
                          value={commentInputText[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputText((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          placeholder="Pergunte sobre tempo de recuperação, sessões..."
                          className="flex-1 bg-aura-linen/80 border border-aura-linen rounded-full px-4 py-2 text-xs text-aura-charcoal placeholder:text-aura-charcoal/40 outline-hidden focus:border-aura-taupe transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={!commentInputText[post.id]?.trim()}
                          className="w-8 h-8 rounded-full bg-aura-charcoal text-white flex items-center justify-center hover:bg-black disabled:opacity-40 disabled:hover:bg-aura-charcoal cursor-pointer transition-all shrink-0"
                        >
                          <Send size={13} />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </main>
    </div>
  );
};

export default ExploreFeed;
