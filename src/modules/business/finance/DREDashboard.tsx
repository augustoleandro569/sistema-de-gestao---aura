import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Calendar,
  Plus,
  Download,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Sliders,
  Sparkles,
  Info,
  CheckCircle2,
  Trash2,
  Receipt,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';
import { dataService } from '../../../services/dataService';
import { DREPeriodData, PaymentMethod } from '../../../types';
import { useBusiness } from '../../../core/BusinessContext';

interface DREDashboardProps {
  onNavigateToEstoque?: () => void;
}

interface FinanceCardProps {
  title: string;
  value: string;
  trend?: string;
  icon?: React.ReactNode;
  color?: 'rose' | 'emerald' | 'default';
  highlight?: boolean;
  subtitle?: string;
}

const FinanceCard: React.FC<FinanceCardProps> = ({
  title,
  value,
  trend,
  icon,
  color = 'default',
  highlight = false,
  subtitle,
}) => {
  return (
    <div
      className={`p-6 sm:p-7 rounded-[32px] border transition-all duration-300 relative overflow-hidden ${
        highlight
          ? 'bg-gradient-to-br from-[#FAF5F0] via-white to-[#F6EDE8] border-aura-rose/50 shadow-luminous ring-1 ring-aura-rose/30'
          : 'bg-white border-aura-linen shadow-luminous hover:shadow-soft-glow'
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
            highlight ? 'text-rose-600' : 'text-aura-taupe'
          }`}
        >
          {title}
        </span>
        {icon && (
          <div
            className={`p-2.5 rounded-2xl ${
              highlight
                ? 'bg-rose-100/60 text-rose-700'
                : color === 'rose'
                ? 'bg-rose-50 text-rose-600'
                : 'bg-aura-linen/60 text-aura-charcoal'
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2.5">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-aura-charcoal tracking-tight">
          {value}
        </h3>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
              trend.startsWith('+')
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
                : 'text-rose-700 bg-rose-50 border border-rose-200/60'
            }`}
          >
            {trend.startsWith('+') ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] text-aura-taupe mt-1.5 font-medium">{subtitle}</p>
      )}
    </div>
  );
};

interface DRERowProps {
  label: string;
  value: string;
  bold?: boolean;
  negative?: boolean;
  indent?: boolean;
  subtotal?: boolean;
  badge?: string;
  tooltip?: string;
  actionButton?: React.ReactNode;
}

