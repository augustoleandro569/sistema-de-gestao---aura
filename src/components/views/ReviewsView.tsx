import React, { useState } from 'react';
import {
  Star,
  Award,
  MessageSquare,
  ThumbsUp,
  Filter,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { CustomerSatisfactionWidget } from '../dashboard/CustomerSatisfactionWidget';

export const ReviewsView: React.FC = () => {
  const reviews = dataService.getReviews();
  const metrics = dataService.getDashboardMetrics();
  const [filterRating, setFilterRating] = useState<string>('todos');

  const filteredReviews = (reviews || []).filter((r) => {
    if (filterRating === 'todos') return true;
    return r.overallRating.toString() === filterRating;
  });

  return (
    <div id="reviews-view" className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EDE7DF] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D2725] text-[#F3E7DC] flex items-center justify-center">
            <Star size={20} className="fill-[#F3E7DC]" />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2D2725]">
              Avaliações & Satisfação (NPS)
            </h1>
            <p className="text-xs text-[#8F8278]">
              Pesquisas pós-atendimento enviadas via WhatsApp automaticamente
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#FAF2E6] text-[#9C753B] font-bold text-xs border border-[#ECD9BD]">
            Média: {metrics.avgRating} ★ (NPS +{metrics.nps})
          </span>
        </div>
      </div>

      {/* Widget Overview */}
      <CustomerSatisfactionWidget
        reviews={reviews}
        avgRating={metrics.avgRating}
        nps={metrics.nps}
      />

      {/* Filter and List of Reviews */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EDE7DF] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4EFEA]">
          <h3 className="font-display text-lg font-bold text-[#2D2725]">
            Depoimentos e Avaliações Recebidas ({filteredReviews.length})
          </h3>

          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs font-medium text-[#2D2725]"
          >
            <option value="todos">Todas as Notas</option>
            <option value="5">5 Estrelas</option>
            <option value="4">4 Estrelas</option>
            <option value="3">3 Estrelas</option>
          </select>
        </div>

        <div className="divide-y divide-[#F7F3EE]">
          {filteredReviews.map((rev) => (
            <div key={rev.id} className="py-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#EBD5CC] text-[#5C3D36] font-bold text-xs flex items-center justify-center">
                    {rev.clientName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2D2725] block">{rev.clientName}</span>
                    <span className="text-[11px] text-[#8F8278]">{rev.serviceName}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-0.5 text-amber-500 justify-end">
                    {Array.from({ length: rev.overallRating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#9C8F85]">{rev.createdAt}</span>
                </div>
              </div>

              <p className="text-xs text-[#524842] italic bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE3DA]">
                "{rev.comment}"
              </p>

              <div className="flex items-center justify-between text-[11px] text-[#8F8278]">
                <span>Nota NPS: <strong>{rev.npsScore} / 10</strong> (Promotor)</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Verificado via WhatsApp
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
