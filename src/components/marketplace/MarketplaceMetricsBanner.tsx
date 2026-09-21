import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Percent,
  Sparkles,
  Zap,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { useBusiness } from '../../core/BusinessContext';

interface MarketplaceMetricsBannerProps {
  onBoostClick?: () => void;
}

export const MarketplaceMetricsBanner: React.FC<MarketplaceMetricsBannerProps> = ({
  onBoostClick,
}) => {
  const { currentBusiness } = useBusiness();
  const metrics = dataService.getMarketplaceBusinessMetrics(currentBusiness?.id);
  const searchMetrics = dataService.getMarketplaceSearchMetrics();

  return (
    <div className="bg-gradient-to-br from-stone-900 via-[#2A2421] to-[#1E1917] rounded-3xl p-6 text-white border border-amber-500/20 shadow-xl relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} />
                Efeito de Rede Ativo
              </span>
              <span className="text-xs text-stone-400 font-medium hidden sm:inline">
                Aura Marketplace • O iFood da Estética
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">
              Demanda e Clientes Gerados pela Rede Aura
            </h2>
            <p className="text-xs text-stone-300 mt-1 max-w-xl">
              Diferente de um simples software, o Aura atrai consumidores finais que pesquisam procedimentos e os direciona diretamente para a agenda da sua clínica.
            </p>
          </div>

          {onBoostClick && (
            <button
              type="button"
              onClick={onBoostClick}
              className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-900/40 flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
            >
              <Zap size={14} className="fill-stone-950" />
              <span>{metrics.hasAds ? 'Destaque Ads Ativo ✓' : 'Impulsionar com Ads no Topo'}</span>
            </button>
          )}
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-1.5">
              <span>Novos Agendamentos</span>
              <ShoppingBag size={16} className="text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white font-serif">
              {metrics.totalMarketplaceAppointments}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <TrendingUp size={12} />
              <span>+28% este mês</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-1.5">
              <span>Faturamento Marketplace</span>
              <TrendingUp size={16} className="text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white font-serif">
              R$ {metrics.totalMarketplaceRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-amber-300/80 font-medium mt-1">
              Gerado via demanda externa
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-1.5">
              <span>Clientes Conquistados</span>
              <Users size={16} className="text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white font-serif">
              {metrics.newClientsAcquired}
            </div>
            <div className="text-[11px] text-stone-300 font-medium mt-1">
              {metrics.followersCount} seguidores no app
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-1.5">
              <span>Comissão da Plataforma</span>
              <Percent size={16} className="text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-300 font-serif">
              R$ {metrics.commissionPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-stone-400 font-medium mt-1">
              10% por agendamento concluído
            </div>
          </div>
        </div>

        {/* Hot Search Terms in Beauty right now */}
        {searchMetrics && searchMetrics.length > 0 && (
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-400 font-medium flex items-center gap-1">
              🔥 Mais buscados na região hoje:
            </span>
            {searchMetrics.slice(0, 5).map((sm, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-stone-200 text-[11px] font-medium transition-colors"
              >
                {sm.term} <span className="text-amber-300">+{sm.growthPercent}%</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
