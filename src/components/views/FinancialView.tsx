import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  CreditCard,
  Building,
  Calendar
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { RevenueChart } from '../dashboard/RevenueChart';

export const FinancialView: React.FC = () => {
  const metrics = dataService.getDashboardMetrics();
  const [filterType, setFilterType] = useState<string>('todos');
  const [selectedUnit, setSelectedUnit] = useState<string>(dataService.getActiveUnitId() || 'todos');

  const units = dataService.getUnits();

  // Transactions list with unit tagging
  const transactions = [
    { id: '1', unitId: 'unit-matriz', date: 'Hoje, 14:30', desc: 'Atendimento: Limpeza de Pele Profunda', category: 'Receita Serviços', type: 'entrada', amount: 165.0, method: 'PIX' },
    { id: '2', unitId: 'unit-matriz', date: 'Hoje, 11:15', desc: 'Atendimento: Depilação a Laser Soprano', category: 'Receita Serviços', type: 'entrada', amount: 280.0, method: 'Cartão Crédito' },
    { id: '3', unitId: 'unit-itaim', date: 'Hoje, 09:40', desc: 'Compra de Insumos & Descartáveis (Dermocosméticos)', category: 'Custos Diretos', type: 'saida', amount: 340.0, method: 'Boleto' },
    { id: '4', unitId: 'unit-itaim', date: 'Hoje, 08:30', desc: 'Atendimento: Design de Sobrancelhas + Henna', category: 'Receita Serviços', type: 'entrada', amount: 65.0, method: 'PIX' },
    { id: '5', unitId: 'unit-alphaville', date: 'Ontem, 18:00', desc: 'Repasse Semanal de Comissão - Mariana Santos', category: 'Comissões Profissionais', type: 'saida', amount: 940.0, method: 'Transferência' },
    { id: '6', unitId: 'unit-matriz', date: 'Ontem, 16:30', desc: 'Atendimento: Drenagem Linfática Facial', category: 'Receita Serviços', type: 'entrada', amount: 140.0, method: 'Cartão Débito' },
    { id: '7', unitId: 'unit-alphaville', date: 'Ontem, 10:00', desc: 'Manutenção Mensal de Ar-Condicionado & Salas', category: 'Despesas Fixas', type: 'saida', amount: 280.0, method: 'PIX' },
  ];

  const filteredTransactions = (transactions || []).filter((t) => {
    const matchesType = filterType === 'todos' ? true : t.type === filterType;
    const matchesUnit = selectedUnit === 'todos' || selectedUnit === 'ALL' ? true : t.unitId === selectedUnit;
    return matchesType && matchesUnit;
  });

  return (
    <div id="financial-view" className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EDE7DF] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D2725] text-[#F3E7DC] flex items-center justify-center">
            <DollarSign size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2D2725]">
              Gestão Financeira & DRE
            </h1>
            <p className="text-xs text-[#8F8278]">
              Controle de entradas, despesas, repasse de comissões e fluxo de caixa da clínica
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D2725] hover:bg-[#3D3532] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Plus size={15} className="text-[#E8D1C5]" />
            Lançar Despesa / Receita
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Entradas Mês */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDE7DF] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#8F8278] uppercase">
            <span>Faturamento Mensal</span>
            <ArrowUpRight size={16} className="text-emerald-700" />
          </div>
          <div className="font-display text-2xl font-bold text-[#2D2725] mt-2">
            R$ {metrics.faturamentoMes.toLocaleString('pt-BR')}
          </div>
          <div className="text-xs text-emerald-800 font-semibold mt-1">
            +18.5% comparado ao mês anterior
          </div>
        </div>

        {/* Despesas Mês */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDE7DF] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#8F8278] uppercase">
            <span>Despesas & Custos</span>
            <ArrowDownRight size={16} className="text-[#B84E3A]" />
          </div>
          <div className="font-display text-2xl font-bold text-[#B84E3A] mt-2">
            R$ {metrics.despesasMes.toLocaleString('pt-BR')}
          </div>
          <div className="text-xs text-[#8F8278] mt-1">
            Insumos, comissões e operacionais
          </div>
        </div>

        {/* Lucro Líquido */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDE7DF] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#8F8278] uppercase">
            <span>Resultado Líquido</span>
            <TrendingUp size={16} className="text-emerald-700" />
          </div>
          <div className="font-display text-2xl font-bold text-emerald-800 mt-2">
            R$ {metrics.resultadoFinanceiro.toLocaleString('pt-BR')}
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">
            Margem Líquida da Operação: 64.8%
          </div>
        </div>

        {/* Saldo em Contas */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDE7DF] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#8F8278] uppercase">
            <span>Saldo Atual em Caixa</span>
            <Building size={16} className="text-[#B88746]" />
          </div>
          <div className="font-display text-2xl font-bold text-[#2D2725] mt-2">
            R$ 84.620,00
          </div>
          <div className="text-xs text-[#8F8278] mt-1">
            Conta Principal Itaú + Safe PIX
          </div>
        </div>
      </div>

      {/* Chart */}
      <RevenueChart />

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EDE7DF] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F4EFEA]">
          <div>
            <h3 className="font-display text-lg font-bold text-[#2D2725]">
              Extrato Financeiro Recente
            </h3>
            <p className="text-xs text-[#8F8278]">
              Lançamentos conciliados automaticamente com a agenda
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs font-medium text-[#2D2725] focus:outline-none"
            >
              <option value="todos">Todas as Unidades</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            <div className="flex rounded-xl bg-[#F6F2EC] p-1 border border-[#E8E1D7]">
              <button
                type="button"
                onClick={() => setFilterType('todos')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filterType === 'todos' ? 'bg-white text-[#2D2725] shadow-xs' : 'text-[#85786E]'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setFilterType('entrada')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filterType === 'entrada' ? 'bg-white text-[#2D2725] shadow-xs' : 'text-[#85786E]'
                }`}
              >
                Entradas
              </button>
              <button
                type="button"
                onClick={() => setFilterType('saida')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filterType === 'saida' ? 'bg-white text-[#2D2725] shadow-xs' : 'text-[#85786E]'
                }`}
              >
                Saídas
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EFEAE2] text-[#8F8278] uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3 font-semibold">Data & Hora</th>
                <th className="py-2.5 px-3 font-semibold">Descrição</th>
                <th className="py-2.5 px-3 font-semibold">Categoria</th>
                <th className="py-2.5 px-3 font-semibold">Forma</th>
                <th className="py-2.5 px-3 font-semibold text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F4EF]">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-3 text-[#7A6E65]">{tx.date}</td>
                  <td className="py-3 px-3 font-semibold text-[#2D2725]">{tx.desc}</td>
                  <td className="py-3 px-3 text-[#7A6E65]">{tx.category}</td>
                  <td className="py-3 px-3 text-[#524842]">{tx.method}</td>
                  <td className="py-3 px-3 text-right font-bold font-display">
                    <span className={tx.type === 'entrada' ? 'text-emerald-800' : 'text-[#B84E3A]'}>
                      {tx.type === 'entrada' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
