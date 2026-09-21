import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Sparkles,
  Filter,
  Grid,
  Heart,
  TrendingUp,
  Store,
  Calendar,
  Zap,
  Users,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../core/BusinessContext';
import { useLayout } from '../../layouts/LayoutContext';
import { ClinicCard } from '../../components/marketplace/ClinicCard';
import { MarketplaceFeedCard } from '../../components/marketplace/MarketplaceFeedCard';
import { BookingModal } from '../../components/marketplace/BookingModal';
import { MarketplaceMetricsBanner } from '../../components/marketplace/MarketplaceMetricsBanner';
import { SocialFeed } from '../../modules/marketplace/SocialFeed';
import { ExploreFeed } from '../../modules/marketplace/ExploreFeed';
import { NearbyExplorer } from '../../modules/marketplace/NearbyExplorer';
import { ConsumerAppointments } from './ConsumerAppointments';
import { Business, Unit } from '../../types';

export type MarketplaceTab = 'feed' | 'nearby' | 'discovery' | 'clinic_hub' | 'horarios';

interface AuraMarketplaceProps {
  initialTab?: MarketplaceTab;
  activeTab?: MarketplaceTab;
  onTabChange?: (tab: MarketplaceTab) => void;
  hideHeaderTabs?: boolean;
}

