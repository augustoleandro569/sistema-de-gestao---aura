import React, { useState, useMemo, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  Send,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Tag,
  ArrowRight,
  Store,
  UserPlus
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../core/BusinessContext';
import { useLayout } from '../../layouts/LayoutContext';
import { ContentPost } from '../../types';

interface SocialFeedProps {
  onBookService?: (businessId: string, serviceName?: string) => void;
  onViewClinic?: (businessSlug: string) => void;
}

export const CustomerFeed: React.FC<SocialFeedProps> = ({ onBookService, onViewClinic }) => {
  const { userProfile } = useAuth();
  const { setPublicProfileSlug } = useBusiness();
  const { setCurrentTab } = useLayout();

  const profileId = userProfile?.id || 'profile-client-01';

  // Feed Filter States
  const [feedMode, setFeedMode] = useState<'all' | 'following'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>({});
  const [expandedTextPosts, setExpandedTextPosts] = useState<{ [postId: string]: boolean }>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setVersion(v => v + 1);
    });
    return unsub;
  }, []);

  const categories = [
    { id: 'Todos', label: 'Todas as Inspirações', icon: '✨' },
    { id: 'Facial', label: 'Estética Facial', icon: '💆‍♀️' },
    { id: 'Portfolio', label: 'Antes & Depois', icon: '💎' },
    { id: 'Sobrancelhas', label: 'Olhar & Cílios', icon: '👁️' },
    { id: 'Corporal', label: 'Corporal & Spa', icon: '🧴' },
    { id: 'Novidades', label: 'Novos Protocolos', icon: '🌟' },
    { id: 'Dicas', label: 'Cuidados Home Care', icon: '🧴' },
  ];

  const followedIds = useMemo(() => {
    return dataService.getFollowedBusinessIds(profileId);
  }, [profileId, version]);

  // Fetch feed posts
  const posts = useMemo(() => {
    const rawPosts = dataService.getMarketplaceFeed({
      category: selectedCategory === 'Todos' ? undefined : selectedCategory,
      onlyFollowed: feedMode === 'following',
      profileId,
    });

    return rawPosts;
  }, [selectedCategory, feedMode, profileId, version]);

  const allBusinesses = useMemo(() => {
    return dataService.getAllBusinesses();
  }, [version]);

  const handleToggleFollow = (businessId: string) => {
    dataService.toggleFollowBusiness(profileId, businessId);
  };

  const handleToggleLike = (postId: string) => {
    dataService.togglePostLike(profileId, postId);
  };

  const handleToggleBookmark = (postId: string) => {
    dataService.togglePostBookmark(profileId, postId);
  };

  const handleShare = (postId: string, postTitle: string) => {
    const url = `${window.location.origin}/#post-${postId}`;
    navigator.clipboard?.writeText(url);
    setCopiedPostId(postId);
    setTimeout(() => setCopiedPostId(null), 2500);
  };

  const handleAddComment = (postId: string) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;
    const authorName = userProfile?.full_name || userProfile?.name || 'Cliente Aura';
    dataService.addPostComment(postId, authorName, text);
    setNewCommentText(prev => ({ ...prev, [postId]: '' }));
  };

  const handleOpenStore = (slug: string) => {
    if (onViewClinic) {
      onViewClinic(slug);
    } else if (setPublicProfileSlug) {
      setPublicProfileSlug(slug);
      setCurrentTab('vitrine');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8 animate-in fade-in">
      {/* HEADER EDITORIAL ESTILO REVISTA DIGITAL */}
      <header className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#F1EBE7] pb-5">
          <div>
            <span className="text-[11px] text-[#B69D8E] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#C5A059]" />
              Revista Digital & Curadoria de Estética
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#3A3A3A] mt-1 font-bold">
              Para você
            </h1>
            <p className="text-xs text-[#8E8E8E] mt-1">
              Resultados reais, transformações antes & depois e novidades de especialistas
            </p>
          </div>

          {/* Feed Mode Switcher (Geral vs Seguindo) */}
          <div className="flex items-center gap-1 bg-[#F9F7F5] p-1 rounded-full self-start sm:self-auto shadow-xs border border-[#F1EBE7]">
            <button
              type="button"
              onClick={() => setFeedMode('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                feedMode === 'all'
                  ? 'bg-white text-[#3A3A3A] shadow-xs border border-[#EAD7D1]/80'
                  : 'text-[#8E8E8E] hover:text-[#3A3A3A]'
              }`}
            >
              Explorar
            </button>
            <button
              type="button"
              onClick={() => setFeedMode('following')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                feedMode === 'following'
                  ? 'bg-white text-[#3A3A3A] shadow-xs border border-[#EAD7D1]/80'
                  : 'text-[#8E8E8E] hover:text-[#3A3A3A]'
              }`}
            >
              <span>Seguindo</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-[#EAD7D1]/60 text-[#3A3A3A] font-semibold">
                {followedIds.length}
              </span>
            </button>
          </div>
        </div>

        {/* Categorias em Pílulas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#EAD7D1] text-[#3A3A3A] font-bold border border-[#dfc7c0] shadow-soft-glow'
                  : 'bg-white text-[#8E8E8E] border border-[#F1EBE7] hover:bg-[#F9F7F5] hover:text-[#3A3A3A]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* FEED EMPTY STATE (SEGUINDO SEM POSTS) */}
      {posts.length === 0 && feedMode === 'following' && (
        <div className="bg-white rounded-[36px] p-8 text-center border border-stone-200/70 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
            <Heart size={28} />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Você ainda não segue nenhuma clínica
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Siga suas clínicas favoritas para receber novidades exclusivas de tratamentos, transformações antes & depois e cupons especiais direto no seu feed.
            </p>
          </div>

          {/* Clínicas sugeridas para seguir */}
          <div className="pt-2 text-left max-w-md mx-auto space-y-3">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Clínicas em Destaque na Sua Região:
            </span>
            <div className="space-y-2.5">
              {allBusinesses.slice(0, 3).map((biz) => {
                const isFollowed = followedIds.includes(biz.id);
                return (
                  <div
                    key={biz.id}
                    className="flex items-center justify-between p-3 rounded-2xl border border-stone-100 hover:border-stone-200 bg-stone-50/60"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={biz.logo || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=120&q=80'}
                        alt={biz.name}
                        className="w-10 h-10 rounded-full object-cover border border-stone-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">{biz.name}</h4>
                        <p className="text-[10px] text-stone-500">{biz.neighborhood || biz.city} • ★ {biz.rating || 4.9}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleFollow(biz.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                        isFollowed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-700 text-white hover:bg-rose-800'
                      }`}
                    >
                      {isFollowed ? 'Seguindo' : '+ Seguir'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFeedMode('all')}
            className="text-xs font-bold text-rose-700 hover:text-rose-800 underline cursor-pointer"
          >
            Explorar todas as publicações da comunidade Aura
          </button>
        </div>
      )}

      {/* LISTAGEM DE POSTS DO FEED */}
      <div className="space-y-12">
        {posts.map((post) => {
          const isFollowed = followedIds.includes(post.businessId);
          const likeInfo = dataService.getPostLikeStatus(profileId, post.id);
          const isBookmarked = dataService.isPostBookmarked(profileId, post.id);
          const comments = dataService.getPostComments(post.id);
          const isCommentsOpen = expandedCommentsPostId === post.id;
          const isTextExpanded = expandedTextPosts[post.id];

          return (
            <article
              key={post.id}
              className="bg-[#F9F7F5]/70 backdrop-blur-md rounded-[48px] p-2.5 sm:p-3 border border-white shadow-luminous hover:shadow-soft-glow transition-all duration-300"
            >
              {/* Imagem do Procedimento (Antes e Depois / Dica) */}
              <div className="aspect-square sm:aspect-[4/3] w-full relative bg-[#FDFCFB] rounded-[40px] overflow-hidden group">
                <img
                  src={post.imageUrl || post.image_url || 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1000&q=80'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                />

                {/* Badge Superior (Categoria / Desconto) */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <span className="px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md text-[#3A3A3A] text-[10px] font-bold uppercase tracking-widest border border-white/60 shadow-xs">
                    {post.category || 'Destaque'}
                  </span>
                  {post.promoDiscountPercent && (
                    <span className="px-3 py-1.5 rounded-full bg-[#C5A059] text-white text-[10px] font-bold tracking-tight shadow-soft-glow">
                      -{post.promoDiscountPercent}% no App
                    </span>
                  )}
                </div>

                {/* Botão Flutuante: AGENDAR ESTE SERVIÇO */}
                <div className="absolute bottom-6 right-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (onBookService) {
                        onBookService(post.businessId, post.linkedServiceName);
                      }
                    }}
                    className="bg-[#EAD7D1] hover:bg-[#dfc7c0] text-[#3A3A3A] px-5 py-2.5 rounded-full text-xs font-bold shadow-soft-glow flex items-center gap-2 hover:scale-102 active:scale-98 transition-all cursor-pointer border border-white/80"
                  >
                    <Calendar size={15} className="text-[#3A3A3A] shrink-0" />
                    <span className="tracking-tight">Agendar Procedimento</span>
                  </button>
                </div>
              </div>

              {/* Informações da Clínica e Conteúdo */}
              <div className="p-5 sm:p-7 space-y-4">
                {/* Identidade da Clínica */}
                <div className="flex justify-between items-center pb-3 border-b border-[#F1EBE7]">
                  <div
                    onClick={() => handleOpenStore(post.businessSlug)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <img
                      src={post.businessLogo || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=120&q=80'}
                      alt={post.businessName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#EAD7D1] shadow-2xs group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-[#3A3A3A] group-hover:text-[#B69D8E] transition-colors">
                          {post.businessName}
                        </h3>
                        <CheckCircle2 size={13} className="text-[#C5A059]" />
                      </div>
                      <p className="text-[11px] text-[#8E8E8E] flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-[#C5A059]" />
                        <span>{post.businessSlug === 'sublime-estetica' ? 'Jardins, SP' : 'São Paulo, SP'}</span>
                        <span>•</span>
                        <span>{post.authorName || 'Especialista Aura'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Botão Seguir / Seguindo */}
                  <button
                    type="button"
                    onClick={() => handleToggleFollow(post.businessId)}
                    className={`text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                      isFollowed
                        ? 'text-[#8E8E8E] bg-white border border-[#F1EBE7] hover:bg-[#F9F7F5]'
                        : 'text-white bg-[#3A3A3A] hover:bg-[#2A2A2A] shadow-xs'
                    }`}
                  >
                    {isFollowed ? (
                      <>
                        <CheckCircle2 size={12} className="text-[#C5A059]" />
                        <span>Seguindo</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={12} />
                        <span>Seguir</span>
                      </>
                    )}
                  </button>
                </div>
                {/* Barra de Ações Sociais */}
                <div className="flex items-center gap-6 text-[#8E8E8E]">
                  {/* Curtir */}
                  <button
                    type="button"
                    onClick={() => handleToggleLike(post.id)}
                    className="flex items-center gap-1.5 transition-colors cursor-pointer group"
                  >
                    <Heart
                      size={20}
                      className={`transition-transform group-hover:scale-110 ${
                        likeInfo.liked
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-[#8E8E8E] group-hover:text-[#3A3A3A]'
                      }`}
                    />
                    <span className="text-xs font-semibold text-[#8E8E8E]">
                      {likeInfo.count}
                    </span>
                  </button>

                  {/* Comentar */}
                  <button
                    type="button"
                    onClick={() => setExpandedCommentsPostId(isCommentsOpen ? null : post.id)}
                    className="flex items-center gap-1.5 text-[#8E8E8E] hover:text-[#3A3A3A] transition-colors cursor-pointer group"
                  >
                    <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-[#8E8E8E]">
                      {comments.length}
                    </span>
                  </button>

                  {/* Compartilhar */}
                  <button
                    type="button"
                    onClick={() => handleShare(post.id, post.title)}
                    className="relative text-[#8E8E8E] hover:text-[#3A3A3A] transition-colors cursor-pointer group"
                    title="Compartilhar resultado"
                  >
                    <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                    {copiedPostId === post.id && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#3A3A3A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-xs">
                        Link copiado!
                      </span>
                    )}
                  </button>

                  {/* Salvar Bookmark */}
                  <button
                    type="button"
                    onClick={() => handleToggleBookmark(post.id)}
                    className="ml-auto text-[#8E8E8E] hover:text-[#C5A059] transition-colors cursor-pointer group"
                    title="Salvar na sua pasta de inspirações"
                  >
                    <Bookmark
                      size={20}
                      className={`transition-transform group-hover:scale-110 ${
                        isBookmarked
                          ? 'fill-[#C5A059] text-[#C5A059]'
                          : 'text-[#8E8E8E] group-hover:text-[#C5A059]'
                      }`}
                    />
                  </button>
                </div>

                {/* Conteúdo do Post */}
                <div className="space-y-2">
                  <h4 className="font-serif font-medium text-[#3A3A3A] text-lg sm:text-xl tracking-tight">
                    {post.title}
                  </h4>

                  <div className="text-sm text-[#8E8E8E] leading-relaxed font-normal">
                    {isTextExpanded ? (
                      <div className="space-y-2 whitespace-pre-line">
                        <p>{post.description}</p>
                        {post.contentBody && (
                          <p className="text-[#8E8E8E] pt-1 border-t border-[#F1EBE7]">
                            {post.contentBody}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => setExpandedTextPosts(prev => ({ ...prev, [post.id]: false }))}
                          className="text-[#B69D8E] font-semibold cursor-pointer text-xs block mt-1 hover:underline"
                        >
                          mostrar menos
                        </button>
                      </div>
                    ) : (
                      <p>
                        {post.description}
                        {(post.contentBody || (post.description && post.description.length > 90)) && (
                          <span
                            onClick={() => setExpandedTextPosts(prev => ({ ...prev, [post.id]: true }))}
                            className="text-[#B69D8E] font-medium cursor-pointer ml-1 hover:underline text-xs"
                          >
                            ...mais
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Procedimento Vinculado em Destaque */}
                {post.linkedServiceName && (
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#F1EBE7] shadow-2xs mt-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#FAF5EB] text-[#C5A059] flex items-center justify-center">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8E8E8E] font-semibold uppercase tracking-wider block">
                          Procedimento Recomendado
                        </span>
                        <span className="text-xs font-bold text-[#3A3A3A]">
                          {post.linkedServiceName}
                        </span>
                      </div>
                    </div>
                    {post.linkedServicePrice && (
                      <span className="text-xs font-bold text-[#3A3A3A] bg-[#F9F7F5] px-2.5 py-1 rounded-lg border border-[#F1EBE7]">
                        R$ {post.linkedServicePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                )}

                {/* Seção de Comentários / Dúvidas */}
                {isCommentsOpen && (
                  <div className="pt-4 mt-4 border-t border-[#F1EBE7] space-y-3 animate-in fade-in">
                    <span className="text-xs font-bold text-[#8E8E8E] uppercase tracking-wider block">
                      Perguntas & Respostas ({comments.length})
                    </span>

                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                      {comments.map((comm) => (
                        <div key={comm.id} className="bg-white border border-[#F1EBE7] p-3 rounded-2xl text-xs space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#3A3A3A]">{comm.authorName}</span>
                            <span className="text-[10px] text-[#8E8E8E]">{comm.createdAt}</span>
                          </div>
                          <p className="text-[#8E8E8E]">{comm.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Input para adicionar comentário */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={newCommentText[post.id] || ''}
                        onChange={(e) => setNewCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                        placeholder="Faça uma pergunta sobre este procedimento..."
                        className="flex-1 px-4 py-2 text-xs rounded-full border border-[#F1EBE7] outline-hidden focus:border-[#EAD7D1] bg-white text-[#3A3A3A]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post.id)}
                        className="p-2 rounded-full bg-[#EAD7D1] text-[#3A3A3A] hover:bg-[#dfc7c0] shadow-soft-glow transition-colors cursor-pointer"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export const SocialFeed = CustomerFeed;
