// src/modules/marketplace/NearbyMap.tsx
import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  Star,
  Search,
  SlidersHorizontal,
  X,
  Clock,
  Compass,
  CheckCircle2,
  Phone,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { BookingModal } from '../../components/marketplace/BookingModal';

export interface NearbyMapClinic {
  id: string;
  name: string;
  businessId: string;
  businessSlug: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  distanceFormatted: string;
  address: string;
  neighborhood: string;
  openingHours: string;
  isOpenNow: boolean;
  image: string;
  specialties: string[];
  // Coordenadas relativas percentuais para o canvas de luxo
  coordX: number; // 0-100%
  coordY: number; // 0-100%
}

export const NearbyMap: React.FC = () => {
  // Clínicas disponíveis no Ecossistema Aura
  const clinics: NearbyMapClinic[] = useMemo(() => {
    return [
      {
        id: 'unit-matriz',
        name: 'Aura Unidade Jardins',
        businessId: 'biz-aura-matriz',
        businessSlug: 'aura-jardins',
        rating: 4.9,
        reviewsCount: 128,
        distanceKm: 0.6,
        distanceFormatted: 'A 600m de você',
        address: 'Rua Oscar Freire, 1052 - Jardins, São Paulo',
        neighborhood: 'Jardins',
        openingHours: 'Seg a Sáb • 08h às 20h',
        isOpenNow: true,
        image:
          'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
        specialties: ['Limpeza de Pele', 'Peeling Diamante', 'Laser Lavieen'],
        coordX: 48,
        coordY: 46,
      },
      {
        id: 'unit-moema',
        name: 'Aura Concept Moema',
        businessId: 'biz-aura-moema',
        businessSlug: 'aura-moema',
        rating: 4.8,
        reviewsCount: 94,
        distanceKm: 3.2,
        distanceFormatted: 'A 3.2km de você',
        address: 'Av. Ibirapuera, 2340 - Moema, São Paulo',
        neighborhood: 'Moema',
        openingHours: 'Seg a Sex • 09h às 19h',
        isOpenNow: true,
        image:
          'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
        specialties: ['Drenagem Linfática', 'Revitalização Labial', 'Harmonização'],
        coordX: 34,
        coordY: 68,
      },
      {
        id: 'unit-itaim',
        name: 'Aura Studio Itaim Bibi',
        businessId: 'biz-aura-itaim',
        businessSlug: 'aura-itaim',
        rating: 5.0,
        reviewsCount: 76,
        distanceKm: 2.1,
        distanceFormatted: 'A 2.1km de você',
        address: 'Rua Joaquim Floriano, 871 - Itaim Bibi, São Paulo',
        neighborhood: 'Itaim Bibi',
        openingHours: 'Seg a Sáb • 08h às 21h',
        isOpenNow: true,
        image:
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
        specialties: ['Protocolo Glow', 'Ultraformer III', 'Massoterapia'],
        coordX: 68,
        coordY: 38,
      },
      {
        id: 'unit-pinheiros',
        name: 'Aura Boutique Pinheiros',
        businessId: 'biz-aura-pinheiros',
        businessSlug: 'aura-pinheiros',
        rating: 4.9,
        reviewsCount: 62,
        distanceKm: 4.5,
        distanceFormatted: 'A 4.5km de você',
        address: 'Rua Fradique Coutinho, 512 - Pinheiros, São Paulo',
        neighborhood: 'Pinheiros',
        openingHours: 'Seg a Sex • 10h às 19h',
        isOpenNow: true,
        image:
          'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
        specialties: ['Hidratação Profunda', 'Fototerapia Led', 'Depilação a Laser'],
        coordX: 25,
        coordY: 30,
      },
    ];
  }, []);

  // Filtros e Seleção
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<NearbyMapClinic | null>(clinics[0]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [bookingClinicId, setBookingClinicId] = useState<string | null>(null);
  const [navigationToast, setNavigationToast] = useState<string | null>(null);

  // Filtragem dinâmica
  const filteredClinics = useMemo(() => {
    return clinics.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchAddress = c.address.toLowerCase().includes(q);
        const matchSpecialty = c.specialties.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchAddress && !matchSpecialty) return false;
      }
      if (selectedNeighborhood !== 'Todos' && c.neighborhood !== selectedNeighborhood) {
        return false;
      }
      if (onlyOpenNow && !c.isOpenNow) {
        return false;
      }
      return true;
    });
  }, [clinics, searchQuery, selectedNeighborhood, onlyOpenNow]);

  const neighborhoods = ['Todos', 'Jardins', 'Moema', 'Itaim Bibi', 'Pinheiros'];

  const handleOpenGps = (clinic: NearbyMapClinic) => {
    const encoded = encodeURIComponent(clinic.address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    setNavigationToast(`Traçando rota até ${clinic.name}...`);
    setTimeout(() => setNavigationToast(null), 3500);
  };

  return (
    <div className="h-[calc(100vh-4rem)] sm:h-[calc(100vh-4.5rem)] w-full relative bg-[#F4F4F2] overflow-hidden select-none animate-in fade-in duration-500">
      {/* 1. BUSCA FLUTUANTE DE LUXO */}
      <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-xl z-30 space-y-2">
        <div className="bg-white/90 backdrop-blur-xl p-3 sm:p-4 rounded-[28px] shadow-luminous border border-white flex items-center gap-3">
          <Search className="text-aura-taupe shrink-0" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar clínica ou serviço..."
            className="flex-1 bg-transparent outline-none text-xs sm:text-sm font-medium text-aura-charcoal placeholder-aura-taupe"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-aura-taupe hover:text-aura-charcoal p-1 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="p-2 rounded-xl bg-aura-linen/80 text-aura-charcoal hover:bg-aura-linen transition-colors cursor-pointer shrink-0"
            title="Filtros avançados"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* CHIPS RÁPIDOS DE FILTRAGEM */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none px-1">
          {neighborhoods.map((n) => {
            const active = selectedNeighborhood === n;
            return (
              <button
                key={n}
                onClick={() => setSelectedNeighborhood(n)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer border ${
                  active
                    ? 'bg-aura-charcoal text-white border-aura-charcoal shadow-xs'
                    : 'bg-white/85 backdrop-blur-md text-aura-charcoal/70 border-white hover:border-aura-taupe/30'
                }`}
              >
                {n}
              </button>
            );
          })}
          <button
            onClick={() => setOnlyOpenNow(!onlyOpenNow)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer border ${
              onlyOpenNow
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'bg-white/85 backdrop-blur-md text-emerald-800 border-white hover:border-emerald-200'
            }`}
          >
            ● Aberto Agora
          </button>
        </div>
      </div>

      {/* 2. CANVAS DO MAPA DE LUXO (SKIN CARTOGRÁFICA LUMINOUS LUXURY) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Fundo Marmorizado Suave com Ruas e Avenidas Geométricas */}
        <svg
          className="w-full h-full object-cover opacity-70"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="luxury-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#EAE5DF" strokeWidth="0.8" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="#F5F3EF" />
          <rect width="100%" height="100%" fill="url(#luxury-grid)" />

          {/* Área Verde do Parque Ibirapuera */}
          <path
            d="M 180,680 Q 240,620 320,670 T 360,820 T 220,860 Z"
            fill="#E5ECE6"
            stroke="#D6E0D7"
            strokeWidth="1.5"
          />
          <text x="250" y="740" fill="#8B9D8E" fontSize="13" fontWeight="600" letterSpacing="1">
            Parque Ibirapuera
          </text>

          {/* Rio / Espelho D'Água */}
          <path
            d="M 90,0 Q 150,300 110,600 T 80,1000"
            fill="none"
            stroke="#DFE7EA"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Avenidas Principais (Traçado Urbano de Alta Classe) */}
          <path
            d="M 0,220 L 1000,500"
            fill="none"
            stroke="#E4DDD6"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 200,0 L 850,1000"
            fill="none"
            stroke="#E7DFD8"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 0,550 L 1000,320"
            fill="none"
            stroke="#E9E2DB"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 450,100 L 520,900"
            fill="none"
            stroke="#ECE5DE"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Rótulos das Vias Elegantes */}
          <text x="260" y="270" fill="#A89B91" fontSize="11" fontWeight="500" letterSpacing="0.8">
            Av. Paulista
          </text>
          <text x="440" y="440" fill="#A89B91" fontSize="11" fontWeight="500" letterSpacing="0.8">
            Rua Oscar Freire
          </text>
          <text x="650" y="360" fill="#A89B91" fontSize="11" fontWeight="500" letterSpacing="0.8">
            Av. Brigadeiro Faria Lima
          </text>
          <text x="320" y="580" fill="#A89B91" fontSize="11" fontWeight="500" letterSpacing="0.8">
            Av. Rebouças
          </text>
        </svg>

        {/* PONTO DE LOCALIZAÇÃO DO CONSUMIDOR (AUGUSTO) */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{ top: '48%', left: '52%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-aura-rose/60 opacity-75" />
            <div className="relative inline-flex rounded-full h-4 w-4 bg-aura-charcoal border-2 border-white shadow-md" />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[9px] font-bold text-aura-charcoal text-center shadow-xs border border-aura-linen whitespace-nowrap">
            Você está aqui
          </div>
        </div>

        {/* 3. PINOS DAS CLÍNICAS (INTERATIVOS) */}
        {filteredClinics.map((clinic) => {
          const isSelected = selectedClinic?.id === clinic.id;

          return (
            <div
              key={clinic.id}
              onClick={() => setSelectedClinic(clinic)}
              style={{ top: `${clinic.coordY}%`, left: `${clinic.coordX}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-transform duration-300 hover:scale-110"
            >
              <div
                className={`px-3 py-1.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider shadow-xl flex items-center gap-1.5 transition-all duration-300 ${
                  isSelected
                    ? 'bg-aura-charcoal text-white ring-4 ring-aura-rose/40 scale-105'
                    : 'bg-white text-aura-charcoal border border-aura-linen hover:bg-aura-pearl'
                }`}
              >
                <Sparkles
                  size={12}
                  className={isSelected ? 'text-aura-rose fill-aura-rose' : 'text-aura-taupe'}
                />
                <span className="whitespace-nowrap">{clinic.name}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-aura-rose/20 text-aura-charcoal'
                  }`}
                >
                  ★ {clinic.rating}
                </span>
              </div>
              <div
                className={`w-3 h-3 rotate-45 -mt-1.5 mx-auto transition-colors ${
                  isSelected ? 'bg-aura-charcoal' : 'bg-white border-r border-b border-aura-linen'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* NOTIFICAÇÃO TOAST DE GPS */}
      {navigationToast && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 bg-aura-charcoal text-white text-xs px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <Navigation size={14} className="text-aura-rose animate-spin" />
          <span>{navigationToast}</span>
        </div>
      )}

      {/* 4. DRAWER DE DETALHE DA CLÍNICA SELECIONADA */}
      {selectedClinic && (
        <div className="absolute bottom-20 sm:bottom-8 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl z-30 animate-in slide-in-from-bottom-6 duration-300">
          <div className="bg-white/95 backdrop-blur-xl rounded-[36px] p-5 sm:p-6 shadow-2xl border border-white flex flex-col sm:flex-row gap-4 sm:gap-6 relative">
            <button
              onClick={() => setSelectedClinic(null)}
              className="absolute top-4 right-4 text-aura-taupe hover:text-aura-charcoal p-1.5 rounded-full hover:bg-aura-linen transition-colors cursor-pointer"
              aria-label="Fechar detalhes da clínica"
            >
              <X size={18} />
            </button>

            <div className="w-full sm:w-28 h-28 rounded-[24px] overflow-hidden shrink-0 border border-aura-linen">
              <img
                src={selectedClinic.image}
                alt={selectedClinic.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-aura-charcoal font-serif">
                  {selectedClinic.name}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                  {selectedClinic.address}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-bold text-amber-800">
                      {selectedClinic.rating} ({selectedClinic.reviewsCount})
                    </span>
                  </div>
                  <span className="text-[10px] text-aura-taupe font-semibold bg-aura-linen/80 px-2 py-0.5 rounded-lg">
                    {selectedClinic.distanceFormatted}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-lg">
                    {selectedClinic.openingHours}
                  </span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setBookingClinicId(selectedClinic.businessId)}
                  className="flex-1 bg-aura-charcoal hover:bg-black text-white py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar size={14} className="text-aura-rose" />
                  <span>Agendar Agora</span>
                </button>

                <button
                  onClick={() => handleOpenGps(selectedClinic)}
                  className="p-3 bg-aura-rose/20 text-aura-charcoal hover:bg-aura-rose/30 rounded-2xl transition-colors cursor-pointer"
                  title="Abrir rota no GPS / Google Maps"
                  aria-label="Abrir rota no GPS"
                >
                  <Navigation size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL DE FILTROS AVANÇADOS */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[36px] max-w-sm w-full p-6 shadow-2xl border border-aura-linen space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold font-serif text-aura-charcoal">Filtros de Descoberta</h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="text-aura-taupe hover:text-aura-charcoal cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-aura-charcoal block mb-2">
                  Bairro
                </label>
                <div className="flex flex-wrap gap-2">
                  {neighborhoods.map((n) => (
                    <button
                      key={n}
                      onClick={() => setSelectedNeighborhood(n)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border ${
                        selectedNeighborhood === n
                          ? 'bg-aura-charcoal text-white border-aura-charcoal'
                          : 'bg-aura-linen/40 text-aura-charcoal border-aura-linen'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-aura-charcoal block mb-2">
                  Status
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-aura-charcoal">
                  <input
                    type="checkbox"
                    checked={onlyOpenNow}
                    onChange={(e) => setOnlyOpenNow(e.target.checked)}
                    className="rounded text-aura-charcoal focus:ring-0"
                  />
                  <span>Mostrar apenas clínicas abertas agora</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="w-full py-3 bg-aura-charcoal text-white text-xs font-bold uppercase tracking-wider rounded-2xl cursor-pointer"
            >
              Aplicar Filtros ({filteredClinics.length} Clínicas)
            </button>
          </div>
        </div>
      )}

      {/* 6. MODAL DE AGENDAMENTO CONECTADO AO MAPA */}
      {bookingClinicId && (
        <BookingModal
          businessId={bookingClinicId}
          onClose={() => setBookingClinicId(null)}
          onSuccess={() => {
            setBookingClinicId(null);
          }}
        />
      )}
    </div>
  );
};

export default NearbyMap;
