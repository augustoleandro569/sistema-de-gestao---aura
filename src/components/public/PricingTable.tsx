// src/components/public/PricingTable.tsx
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface FeatureItemProps {
  text: string;
  light?: boolean;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ text, light = false }) => (
  <li className="flex items-start gap-3 text-xs leading-relaxed">
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
        light ? 'bg-aura-rose/30 text-white' : 'bg-aura-linen text-aura-charcoal'
      }`}
    >
      <Check size={12} strokeWidth={2.5} />
    </div>
    <span className={light ? 'text-white/90 font-light' : 'text-aura-charcoal/80 font-normal'}>
      {text}
    </span>
  </li>
);

export interface PricingTableProps {
  onSelectPlan?: (planName: string) => void;
}

export const PricingTable: React.FC<PricingTableProps> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleChoose = (planName: string) => {
    if (onSelectPlan) {
      onSelectPlan(planName);
    }
  };

  return (
    <section id="planos" className="py-28 sm:py-36 bg-aura-pearl relative overflow-hidden">
      {/* Luz difusa decorativa */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-aura-rose/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 sm:mb-20 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-aura-rose/30 shadow-2xs mb-6 sm:mb-8">
            <Sparkles size={12} className="text-aura-rose" />
            <span className="text-[10px] font-bold text-aura-taupe uppercase tracking-[0.3em]">
              Investimento Estruturado
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-aura-charcoal tracking-tight leading-[1.2] mb-5">
            Escolha seu patamar de crescimento
          </h2>
          <p className="text-aura-taupe uppercase text-[10px] font-bold tracking-[0.35em] max-w-lg mx-auto mb-8 sm:mb-10">
            Planos flexíveis que pagam a si mesmos desde o primeiro mês
          </p>

          {/* Toggle Mensal / Anual */}
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-aura-linen flex items-center gap-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-aura-charcoal text-white shadow-xs'
                    : 'text-aura-taupe hover:text-aura-charcoal'
                }`}
              >
                Mensal
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-aura-charcoal text-white shadow-xs'
                    : 'text-aura-taupe hover:text-aura-charcoal'
                }`}
              >
                Anual
                <span className="text-[9px] bg-aura-rose text-aura-charcoal px-2 py-0.5 rounded-full font-extrabold uppercase">
                  -20% OFF
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          {/* PLANO ESSENCIAL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 sm:p-10 rounded-[44px] border border-aura-linen shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xl font-serif font-bold text-aura-charcoal">Essencial</h4>
                <span className="text-[10px] font-bold text-aura-taupe uppercase tracking-widest bg-aura-linen/60 px-3 py-1 rounded-full">
                  Individual
                </span>
              </div>
              <p className="text-xs text-aura-taupe mb-6 leading-relaxed">
                Ideal para profissionais autônomos e biomédicos iniciando sua própria carteira.
              </p>

              <div className="flex items-baseline gap-1 text-4xl font-bold text-aura-charcoal mb-8">
                {billingCycle === 'annual' ? 'R$ 157' : 'R$ 197'}
                <span className="text-xs font-normal text-aura-taupe">/mês</span>
              </div>

              <ul className="space-y-4 mb-10">
                <FeatureItem text="Agenda Inteligente Ilimitada com confirmações" />
                <FeatureItem text="CRM de Clientes & Fichas de Anamnese Digital" />
                <FeatureItem text="Página de Agendamento Online Personalizada" />
                <FeatureItem text="Visibilidade Básica no Marketplace Aura" />
                <FeatureItem text="Histórico de procedimentos por CPF" />
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleChoose('Essencial')}
              className="w-full py-4 border border-aura-linen rounded-full text-[10px] font-bold uppercase tracking-widest text-aura-charcoal hover:bg-aura-charcoal hover:text-white transition-all cursor-pointer shadow-2xs"
            >
              Começar Agora
            </button>
          </motion.div>

          {/* PLANO PROFESSIONAL (DESTAQUE / MAIS ESCOLHIDO) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-aura-charcoal p-8 sm:p-12 rounded-[48px] shadow-2xl flex flex-col justify-between relative border-2 border-aura-rose/30 lg:-translate-y-4"
          >
            {/* Badge Flutuante */}
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-aura-rose text-aura-charcoal px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md flex items-center gap-1.5">
              <Zap size={12} className="fill-current" /> Mais Escolhido
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-2xl font-serif text-white font-bold">Professional</h4>
                <span className="text-[10px] font-bold text-aura-rose uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                  Clínica de Elite
                </span>
              </div>
              <p className="text-xs text-white/70 mb-6 leading-relaxed">
                A torre de comando completa para clínicas em expansão que buscam precisão cirúrgica de lucros.
              </p>

              <div className="flex items-baseline gap-1 text-4xl font-bold text-white mb-8">
                {billingCycle === 'annual' ? 'R$ 277' : 'R$ 347'}
                <span className="text-xs font-normal text-white/60">/mês</span>
              </div>

              <ul className="space-y-4 mb-10 text-white/90">
                <FeatureItem text="Tudo do Plano Essencial" light />
                <FeatureItem text="DRE Financeiro Automatizado em Tempo Real" light />
                <FeatureItem text="Controle de Estoque & Custo por ml de Insumos" light />
                <FeatureItem text="Calculadora Científica de Margem Líquida" light />
                <FeatureItem text="Destaque Prioritário no Mapa e no Feed" light />
                <FeatureItem text="Publicação de Posts & Vídeos no Aura Explore" light />
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleChoose('Professional')}
              className="w-full py-4 bg-aura-rose text-aura-charcoal rounded-full text-[10px] font-bold uppercase tracking-widest shadow-soft-glow hover:scale-105 active:scale-95 transition-all cursor-pointer font-sans"
            >
              Potencializar minha Clínica
            </button>
          </motion.div>

          {/* PLANO ELITE (WHITE-LABEL / EXPANSÃO) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-8 sm:p-10 rounded-[44px] border border-aura-linen shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xl font-serif font-bold text-aura-charcoal">Aura Elite</h4>
                <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200/50">
                  White-Label
                </span>
              </div>
              <p className="text-xs text-aura-taupe mb-6 leading-relaxed">
                Para redes e clínicas consolidadas que exigem autoridade, customização e suporte VIP dedicado.
              </p>

              <div className="flex items-baseline gap-1 text-4xl font-bold text-aura-charcoal mb-8">
                {billingCycle === 'annual' ? 'R$ 477' : 'R$ 597'}
                <span className="text-xs font-normal text-aura-taupe">/mês</span>
              </div>

              <ul className="space-y-4 mb-10">
                <FeatureItem text="Tudo do Plano Professional" />
                <FeatureItem text="Branding Customizado White-Label (Sua Marca)" />
                <FeatureItem text="Automação de WhatsApp Oficial (API Meta)" />
                <FeatureItem text="Gestão Multi-unidades com DRE Consolidado" />
                <FeatureItem text="Programa de Fidelidade Aura Club Exclusivo" />
                <FeatureItem text="Consultoria Mensal de Lucratividade & Crescimento" />
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleChoose('Elite')}
              className="w-full py-4 bg-aura-charcoal text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all cursor-pointer shadow-md"
            >
              Seja uma Clínica Elite
            </button>
          </motion.div>
        </div>

        {/* Garantia & Segurança */}
        <div className="mt-16 text-center flex flex-wrap items-center justify-center gap-6 text-xs text-aura-taupe">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Cancelamento flexível sem fidelidade forçada</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-aura-linen" />
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-aura-rose" />
            <span>Setup assistido e migração de prontuários gratuita</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingTable;
