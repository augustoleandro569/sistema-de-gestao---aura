import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

type Period = 'diario' | 'semanal' | 'mensal' | 'anual';
type ViewMode = 'faturamento' | 'entradas_saidas';

interface DataPoint {
  label: string;
  revenue: number;
  expenses: number;
  appointments: number;
}

const DATA_BY_PERIOD: Record<Period, DataPoint[]> = {
  diario: [
    { label: '08h', revenue: 280, expenses: 60, appointments: 2 },
    { label: '10h', revenue: 720, expenses: 140, appointments: 4 },
    { label: '12h', revenue: 540, expenses: 90, appointments: 3 },
    { label: '14h', revenue: 980, expenses: 180, appointments: 5 },
    { label: '16h', revenue: 640, expenses: 110, appointments: 3 },
    { label: '18h', revenue: 680, expenses: 120, appointments: 4 },
  ],
  semanal: [
    { label: 'Seg', revenue: 4200, expenses: 1400, appointments: 16 },
    { label: 'Ter', revenue: 5600, expenses: 1800, appointments: 21 },
    { label: 'Qua', revenue: 6100, expenses: 1950, appointments: 24 },
    { label: 'Qui', revenue: 7800, expenses: 2200, appointments: 28 },
    { label: 'Sex', revenue: 9400, expenses: 2900, appointments: 34 },
    { label: 'Sáb', revenue: 11200, expenses: 3400, appointments: 42 },
  ],
  mensal: [
    { label: 'Jan', revenue: 54200, expenses: 19800, appointments: 198 },
    { label: 'Fev', revenue: 58900, expenses: 21200, appointments: 215 },
    { label: 'Mar', revenue: 62400, expenses: 22600, appointments: 232 },
    { label: 'Abr', revenue: 61800, expenses: 21900, appointments: 225 },
    { label: 'Mai', revenue: 67100, expenses: 23800, appointments: 250 },
    { label: 'Jun', revenue: 65400, expenses: 23100, appointments: 242 },
    { label: 'Jul', revenue: 68900, expenses: 24500, appointments: 258 },
    { label: 'Ago', revenue: 71200, expenses: 25100, appointments: 270 },
    { label: 'Set (Atual)', revenue: 68450, expenses: 24120, appointments: 264 },
  ],
  anual: [
    { label: '2023', revenue: 480000, expenses: 185000, appointments: 1820 },
    { label: '2024', revenue: 640000, expenses: 230000, appointments: 2380 },
    { label: '2025', revenue: 785000, expenses: 275000, appointments: 2910 },
    { label: '2026 (Projetado)', revenue: 890000, expenses: 310000, appointments: 3400 },
  ],
};

