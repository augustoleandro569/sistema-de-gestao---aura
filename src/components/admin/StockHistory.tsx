// src/components/admin/StockHistory.tsx
import React, { useState, useEffect } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  PlusCircle,
  MinusCircle,
  Clock,
  Package,
  Check,
  Filter
} from 'lucide-react';
import { InventoryLog } from '../../types/inventory';
import { dataService } from '../../services/dataService';
import { InventoryItem } from '../../types';

interface StockHistoryProps {
  itemId?: string;
  onMovementAdded?: () => void;
}

export const StockHistory: React.FC<StockHistoryProps> = ({ itemId, onMovementAdded }) => {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

  // Form State
  const [formItemId, setFormItemId] = useState<string>(itemId || '');
  const [formType, setFormType] = useState<'IN' | 'OUT'>('IN');
  const [formQuantity, setFormQuantity] = useState<number>(1);
  const [formReason, setFormReason] = useState<string>('Compra');
  const [formCustomReason, setFormCustomReason] = useState<string>('');
  const [formUnitPrice, setFormUnitPrice] = useState<number>(0);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    const loadedLogs = dataService.getInventoryLogs(itemId);
    setLogs(loadedLogs);
    const loadedItems = dataService.getInventory();
    setItems(loadedItems);

    if (itemId) {
      setFormItemId(itemId);
      const target = loadedItems.find(i => i.id === itemId);
      if (target) {
        setFormUnitPrice(target.cost_price ?? target.unitCost ?? 0);
      }
    } else if (loadedItems.length > 0) {
      setFormItemId(loadedItems[0].id);
      setFormUnitPrice(loadedItems[0].cost_price ?? loadedItems[0].unitCost ?? 0);
    }

    const unsub = dataService.subscribe(() => {
      setLogs(dataService.getInventoryLogs(itemId));
      setItems(dataService.getInventory());
    });
    return unsub;
  }, [itemId]);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const handleItemSelectChange = (newId: string) => {
    setFormItemId(newId);
    const item = items.find(i => i.id === newId);
    if (item) {
      setFormUnitPrice(item.cost_price ?? item.unitCost ?? 0);
    }
  };

  const handleRegisterMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formItemId || formQuantity <= 0) return;

    const item = items.find(i => i.id === formItemId);
    const finalReason = formReason === 'Outro' && formCustomReason.trim()
      ? formCustomReason.trim()
      : formReason;

    dataService.addInventoryLog({
      itemId: formItemId,
      item_id: formItemId,
      item_name: item ? item.name : 'Insumo',
      type: formType,
      quantity: formQuantity,
      reason: finalReason,
      unit_price_at_moment: Number(formUnitPrice) || 0,
    });

    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setShowAddModal(false);
      setFormQuantity(1);
      setFormCustomReason('');
    }, 1500);

    if (onMovementAdded) {
      onMovementAdded();
    }
  };

  const filteredLogs = logs.filter(log => {
    if (selectedTypeFilter === 'ALL') return true;
    return log.type === selectedTypeFilter;
  });

  return (
    <div className="space-y-4">
      {/* Header com ações e filtro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h3 className="text-sm font-bold text-graphite uppercase tracking-wider">
            Histórico de Movimentação
          </h3>
          <p className="text-xs text-aesthetic-graphite/50">
            Registro detalhado de entradas, compras, saídas em serviços e ajustes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filtro Entrada/Saída */}
          <div className="flex items-center bg-white border border-aesthetic-bege/70 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                selectedTypeFilter === 'ALL'
                  ? 'bg-graphite text-white'
                  : 'text-aesthetic-graphite/60 hover:text-graphite'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('IN')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                selectedTypeFilter === 'IN'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              Entradas
            </button>
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('OUT')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                selectedTypeFilter === 'OUT'
                  ? 'bg-rose-600 text-white'
                  : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              Saídas
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-graphite hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle size={14} className="text-aesthetic-rose" />
            <span>Registrar Movimento</span>
          </button>
        </div>
      </div>

      {/* Lista de Registros */}
      {filteredLogs.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-aesthetic-bege/20 text-xs text-aesthetic-graphite/40">
          Nenhuma movimentação registrada no histórico para este filtro.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-aesthetic-bege/20 shadow-2xs hover:border-aesthetic-bege/60 transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2.5 rounded-full shrink-0 ${
                    log.type === 'IN'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {log.type === 'IN' ? (
                    <ArrowDownLeft size={16} />
                  ) : (
                    <ArrowUpRight size={16} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-graphite flex items-center gap-2">
                    <span>{log.reason}</span>
                    {log.item_name && (
                      <span className="text-[11px] font-normal text-aesthetic-graphite/60 bg-aesthetic-off-white px-2 py-0.5 rounded-md border border-aesthetic-bege/30">
                        {log.item_name}
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock size={10} />
                    {formatDate(log.created_at)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-bold ${
                    log.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {log.type === 'IN' ? '+' : '-'}
                  {log.quantity} un
                </p>
                <p className="text-[10px] text-gray-400">
                  R$ {Number(log.unit_price_at_moment || 0).toFixed(2)}/un
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: REGISTRAR NOVA MOVIMENTAÇÃO */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-aesthetic-bege/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-aesthetic-bege/30">
              <h3 className="text-base font-serif text-graphite font-bold">
                Nova Movimentação de Estoque
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-aesthetic-graphite/40 hover:text-graphite cursor-pointer"
              >
                ✕
              </button>
            </div>

            {feedbackSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Check size={14} className="text-emerald-600" />
                Movimentação registrada com sucesso no estoque!
              </div>
            )}

            <form onSubmit={handleRegisterMovement} className="space-y-4 text-xs">
              {/* Tipo: Entrada ou Saída */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormType('IN')}
                  className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    formType === 'IN'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-white border-aesthetic-bege text-aesthetic-graphite/60'
                  }`}
                >
                  <ArrowDownLeft size={16} className="text-emerald-600" />
                  ENTRADA (+)
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('OUT')}
                  className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    formType === 'OUT'
                      ? 'bg-rose-50 border-rose-500 text-rose-800'
                      : 'bg-white border-aesthetic-bege text-aesthetic-graphite/60'
                  }`}
                >
                  <ArrowUpRight size={16} className="text-rose-600" />
                  SAÍDA (-)
                </button>
              </div>

              {/* Item de Estoque */}
              <div>
                <label className="block font-bold text-graphite mb-1 uppercase tracking-wider text-[10px]">
                  Insumo
                </label>
                <select
                  value={formItemId}
                  onChange={(e) => handleItemSelectChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-aesthetic-bege bg-white text-graphite outline-none"
                  required
                >
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (Atual: {item.currentStock ?? item.current_quantity ?? 0} {item.unit})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantidade e Preço Unitário */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-graphite mb-1 uppercase tracking-wider text-[10px]">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border border-aesthetic-bege bg-white text-graphite outline-none font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-graphite mb-1 uppercase tracking-wider text-[10px]">
                    Preço Unitário (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formUnitPrice}
                    onChange={(e) => setFormUnitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border border-aesthetic-bege bg-white text-graphite outline-none font-bold"
                    required
                  />
                </div>
              </div>

              {/* Motivo */}
              <div>
                <label className="block font-bold text-graphite mb-1 uppercase tracking-wider text-[10px]">
                  Motivo da Movimentação
                </label>
                <select
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-aesthetic-bege bg-white text-graphite outline-none mb-2"
                >
                  {formType === 'IN' ? (
                    <>
                      <option value="Compra">Compra</option>
                      <option value="Devolução">Devolução</option>
                      <option value="Ajuste Positivo">Ajuste Positivo</option>
                      <option value="Outro">Outro</option>
                    </>
                  ) : (
                    <>
                      <option value="Uso em Serviço">Uso em Serviço</option>
                      <option value="Ajuste">Ajuste</option>
                      <option value="Vencimento">Vencimento</option>
                      <option value="Avaria / Descarte">Avaria / Descarte</option>
                      <option value="Outro">Outro</option>
                    </>
                  )}
                </select>
                {formReason === 'Outro' && (
                  <input
                    type="text"
                    placeholder="Especifique o motivo..."
                    value={formCustomReason}
                    onChange={(e) => setFormCustomReason(e.target.value)}
                    className="w-full p-2 rounded-xl border border-aesthetic-bege bg-white text-graphite outline-none"
                    required
                  />
                )}
              </div>

              {/* Botões */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-aesthetic-bege text-aesthetic-graphite cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-graphite hover:bg-black text-white font-bold cursor-pointer"
                >
                  Confirmar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockHistory;
