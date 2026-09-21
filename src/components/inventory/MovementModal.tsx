// src/components/inventory/MovementModal.tsx
// Este é o formulário invocado pelo botão "Registrar Movimentação"
import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { InventoryItem } from '../../types';

export interface MovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialItemId?: string;
}

export const MovementModal: React.FC<MovementModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialItemId,
}) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [unitCost, setUnitCost] = useState<string>('');
  const [observation, setObservation] = useState<string>('');
  const [unit, setUnit] = useState<string>('un');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadedItems = dataService.getInventory();
    setItems(loadedItems);
    setError(null);
    setSuccess(false);

    const defaultId = initialItemId || (loadedItems.length > 0 ? loadedItems[0].id : '');
    setSelectedItemId(defaultId);

    if (defaultId) {
      const selected = loadedItems.find((i) => i.id === defaultId);
      if (selected) {
        setUnit(selected.unit_measure ?? selected.unit ?? 'un');
        const cost = selected.cost_price ?? selected.unitCost ?? 0;
        setUnitCost(cost > 0 ? cost.toString() : '');
      }
    }
  }, [isOpen, initialItemId]);

  if (!isOpen) return null;

  const handleItemChange = (itemId: string) => {
    setSelectedItemId(itemId);
    const item = items.find((i) => i.id === itemId);
    if (item) {
      setUnit(item.unit_measure ?? item.unit ?? 'un');
      const cost = item.cost_price ?? item.unitCost ?? 0;
      setUnitCost(cost > 0 ? cost.toString() : '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const qty = parseFloat(quantity);
    if (!selectedItemId) {
      setError('Por favor, selecione um insumo.');
      return;
    }

    if (isNaN(qty) || qty <= 0) {
      setError('Informe uma quantidade válida superior a zero.');
      return;
    }

    const selectedItem = items.find((i) => i.id === selectedItemId);
    const itemName = selectedItem ? selectedItem.name : 'Insumo';
    const cost = parseFloat(unitCost) || 0;

    const formattedReason = observation.trim()
      ? movementType === 'IN'
        ? `Entrada: ${observation.trim()}`
        : `Saída Manual: ${observation.trim()}`
      : movementType === 'IN'
      ? 'Entrada: Compra de Lote'
      : 'Saída Manual: Procedimento Clínico';

    dataService.addInventoryLog({
      itemId: selectedItemId,
      item_id: selectedItemId,
      item_name: itemName,
      type: movementType,
      quantity: qty,
      unit: unit || 'unidades',
      reason: formattedReason,
      supplier: movementType === 'IN' ? observation || 'Fornecedor' : undefined,
      client_name: movementType === 'OUT' ? observation : undefined,
      unit_price_at_moment: cost,
    });

    setSuccess(true);
    setTimeout(() => {
      if (onSuccess) onSuccess();
      onClose();
    }, 1000);
  };

  return (
    <div
      id="movement-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="movement-modal-dialog"
        className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-aesthetic-bege/40 space-y-6 relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-aesthetic-bege/20">
          <div>
            <h3 className="text-xl font-serif text-graphite font-bold">
              Registrar Movimentação
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Atualize o saldo de insumos com auditoria e rastreabilidade contábil
            </p>
          </div>
          <button
            id="close-movement-modal"
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-graphite transition-colors p-1.5 rounded-full hover:bg-aesthetic-off-white"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulário Invocado */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 p-2">
            {/* Seleção de Tipo: Entrada ou Saída */}
            <div className="grid grid-cols-2 gap-4">
              <button
                id="btn-movement-in"
                type="button"
                onClick={() => setMovementType('IN')}
                className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  movementType === 'IN'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-emerald-100 bg-emerald-50/30 text-emerald-700/70 hover:text-emerald-700 hover:border-emerald-200'
                }`}
              >
                <ArrowDownLeft size={24} />
                <span className="text-xs font-bold">ENTRADA (COMPRA)</span>
              </button>

              <button
                id="btn-movement-out"
                type="button"
                onClick={() => setMovementType('OUT')}
                className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  movementType === 'OUT'
                    ? 'border-rose-500 bg-rose-50 text-rose-800 shadow-sm ring-2 ring-rose-500/20'
                    : 'border-rose-100 bg-rose-50/30 text-rose-700/70 hover:text-rose-700 hover:border-rose-200'
                }`}
              >
                <ArrowUpRight size={24} />
                <span className="text-xs font-bold">SAÍDA (MANUAL)</span>
              </button>
            </div>

            <div className="space-y-4 mt-6">
              {/* Insumo */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Insumo</label>
                <select
                  id="select-inventory-item"
                  value={selectedItemId}
                  onChange={(e) => handleItemChange(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-aesthetic-off-white border-none text-sm outline-none text-graphite cursor-pointer focus:ring-2 focus:ring-aesthetic-gold/30"
                  required
                >
                  <option value="">Selecione o item...</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — Saldo: {item.currentStock ?? item.current_quantity ?? 0}{' '}
                      {item.unit_measure ?? item.unit ?? 'un'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantidade e Custo Unitário */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Quantidade {unit ? `(${unit})` : ''}
                  </label>
                  <input
                    id="input-movement-quantity"
                    type="number"
                    step="any"
                    min="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-aesthetic-off-white border-none text-sm outline-none text-graphite font-semibold focus:ring-2 focus:ring-aesthetic-gold/30"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Custo Unitário
                  </label>
                  <input
                    id="input-movement-cost"
                    type="number"
                    step="0.01"
                    value={unitCost}
                    onChange={(e) => setUnitCost(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-aesthetic-off-white border-none text-sm outline-none text-graphite focus:ring-2 focus:ring-aesthetic-gold/30"
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              {/* Motivo / Observação */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Motivo / Observação
                </label>
                <textarea
                  id="textarea-movement-reason"
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-aesthetic-off-white border-none text-sm outline-none h-24 text-graphite resize-none focus:ring-2 focus:ring-aesthetic-gold/30"
                  placeholder={
                    movementType === 'IN'
                      ? 'Ex: NF 123 - Compra mensal com fornecedor'
                      : 'Ex: Procedimento clínico / Quebra ou ajuste'
                  }
                ></textarea>
              </div>
            </div>

            {/* Alerta de Erro */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2 animate-in fade-in">
                <AlertCircle size={16} className="text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Alerta de Sucesso */}
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span className="font-bold">Movimentação registrada com sucesso no estoque!</span>
              </div>
            )}

            {/* Ações */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-full border border-aesthetic-bege/80 text-xs font-bold uppercase tracking-wider text-graphite hover:bg-aesthetic-off-white transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="btn-submit-movement"
                type="submit"
                disabled={success}
                className="h-11 px-7 bg-graphite text-white rounded-full text-xs font-bold tracking-widest hover:bg-black transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {movementType === 'IN' ? (
                  <ArrowDownLeft size={16} className="text-emerald-400" />
                ) : (
                  <ArrowUpRight size={16} className="text-rose-400" />
                )}
                <span>CONFIRMAR REGISTRO</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