export const RevenueChart: React.FC = () => {
  const [period, setPeriod] = useState<Period>('mensal');
  const [viewMode, setViewMode] = useState<ViewMode>('faturamento');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = DATA_BY_PERIOD[period];
  const maxVal = Math.max(...data.map((d) => Math.max(d.revenue, d.expenses))) * 1.15;

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = data.reduce((sum, d) => sum + d.expenses, 0);
  const netResult = totalRevenue - totalExpenses;
  const netMargin = totalRevenue > 0 ? ((netResult / totalRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EDE7DF] shadow-xs">
      {/* Header with Period and Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F4EFEA]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg sm:text-xl font-semibold text-[#2D2725]">
              {viewMode === 'faturamento' ? 'Evolução do Faturamento' : 'Fluxo: Entradas x Saídas'}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF2E6] text-[#9C753B]">
              +14.8% vs período ant.
            </span>
          </div>
          <p className="text-xs text-[#8F8278] mt-0.5">
            Dados financeiros consolidados com visão de margem e resultado
          </p>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode toggle */}
          <div className="flex rounded-xl bg-[#F6F2EC] p-1 border border-[#E8E1D7]">
            <button
              type="button"
              onClick={() => setViewMode('faturamento')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'faturamento'
                  ? 'bg-white text-[#2D2725] shadow-xs'
                  : 'text-[#85786E] hover:text-[#2D2725]'
              }`}
            >
              Faturamento
            </button>
            <button
              type="button"
              onClick={() => setViewMode('entradas_saidas')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'entradas_saidas'
                  ? 'bg-white text-[#2D2725] shadow-xs'
                  : 'text-[#85786E] hover:text-[#2D2725]'
              }`}
            >
              Entradas x Saídas
            </button>
          </div>

          {/* Period selector */}
          <div className="flex rounded-xl bg-[#F6F2EC] p-1 border border-[#E8E1D7]">
            {(['diario', 'semanal', 'mensal', 'anual'] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-all ${
                  period === p
                    ? 'bg-[#2D2725] text-white shadow-xs'
                    : 'text-[#85786E] hover:text-[#2D2725]'
                }`}
              >
                {p === 'diario' ? 'Diário' : p === 'semanal' ? 'Semanal' : p === 'mensal' ? 'Mensal' : 'Anual'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-[#F4EFEA]">
        <div>
          <span className="text-[11px] text-[#8F8278] block">Total Entradas</span>
          <span className="text-base font-bold text-[#2D2725] font-display">
            R$ {totalRevenue.toLocaleString('pt-BR')}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#8F8278] block">Total Despesas</span>
          <span className="text-base font-bold text-[#B84E3A] font-display">
            R$ {totalExpenses.toLocaleString('pt-BR')}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#8F8278] block">Resultado Líquido</span>
          <span className="text-base font-bold text-emerald-800 font-display">
            R$ {netResult.toLocaleString('pt-BR')}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#8F8278] block">Margem Líquida</span>
          <span className="text-base font-bold text-[#9C753B] font-display">
            {netMargin}%
          </span>
        </div>
      </div>

      {/* SVG Bar / Area Chart */}
      <div className="relative pt-6 pb-2 h-64 sm:h-72 w-full">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240" preserveAspectRatio="none">
          {/* Background horizontal guidelines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = 210 - ratio * 180;
            return (
              <g key={i}>
                <line x1="0" y1={y} x2="700" y2={y} stroke="#F2EDE6" strokeDasharray="3 3" strokeWidth="1" />
                <text x="0" y={y - 4} fill="#A89D93" fontSize="9" fontWeight="500">
                  R$ {Math.round((maxVal * ratio) / 1000)}k
                </text>
              </g>
            );
          })}

          {/* Render Bars / Shapes for each data point */}
          {data.map((d, index) => {
            const step = 700 / data.length;
            const x = index * step + step / 2;
            const revHeight = (d.revenue / maxVal) * 180;
            const expHeight = (d.expenses / maxVal) * 180;
            const barWidth = Math.min(step * 0.38, 28);
            const isHovered = hoveredIndex === index;

            return (
              <g
                key={d.label}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer transition-all"
              >
                {/* Subtle highlight column on hover */}
                {isHovered && (
                  <rect
                    x={x - step / 2 + 4}
                    y="10"
                    width={step - 8}
                    height="205"
                    fill="#FAF6F1"
                    rx="8"
                  />
                )}

                {viewMode === 'faturamento' ? (
                  // Single bar with gradient
                  <rect
                    x={x - barWidth / 2}
                    y={210 - revHeight}
                    width={barWidth}
                    height={revHeight}
                    fill={isHovered ? '#1F1B19' : '#2D2725'}
                    rx="6"
                    className="transition-all"
                  />
                ) : (
                  // Dual bar: Revenue and Expense
                  <>
                    <rect
                      x={x - barWidth - 1}
                      y={210 - revHeight}
                      width={barWidth}
                      height={revHeight}
                      fill={isHovered ? '#1F1B19' : '#332D2A'}
                      rx="4"
                    />
                    <rect
                      x={x + 1}
                      y={210 - expHeight}
                      width={barWidth}
                      height={expHeight}
                      fill={isHovered ? '#D89F95' : '#E8B4AB'}
                      rx="4"
                    />
                  </>
                )}

                {/* X-axis label */}
                <text
                  x={x}
                  y="230"
                  textAnchor="middle"
                  fill={isHovered ? '#2D2725' : '#8F8278'}
                  fontSize="11"
                  fontWeight={isHovered ? '600' : '400'}
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div className="absolute top-2 right-4 bg-[#2D2725] text-white p-3 rounded-xl shadow-xl text-xs space-y-1 animate-in fade-in duration-100 z-10 border border-[#433A37]">
            <div className="font-semibold text-[#E8D1C5] border-b border-[#433A37] pb-1">
              Período: {data[hoveredIndex].label}
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#BFB2A8]">Faturamento:</span>
              <span className="font-bold text-white">
                R$ {data[hoveredIndex].revenue.toLocaleString('pt-BR')}
              </span>
            </div>
            {viewMode === 'entradas_saidas' && (
              <div className="flex justify-between gap-4">
                <span className="text-[#E8B4AB]">Despesas:</span>
                <span className="font-bold text-[#E8B4AB]">
                  R$ {data[hoveredIndex].expenses.toLocaleString('pt-BR')}
                </span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-[#BFB2A8]">Atendimentos:</span>
              <span className="font-medium text-white">
                {data[hoveredIndex].appointments} procedimentos
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="pt-3 flex items-center justify-between flex-wrap gap-2 text-xs text-[#8F8278]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#2D2725]" />
            <span>Faturamento / Entradas</span>
          </div>
          {viewMode === 'entradas_saidas' && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#E8B4AB]" />
              <span>Despesas / Saídas</span>
            </div>
          )}
        </div>
        <div className="text-[11px] text-[#A89D93]">
          Ticket médio mensal: R$ 228,50 • Crescimento anual: +18,5%
        </div>
      </div>
    </div>
  );
};
