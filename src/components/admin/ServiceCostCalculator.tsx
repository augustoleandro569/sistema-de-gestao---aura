// src/components/admin/ServiceCostCalculator.tsx
import React, { useState, useEffect } from 'react';
import { Plus, X, Package, Sparkles, Check, Database, Save } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { InventoryItem, ServiceMaterial, Service } from '../../types';

// Lógica de cálculo:
export const calculateMaterialCost = (materials: ServiceMaterial[]): number => {
  return materials.reduce((total, mat) => total + (mat.quantity * mat.unitPrice), 0);
};

interface ServiceCostCalculatorProps {
  serviceId?: string;
  initialMaterials?: ServiceMaterial[];
  onChange?: (materials: ServiceMaterial[], totalCost: number) => void;
  serviceName?: string;
  allowServiceSelection?: boolean;
}

export const ServiceCostCalculator: React.FC<ServiceCostCalculatorProps> = ({
  serviceId,
  initialMaterials,
  onChange,
  serviceName,
  allowServiceSelection = false
}) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [activeServiceId, setActiveServiceId] = useState<string>(serviceId || 'serv-1');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Selected materials in this service technical sheet (service_materials)
  const [materials, setMaterials] = useState<ServiceMaterial[]>(() => {
    if (initialMaterials && initialMaterials.length > 0) {
      return initialMaterials;
    }
    if (serviceId) {
      const stored = dataService.getServiceMaterials(serviceId);
      if (stored.length > 0) return stored;
    }
    return [
      {
        id: 'mat-1',
        service_id: serviceId || 'serv-1',
        item_id: 'inv-8',
        inventoryItemId: 'inv-8',
        name: 'Ácido Hialurônico 1ml',
        quantity: 1,
        quantity_used: 1,
        unitPrice: 120.0,
        unit: 'ml',
        unit_measure: 'ml'
      },
      {
        id: 'mat-2',
        service_id: serviceId || 'serv-1',
        item_id: 'inv-6',
        inventoryItemId: 'inv-6',
        name: 'Kit Luvas Nitrílicas Pink P',
        quantity: 1,
        quantity_used: 1,
        unitPrice: 4.2,
        unit: 'par',
        unit_measure: 'par'
      },
      {
        id: 'mat-3',
        service_id: serviceId || 'serv-1',
        item_id: 'inv-7',
        inventoryItemId: 'inv-7',
        name: 'Lençol Descartável TNT',
        quantity: 1,
        quantity_used: 1,
        unitPrice: 28.2,
        unit: 'un',
        unit_measure: 'un'
      }
    ];
  });

  useEffect(() => {
    setInventory(dataService.getInventory());
    setServices(dataService.getServices());
    const unsub = dataService.subscribe(() => {
      setInventory(dataService.getInventory());
      setServices(dataService.getServices());
    });
    return unsub;
  }, []);

  // Sync when serviceId changes
  useEffect(() => {
    if (serviceId) {
      setActiveServiceId(serviceId);
      const stored = dataService.getServiceMaterials(serviceId);
      if (stored && stored.length > 0) {
        setMaterials(stored);
      }
    }
  }, [serviceId]);

  const totalCost = calculateMaterialCost(materials);

  useEffect(() => {
    if (onChange) {
      onChange(materials, totalCost);
    }
  }, [materials, totalCost, onChange]);

  const handleUpdateQuantity = (index: number, qty: number) => {
    const updated = [...materials];
    const cleanQty = Math.max(0, qty);
    updated[index].quantity = cleanQty;
    updated[index].quantity_used = cleanQty;
    setMaterials(updated);
  };

  const handleSelectInventoryItem = (index: number, selectedNameOrId: string) => {
    const matched = inventory.find(
      (inv) => inv.id === selectedNameOrId || inv.name === selectedNameOrId
    );
    const updated = [...materials];
    if (matched) {
      updated[index] = {
        ...updated[index],
        item_id: matched.id,
        itemId: matched.id,
        inventoryItemId: matched.id,
        name: matched.name,
        unitPrice: matched.cost_price ?? matched.unitCost,
        unit: matched.unit_measure ?? matched.unit,
        unit_measure: matched.unit_measure ?? matched.unit
      };
    } else {
      updated[index] = {
        ...updated[index],
        name: selectedNameOrId
      };
    }
    setMaterials(updated);
  };

  const handleAddMaterial = () => {
    const firstInv = inventory[0];
    const newMaterial: ServiceMaterial = {
      id: `sm-${Date.now()}`,
      service_id: activeServiceId,
      serviceId: activeServiceId,
      item_id: firstInv ? firstInv.id : undefined,
      itemId: firstInv ? firstInv.id : undefined,
      inventoryItemId: firstInv ? firstInv.id : undefined,
      name: firstInv ? firstInv.name : 'Ácido Hialurônico 1ml',
      quantity: 1,
      quantity_used: 1,
      unitPrice: firstInv ? (firstInv.cost_price ?? firstInv.unitCost) : 120.0,
      unit: firstInv ? (firstInv.unit_measure ?? firstInv.unit) : 'ml',
      unit_measure: firstInv ? (firstInv.unit_measure ?? firstInv.unit) : 'ml'
    };
    setMaterials([...materials, newMaterial]);
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleSaveToDatabase = () => {
    dataService.saveServiceMaterials(activeServiceId, materials);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const currentServiceName =
    serviceName ||
    services.find((s) => s.id === activeServiceId)?.name ||
    'Harmonização & Procedimento';

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="bg-aesthetic-off-white p-6 rounded-[24px] border border-dashed border-aesthetic-bege space-y-4">
      {/* Header Ficha Técnica */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-graphite mb-1 flex items-center gap-2">
            <Sparkles size={16} className="text-[#9C753B]" />
            Composição de Materiais (Ficha Técnica)
          </h3>
          <p className="text-xs text-aesthetic-graphite/50">
            Tabelas vinculadas: <code className="text-[11px] font-mono text-[#9C753B]">inventory_items</code> × <code className="text-[11px] font-mono text-[#9C753B]">service_materials</code>
          </p>
        </div>

        {allowServiceSelection && services.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-aesthetic-graphite/60 font-semibold uppercase">Serviço:</span>
            <select
              value={activeServiceId}
              onChange={(e) => {
                const sId = e.target.value;
                setActiveServiceId(sId);
                const mats = dataService.getServiceMaterials(sId);
                if (mats.length > 0) {
                  setMaterials(mats);
                }
              }}
              className="text-xs bg-white border border-aesthetic-bege/80 px-3 py-1.5 rounded-xl font-medium text-graphite cursor-pointer outline-none"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check size={14} className="text-emerald-600" />
          Ficha técnica salva com sucesso no banco de dados!
        </div>
      )}

      {/* Lista de Itens de Vinculação */}
      <div className="space-y-3">
        {materials.length === 0 ? (
          <div className="p-4 bg-white/70 rounded-xl border border-aesthetic-bege/30 text-center text-xs text-aesthetic-graphite/50">
            Nenhum material vinculado. Clique no botão abaixo para adicionar insumos.
          </div>
        ) : (
          materials.map((mat, index) => {
            const itemSubtotal = mat.quantity * mat.unitPrice;
            return (
              <div
                key={mat.id || index}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center bg-white p-3 rounded-xl border border-aesthetic-bege/30 shadow-2xs"
              >
                {/* Select Insumo de Estoque */}
                <div className="flex-1 flex items-center gap-2">
                  <Package size={14} className="text-aesthetic-graphite/40 shrink-0 hidden sm:block" />
                  <select
                    value={mat.item_id || mat.inventoryItemId || mat.name}
                    onChange={(e) => handleSelectInventoryItem(index, e.target.value)}
                    className="flex-1 text-sm outline-none bg-transparent font-medium text-graphite cursor-pointer"
                  >
                    {inventory.length > 0 ? (
                      inventory.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name} ({formatCurrency(inv.cost_price ?? inv.unitCost)} / {inv.unit_measure ?? inv.unit})
                        </option>
                      ))
                    ) : (
                      <option value="Ácido Hialurônico 1ml">Ácido Hialurônico 1ml</option>
                    )}
                  </select>
                </div>

                {/* Input de Quantidade Utilizada */}
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    placeholder="Qtd (ml/g/un)"
                    value={mat.quantity}
                    onChange={(e) => handleUpdateQuantity(index, parseFloat(e.target.value) || 0)}
                    className="w-24 text-sm text-center font-bold text-graphite bg-aesthetic-off-white/40 border border-aesthetic-bege/40 rounded-lg py-1 outline-none"
                  />

                  {/* Custo Total Calculado */}
                  <span className="text-xs text-aesthetic-graphite/60 whitespace-nowrap min-w-[6.5rem] text-right">
                    Custo: <strong className="text-graphite font-bold">{formatCurrency(itemSubtotal)}</strong>
                  </span>

                  {/* Botão de Remoção */}
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterial(index)}
                    className="text-rose-400 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remover item da ficha técnica"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Botão Adicionar Item */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleAddMaterial}
            className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1 mt-2 cursor-pointer transition-colors"
          >
            <Plus size={14} /> ADICIONAR ITEM AO SERVIÇO
          </button>

          <button
            type="button"
            onClick={handleSaveToDatabase}
            className="text-xs font-bold text-graphite hover:text-black bg-white hover:bg-aesthetic-off-white border border-aesthetic-bege/80 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all mt-2"
          >
            <Save size={13} className="text-[#9C753B]" />
            <span>Salvar Ficha Técnica</span>
          </button>
        </div>
      </div>

      {/* Custo Total */}
      <div className="mt-6 pt-4 border-t border-aesthetic-bege/50 flex justify-between items-center">
        <span className="text-sm font-medium text-aesthetic-graphite/70">
          Custo Total de Material:
        </span>
        <span className="text-lg font-bold text-graphite">
          {formatCurrency(totalCost)}
        </span>
      </div>
    </div>
  );
};

export default ServiceCostCalculator;
