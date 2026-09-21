import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  DollarSign,
  Percent,
  CalendarClock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Tag,
  X,
  Sliders
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Service } from '../../types';
import { ServicePricingConfig } from '../pricing/ServicePricingConfig';

interface ServicesViewProps {
  onNavigateToPricing: () => void;
  onOpenNewAppointment?: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onNavigateToPricing,
  onOpenNewAppointment,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [pricingServiceModal, setPricingServiceModal] = useState<Service | null>(null);

  const services = dataService.getServices();

  const getCategoryName = (categoryId: string) => {
    switch (categoryId) {
      case 'cat-sobrancelhas': return 'Sobrancelhas & Cílios';
      case 'cat-facial': return 'Tratamentos Faciais';
      case 'cat-depilacao': return 'Depilação a Laser';
      case 'cat-massagem': return 'Massagens';
      default: return 'Estética';
    }
  };

  const filteredServices = (services || []).filter((s) => {
    const categoryName = getCategoryName(s.categoryId);
    const matchCategory =
      selectedCategory === 'todas'
        ? true
        : categoryName.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          s.categoryId.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  return (
    <div id="services-view" className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EDE7DF] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D2725] text-[#F3E7DC] flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2D2725]">
              Catálogo de Procedimentos
            </h1>
            <p className="text-xs text-[#8F8278]">
              Cadastros com custos, margem calculada, duração e ciclo de retorno individualizado
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateToPricing}
            className="px-4 py-2 rounded-xl bg-white border border-[#E0D7CC] text-xs font-semibold text-[#4A423C] hover:bg-[#FAF8F5] transition-all shadow-2xs"
          >
            Ficha de Precificação
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-2xl border border-[#EDE7DF]">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC]">
          <Search size={16} className="text-[#8F8278] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome do serviço ou procedimento..."
            className="w-full bg-transparent text-xs text-[#2D2725] placeholder-[#9C8F85] focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs font-medium text-[#2D2725]"
        >
          <option value="todas">Todas as Categorias</option>
          <option value="sobrancelhas">Sobrancelhas & Cílios</option>
          <option value="facial">Tratamentos Faciais</option>
          <option value="depilacao">Depilação a Laser</option>
          <option value="massagem">Massagens</option>
        </select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl p-5 border border-[#EDE7DF] shadow-xs hover:border-[#D0C2B4] transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF2E6] text-[#9C753B]">
                  {getCategoryName(service.categoryId)}
                </span>
                <span className="font-bold text-base text-[#2D2725] font-display">
                  R$ {service.price.toFixed(2)}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#2D2725] font-display">
                {service.name}
              </h3>
              <p className="text-xs text-[#7A6E65] line-clamp-2">
                {service.description}
              </p>
            </div>

            {/* Technical Service Badges */}
            <div className="grid grid-cols-2 gap-2 py-2.5 px-3 bg-[#FAF8F5] rounded-xl border border-[#EBE4DC] text-xs">
              <div className="flex items-center gap-1.5 text-[#524842]">
                <Clock size={13} className="text-[#8F8278]" />
                <span>{service.durationMinutes} min</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#524842]">
                <CalendarClock size={13} className="text-[#B88746]" />
                <span>Retorno: <strong>{service.recommendedReturnDays} dias</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-[#524842]">
                <Percent size={13} className="text-emerald-700" />
                <span className="font-bold text-emerald-800">
                  Margem: {service.profitMargin.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#524842]">
                <DollarSign size={13} className="text-[#8F8278]" />
                <span>Custo: R$ {service.totalCost.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-[#F4EFEA] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setPricingServiceModal(service)}
                className="flex-1 py-1.5 rounded-xl border border-[#E0D7CC] hover:bg-[#FAF8F5] text-xs font-semibold text-[#4A423C] transition-colors text-center cursor-pointer"
              >
                Ver Custos
              </button>
              <button
                type="button"
                onClick={onOpenNewAppointment}
                className="flex-1 py-1.5 rounded-xl bg-[#2D2725] hover:bg-[#3D3532] text-white text-xs font-semibold transition-colors text-center cursor-pointer"
              >
                Agendar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: FICHA TÉCNICA E CÁLCULO DE PRECIFICAÇÃO */}
      {pricingServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[32px] max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-aesthetic-bege/40 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-aesthetic-bege/30">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9C753B] bg-[#FAF2E6] px-2.5 py-0.5 rounded-full">
                  Ficha Técnica & Precificação
                </span>
                <h3 className="text-xl font-serif text-graphite font-bold mt-1">
                  {pricingServiceModal.name}
                </h3>
                <p className="text-xs text-aesthetic-graphite/60">
                  Duração: {pricingServiceModal.durationMinutes} minutos • Retorno recomendado: {pricingServiceModal.recommendedReturnDays} dias
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onNavigateToPricing}
                  className="px-3 py-1.5 rounded-xl bg-aesthetic-off-white border border-aesthetic-bege text-xs font-bold text-graphite hover:bg-white transition-all cursor-pointer"
                >
                  Abrir no Módulo Precificação
                </button>
                <button
                  type="button"
                  onClick={() => setPricingServiceModal(null)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-graphite transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <ServicePricingConfig
              key={pricingServiceModal.id}
              service={pricingServiceModal}
              fixedCostsBreakdown={{
                aluguel: 12.0,
                energiaAgua: 4.5,
                taxaMaquininha: 8.2,
                limpezaAdmin: 5.0,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
