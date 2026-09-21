// src/modules/marketplace/NearbyExplorer.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Star,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
  Compass,
  CheckCircle2,
  Phone,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  LogIn
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../core/BusinessContext';
import { useLayout } from '../../layouts/LayoutContext';
import { Unit } from '../../types';

interface NearbyExplorerProps {
  onBookUnit?: (unit: Unit) => void;
  onViewClinic?: (businessSlug: string) => void;
}

export const NearbyExplorer: React.FC<NearbyExplorerProps> = ({ onBookUnit, onViewClinic }) => {
  const { userProfile, isAuthenticated, login } = useAuth();
  const { setPublicProfileSlug } = useBusiness();
  const { setCurrentTab } = useLayout();

  // 1. Estado de Localização do Usuário (Jardins, SP como ponto de referência de luxo)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: -23.5654,
    lng: -46.6622,
  });
  const [userLocationName, setUserLocationName] = useState<string>('Jardins, São Paulo');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsNotification, setGpsNotification] = useState<string | null>(null);

  // 2. Filtros e Busca
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(20);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('Todos os Bairros');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('unit-matriz');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [version, setVersion] = useState(0);

  // Tags Rápidas de Descoberta
  const quickTags = ['Aberto Agora', 'Mais Bem Avaliados', 'Limpeza de Pele', 'Laser'];

  // Bairros disponíveis
  const neighborhoods = [
    'Todos os Bairros',
    'Jardins',
    'Itaim Bibi',
    'Moema',
    'Pinheiros',
    'Vila Mariana',
  ];

  // Escuta alterações de dados no dataService
  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setVersion(v => v + 1);
    });
    return unsub;
  }, []);

  // 3. Geolocalização Real / GPS (Privacidade: Apenas em memória, nunca persistida)
  const handleDetectGPS = () => {
    setIsDetectingGps(true);
    setGpsNotification('Acessando satélite GPS...');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;
          setUserCoords({ lat: newLat, lng: newLng });
          setUserLocationName('Sua Localização GPS');
          setIsDetectingGps(false);
          setGpsNotification('Distâncias recalculadas com precisão!');
          setTimeout(() => setGpsNotification(null), 3000);
        },
        () => {
          // Fallback elegante (São Paulo - Jardins)
          setTimeout(() => {
            setUserCoords({ lat: -23.5654, lng: -46.6622 });
            setUserLocationName('Jardins, SP (GPS Estimado)');
            setIsDetectingGps(false);
            setGpsNotification('Localização ajustada para Jardins, SP');
            setTimeout(() => setGpsNotification(null), 3000);
          }, 800);
        },
        { timeout: 6000, enableHighAccuracy: true }
      );
    } else {
      setTimeout(() => {
        setIsDetectingGps(false);
        setGpsNotification('GPS indisponível no navegador');
        setTimeout(() => setGpsNotification(null), 2500);
      }, 500);
    }
  };

  // 4. Lógica de Distância & Bypass de Unidade (Transversal a todas as clínicas ativas)
  const units = useMemo(() => {
    let effectiveSearch = searchQuery.trim();
    if (selectedTag === 'Limpeza de Pele') {
      effectiveSearch = effectiveSearch ? `${effectiveSearch} limpeza pele` : 'pele';
    } else if (selectedTag === 'Laser') {
      effectiveSearch = effectiveSearch ? `${effectiveSearch} laser` : 'laser';
    }

    const fetched = dataService.getUnitsForMap({
      userLat: userCoords.lat,
      userLng: userCoords.lng,
      maxDistanceKm: selectedRadiusKm,
      neighborhood: selectedNeighborhood,
      search: effectiveSearch,
    });

    if (selectedTag === 'Aberto Agora') {
      return fetched.filter(u => u.openingHours?.toLowerCase().includes('aberto'));
    }

    if (selectedTag === 'Mais Bem Avaliados') {
      return [...fetched].sort((a, b) => (b.rating ?? 5) - (a.rating ?? 5));
    }

    return fetched;
  }, [userCoords, selectedRadiusKm, selectedNeighborhood, searchQuery, selectedTag, version]);

  // Unidade Selecionada
  const selectedUnit = useMemo(() => {
    return units.find(u => u.id === selectedUnitId) || units[0];
  }, [units, selectedUnitId]);

  // Garantir que a unidade selecionada seja atualizada caso os filtros mudem
  useEffect(() => {
    if (units.length > 0 && !units.some(u => u.id === selectedUnitId)) {
      setSelectedUnitId(units[0].id);
    }
  }, [units, selectedUnitId]);

  // Ações de Navegação
  const handleOpenClinicProfile = (businessSlug?: string) => {
    const targetSlug = businessSlug || selectedUnit?.businessSlug || 'sublime-estetica';
    if (onViewClinic) {
      onViewClinic(targetSlug);
    } else if (setPublicProfileSlug) {
      setPublicProfileSlug(targetSlug);
      setCurrentTab('vitrine');
    }
  };

  // Experiência de Login Oculto e Segurança:
  // Se for visitante não autenticado, solicita identificação antes de agendar
  const handleBookingClick = (unit: Unit) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (onBookUnit) {
      onBookUnit(unit);
    } else {
      handleOpenClinicProfile(unit.businessSlug);
    }
  };

  // Abrir Rota no Google Maps ou Waze
  const handleOpenExternalNavigation = (unit?: Unit) => {
    const target = unit || selectedUnit;
    if (!target) return;
    const dest = target.latitude && target.longitude
      ? `${target.latitude},${target.longitude}`
      : encodeURIComponent(`${target.name} ${target.address}`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank', 'noopener,noreferrer');
  };

  // Conversão de Latitude/Longitude para Coordenadas do Canvas SVG
  // Sistema de Projeção Geográfica Minimalist Silver (Área Metropolitana de São Paulo Core)
  const getSvgCoordinates = (lat?: number, lng?: number) => {
    if (!lat || !lng) return { x: 50, y: 50 };
    const minLat = -23.635;
    const maxLat = -23.535;
    const minLng = -46.735;
    const maxLng = -46.615;

    // Interpolação normalizada (10% a 90% para margem)
    const normalizedX = ((lng - minLng) / (maxLng - minLng)) * 80 + 10;
    const normalizedY = ((maxLat - lat) / (maxLat - minLat)) * 80 + 10;

    return {
      x: Math.max(12, Math.min(88, normalizedX)),
      y: Math.max(15, Math.min(85, normalizedY)),
    };
  };

  const userSvgPos = getSvgCoordinates(userCoords.lat, userCoords.lng);

  // Formatação de distância amigável
  const formatDistance = (distKm?: number) => {
    if (distKm === undefined) return 'Próxima a você';
    if (distKm < 1) {
      return `A ${Math.round(distKm * 1000)}m de você`;
    }
    return `A ${distKm.toFixed(1)} km de você`;
  };

  // Fallback para fotos arquitetônicas de clínicas premium
  const getUnitPhoto = (unit?: Unit) => {
    if (unit?.imageUrl && !unit.imageUrl.includes('placeholder')) {
      return unit.imageUrl;
    }
    const clinicPhotos = [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    ];
    return clinicPhotos[0];
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full bg-[#F4F4F2] overflow-hidden text-aura-charcoal select-none font-sans">

      {/* 1. BUSCA E FILTROS FLUTUANTES (Top Layer) */}
      <div className="absolute top-5 left-0 right-0 z-30 px-4 sm:px-6 space-y-3 pointer-events-none">
        <div className="max-w-xl mx-auto flex gap-3 pointer-events-auto">
          {/* Campo de Busca Flutuante com Efeito Luminous Luxury */}
          <div className="flex-1 bg-white/85 backdrop-blur-xl rounded-[24px] border border-aura-linen shadow-luminous flex items-center px-5 py-3.5 transition-all focus-within:ring-2 focus-within:ring-aura-rose/40">
            <Search size={18} className="text-aura-taupe mr-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar clínica, procedimento ou endereço..."
              className="bg-transparent text-xs sm:text-sm text-aura-charcoal placeholder:text-aura-charcoal/40 outline-hidden w-full font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-aura-taupe hover:text-aura-charcoal p-1 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Botão de Filtros Avançados */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={`bg-white/85 backdrop-blur-xl p-3.5 sm:p-4 rounded-[24px] border shadow-luminous text-aura-charcoal hover:scale-105 active:scale-95 transition-all cursor-pointer ${
              selectedRadiusKm !== 20 || selectedNeighborhood !== 'Todos os Bairros'
                ? 'border-aura-rose text-aura-charcoal bg-aura-rose/20'
                : 'border-aura-linen'
            }`}
            title="Filtros de raio e bairros"
          >
            <SlidersHorizontal size={19} />
          </button>
        </div>

        {/* Tags de Categoria Rápida no Mapa (Scroll Horizontal Suave) */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-xl mx-auto px-1 pointer-events-auto pb-1">
          {quickTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap shadow-xs transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-aura-charcoal text-white shadow-md scale-102 ring-2 ring-aura-rose/50'
                    : 'bg-white/90 backdrop-blur-md border border-aura-linen text-aura-charcoal hover:bg-white'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Notificação Temporária de GPS / Status */}
        {gpsNotification && (
          <div className="max-w-md mx-auto pointer-events-auto">
            <div className="bg-aura-charcoal/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-[11px] font-medium shadow-xl flex items-center justify-center gap-2 border border-white/10 animate-in fade-in zoom-in-95">
              <Sparkles size={13} className="text-aura-gold" />
              <span>{gpsNotification}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. ÁREA DO MAPA (Estilo 'Minimalist Silver' & Luminous Luxury) */}
      <div className="absolute inset-0 bg-[#F4F4F2]">
        {/* SVG Cartográfico Vetorial com Design Minimalist Silver */}
        <svg
          className="w-full h-full object-cover select-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradientes Suaves de Relevo e Vias */}
            <linearGradient id="silverRiverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E5E8EC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#DEE2E8" stopOpacity="0.9" />
            </linearGradient>
            <radialGradient id="luminousAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C5A059" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Mancha Urbana & Zonas Verdes Geométricas Minimalistas (Parque do Ibirapuera, Trianon, etc.) */}
          <rect x="0" y="0" width="100" height="100" fill="#F4F4F2" />
          
          {/* Vias e Avenidas Principais (Traçado Minimalista Prateado) */}
          <g stroke="#EAEAE7" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M-10,30 Q45,35 110,25" />
            <path d="M-10,65 Q50,60 110,75" />
            <path d="M25,-10 Q30,50 35,110" />
            <path d="M70,-10 Q65,45 80,110" />
          </g>

          <g stroke="#E0E0DC" strokeWidth="1.2" fill="none" strokeLinecap="round">
            <path d="M-5,15 L105,10" />
            <path d="M-5,48 L105,52" />
            <path d="M-5,85 L105,82" />
            <path d="M12,-5 L15,105" />
            <path d="M50,-5 L48,105" />
            <path d="M88,-5 L85,105" />
            <path d="M5,95 L95,5" strokeDasharray="1 3" strokeWidth="0.8" />
            <path d="M15,5 L95,95" strokeDasharray="1 3" strokeWidth="0.8" />
          </g>

          {/* Áreas Verdes / Parques de Luxo (Contorno Geométrico Discreto) */}
          <path
            d="M 55,62 C 60,60 68,64 72,70 C 75,76 70,82 64,84 C 58,85 54,78 52,72 Z"
            fill="#EBEFEA"
            stroke="#DFE5DE"
            strokeWidth="0.5"
          />
          <path
            d="M 28,32 C 32,30 36,32 38,36 C 40,40 37,44 33,45 C 29,45 26,42 26,37 Z"
            fill="#ECEEEA"
            stroke="#E1E5E0"
            strokeWidth="0.5"
          />

          {/* Rio / Espelho d'Água (Linha Fluida Suave) */}
          <path
            d="M 12,-5 C 10,25 22,50 18,75 C 15,95 20,105 22,110"
            fill="none"
            stroke="url(#silverRiverGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Anel de Proximidade (20km / 10km a partir da posição do usuário) */}
          <circle
            cx={userSvgPos.x}
            cy={userSvgPos.y}
            r="16"
            fill="url(#luminousAura)"
            stroke="#C5A059"
            strokeWidth="0.4"
            strokeDasharray="2 2"
            opacity="0.6"
          />
        </svg>

        {/* 2.1 PONTO DO USUÁRIO NO MAPA ("Você está aqui") */}
        <div
          style={{
            left: `${userSvgPos.x}%`,
            top: `${userSvgPos.y}%`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-aura-charcoal/10 animate-ping absolute" />
            <div className="w-4 h-4 rounded-full bg-aura-charcoal border-2 border-white shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <div className="absolute top-5 bg-white/90 backdrop-blur-xs text-[9px] font-bold text-aura-charcoal px-2 py-0.5 rounded-md shadow-xs border border-aura-linen whitespace-nowrap">
              Você
            </div>
          </div>
        </div>

        {/* 2.2 PINOS INTERATIVOS DAS CLÍNICAS AURA */}
        {units.map((unit) => {
          const isSelected = selectedUnit?.id === unit.id;
          const pos = getSvgCoordinates(unit.latitude, unit.longitude);
          const shortName = unit.name.replace('Aura Unidade ', '').replace('(Matriz)', '').trim();

          return (
            <div
              key={unit.id}
              onClick={() => setSelectedUnitId(unit.id)}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                isSelected ? 'z-30 scale-110' : 'z-20 hover:scale-105 opacity-95 hover:opacity-100'
              }`}
            >
              {isSelected ? (
                /* PINO PERSONALIZADO SELECIONADO (Conforme Especificação de UX Aura) */
                <div className="flex flex-col items-center group">
                  <div className="bg-aura-charcoal text-white px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-2xl animate-bounce flex items-center gap-1.5 whitespace-nowrap border border-white/20">
                    <Sparkles size={11} className="text-aura-rose" />
                    <span>{unit.name}</span>
                  </div>
                  <div className="w-3 h-3 bg-aura-charcoal rotate-45 -mt-1.5 shadow-md" />
                  <div className="w-10 h-10 bg-aura-rose/40 rounded-full animate-ping -mt-4 pointer-events-none" />
                </div>
              ) : (
                /* PINO RESUMIDO DISCRETO E ELEGANTE */
                <div className="flex flex-col items-center group">
                  <div className="bg-white/95 backdrop-blur-md text-aura-charcoal border border-aura-linen px-3 py-1.5 rounded-2xl text-[10px] font-bold tracking-tight shadow-md flex items-center gap-1.5 group-hover:border-aura-taupe group-hover:shadow-lg transition-all whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-aura-gold shrink-0" />
                    <span>{shortName}</span>
                    <span className="text-aura-taupe text-[9px] font-normal">
                      • {unit.distanceKm !== undefined ? `${unit.distanceKm.toFixed(1)}km` : ''}
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-white rotate-45 -mt-1 border-r border-b border-aura-linen" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. CARD DE DETALHE DA UNIDADE (Bottom Drawer Style) */}
      {selectedUnit && (
        <div className="absolute bottom-6 sm:bottom-8 left-4 sm:left-6 right-4 sm:right-6 z-40 lg:max-w-md lg:left-1/2 lg:-translate-x-1/2 animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[40px] p-5 sm:p-6 shadow-2xl border border-white flex gap-4 sm:gap-6 group">
            {/* Foto da Unidade com Aspecto de Revista */}
            <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-[28px] overflow-hidden shrink-0 shadow-lg bg-aura-linen relative">
              <img
                src={getUnitPhoto(selectedUnit)}
                alt={selectedUnit.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {/* Informações da Unidade */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-aura-charcoal leading-tight truncate">
                    {selectedUnit.name}
                  </h3>
                  {/* Badge de Avaliação */}
                  <div className="flex items-center gap-1 bg-aura-rose/15 px-2.5 py-0.5 rounded-full shrink-0">
                    <Star size={11} className="text-aura-charcoal fill-aura-charcoal" />
                    <span className="text-[10px] font-bold text-aura-charcoal">
                      {selectedUnit.rating ? selectedUnit.rating.toFixed(1) : '4.9'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-aura-taupe mt-1 truncate">
                  {formatDistance(selectedUnit.distanceKm)} • {selectedUnit.address.split('-')[0] || selectedUnit.address}
                </p>

                <div className="flex items-center gap-3 text-[10px] text-aura-charcoal/60 mt-1.5 font-medium">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <Clock size={11} />
                    {selectedUnit.openingHours || 'Aberto hoje até 20:00'}
                  </span>
                </div>
              </div>

              {/* Botões de Ação Direta */}
              <div className="flex gap-2 pt-2">
                {/* Ver Perfil / Vitrine da Clínica */}
                <button
                  type="button"
                  onClick={() => handleOpenClinicProfile(selectedUnit.businessSlug)}
                  className="flex-1 bg-aura-charcoal text-white py-3 px-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black active:scale-98 transition-all cursor-pointer truncate text-center"
                >
                  Ver Perfil
                </button>

                {/* Agendar Procedimento (com Login Oculto para Visitantes) */}
                <button
                  type="button"
                  onClick={() => handleBookingClick(selectedUnit)}
                  className="px-4 py-3 bg-aura-rose text-aura-charcoal rounded-2xl text-[10px] font-bold uppercase tracking-wider hover:bg-aura-rose/80 active:scale-98 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  title="Agendar horário nesta unidade"
                >
                  <Calendar size={13} />
                  <span>Agendar</span>
                </button>

                {/* Rota / Navegação GPS Externa */}
                <button
                  type="button"
                  onClick={() => handleOpenExternalNavigation(selectedUnit)}
                  className="p-3 bg-white text-aura-charcoal rounded-2xl border border-aura-linen hover:bg-aura-linen transition-all cursor-pointer shrink-0"
                  title="Abrir rota no mapa"
                >
                  <Navigation size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BOTÃO 'ME LOCALIZAR' (GPS Geocoding / Haversine) */}
      <button
        type="button"
        onClick={handleDetectGPS}
        disabled={isDetectingGps}
        className="absolute bottom-40 sm:bottom-44 right-4 sm:right-6 z-40 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-xl border border-aura-linen text-aura-charcoal hover:bg-aura-rose hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Localizar meu dispositivo e atualizar distâncias"
      >
        <Navigation size={19} className={isDetectingGps ? 'animate-spin text-aura-rose' : ''} />
      </button>

      {/* 5. MODAL DE FILTROS AVANÇADOS (SlidersHorizontal) */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[36px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-aura-linen space-y-6">
            <div className="flex justify-between items-center border-b border-aura-linen pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-aura-charcoal" />
                <h3 className="text-base font-bold text-aura-charcoal uppercase tracking-wider">
                  Filtros de Proximidade
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-aura-linen flex items-center justify-center text-aura-charcoal hover:bg-aura-charcoal hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Raio Máximo de Deslocamento */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-aura-charcoal">
                <span>Raio Máximo</span>
                <span className="text-aura-taupe">{selectedRadiusKm} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={selectedRadiusKm}
                onChange={(e) => setSelectedRadiusKm(Number(e.target.value))}
                className="w-full accent-aura-charcoal cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-aura-charcoal/50 font-medium">
                <span>1 km (A pé)</span>
                <span>10 km</span>
                <span>30 km (Região Metropolitana)</span>
              </div>
            </div>

            {/* Bairro Selecionado */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-aura-charcoal block">Bairro de Preferência</label>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full bg-aura-linen/60 border border-aura-linen rounded-2xl px-4 py-3 text-xs text-aura-charcoal font-medium outline-hidden focus:border-aura-taupe transition-colors"
              >
                {neighborhoods.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRadiusKm(20);
                  setSelectedNeighborhood('Todos os Bairros');
                  setSelectedTag(null);
                  setSearchQuery('');
                  setIsFilterModalOpen(false);
                }}
                className="flex-1 py-3 rounded-2xl border border-aura-linen text-xs font-bold text-aura-charcoal/70 hover:bg-aura-linen transition-colors cursor-pointer"
              >
                Limpar Filtros
              </button>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 py-3 rounded-2xl bg-aura-charcoal text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer shadow-md"
              >
                Aplicar ({units.length} clínicas)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL DE LOGIN OCULTO / PORTAL DE ACESSO AURA (Para Visitantes) */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-aura-linen text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-aura-linen text-aura-charcoal flex items-center justify-center mx-auto border border-aura-rose/30">
              <ShieldCheck size={26} className="text-aura-charcoal" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-lg text-aura-charcoal">
                Portal de Acesso Aura
              </h3>
              <p className="text-xs text-aura-charcoal/70 leading-relaxed">
                Você está navegando como visitante. Para concluir seu agendamento na unidade{' '}
                <strong>{selectedUnit.name}</strong> e salvar suas preferências, acesse sua conta.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  login('CLIENT', {
                    name: 'Cliente Aura Convidada',
                    email: 'cliente@aura.com',
                    phone: '(11) 98765-4321',
                  });
                  setIsLoginModalOpen(false);
                  if (onBookUnit) onBookUnit(selectedUnit);
                }}
                className="w-full py-3.5 bg-aura-charcoal text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <LogIn size={15} />
                <span>Entrar no Aura App</span>
              </button>

              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="w-full py-2.5 text-xs text-aura-taupe hover:text-aura-charcoal font-medium cursor-pointer"
              >
                Continuar navegando no mapa
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NearbyExplorer;
