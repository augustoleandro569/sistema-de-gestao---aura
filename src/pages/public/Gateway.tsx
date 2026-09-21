// src/pages/public/Gateway.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { AuraLogoV3 } from '../../components/ui/AuraLogoV3';
import { AuthPortal } from '../auth/AuthPortal';
import { BusinessCockpit } from '../../components/marketing/CockpitPreview';
import {
  Search,
  Sparkles,
  MapPin,
  TrendingUp,
  Globe,
  Star,
  Heart,
  Users,
  CheckCircle,
  CalendarCheck,
  ChevronRight,
  ShieldCheck,
  Award,
  ArrowRight,
  Store,
  Compass,
  BadgePercent,
  SlidersHorizontal,
} from 'lucide-react';

interface ProtocolShowcase {
  id: string;
  title: string;
  category: string;
  rating: number;
  reviewsCount: number;
  image: string;
  price: string;
  availableIn: string;
  tag: string;
}

const FEATURED_PROTOCOLS: ProtocolShowcase[] = [
  {
    id: 'glow-skin',
    title: 'Limpeza de Pele Glow & Peeling Ultrassônico',
    category: 'Facial Avançado',
    rating: 4.96,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80',
    price: 'R$ 280,00',
    availableIn: '14 clínicas parceiras nos Jardins & Itaim',
    tag: 'Mais Desejado',
  },
  {
    id: 'harmonizacao-full',
    title: 'Harmonização Facial & Ácido Hialurônico',
    category: 'Injetáveis & Médicos',
    rating: 4.99,
    reviewsCount: 230,
    image: 'https://images.unsplash.com/photo-1512290900672-1f551b9ce637?auto=format&fit=crop&w=700&q=80',
    price: 'R$ 1.890,00',
    availableIn: 'Rede credenciada médica com CRM/CRBM',
    tag: 'Padrão Ouro',
  },
  {
    id: 'lavieen-laser',
    title: 'Laser Lavieen Efeito BB Glow Pele Perfeita',
    category: 'Tecnologia Laser',
    rating: 4.94,
    reviewsCount: 98,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
    price: 'R$ 690,00',
    availableIn: '8 clínicas com tecnologia auditada',
    tag: 'Tendência 2025',
  },
  {
    id: 'bioestimulador-colageno',
    title: 'Bioestimulador de Colágeno Sculptra',
    category: 'Rejuvenescimento',
    rating: 4.98,
    reviewsCount: 175,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=700&q=80',
    price: 'R$ 2.400,00',
    availableIn: 'Espaços com protocolos estéreis de alta precisão',
    tag: 'Exclusivo Aura',
  },
];

