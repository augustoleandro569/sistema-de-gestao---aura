// src/components/inventory/MovementLedger.tsx
import React, { useState, useEffect } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Clock,
  Package,
  CheckCircle2,
  X,
  Filter
} from 'lucide-react';
import { InventoryLog } from '../../types/inventory';
import { InventoryItem } from '../../types';
import { dataService } from '../../services/dataService';
import { MovementModal } from './MovementModal';

export interface MovementLedgerProps {
  itemId?: string;
  onMovementAdded?: () => void;
  isCreateModalOpen?: boolean;
  onCloseCreateModal?: () => void;
}

export const MovementLedger: React.FC<MovementLedgerProps> = ({
  itemId,
  onMovementAdded,
  isCreateModalOpen,
  onCloseCreateModal
}) => {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const isModalOpen = isCreateModalOpen !== undefined ? isCreateModalOpen : internalModalOpen;
  const setIsModalOpen = (open: boolean) => {
    setInternalModalOpen(open);
    if (!open && onCloseCreateModal) {
      onCloseCreateModal();
    }
  };
  const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

  const loadData = () => {
    const loadedLogs = dataService.getInventoryLogs(itemId);
    setLogs(loadedLogs);
    const loadedItems = dataService.getInventory();
    setItems(loadedItems);
  };

  useEffect(() => {
    loadData();
    const unsub = dataService.subscribe(() => {
      loadData();
    });
    return unsub;
  }, [itemId]);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(',', ' -');
    } catch {
      return isoString;
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filterType === 'ALL') return true;
    return log.type === filterType;
  });

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-premium border border-aesthetic-bege/20 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-serif text-graphite">Histórico de Movimentações</h2>
          <p className="text-xs text-aesthetic-graphite/60 mt-0.5">
            Entradas por compra de fornecedor e saídas automáticas deduzidas por serviços realizados.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center bg-aesthetic-off-white p-1 rounded-full border border-aesthetic-bege/40 text-xs">
            <button
              type="button"
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-graphite text-white shadow-2xs'
                  : 'text-aesthetic-graphite/60 hover:text-graphite'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setFilterType('IN')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                filterType === 'IN'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              Entradas
            </button>
            <button
              type="button"
              onClick={() => setFilterType('OUT')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                filterType === 'OUT'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              Saídas
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="h-11 px-6 bg-graphite text-white rounded-full text-xs font-bold tracking-widest hover:bg-black hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer shrink-0"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform text-aesthetic-rose" />
            <span>REGISTRAR MOVIMENTAÇÃO</span>
          </button>
        </div>
      </div>

      {/* Lista de Movimentações do Ledger */}
      <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center bg-aesthetic-off-white/50 rounded-2xl border border-aesthetic-bege/30 text-xs text-aesthetic-graphite/50">
            Nenhuma movimentação encontrada no histórico.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isEntry = log.type === 'IN';
            const unitLabel = log.unit || 'unidades';

            return (
              <div
                key={log.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  isEntry
                    ? 'bg-emerald-50/30 border-emerald-100 hover:border-emerald-200'
                    : 'bg-rose-50/30 border-rose-100 hover:border-rose-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2.5 rounded-full shrink-0 text-white shadow-2xs ${
                      isEntry ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  >
                    {isEntry ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-graphite">
                      {log.reason || (isEntry ? 'Entrada de Estoque' : 'Saída de Estoque')}
                    </p>

                    {isEntry ? (
                      <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-widest mt-0.5">
                        Fornecedor: {log.supplier || 'BeautyCorp'}
                      </p>
                    ) : (
                      <p className="text-[10px] text-rose-600 uppercase font-bold tracking-widest mt-0.5">
                        {log.client_name || log.clientName
                          ? `Cliente: ${log.client_name || log.clientName}`
                          : log.item_name
                          ? `Insumo: ${log.item_name}`
                          : 'Uso Clínico Automatizado'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`text-sm font-bold ${
                      isEntry ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isEntry ? `+${log.quantity}` : `-${log.quantity}`} {unitLabel}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {formatDate(log.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL PARA REGISTRAR MOVIMENTAÇÃO */}
      <MovementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialItemId={itemId}
        onSuccess={() => {
          loadData();
          if (onMovementAdded) {
            onMovementAdded();
          }
        }}
      />
    </div>
  );
};

export default MovementLedger;
