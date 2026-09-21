import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle,
  Filter,
  Printer
} from 'lucide-react';
import { dataService } from '../../services/dataService';

export const ReportsView: React.FC = () => {
  const metrics = dataService.getDashboardMetrics();
  const { ranking } = dataService.getServicesPerformance();
  const [reportPeriod, setReportPeriod] = useState('mes_atual');

  const handleExport = () => {
    window.print();
  };

  return (
    <div id="reports-view" className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EDE7DF] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D2725] text-[#F3E7DC] flex items-center justify-center">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2D2725]">
              Relatórios Executivos & DRE
            </h1>
            <p className="text-xs text-[#8F8278]">
              Consolidação de faturamento, comissões, margem por serviço e taxa de retenção
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2D2725] hover:bg-[#3D3532] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Printer size={15} />
            Imprimir / Exportar PDF
          </button>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-[#EDE7DF] shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8F8278]">
            Volume de Atendimentos
          </span>
          <div className="font-display text-2xl font-bold text-[#2D2725]">
            264 procedimentos
          </div>
          <p className="text-xs text-[#7A6E65]">
            Média de 8.8 procedimentos por dia útil
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#EDE7DF] shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8F8278]">
            Ticket Médio
          </span>
          <div className="font-display text-2xl font-bold text-[#2D2725]">
            R$ {metrics.ticketMedio.toFixed(2)}
          </div>
          <p className="text-xs text-emerald-800 font-semibold">
            +6.4% acima da média do setor
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#EDE7DF] shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8F8278]">
            Taxa de Fidelização & Recompra
          </span>
          <div className="font-display text-2xl font-bold text-[#2D2725]">
            68.4%
          </div>
          <p className="text-xs text-[#7A6E65]">
            Clientes que retornaram em menos de 45 dias
          </p>
        </div>
      </div>

      {/* Detailed Services Breakdown Table for Print/Report */}
      <div className="bg-white rounded-3xl p-6 border border-[#EDE7DF] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4EFEA]">
          <h3 className="font-display text-lg font-bold text-[#2D2725]">
            Demonstrativo de Procedimentos Realizados no Período
          </h3>
          <span className="text-xs text-[#8F8278]">Mês Vigente (Setembro 2026)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EFEAE2] text-[#8F8278] uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3 font-semibold">Procedimento</th>
                <th className="py-2.5 px-3 font-semibold">Categoria</th>
                <th className="py-2.5 px-3 font-semibold text-center">Quantidade</th>
                <th className="py-2.5 px-3 font-semibold text-right">Faturamento Total</th>
                <th className="py-2.5 px-3 font-semibold text-right">Custo Total</th>
                <th className="py-2.5 px-3 font-semibold text-right">Lucro Bruto</th>
                <th className="py-2.5 px-3 font-semibold text-right">Margem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F4EF]">
              {ranking.map((item) => {
                const totalCost = item.cost * item.timesPerformed;
                const totalGrossProfit = item.revenue - totalCost;
                return (
                  <tr key={item.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-3 font-bold text-[#2D2725]">{item.name}</td>
                    <td className="py-3 px-3 text-[#7A6E65]">{item.category}</td>
                    <td className="py-3 px-3 text-center font-bold text-[#2D2725]">
                      {item.timesPerformed}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-[#2D2725]">
                      R$ {item.revenue.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-3 text-right text-[#B84E3A]">
                      R$ {totalCost.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-800">
                      R$ {totalGrossProfit.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#2D2725]">
                      {item.profitMargin.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
