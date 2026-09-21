// src/components/pricing/ServicePricingConfig.tsx
import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Building2,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Service, ServiceMaterial, InventoryItem } from '../../types';
import { dataService } from '../../services/dataService';

// Lógica de Cálculo de Precificação
export const CalculationEngine = {
  // Custo Direto (Materiais vinculados ao estoque)
  getMaterialCost: (items: Array<{ qty: number; stock_unit_price: number }>) =>
    items.reduce((acc, item) => acc + item.qty * item.stock_unit_price, 0),

  // Custo Indireto (Rateio de custos fixos por hora)
  // Ex: (Aluguel + Luz + Agua) / Horas Trabalhadas no Mês
  getFixedCostAllocation: (fixedCostsTotal: number, serviceDurationMinutes: number) => {
    const hourlyRate = fixedCostsTotal / 160; // Base: 160h/mês
    return (hourlyRate / 60) * serviceDurationMinutes;
  },
};

interface MaterialItem {
  id: string;
  name: string;
  qty: number;
  stock_unit_price: number;
  unit_measure?: string;
  itemId?: string;
}

interface ServicePricingConfigProps {
  service: Service;
  onUpdateService?: (updated: Partial<Service>) => void;
  fixedCostsBreakdown?: {
    aluguel: number;
    energiaAgua: number;
    taxaMaquininha: number;
    limpezaAdmin: number;
  };
}

