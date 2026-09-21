import React, { useState } from 'react';
import {
  Sparkles,
  Trophy,
  TrendingUp,
  Percent,
  Star,
  DollarSign,
  Filter,
  BarChart2,
  PieChart,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { dataService } from '../../services/dataService';

export const ServicesPerformanceSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('mes_atual');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const { ranking, totalTimes, highlights } = dataService.getServicesPerformance();

  const filteredRanking = (ranking || []).filter((item) => {
    if (selectedCategory === 'todas') return true;
    return item.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div id="services-performance-dashboard" className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EDE7DF] shadow-xs space-y-6">
      {/* Title & Filter bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#F4EFEA]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B88746]" />
            <h3 className="font-display text-lg sm:text-xl font-semibold text-[#2D2725]">
              Desempenho dos Serviços
            </h3>
            <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-[#FAF2E6] text-[#9C753B]">
              Inteligência de Cardápio
            </span>
          </div>
          <p className="text-xs text-[#8F8278] mt-1">
            Análise aprofundada de procedimentos mais executados, lucratividade e satisfação
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Period Filter */}
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs font-medium text-[#2D2725] focus:outline-none focus:ring-1 focus:ring-[#B88746]"
          >
            <option value="hoje">Hoje</option>
            <option value="ontem">Ontem</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="mes_atual">Mês atual</option>
            <option value="mes_anterior">Mês anterior</option>
            <option value="ano">Ano 2026</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs font-medium text-[#2D2725] focus:outline-none focus:ring-1 focus:ring-[#B88746]"
          >
            <option value="todas">Todas as Categorias</option>
            <option value="sobrancelhas">Sobrancelhas & Cílios</option>
            <option value="facial">Faciais</option>
            <option value="depilacao">Depilação a Laser</option>
            <option value="massagens">Massagens</option>
          </select>
        </div>
      </div>

      {/* Strategic KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Mais Realizado */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4DC]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8F8278] mb-1.5">
            <span className="uppercase text-[10px] tracking-wider">Mais Realizado</span>
            <Trophy size={14} className="text-[#C5A880]" />
          </div>
          <h3
            className="text-sm font-medium text-graphite truncate max-w-[180px]"
            title={highlights.mostPerformed.name}
          >
            {highlights.mostPerformed.name}
          </h3>
          <div className="text-xs text-[#524842] mt-1 flex items-center justify-between">
            <span>{highlights.mostPerformed.timesPerformed} atendimentos</span>
            <span className="font-bold text-[#B88746]">{highlights.mostPerformed.percentage}% do total</span>
          </div>
        </div>

        {/* Mais Rentável */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4DC]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8F8278] mb-1.5">
            <span className="uppercase text-[10px] tracking-wider">Maior Margem de Lucro</span>
            <Percent size={14} className="text-emerald-700" />
          </div>
          <h3
            className="text-sm font-medium text-graphite truncate max-w-[180px]"
            title={highlights.mostProfitable.name}
          >
            {highlights.mostProfitable.name}
          </h3>
          <div className="text-xs text-[#524842] mt-1 flex items-center justify-between">
            <span>Lucro R$ {(highlights.mostProfitable.price - highlights.mostProfitable.cost).toFixed(2)}</span>
            <span className="font-bold text-emerald-700">Margem {highlights.mostProfitable.profitMargin}%</span>
          </div>
        </div>

        {/* Maior Faturamento */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4DC]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8F8278] mb-1.5">
            <span className="uppercase text-[10px] tracking-wider">Maior Faturamento</span>
            <DollarSign size={14} className="text-[#B88746]" />
          </div>
          <h3
            className="text-sm font-medium text-graphite truncate max-w-[180px]"
            title={highlights.highestRevenue.name}
          >
            {highlights.highestRevenue.name}
          </h3>
          <div className="text-xs text-[#524842] mt-1 flex items-center justify-between">
            <span>Receita Acumulada</span>
            <span className="font-bold text-[#2D2725]">R$ {highlights.highestRevenue.revenue.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        {/* Melhor Avaliação */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4DC]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8F8278] mb-1.5">
            <span className="uppercase text-[10px] tracking-wider">Melhor Avaliação</span>
            <Star size={14} className="text-amber-500 fill-amber-500" />
          </div>
          <h3
            className="text-sm font-medium text-graphite truncate max-w-[180px]"
            title={highlights.bestRated.name}
          >
            {highlights.bestRated.name}
          </h3>
          <div className="text-xs text-[#524842] mt-1 flex items-center justify-between">
            <span>Satisfação Clínica</span>
            <span className="font-bold text-amber-700">★ {highlights.bestRated.averageRating} (99.8%)</span>
          </div>
        </div>
      </div>

      {/* Participação por Serviço (Donut / Visual Bar breakdown) */}
      <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#EAE2D8]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#2D2725] uppercase tracking-wide">
            Participação no Volume Total de Atendimentos
          </span>
          <span className="text-xs text-[#8F8278]">{totalTimes} procedimentos mapeados</span>
        </div>

        {/* Horizontal Stacked Bar */}
        <div className="h-3 w-full rounded-full bg-[#E5DDD2] overflow-hidden flex">
          {ranking.map((s) => (
            <div
              key={s.id}
              style={{
                width: `${s.percentage}%`,
                backgroundColor: s.color,
              }}
              title={`${s.name}: ${s.percentage}%`}
              className="h-full transition-all hover:opacity-90"
            />
          ))}
        </div>

        {/* Legend pills */}
        <div className="flex items-center gap-3 sm:gap-4 mt-3 flex-wrap">
          {ranking.slice(0, 4).map((s) => (
            <div key={s.id} className="flex items-center gap-1.5 text-xs text-[#5C524B]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="font-medium truncate max-w-[140px]">{s.name}</span>
              <span className="font-bold text-[#2D2725]">({s.percentage}%)</span>
            </div>
          ))}
          <div className="text-xs text-[#8F8278]">Demais procedimentos (22%)</div>
        </div>
      </div>

      {/* Main Ranking Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#EFEAE2] text-[#8F8278] uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3 font-semibold">Posição</th>
              <th className="py-2.5 px-3 font-semibold">Serviço / Procedimento</th>
              <th className="py-2.5 px-3 font-semibold">Categoria</th>
              <th className="py-2.5 px-3 font-semibold text-center">Atendimentos</th>
              <th className="py-2.5 px-3 font-semibold text-center">% Total</th>
              <th className="py-2.5 px-3 font-semibold text-right">Faturamento</th>
              <th className="py-2.5 px-3 font-semibold text-right">Ticket Médio</th>
              <th className="py-2.5 px-3 font-semibold text-right">Margem Est.</th>
              <th className="py-2.5 px-3 font-semibold text-center">Nota Média</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F7F4EF]">
            {filteredRanking.map((item) => (
              <tr key={item.id} className="hover:bg-[#FAF8F5] transition-colors group">
                <td className="py-3 px-3 font-bold text-[#2D2725]">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-[11px] ${
                      item.position === 1
                        ? 'bg-[#FAF2E6] text-[#9C753B] font-extrabold border border-[#ECD9BD]'
                        : item.position === 2
                        ? 'bg-[#F2ECE5] text-[#554A43]'
                        : 'text-[#8F8278]'
                    }`}
                  >
                    {item.position}º
                  </span>
                </td>
                <td className="py-3 px-3 font-semibold text-[#2D2725]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <h3
                      className="text-sm font-medium text-graphite truncate max-w-[150px] sm:max-w-[240px]"
                      title={item.name}
                    >
                      {item.name}
                    </h3>
                  </div>
                </td>
                <td className="py-3 px-3 text-[#7A6E65]">{item.category}</td>
                <td className="py-3 px-3 text-center font-bold text-[#2D2725]">
                  {item.timesPerformed}
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF4ED] text-[#9C753B]">
                    {item.percentage}%
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-semibold text-[#2D2725]">
                  R$ {item.revenue.toLocaleString('pt-BR')}
                </td>
                <td className="py-3 px-3 text-right text-[#5C524B]">
                  R$ {item.ticketMedio.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="font-bold text-emerald-800">
                    {item.profitMargin.toFixed(1)}%
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="inline-flex items-center gap-1 font-semibold text-[#B88746]">
                    ★ {item.averageRating.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
