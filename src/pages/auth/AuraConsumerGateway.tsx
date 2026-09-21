// src/pages/auth/AuraConsumerGateway.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AuraLogoV3 } from '../../components/ui/AuraLogoV3';
import { AuthPortal } from './AuthPortal';
import {
  Sparkles,
  MapPin,
  Users,
  CheckCircle,
  ArrowRight,
  Heart,
  Star,
  Search,
  ChevronRight,
  ShieldCheck,
  Award,
  Zap,
  Clock,
  Compass,
  Store,
  CalendarCheck,
  Check,
  BadgePercent
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

const SHOWCASE_PROTOCOLS: ProtocolShowcase[] = [
  {
    id: 'glow-skin',
    title: 'Limpeza de Pele Glow & Peeling de Diamante',
    category: 'Facial Avançado',
    rating: 4.95,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80',
    price: 'R$ 280,00',
    availableIn: '14 clínicas parceiras nos Jardins & Itaim',
    tag: 'Protocolo Exclusivo',
  },
  {
    id: 'harmonizacao-full',
    title: 'Harmonização Facial & Ácido Hialurônico',
    category: 'Injetáveis & Médicos',
    rating: 4.98,
    reviewsCount: 230,
    image: 'https://images.unsplash.com/photo-1512290900672-1f551b9ce637?auto=format&fit=crop&w=700&q=80',
    price: 'R$ 1.890,00',
    availableIn: 'Dra. Camila Vasconcelos e rede credenciada',
    tag: 'Mais Desejado',
  },
  {
    id: 'lavieen-laser',
    title: 'Laser Lavieen Efeito BB Glow',
    category: 'Tecnologia Laser',
    rating: 4.92,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
    price: 'R$ 690,00',
    availableIn: '8 clínicas com tecnologia auditada',
    tag: 'Tendência 2025',
  },
  {
    id: 'bioestimulador-colageno',
    title: 'Bioestimulador de Colágeno Sculptra',
    category: 'Rejuvenescimento',
    rating: 4.99,
    reviewsCount: 175,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=700&q=80',
    price: 'R$ 2.400,00',
    availableIn: 'Clínicas selecionadas de alta complexidade',
    tag: 'Padrão Ouro',
  },
];

const COMMUNITY_POSTS = [
  {
    id: 'post-1',
    author: 'Dra. Camila Vasconcelos',
    role: 'Biomédica Esteta • Jardins',
    avatar: 'https://images.unsplash.com/photo-1594824813526-72d80d238b9d?auto=format&fit=crop&w=160&q=80',
    resultTitle: 'Resultado 14 dias pós-Bioestimulador',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    likes: 342,
    clinic: 'Sublime Estética Jardins',
  },
  {
    id: 'post-2',
    author: 'Studio Bella Visage',
    role: 'Harmonização & Glow • Itaim Bibi',
    avatar: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=160&q=80',
    resultTitle: 'Lábios Naturais com Técnica Gloss',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
    likes: 418,
    clinic: 'Studio Bella Visage',
  },
];

export const AuraConsumerGateway: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<'CLIENT' | 'BUSINESS'>('CLIENT');
  const [searchLocation, setSearchLocation] = useState('');
  const [savedFavorites, setSavedFavorites] = useState<string[]>(['glow-skin']);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenAuth = (role: 'CLIENT' | 'BUSINESS' = 'CLIENT') => {
    setAuthDefaultRole(role);
    setIsAuthModalOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleOpenAuth('CLIENT');
  };

  return (
    <div className="min-h-screen bg-aura-pearl overflow-x-hidden selection:bg-aura-rose/25 selection:text-aura-charcoal">
      {/* 1. NAVBAR DE IMPACTO COM LOGO MONO-LINE INTERATIVA */}
      <nav className="fixed top-0 w-full z-[100] px-6 sm:px-12 py-4 sm:py-5 flex justify-between items-center backdrop-blur-xl bg-white/80 border-b border-aura-linen/70 shadow-xs transition-all">
        <div className="flex items-center gap-6">
          <AuraLogoV3
            size="sm"
            variant="app"
            subtitle="The Beauty Discovery"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        </div>

        <div className="hidden md:flex gap-8 lg:gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-aura-taupe">
          <a
            href="#vantagens"
            className="hover:text-aura-charcoal transition-colors py-1 hover:border-b-2 hover:border-aura-rose"
          >
            Vantagens
          </a>
          <a
            href="#comunidade"
            className="hover:text-aura-charcoal transition-colors py-1 hover:border-b-2 hover:border-aura-rose"
          >
            Comunidade
          </a>
          <a
            href="#procedimentos"
            className="hover:text-aura-charcoal transition-colors py-1 hover:border-b-2 hover:border-aura-rose"
          >
            Explorar
          </a>
          <a
            href="#aura-club"
            className="hover:text-aura-charcoal transition-colors py-1 hover:border-b-2 hover:border-aura-rose"
          >
            Aura Club
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenAuth('BUSINESS')}
            className="hidden sm:inline-flex text-[11px] font-bold text-aura-taupe hover:text-aura-charcoal transition-colors uppercase tracking-wider px-3 py-2"
          >
            Sou Clínica
          </button>
          <button
            onClick={() => handleOpenAuth('CLIENT')}
            className="bg-aura-charcoal text-white hover:bg-black px-6 sm:px-9 py-2.5 sm:py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl hover:scale-103 active:scale-98 transition-all cursor-pointer"
          >
            ENTRAR AGORA
          </button>
        </div>
      </nav>

      {/* 2. HERO: O CONVITE AO UNIVERSO - INSPIRADO NO IFOOD ELEVADO AO LUXO */}
      <section className="relative pt-36 sm:pt-44 pb-20 px-6 sm:px-12 text-center max-w-5xl mx-auto space-y-10 sm:space-y-12">
        {/* TAG SUPERIOR */}
        <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full border border-aura-linen shadow-xs">
          <Sparkles size={14} className="text-aura-rose" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aura-charcoal">
            O Portal do Consumidor • Aura Experience
          </span>
        </div>

        <div className="space-y-5 sm:space-y-6">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-aura-charcoal leading-[1.05] tracking-tight">
            Descubra a sua <br />
            <span className="italic text-aura-rose font-normal">melhor versão.</span>
          </h1>
          <p className="text-aura-taupe text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Bem-vinda à Aura. A maior rede de estética de elite onde você encontra os melhores
            profissionais, acompanha resultados reais e é recompensada por se cuidar.
          </p>
        </div>

        {/* BUSCA ESTILO IFOOD ELEVADA A PADRÃO EDITORIAL */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-2xl mx-auto bg-white rounded-[32px] p-2.5 sm:p-3 shadow-luminous border border-aura-linen flex flex-col sm:flex-row items-center gap-3 transition-all hover:border-aura-rose/50"
        >
          <div className="flex-1 flex items-center px-4 sm:px-6 gap-3 w-full">
            <MapPin size={20} className="text-aura-rose shrink-0" />
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Onde você quer se cuidar hoje? (ex: Jardins, Itaim, Moema)"
              className="bg-transparent border-none outline-hidden text-xs sm:text-sm font-medium py-2 sm:py-3 w-full text-aura-charcoal placeholder:text-aura-taupe/60"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-aura-charcoal text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-[24px] font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-md cursor-pointer shrink-0"
          >
            Buscar Clínicas
          </button>
        </form>

        {/* PROVAS RÁPIDAS DE CONVENIÊNCIA */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 pt-4 text-[11px] font-medium text-aura-taupe">
          <div className="flex items-center gap-2">
            <CheckCircle size={15} className="text-emerald-600" />
            <span>Clínicas auditadas pela curadoria médica</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarCheck size={15} className="text-aura-rose" />
            <span>Agendamento em 3 cliques</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgePercent size={15} className="text-amber-600" />
            <span>Cashback &amp; Selos fidelidade</span>
          </div>
        </div>
      </section>

      {/* 3. SHOWCASE EDITORIAL: O QUE VOCÊ ENCONTRA (CURADORIA DE ELITE) */}
      <section id="procedimentos" className="py-24 px-6 sm:px-12 bg-white border-y border-aura-linen">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] font-bold text-aura-rose uppercase tracking-[0.4em]">
                Alta Performance &amp; Bem-Estar
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-aura-charcoal">
                Curadoria de Elite
              </h2>
              <p className="text-aura-taupe text-sm">
                Protocolos exclusivos selecionados para o seu bem-estar com certificação de biossegurança.
              </p>
            </div>

            <button
              onClick={() => handleOpenAuth('CLIENT')}
              className="inline-flex items-center gap-2 text-xs font-bold text-aura-charcoal hover:text-aura-rose transition-colors uppercase tracking-wider group cursor-pointer"
            >
              <span>Ver todos os protocolos</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform text-aura-rose" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SHOWCASE_PROTOCOLS.map((protocol) => {
              const isFav = savedFavorites.includes(protocol.id);
              return (
                <div
                  key={protocol.id}
                  onClick={() => handleOpenAuth('CLIENT')}
                  className="group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/5] rounded-[36px] overflow-hidden shadow-luminous mb-5 bg-aura-linen/40">
                      <img
                        src={protocol.image}
                        alt={protocol.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                      />

                      {/* BADGE DE AVALIAÇÃO */}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                        <Star size={11} className="text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-bold text-aura-charcoal">
                          {protocol.rating.toFixed(1)}
                        </span>
                        <span className="text-[9px] text-aura-taupe">({protocol.reviewsCount})</span>
                      </div>

                      {/* BOTÃO DE FAVORITO INTERATIVO */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(protocol.id, e)}
                        className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-aura-charcoal hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer"
                        aria-label="Salvar favorito"
                      >
                        <Heart
                          size={15}
                          className={isFav ? 'text-rose-500 fill-rose-500' : 'text-aura-taupe'}
                        />
                      </button>

                      {/* TAG DE PROTOCOLO */}
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-aura-charcoal/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                          {protocol.tag}
                        </span>
                      </div>
                    </div>

                    <p className="text-[9px] font-bold text-aura-rose uppercase tracking-widest mb-1">
                      {protocol.category}
                    </p>
                    <h3 className="text-lg font-serif font-bold text-aura-charcoal group-hover:text-aura-rose transition-colors leading-snug line-clamp-2">
                      {protocol.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-aura-linen/60 mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-aura-taupe">{protocol.availableIn}</p>
                      <p className="text-sm font-bold font-serif text-aura-charcoal mt-0.5">
                        {protocol.price}
                      </p>
                    </div>
                    <span className="p-2 rounded-full bg-aura-pearl group-hover:bg-aura-charcoal group-hover:text-white transition-colors text-aura-charcoal">
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. COMUNIDADE E SEGUIR (O DIFERENCIAL AURA - REDE SOCIAL ESTÉTICA) */}
      <section id="comunidade" className="py-28 px-6 sm:px-12 bg-aura-pearl overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-aura-rose uppercase tracking-[0.4em] bg-white px-3.5 py-1 rounded-full border border-aura-rose/25">
                Mais que um app
              </span>
              <h2 className="text-4xl sm:text-5xl font-serif text-aura-charcoal leading-tight">
                Faça parte da nossa <br />
                <span className="italic text-aura-rose">comunidade estética.</span>
              </h2>
              <p className="text-aura-taupe leading-relaxed text-base sm:text-lg font-light">
                No Aura App você não apenas agenda. Você segue suas clínicas favoritas, recebe
                atualizações de resultados em tempo real, descobre transformações autênticas e
                consome orientações de especialistas de renome.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-5 p-5 bg-white rounded-[28px] border border-aura-linen shadow-xs hover:border-aura-rose/30 transition-all">
                <div className="w-13 h-13 rounded-2xl bg-aura-rose/15 flex items-center justify-center text-aura-rose shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <p className="font-bold text-aura-charcoal text-sm">Siga e Inspire-se</p>
                  <p className="text-xs text-aura-taupe mt-0.5">
                    Feed social dinâmico com fotos de antes e depois verificadas por pacientes reais.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-5 bg-white rounded-[28px] border border-aura-linen shadow-xs hover:border-aura-rose/30 transition-all">
                <div className="w-13 h-13 rounded-2xl bg-aura-rose/15 flex items-center justify-center text-aura-rose shrink-0">
                  <Heart size={24} />
                </div>
                <div>
                  <p className="font-bold text-aura-charcoal text-sm">Wishlist &amp; Favoritos</p>
                  <p className="text-xs text-aura-taupe mt-0.5">
                    Salve protocolos desejados, compare valores e monte seu cronograma anual de beleza.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-5 bg-white rounded-[28px] border border-aura-linen shadow-xs hover:border-aura-rose/30 transition-all">
                <div className="w-13 h-13 rounded-2xl bg-aura-rose/15 flex items-center justify-center text-aura-rose shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="font-bold text-aura-charcoal text-sm">Prontuário Único por CPF</p>
                  <p className="text-xs text-aura-taupe mt-0.5">
                    Seu histórico clínico viaja com você, com segurança criptografada e sigilo médico.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenAuth('CLIENT')}
              className="bg-aura-charcoal text-white hover:bg-black px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explorar o Feed Social</span>
              <ArrowRight size={14} className="text-aura-rose" />
            </button>
          </div>

          {/* MOCKUP INTERATIVO DO FEED NO CELULAR */}
          <div className="relative flex justify-center">
            {/* LUZ DE FUNDO ROSÉ SUAVE */}
            <div className="absolute -top-10 -right-10 w-96 h-96 bg-aura-rose/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-sm bg-white rounded-[44px] p-5 shadow-2xl border-4 border-aura-linen/80 relative z-10">
              {/* NOTCH DO CELULAR */}
              <div className="w-24 h-4 bg-aura-linen rounded-full mx-auto mb-4" />

              {/* CABEÇALHO DO FEED NO MOCKUP */}
              <div className="flex items-center justify-between pb-3 border-b border-aura-linen">
                <span className="text-[11px] font-bold uppercase tracking-widest text-aura-charcoal">
                  Aura Feed • Jardins
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* POST DO FEED MOCKUP */}
              <div className="space-y-4 pt-3">
                {COMMUNITY_POSTS.map((post) => (
                  <div
                    key={post.id}
                    className="p-3.5 bg-aura-pearl/60 rounded-[24px] border border-aura-linen/60 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.avatar}
                          alt={post.author}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-aura-rose"
                        />
                        <div>
                          <p className="text-xs font-bold text-aura-charcoal leading-none">
                            {post.author}
                          </p>
                          <p className="text-[9px] text-aura-taupe mt-0.5">{post.role}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-aura-rose bg-white px-2 py-0.5 rounded-full border border-aura-linen">
                        Seguindo
                      </span>
                    </div>

                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xs">
                      <img
                        src={post.image}
                        alt={post.resultTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] px-2.5 py-0.5 rounded-full font-medium">
                        {post.resultTitle}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-aura-taupe pt-1">
                      <span className="flex items-center gap-1 text-[11px] text-rose-600 font-semibold">
                        <Heart size={13} className="fill-rose-500 text-rose-500" />
                        {post.likes} curtidas
                      </span>
                      <span className="text-[10px] font-bold text-aura-charcoal underline underline-offset-2">
                        Ver Protocolo
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AURA CLUB (TANGIBILIZAÇÃO DA FIDELIDADE & SELOS VALENDO PRESENTES) */}
      <section id="vantagens" className="py-28 px-6 sm:px-12 bg-aura-charcoal text-white rounded-t-[60px] sm:rounded-t-[80px]">
        <div className="max-w-4xl mx-auto text-center space-y-10 sm:space-y-12">
          <div className="inline-flex p-4 rounded-3xl bg-aura-rose/10 border border-aura-rose/30 shadow-soft-glow mx-auto">
            <Sparkles className="text-aura-rose animate-spin-slow" size={40} />
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-aura-rose bg-white/10 px-4 py-1.5 rounded-full border border-aura-rose/30">
              Aura Club • Experiência de Fidelidade
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif leading-tight">
              Suas sessões agora <br />
              <span className="text-aura-rose italic font-normal">valem recompensas reais.</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              A cada 10 atendimentos realizados via Aura App, você ganha um procedimento cortesia de
              alta performance. Simples, automático e registrado na sua carteira digital.
            </p>
          </div>

          {/* SIMULAÇÃO VISUAL DE SELOS BRILHANDO NO FUNDO ESCURO */}
          <div className="bg-white/5 border border-white/10 p-6 sm:p-10 rounded-[36px] backdrop-blur-md max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-center text-xs text-gray-300 border-b border-white/10 pb-4">
              <span>Seu Cartão Fidelidade Aura Pass</span>
              <span className="text-aura-rose font-bold">8 de 10 selos conquistados</span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 justify-center">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`stamp-${i}`}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-aura-rose bg-aura-rose/25 flex items-center justify-center shadow-soft-glow transition-transform hover:scale-110"
                >
                  <Sparkles size={18} className="text-aura-rose" />
                </div>
              ))}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-white/40 bg-white/5 flex items-center justify-center text-white/50 text-xs font-bold">
                9
              </div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-aura-rose/60 bg-aura-rose/10 flex items-center justify-center text-aura-rose text-xs font-bold">
                🎁
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Próxima recompensa desbloqueada: <strong>1 Sessão Peeling Ultrassônico Glow</strong>
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleOpenAuth('CLIENT')}
              className="bg-aura-rose hover:bg-[#d99c92] text-white px-10 sm:px-14 py-4 sm:py-5 rounded-full text-xs font-bold uppercase tracking-widest shadow-2xl hover:scale-103 active:scale-98 transition-all cursor-pointer"
            >
              CRIAR MINHA CONTA &amp; RESGATAR SELOS
            </button>
          </div>
        </div>
      </section>

      {/* 6. BANNER DE CONVITE PARA CLÍNICAS PARCEIRAS */}
      <section className="bg-white border-b border-aura-linen py-16 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-aura-rose">
              <Store size={13} />
              <span>Para Donos de Clínica e Estetas de Elite</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif text-aura-charcoal">
              Quer disponibilizar sua clínica na Aura?
            </h3>
            <p className="text-xs sm:text-sm text-aura-taupe max-w-xl">
              Faça parte da nossa rede de elite e receba clientes qualificados com controle total
              de estoque, DRE e prontuário médico.
            </p>
          </div>

          <button
            onClick={() => handleOpenAuth('BUSINESS')}
            className="bg-aura-charcoal text-white hover:bg-black px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md hover:scale-102 transition-all cursor-pointer shrink-0"
          >
            Aura Business
          </button>
        </div>
      </section>

      {/* RODAPÉ ELEGANTE */}
      <footer className="py-12 px-6 sm:px-12 bg-aura-pearl text-center border-t border-aura-linen">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <AuraLogoV3 size="xs" variant="app" subtitle="Beauty Discovery" />
          <p className="text-[10px] text-aura-taupe font-medium uppercase tracking-[0.3em]">
            © 2025 Aura Universe • Curadoria, Segurança Médica &amp; Recompensas
          </p>
        </div>
      </footer>

      {/* 7. MODAL DE LOGIN/CADASTRO INTEGRADO COM AUTHPORTAL */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
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
                defaultRole={authDefaultRole}
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

export default AuraConsumerGateway;
