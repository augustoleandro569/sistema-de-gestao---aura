// src/pages/public/AuraHome.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  Store,
  Check,
  ShieldCheck,
  Star,
  Navigation,
  Calendar,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  Clock,
  Heart,
  Palette,
  Layers,
  BarChart3,
  Smartphone,
  CheckCircle2,
  X,
  MessageCircle,
  Flame,
  Zap,
  Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthPortal } from '../auth/AuthPortal';
import { AuraBrand } from '../../components/ui/AuraBrand';
import { AuraLogoV3 } from '../../components/ui/AuraLogoV3';

export const LogoAura: React.FC<{ className?: string }> = ({ className = 'w-auto' }) => (
  <AuraLogoV3 size="md" variant="app" className={className} />
);

export const AuraHome: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userProfile } = useAuth();

  // Controle do Portal de Acesso Unificado (Modal SSO)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRoleTarget, setAuthRoleTarget] = useState<'CLIENT' | 'BUSINESS'>('CLIENT');
  const [authInitialView, setAuthInitialView] = useState<'login' | 'signup'>('login');

  // Controle de White-label Preview na seção Business
  const [whitelabelPreview, setWhitelabelPreview] = useState<'sublime' | 'aura'>('sublime');

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      if (userProfile.role === 'CLIENT') {
        navigate('/app/explorar');
      } else if (userProfile.role === 'PLATFORM_ADMIN') {
        navigate('/superadmin');
      } else {
        navigate('/business/dashboard');
      }
    }
  }, [isAuthenticated, userProfile, navigate]);

  // Abre modal com papel pré-configurado ou navega para o onboarding de parceiro
  const openAuthPortal = (role: 'CLIENT' | 'BUSINESS', view: 'login' | 'signup' = 'login') => {
    if (role === 'BUSINESS' && view === 'signup') {
      navigate('/seja-um-parceiro');
      return;
    }
    setAuthRoleTarget(role);
    setAuthInitialView(view);
    setIsAuthModalOpen(true);
  };

  // Scroll suave para seções de âncora
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mock de Resultados Reais para o Feed de Inspiração
  const inspirationPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1512290900672-1f55b9e59d95?auto=format&fit=crop&w=800&q=80',
      title: 'Laser Lavieen & Glow Revitalizante',
      clinic: 'Sublime Estética Jardins',
      tag: 'Pele de Porcelana',
      likes: '248',
      price: 'R$ 480',
      rating: '4.9 ★'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      title: 'Lifting Facial Não Invasivo com Ultraformer',
      clinic: 'Clínica Lumina Moema',
      tag: 'Contorno Definido',
      likes: '382',
      price: 'R$ 1.200',
      rating: '5.0 ★'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      title: 'Limpeza de Pele Profunda + Hidratação Ouro',
      clinic: 'Atelier da Pele Itaim',
      tag: 'Detox Cutâneo',
      likes: '194',
      price: 'R$ 290',
      rating: '4.9 ★'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      title: 'Protocolo Glow Noivas & Eventos Especiais',
      clinic: 'Vanguard Dermatologia',
      tag: 'Iluminação Natural',
      likes: '412',
      price: 'R$ 650',
      rating: '4.8 ★'
    }
  ];

  return (
    <div className="min-h-screen bg-aura-pearl text-aura-charcoal overflow-x-hidden selection:bg-aura-rose selection:text-aura-charcoal font-sans">
      {/* 1. NAVBAR TRANSPARENTE PREMIUM */}
      <nav className="flex justify-between items-center px-6 sm:px-12 py-5 sm:py-6 sticky top-0 z-40 bg-aura-pearl/85 backdrop-blur-md border-b border-aura-border/60 transition-all">
        <a href="#" className="cursor-pointer">
          <LogoAura className="text-aura-charcoal" />
        </a>

        <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-aura-taupe">
          <button
            onClick={() => scrollToSection('consumidor')}
            className="hover:text-aura-charcoal transition-colors cursor-pointer"
          >
            Para Você
          </button>
          <button
            onClick={() => scrollToSection('parceiro')}
            className="hover:text-aura-charcoal transition-colors cursor-pointer"
          >
            Para sua Clínica
          </button>
          <button
            onClick={() => scrollToSection('inspiracao')}
            className="hover:text-aura-charcoal transition-colors cursor-pointer"
          >
            Inspiração
          </button>
          <button
            onClick={() => scrollToSection('planos')}
            className="hover:text-aura-charcoal transition-colors cursor-pointer"
          >
            Planos &amp; Preços
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/seja-um-parceiro')}
            className="hidden sm:inline-flex items-center gap-1.5 border border-aura-linen hover:border-aura-charcoal text-aura-charcoal px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
          >
            <Store size={14} />
            <span>Seja Parceiro</span>
          </button>
          <button
            onClick={() => openAuthPortal('CLIENT', 'login')}
            className="bg-aura-charcoal text-white px-6 sm:px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-soft-glow hover:bg-black hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            ACESSAR CONTA
          </button>
        </div>
      </nav>

      {/* 2. DUAL HERO SECTION (THE CONVERSION HEADLINE) */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-aura-pearl overflow-hidden">
        {/* Imagem de Fundo de Alta Resolução com Textura Minimalista e Baixa Opacidade */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=2000&q=80"
            alt="Ambiente de Clínica Minimalista Aura"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-aura-pearl/30 via-aura-pearl/80 to-aura-pearl" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-aura-rose/25 rounded-full blur-[120px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center space-y-8 py-16 sm:py-24">
          {/* Selo Central de Qualidade da Plataforma (Aura Mono-line Fluidity XL) */}
          <div className="flex justify-center items-center py-2">
            <AuraLogoV3 size="xl" variant="app" />
          </div>

          {/* Badge Superior */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/90 backdrop-blur-md rounded-full border border-aura-rose/40 shadow-xs animate-bounce">
            <Sparkles size={14} className="text-aura-rose" />
            <span className="text-[10px] font-bold text-aura-rose uppercase tracking-[0.2em]">
              O 1º Marketplace de Estética de Luxo
            </span>
          </div>

          {/* Headline com Tipografia Serifada de Alto Impacto */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif text-aura-charcoal leading-[1.08] font-normal tracking-tight">
            Beleza para quem busca, <br />
            <span className="italic text-aura-taupe font-serif">Sucesso para quem faz.</span>
          </h1>

          <p className="text-base sm:text-xl text-aura-taupe leading-relaxed max-w-2xl mx-auto font-sans">
            Conectamos os melhores estabelecimentos e especialistas em estética aos clientes que priorizam excelência, segurança técnica e resultados visíveis.
          </p>

          {/* Botões Duplos com Estilo iFood / Cartões Ergonômicos */}
          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-6 pt-4 max-w-2xl mx-auto">
            {/* Botão Consumidor */}
            <button
              onClick={() => openAuthPortal('CLIENT', 'login')}
              className="group flex-1 bg-aura-charcoal text-white px-8 sm:px-10 py-5 sm:py-6 rounded-[24px] flex items-center justify-between gap-5 hover:scale-105 transition-all duration-300 shadow-2xl hover:bg-black cursor-pointer text-left"
            >
              <div>
                <p className="text-[10px] font-bold text-aura-rose uppercase tracking-widest">
                  Quero me cuidar
                </p>
                <p className="text-lg sm:text-xl font-serif font-bold">
                  Baixar Aura App
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-aura-rose/20 transition-colors shrink-0">
                <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform text-aura-rose" />
              </div>
            </button>

            {/* Botão Parceiro */}
            <button
              onClick={() => openAuthPortal('BUSINESS', 'signup')}
              className="group flex-1 bg-white border-2 border-aura-linen text-aura-charcoal px-8 sm:px-10 py-5 sm:py-6 rounded-[24px] flex items-center justify-between gap-5 hover:scale-105 transition-all duration-300 shadow-xl hover:border-aura-taupe/40 cursor-pointer text-left"
            >
              <div>
                <p className="text-[10px] font-bold text-aura-taupe uppercase tracking-widest">
                  Quero vender
                </p>
                <p className="text-lg sm:text-xl font-serif font-bold">
                  Seja um Parceiro
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-aura-linen flex items-center justify-center group-hover:rotate-12 transition-transform shrink-0">
                <Store size={22} className="text-aura-charcoal" />
              </div>
            </button>
          </div>

          {/* Selos de Confiança */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-aura-taupe">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-700" />
              <span className="font-medium">100% em Conformidade LGPD &amp; ANVISA</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-aura-gold fill-aura-gold" />
              <span className="font-medium">4.9 / 5.0 Avaliação de Excelência</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={16} className="text-aura-taupe" />
              <span className="font-medium">Curadoria Estrita de Especialistas</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VANTAGENS AURA BUSINESS (PARA O EMPREENDEDOR) - ATIVOS DE LUCRATIVIDADE */}
      <section id="parceiro" className="bg-white py-24 sm:py-32 border-t border-aura-linen">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[11px] font-bold text-aura-taupe uppercase tracking-[0.4em]">
              AURA BUSINESS PARA CLÍNICAS
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-aura-charcoal font-normal leading-tight">
              Ativos de Lucratividade para seu Negócio.
            </h2>
            <p className="text-base sm:text-lg text-aura-taupe font-sans leading-relaxed">
              Substitua planilhas amadoras e sistemas obsoletos por uma infraestrutura integrada de crescimento, gestão financeira e novos clientes.
            </p>
          </div>

          {/* GRID COM AS 4 VANTAGENS ESTRATÉGICAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            {/* 1. Marketplace Ativo */}
            <div className="bg-aura-pearl p-8 sm:p-10 rounded-[36px] border border-aura-linen space-y-6 flex flex-col justify-between group hover:shadow-xl transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                    Atração 24/7
                  </span>
                  <Store size={26} className="text-aura-charcoal" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-aura-charcoal">
                  Marketplace Ativo &amp; Vitrine Aberta
                </h3>
                <p className="text-sm text-aura-taupe leading-relaxed">
                  Sua clínica aberta 24h para milhares de novos clientes na sua região que procuram procedimentos específicos com agendamento instantâneo.
                </p>
              </div>

              {/* Mockup Visual do Card do Feed com a Clínica em Destaque */}
              <div className="bg-white p-4 rounded-3xl border border-aura-linen shadow-sm space-y-3">
                <div className="relative h-44 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
                    alt="Clínica em Destaque no App"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-aura-charcoal flex items-center gap-1.5 shadow-xs">
                    <Sparkles size={11} className="text-aura-rose" />
                    <span>Clínica Verificada</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-bold">
                    4.9 ★ (340 avaliações)
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <h4 className="text-sm font-bold text-aura-charcoal">Sublime Estética Jardins</h4>
                    <p className="text-xs text-aura-taupe">Oscar Freire, 1420 • São Paulo</p>
                  </div>
                  <span className="text-[11px] font-bold bg-aura-linen text-aura-charcoal px-3 py-1 rounded-xl">
                    +64 novos agendamentos/mês
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Gestão Inteligente & DRE em Tempo Real */}
            <div className="bg-aura-pearl p-8 sm:p-10 rounded-[36px] border border-aura-linen space-y-6 flex flex-col justify-between group hover:shadow-xl transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-aura-charcoal text-white px-3 py-1 rounded-full">
                    Financeiro Científico
                  </span>
                  <BarChart3 size={26} className="text-aura-charcoal" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-aura-charcoal">
                  Gestão Inteligente &amp; DRE em Tempo Real
                </h3>
                <p className="text-sm text-aura-taupe leading-relaxed">
                  Controle total de lucros, custos diretos de insumos fracionados e cálculo automatizado de comissões por procedimento sem planilhas.
                </p>
              </div>

              {/* Mockup do Dashboard DRE */}
              <div className="bg-white p-5 rounded-3xl border border-aura-linen shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-aura-linen">
                  <span className="text-xs font-bold text-aura-taupe uppercase tracking-wider">
                    DRE Executivo • Setembro
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                    +24.8% Margem Líquida
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-aura-linen/50 p-2.5 rounded-xl">
                    <p className="text-[10px] text-aura-taupe font-semibold uppercase">Faturamento</p>
                    <p className="text-sm font-bold text-aura-charcoal mt-0.5">R$ 142.500</p>
                  </div>
                  <div className="bg-aura-linen/50 p-2.5 rounded-xl">
                    <p className="text-[10px] text-aura-taupe font-semibold uppercase">Insumos (CPV)</p>
                    <p className="text-sm font-bold text-rose-700 mt-0.5">R$ 18.200</p>
                  </div>
                  <div className="bg-aura-rose/20 p-2.5 rounded-xl border border-aura-rose/40">
                    <p className="text-[10px] text-aura-taupe font-semibold uppercase">Lucro Líquido</p>
                    <p className="text-sm font-bold text-aura-charcoal mt-0.5">R$ 58.400</p>
                  </div>
                </div>
                <div className="w-full bg-aura-linen rounded-full h-2 overflow-hidden flex">
                  <div className="bg-emerald-600 h-full w-[41%]" title="Margem Líquida" />
                  <div className="bg-amber-400 h-full w-[35%]" title="Custos Fixos & Comissões" />
                  <div className="bg-rose-400 h-full w-[24%]" title="Insumos" />
                </div>
              </div>
            </div>

            {/* 3. White-label (Marca Própria) */}
            <div className="bg-aura-pearl p-8 sm:p-10 rounded-[36px] border border-aura-linen space-y-6 flex flex-col justify-between group hover:shadow-xl transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-aura-rose/40 text-aura-charcoal px-3 py-1 rounded-full">
                    Sua Própria Marca
                  </span>
                  <Palette size={26} className="text-aura-charcoal" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-aura-charcoal">
                  Personalização White-label
                </h3>
                <p className="text-sm text-aura-taupe leading-relaxed">
                  Tenha um sistema e um portal de agendamentos com a sua identidade. Cores, logo oficial, domínio customizado e estilo exclusivo para encantar seus clientes.
                </p>
              </div>

              {/* Split-screen Interativo mostrando troca de estilo */}
              <div className="bg-white p-4 rounded-3xl border border-aura-linen shadow-sm space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold pb-1">
                  <span className="text-aura-taupe">Prévia da Vitrine:</span>
                  <div className="flex gap-1.5 bg-aura-linen p-1 rounded-xl">
                    <button
                      onClick={() => setWhitelabelPreview('sublime')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                        whitelabelPreview === 'sublime'
                          ? 'bg-aura-charcoal text-white shadow-xs'
                          : 'text-aura-taupe hover:text-aura-charcoal'
                      }`}
                    >
                      Estilo Exclusivo
                    </button>
                    <button
                      onClick={() => setWhitelabelPreview('aura')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                        whitelabelPreview === 'aura'
                          ? 'bg-aura-charcoal text-white shadow-xs'
                          : 'text-aura-taupe hover:text-aura-charcoal'
                      }`}
                    >
                      Padrão Aura
                    </button>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    whitelabelPreview === 'sublime'
                      ? 'bg-[#2D2725] text-white border-aura-rose/30'
                      : 'bg-white text-aura-charcoal border-aura-linen'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-serif font-bold text-sm ${
                          whitelabelPreview === 'sublime'
                            ? 'bg-aura-rose text-aura-charcoal'
                            : 'bg-aura-linen text-aura-charcoal'
                        }`}
                      >
                        S
                      </div>
                      <div>
                        <p className="text-xs font-bold">Sublime Experience</p>
                        <p className={`text-[10px] ${whitelabelPreview === 'sublime' ? 'text-aura-linen/70' : 'text-aura-taupe'}`}>
                          portal.sublimeestetica.com.br
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        whitelabelPreview === 'sublime'
                          ? 'bg-white/10 text-aura-rose'
                          : 'bg-aura-linen text-aura-charcoal'
                      }`}
                    >
                      White-label Ativo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Retenção 10+1 (Aura Club) */}
            <div className="bg-aura-pearl p-8 sm:p-10 rounded-[36px] border border-aura-linen space-y-6 flex flex-col justify-between group hover:shadow-xl transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                    Recorrência Automática
                  </span>
                  <Award size={26} className="text-aura-charcoal" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-aura-charcoal">
                  Fidelização Digital 10+1
                </h3>
                <p className="text-sm text-aura-taupe leading-relaxed">
                  Fidelize clientes no automático com o cartão de selos inteligente. Cada atendimento acumula pontuação auditável e incentiva o retorno constante.
                </p>
              </div>

              {/* Visual do Cartão de Selos com Brilho Tátil */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-aura-linen shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-aura-rose" />
                    <span className="text-xs font-bold text-aura-charcoal">Cartão Fidelidade da Clínica</span>
                  </div>
                  <span className="text-[10px] font-bold bg-aura-rose/20 text-aura-charcoal px-2.5 py-0.5 rounded-full border border-aura-rose/40">
                    9 de 10 Selos
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 pt-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <div
                      key={num}
                      className={`h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        num <= 9
                          ? 'bg-aura-charcoal text-white shadow-soft-glow'
                          : 'bg-aura-linen/80 text-aura-taupe border border-dashed border-aura-taupe/40 animate-pulse'
                      }`}
                    >
                      {num <= 9 ? '✦' : '10'}
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-aura-taupe text-center pt-1 font-medium">
                  Próximo atendimento libera 1 Revitalização Facial Cortesia.
                </p>
              </div>
            </div>
          </div>

          {/* CTA para Cadastro de Clínica */}
          <div className="text-center pt-4">
            <button
              onClick={() => openAuthPortal('BUSINESS', 'signup')}
              className="bg-aura-charcoal hover:bg-black text-white px-12 py-6 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              CADASTRAR MINHA CLÍNICA NO AURA BUSINESS
            </button>
          </div>
        </div>
      </section>

      {/* 4. VANTAGENS AURA APP (PARA O CONSUMIDOR) */}
      <section id="consumidor" className="py-24 sm:py-32 bg-aura-pearl border-t border-aura-linen">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Asset Visual: Mockup de Mapa do Aura com Pinos e Geolocalização */}
          <div className="relative group">
            <div className="absolute inset-0 bg-aura-rose/20 rounded-[60px] -rotate-3 group-hover:rotate-0 transition-transform duration-700 blur-xl -z-10" />

            <div className="bg-white p-5 sm:p-6 rounded-[44px] shadow-2xl border border-aura-linen space-y-4">
              {/* Barra do Mapa do Aura */}
              <div className="flex items-center justify-between pb-3 border-b border-aura-linen">
                <div className="flex items-center gap-2">
                  <Navigation size={18} className="text-aura-rose" />
                  <span className="text-xs font-bold text-aura-charcoal">Jardins &amp; Região, São Paulo</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  GPS Ativo
                </span>
              </div>

              {/* Visual do Mapa com Traçados & Pinos */}
              <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden bg-[#F4F4F2] border border-aura-linen">
                {/* Linhas cartográficas estilizadas */}
                <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                  <path d="M-20,50 Q100,120 250,80 T500,150" stroke="#8C827A" strokeWidth="3" fill="none" />
                  <path d="M50,-20 Q120,180 80,350" stroke="#8C827A" strokeWidth="2.5" fill="none" />
                  <path d="M200,0 L220,400" stroke="#8C827A" strokeWidth="2" fill="none" />
                  <circle cx="180" cy="140" r="40" fill="#EAD7D1" fillOpacity="0.4" />
                </svg>

                {/* Pino Central da Clínica */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="bg-aura-charcoal text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-lg flex items-center gap-1.5 mb-1 animate-bounce">
                    <Sparkles size={12} className="text-aura-rose" />
                    <span>Sublime Estética • 4.9 ★</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-aura-rose border-3 border-white shadow-md flex items-center justify-center text-[10px] text-white">
                    📍
                  </div>
                </div>

                {/* Card Contextual de Agendamento Rápido */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-aura-linen flex items-center justify-between shadow-md">
                  <div>
                    <p className="text-xs font-bold text-aura-charcoal">Drenagem &amp; Lavieen Express</p>
                    <p className="text-[10px] text-aura-taupe">Próximo horário disponível hoje às 15:30</p>
                  </div>
                  <button
                    onClick={() => openAuthPortal('CLIENT', 'login')}
                    className="bg-aura-charcoal text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl cursor-pointer"
                  >
                    Agendar
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-aura-taupe px-1">
                <span>Mais de 35 clínicas parceiras credenciadas</span>
                <span className="font-semibold text-aura-charcoal">Filtro por raio até 5km</span>
              </div>
            </div>
          </div>

          {/* Descrição das Vantagens Consumidor */}
          <div className="space-y-8 text-left">
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-aura-taupe">
                AURA APP PARA VOCÊ
              </span>
              <h3 className="text-3xl sm:text-5xl font-serif text-aura-charcoal font-normal leading-tight">
                Encontre a excelência <br />
                <span className="italic text-aura-taupe font-serif">a poucos passos.</span>
              </h3>
              <p className="text-aura-taupe text-base sm:text-lg leading-relaxed font-sans">
                Use nosso mapa inteligente para descobrir as clínicas mais bem avaliadas perto de você. Filtre por procedimento, valor ou disponibilidade imediata sem precisar telefonar.
              </p>
            </div>

            {/* Grid 2x2 com Ícones Minimalistas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2.5 bg-white p-5 rounded-2xl border border-aura-linen">
                <div className="w-12 h-12 bg-aura-linen rounded-2xl flex items-center justify-center text-aura-charcoal">
                  <Navigation size={22} />
                </div>
                <p className="font-bold text-sm text-aura-charcoal">Geolocalização Precisa</p>
                <p className="text-xs text-aura-taupe leading-relaxed">
                  Clínicas reais em tempo real com distância exata e rotas guiadas.
                </p>
              </div>

              <div className="space-y-2.5 bg-white p-5 rounded-2xl border border-aura-linen">
                <div className="w-12 h-12 bg-aura-linen rounded-2xl flex items-center justify-center text-aura-charcoal">
                  <Star size={22} />
                </div>
                <p className="font-bold text-sm text-aura-charcoal">Avaliações Reais</p>
                <p className="text-xs text-aura-taupe leading-relaxed">
                  Comunidade com notas verificadas baseadas em resultados comprovados.
                </p>
              </div>

              <div className="space-y-2.5 bg-white p-5 rounded-2xl border border-aura-linen">
                <div className="w-12 h-12 bg-aura-linen rounded-2xl flex items-center justify-center text-aura-charcoal">
                  <Calendar size={22} />
                </div>
                <p className="font-bold text-sm text-aura-charcoal">Agendamento 24h</p>
                <p className="text-xs text-aura-taupe leading-relaxed">
                  Confirmação instantânea sem filas de atendimento no WhatsApp.
                </p>
              </div>

              <div className="space-y-2.5 bg-white p-5 rounded-2xl border border-aura-linen">
                <div className="w-12 h-12 bg-aura-linen rounded-2xl flex items-center justify-center text-aura-charcoal">
                  <ShieldCheck size={22} />
                </div>
                <p className="font-bold text-sm text-aura-charcoal">Histórico Protegido</p>
                <p className="text-xs text-aura-taupe leading-relaxed">
                  Anotações de cuidados e procedimentos salvas com proteção LGPD.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => openAuthPortal('CLIENT', 'login')}
                className="bg-aura-charcoal hover:bg-black text-white px-10 py-5 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-102 active:scale-98 transition-all cursor-pointer"
              >
                COMEÇAR A EXPLORAR AGORA
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. O "FEED DE INSPIRAÇÃO" (SOCIAL COMMERCE & RESULTADOS REAIS) */}
      <section id="inspiracao" className="bg-white py-24 sm:py-32 border-t border-aura-linen">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[11px] font-bold text-aura-taupe uppercase tracking-[0.4em]">
              SOCIAL COMMERCE DE ESTÉTICA
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-aura-charcoal font-normal leading-tight">
              O Feed de Inspiração dos Melhores Especialistas.
            </h2>
            <p className="text-base sm:text-lg text-aura-taupe font-sans leading-relaxed">
              Não apenas agende. Inspire-se com os portfólios mais desejados da sua cidade e reserve o procedimento exato com um clique.
            </p>
          </div>

          {/* Grid de Cards Visuais de Alta Resolução */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {inspirationPosts.map((post) => (
              <div
                key={post.id}
                className="bg-aura-pearl rounded-[32px] overflow-hidden border border-aura-linen shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-aura-charcoal flex items-center gap-1 shadow-xs">
                    <Tag size={10} className="text-aura-rose" />
                    <span>{post.tag}</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold flex items-center gap-1">
                    <Heart size={11} className="text-rose-400 fill-rose-400" />
                    <span>{post.likes}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[10px] uppercase font-bold text-white/80">{post.clinic}</p>
                    <h4 className="text-sm font-serif font-bold leading-snug">{post.title}</h4>
                  </div>
                </div>

                <div className="p-4 bg-white flex items-center justify-between border-t border-aura-linen">
                  <div>
                    <span className="text-[10px] text-aura-taupe font-bold block uppercase">Investimento</span>
                    <span className="text-sm font-bold text-aura-charcoal">{post.price}</span>
                  </div>
                  <button
                    onClick={() => openAuthPortal('CLIENT', 'login')}
                    className="bg-aura-charcoal hover:bg-black text-white px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Agendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TABELA COMPARATIVA DE PLANOS (PARA PARCEIROS & CLÍNICAS) */}
      <section id="planos" className="bg-aura-pearl py-24 sm:py-32 border-t border-aura-linen">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[11px] font-bold text-aura-taupe uppercase tracking-[0.4em]">
              TRANSPARÊNCIA TOTAL
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-aura-charcoal font-normal leading-tight">
              Planos Desenhados para sua Escala.
            </h2>
            <p className="text-base sm:text-lg text-aura-taupe font-sans leading-relaxed">
              Comece com o Essencial ou eleve sua clínica ao nível de autoridade com a suíte White-label e Automação.
            </p>
          </div>

          {/* Cards Comparativos dos 3 Planos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* 1. Essencial */}
            <div className="bg-white p-8 sm:p-10 rounded-[36px] border border-aura-linen shadow-sm flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-aura-linen text-aura-charcoal">
                  Autônomos &amp; Início
                </div>
                <h3 className="text-2xl font-serif font-bold text-aura-charcoal">Essencial</h3>
                <p className="text-xs text-aura-taupe leading-relaxed">
                  Para consultórios e profissionais que buscam agenda sem complicação e presença no marketplace.
                </p>
                <div className="pt-2">
                  <span className="text-3xl font-serif font-bold text-aura-charcoal">R$ 149</span>
                  <span className="text-xs text-aura-taupe"> /mês</span>
                </div>
              </div>

              <div className="space-y-4 border-t border-aura-linen pt-6">
                <p className="text-[11px] font-bold text-aura-charcoal uppercase tracking-wider">Recursos Inclusos:</p>
                <ul className="space-y-3 text-xs text-aura-taupe">
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-emerald-700 shrink-0" />
                    <span>Agenda Digital &amp; Gestão de Clientes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-emerald-700 shrink-0" />
                    <span>Visibilidade Marketplace Básica</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-40">
                    <X size={16} className="text-gray-400 shrink-0" />
                    <span className="line-through">DRE Financeiro em Tempo Real</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-40">
                    <X size={16} className="text-gray-400 shrink-0" />
                    <span className="line-through">Estoque &amp; Custos por Procedimento</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-40">
                    <X size={16} className="text-gray-400 shrink-0" />
                    <span className="line-through">White-label &amp; Marca Própria</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openAuthPortal('BUSINESS', 'signup')}
                className="w-full py-4 rounded-full bg-aura-linen hover:bg-aura-charcoal hover:text-white text-aura-charcoal text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                COMEÇAR ESSENCIAL
              </button>
            </div>

            {/* 2. Pro (Gestão Completa) - DESTAQUE */}
            <div className="bg-white p-8 sm:p-10 rounded-[36px] border-2 border-aura-charcoal shadow-2xl flex flex-col justify-between space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-aura-charcoal text-white text-[9px] font-bold uppercase tracking-widest py-1.5 px-6 rounded-bl-2xl">
                Mais Escolhido
              </div>

              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-aura-rose/30 text-aura-charcoal">
                  Médias Clínicas
                </div>
                <h3 className="text-2xl font-serif font-bold text-aura-charcoal">Pro (Gestão)</h3>
                <p className="text-xs text-aura-taupe leading-relaxed">
                  O motor definitivo para gerenciar equipe, estoque científico e aumentar a margem líquida.
                </p>
                <div className="pt-2">
                  <span className="text-3xl font-serif font-bold text-aura-charcoal">R$ 299</span>
                  <span className="text-xs text-aura-taupe"> /mês</span>
                </div>
              </div>

              <div className="space-y-4 border-t border-aura-linen pt-6">
                <p className="text-[11px] font-bold text-aura-charcoal uppercase tracking-wider">Tudo do Essencial, mais:</p>
                <ul className="space-y-3 text-xs text-aura-charcoal">
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-emerald-700 shrink-0" />
                    <span className="font-medium">Marketplace com Destaque na Região</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-emerald-700 shrink-0" />
                    <span className="font-medium">DRE Financeiro Completo em Tempo Real</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-emerald-700 shrink-0" />
                    <span className="font-medium">Controle de Estoque &amp; Custo por Insumo</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-emerald-700 shrink-0" />
                    <span className="font-medium">Comissionamento Automático de Especialistas</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-40">
                    <X size={16} className="text-gray-400 shrink-0" />
                    <span className="line-through">White-label e Domínio Customizado</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openAuthPortal('BUSINESS', 'signup')}
                className="w-full py-4 rounded-full bg-aura-charcoal hover:bg-black text-white text-xs font-bold uppercase tracking-widest shadow-lg hover:scale-102 transition-all cursor-pointer"
              >
                ASSINAR PLANO PRO
              </button>
            </div>

            {/* 3. Aura Elite */}
            <div className="bg-white p-8 sm:p-10 rounded-[36px] border border-aura-linen shadow-sm flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-aura-charcoal text-white">
                  Clínicas de Luxo &amp; Franquias
                </div>
                <h3 className="text-2xl font-serif font-bold text-aura-charcoal">Aura Elite</h3>
                <p className="text-xs text-aura-taupe leading-relaxed">
                  Experiência White-label completa com automação de WhatsApp e suporte concierge prioritário.
                </p>
                <div className="pt-2">
                  <span className="text-3xl font-serif font-bold text-aura-charcoal">R$ 599</span>
                  <span className="text-xs text-aura-taupe"> /mês</span>
                </div>
              </div>

              <div className="space-y-4 border-t border-aura-linen pt-6">
                <p className="text-[11px] font-bold text-aura-charcoal uppercase tracking-wider">A Suíte Máxima de Recursos:</p>
                <ul className="space-y-3 text-xs text-aura-charcoal">
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-emerald-700 shrink-0" />
                    <span className="font-medium">Visibilidade Top Marketplace Premium</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-emerald-700 shrink-0" />
                    <span className="font-medium">White-label Completo (Cores, Logo e Domínio)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-emerald-700 shrink-0" />
                    <span className="font-medium">Automação de Lembretes via WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-emerald-700 shrink-0" />
                    <span className="font-medium">Gestão Multi-Unidades &amp; Filiais</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-emerald-700 shrink-0" />
                    <span className="font-medium">Concierge VIP &amp; Suporte Dedicado</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openAuthPortal('BUSINESS', 'signup')}
                className="w-full py-4 rounded-full bg-aura-linen hover:bg-aura-charcoal hover:text-white text-aura-charcoal text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                FALAR COM ESPECIALISTA ELITE
              </button>
            </div>
          </div>

          {/* Tabela de Comparação Direta dos Recursos Solicitados */}
          <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-aura-linen shadow-sm overflow-x-auto">
            <h4 className="text-lg font-serif font-bold text-aura-charcoal mb-6">
              Matriz Comparativa de Recursos
            </h4>
            <table className="w-full text-left text-xs text-aura-charcoal">
              <thead>
                <tr className="border-b border-aura-linen text-aura-taupe uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Funcionalidade</th>
                  <th className="py-3 px-4 text-center">Essencial</th>
                  <th className="py-3 px-4 text-center font-bold text-aura-charcoal">Pro (Gestão)</th>
                  <th className="py-3 px-4 text-center font-bold text-aura-charcoal">Aura Elite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aura-linen">
                <tr>
                  <td className="py-3.5 px-4 font-medium">Agenda &amp; Clientes</td>
                  <td className="py-3.5 px-4 text-center text-emerald-700">✅</td>
                  <td className="py-3.5 px-4 text-center text-emerald-700">✅</td>
                  <td className="py-3.5 px-4 text-center text-emerald-700">✅</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Visibilidade Marketplace</td>
                  <td className="py-3.5 px-4 text-center text-amber-700">⚠️ (Básico)</td>
                  <td className="py-3.5 px-4 text-center text-emerald-700">✅ (Destaque)</td>
                  <td className="py-3.5 px-4 text-center text-emerald-700">✅ (Premium)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Financeiro DRE</td>
                  <td className="py-3.5 px-4 text-center text-gray-400">❌</td>
                  <td className="py-3.5 px-4 text-center text-emerald-700">✅</td>
                  <td className="py-3.5 px-4 text-center text-emerald-700">✅</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Estoque &amp; Insumos</td>
                  <td className="py-3.5 px-4 text-center text-gray-400">❌</td>
                  <td className="py-3.5 px-4 text-center text-emerald-700">✅</td>
                  <td className="py-3.5 px-4 text-center text-emerald-700">✅</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Branding White-label</td>
                  <td className="py-3.5 px-4 text-center text-gray-400">❌</td>
                  <td className="py-3.5 px-4 text-center text-gray-400">❌</td>
                  <td className="py-3.5 px-4 text-center text-emerald-700">✅</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Automação WhatsApp</td>
                  <td className="py-3.5 px-4 text-center text-gray-400">❌</td>
                  <td className="py-3.5 px-4 text-center text-gray-400">❌</td>
                  <td className="py-3.5 px-4 text-center text-emerald-700">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. FOOTER DE LUXO */}
      <footer className="bg-aura-linen border-t border-aura-border py-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <LogoAura />
            <p className="text-xs text-aura-taupe mt-2 max-w-sm">
              A plataforma definitiva de conexão, luxo e gestão de alta precisão para a estética avançada.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-xs text-aura-taupe font-semibold">
            <button
              onClick={() => scrollToSection('consumidor')}
              className="hover:text-aura-charcoal cursor-pointer"
            >
              Para Você
            </button>
            <button
              onClick={() => scrollToSection('parceiro')}
              className="hover:text-aura-charcoal cursor-pointer"
            >
              Para Clínicas
            </button>
            <button
              onClick={() => scrollToSection('inspiracao')}
              className="hover:text-aura-charcoal cursor-pointer"
            >
              Inspiração
            </button>
            <button
              onClick={() => scrollToSection('planos')}
              className="hover:text-aura-charcoal cursor-pointer"
            >
              Planos
            </button>
            <button
              onClick={() => openAuthPortal('CLIENT', 'login')}
              className="hover:text-aura-charcoal cursor-pointer font-bold text-aura-charcoal"
            >
              Acessar Conta
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-aura-border/80 flex flex-col sm:flex-row justify-between items-center text-[11px] text-aura-taupe/70 gap-4">
          <p>© {new Date().getFullYear()} Aura Estética Digital S.A. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-700" />
            <span>Ambiente seguro certificado com conformidade técnica e criptografia</span>
          </p>
        </div>
      </footer>

      {/* 8. PORTAL DE ACESSO UNIFICADO (MODAL SINGLE SIGN-ON) */}
      {isAuthModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAuthModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-md animate-in zoom-in-95 duration-200">
            <AuthPortal
              initialView={authInitialView}
              defaultRole={authRoleTarget}
              onClose={() => setIsAuthModalOpen(false)}
              onSuccess={() => setIsAuthModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AuraHome;