export const AuraMarketplace: React.FC<AuraMarketplaceProps> = ({
  initialTab = 'feed',
  activeTab: controlledActiveTab,
  onTabChange,
  hideHeaderTabs = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { currentBusiness, setPublicProfileSlug } = useBusiness();
  const { setCurrentTab } = useLayout();

  const getTabFromLocation = (): MarketplaceTab => {
    const path = location.pathname;
    if (path.includes('/mapa')) return 'nearby';
    if (path.includes('/clinicas')) return 'discovery';
    if (path.includes('/horarios')) return 'horarios';
    if (path.includes('/explorar') || path === '/app' || path === '/marketplace') return 'feed';
    return (initialTab as MarketplaceTab) || 'feed';
  };

  // Active view: 'feed', 'nearby', 'discovery', 'clinic_hub', 'horarios'
  const [internalActiveTab, setInternalActiveTab] = useState<MarketplaceTab>(getTabFromLocation);
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  useEffect(() => {
    const pathTab = getTabFromLocation();
    if (pathTab !== internalActiveTab) {
      setInternalActiveTab(pathTab);
    }
  }, [location.pathname]);

  const handleSelectTab = (tab: MarketplaceTab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
    setInternalActiveTab(tab);
    if (tab === 'nearby') navigate('/app/mapa');
    else if (tab === 'discovery') navigate('/app/clinicas');
    else if (tab === 'horarios') navigate('/app/horarios');
    else if (tab === 'feed') navigate('/app/explorar');
  };

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedLocation, setSelectedLocation] = useState('Todos os Bairros');
  const [onlyFollowed, setOnlyFollowed] = useState(false);

  // Booking Modal State
  const [bookingBusinessId, setBookingBusinessId] = useState<string | null>(null);
  const [suggestedService, setSuggestedService] = useState<string | undefined>(undefined);

  // Local state re-trigger for updates
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setVersion(v => v + 1);
    });
    return unsub;
  }, []);

  const profileId = userProfile?.id || 'profile-client-01';

  // Categories list
  const categories = [
    { id: 'Todos', label: 'Todos os Procedimentos', icon: '✨' },
    { id: 'Facial', label: 'Estética Facial', icon: '💆‍♀️' },
    { id: 'Sobrancelhas', label: 'Sobrancelhas & Cílios', icon: '👁️' },
    { id: 'Corporal', label: 'Corporal & Massagens', icon: '🧴' },
    { id: 'Harmonizacao', label: 'Harmonização Facial', icon: '💉' },
    { id: 'Unhas', label: 'Unhas & Podologia', icon: '💅' },
    { id: 'Capilar', label: 'Terapia Capilar', icon: '💇‍♀️' },
  ];

  const neighborhoods = [
    'Todos os Bairros',
    'Moema',
    'Jardins',
    'Pinheiros',
    'Vila Mariana',
    'Itaim Bibi',
    'Brooklin',
    'Campinas'
  ];

  // Fetch stores and feed from dataService
  const stores = useMemo(() => {
    return dataService.getMarketplaceStores({
      category: selectedCategory === 'Todos' ? undefined : selectedCategory,
      query: searchQuery,
      location: selectedLocation === 'Todos os Bairros' ? undefined : selectedLocation,
      onlyFollowed,
      profileId,
    });
  }, [selectedCategory, searchQuery, selectedLocation, onlyFollowed, profileId, version]);

  const feedPosts = useMemo(() => {
    return dataService.getMarketplaceFeed({
      category: selectedCategory === 'Todos' ? undefined : selectedCategory,
      onlyFollowed,
      profileId,
    });
  }, [selectedCategory, onlyFollowed, profileId, version]);

  // Handle Search Submission (record in search metrics for trend analysis)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 1) {
      dataService.recordMarketplaceSearch(searchQuery.trim(), selectedCategory);
    }
  };

  const handleFollowToggle = (businessId: string) => {
    dataService.toggleFollowBusiness(profileId, businessId);
  };

  const handleOpenBooking = (businessId: string, serviceName?: string) => {
    setBookingBusinessId(businessId);
    setSuggestedService(serviceName);
  };

  const handleOpenBookingFromUnit = (unit: Unit) => {
    const targetBizId = unit.businessId || unit.business_id || 'biz-sublime-01';
    setBookingBusinessId(targetBizId);
    setSuggestedService(undefined);
  };

  const handleViewClinic = (businessSlug: string) => {
    if (setPublicProfileSlug) {
      setPublicProfileSlug(businessSlug);
    }
    setCurrentTab('vitrine');
  };

  const handleBoostToggle = () => {
    if (currentBusiness?.id) {
      dataService.toggleBusinessAdsHighlight(currentBusiness.id);
    }
  };

  const followedCount = dataService.getFollowedBusinessIds(profileId).length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-24">
      {/* Hero Banner with Search (Exibido na busca da aba Clínicas) */}
      {activeTab === 'discovery' && (
        <section className="bg-gradient-to-b from-stone-950 via-[#231E1C] to-[#1E1917] text-white pt-10 pb-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D97706_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          {/* Top Pill / Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Sparkles size={13} className="text-amber-400" />
              <span>O Marketplace Oficial de Beleza & Estética Avançada</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <Store size={14} className="text-amber-400" />
                {dataService.getAllBusinesses().length} Clínicas Verificadas
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users size={14} className="text-amber-400" />
                Mais de 12.000 clientes agendados
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Encontre, Siga e Agende nas Melhores Clínicas de Estética.
            </h1>
            <p className="text-stone-300 text-sm sm:text-base mt-2 leading-relaxed">
              O ecossistema estilo iFood que conecta os melhores profissionais e tratamentos exclusivos ao seu estilo de vida.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl p-2.5 shadow-2xl border border-stone-200 flex flex-col md:flex-row items-center gap-2">
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2.5 px-3 w-full">
              <Search size={20} className="text-amber-600 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busque por procedimento, clínica ou especialidade (ex: Limpeza de Pele, Botox, Peeling)..."
                className="w-full py-2 text-stone-900 placeholder:text-stone-400 text-sm font-medium outline-hidden bg-transparent"
              />
            </div>

            <div className="hidden md:block w-px h-8 bg-stone-200" />

            {/* Neighborhood / Location Select */}
            <div className="flex items-center gap-2 px-3 w-full md:w-56">
              <MapPin size={18} className="text-stone-400 shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full py-2 text-stone-800 text-xs font-semibold outline-hidden bg-transparent cursor-pointer"
              >
                {neighborhoods.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Pesquisar</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'bg-white/10 text-stone-200 hover:bg-white/20'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Main Navigation Subtabs (Exibido nas abas de Clínicas, ROI e Horários) */}
      {activeTab !== 'feed' && activeTab !== 'nearby' && (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => handleSelectTab('feed')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === 'feed'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles size={15} className="text-rose-600" />
              <span>Para você (Feed Social)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('nearby')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === 'nearby'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MapPin size={15} className="text-amber-600" />
              <span>Mapa & Proximidade</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('discovery')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === 'discovery'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Store size={15} className="text-stone-700" />
              <span>Explorar Clínicas ({stores.length})</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('clinic_hub')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === 'clinic_hub'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <TrendingUp size={15} className="text-amber-600" />
              <span>Área da Clínica (ROI)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('horarios')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === 'horarios'
                  ? 'bg-white text-[#3A3A3A] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar size={15} className="text-[#C5A059]" />
              <span>Meus Horários</span>
            </button>
          </div>

          {/* Only Followed Filter Toggle */}
          {activeTab === 'discovery' && (
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyFollowed}
                  onChange={(e) => setOnlyFollowed(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Heart size={13} className={onlyFollowed ? 'fill-rose-500 text-rose-500' : 'text-stone-400'} />
                  Apenas Clínicas que sigo ({followedCount})
                </span>
              </label>
            </div>
          )}
        </div>
      </section>
      )}

      {/* Dynamic Content Views */}
      {activeTab === 'feed' ? (
        <SocialFeed
          onBookService={handleOpenBooking}
          onViewClinic={handleViewClinic}
          hideBottomNav={true}
        />
      ) : activeTab === 'nearby' ? (
        <NearbyExplorer
          onBookUnit={handleOpenBookingFromUnit}
          onViewClinic={handleViewClinic}
        />
      ) : (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'discovery' && (
          <div className="space-y-8">
            {/* Highlights Section */}
            {stores.some(s => s.isHighlightedAds) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-amber-100 text-amber-800">
                    <Zap size={16} />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-stone-900">
                      Destaques da Região (Marketplace Ads)
                    </h2>
                    <p className="text-xs text-stone-500">
                      Clínicas impulsionadas com maior pontuação e resposta rápida
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stores
                    .filter(s => s.isHighlightedAds)
                    .map((biz) => (
                      <ClinicCard
                        key={biz.id}
                        business={biz}
                        onFollowToggle={handleFollowToggle}
                        onBookClick={(id) => handleOpenBooking(id)}
                        onViewClinic={handleViewClinic}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* All Clinics Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold font-serif text-stone-900">
                    Todas as Clínicas e Especialistas Disponíveis
                  </h2>
                  <p className="text-xs text-stone-500">
                    Mostrando clínicas em {selectedLocation} • {stores.length} disponíveis para agendamento online
                  </p>
                </div>
              </div>

              {stores.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
                  <Store size={48} className="mx-auto text-stone-300" />
                  <h3 className="text-lg font-bold text-stone-800">
                    Nenhuma clínica encontrada para este filtro
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Tente buscar por termos mais abrangentes como "Facial", "Sobrancelhas" ou selecione "Todos os Bairros".
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Todos');
                      setSelectedLocation('Todos os Bairros');
                      setOnlyFollowed(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold cursor-pointer"
                  >
                    Limpar Filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stores.map((biz) => (
                    <ClinicCard
                      key={biz.id}
                      business={biz}
                      onFollowToggle={handleFollowToggle}
                      onBookClick={(id) => handleOpenBooking(id)}
                      onViewClinic={handleViewClinic}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MEUS HORÁRIOS & HISTÓRICO MULTI-CLÍNICA */}
        {activeTab === 'horarios' && (
          <ConsumerAppointments
            onNewBookingClick={() => handleSelectTab('discovery')}
            onViewClinic={handleViewClinic}
          />
        )}

        {activeTab === 'clinic_hub' && (
          <div className="space-y-6">
            {/* The Metrics Banner */}
            <MarketplaceMetricsBanner onBoostClick={handleBoostToggle} />

            {/* Explanatory Cards on How Aura Marketplace Transforms the Business */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  Venda Clientes, Não Apenas Software
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  O Aura não é mais um SaaS isolado. Ao integrar um marketplace centralizado de agendamentos, atraímos a demanda de consumidores finais e os entregamos na agenda da sua clínica.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  Monetização por Comissão (10%)
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Para clientes conquistados através da rede Aura, uma comissão transparente de 10% é apurada automaticamente. Clientes diretos continuam 100% gratuitos na sua ferramenta de gestão SaaS.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  Destaque Aura Ads
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Ganhe prioridade nos resultados de busca locais e apareça no topo para milhares de pessoas que buscam procedimentos no seu bairro com nosso módulo de impulsionamento patrocinado.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      )}

      {/* Booking Modal */}
      {bookingBusinessId && (
        <BookingModal
          businessId={bookingBusinessId}
          initialServiceQuery={suggestedService}
          onClose={() => {
            setBookingBusinessId(null);
            setSuggestedService(undefined);
          }}
          onSuccess={(appointmentId) => {
            console.log('Agendamento criado via marketplace:', appointmentId);
          }}
        />
      )}
    </div>
  );
};
