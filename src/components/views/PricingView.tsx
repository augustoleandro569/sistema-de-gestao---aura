import React, { useState } from 'react';
import {
  Calculator,
  Percent,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Clock,
  Sparkles,
  Sliders,
  History,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Service } from '../../types';
import { ServiceCostCalculator } from '../admin/ServiceCostCalculator';
import { ServicePriceCard } from '../pricing/ServicePriceCard';
import { ServicePricingConfig } from '../pricing/ServicePricingConfig';

export const PricingView: React.FC = () => {
  const services = dataService.getServices();
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [pricingMode, setPricingMode] = useState<'detailed' | 'simulator'>('detailed');

  // Active service for the calculator
  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];

  // Editable cost variables for the simulator
  const [productsCost, setProductsCost] = useState(selectedService?.directCost * 0.7 || 18);
  const [disposablesCost, setDisposablesCost] = useState(selectedService?.directCost * 0.3 || 8);
  const [laborHourlyRate, setLaborHourlyRate] = useState(30); // R$/hora
  const [commissionPercent, setCommissionPercent] = useState(selectedService?.commissionRate || 40);
  const [cardFeePercent, setCardFeePercent] = useState(3.5); // 3.5%
  const [taxPercent, setTaxPercent] = useState(3.0); // 3%
  const [fixedCostAllocation, setFixedCostAllocation] = useState(selectedService?.fixedCostAllocation || 18);
  const [targetMargin, setTargetMargin] = useState(45); // 45%

  // Simulation price input
  const [simulationPrice, setSimulationPrice] = useState(selectedService?.price || 150);

  // Synchronize with selected service when switching
  const handleSelectService = (service: Service) => {
    setSelectedServiceId(service.id);
    setProductsCost(Number((service.directCost * 0.7).toFixed(2)));
    setDisposablesCost(Number((service.directCost * 0.3).toFixed(2)));
    setFixedCostAllocation(service.fixedCostAllocation);
    setCommissionPercent(service.commissionRate);
    setSimulationPrice(service.price);
  };

  // Calculations
  const durationHours = (selectedService?.durationMinutes || 60) / 60;
  const directCost = productsCost + disposablesCost;
  const calculatedLaborCost = laborHourlyRate * durationHours;
  const commissionValue = (simulationPrice * commissionPercent) / 100;
  const cardFeeValue = (simulationPrice * cardFeePercent) / 100;
  const taxValue = (simulationPrice * taxPercent) / 100;

  const totalCost = directCost + calculatedLaborCost + commissionValue + cardFeeValue + taxValue + fixedCostAllocation;
  const grossProfit = simulationPrice - totalCost;
  const currentMargin = simulationPrice > 0 ? (grossProfit / simulationPrice) * 100 : 0;

  // Suggested price based on Target Margin:
  // Price = (Direct + Labor + Fixed) / (1 - (Commission% + Card% + Tax% + TargetMargin%)/100)
  const nonVariableCosts = directCost + calculatedLaborCost + fixedCostAllocation;
  const variablePercentage = (commissionPercent + cardFeePercent + taxPercent + targetMargin) / 100;
  const suggestedPrice = variablePercentage < 1 ? nonVariableCosts / (1 - variablePercentage) : nonVariableCosts * 2;

  return (
    <div id="pricing-view" className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white via-[#FAF7F2] to-[#F5EFEB] p-6 rounded-3xl border border-[#EAE3DA] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#2D2725] text-[#F3E7DC] flex items-center justify-center shadow-xs">
            <Calculator size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9C753B]">
                Inteligência Financeira
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#FAF2E6] text-[#9C753B] border border-[#E8D6BC]">
                Módulo Gerencial
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2725]">
              Ficha & Calculadora de Precificação
            </h1>
            <p className="text-xs text-[#7A6E65]">
              Apure custos diretos, mão de obra, rateio de fixos e calcule a margem exata de cada procedimento
            </p>
          </div>
        </div>

        {/* Target Margin Pill */}
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-[#E0D7CC] shadow-2xs">
          <span className="text-xs text-[#8F8278]">Margem Desejada:</span>
          <span className="text-base font-bold text-[#2D2725] font-display">{targetMargin}%</span>
        </div>
      </div>

      {/* Grid de Cards de Precificação (ServicePriceCard) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8F8278]">
            Selecione o Procedimento para Simular & Precificar ({services.length})
          </h3>
          <span className="text-[11px] text-[#8F8278]">Clique em um card para detalhar os custos</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <ServicePriceCard
              key={s.id}
              service={{
                id: s.id,
                name: s.name,
                total_cost: s.totalCost,
                margin_percent: s.profitMargin,
                sale_price: s.price
              }}
              isSelected={selectedServiceId === s.id}
              onClick={() => handleSelectService(s)}
            />
          ))}
        </div>
      </div>

      {/* Main Pricing Breakdown & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Ficha Técnica de Custos) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Seletor de Modo da Ficha */}
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#EDE7DF]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPricingMode('detailed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  pricingMode === 'detailed'
                    ? 'bg-[#2D2725] text-white shadow-xs'
                    : 'text-[#7A6E65] hover:text-[#2D2725]'
                }`}
              >
                Ficha Técnica (Consumo & Rateio)
              </button>
              <button
                type="button"
                onClick={() => setPricingMode('simulator')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  pricingMode === 'simulator'
                    ? 'bg-[#2D2725] text-white shadow-xs'
                    : 'text-[#7A6E65] hover:text-[#2D2725]'
                }`}
              >
                Simulador Avançado de Taxas
              </button>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#FAF8F5] text-[#2D2725] border border-[#E0D7CC]">
              {selectedService.name}
            </span>
          </div>

          {pricingMode === 'detailed' ? (
            <ServicePricingConfig
              key={selectedService.id}
              service={selectedService}
              fixedCostsBreakdown={{
                aluguel: 12.0,
                energiaAgua: 4.5,
                taxaMaquininha: 8.2,
                limpezaAdmin: 5.0,
              }}
            />
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-[#EDE7DF] shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#F4EFEA]">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#2D2725]">
                    Ficha Técnica: {selectedService.name}
                  </h3>
                  <p className="text-xs text-[#8F8278]">
                    Duração: {selectedService.durationMinutes} minutos ({durationHours.toFixed(1)}h de cabine)
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#FAF8F5] text-[#2D2725] border border-[#E0D7CC]">
                  Preço Atual: R$ {selectedService.price.toFixed(2)}
                </span>
              </div>

              {/* Cost Items Breakdown */}
              <div className="space-y-4">
                {/* Calculador Detalhado de Materiais (Ficha Técnica) */}
                <ServiceCostCalculator
                  key={selectedService.id}
                  serviceId={selectedService.id}
                  serviceName={selectedService.name}
                  onChange={(_mats, totalMaterialCost) => {
                    setProductsCost(Number(totalMaterialCost.toFixed(2)));
                  }}
                />

                {/* 1. Custos Diretos Resumo */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#9C753B] block mb-2">
                    1. Custos Diretos (Insumos Ficha Técnica & Descartáveis Auxiliares)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#7A6E65] block mb-1">Insumos da Ficha Técnica (R$)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={productsCost}
                        onChange={(e) => setProductsCost(Number(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#D5C9BD] text-xs font-bold text-[#2D2725]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#7A6E65] block mb-1">Descartáveis Auxiliares (R$)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={disposablesCost}
                        onChange={(e) => setDisposablesCost(Number(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#D5C9BD] text-xs font-bold text-[#2D2725]"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-right text-xs font-semibold text-[#4A423C]">
                    Subtotal Direto: R$ {directCost.toFixed(2)}
                  </div>
                </div>

                {/* 2. Mão de Obra e Rateio */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#9C753B] block mb-2">
                    2. Mão de Obra & Despesas Fixas Rateadas
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#7A6E65] block mb-1">Custo Profissional (R$/hora)</label>
                      <input
                        type="number"
                        value={laborHourlyRate}
                        onChange={(e) => setLaborHourlyRate(Number(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#D5C9BD] text-xs font-bold text-[#2D2725]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#7A6E65] block mb-1">Rateio Custos Fixos (R$)</label>
                      <input
                        type="number"
                        value={fixedCostAllocation}
                        onChange={(e) => setFixedCostAllocation(Number(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#D5C9BD] text-xs font-bold text-[#2D2725]"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-right text-xs font-semibold text-[#4A423C]">
                    Mão de Obra: R$ {calculatedLaborCost.toFixed(2)} • Fixos: R$ {fixedCostAllocation.toFixed(2)}
                  </div>
                </div>

                {/* 3. Comissões e Taxas */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#9C753B] block mb-2">
                    3. Taxas & Comissões sobre o Preço
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] text-[#7A6E65] block mb-1">Comissão (%)</label>
                      <input
                        type="number"
                        value={commissionPercent}
                        onChange={(e) => setCommissionPercent(Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#D5C9BD] text-xs font-bold text-[#2D2725]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#7A6E65] block mb-1">Taxa Cartão (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={cardFeePercent}
                        onChange={(e) => setCardFeePercent(Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#D5C9BD] text-xs font-bold text-[#2D2725]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#7A6E65] block mb-1">Impostos (%)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={taxPercent}
                        onChange={(e) => setTaxPercent(Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#D5C9BD] text-xs font-bold text-[#2D2725]"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-right text-xs font-semibold text-[#4A423C]">
                    Total Taxas + Comissão: R$ {(commissionValue + cardFeeValue + taxValue).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Total Cost Summary */}
              <div className="p-4 rounded-2xl bg-[#2D2725] text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#E8D1C5] block">Custo Total por Atendimento</span>
                  <span className="text-xl font-bold font-display">
                    R$ {totalCost.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#E8D1C5] block">Preço Sugerido (Margem {targetMargin}%)</span>
                  <span className="text-xl font-bold font-display text-[#E8D1C5]">
                    R$ {suggestedPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Simulador em Tempo Real + Alertas) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real-time Simulator Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#EDE7DF] shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F4EFEA]">
              <Sliders size={18} className="text-[#B88746]" />
              <h3 className="font-display text-base font-bold text-[#2D2725]">
                Simulador Dinâmico de Preço
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A423C] mb-1.5">
                Simular Cobrança de Valor:
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-[#8F8278] font-bold">R$</span>
                <input
                  type="number"
                  value={simulationPrice}
                  onChange={(e) => setSimulationPrice(Number(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C9BD] text-base font-bold text-[#2D2725] focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                />
              </div>
            </div>

            {/* Quick Price Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSimulationPrice(Math.round(selectedService.price * 0.9))}
                className="py-1.5 text-xs rounded-lg bg-[#FAF8F5] border border-[#E0D7CC] hover:bg-[#F0EBE3] text-[#524842]"
              >
                R$ {Math.round(selectedService.price * 0.9)} (-10%)
              </button>
              <button
                type="button"
                onClick={() => setSimulationPrice(selectedService.price)}
                className="py-1.5 text-xs rounded-lg bg-[#FAF8F5] border border-[#E0D7CC] hover:bg-[#F0EBE3] text-[#524842] font-semibold"
              >
                R$ {selectedService.price} (Atual)
              </button>
              <button
                type="button"
                onClick={() => setSimulationPrice(Math.round(suggestedPrice))}
                className="py-1.5 text-xs rounded-lg bg-[#FAF2E6] border border-[#ECD9BD] hover:bg-[#F7E6CD] text-[#9C753B] font-bold"
              >
                R$ {Math.round(suggestedPrice)} (Sugerido)
              </button>
            </div>

            {/* Result Simulation Breakdown */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#7A6E65]">Lucro Bruto por Sessão:</span>
                <span className="font-bold text-sm text-[#2D2725]">
                  R$ {grossProfit.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#7A6E65]">Margem Efetiva:</span>
                <span
                  className={`font-bold text-sm ${
                    currentMargin >= 40
                      ? 'text-emerald-800'
                      : currentMargin >= 25
                      ? 'text-amber-800'
                      : 'text-red-800'
                  }`}
                >
                  {currentMargin.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-[#E5DDD2] h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    currentMargin >= 40
                      ? 'bg-emerald-600'
                      : currentMargin >= 25
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, currentMargin))}%` }}
                />
              </div>
            </div>

            {/* Warnings & Alerts */}
            {currentMargin < 25 && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2.5">
                <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block">⚠️ Alerta de Margem Baixa</strong>
                  <span>A margem estimada está abaixo de 25%. Considere ajustar o preço ou negociar insumos.</span>
                </div>
              </div>
            )}

            {simulationPrice < suggestedPrice && currentMargin >= 25 && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block">Preço abaixo do sugerido</strong>
                  <span>Para atingir a margem alvo de {targetMargin}%, o valor recomendado é R$ {suggestedPrice.toFixed(2)}.</span>
                </div>
              </div>
            )}

            {currentMargin >= targetMargin && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block">Excelente Rentabilidade</strong>
                  <span>Preço saudável com margem superior à meta configurada.</span>
                </div>
              </div>
            )}
          </div>

          {/* Ranking Summary of All Services Margins */}
          <div className="bg-white rounded-3xl p-5 border border-[#EDE7DF] shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8F8278]">
              Ranking de Margens da Clínica
            </h4>
            <div className="space-y-2 text-xs">
              {services.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F5]">
                  <span className="font-medium text-[#2D2725] truncate max-w-[180px]">{s.name}</span>
                  <div className="text-right">
                    <span className="font-bold text-emerald-800">
                      {s.profitMargin.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-[#8F8278] block">R$ {s.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
