// src/components/pricing/ServicePriceCard.tsx
import React from 'react';

export interface ServicePriceCardProps {
  service: {
    id?: string;
    name: string;
    total_cost?: number;
    totalCost?: number;
    margin_percent?: number;
    profitMargin?: number;
    sale_price?: number;
    price?: number;
  };
  onClick?: () => void;
  isSelected?: boolean;
}

export const ServicePriceCard: React.FC<ServicePriceCardProps> = ({
  service,
  onClick,
  isSelected = false
}) => {
  const totalCost = service.total_cost ?? service.totalCost ?? 0;
  const marginPercent = service.margin_percent ?? service.profitMargin ?? 0;
  const salePrice = service.sale_price ?? service.price ?? 0;

  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-[32px] border transition-all cursor-pointer group shadow-premium hover:border-rose-300 ${
        isSelected
          ? 'border-rose-400 ring-2 ring-rose-200/50 bg-[#FFFDFD]'
          : 'border-aesthetic-bege/30'
      }`}
    >
      <h3 className="text-lg font-bold text-graphite mb-4 group-hover:text-rose-700 transition-colors line-clamp-1">
        {service.name}
      </h3>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-3 bg-aesthetic-off-white rounded-2xl">
          <p className="text-[10px] text-gray-400 font-bold uppercase">Custo Total</p>
          <p className="text-sm font-bold text-graphite">
            R$ {typeof totalCost === 'number' ? totalCost.toFixed(2) : totalCost}
          </p>
        </div>
        <div className="text-center p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
          <p className="text-[10px] text-emerald-600 font-bold uppercase">Margem %</p>
          <p className="text-sm font-bold text-emerald-700">
            {typeof marginPercent === 'number' ? marginPercent.toFixed(1) : marginPercent}%
          </p>
        </div>
        <div className="text-center p-3 bg-rose-50 rounded-2xl border border-rose-100">
          <p className="text-[10px] text-rose-600 font-bold uppercase">Preço</p>
          <p className="text-sm font-bold text-rose-700">
            R$ {typeof salePrice === 'number' ? salePrice.toFixed(2) : salePrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServicePriceCard;
