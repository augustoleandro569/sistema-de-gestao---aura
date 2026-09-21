// src/pages/public/ConsumerHome.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Star,
  Search,
  Calendar,
  Heart,
  ChevronRight,
  ShieldCheck,
  Award,
  ArrowRight,
  Clock,
  CheckCircle2,
  Gift,
  Compass,
  Store
} from 'lucide-react';
import { AuraLogoV3 } from '../../components/ui/AuraLogoV3';
import { AuthPortal } from '../auth/AuthPortal';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../core/BusinessContext';

export const ConsumerHome: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { businesses } = useBusiness();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Procedimentos mais desejados
  const featuredProcedures = [
    {
      id: 'proc-1',
      name: 'Preenchimento Labial Russo',
      clinic: 'Clínica Sublime Estética',
      neighborhood: 'Jardins, SP',
      duration: '50 min',
      price: 'R$ 1.890',
      cashback: 'R$ 189 de volta',
      rating: 4.98,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
      category: 'facial'
    },
    {
      id: 'proc-2',
      name: 'Toxina Botulínica Full Face (Botox)',
      clinic: 'Clínica Sublime Estética',
      neighborhood: 'Jardins, SP',
      duration: '45 min',
      price: 'R$ 1.650',
      cashback: 'R$ 165 de volta',
      rating: 4.99,
      image: 'https://images.unsplash.com/photo-1512290900672-1f551b9ce637?auto=format&fit=crop&w=600&q=80',
      category: 'facial'
    },
    {
      id: 'proc-3',
      name: 'Lavieen BB Laser (Glow & Poros)',
      clinic: 'Studio Bella Visage',
      neighborhood: 'Cerqueira César, SP',
      duration: '40 min',
      price: 'R$ 890',
      cashback: 'R$ 89 de volta',
      rating: 4.95,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      category: 'laser'
    },
    {
      id: 'proc-4',
      name: 'Drenagem Linfática Método Joana',
      clinic: 'Clínica Sublime Estética',
      neighborhood: 'Jardins, SP',
      duration: '60 min',
      price: 'R$ 380',
      cashback: 'R$ 38 de volta',
      rating: 4.96,
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80',
      category: 'corporal'
    }
  ];

  const categories = [
    { id: 'todos', label: 'Todos os Procedimentos' },
    { id: 'facial', label: 'Harmonização & Facial' },
    { id: 'laser', label: 'Laser & Rejuvenescimento' },
    { id: 'corporal', label: 'Corporal & Drenagem' },
    { id: 'spa', label: 'Spa Urbano & Bem-Estar' }
  ];

  const filteredProcedures = featuredProcedures.filter((p) => {
    const matchesCat = selectedCategory === 'todos' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clinic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenAuth = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-aura-pearl text-aura-charcoal selection:bg-aura-rose/20 selection:text-aura-charcoal">
      {/* NAVBAR LIMPA PARA O CONSUMIDOR */}
      <header className="sticky top-0 z-40 bg-aura-pearl/90 backdrop-blur-md border-b border-aura-linen">
        <nav className="max-w-7xl mx-auto px-6 sm:px-12 py-5 sm:py-6 flex justify-between items-center">
          <AuraLogoV3
            size="sm"
            variant="app"
            onClick={() => navigate('/')}
            className="cursor-pointer"
          />

          <div className="flex items-center gap-6 sm:gap-8">
            <button
              onClick={() => {
                const el = document.getElementById('marketplace-vitrine');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-aura-taupe hover:text-aura-charcoal transition-colors"
            >
              Explorar
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('clinicas-destaque');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden sm:inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-aura-taupe hover:text-aura-charcoal transition-colors"
            >
              Mapa Aura
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('aura-club');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden md:inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-aura-taupe hover:text-aura-charcoal transition-colors"
            >
              Aura Club
            </button>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-aura-charcoal hover:bg-black text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs font-bold shadow-soft-glow hover:scale-102 transition-all"
            >
              ACESSAR MINHA CONTA
            </button>
          </div>
        </nav>
      </header>

      {/* HERO: FOCO NO ESTILO DE VIDA */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-20 sm:pb-28">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8 sm:space-y-10">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full border border-aura-rose/30 shadow-2xs">
            <Sparkles size={12} className="text-aura-rose" />
            <span className="text-[10px] font-bold text-aura-taupe uppercase tracking-[0.3em]">
              Aura App • A Curadoria da Beleza
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-aura-charcoal leading-[1.12] tracking-tight">
            Sua melhor versão <br />
            encontra a <span className="italic text-aura-rose">Aura certa.</span>
          </h1>

          <p className="text-base sm:text-lg text-aura-taupe max-w-xl mx-auto leading-relaxed font-normal">
            Encontre as melhores clínicas de estética, siga especialistas renomados e ganhe recompensas em cada atendimento.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('marketplace-vitrine');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-aura-charcoal hover:bg-black text-white px-10 sm:px-12 py-4 sm:py-5 rounded-[32px] font-bold text-xs uppercase tracking-widest shadow-2xl hover:scale-103 transition-all"
            >
              Explorar Marketplace
            </button>

            <button
              onClick={handleOpenAuth}
              className="w-full sm:w-auto px-8 py-4 sm:py-5 rounded-[32px] bg-white border border-aura-linen hover:border-aura-rose text-aura-charcoal font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>Acessar Minha Conta</span>
              <ArrowRight size={13} className="text-aura-rose" />
            </button>
          </div>

          {/* BARRA DE PESQUISA RÁPIDA DE SERVIÇOS */}
          <div className="max-w-2xl mx-auto pt-6">
            <div className="bg-white rounded-full p-2 pl-6 border border-aura-linen shadow-lg flex items-center gap-3">
              <Search size={18} className="text-aura-taupe" />
              <input
                type="text"
                placeholder="Busque por procedimento (ex: Botox, Preenchimento, Lavieen)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm bg-transparent border-none focus:outline-hidden text-aura-charcoal placeholder:text-aura-taupe/70"
              />
              <button
                onClick={() => {
                  const el = document.getElementById('marketplace-vitrine');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-aura-charcoal text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shrink-0"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: VITRINE DO MARKETPLACE */}
      <section id="marketplace-vitrine" className="py-20 bg-white border-t border-aura-linen">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
          {/* HEADER DA VITRINE */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-aura-linen pb-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-aura-rose uppercase tracking-[0.25em]">
                Seleção dos Jardins &amp; São Paulo
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-aura-charcoal">
                Procedimentos em Alta
              </h2>
            </div>

            {/* FILTROS POR CATEGORIA */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-aura-charcoal text-white shadow-xs'
                      : 'bg-aura-pearl text-aura-taupe hover:text-aura-charcoal hover:bg-aura-linen'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* GRID DE CARDS DO CONSUMIDOR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProcedures.map((proc) => (
              <div
                key={proc.id}
                className="group bg-white rounded-3xl border border-aura-linen overflow-hidden shadow-xs hover:shadow-xl hover:border-aura-rose/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* FOTO DO PROCEDIMENTO */}
                  <div className="relative h-48 overflow-hidden bg-aura-pearl">
                    <img
                      src={proc.image}
                      alt={proc.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-aura-charcoal flex items-center gap-1 shadow-2xs">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span>{proc.rating}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-aura-charcoal/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-wider">
                      {proc.cashback}
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="p-5 space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-aura-rose uppercase tracking-wider">
                        {proc.clinic}
                      </p>
                      <h3 className="font-serif font-bold text-base text-aura-charcoal group-hover:text-aura-rose transition-colors line-clamp-1">
                        {proc.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-aura-taupe">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {proc.duration}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {proc.neighborhood}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-aura-linen/70 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-aura-taupe block">A partir de</span>
                        <span className="text-lg font-serif font-bold text-aura-charcoal">
                          {proc.price}
                        </span>
                      </div>

                      <button
                        onClick={handleOpenAuth}
                        className="bg-aura-pearl hover:bg-aura-charcoal text-aura-charcoal hover:text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer"
                      >
                        Agendar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO: CLÍNICAS EM DESTAQUE NO MAPA DOS JARDINS */}
      <section id="clinicas-destaque" className="py-20 bg-aura-pearl/50 border-t border-aura-linen">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-aura-rose uppercase tracking-[0.3em] bg-white px-4 py-1.5 rounded-full border border-aura-rose/25">
              Curadoria de Espaços
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-aura-charcoal">
              Clínicas Referência nos Jardins
            </h2>
            <p className="text-sm text-aura-taupe">
              Ambientes auditados, profissionais com registro médico/biomédico e protocolos de esterilização hospitalar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {businesses.slice(0, 2).map((biz) => (
              <div
                key={biz.id}
                className="bg-white rounded-[32px] p-6 sm:p-8 border border-aura-linen shadow-xs flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:border-aura-rose/40 transition-all"
              >
                <img
                  src={biz.logo || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80'}
                  alt={biz.name}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-aura-linen"
                />

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      ✓ Auditada Aura
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star size={12} className="fill-amber-400" />
                      <span>{biz.rating || 4.9}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-aura-charcoal">
                    {biz.name}
                  </h3>

                  <p className="text-xs text-aura-taupe flex items-center gap-1.5">
                    <MapPin size={13} className="text-aura-rose shrink-0" />
                    <span>{biz.address || 'Jardins, São Paulo'}</span>
                  </p>

                  <p className="text-xs text-aura-taupe/80 line-clamp-2">
                    {biz.description || 'Especialistas em harmonização facial, rejuvenescimento e estética de alta performance.'}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={handleOpenAuth}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-aura-charcoal hover:text-aura-rose transition-colors cursor-pointer"
                    >
                      <span>Ver Horários Disponíveis</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO: AURA CLUB (FIDELIDADE & CASHBACK) */}
      <section id="aura-club" className="py-20 bg-aura-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aura-rose bg-white/10 px-4 py-1.5 rounded-full border border-aura-rose/30">
              Aura Club • Recompensas
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white leading-tight">
              Cada sessão de cuidado <br />
              acumula créditos reais.
            </h2>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Com o Aura Club, 10% do valor de qualquer procedimento nas clínicas parceiras é devolvido em créditos para suas próximas sessões, além de acesso prioritário na agenda de especialistas disputados.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <p className="text-2xl font-serif font-bold text-aura-rose">10%</p>
                <p className="text-xs text-gray-300">Cashback Automático</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <p className="text-2xl font-serif font-bold text-emerald-400">10+1</p>
                <p className="text-xs text-gray-300">Mimo Exclusivo na 10ª Sessão</p>
              </div>
            </div>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-aura-rose hover:bg-[#d99c92] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-soft-glow transition-all"
            >
              ATIVAR MEU AURA CLUB
            </button>
          </div>

          <div className="bg-gradient-to-tr from-white/10 to-white/5 border border-white/15 p-8 rounded-[40px] backdrop-blur-md space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-aura-rose">
                Cartão Fidelidade Digital
              </span>
              <span className="text-xs text-gray-400">Aura Pass Jardins</span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-400">Saldo Disponível</p>
              <p className="text-4xl font-serif font-bold text-white">R$ 380,00</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Progresso para Sessão Gratuita</span>
                <span className="text-aura-rose font-bold">8 de 10 concluídas</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-aura-rose w-4/5 rounded-full" />
              </div>
            </div>

            <p className="text-[11px] text-gray-400">
              Válido na Sublime Estética, Studio Bella Visage e rede credenciada de São Paulo.
            </p>
          </div>
        </div>
      </section>

      {/* BANNER DE TRANSIÇÃO: O CONVITE PARA O PRESTADOR */}
      <section className="bg-white border-y border-aura-linen py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-aura-rose mb-1">
              <Store size={13} />
              <span>Para Profissionais &amp; Donas de Clínica</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif text-aura-charcoal">
              Você é um profissional da estética?
            </h3>
            <p className="text-sm text-aura-taupe max-w-xl">
              Leve sua clínica para o marketplace e gerencie seu lucro com inteligência. Controle estoque, precifique por custo real e receba agendamentos qualificados.
            </p>
          </div>

          <button
            onClick={() => navigate('/business')}
            className="group bg-aura-rose/15 hover:bg-aura-rose text-aura-rose hover:text-white px-8 py-4 sm:py-5 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 shrink-0 shadow-xs flex items-center gap-2"
          >
            <span>CONHECER AURA BUSINESS</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* FOOTER DO CONSUMIDOR */}
      <footer className="border-t border-aura-linen py-12 bg-aura-pearl text-xs text-aura-taupe">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <AuraLogoV3 size="xs" variant="app" />
            <span>© 2026 Aura Beauty Curated Marketplace</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/business')} className="hover:text-aura-charcoal font-semibold text-aura-rose">
              Sou Clínica / Profissional →
            </button>
            <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-aura-charcoal">
              Acessar Minha Conta
            </button>
            <span>Termos de Uso</span>
          </div>
        </div>
      </footer>

      {/* MODAL DE LOGIN/CADASTRO DO CLIENTE */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300">
          <div className="my-auto w-full max-w-md">
            <AuthPortal
              defaultRole="CLIENT"
              onClose={() => setIsAuthModalOpen(false)}
              onSuccess={() => {
                setIsAuthModalOpen(false);
                navigate('/app/explorar');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
