import React from 'react';
import { Star, Award, MessageSquare, ThumbsUp, ShieldAlert } from 'lucide-react';
import { Review } from '../../types';

interface CustomerSatisfactionWidgetProps {
  reviews: Review[];
  avgRating: string;
  nps: number;
}

export const CustomerSatisfactionWidget: React.FC<CustomerSatisfactionWidgetProps> = ({
  reviews = [],
  avgRating,
  nps,
}) => {
  const safeReviews = reviews || [];
  const totalReviews = safeReviews.length;
  const promoters = safeReviews.filter((r) => r.npsScore >= 9).length;
  const neutrals = safeReviews.filter((r) => r.npsScore === 7 || r.npsScore === 8).length;
  const detractors = safeReviews.filter((r) => r.npsScore <= 6).length;

  return (
    <div id="customer-satisfaction-widget" className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EDE7DF] shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F4EFEA]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h3 className="font-display text-lg sm:text-xl font-semibold text-[#2D2725]">
              Satisfação & NPS da Clínica
            </h3>
          </div>
          <p className="text-xs text-[#8F8278] mt-0.5">
            Métricas de encantamento pós-atendimento
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FAF2E6] text-[#9C753B] border border-[#EADBCA]">
          Zona de Excelência
        </span>
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Rating Geral */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4DC] text-center">
          <span className="text-[11px] font-semibold text-[#8F8278] uppercase tracking-wider block">
            Nota Média Geral
          </span>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="font-display text-3xl font-bold text-[#2D2725]">
              {avgRating}
            </span>
            <span className="text-sm text-[#8F8278]">/ 5.0</span>
          </div>
          <div className="flex items-center justify-center gap-0.5 text-amber-500 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={14} className="fill-amber-500" />
            ))}
          </div>
          <span className="text-[10px] text-[#8F8278] block mt-1.5">
            Baseado em {totalReviews} avaliações validadas
          </span>
        </div>

        {/* NPS Score */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4DC] text-center">
          <span className="text-[11px] font-semibold text-[#8F8278] uppercase tracking-wider block">
            Net Promoter Score (NPS)
          </span>
          <div className="font-display text-3xl font-bold text-emerald-800 mt-1">
            +{nps}
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block mt-1">
            Padrão Ouro Mundial
          </span>
          <span className="text-[10px] text-[#8F8278] block mt-1">
            {promoters} Promotores • {neutrals} Neutros • {detractors} Detratores
          </span>
        </div>

        {/* Taxa de Resposta */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4DC] text-center">
          <span className="text-[11px] font-semibold text-[#8F8278] uppercase tracking-wider block">
            Taxa de Resposta WhatsApp
          </span>
          <div className="font-display text-3xl font-bold text-[#2D2725] mt-1">
            86.4%
          </div>
          <span className="text-[10px] font-medium text-[#9C753B] block mt-1">
            Envio automatizado 2h pós
          </span>
          <span className="text-[10px] text-[#8F8278] block mt-1">
            Zero avaliações negativas hoje
          </span>
        </div>
      </div>

      {/* Star Distribution Breakdown */}
      <div className="space-y-1.5 pt-2">
        <span className="text-xs font-bold text-[#2D2725] uppercase tracking-wide block mb-2">
          Distribuição das Avaliações
        </span>

        <div className="space-y-1.5 text-xs text-[#524842]">
          <div className="flex items-center gap-3">
            <span className="w-16 flex items-center gap-1 shrink-0 font-medium">5 estrelas</span>
            <div className="flex-1 h-2 rounded-full bg-[#EFE9E2] overflow-hidden">
              <div className="h-full bg-[#C5A880] rounded-full" style={{ width: '96%' }} />
            </div>
            <span className="w-8 text-right font-semibold text-[#2D2725]">96%</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-16 flex items-center gap-1 shrink-0 font-medium">4 estrelas</span>
            <div className="flex-1 h-2 rounded-full bg-[#EFE9E2] overflow-hidden">
              <div className="h-full bg-[#C5A880] rounded-full" style={{ width: '4%' }} />
            </div>
            <span className="w-8 text-right font-semibold text-[#2D2725]">4%</span>
          </div>

          <div className="flex items-center gap-3 text-[#A89D93]">
            <span className="w-16 flex items-center gap-1 shrink-0">3 estrelas</span>
            <div className="flex-1 h-2 rounded-full bg-[#EFE9E2] overflow-hidden">
              <div className="h-full bg-[#C5A880] rounded-full" style={{ width: '0%' }} />
            </div>
            <span className="w-8 text-right">0%</span>
          </div>

          <div className="flex items-center gap-3 text-[#A89D93]">
            <span className="w-16 flex items-center gap-1 shrink-0">1-2 estrelas</span>
            <div className="flex-1 h-2 rounded-full bg-[#EFE9E2] overflow-hidden">
              <div className="h-full bg-red-400 rounded-full" style={{ width: '0%' }} />
            </div>
            <span className="w-8 text-right">0%</span>
          </div>
        </div>
      </div>

      {/* Latest Review Testimonial Snippet */}
      {reviews.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EBD5CC] text-[#5C3D36] font-bold text-xs flex items-center justify-center shrink-0">
            {reviews[0].clientName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#2D2725]">{reviews[0].clientName}</span>
              <span className="text-[10px] text-[#8F8278]">• {reviews[0].serviceName}</span>
              <span className="text-[10px] text-amber-600 font-bold ml-auto">★ 5.0</span>
            </div>
            <p className="text-xs text-[#524842] mt-1 italic">
              "{reviews[0].comment}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
