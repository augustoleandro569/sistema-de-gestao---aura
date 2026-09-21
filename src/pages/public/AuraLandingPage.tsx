// src/pages/public/AuraLandingPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { AuraLogoV3 } from '../../components/ui/AuraLogoV3';
import { AuraLoaderV3 } from '../../components/ui/AuraLoaderV3';
import { PricingTable } from '../../components/public/PricingTable';
import { BusinessCockpit } from '../../components/marketing/CockpitPreview';
import {
  ArrowRight,
  Store,
  Smartphone,
  ShieldCheck,
  Sparkles,
  Zap,
  Calendar,
  Layers,
  Star,
  CheckCircle2,
  TrendingUp,
  Globe,
  MapPin,
  Award,
  Crown,
  Check,
  ChevronRight,
  Flame,
  Clock,
  Heart,
  BadgePercent,
  Compass,
} from 'lucide-react';
import { AuthPortal } from '../auth/AuthPortal';

export const AuraLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [navVariant, setNavVariant] = useState<'app' | 'business'>('app');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRoleTarget, setAuthRoleTarget] = useState<'CLIENT' | 'BUSINESS'>('CLIENT');

  const openAuth = (role: 'CLIENT' | 'BUSINESS') => {
    setAuthRoleTarget(role);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-aura-pearl overflow-x-hidden selection:bg-aura-rose/30 selection:text-aura-charcoal">
      {/* NAVBAR FLUTUANTE COM LOGO INTERATIVA */}
      <nav className="fixed top-0 w-full z-[100] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl border border-white/50 rounded-[32px] px-6 sm:px-8 py-3 flex justify-between items-center shadow-luminous transition-all">
          <AuraLogoV3
            size="sm"
            variant={navVariant}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />

          <div className="hidden md:flex gap-7 lg:gap-9 text-[10px] font-bold uppercase tracking-[0.3em] text-aura-taupe">
            <a
              href="#consumidor"
              onMouseEnter={() => setNavVariant('app')}
              className="hover:text-aura-charcoal transition-colors py-1"
            >
              Aura App
            </a>
            <a
              href="#business-intelligence"
              onMouseEnter={() => setNavVariant('business')}
              className="hover:text-aura-charcoal transition-colors py-1"
            >
              Aura Business
            </a>
            <a
              href="#planos"
              onMouseEnter={() => setNavVariant('business')}
              className="hover:text-aura-charcoal transition-colors py-1"
            >
              Planos
            </a>
            <a
              href="#tecnologia"
              className="hover:text-aura-charcoal transition-colors py-1"
            >
              Tecnologia
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth('CLIENT')}
              className="bg-aura-charcoal text-white px-6 sm:px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-soft-glow cursor-pointer"
            >
              Acessar Portal
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION: O DESPERTAR DA MARCA */}
      <section className="relative pt-36 sm:pt-44 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-10 sm:space-y-12">
          {/* Logo Central em Destaque (Ímã Visual) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center mb-2"
          >
            <AuraLogoV3 size="lg" variant={navVariant} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-md rounded-full border border-aura-rose/40 shadow-xs"
          >
            <Sparkles size={14} className="text-aura-rose" />
            <span className="text-[10px] font-bold text-aura-taupe uppercase tracking-[0.25em]">
              The Luminous Gateway • Um Universo de Possibilidades
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl sm:text-6xl md:text-8xl font-serif text-aura-charcoal leading-tight tracking-tight"
          >
            A estética em sua <br />
            <span className="italic text-aura-rose font-normal">forma mais fluida.</span>
          </motion.h1>

          <p className="text-aura-taupe text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            A primeira plataforma que une a descoberta de serviços de elite à gestão científica de alta performance.
          </p>

          {/* CTAs DUPLOS COM MICRO-INTERAÇÕES */}
          <div className="flex flex-col sm:flex-row justify-center gap-5 sm:gap-6 pt-6">
            <button
              onClick={() => openAuth('CLIENT')}
              onMouseEnter={() => setNavVariant('app')}
              className="group bg-aura-charcoal text-white px-10 sm:px-12 py-5 sm:py-6 rounded-[32px] flex items-center justify-between gap-6 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="text-left">
                <p className="text-[10px] font-bold text-aura-rose uppercase tracking-widest">
                  Para Você
                </p>
                <p className="text-lg sm:text-xl font-serif">Baixar Aura App</p>
              </div>
              <Smartphone
                size={28}
                className="group-hover:scale-110 transition-transform text-white/90"
              />
            </button>

            <button
              onClick={() => openAuth('BUSINESS')}
              onMouseEnter={() => setNavVariant('business')}
              className="group bg-white border border-aura-linen text-aura-charcoal px-10 sm:px-12 py-5 sm:py-6 rounded-[32px] flex items-center justify-between gap-6 hover:border-aura-rose hover:scale-[1.02] active:scale-[0.98] transition-all shadow-luminous cursor-pointer"
            >
              <div className="text-left">
                <p className="text-[10px] font-bold text-aura-taupe uppercase tracking-widest">
                  Para sua Clínica
                </p>
                <p className="text-lg sm:text-xl font-serif">Aura Business</p>
              </div>
              <Store
                size={28}
                className="group-hover:rotate-12 transition-transform text-aura-rose"
              />
            </button>
          </div>
        </div>

        {/* Elementos de fundo (Auras suaves) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[15%] w-96 h-96 bg-aura-rose/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-aura-taupe/10 rounded-full blur-[150px]" />
        </div>
      </section>

      {/* SEÇÃO: PARA A CLÍNICA (DEEP DIVE: INTELIGÊNCIA OPERACIONAL) */}
      <section id="business-intelligence" className="py-28 sm:py-36 bg-white overflow-hidden border-t border-aura-linen/80">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          <div className="lg:col-span-5 space-y-10 sm:space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.35em] bg-[#FAF5EB] px-4 py-2 rounded-full border border-[#C5A059]/25 shadow-2xs">
                <Sparkles size={12} className="text-[#C5A059]" />
                <span>Gestão como Ciência • Crescimento como Arte</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-serif text-aura-charcoal leading-[1.18] tracking-tight">
                Sua clínica nas mãos de quem <br />
                <span className="italic text-aura-rose">entende de lucro.</span>
              </h2>
              <p className="text-aura-taupe text-base sm:text-lg leading-relaxed pt-1">
                O Aura Business transforma dados brutos em decisões estratégicas. Esqueça planilhas complexas; tenha um DRE real e um estoque auditado em segundos.
              </p>
            </div>

            <div className="space-y-7">
              {/* Oportunidade 1: Financeiro */}
              <div className="flex gap-5 sm:gap-6 group">
                <div className="w-14 h-14 bg-aura-linen rounded-2xl flex items-center justify-center text-aura-charcoal group-hover:bg-aura-rose group-hover:text-white transition-all shrink-0 shadow-2xs">
                  <TrendingUp size={26} />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-aura-charcoal">Lucratividade de Precisão</h4>
                  <p className="text-sm text-aura-taupe mt-1 leading-relaxed">
                    Saiba o custo real de cada ml de produto e sua margem líquida por procedimento, eliminando perdas ocultas em frascos abertos.
                  </p>
                </div>
              </div>

              {/* Oportunidade 2: Marketplace */}
              <div className="flex gap-5 sm:gap-6 group">
                <div className="w-14 h-14 bg-aura-linen rounded-2xl flex items-center justify-center text-aura-charcoal group-hover:bg-aura-rose group-hover:text-white transition-all shrink-0 shadow-2xs">
                  <Globe size={26} />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-aura-charcoal">Vitrine Infinita</h4>
                  <p className="text-sm text-aura-taupe mt-1 leading-relaxed">
                    Sua clínica em destaque no marketplace de estética de alta renda, atraindo clientes qualificados 24 horas por dia com agendamento direto.
                  </p>
                </div>
              </div>

              {/* Oportunidade 3: Automação Inteligente */}
              <div className="flex gap-5 sm:gap-6 group">
                <div className="w-14 h-14 bg-aura-linen rounded-2xl flex items-center justify-center text-aura-charcoal group-hover:bg-aura-rose group-hover:text-white transition-all shrink-0 shadow-2xs">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-aura-charcoal">Prontuário & Compliance Blindado</h4>
                  <p className="text-sm text-aura-taupe mt-1 leading-relaxed">
                    Termos de consentimento digital, fichas de anamnese fotográficas e histórico clínico seguro por CPF.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => openAuth('BUSINESS')}
                className="bg-aura-charcoal text-white px-8 sm:px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-3 cursor-pointer"
              >
                Conhecer a Torre de Comando <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* ASSET VISUAL: Aura Business Cockpit (v4.0) com Respiro Visual e Luminous Grid */}
          <div className="lg:col-span-7 relative w-full">
            <div className="absolute inset-0 bg-aura-rose/10 rounded-[60px] blur-3xl -z-10" />
            <BusinessCockpit />
          </div>
        </div>
      </section>

      {/* SEÇÃO: PARA O CONSUMIDOR (DEEP DIVE: A CURADORIA DA BELEZA) */}
      <section id="consumidor" className="py-28 sm:py-36 bg-aura-pearl border-t border-aura-linen">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            {/* Tag / Pill com Respiro e Isolamento Visual */}
            <div className="inline-flex items-center gap-2 text-[10px] font-bold text-aura-rose uppercase tracking-[0.35em] bg-white px-5 py-2 rounded-full border border-aura-rose/30 shadow-2xs mb-6 sm:mb-8">
              <Sparkles size={12} className="text-aura-rose" />
              <span>Aura App • A Curadoria da Beleza</span>
            </div>

            {/* Título Principal com Altura de Linha Elegante */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-aura-charcoal leading-[1.2] tracking-tight mb-5 sm:mb-6">
              Um acessório de luxo indispensável.
            </h2>

            {/* Subtítulo com Margem e Leitura Ampla */}
            <p className="text-aura-taupe text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Descubra tendências, encontre os profissionais mais prestigiados da sua cidade e seja recompensada por cada cuidado consigo mesma.
            </p>
          </div>

          {/* Grid de 3 Pilares do Consumidor */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* PILAR 1: EXPLORAR */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-[44px] p-8 border border-aura-linen shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-aura-rose/15 flex items-center justify-center text-aura-charcoal group-hover:scale-110 transition-transform">
                  <Compass size={24} className="text-aura-charcoal" />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-aura-rose uppercase tracking-widest">
                    Aba Explorar
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-aura-charcoal">
                    Inspiração sem Limites
                  </h3>
                  <p className="text-xs sm:text-sm text-aura-taupe leading-relaxed">
                    Descubra tendências e resultados reais de antes e depois verificados antes de agendar. Um feed fluido de alta estética.
                  </p>
                </div>

                {/* Mockup Visual Grid Macro */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-inner bg-aura-linen">
                    <img
                      src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80"
                      alt="Skin Glow"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-inner bg-aura-linen">
                    <img
                      src="https://images.unsplash.com/photo-1512290900672-1f41d9c1543b?auto=format&fit=crop&w=500&q=80"
                      alt="Lips Treatment"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-aura-linen/80 mt-6">
                <button
                  onClick={() => openAuth('CLIENT')}
                  className="w-full py-3 bg-aura-linen rounded-full text-[10px] font-bold uppercase tracking-widest text-aura-charcoal hover:bg-aura-charcoal hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Navegar no Feed <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>

            {/* PILAR 2: MAPA AURA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white rounded-[44px] p-8 border border-aura-linen shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-aura-rose/15 flex items-center justify-center text-aura-charcoal group-hover:scale-110 transition-transform">
                  <MapPin size={24} className="text-aura-rose" />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-aura-rose uppercase tracking-widest">
                    Mapa Minimalista
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-aura-charcoal">
                    Conveniência Premium
                  </h3>
                  <p className="text-xs sm:text-sm text-aura-taupe leading-relaxed">
                    Encontre as melhores mãos e as clínicas mais renomadas da cidade onde quer que você esteja, com pins inteligentes e rotas rápidas.
                  </p>
                </div>

                {/* Mockup Visual do Mapa */}
                <div className="rounded-2xl p-4 bg-aura-linen/50 border border-aura-linen relative overflow-hidden space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-aura-charcoal">
                    <span>Jardins • São Paulo</span>
                    <span className="text-aura-rose">4 clínicas credenciadas</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl shadow-2xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-aura-charcoal">Sublime Estética</p>
                      <p className="text-[10px] text-aura-taupe">A 450m • Disponibilidade Hoje</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Aberto
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-aura-linen/80 mt-6">
                <button
                  onClick={() => openAuth('CLIENT')}
                  className="w-full py-3 bg-aura-linen rounded-full text-[10px] font-bold uppercase tracking-widest text-aura-charcoal hover:bg-aura-charcoal hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Abrir Mapa Aura <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>

            {/* PILAR 3: AURA CLUB */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-aura-charcoal text-white rounded-[44px] p-8 shadow-xl flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Luz Rose de Fundo */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-aura-rose/20 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-aura-rose group-hover:scale-110 transition-transform">
                  <Crown size={24} />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-aura-rose uppercase tracking-widest">
                    Clube de Recompensas
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    Recompensa por se Cuidar
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                    Seu autocuidado gera benefícios exclusivos, cashback em Aura Miles e mimos gratuitos nas melhores clínicas parceiras.
                  </p>
                </div>

                {/* Selo Brilhando / Cartão de Fidelidade */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-aura-rose font-bold uppercase text-[10px] tracking-wider">Membro Diamante</span>
                    <span className="font-serif font-bold text-white">1.840 Miles</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-aura-rose rounded-full w-[85%]" />
                  </div>
                  <p className="text-[10px] text-white/60">
                    Faltam 160 Miles para resgatar uma Limpeza Facial cortesia.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 relative z-10">
                <button
                  onClick={() => openAuth('CLIENT')}
                  className="w-full py-3 bg-aura-rose text-aura-charcoal rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-soft-glow flex items-center justify-center gap-2 cursor-pointer font-sans"
                >
                  Entrar no Aura Club <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: TABELA DE PLANOS (INVESTIMENTO ESTRUTURADO) */}
      <PricingTable onSelectPlan={() => openAuth('BUSINESS')} />

      {/* SEÇÃO 4: O TEAR DA PRECISÃO (#tecnologia) */}
      <section id="tecnologia" className="py-24 px-6 border-t border-aura-linen/60 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aura-rose/20 text-aura-charcoal text-[10px] font-bold uppercase tracking-widest">
            <Zap size={13} className="text-aura-charcoal" />
            Mono-line Fluidity & Interatividade
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-aura-charcoal">
            O tear da precisão estética.
          </h2>
          <p className="text-aura-taupe max-w-xl text-sm leading-relaxed">
            Cada traço e micro-interação foi desenhado para transmitir tranquilidade, luxo e clareza cirúrgica em cada procedimento.
          </p>

          <div className="py-8">
            <AuraLoaderV3 message="Lapidando sua melhor versão" />
          </div>
        </div>
      </section>

      {/* FOOTER DE CONFIANÇA */}
      <footer className="py-12 border-t border-aura-linen bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
            <ShieldCheck size={16} /> Tecnologia auditada por especialistas
          </div>
          <div className="flex items-center gap-2">
            <AuraLogoV3 size="xs" variant="app" subtitle="" />
          </div>
          <p className="text-[10px] text-aura-taupe font-medium uppercase tracking-[0.3em]">
            © 2024 Aura Universe • Privacy & Terms
          </p>
        </div>
      </footer>

      {/* MODAL SSO DE ACESSO UNIFICADO */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md my-8"
            >
              <AuthPortal
                defaultRole={authRoleTarget}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => setIsAuthModalOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuraLandingPage;