const DRERow: React.FC<DRERowProps> = ({
  label,
  value,
  bold = false,
  negative = false,
  indent = false,
  subtotal = false,
  badge,
  tooltip,
  actionButton,
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3 transition-all ${
        indent ? 'pl-4 sm:pl-8' : ''
      } ${
        subtotal
          ? 'border-y border-aura-linen/80 bg-[#FAF8F6] px-4 sm:px-6 rounded-2xl my-2 font-bold'
          : 'border-b border-aura-linen/40'
      }`}
    >
      <div className="flex items-center gap-2.5 flex-wrap">
        <span
          className={`text-xs sm:text-sm tracking-wide ${
            subtotal
              ? 'font-bold text-aura-charcoal'
              : bold
              ? 'font-bold text-aura-charcoal'
              : 'text-aura-taupe font-medium'
          }`}
        >
          {label}
        </span>
        {badge && (
          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
            {badge}
          </span>
        )}
        {tooltip && (
          <span title={tooltip} className="text-aura-taupe/60 hover:text-aura-charcoal cursor-help">
            <Info size={13} />
          </span>
        )}
        {actionButton}
      </div>

      <span
        className={`font-mono text-xs sm:text-sm whitespace-nowrap ${
          negative
            ? 'text-rose-600 font-semibold'
            : subtotal
            ? 'text-aura-charcoal font-bold text-sm sm:text-base'
            : bold
            ? 'text-aura-charcoal font-bold'
            : 'text-aura-charcoal font-medium'
        }`}
      >
        {negative ? `- R$ ${value}` : `R$ ${value}`}
      </span>
    </div>
  );
};

export const DREDashboard: React.FC<DREDashboardProps> = ({ onNavigateToEstoque }) => {
  const { currentBusiness } = useBusiness();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Setembro / 2026');
  const [selectedUnit, setSelectedUnit] = useState<string>(dataService.getActiveUnitId() || 'todos');
  
  // Taxas de Cartão por Unidade (Deduções configuráveis)
  const [cardTaxRates, setCardTaxRates] = useState<Record<string, number>>({
    todos: 5.0,
    'unit-matriz': 5.0,
    'unit-itaim': 4.8,
  });
  const [isCardTaxModalOpen, setIsCardTaxModalOpen] = useState(false);
  const [currentUnitTaxInput, setCurrentUnitTaxInput] = useState('5.0');

  // Detalhamentos Accordion
  const [showInsumosDetail, setShowInsumosDetail] = useState(false);
  const [showComissoesDetail, setShowComissoesDetail] = useState(false);
  const [showCustosFixosDetail, setShowCustosFixosDetail] = useState(false);

  // Movimentações & Lançamentos
  const [txFilterType, setTxFilterType] = useState<'todos' | 'entrada' | 'saida'>('todos');
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Formulário de Nova Despesa / Custo Fixo
  const [newTxForm, setNewTxForm] = useState({
    type: 'saida' as 'entrada' | 'saida',
    description: '',
    category: 'Aluguel & Condomínio',
    amount: '',
    unitId: selectedUnit === 'todos' || selectedUnit === 'ALL' ? 'unit-matriz' : selectedUnit,
    paymentMethod: 'pix' as PaymentMethod,
    date: new Date().toISOString().split('T')[0],
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Unidades do Estabelecimento
  const units = dataService.getUnits();

  // Re-render ao atualizar dados
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsub = dataService.subscribe(() => setTick((t) => t + 1));
    return () => unsub();
  }, []);

  const activeCardTaxRate = cardTaxRates[selectedUnit] ?? 5.0;

  // Cálculo DRE em Tempo Real (cruzando Agendamentos Finalizados + Ficha Técnica + Custos Fixos)
  const dreData: DREPeriodData = useMemo(() => {
    return dataService.calculateDRE({
      period: selectedPeriod,
      unitId: selectedUnit,
      cardTaxRate: activeCardTaxRate,
    });
  }, [selectedPeriod, selectedUnit, activeCardTaxRate, toastMessage]);

  // Transações financeiras
  const transactions = useMemo(() => {
    const txs = dataService.getTransactions(selectedUnit);
    return txs.filter((t) => {
      if (txFilterType === 'todos') return true;
      return t.type === txFilterType;
    });
  }, [selectedUnit, txFilterType, toastMessage]);

  // Salvar Nova Transação / Custo Fixo
  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newTxForm.amount.replace(',', '.'));
    if (!newTxForm.description.trim() || isNaN(val) || val <= 0) {
      alert('Por favor, informe a descrição e um valor numérico válido.');
      return;
    }

    dataService.addFinancialTransaction({
      organizationId: currentBusiness?.id || 'org-sublime-01',
      unitId: newTxForm.unitId,
      unit_id: newTxForm.unitId,
      type: newTxForm.type,
      category: newTxForm.category,
      description: newTxForm.description.trim(),
      amount: val,
      date: newTxForm.date,
      paymentMethod: newTxForm.paymentMethod,
      status: 'concluido',
    });

    showToast('Lançamento registrado com sucesso no DRE contábil!');
    setIsNewTxModalOpen(false);
    setNewTxForm({
      type: 'saida',
      description: '',
      category: 'Aluguel & Condomínio',
      amount: '',
      unitId: selectedUnit === 'todos' || selectedUnit === 'ALL' ? 'unit-matriz' : selectedUnit,
      paymentMethod: 'pix',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Deseja excluir este lançamento do fluxo de caixa e DRE?')) {
      dataService.deleteFinancialTransaction(id);
      showToast('Lançamento removido do exercício.');
    }
  };

  const handleSaveTaxRate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(currentUnitTaxInput.replace(',', '.'));
    if (isNaN(parsed) || parsed < 0 || parsed > 30) {
      alert('Informe uma taxa percentual válida entre 0% e 30%.');
      return;
    }
    setCardTaxRates((prev) => ({
      ...prev,
      [selectedUnit]: parsed,
    }));
    setIsCardTaxModalOpen(false);
    showToast(`Taxa de retenção atualizada para ${parsed.toFixed(1)}% na unidade selecionada!`);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-sans text-aura-charcoal">
      {/* TOAST FLUTUANTE */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-[#2D2725] text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 text-xs font-medium">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* HEADER EXECUTIVO */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 px-2">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.3em]">
            Gestão de Lucratividade
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif text-aura-charcoal">DRE &amp; Financeiro</h1>
          <p className="text-sm text-aura-taupe">
            Análise profunda de faturamento, custos de insumos e margem líquida.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Seletor de Unidade (Multi-unidade) */}
          <div className="bg-white border border-aura-linen px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xs">
            <Building size={14} className="text-aura-taupe" />
            <span className="text-[10px] font-bold text-aura-taupe uppercase">Unidade:</span>
            <select
              value={selectedUnit}
              onChange={(e) => {
                setSelectedUnit(e.target.value);
                setCurrentUnitTaxInput((cardTaxRates[e.target.value] ?? 5.0).toString());
              }}
              className="text-xs font-bold text-aura-charcoal outline-none bg-transparent cursor-pointer"
            >
              <option value="todos">Todas as Unidades (Consolidado)</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Seletor de Período */}
          <div className="bg-white border border-aura-linen px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xs">
            <Calendar size={14} className="text-aura-taupe" />
            <span className="text-[10px] font-bold text-aura-taupe uppercase">Período:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-xs font-bold text-aura-charcoal outline-none bg-transparent cursor-pointer"
            >
              <option value="Setembro / 2026">Setembro / 2026</option>
              <option value="Agosto / 2026">Agosto / 2026</option>
              <option value="Julho / 2026">Julho / 2026</option>
            </select>
          </div>

          {/* Botão Configurar Taxas de Cartão */}
          <button
            type="button"
            onClick={() => {
              setCurrentUnitTaxInput((cardTaxRates[selectedUnit] ?? 5.0).toString());
              setIsCardTaxModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-aura-linen hover:border-aura-rose/60 text-xs font-bold text-aura-charcoal transition-all shadow-xs cursor-pointer"
            title="Configurar deduções de taxa de cartão por filial"
          >
            <CreditCard size={14} className="text-rose-500" />
            <span>Taxa Cartão: {activeCardTaxRate.toFixed(1)}%</span>
          </button>

          {/* Botão Novo Lançamento Fixo */}
          <button
            type="button"
            onClick={() => setIsNewTxModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-aura-charcoal hover:bg-black text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus size={14} className="text-rose-300" />
            <span>Lançar Custo Fixo</span>
          </button>

          {/* Exportar */}
          <button
            type="button"
            onClick={() => window.print()}
            className="p-2.5 rounded-2xl bg-white border border-aura-linen hover:bg-aura-linen text-aura-taupe hover:text-aura-charcoal transition-all cursor-pointer shadow-xs"
            title="Exportar DRE para Impressão / PDF"
          >
            <Download size={15} />
          </button>
        </div>
      </header>

      {/* CARDS DE PERFORMANCE REAL */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinanceCard
          title="Faturamento Bruto"
          value={`R$ ${dreData.faturamentoBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          trend="+12%"
          icon={<TrendingUp size={20} />}
          subtitle={`${dreData.atendimentosCount} atendimentos concluídos na agenda`}
        />
        <FinanceCard
          title="Custos Variáveis"
          value={`R$ ${(dreData.custoInsumos + dreData.custoComissoes + dreData.impostosETaxas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          trend="-4%"
          icon={<TrendingDown size={20} />}
          color="rose"
          subtitle="Taxas de cartão, insumos e comissões"
        />
        <FinanceCard
          title="Lucro Líquido"
          value={`R$ ${dreData.lucroLiquidoReal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          highlight={true}
          subtitle="Lucro real livre de despesas e insumos"
        />
        <FinanceCard
          title="Margem de Lucro"
          value={`${dreData.margemLiquidaPercent.toFixed(1)}%`}
          icon={<PieChart size={20} />}
          subtitle={`Margem de Contribuição: ${dreData.margemContribuicaoPercent.toFixed(1)}%`}
        />
      </section>

      {/* AUDITORIA DE ESTOQUE & DESVIO DE INSUMOS */}
      {dreData.temAlertaDesperdicio && (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-[32px] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle size={22} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Ajuste de Veracidade do Estoque (Auditoria Inteligente)
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-mono font-bold">
                  Desvio: R$ {dreData.desperdicioAuditado.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-amber-800/90 leading-relaxed max-w-3xl">
                O cálculo do DRE cruza o consumo esperado na Ficha Técnica com as baixas de estoque. Detectamos saídas não faturadas ou avarias que impactam a margem líquida real.
              </p>
            </div>
          </div>

          {onNavigateToEstoque && (
            <button
              type="button"
              onClick={onNavigateToEstoque}
              className="px-5 py-2.5 rounded-full bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
            >
              Auditar Estoque Agora
            </button>
          )}
        </div>
      )}

      {/* TABELA DRE ESTRUTURADA */}
      <section className="bg-white rounded-[48px] shadow-luminous border border-aura-linen overflow-hidden">
        <div className="p-8 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-aura-linen pb-4">
            <div>
              <h3 className="text-xs font-bold text-aura-taupe uppercase tracking-[0.2em]">
                Demonstrativo de Resultado (Exercício Mensal)
              </h3>
              <p className="text-xs text-aura-charcoal/70 mt-0.5">
                Vínculo com Agenda (Status Finalizado) + Ficha Técnica de Estoque + Despesas Fixas
              </p>
            </div>
            <span className="text-[11px] font-bold text-aura-taupe bg-[#FAF8F6] px-3.5 py-1.5 rounded-full border border-aura-linen">
              {selectedPeriod} • {selectedUnit === 'todos' ? 'Consolidado da Rede' : units.find((u) => u.id === selectedUnit)?.name || selectedUnit}
            </span>
          </div>

          <div className="space-y-3">
            {/* RECEITA */}
            <DRERow
              label="(+) RECEITA BRUTA DE SERVIÇOS"
              value={dreData.faturamentoBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              bold
              tooltip="Total somado dos atendimentos concluídos/pagos na agenda da unidade selecionada."
            />

            <DRERow
              label={`(-) Taxas de Cartão & Impostos (${activeCardTaxRate.toFixed(1)}%)`}
              value={dreData.impostosETaxas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              negative
              indent
              tooltip="Deduções calculadas automaticamente com base na taxa configurada para a filial."
              actionButton={
                <button
                  type="button"
                  onClick={() => setIsCardTaxModalOpen(true)}
                  className="text-[10px] text-rose-600 hover:underline font-bold"
                >
                  Alterar taxa
                </button>
              }
            />

            <DRERow
              label="(=) RECEITA LÍQUIDA"
              value={dreData.receitaLiquida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              subtotal
              tooltip="Faturamento Bruto menos retenções tributárias e operadoras de cartão."
            />

            <div className="h-4" />

            {/* CUSTOS VARIÁVEIS (CPV) */}
            <div>
              <DRERow
                label="(-) CUSTOS DE INSUMOS (CONSUMO TÉCNICO)"
                value={dreData.custoInsumos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                negative
                indent
                tooltip="Soma dos insumos consumidos em cada procedimento via Ficha Técnica com custo médio de entrada no estoque."
                actionButton={
                  <button
                    type="button"
                    onClick={() => setShowInsumosDetail(!showInsumosDetail)}
                    className="text-[10px] text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {showInsumosDetail ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {showInsumosDetail ? 'Ocultar Ficha Técnica' : 'Ver Ficha Técnica'}
                  </button>
                }
              />

              {/* Detalhamento Ficha Técnica */}
              {showInsumosDetail && (
                <div className="ml-4 sm:ml-8 my-3 p-5 rounded-3xl bg-[#FAF8F5] border border-aura-linen space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-aura-taupe">
                      Consumo Técnico por Procedimento Realizado
                    </span>
                    <span className="text-[10px] text-aura-taupe italic">
                      Calculado por ml/g x custo unitário médio do estoque
                    </span>
                  </div>

                  <div className="space-y-2">
                    {dreData.detalhesInsumosPorServico.length > 0 ? (
                      dreData.detalhesInsumosPorServico.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-xs p-2.5 bg-white rounded-xl border border-aura-linen/60"
                        >
                          <span className="font-semibold text-aura-charcoal">
                            {item.serviceName}{' '}
                            <span className="text-aura-taupe font-normal">
                              ({item.count} atendimentos concluídos)
                            </span>
                          </span>
                          <span className="font-mono text-rose-600 font-bold">
                            - R$ {item.totalCost.toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-aura-taupe italic">
                        Nenhum atendimento finalizado registrado com materiais vinculados no período.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <DRERow
                label="(-) COMISSÕES DE PROFISSIONAIS"
                value={dreData.custoComissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                negative
                indent
                tooltip="Repasses contratuais calculados individualmente sobre o valor faturado por especialista."
                actionButton={
                  <button
                    type="button"
                    onClick={() => setShowComissoesDetail(!showComissoesDetail)}
                    className="text-[10px] text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {showComissoesDetail ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {showComissoesDetail ? 'Ocultar Repasses' : 'Ver Comissões'}
                  </button>
                }
              />

              {/* Detalhamento Comissões */}
              {showComissoesDetail && (
                <div className="ml-4 sm:ml-8 my-3 p-5 rounded-3xl bg-[#FAF8F5] border border-aura-linen space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-aura-taupe block">
                    Repasse por Especialista (Agenda Concluída)
                  </span>

                  <div className="space-y-2">
                    {dreData.detalhesComissoesPorProfissional.length > 0 ? (
                      dreData.detalhesComissoesPorProfissional.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-xs p-2.5 bg-white rounded-xl border border-aura-linen/60"
                        >
                          <span className="font-semibold text-aura-charcoal">
                            {item.professionalName}{' '}
                            <span className="text-aura-taupe font-normal">
                              ({item.count} sessões executadas)
                            </span>
                          </span>
                          <span className="font-mono text-rose-600 font-bold">
                            - R$ {item.totalCommission.toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-aura-taupe italic">
                        Sem comissões calculadas no período filtrado.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <DRERow
              label="(=) MARGEM DE CONTRIBUIÇÃO"
              value={dreData.margemContribuicao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              subtotal
              badge={`${dreData.margemContribuicaoPercent.toFixed(1)}%`}
              tooltip="O que sobra após pagar insumos e comissões diretas para arcar com a estrutura fixa da clínica."
            />

            <div className="h-4" />

            {/* CUSTOS FIXOS */}
            <div>
              <DRERow
                label="(-) DESPESAS OPERACIONAIS (ALUGUEL, LUZ, SOFTWARE, PRÓ-LABORE)"
                value={dreData.custosFixos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                negative
                indent
                tooltip="Custos estruturais lançados manualmente no módulo financeiro."
                actionButton={
                  <button
                    type="button"
                    onClick={() => setShowCustosFixosDetail(!showCustosFixosDetail)}
                    className="text-[10px] text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {showCustosFixosDetail ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {showCustosFixosDetail ? 'Ocultar Despesas' : 'Ver Composição'}
                  </button>
                }
              />

              {/* Detalhamento Custos Fixos */}
              {showCustosFixosDetail && (
                <div className="ml-4 sm:ml-8 my-3 p-5 rounded-3xl bg-[#FAF8F5] border border-aura-linen space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-aura-taupe">
                      Lançamentos Contábeis Estruturais
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsNewTxModalOpen(true)}
                      className="text-[10px] font-bold text-aura-charcoal hover:underline"
                    >
                      + Novo Custo Fixo
                    </button>
                  </div>

                  <div className="space-y-2">
                    {dreData.custosFixosDetails.map((fixo, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs p-2.5 bg-white rounded-xl border border-aura-linen/60"
                      >
                        <div>
                          <span className="font-bold text-aura-charcoal">{fixo.category}:</span>{' '}
                          <span className="text-aura-taupe">{fixo.description}</span>
                        </div>
                        <span className="font-mono text-rose-600 font-bold">
                          - R$ {fixo.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RESULTADO FINAL (LUMINOUS LUXURY) */}
            <div className="mt-12 bg-aura-charcoal text-white p-8 sm:p-10 rounded-[32px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-soft-glow">
              <div>
                <p className="text-[10px] font-bold text-aura-rose uppercase tracking-[0.3em] mb-2">
                  Resultado Líquido Final
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold">
                  R$ {dreData.lucroLiquidoReal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Margem líquida de {dreData.margemLiquidaPercent.toFixed(1)}% sobre o faturamento bruto.
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center sm:justify-end gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Saúde Financeira: {dreData.margemLiquidaPercent >= 40 ? 'Excelente' : dreData.margemLiquidaPercent >= 20 ? 'Boa' : 'Atenção'}
                </p>
                <p className="text-xs text-gray-300 mt-1 font-medium">
                  {dreData.margemLiquidaPercent >= 40
                    ? 'Sua margem está 15% acima da média do setor'
                    : 'Margem alinhada com as melhores clínicas da rede'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE FLUXO DE CAIXA (MOVIMENTAÇÕES & LANÇAMENTOS) */}
      <section className="bg-white rounded-[48px] shadow-luminous border border-aura-linen p-8 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aura-linen">
          <div>
            <div className="flex items-center gap-2">
              <Receipt size={18} className="text-rose-400" />
              <h3 className="font-serif text-xl font-bold text-aura-charcoal">
                Extrato Financeiro &amp; Fluxo de Caixa
              </h3>
            </div>
            <p className="text-xs text-aura-taupe mt-0.5">
              Histórico detalhado de despesas fixas, sangrias, aportes e recebimentos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-2xl bg-[#FAF8F5] p-1 border border-aura-linen">
              {(['todos', 'entrada', 'saida'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTxFilterType(type)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer ${
                    txFilterType === type
                      ? 'bg-white text-aura-charcoal shadow-xs border border-aura-linen'
                      : 'text-aura-taupe hover:text-aura-charcoal'
                  }`}
                >
                  {type === 'todos' ? 'Todos' : type === 'entrada' ? 'Entradas' : 'Saídas'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsNewTxModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-aura-charcoal text-white text-xs font-bold shadow-xs hover:bg-black transition-all cursor-pointer"
            >
              <Plus size={14} className="text-rose-300" />
              <span>Novo Lançamento</span>
            </button>
          </div>
        </div>

        {/* TABELA DE MOVIMENTAÇÕES */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-aura-linen text-aura-taupe uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-3">Data</th>
                <th className="py-3 px-3">Descrição</th>
                <th className="py-3 px-3">Categoria</th>
                <th className="py-3 px-3">Unidade</th>
                <th className="py-3 px-3">Forma</th>
                <th className="py-3 px-3 text-right">Valor</th>
                <th className="py-3 px-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aura-linen/40">
              {transactions.length > 0 ? (
                transactions.map((tx) => {
                  const txUnit = units.find((u) => u.id === tx.unitId || u.id === tx.unit_id);
                  return (
                    <tr key={tx.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3 px-3 text-aura-taupe whitespace-nowrap">{tx.date}</td>
                      <td className="py-3 px-3 font-bold text-aura-charcoal">{tx.description}</td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F6] text-aura-taupe border border-aura-linen text-[10px] font-medium">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-aura-taupe">
                        <span className="text-[11px]">
                          {txUnit ? txUnit.name : 'Unidade Principal'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-aura-charcoal uppercase text-[10px] font-bold">
                        {tx.paymentMethod}
                      </td>
                      <td className="py-3 px-3 text-right font-bold font-mono">
                        <span className={tx.type === 'entrada' ? 'text-emerald-700' : 'text-rose-600'}>
                          {tx.type === 'entrada' ? '+ ' : '- '}
                          R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteTransaction(tx.id)}
                          className="p-1 text-aura-taupe hover:text-rose-600 transition-colors cursor-pointer"
                          title="Excluir lançamento"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-aura-taupe text-xs">
                    Nenhum lançamento financeiro encontrado no período.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MODAL: NOVO LANÇAMENTO DE CUSTO FIXO / ENTRADA */}
      {/* ============================================================ */}
      {isNewTxModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[36px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-aura-linen space-y-6">
            <div className="flex justify-between items-center border-b border-aura-linen pb-4">
              <div>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">
                  Contabilidade &amp; DRE
                </span>
                <h3 className="text-xl font-serif font-bold text-aura-charcoal">
                  Novo Lançamento Financeiro
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewTxModalOpen(false)}
                className="p-2 text-aura-taupe hover:text-aura-charcoal rounded-full hover:bg-aura-linen"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block mb-1.5">
                  Tipo de Lançamento
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTxForm({ ...newTxForm, type: 'saida' })}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      newTxForm.type === 'saida'
                        ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-2xs'
                        : 'bg-[#FAF8F5] text-aura-taupe border-aura-linen'
                    }`}
                  >
                    (-) Despesa / Custo Fixo
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTxForm({ ...newTxForm, type: 'entrada' })}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      newTxForm.type === 'entrada'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs'
                        : 'bg-[#FAF8F5] text-aura-taupe border-aura-linen'
                    }`}
                  >
                    (+) Receita Extraordinária
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aluguel Unidade Jardins, Conta de Luz Enel, Pró-labore Sócios"
                  value={newTxForm.description}
                  onChange={(e) => setNewTxForm({ ...newTxForm, description: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen focus:border-rose-400 outline-none text-aura-charcoal font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block mb-1">
                  Categoria Contábil
                </label>
                <select
                  value={newTxForm.category}
                  onChange={(e) => setNewTxForm({ ...newTxForm, category: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen focus:border-rose-400 outline-none text-aura-charcoal cursor-pointer"
                >
                  <option value="Aluguel & Condomínio">Aluguel &amp; Condomínio</option>
                  <option value="Energia & Água">Energia Elétrica &amp; Água</option>
                  <option value="Software & Plataforma Aura">Software &amp; Plataforma Aura</option>
                  <option value="Pró-labore Sócios">Pró-labore Sócios</option>
                  <option value="Insumos & Descartáveis">Insumos &amp; Descartáveis</option>
                  <option value="Comissões Profissionais">Comissões de Especialistas</option>
                  <option value="Marketing & Tráfego">Marketing &amp; Anúncios</option>
                  <option value="Outras Despesas">Outras Despesas Operacionais</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0,00"
                    value={newTxForm.amount}
                    onChange={(e) => setNewTxForm({ ...newTxForm, amount: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen focus:border-rose-400 outline-none font-mono font-bold text-aura-charcoal"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    required
                    value={newTxForm.date}
                    onChange={(e) => setNewTxForm({ ...newTxForm, date: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen focus:border-rose-400 outline-none text-aura-charcoal cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block mb-1">
                    Unidade
                  </label>
                  <select
                    value={newTxForm.unitId}
                    onChange={(e) => setNewTxForm({ ...newTxForm, unitId: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen focus:border-rose-400 outline-none text-aura-charcoal cursor-pointer"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={newTxForm.paymentMethod}
                    onChange={(e) =>
                      setNewTxForm({ ...newTxForm, paymentMethod: e.target.value as PaymentMethod })
                    }
                    className="w-full text-xs p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen focus:border-rose-400 outline-none text-aura-charcoal cursor-pointer"
                  >
                    <option value="pix">PIX</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="transferencia">Transferência Bancária</option>
                    <option value="dinheiro">Dinheiro Espécie</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-aura-linen">
                <button
                  type="button"
                  onClick={() => setIsNewTxModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-aura-linen hover:bg-aura-linen text-xs font-bold text-aura-taupe cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-full bg-aura-charcoal hover:bg-black text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Registrar no DRE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CONFIGURAR TAXAS DE CARTÃO POR UNIDADE */}
      {/* ============================================================ */}
      {isCardTaxModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[36px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-aura-linen space-y-6">
            <div className="flex justify-between items-center border-b border-aura-linen pb-4">
              <div>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">
                  Deduções de Faturamento
                </span>
                <h3 className="text-xl font-serif font-bold text-aura-charcoal">
                  Taxas de Cartão da Unidade
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCardTaxModalOpen(false)}
                className="p-2 text-aura-taupe hover:text-aura-charcoal rounded-full hover:bg-aura-linen"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTaxRate} className="space-y-4">
              <p className="text-xs text-aura-taupe leading-relaxed">
                Configure a taxa média ponderada de maquininhas, antecipação e tributos retidos na fonte para{' '}
                <strong className="text-aura-charcoal">
                  {selectedUnit === 'todos' ? 'Todas as Unidades (Média)' : units.find((u) => u.id === selectedUnit)?.name || selectedUnit}
                </strong>
                .
              </p>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block mb-1">
                  Taxa Média de Retenção (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="30"
                    required
                    value={currentUnitTaxInput}
                    onChange={(e) => setCurrentUnitTaxInput(e.target.value)}
                    className="w-full text-lg font-mono font-bold p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen focus:border-rose-400 outline-none text-aura-charcoal"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-aura-taupe">
                    %
                  </span>
                </div>
                <span className="text-[10px] text-aura-taupe mt-1 block">
                  Padrão do mercado: 3.5% a 6.0% (Débito, Crédito e Simples Nacional).
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-aura-linen">
                <button
                  type="button"
                  onClick={() => setIsCardTaxModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-aura-linen hover:bg-aura-linen text-xs font-bold text-aura-taupe cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-full bg-aura-charcoal hover:bg-black text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Salvar Taxa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default DREDashboard;
