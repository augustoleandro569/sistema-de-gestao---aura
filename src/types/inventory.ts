// src/types/inventory.ts
export interface InventoryLog {
  id: string;
  item_id?: string;
  itemId?: string;
  item_name?: string;
  type: 'IN' | 'OUT'; // Entrada ou Saída
  quantity: number;
  unit?: string; // 'unidades', 'ml', 'g', 'kit'
  reason: string; // 'Compra', 'Uso em Serviço', 'Ajuste', 'Vencimento', etc.
  supplier?: string; // Fornecedor no caso de compra/entrada
  client_name?: string; // Cliente no caso de consumo de procedimento
  clientName?: string;
  service_name?: string; // Serviço no caso de consumo
  unit_price_at_moment: number;
  created_at: string;
}
