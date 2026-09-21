// src/pages/admin/Inventory.tsx
import React, { useState, useEffect } from 'react';
import {
  Package,
  AlertTriangle,
  TrendingDown,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  Building2,
  HelpCircle,
  Tag,
  Calculator,
  History,
  ShieldCheck
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { InventoryItem } from '../../types';
import { ServiceCostCalculator } from '../../components/admin/ServiceCostCalculator';
import { StockHistory } from '../../components/admin/StockHistory';
import { MovementLedger } from '../../components/inventory/MovementLedger';
import { MovementModal } from '../../components/inventory/MovementModal';
import { ConsumptionAudit } from '../../components/inventory/ConsumptionAudit';

interface StatCardProps {
  title: string;
  value: string;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  subtitle?: string;
  icon?: React.ElementType;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  variant = 'default',
  subtitle,
  icon: Icon
}) => {
  const isDanger = variant === 'danger';
  const isSuccess = variant === 'success';

  return (
    <div
      className={`rounded-[28px] p-6 shadow-premium border transition-all duration-300 relative overflow-hidden ${
        isDanger
          ? 'bg-rose-50/60 border-rose-200/80 text-rose-950'
          : isSuccess
          ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
          : 'bg-white border-aesthetic-bege/30 text-graphite'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span
            className={`text-xs font-bold uppercase tracking-wider block mb-1 ${
              isDanger
                ? 'text-rose-700'
                : isSuccess
                ? 'text-emerald-700'
                : 'text-aesthetic-graphite/60'
            }`}
          >
            {title}
          </span>
          <h3
            className={`text-3xl font-serif font-bold tracking-tight ${
              isDanger ? 'text-rose-700' : isSuccess ? 'text-emerald-700' : 'text-graphite'
            }`}
          >
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-aesthetic-graphite/50 mt-1.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
            isDanger
              ? 'bg-rose-100/80 text-rose-700'
              : isSuccess
              ? 'bg-emerald-100/80 text-emerald-700'
              : 'bg-aesthetic-nude text-[#9C753B]'
          }`}
        >
          {Icon ? (
            <Icon size={22} />
          ) : isDanger ? (
            <AlertTriangle size={22} />
          ) : (
            <Package size={22} />
          )}
        </div>
      </div>
    </div>
  );
};

