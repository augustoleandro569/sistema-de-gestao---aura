import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Sparkles, CheckCircle2, Store, Calendar, ArrowUpRight } from 'lucide-react';
import { ContentPost } from '../../types';

interface MarketplaceFeedCardProps {
  post: ContentPost & {
    businessName: string;
    businessLogo: string;
    businessSlug: string;
    businessId: string;
    isFollowed: boolean;
  };
  onFollowToggle: (businessId: string) => void;
  onBookClick: (businessId: string, suggestedService?: string) => void;
  onViewClinic: (businessSlug: string) => void;
}

export const MarketplaceFeedCard: React.FC<MarketplaceFeedCardProps> = ({
  post,
  onFollowToggle,
  onBookClick,
  onViewClinic,
}) => {
  const [likesCount, setLikesCount] = useState(post.likesCount || 24);
  const [hasLiked, setHasLiked] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.caption || post.content,
        url: window.location.href,
      }).catch(() => {});
    } else {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  return (
    <article className="bg-[#F9F7F5]/70 backdrop-blur-md rounded-[48px] p-2.5 border border-white shadow-luminous hover:shadow-soft-glow transition-all duration-300">
      {/* Post Image / Media */}
      <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden group bg-[#FDFCFB]">
        <img
          src={post.imageUrl || 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1000&q=80'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Tag Superior Esquerda Glassmorphic */}
        <div className="absolute top-6 left-6 bg-white/85 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold text-[#3A3A3A] uppercase tracking-widest shadow-xs border border-white/60">
          {post.category || 'Novidade'}
        </div>

        {/* Badge de Verificado */}
        <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-medium flex items-center gap-1.5 border border-white/20">
          <Sparkles size={12} className="text-[#C5A059]" />
          <span>Curadoria Aura</span>
        </div>

        {/* Ação Rápida Flutuante de Agendamento */}
        <div className="absolute bottom-6 right-6 opacity-95 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onBookClick(post.businessId, post.title)}
            className="bg-[#EAD7D1] hover:bg-[#dfc7c0] text-[#3A3A3A] px-5 py-2.5 rounded-full text-xs font-bold shadow-soft-glow flex items-center gap-2 transition-all cursor-pointer border border-white/80 active:scale-95"
          >
            <Calendar size={14} className="text-[#3A3A3A]" />
            <span className="tracking-tight">Agendar Horário</span>
          </button>
        </div>
      </div>

      {/* Conteúdo e Informações da Clínica */}
      <div className="p-6 sm:p-8 space-y-4">
        {/* Identidade do Estabelecimento */}
        <div className="flex items-center justify-between gap-3">
          <div
            onClick={() => onViewClinic(post.businessSlug)}
            className="flex items-center gap-3 cursor-pointer group/clinic"
          >
            <img
              src={post.businessLogo || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=120&q=80'}
              alt={post.businessName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#EAD7D1] shadow-2xs group-hover/clinic:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-xs font-bold text-[#3A3A3A] group-hover/clinic:text-[#B69D8E] flex items-center gap-1 transition-colors">
                {post.businessName}
                <CheckCircle2 size={13} className="text-[#C5A059]" />
              </span>
              <p className="text-[11px] text-[#8E8E8E] font-medium">
                {new Date(post.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Botão Seguir */}
          <button
            type="button"
            onClick={() => onFollowToggle(post.businessId)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              post.isFollowed
                ? 'bg-white text-[#8E8E8E] border border-[#F1EBE7]'
                : 'bg-[#3A3A3A] text-white hover:bg-[#2A2A2A] shadow-xs'
            }`}
          >
            {post.isFollowed ? 'Seguindo' : '+ Seguir'}
          </button>
        </div>

        {/* Título do Tratamento */}
        <h3 className="text-xl font-serif text-[#3A3A3A] leading-tight font-medium">
          {post.title}
        </h3>

        {/* Legenda / Descrição */}
        <p className="text-xs sm:text-sm text-[#8E8E8E] line-clamp-3 leading-relaxed font-normal">
          {post.caption || post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold text-[#8E8E8E] bg-white px-2.5 py-1 rounded-full border border-[#F1EBE7]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Barra Inferior com Curtir e Compartilhar */}
        <div className="pt-4 border-t border-[#F1EBE7] flex items-center justify-between">
          <div className="flex items-center gap-4 text-[#8E8E8E]">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                hasLiked ? 'text-rose-500' : 'hover:text-[#3A3A3A]'
              }`}
            >
              <Heart
                size={17}
                className={hasLiked ? 'fill-rose-500 text-rose-500' : ''}
              />
              <span>{likesCount}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-semibold hover:text-[#3A3A3A] cursor-pointer transition-colors"
              title="Compartilhar"
            >
              <Share2 size={16} />
              <span>Compartilhar</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onBookClick(post.businessId, post.title)}
            className="text-xs font-bold text-[#3A3A3A] hover:text-[#B69D8E] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Ver detalhes</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {showShareToast && (
          <div className="text-[11px] text-center text-emerald-800 bg-emerald-50/80 border border-emerald-200/60 py-1.5 rounded-xl font-medium">
            Link copiado para a área de transferência!
          </div>
        )}
      </div>
    </article>
  );
};