export const ServicePricingConfig: React.FC<ServicePricingConfigProps> = ({
  service,
  onUpdateService,
  fixedCostsBreakdown = {
    aluguel: 12.0,
    energiaAgua: 4.5,
    taxaMaquininha: 8.2,
    limpezaAdmin: 5.0,
  },
}) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<MaterialItem[]>([]);
  const [newItemId, setNewItemId] = useState<string>('');
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [salePrice, setSalePrice] = useState<number>(service.price || 300);
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  // Load Inventory & Service Materials
  useEffect(() => {
    const inv = dataService.getInventory();
    setInventory(inv);

    const mats = dataService.getServiceMaterials(service.id);
    if (mats && mats.length > 0) {
      setSelectedItems(
        mats.map((m) => ({
          id: m.id,
          name: m.name,
          qty: m.quantity_used ?? m.quantity ?? 1,
          stock_unit_price: m.unitPrice ?? 0,
          unit_measure: m.unit_measure ?? m.unit ?? 'un',
          itemId: m.itemId || m.item_id,
        }))
      );
    } else {
      // Itens de exemplo representativos com base no prompt (totalizando R$ 142,50)
      setSelectedItems([
        {
          id: 'mat-init-1',
          name: 'Ampola Vitamina C Pura 10x2ml',
          qty: 1,
          stock_unit_price: 115.0,
          unit_measure: 'ampola',
        },
        {
          id: 'mat-init-2',
          name: 'Sérum Ácido Hialurônico Concentrado',
          qty: 1,
          stock_unit_price: 27.5,
          unit_measure: 'dose',
        },
      ]);
    }
  }, [service.id]);

  // Cálculos via CalculationEngine
  const subtotalMateriais = CalculationEngine.getMaterialCost(selectedItems);

  // Soma dos custos fixos rateados
  const fixedCostsTotalShare =
    fixedCostsBreakdown.aluguel +
    fixedCostsBreakdown.energiaAgua +
    fixedCostsBreakdown.taxaMaquininha +
    fixedCostsBreakdown.limpezaAdmin;

  const custoRealFinal = subtotalMateriais + fixedCostsTotalShare;
  const lucroLiquidoEstimado = Math.max(0, salePrice - custoRealFinal);
  const margemEfetiva = salePrice > 0 ? (lucroLiquidoEstimado / salePrice) * 100 : 0;

  // Adicionar novo material à ficha
  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemId || newItemQty <= 0) return;

    const item = inventory.find((i) => i.id === newItemId);
    if (!item) return;

    const unitPrice = item.cost_price ?? item.unitCost ?? 10;
    const newMaterial: MaterialItem = {
      id: `mat-${Date.now()}`,
      name: item.name,
      qty: newItemQty,
      stock_unit_price: unitPrice,
      unit_measure: item.unit_measure ?? item.unit ?? 'un',
      itemId: item.id,
    };

    const updated = [...selectedItems, newMaterial];
    setSelectedItems(updated);
    setNewItemId('');
    setNewItemQty(1);

    // Persist via dataService
    const serviceMaterialsFormatted: ServiceMaterial[] = updated.map((m) => ({
      id: m.id,
      service_id: service.id,
      serviceId: service.id,
      item_id: m.itemId || m.id,
      itemId: m.itemId || m.id,
      name: m.name,
      quantity_used: m.qty,
      quantity: m.qty,
      unitPrice: m.stock_unit_price,
      unit_measure: m.unit_measure || 'un',
      unit: m.unit_measure || 'un',
    }));
    dataService.saveServiceMaterials(service.id, serviceMaterialsFormatted);

    setShowAddSuccess(true);
    setTimeout(() => setShowAddSuccess(false), 2500);

    if (onUpdateService) {
      onUpdateService({
        directCost: CalculationEngine.getMaterialCost(updated),
        totalCost: custoRealFinal,
        profitMargin: margemEfetiva,
      });
    }
  };

  // Remover material da ficha
  const handleRemoveMaterial = (id: string) => {
    const updated = selectedItems.filter((i) => i.id !== id);
    setSelectedItems(updated);

    const serviceMaterialsFormatted: ServiceMaterial[] = updated.map((m) => ({
      id: m.id,
      service_id: service.id,
      serviceId: service.id,
      item_id: m.itemId || m.id,
      itemId: m.itemId || m.id,
      name: m.name,
      quantity_used: m.qty,
      quantity: m.qty,
      unitPrice: m.stock_unit_price,
      unit_measure: m.unit_measure || 'un',
      unit: m.unit_measure || 'un',
    }));
    dataService.saveServiceMaterials(service.id, serviceMaterialsFormatted);

    if (onUpdateService) {
      onUpdateService({
        directCost: CalculationEngine.getMaterialCost(updated),
        totalCost: CalculationEngine.getMaterialCost(updated) + fixedCostsTotalShare,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* VÍNCULO DE MATERIAIS */}
      <section className="bg-white p-6 rounded-2xl border border-aesthetic-bege/20 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-graphite uppercase tracking-wider">
              Materiais Consumidos
            </h4>
            <p className="text-[11px] text-aesthetic-graphite/60">
              Insumos de estoque vinculados a cada sessão deste procedimento.
            </p>
          </div>
          <span className="text-xs font-bold text-aesthetic-graphite/40 bg-aesthetic-off-white px-2.5 py-1 rounded-full border border-aesthetic-bege/30">
            {selectedItems.length} insumo(s)
          </span>
        </div>

        {/* Lista de Materiais Selecionados */}
        <div className="space-y-3">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 text-sm p-3 rounded-xl bg-aesthetic-off-white/50 border border-aesthetic-bege/20 hover:border-aesthetic-bege/60 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-aesthetic-graphite/60 border border-aesthetic-bege/30 shrink-0">
                <Package size={14} />
              </div>
              <span className="flex-1 font-medium text-graphite text-xs sm:text-sm">
                {item.name}
              </span>
              <span className="text-gray-400 text-xs shrink-0">
                Qtd: {item.qty} {item.unit_measure || ''} (R${' '}
                {item.stock_unit_price.toFixed(2)}/un)
              </span>
              <span className="font-bold text-graphite text-right text-xs sm:text-sm shrink-0 min-w-[70px]">
                R$ {(item.qty * item.stock_unit_price).toFixed(2)}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveMaterial(item.id)}
                className="text-gray-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                title="Remover material"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <div className="pt-3 border-t border-aesthetic-bege/30 flex justify-between font-bold text-rose-700 text-sm">
            <span>Subtotal Materiais</span>
            <span>R$ {subtotalMateriais.toFixed(2)}</span>
          </div>
        </div>

        {/* Adicionar Insumo do Estoque */}
        <form
          onSubmit={handleAddMaterial}
          className="pt-2 border-t border-dashed border-aesthetic-bege/40 grid grid-cols-1 sm:grid-cols-12 gap-2"
        >
          <div className="sm:col-span-7">
            <select
              value={newItemId}
              onChange={(e) => setNewItemId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-aesthetic-bege/80 text-xs text-graphite outline-none focus:border-rose-300"
            >
              <option value="">+ Vincular insumo do estoque...</option>
              {inventory.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.name} (R$ {(inv.cost_price ?? inv.unitCost ?? 0).toFixed(2)} /{' '}
                  {inv.unit_measure ?? inv.unit ?? 'un'})
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <input
              type="number"
              step="0.1"
              min="0.1"
              placeholder="Qtd"
              value={newItemQty}
              onChange={(e) => setNewItemQty(parseFloat(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-aesthetic-bege/80 text-xs text-graphite outline-none font-bold"
            />
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={!newItemId}
              className="w-full py-2 px-3 rounded-xl bg-graphite hover:bg-black text-white text-xs font-bold transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} className="text-aesthetic-rose" />
              <span>Adicionar</span>
            </button>
          </div>
        </form>

        {showAddSuccess && (
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 size={13} />
            Material vinculado e ficha recalculada com sucesso!
          </p>
        )}
      </section>

      {/* CUSTOS FIXOS (Rateio) */}
      <section className="bg-aesthetic-off-white p-6 rounded-2xl border border-aesthetic-bege/20 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-graphite uppercase tracking-wider">
            Rateio de Custos Fixos
          </h4>
          <span className="text-[11px] text-aesthetic-graphite/50">
            Base: 160h/mês ({service.durationMinutes} min de cabine)
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex justify-between p-2.5 rounded-xl bg-white border border-aesthetic-bege/20">
            <span className="text-aesthetic-graphite/70">Aluguel (Share):</span>
            <b className="text-graphite">R$ {fixedCostsBreakdown.aluguel.toFixed(2)}</b>
          </div>
          <div className="flex justify-between p-2.5 rounded-xl bg-white border border-aesthetic-bege/20">
            <span className="text-aesthetic-graphite/70">Energia/Água:</span>
            <b className="text-graphite">R$ {fixedCostsBreakdown.energiaAgua.toFixed(2)}</b>
          </div>
          <div className="flex justify-between p-2.5 rounded-xl bg-white border border-aesthetic-bege/20">
            <span className="text-aesthetic-graphite/70">Taxa de Maquininha:</span>
            <b className="text-graphite">R$ {fixedCostsBreakdown.taxaMaquininha.toFixed(2)}</b>
          </div>
          <div className="flex justify-between p-2.5 rounded-xl bg-white border border-aesthetic-bege/20">
            <span className="text-aesthetic-graphite/70">Limpeza/Admin:</span>
            <b className="text-graphite">R$ {fixedCostsBreakdown.limpezaAdmin.toFixed(2)}</b>
          </div>
        </div>
        <div className="pt-2 flex justify-between text-xs font-bold text-aesthetic-graphite/70">
          <span>Subtotal Custos Indiretos Rateados:</span>
          <span>R$ {fixedCostsTotalShare.toFixed(2)}</span>
        </div>
      </section>

      {/* AJUSTE DE PREÇO DE VENDA PARA SIMULAÇÃO */}
      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-aesthetic-bege/30 text-xs">
        <div>
          <label className="block font-bold text-graphite">Preço de Venda Cobrado:</label>
          <span className="text-[11px] text-aesthetic-graphite/60">
            Valor cobrado da cliente por sessão
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-graphite">R$</span>
          <input
            type="number"
            step="1"
            min="10"
            value={salePrice}
            onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
            className="w-28 p-2 rounded-xl border border-aesthetic-bege bg-aesthetic-off-white text-graphite font-bold text-sm text-right outline-none"
          />
        </div>
      </div>

      {/* RESULTADO FINAL */}
      <div className="bg-graphite text-white p-8 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Custo Real Final
            </p>
            <p className="text-3xl font-serif mt-1">R$ {custoRealFinal.toFixed(2)}</p>
            <span className="text-[10px] text-gray-400 block mt-0.5">
              (R$ {subtotalMateriais.toFixed(2)} materiais + R$ {fixedCostsTotalShare.toFixed(2)}{' '}
              fixos)
            </span>
          </div>

          <div className="sm:text-right">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Lucro Líquido Estimado
            </p>
            <p className="text-3xl font-serif text-emerald-400 mt-1">
              R$ {lucroLiquidoEstimado.toFixed(2)}
            </p>
            <span className="text-[10px] text-emerald-300/80 font-bold uppercase block mt-0.5">
              Margem de Contribuição: {margemEfetiva.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePricingConfig;