export const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CRITICAL' | 'OK'>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<string>(dataService.getActiveUnitId() || 'ALL');
  const [activeTab, setActiveTab] = useState<'items' | 'history' | 'audit'>('items');
  const [historyItemFilter, setHistoryItemFilter] = useState<string | undefined>(undefined);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

  const units = dataService.getUnits();

  // Modal State for New/Edit Item
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Depilação & Epilação');
  const [formCurrentStock, setFormCurrentStock] = useState<number>(10);
  const [formMinStock, setFormMinStock] = useState<number>(5);
  const [formUnit, setFormUnit] = useState('un');
  const [formUnitCost, setFormUnitCost] = useState<number>(45.0);
  const [formSupplier, setFormSupplier] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const loadData = () => {
    setItems(dataService.getInventory());
  };

  useEffect(() => {
    loadData();
    const unsub = dataService.subscribe(() => {
      loadData();
    });
    return unsub;
  }, []);

  const metrics = dataService.getInventoryMetrics();

  // Categories list
  const categories = Array.from(new Set(items.map((i) => i.category)));

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || item.category === selectedCategory;

    const isBelowMin = item.currentStock < item.minStock;
    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'CRITICAL'
        ? isBelowMin
        : !isBelowMin;

    const matchesUnit =
      selectedUnit === 'ALL' || !item.unitId
        ? true
        : item.unitId === selectedUnit || item.unit_id === selectedUnit;

    return matchesSearch && matchesCategory && matchesStatus && matchesUnit;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('Depilação & Epilação');
    setFormCurrentStock(10);
    setFormMinStock(5);
    setFormUnit('un');
    setFormUnitCost(45.0);
    setFormSupplier('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormCurrentStock(item.currentStock);
    setFormMinStock(item.minStock);
    setFormUnit(item.unit);
    setFormUnitCost(item.unitCost);
    setFormSupplier(item.supplier || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      dataService.updateInventoryItem(editingItem.id, {
        name: formName.trim(),
        category: formCategory,
        currentStock: Number(formCurrentStock),
        minStock: Number(formMinStock),
        unit: formUnit.trim() || 'un',
        unitCost: Number(formUnitCost),
        supplier: formSupplier.trim(),
      });
      setFeedbackMsg('Insumo atualizado com sucesso!');
    } else {
      dataService.addInventoryItem({
        organizationId: 'org-sublime-01',
        name: formName.trim(),
        category: formCategory,
        currentStock: Number(formCurrentStock),
        minStock: Number(formMinStock),
        unit: formUnit.trim() || 'un',
        unitCost: Number(formUnitCost),
        supplier: formSupplier.trim(),
        lastRestockedAt: new Date().toISOString().split('T')[0],
      });
      setFeedbackMsg('Novo insumo cadastrado com sucesso!');
    }

    setIsModalOpen(false);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Deseja remover o insumo "${name}" do estoque?`)) {
      dataService.deleteInventoryItem(id);
    }
  };

  const handleAdjustStock = (id: string, delta: number) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    const newStock = Math.max(0, target.currentStock + delta);
    dataService.updateInventoryItem(id, { currentStock: newStock });
  };

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-[#FAF6F0] text-[#B88746] px-3 py-0.5 rounded-full border border-[#EBDDCF]">
              Gestão de Insumos & Suprimentos
            </span>
          </div>
          <h1 className="text-3xl font-serif text-graphite">Gestão de Insumos</h1>
          <p className="text-xs sm:text-sm text-aesthetic-graphite/60 mt-1">
            Dados consolidados via histórico de movimentação
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsCalcModalOpen(true)}
            className="h-11 px-5 rounded-full bg-white hover:bg-aesthetic-off-white text-graphite border border-aesthetic-bege/80 text-xs font-bold tracking-wider uppercase transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Calculator size={15} className="text-[#9C753B]" />
            <span>Ficha Técnica</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="h-11 px-5 rounded-full bg-white hover:bg-aesthetic-off-white text-graphite border border-aesthetic-bege/80 text-xs font-bold tracking-wider uppercase transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus size={15} className="text-[#9C753B]" />
            <span>Novo Insumo</span>
          </button>
          <button
            type="button"
            onClick={() => setIsMovementModalOpen(true)}
            className="h-11 px-6 bg-graphite text-white rounded-full text-xs font-bold tracking-widest hover:bg-black hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform text-aesthetic-rose" />
            <span>REGISTRAR MOVIMENTAÇÃO</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Valor Total em Estoque"
          value={formatCurrency(metrics.totalValue)}
          subtitle={`${metrics.totalItemsCount} produtos cadastrados`}
          icon={Package}
        />
        <StatCard
          title="Itens Abaixo do Mínimo"
          value={metrics.belowMinCount.toString().padStart(2, '0')}
          variant={metrics.belowMinCount > 0 ? 'danger' : 'default'}
          subtitle={
            metrics.belowMinCount > 0
              ? 'Exigem reposição com fornecedor'
              : 'Estoque equilibrado'
          }
          icon={AlertTriangle}
        />
        <StatCard
          title="Saídas (Este Mês)"
          value={formatCurrency(metrics.monthlyOutflows)}
          subtitle="Consumo vinculado aos atendimentos"
          icon={TrendingDown}
        />
      </div>

      {/* Navigation Tabs (Estoque / Histórico) */}
      <div className="flex items-center gap-3 border-b border-aesthetic-bege/40 pb-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab('items');
            setHistoryItemFilter(undefined);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'items'
              ? 'bg-graphite text-white shadow-xs'
              : 'text-aesthetic-graphite/60 hover:text-graphite bg-white border border-aesthetic-bege/40'
          }`}
        >
          <Package size={14} />
          <span>Insumos em Estoque ({items.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('history');
            setHistoryItemFilter(undefined);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-graphite text-white shadow-xs'
              : 'text-aesthetic-graphite/60 hover:text-graphite bg-white border border-aesthetic-bege/40'
          }`}
        >
          <History size={14} />
          <span>Histórico de Movimentação</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('audit');
            setHistoryItemFilter(undefined);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'bg-graphite text-white shadow-xs'
              : 'text-aesthetic-graphite/60 hover:text-graphite bg-white border border-aesthetic-bege/40'
          }`}
        >
          <ShieldCheck size={14} />
          <span>Auditoria de Insumos</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      {activeTab === 'items' && (
        <>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-aesthetic-bege/30 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aesthetic-graphite/40" />
          <input
            type="text"
            placeholder="Buscar por insumo, categoria ou fornecedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-aesthetic-off-white/70 border border-aesthetic-bege/60 rounded-xl text-xs text-graphite focus:outline-none focus:border-rose-300 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="px-3 py-2 bg-aesthetic-off-white/70 border border-aesthetic-bege/60 rounded-xl text-xs text-graphite focus:outline-none cursor-pointer"
          >
            <option value="ALL">Todas as Sedes / Unidades</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-aesthetic-off-white/70 border border-aesthetic-bege/60 rounded-xl text-xs text-graphite focus:outline-none cursor-pointer"
          >
            <option value="ALL">Todas Categorias</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-aesthetic-off-white/70 border border-aesthetic-bege/60 rounded-xl text-xs text-graphite focus:outline-none cursor-pointer"
          >
            <option value="ALL">Todos os Status</option>
            <option value="CRITICAL">Abaixo do Mínimo</option>
            <option value="OK">Estoque Adequado</option>
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[32px] p-8 shadow-premium border border-aesthetic-bege/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-aesthetic-bege/30 text-xs font-bold uppercase text-aesthetic-graphite/50">
              <tr>
                <th className="px-4 py-4 text-left">Insumo</th>
                <th className="px-4 py-4 text-left">Qtd Atual</th>
                <th className="px-4 py-4 text-left">Qtd Mínima</th>
                <th className="px-4 py-4 text-left">Custo Unitário</th>
                <th className="px-4 py-4 text-left">Status</th>
                <th className="px-4 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-xs text-aesthetic-graphite/50">
                    Nenhum insumo encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isBelowMin = item.currentStock < item.minStock;
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-aesthetic-bege/10 hover:bg-aesthetic-off-white/40 transition-colors"
                    >
                      {/* Insumo */}
                      <td className="px-4 py-6 font-medium text-graphite">
                        <div>
                          <span className="block font-semibold text-sm text-graphite">
                            {item.name}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-aesthetic-graphite/40">
                              {item.category}
                            </span>
                            {item.supplier && (
                              <>
                                <span className="text-aesthetic-graphite/30">•</span>
                                <span className="text-[11px] text-aesthetic-graphite/50">
                                  {item.supplier}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Qtd Atual (Consolidado via Ledger de Movimentação) */}
                      <td className="px-4 py-6">
                        <span
                          className={`font-semibold text-sm ${
                            isBelowMin ? 'text-rose-700 font-bold' : 'text-graphite'
                          }`}
                        >
                          {item.currentStock.toString().padStart(2, '0')} {item.unit}
                        </span>
                      </td>

                      {/* Qtd Mínima */}
                      <td className="px-4 py-6 text-sm text-aesthetic-graphite/70">
                        {item.minStock.toString().padStart(2, '0')} {item.unit}
                      </td>

                      {/* Custo Unitário */}
                      <td className="px-4 py-6 text-emerald-600 font-bold text-sm">
                        {formatCurrency(item.unitCost)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-6">
                        {isBelowMin ? (
                          <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 border border-rose-200">
                            <AlertTriangle size={11} />
                            Reposição Necessária
                          </span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 border border-emerald-200">
                            <CheckCircle2 size={11} />
                            Estoque Adequado
                          </span>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="px-4 py-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setHistoryItemFilter(item.id);
                              setIsHistoryModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-aesthetic-graphite/60 hover:text-[#9C753B] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                            title="Histórico deste insumo"
                          >
                            <History size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-aesthetic-graphite/60 hover:text-graphite hover:bg-aesthetic-bege/30 transition-colors cursor-pointer"
                            title="Editar Insumo"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Excluir Insumo"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* Seção da Aba Histórico de Movimentação */}
      {activeTab === 'history' && (
        <MovementLedger onMovementAdded={loadData} />
      )}

      {/* Seção da Aba Auditoria de Insumos */}
      {activeTab === 'audit' && (
        <ConsumptionAudit />
      )}

      {/* Modal de Cadastro / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 shadow-2xl border border-aesthetic-bege/40 space-y-5">
            <div className="flex items-center justify-between border-b border-aesthetic-bege/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-aesthetic-nude text-[#B88746] flex items-center justify-center font-bold">
                  <Package size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-graphite">
                    {editingItem ? 'Editar Insumo' : 'Novo Insumo'}
                  </h3>
                  <p className="text-[11px] text-aesthetic-graphite/50">
                    Defina níveis de estoque e custos para precificação
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-aesthetic-graphite/40 hover:text-graphite cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-aesthetic-graphite/70 mb-1">
                  Nome do Insumo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cera Elástica Mel 1kg"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege focus:border-rose-300 outline-none text-xs text-graphite"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-aesthetic-graphite/70 mb-1">
                    Categoria
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-aesthetic-bege focus:border-rose-300 outline-none text-xs text-graphite cursor-pointer"
                  >
                    <option value="Depilação & Epilação">Depilação & Epilação</option>
                    <option value="Facial">Facial</option>
                    <option value="Eletroterapia">Eletroterapia</option>
                    <option value="Microagulhamento">Microagulhamento</option>
                    <option value="Peelings Químicos">Peelings Químicos</option>
                    <option value="Biossegurança">Biossegurança</option>
                    <option value="Visagismo">Visagismo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-aesthetic-graphite/70 mb-1">
                    Unidade de Medida
                  </label>
                  <input
                    type="text"
                    placeholder="un, pote, cx, frasco, gl"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege focus:border-rose-300 outline-none text-xs text-graphite"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-aesthetic-graphite/70 mb-1">
                    Qtd Atual
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formCurrentStock}
                    onChange={(e) => setFormCurrentStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege focus:border-rose-300 outline-none text-xs text-graphite"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-aesthetic-graphite/70 mb-1">
                    Qtd Mínima
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege focus:border-rose-300 outline-none text-xs text-graphite"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-aesthetic-graphite/70 mb-1">
                    Custo Unitário (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formUnitCost}
                    onChange={(e) => setFormUnitCost(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege focus:border-rose-300 outline-none text-xs text-graphite"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-aesthetic-graphite/70 mb-1">
                  Fornecedor
                </label>
                <input
                  type="text"
                  placeholder="Ex: DepilBella Profissional"
                  value={formSupplier}
                  onChange={(e) => setFormSupplier(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege focus:border-rose-300 outline-none text-xs text-graphite"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-aesthetic-bege/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-full border border-aesthetic-bege text-xs font-semibold text-aesthetic-graphite/70 hover:bg-aesthetic-bege/20 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-graphite hover:bg-black text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  {editingItem ? 'Salvar Alterações' : 'Cadastrar Insumo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ficha Técnica / Calculadora de Custos de Serviço */}
      {isCalcModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-aesthetic-bege/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-aesthetic-bege/30 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9C753B] block">
                  Simulador de Insumos & Custos
                </span>
                <h3 className="text-xl font-serif text-graphite">
                  Ficha Técnica de Procedimento
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCalcModalOpen(false)}
                className="w-8 h-8 rounded-full bg-aesthetic-off-white hover:bg-aesthetic-bege/30 flex items-center justify-center text-aesthetic-graphite transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <ServiceCostCalculator
              allowServiceSelection={true}
            />

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCalcModalOpen(false)}
                className="px-6 py-2.5 rounded-full bg-graphite hover:bg-black text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Fechar Ficha Técnica
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Histórico de Movimentação Individual do Insumo */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-aesthetic-bege/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-aesthetic-bege/30 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9C753B] block">
                  Auditoria & Rastreabilidade de Estoque
                </span>
                <h3 className="text-xl font-serif text-graphite">
                  {historyItemFilter
                    ? items.find(i => i.id === historyItemFilter)?.name || 'Insumo'
                    : 'Histórico de Movimentações'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsHistoryModalOpen(false);
                  setHistoryItemFilter(undefined);
                }}
                className="w-8 h-8 rounded-full bg-aesthetic-off-white hover:bg-aesthetic-bege/30 flex items-center justify-center text-aesthetic-graphite transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <StockHistory itemId={historyItemFilter} onMovementAdded={loadData} />

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsHistoryModalOpen(false);
                  setHistoryItemFilter(undefined);
                }}
                className="px-6 py-2.5 rounded-full bg-graphite hover:bg-black text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Overlay de Registro de Movimentação */}
      <MovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        onSuccess={() => {
          loadData();
          setIsMovementModalOpen(false);
        }}
      />
    </div>
  );
};

export default Inventory;
