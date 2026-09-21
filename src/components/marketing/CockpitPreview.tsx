// src/components/marketing/CockpitPreview.tsx
import React from 'react';
import { motion } from 'motion/react';
import { AuraLogoV3 } from '../ui/AuraLogoV3';

export interface CockpitPreviewProps {
  className?: string;
}

export const BusinessCockpit: React.FC<CockpitPreviewProps> = ({ className = '' }) => {
  const protocols = [
    {
      name: 'Preenchimento Labial (Ácido Hialurônico 1ml)',
      margin: '72%',
      marginWidth: '72%',
      profit: 'R$ 1.360',
    },
    {
      name: 'Toxina Botulínica Full Face (50U)',
      margin: '64%',
      marginWidth: '64%',
      profit: 'R$ 1.150',
    },
    {
      name: 'Bioestimulador de Colágeno (Radiesse 1.5ml)',
      margin: '68%',
      marginWidth: '68%',
      profit: 'R$ 1.660',
    },
  ];

  return (
    <div
      className={`p-6 sm:p-8 lg:p-9 bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl border border-aura-linen/80 transition-all duration-500 ${className}`}
    >
      {/* HEADER: IDENTIDADE E STATUS */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 sm:mb-8">
        <div className="flex flex-col items-start gap-1">
          <AuraLogoV3 size="sm" variant="business" />
          <div className="mt-1 pl-2.5 border-l-2 border-aura-rose ml-0.5">
            <p className="text-[10px] font-bold text-aura-taupe uppercase tracking-[0.25em]">
              Sublime Estética • DRE Consolidado
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50/80 px-3.5 py-1.5 rounded-full border border-emerald-200/50 shadow-2xs">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest whitespace-nowrap">
            Inteligência ao Vivo
          </span>
        </div>
      </header>

      {/* KPI GRID: MÉTRICAS MESTRAS (EQUILÍBRIO E PROPORÇÃO HARMONIOSA) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-6 sm:mb-8">
        {/* KPI 1: FATURAMENTO */}
        <div className="bg-aura-pearl/50 border border-aura-linen/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all hover:border-aura-rose/40">
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-aura-taupe uppercase tracking-[0.2em]">
              Faturamento
            </p>
            <div className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-xs sm:text-sm font-sans font-medium text-aura-taupe">R$</span>
              <span className="text-xl sm:text-2xl xl:text-[26px] font-serif font-bold text-aura-charcoal tracking-tight">
                142.850
              </span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-emerald-600 mt-2 whitespace-nowrap">
            +18.4% <span className="text-aura-taupe/80 font-normal lowercase">vs mês anterior</span>
          </p>
        </div>

        {/* KPI 2: CUSTO DE INSUMOS */}
        <div className="bg-aura-pearl/50 border border-aura-linen/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all hover:border-aura-rose/40">
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-aura-taupe uppercase tracking-[0.2em]">
              Custo de Insumos
            </p>
            <div className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-xs sm:text-sm font-sans font-medium text-aura-taupe">R$</span>
              <span className="text-xl sm:text-2xl xl:text-[26px] font-serif font-bold text-aura-charcoal tracking-tight">
                28.420
              </span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-aura-taupe mt-2 whitespace-nowrap">
            19.8% <span className="font-normal">da receita bruta</span>
          </p>
        </div>

        {/* KPI 3: MARGEM LÍQUIDA (DESTAQUE LUMINOUS LUXURY COM ALTURA HARMONIZADA) */}
        <div className="bg-aura-charcoal text-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-soft-glow relative overflow-hidden group">
          <div className="absolute top-2.5 right-3 opacity-25 text-aura-rose text-xs pointer-events-none select-none">
            ✦
          </div>
          <div className="space-y-1 relative z-10">
            <p className="text-[9px] font-bold text-aura-rose uppercase tracking-[0.2em]">
              Margem Líquida
            </p>
            <div className="text-xl sm:text-2xl xl:text-[26px] font-serif font-bold text-white tracking-tight whitespace-nowrap">
              58.4%
            </div>
          </div>
          <p className="text-[10px] font-bold text-emerald-400 mt-2 relative z-10 whitespace-nowrap">
            R$ 83.420 líq.
          </p>
        </div>
      </section>

      {/* ANALÍTICO: RENTABILIDADE POR PROTOCOLO */}
      <section className="space-y-4 sm:space-y-5">
        <div className="flex justify-between items-end border-b border-aura-linen/80 pb-2.5">
          <h3 className="text-sm sm:text-base font-serif font-bold text-aura-charcoal">
            Rentabilidade por Protocolo
          </h3>
          <span className="text-[9px] font-bold text-aura-taupe uppercase tracking-widest">
            Custo Fracionado / ml
          </span>
        </div>

        <div className="space-y-3.5 sm:space-y-4">
          {protocols.map((protocol, idx) => (
            <div key={idx} className="space-y-1.5 group">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs gap-1">
                <span className="font-medium text-aura-charcoal text-[11px] sm:text-xs group-hover:text-aura-rose transition-colors">
                  {protocol.name}
                </span>
                <div className="flex items-center gap-3 text-[10px] sm:text-[11px] shrink-0">
                  <span className="text-emerald-600 font-bold">Margem: {protocol.margin}</span>
                  <span className="text-aura-taupe">Lucro {protocol.profit}</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-aura-linen/80 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: protocol.marginWidth }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.12, ease: 'easeOut' }}
                  className="h-full bg-aura-charcoal group-hover:bg-aura-rose transition-colors duration-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RODAPÉ DE AUDITORIA */}
      <footer className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-aura-linen/80 flex flex-col sm:flex-row justify-between items-center gap-2 text-aura-taupe text-[9px] font-bold uppercase tracking-[0.2em]">
        <span>✓ 100% conciliado via PIX & Cartão</span>
        <span>Zero planilhas manuais</span>
      </footer>
    </div>
  );
};

export default BusinessCockpit;
