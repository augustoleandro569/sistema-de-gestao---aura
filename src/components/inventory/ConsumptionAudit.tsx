// src/components/inventory/ConsumptionAudit.tsx
import React, { useState } from 'react';
import {
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Filter,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';

export interface AuditItem {
  id: string;
  name: string;
  reference: string;
  unit: string;
  theoreticalConsumption: number;
  physicalOutflow: number;
  gapPercentage: number;
  type: 'economy' | 'waste' | 'balanced';
  suggestedActionLabel: string;
  actionType: 'recalibrate' | 'readjust' | 'balanced';
  adjustmentPercentage: number;
}

export const ConsumptionAudit: React.FC = () => {
  const [period, setPeriod] = useState<string>('30d');
  const [recalibratedIds, setRecalibratedIds] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const [auditData, setAuditData] = useState<AuditItem[]>([
    {
      id: 'audit-1',
      name: 'Tônico Facial Calmante',
      reference: 'Ref: Limpeza de Pele / Hidratação',
      unit: 'ml',
      theoreticalConsumption: 1500,
      physicalOutflow: 1200,
      gapPercentage: -20,
      type: 'economy',
      suggestedActionLabel: 'RECALIBRAR FICHA TÉCNICA (-15%)',
      actionType: 'recalibrate',
      adjustmentPercentage: -15,
    },
    {
      id: 'audit-2',
      name: 'Cera Elástica 1kg',
      reference: 'Ref: Depilação Completa',
      unit: 'g',
      theoreticalConsumption: 5000,
      physicalOutflow: 6500,
      gapPercentage: 30,
      type: 'waste',
      suggestedActionLabel: 'REAJUSTAR CUSTO NO SERVIÇO (+25%)',
      actionType: 'readjust',
      adjustmentPercentage: 25,
    },
    {
      id: 'audit-3',
      name: 'Sérum Ácido Hialurônico 100ml',
      reference: 'Ref: Harmonização / Microagulhamento',
      unit: 'ml',
      theoreticalConsumption: 450,
      physicalOutflow: 540,
      gapPercentage: 20,
      type: 'waste',
      suggestedActionLabel: 'REAJUSTAR CUSTO NO SERVIÇO (+15%)',
      actionType: 'readjust',
      adjustmentPercentage: 15,
    },
    {
      id: 'audit-4',
      name: 'Kit Luvas Nitrílicas Pink',
      reference: 'Ref: Procedimentos Clínicos Gerais',
      unit: 'pares',
      theoreticalConsumption: 180,
      physicalOutflow: 184,
      gapPercentage: 2.2,
      type: 'balanced',
      suggestedActionLabel: 'PADRÃO EQUILIBRADO',
      actionType: 'balanced',
      adjustmentPercentage: 0,
    },
  ]);

  const handleApplyAdjustment = (item: AuditItem) => {
    if (recalibratedIds.includes(item.id)) return;

    setRecalibratedIds((prev) => [...prev, item.id]);
    setFeedbackMessage(
      `Ajuste aplicado com sucesso para "${item.name}": ${item.suggestedActionLabel}`
    );

    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  const formatNumber = (val: number, unit: string) => {
    return `${val.toLocaleString('pt-BR')} ${unit}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-premium border border-aesthetic-bege/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl font-serif text-graphite">Auditoria de Insumos</h2>
            <p className="text-sm text-aesthetic-graphite/50">
              Comparativo entre consumo por serviço e movimentação física
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="px-4 py-2 bg-aesthetic-off-white rounded-full text-xs font-bold text-graphite border border-aesthetic-bege/30">
              Período: Últimos 30 dias
            </span>
          </div>
        </div>

        {feedbackMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-aesthetic-bege/20">
                <th className="px-4 py-3 text-left">Item / Insumo</th>
                <th className="px-4 py-3 text-center">Consumo Teórico (Seringas/ml/un)</th>
                <th className="px-4 py-3 text-center">Baixa Física (Operador)</th>
                <th className="px-4 py-3 text-center">Diferença (Gap)</th>
                <th className="px-4 py-3 text-right">Sugestão de Ajuste</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aesthetic-bege/10">
              {auditData.map((item) => {
                const isRecalibrated = recalibratedIds.includes(item.id);

                return (
                  <tr key={item.id} className="hover:bg-aesthetic-off-white/40 transition-colors">
                    {/* Item / Insumo */}
                    <td className="px-4 py-6">
                      <p className="font-bold text-graphite">{item.name}</p>
                      <p className="text-[10px] text-gray-400">{item.reference}</p>
                    </td>

                    {/* Consumo Teórico */}
                    <td className="px-4 py-6 text-center text-sm font-medium text-graphite">
                      {formatNumber(item.theoreticalConsumption, item.unit)}
                    </td>

                    {/* Baixa Física */}
                    <td className="px-4 py-6 text-center text-sm font-medium text-graphite">
                      {formatNumber(item.physicalOutflow, item.unit)}
                    </td>

                    {/* Diferença (Gap) */}
                    <td className="px-4 py-6 text-center">
                      {item.type === 'economy' ? (
                        <span className="text-emerald-600 font-bold text-sm">
                          {item.gapPercentage}% (Economia)
                        </span>
                      ) : item.type === 'waste' ? (
                        <span className="text-rose-600 font-bold text-sm">
                          +{item.gapPercentage}% (Desperdício)
                        </span>
                      ) : (
                        <span className="text-gray-500 font-semibold text-xs">
                          +{item.gapPercentage}% (Equilibrado)
                        </span>
                      )}
                    </td>

                    {/* Sugestão de Ajuste */}
                    <td className="px-4 py-6 text-right">
                      {item.type === 'economy' ? (
                        <button
                          type="button"
                          onClick={() => handleApplyAdjustment(item)}
                          disabled={isRecalibrated}
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                            isRecalibrated
                              ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-default'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-2xs'
                          }`}
                        >
                          {isRecalibrated ? 'FICHA TÉCNICA RECALIBRADA' : item.suggestedActionLabel}
                        </button>
                      ) : item.type === 'waste' ? (
                        <button
                          type="button"
                          onClick={() => handleApplyAdjustment(item)}
                          disabled={isRecalibrated}
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                            isRecalibrated
                              ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-default'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 shadow-2xs'
                          }`}
                        >
                          {isRecalibrated ? 'CUSTO ATUALIZADO NO SERVIÇO' : item.suggestedActionLabel}
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider border border-gray-200/60">
                          Calibração OK
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionAudit;