export const Gateway: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState<'CLIENT' | 'BUSINESS'>('CLIENT');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedFavorites, setSavedFavorites] = useState<string[]>(['glow-skin']);

  const handleOpenAuth = (role: 'CLIENT' | 'BUSINESS' = 'CLIENT') => {
    setAuthRole(role);
    setIsAuthModalOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleOpenAuth('CLIENT');
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-aura-pearl overflow-x-hidden font-sans selection:bg-aura-rose/25 selection:text-aura-charcoal">
      {/* 1. NAVBAR ESTILO IFOOD (CONVERSÃO) */}
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-xl border-b border-aura-linen px-6 sm:px-10 py-4 flex justify-between items-center transition-all">
        <AuraLogoV3
          size="sm"
          variant="app"
          subtitle="Universal Gateway"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />

        <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-aura-taupe">
          <a
            href="#experiencia"
            className="hover:text-aura-charcoal transition-colors py-1"
          >
            Experiência App
          </a>
          <a
            href="#vantagens"
            className="hover:text-aura-charcoal transition-colors py-1"
          >
            Vantagens &amp; Aura Club
          </a>
          <a
            href="#comunidade"
            className="hover:text-aura-charcoal transition-colors py-1"
          >
            Comunidade
          </a>
          <a
            href="#parceiro"
            className="text-aura-rose font-black hover:text-[#d99c92] transition-colors py-1"
          >
            Para sua Clínica
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/seja-um-parceiro')}
            className="bg-aura-rose text-aura-charcoal px-5 sm:px-7 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:shadow-soft-glow hover:scale-103 active:scale-98 transition-all cursor-pointer"
          >
            SEJA UM PARCEIRO
          </button>
          <button
            onClick={() => handleOpenAuth('BUSINESS')}
            className="hidden md:inline-block text-[11px] font-bold uppercase tracking-wider text-aura-taupe hover:text-aura-charcoal transition-colors px-2 py-1.5"
          >
            Sou Parceiro
          </button>
          <button
            onClick={() => handleOpenAuth('CLIENT')}
            className="bg-aura-charcoal hover:bg-black text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-soft-glow hover:scale-103 active:scale-98 transition-all cursor-pointer"
          >
            ACESSAR CONTA
          </button>
        </div>
      </nav>

      {/* 2. HERO: O UNIVERSO CONSUMIDOR (O QUE O AUGUSTUS ENCONTRA) */}
      <section className="pt-36 sm:pt-44 pb-20 px-6 sm:px-8 text-center max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full border border-aura-linen shadow-xs mx-auto">
            <Sparkles size={14} className="text-aura-rose" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aura-charcoal">
              O Ecossistema da Beleza &amp; Bem-Estar de Elite
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-aura-charcoal leading-[1.08] tracking-tight max-w-5xl mx-auto">
            Sua melhor versão <br />
            <span className="italic text-aura-rose font-normal">a um toque de distância.</span>
          </h1>

          <p className="text-aura-taupe text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Bem-vinda à Aura. O marketplace que une os procedimentos mais desejados do país a uma rede
            de clínicas de elite auditadas por critérios médicos.
          </p>

          {/* BUSCA DE PROCEDIMENTO (IFOOD STYLE) */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto bg-white rounded-[36px] sm:rounded-[40px] p-2.5 sm:p-3 shadow-luminous border border-aura-linen flex flex-col sm:flex-row items-center gap-3 transition-all hover:border-aura-rose/50"
          >
            <div className="flex-1 flex items-center px-4 sm:px-6 gap-3 sm:gap-4 w-full">
              <Search size={22} className="text-aura-taupe shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busque por procedimento: Botox, Lavieen, Cílios, Preenchimento..."
                className="bg-transparent border-none outline-hidden text-xs sm:text-base font-medium py-3 w-full text-aura-charcoal placeholder:text-aura-taupe/60"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-aura-charcoal hover:bg-black text-white px-9 sm:px-12 py-4 sm:py-5 rounded-[28px] sm:rounded-[32px] font-bold text-xs uppercase tracking-widest transition-all shadow-md shrink-0 cursor-pointer"
            >
              Encontrar Aura
            </button>
          </form>

          {/* CHIPS RÁPIDOS DE CATEGORIAS */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            {['Harmonização', 'Limpeza Glow', 'Laser Lavieen', 'Bioestimuladores', 'Massagem Slim', 'Criolipólise'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSearchQuery(cat);
                  handleOpenAuth('CLIENT');
                }}
                className="px-4 py-1.5 rounded-full bg-white hover:bg-aura-charcoal hover:text-white border border-aura-linen text-aura-charcoal text-[11px] font-semibold transition-all shadow-2xs cursor-pointer"
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 2. APRESENTAÇÃO DAS VANTAGENS (VISUAL & CONTEÚDO EM CARDS MACRO) */}
      <section id="vantagens" className="py-24 px-6 sm:px-12 bg-white border-y border-aura-linen">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-aura-rose uppercase tracking-[0.4em] bg-aura-pearl px-4 py-1.5 rounded-full border border-aura-rose/25">
              Por que escolher a Aura
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-aura-charcoal">
              A experiência completa de cuidado
            </h2>
            <p className="text-aura-taupe text-sm">
              Mais conveniência, segurança biomédica e benefícios exclusivos a cada visita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* VANTAGEM 1: DESCOBERTA REAL */}
            <div className="bg-aura-pearl/50 rounded-[32px] p-7 border border-aura-linen hover:border-aura-rose/40 transition-all flex flex-col justify-between group shadow-xs">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-xs flex items-center justify-center text-aura-rose">
                  <Sparkles size={28} />
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                    alt="Descoberta Real"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-[9px] font-bold">
                    Antes / Depois
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold text-aura-charcoal">Descoberta Real</h3>
                <p className="text-xs text-aura-taupe leading-relaxed">
                  Siga suas clínicas favoritas e veja resultados de antes e depois postados por especialistas com prontuário verificado.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-aura-linen/60 flex items-center gap-1.5 text-xs font-bold text-aura-charcoal group-hover:text-aura-rose transition-colors">
                <span>Feed social ativo</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* VANTAGEM 2: AURA CLUB (CARTÃO FIDELIDADE 10+1) */}
            <div className="bg-aura-charcoal text-white rounded-[32px] p-7 border border-white/10 hover:border-aura-rose/60 transition-all flex flex-col justify-between group shadow-xl">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 shadow-soft-glow flex items-center justify-center text-aura-rose">
                  <Award size={28} />
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <p className="text-[10px] font-bold text-aura-rose uppercase tracking-widest">
                    Aura Pass 10+1
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full bg-aura-rose/30 border border-aura-rose flex items-center justify-center text-[10px]"
                      >
                        ✨
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-300">Cada sessão rende 1 selo automático.</p>
                </div>
                <h3 className="text-xl font-serif font-bold text-white">Aura Club</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Seu cartão fidelidade digital 10+1. Cada atendimento é um selo rumo ao seu próximo procedimento cortesia.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-white/10 flex items-center gap-1.5 text-xs font-bold text-aura-rose">
                <span>Recompensas reais</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* VANTAGEM 3: MAPA INTELIGENTE */}
            <div className="bg-aura-pearl/50 rounded-[32px] p-7 border border-aura-linen hover:border-aura-rose/40 transition-all flex flex-col justify-between group shadow-xs">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-xs flex items-center justify-center text-aura-rose">
                  <MapPin size={28} />
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xs bg-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80"
                    alt="Mapa Minimalista"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-aura-charcoal/20" />
                  <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-aura-charcoal text-[9px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Jardins • 12 clínicas</span>
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold text-aura-charcoal">Mapa Inteligente</h3>
                <p className="text-xs text-aura-taupe leading-relaxed">
                  Localize as clínicas mais bem avaliadas e com horários disponíveis perto de você num clique.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-aura-linen/60 flex items-center gap-1.5 text-xs font-bold text-aura-charcoal group-hover:text-aura-rose transition-colors">
                <span>Ver mapa de proximidade</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* VANTAGEM 4: COMUNIDADE AURA */}
            <div className="bg-aura-pearl/50 rounded-[32px] p-7 border border-aura-linen hover:border-aura-rose/40 transition-all flex flex-col justify-between group shadow-xs">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-xs flex items-center justify-center text-aura-rose">
                  <Users size={28} />
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
                    alt="Pessoas Reais"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-2 bg-rose-500/90 text-white px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1">
                    <Heart size={10} className="fill-white" />
                    <span>99% Satisfação</span>
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold text-aura-charcoal">Comunidade Aura</h3>
                <p className="text-xs text-aura-taupe leading-relaxed">
                  Junte-se a milhares de usuários que compartilham suas jornadas de autocuidado e dicas dermatológicas.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-aura-linen/60 flex items-center gap-1.5 text-xs font-bold text-aura-charcoal group-hover:text-aura-rose transition-colors">
                <span>Conectar com a rede</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURADORIA DE PROCEDIMENTOS DESTAQUE */}
      <section id="experiencia" className="py-24 px-6 sm:px-12 bg-aura-pearl">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-aura-rose uppercase tracking-[0.4em]">
                O iFood da Estética de Elite
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-aura-charcoal">
                Procedimentos Mais Desejados
              </h2>
              <p className="text-xs sm:text-sm text-aura-taupe">
                Agende diretamente nas melhores clínicas com confirmação imediata.
              </p>
            </div>
            <button
              onClick={() => handleOpenAuth('CLIENT')}
              className="inline-flex items-center gap-2 text-xs font-bold text-aura-charcoal hover:text-aura-rose transition-colors uppercase tracking-wider group cursor-pointer"
            >
              <span>Explorar Marketplace Completo</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform text-aura-rose" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURED_PROTOCOLS.map((protocol) => {
              const isFav = savedFavorites.includes(protocol.id);
              return (
                <div
                  key={protocol.id}
                  onClick={() => handleOpenAuth('CLIENT')}
                  className="bg-white rounded-[32px] p-4 sm:p-5 border border-aura-linen hover:border-aura-rose/40 transition-all flex flex-col justify-between group shadow-xs cursor-pointer"
                >
                  <div>
                    <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden mb-4 bg-aura-pearl">
                      <img
                        src={protocol.image}
                        alt={protocol.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                      />
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(protocol.id, e)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-xs hover:scale-110 active:scale-95 transition-all cursor-pointer"
                      >
                        <Heart
                          size={14}
                          className={isFav ? 'text-rose-500 fill-rose-500' : 'text-aura-taupe'}
                        />
                      </button>
                      <div className="absolute bottom-3 left-3 bg-aura-charcoal/80 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        {protocol.tag}
                      </div>
                    </div>

                    <p className="text-[9px] font-bold text-aura-rose uppercase tracking-widest">
                      {protocol.category}
                    </p>
                    <h3 className="text-base font-serif font-bold text-aura-charcoal leading-snug line-clamp-2 mt-1">
                      {protocol.title}
                    </h3>
                    <p className="text-[10px] text-aura-taupe mt-1 line-clamp-1">
                      {protocol.availableIn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-aura-linen mt-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        <Star size={11} className="fill-amber-400" />
                        <span>{protocol.rating}</span>
                      </div>
                      <p className="text-sm font-bold font-serif text-aura-charcoal mt-0.5">
                        {protocol.price}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="bg-aura-charcoal group-hover:bg-aura-rose text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors"
                    >
                      Agendar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO: TORNE-SE UM PARCEIRO AURA (A PONTE PARA O AURA BUSINESS) */}
      <section id="parceiro" className="bg-aura-charcoal py-28 sm:py-32 rounded-t-[60px] sm:rounded-t-[80px] text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-8 sm:space-y-10">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-aura-rose uppercase tracking-[0.4em] bg-white/10 px-4 py-1.5 rounded-full border border-aura-rose/30">
                Aura Business Intelligence
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-tight italic">
                Sua clínica merece <br />
                <span className="text-aura-rose not-italic font-normal">crescer com inteligência.</span>
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-light">
                A plataforma completa para gerir faturamento, estoque de toxinas e fios, agenda profissional
                e ser encontrada por milhares de novos clientes de alto poder aquisitivo todos os dias.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 bg-white/5 p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] border border-white/10 hover:border-aura-rose/40 transition-all">
                <div className="p-3 rounded-2xl bg-aura-rose/15 text-aura-rose shrink-0">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-wider uppercase text-white">
                    DRE Financeiro em Tempo Real
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Margem por protocolo, custo de insumos e comissão médica calculados automaticamente.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] border border-white/10 hover:border-aura-rose/40 transition-all">
                <div className="p-3 rounded-2xl bg-aura-rose/15 text-aura-rose shrink-0">
                  <Globe size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-wider uppercase text-white">
                    Vitrine no Marketplace Nacional
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Sua clínica em destaque para consumidores buscando procedimentos nos Jardins e Itaim.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] border border-white/10 hover:border-aura-rose/40 transition-all">
                <div className="p-3 rounded-2xl bg-aura-rose/15 text-aura-rose shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-wider uppercase text-white">
                    Prontuário Médico Digital &amp; Termos
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Segurança jurídica total com assinatura eletrônica e fotos de evolução por CPF.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/seja-um-parceiro')}
                className="w-full sm:w-auto bg-white text-aura-charcoal hover:bg-aura-rose hover:text-white px-10 sm:px-12 py-5 sm:py-6 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-2xl hover:scale-103 cursor-pointer"
              >
                CADASTRAR MINHA CLÍNICA AGORA
              </button>
            </div>
          </div>

          {/* PREVIEW DO COCKPIT EMPRESARIAL */}
          <div className="relative">
            <BusinessCockpit className="shadow-3xl" />
            <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 bg-aura-rose text-aura-charcoal p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-2xl max-w-[200px] border-2 border-white/20">
              <p className="text-3xl sm:text-4xl font-serif font-bold">120%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1">
                Aumento médio em agendamentos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RODAPÉ EDITORIAL LUXURY */}
      <footer className="py-14 px-6 sm:px-12 bg-aura-pearl border-t border-aura-linen text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <AuraLogoV3 size="xs" variant="app" subtitle="Universal Gateway" />
          <p className="text-[10px] text-aura-taupe font-medium uppercase tracking-[0.3em]">
            © 2025 Aura Universe • Marketplace, Gestão Clínica &amp; Fidelidade
          </p>
        </div>
      </footer>

      {/* 4. MODAL DE LOGIN / IDENTIFICAÇÃO PROTEGIDA */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsAuthModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <AuthPortal
                defaultRole={authRole}
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

export default Gateway;
