// src/pages/public/BusinessSales.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  Calendar,
  Layers,
  ArrowLeft,
  Store,
  ChevronRight,
  Users,
  Check
} from 'lucide-react';
import { AuraLogoV3 } from '../../components/ui/AuraLogoV3';
import { BusinessCockpit } from '../../components/marketing/CockpitPreview';
import { PartnerOnboarding } from '../../components/auth/PartnerOnboarding';
import { AuthPortal } from '../auth/AuthPortal';

export const BusinessSales: React.FC = () => {
  const navigate = useNavigate();

  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-aura-charcoal selection:bg-aura-rose/20 selection:text-aura-charcoal">
      {/* HEADER ESPECÍFICO BUSINESS */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-aura-linen/80">
        <nav className="max-w-7xl mx-auto px-6 sm:px-12 py-5 sm:py-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <AuraLogoV3
              size="sm"
              variant="business"
              onClick={() => navigate('/business')}
              className="cursor-pointer"
            />
            <span className="hidden md:inline-block text-[10px] font-bold text-aura-taupe uppercase tracking-[0.25em] pl-4 border-l border-aura-linen">
              Para Gestores &amp; Clínicas
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => navigate('/')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-aura-taupe hover:text-aura-charcoal transition-colors uppercase tracking-wider"
            >
              <ArrowLeft size={13} />
              <span>Ir para Aura App (Consumidor)</span>
            </button>

            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-xs font-bold text-aura-charcoal border-b-2 border-aura-rose pb-0.5 hover:text-aura-rose transition-colors uppercase tracking-wider"
            >
              JÁ SOU PARCEIRO
            </button>

            <button
              onClick={() => setIsOnboardingModalOpen(true)}
              className="bg-aura-charcoal text-white hover:bg-black px-5 sm:px-7 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-soft-glow hover:scale-102 transition-all"
            >
              CRIAR CONTA
            </button>
          </div>
        </nav>
      </header>

      {/* HERO: APRESENTAÇÃO DAS VANTAGENS SaaS */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-20 sm:pb-28 bg-gradient-to-b from-aura-pearl/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* LADO ESQUERDO: COPYWRITING B2B */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 bg-aura-rose/15 text-aura-rose px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-aura-rose/25">
              <Sparkles size={12} />
              <span>SaaS Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-aura-charcoal leading-[1.15] tracking-tight">
              Transforme sua gestão em <span className="italic text-aura-rose">lucro real.</span>
            </h1>

            <p className="text-aura-taupe text-base sm:text-lg leading-relaxed font-normal">
              O <strong>Aura Business</strong> é a espinha dorsal das clínicas de elite. Controle estoque milimetricamente, precifique cada protocolo por custo real de insumos e apareça no topo para milhares de clientes qualificadas.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => setIsOnboardingModalOpen(true)}
                className="bg-aura-charcoal text-white hover:bg-black px-8 sm:px-10 py-4 sm:py-5 rounded-[32px] font-bold text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-103 transition-all text-center flex items-center justify-center gap-3"
              >
                <span>CRIAR MINHA CONTA AGORA</span>
                <ArrowRight size={14} className="text-aura-rose" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('planos-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-4 rounded-[32px] border border-aura-linen hover:border-aura-charcoal text-aura-charcoal text-xs font-bold uppercase tracking-wider transition-all text-center"
              >
                Ver Planos &amp; Preços
              </button>
            </div>

            {/* TRUST SIGNALS */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-aura-linen/80 text-left">
              <div>
                <p className="text-xl font-serif font-bold text-aura-charcoal">+58.4%</p>
                <p className="text-[10px] text-aura-taupe uppercase font-semibold">Margem Média</p>
              </div>
              <div>
                <p className="text-xl font-serif font-bold text-aura-charcoal">Zero</p>
                <p className="text-[10px] text-aura-taupe uppercase font-semibold">Perda de Insumos</p>
              </div>
              <div>
                <p className="text-xl font-serif font-bold text-aura-charcoal">100%</p>
                <p className="text-[10px] text-aura-taupe uppercase font-semibold">Conciliado PIX/Cartão</p>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: INTERACTIVE COCKPIT PREVIEW */}
          <div className="lg:col-span-7 relative w-full">
            <div className="absolute inset-0 bg-aura-rose/10 rounded-[60px] blur-3xl -z-10" />
            <BusinessCockpit />
          </div>
        </div>
      </section>

      {/* SEÇÃO: OS 3 PILARES DE RETORNO DO INVESTIMENTO */}
      <section className="py-20 sm:py-28 bg-aura-pearl/30 border-t border-aura-linen">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.3em] bg-[#FAF5EB] px-4 py-1.5 rounded-full border border-[#C5A059]/20">
              Arquitetura Operacional
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-aura-charcoal">
              A engenharia financeira da sua clínica
            </h2>
            <p className="text-aura-taupe text-sm sm:text-base leading-relaxed">
              Desenvolvido com donas de clínicas reais para eliminar os pontos cegos que drenam o lucro do faturamento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CARD 1 */}
            <div className="bg-white p-8 rounded-[32px] border border-aura-linen/80 shadow-xs hover:border-aura-rose/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-aura-pearl flex items-center justify-center text-aura-charcoal font-serif font-bold text-xl">
                01
              </div>
              <h3 className="text-xl font-serif font-bold text-aura-charcoal">
                DRE &amp; Faturamento em Tempo Real
              </h3>
              <p className="text-sm text-aura-taupe leading-relaxed">
                Saiba exatamente quanto sobra no final do dia após descontar custos de seringas, toxinas, canetas e comissões da equipe.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 size={15} />
                <span>Conciliação automática sem planilhas</span>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="bg-white p-8 rounded-[32px] border border-aura-linen/80 shadow-xs hover:border-aura-rose/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-aura-pearl flex items-center justify-center text-aura-charcoal font-serif font-bold text-xl">
                02
              </div>
              <h3 className="text-xl font-serif font-bold text-aura-charcoal">
                Precificação Científica por Protocolo
              </h3>
              <p className="text-sm text-aura-taupe leading-relaxed">
                Ficha técnica detalhada para preenchimentos, toxina e bioestimuladores. Nunca mais venda um procedimento sem saber sua margem líquida.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 size={15} />
                <span>Sugestão de preço por markup real</span>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="bg-white p-8 rounded-[32px] border border-aura-linen/80 shadow-xs hover:border-aura-rose/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-aura-pearl flex items-center justify-center text-aura-charcoal font-serif font-bold text-xl">
                03
              </div>
              <h3 className="text-xl font-serif font-bold text-aura-charcoal">
                Vitrine Exclusiva no Marketplace
              </h3>
              <p className="text-sm text-aura-taupe leading-relaxed">
                Sua clínica posicionada como referência no mapa dos Jardins e recomendada diretamente para o público qualificado do Aura App.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 size={15} />
                <span>Fluxo constante de novos agendamentos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: TABELA DE PLANOS DE ENTRADA */}
      <section id="planos-section" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-bold text-aura-rose uppercase tracking-[0.35em] bg-aura-rose/15 px-4 py-1.5 rounded-full border border-aura-rose/25">
              Planos Transparentes
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-aura-charcoal">
              Escolha seu patamar de crescimento
            </h2>
            <p className="text-aura-taupe text-sm sm:text-base leading-relaxed">
              Sem taxas escondidas. Ativação instantânea com suporte dedicado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* PLANO ESSENCIAL */}
            <div className="p-8 sm:p-10 border border-aura-linen rounded-[36px] bg-aura-pearl/30 flex flex-col justify-between hover:border-aura-rose transition-all group">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-aura-taupe mb-2">
                  Entrada
                </div>
                <h3 className="text-2xl font-serif font-bold text-aura-charcoal mb-2">Essencial</h3>
                <p className="text-xs text-aura-taupe mb-6">
                  Agenda de alta performance, prontuário digital e presença no marketplace.
                </p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-sm font-bold text-aura-charcoal">R$</span>
                  <span className="text-4xl font-serif font-bold text-aura-charcoal">197</span>
                  <span className="text-xs text-aura-taupe">/mês</span>
                </div>

                <ul className="space-y-3 text-xs text-aura-charcoal mb-8">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <span>Agenda Inteligente com Lembretes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <span>CRM de Pacientes &amp; Prontuário</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <span>Perfil Oficial no Aura Marketplace</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <span>Até 2 Usuários Simultâneos</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setIsOnboardingModalOpen(true)}
                className="w-full py-4 bg-aura-charcoal hover:bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
              >
                COMEÇAR COM ESSENCIAL
              </button>
            </div>

            {/* PLANO PRO (DESTAQUE) */}
            <div className="p-8 sm:p-10 border-2 border-aura-charcoal rounded-[36px] bg-aura-charcoal text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-4 right-5 text-[9px] font-bold uppercase tracking-widest bg-aura-rose text-white px-3 py-1 rounded-full shadow-2xs">
                MAIS POPULAR
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-aura-rose mb-2">
                  Gestão Completa
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">Pro</h3>
                <p className="text-xs text-gray-300 mb-6">
                  DRE consolidado, controle milimétrico de insumos e precificação científica.
                </p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-sm font-bold text-white">R$</span>
                  <span className="text-4xl font-serif font-bold text-white">347</span>
                  <span className="text-xs text-gray-400">/mês</span>
                </div>

                <ul className="space-y-3 text-xs text-gray-200 mb-8">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span>Tudo do Plano Essencial</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span>DRE &amp; Fluxo de Caixa ao Vivo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span>Estoque com Baixa por Protocolo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span>Calculadora Científica de Margens</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span>Até 5 Usuários Simultâneos</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setIsOnboardingModalOpen(true)}
                className="w-full py-4 bg-aura-rose hover:bg-[#d99c92] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-soft-glow transition-all"
              >
                ESCOLHER PLANO PRO
              </button>
            </div>

            {/* PLANO ELITE */}
            <div className="p-8 sm:p-10 border border-aura-linen rounded-[36px] bg-aura-pearl/30 flex flex-col justify-between hover:border-aura-rose transition-all group">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-2">
                  Máxima Escala
                </div>
                <h3 className="text-2xl font-serif font-bold text-aura-charcoal mb-2">Elite</h3>
                <p className="text-xs text-aura-taupe mb-6">
                  Marketing de retenção, WhatsApp oficial integrado e domínio próprio white-label.
                </p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-sm font-bold text-aura-charcoal">R$</span>
                  <span className="text-4xl font-serif font-bold text-aura-charcoal">597</span>
                  <span className="text-xs text-aura-taupe">/mês</span>
                </div>

                <ul className="space-y-3 text-xs text-aura-charcoal mb-8">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <span>Tudo do Plano Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <span>Automações Oficiais via WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <span>White-label (Domínio Próprio)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <span>Clube de Fidelidade 10+1 e Cashback</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <span>Usuários Ilimitados</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setIsOnboardingModalOpen(true)}
                className="w-full py-4 bg-aura-charcoal hover:bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
              >
                COMEÇAR COM ELITE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER B2B */}
      <footer className="border-t border-aura-linen py-12 bg-white text-xs text-aura-taupe">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <AuraLogoV3 size="xs" variant="business" />
            <span>© 2026 Aura Gestão &amp; Tecnologia de Beleza S.A.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="hover:text-aura-charcoal">
              Aura App (Consumidor)
            </button>
            <button onClick={() => setIsLoginModalOpen(true)} className="hover:text-aura-charcoal">
              Área do Parceiro
            </button>
            <span>Privacidade &amp; LGPD</span>
          </div>
        </div>
      </footer>

      {/* MODAL DE ONBOARDING */}
      {isOnboardingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300">
          <div className="my-auto w-full max-w-4xl">
            <PartnerOnboarding
              onClose={() => setIsOnboardingModalOpen(false)}
              onOpenLogin={() => {
                setIsOnboardingModalOpen(false);
                setIsLoginModalOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* MODAL DE LOGIN PARCEIRO */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300">
          <div className="my-auto w-full max-w-md">
            <AuthPortal
              defaultRole="BUSINESS"
              onClose={() => setIsLoginModalOpen(false)}
              onSuccess={() => {
                setIsLoginModalOpen(false);
                navigate('/business/dashboard');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
