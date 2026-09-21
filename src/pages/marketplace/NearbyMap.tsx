import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Star,
  ChevronRight,
  Search,
  Filter,
  Clock,
  Phone,
  Calendar,
  Store,
  ExternalLink,
  Layers,
  Compass,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Map as MapIcon,
  List
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { useBusiness } from '../../core/BusinessContext';
import { useLayout } from '../../layouts/LayoutContext';
import { Unit } from '../../types';

interface NearbyExplorerProps {
  onBookUnit?: (unit: Unit) => void;
  onViewClinic?: (businessSlug: string) => void;
}

export const NearbyExplorer: React.FC<NearbyExplorerProps> = ({ onBookUnit, onViewClinic }) => {
  const { setPublicProfileSlug } = useBusiness();
  const { setCurrentTab } = useLayout();

  // User simulated/detected coordinates (Jardins, SP as luxury baseline)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: -23.5654,
    lng: -46.6622,
  });
  const [userLocationName, setUserLocationName] = useState<string>('Jardins, São Paulo');
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(10);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('Todos os Bairros');
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('unit-matriz');
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [mobileView, setMobileView] = useState<'both' | 'list' | 'map'>('both');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const unsub = dataService.subscribe(() => setVersion(v => v + 1));
    return unsub;
  }, []);

  const neighborhoods = [
    'Todos os Bairros',
    'Jardins',
    'Itaim Bibi',
    'Moema',
    'Pinheiros',
    'Vila Mariana',
    'Alphaville',
  ];

  const radiusOptions = [
    { value: 1, label: 'Até 1 km' },
    { value: 3, label: 'Até 3 km' },
    { value: 5, label: 'Até 5 km' },
    { value: 10, label: 'Até 10 km' },
    { value: 25, label: 'Região Metropolitana' },
  ];

  // Geolocation detection handler
  const handleDetectGPS = () => {
    setIsDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setUserLocationName('Sua Localização GPS');
          setIsDetectingGps(false);
        },
        () => {
          // Fallback simulation to Jardins
          setTimeout(() => {
            setUserCoords({ lat: -23.5654, lng: -46.6622 });
            setUserLocationName('Jardins, São Paulo (GPS Estimado)');
            setIsDetectingGps(false);
          }, 600);
        },
        { timeout: 5000 }
      );
    } else {
      setTimeout(() => {
        setIsDetectingGps(false);
      }, 500);
    }
  };

  // Units list with real Haversine distance
  const units = useMemo(() => {
    return dataService.getUnitsForMap({
      userLat: userCoords.lat,
      userLng: userCoords.lng,
      maxDistanceKm: selectedRadiusKm,
      neighborhood: selectedNeighborhood,
      search: searchQuery,
    });
  }, [userCoords, selectedRadiusKm, selectedNeighborhood, searchQuery, version]);

  const selectedUnit = useMemo(() => {
    return units.find(u => u.id === selectedUnitId) || units[0];
  }, [units, selectedUnitId]);

  const handleOpenClinicStore = (slug?: string) => {
    const targetSlug = slug || selectedUnit?.businessSlug || 'sublime-estetica';
    if (onViewClinic) {
      onViewClinic(targetSlug);
    } else if (setPublicProfileSlug) {
      setPublicProfileSlug(targetSlug);
      setCurrentTab('vitrine');
    }
  };

  const handleOpenBooking = (unit: Unit) => {
    if (onBookUnit) {
      onBookUnit(unit);
    }
  };

  // Convert real latitude and longitude to SVG coordinates (centered around SP Core)
  // SP Reference bounding box:
  // Lat: -23.48 to -23.64
  // Lng: -46.86 to -46.60
  const getMapCoordinates = (lat?: number, lng?: number) => {
    if (!lat || !lng) return { x: 50, y: 50 };
    const minLat = -23.63;
    const maxLat = -23.49;
    const minLng = -46.86;
    const maxLng = -46.61;

    // Normalização 0 - 100%
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    // Latitude invertida porque o eixo Y do SVG desce para o sul
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(8, Math.min(92, y)),
    };
  };

  const userSvgPos = getMapCoordinates(userCoords.lat, userCoords.lng);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      {/* HEADER & BARRA DE PROXIMIDADE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <span className="text-[11px] text-rose-700 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Compass size={14} className="text-rose-600" />
            Geolocalização & Conveniência de Horários
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-bold mt-1">
            Clínicas próximas a você
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Explore unidades credenciadas por proximidade física e agende sem sair do bairro
          </p>
        </div>

        {/* Indicador de Localização Atual do Usuário */}
        <div className="flex items-center gap-3 bg-white p-2.5 px-4 rounded-2xl border border-stone-200 shadow-xs self-start md:self-auto">
          <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
            <MapPin size={16} />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              Ponto de Referência
            </span>
            <span className="text-xs font-bold text-stone-800">
              {userLocationName}
            </span>
          </div>
          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={isDetectingGps}
            className="ml-2 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
            title="Recalcular distância com base no GPS do seu dispositivo"
          >
            <Navigation size={12} className={isDetectingGps ? 'animate-spin' : ''} />
            <span>{isDetectingGps ? 'Localizando...' : 'Meu GPS'}</span>
          </button>
        </div>
      </div>

      {/* FILTROS DE RAIO, BAIRRO E BUSCA */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/70 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Busca por texto */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar unidade, clínica ou rua..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl border border-stone-200 bg-stone-50/70 focus:bg-white focus:border-rose-600 outline-hidden transition-all"
            />
          </div>

          {/* Seletor de Bairros */}
          <div>
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-2xl border border-stone-200 bg-stone-50/70 focus:bg-white focus:border-rose-600 outline-hidden transition-all font-medium text-stone-700"
            >
              {neighborhoods.map((n) => (
                <option key={n} value={n}>
                  {n === 'Todos os Bairros' ? '📍 Todos os Bairros' : `📍 ${n}`}
                </option>
              ))}
            </select>
          </div>

          {/* Seletor de Raio */}
          <div>
            <select
              value={selectedRadiusKm}
              onChange={(e) => setSelectedRadiusKm(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-2xl border border-stone-200 bg-stone-50/70 focus:bg-white focus:border-rose-600 outline-hidden transition-all font-medium text-stone-700"
            >
              {radiusOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  🧭 Raio: {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Alternância Mobile (Lista vs Mapa) */}
          <div className="flex items-center gap-2 lg:justify-end">
            <button
              type="button"
              onClick={() => setOnlyOpenNow(!onlyOpenNow)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                onlyOpenNow
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Clock size={13} className={onlyOpenNow ? 'text-emerald-600' : 'text-stone-400'} />
              <span>Abertas Agora</span>
            </button>

            {/* Mobile View Toggle Buttons */}
            <div className="flex sm:hidden ml-auto bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                  mobileView === 'list' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
                }`}
              >
                <List size={16} />
              </button>
              <button
                type="button"
                onClick={() => setMobileView('map')}
                className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                  mobileView === 'map' ? 'bg-white shadow-xs text-rose-700' : 'text-stone-500'
                }`}
              >
                <MapIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PAINEL PRINCIPAL: LISTA LATERAL + MAPA INTERATIVO CARTOGRÁFICO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUNA DA ESQUERDA: LISTA DE UNIDADES (5 Colunas no Desktop) */}
        <div
          className={`lg:col-span-5 space-y-4 ${
            mobileView === 'map' ? 'hidden sm:block' : 'block'
          }`}
        >
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {units.length} {units.length === 1 ? 'Unidade encontrada' : 'Unidades encontradas'}
            </span>
            <span className="text-[11px] text-stone-400">
              Ordenadas por distância de você
            </span>
          </div>

          {units.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 text-stone-500 space-y-3">
              <MapPin size={32} className="mx-auto text-stone-300" />
              <h3 className="text-sm font-bold text-stone-700">Nenhuma unidade neste raio</h3>
              <p className="text-xs text-stone-400">
                Tente expandir o raio para 25 km ou selecionar "Todos os Bairros".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedRadiusKm(25);
                  setSelectedNeighborhood('Todos os Bairros');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold cursor-pointer"
              >
                Redefinir Filtros
              </button>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[720px] overflow-y-auto pr-1">
              {units.map((unit) => {
                const isSelected = selectedUnitId === unit.id;
                return (
                  <div
                    key={unit.id}
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer group bg-white ${
                      isSelected
                        ? 'border-rose-700 ring-2 ring-rose-600/20 shadow-md bg-rose-50/15'
                        : 'border-stone-200/70 hover:border-stone-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Foto da Unidade */}
                      <img
                        src={unit.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=300&q=80'}
                        alt={unit.name}
                        className="w-22 h-22 rounded-2xl object-cover border border-stone-200 shrink-0 group-hover:scale-103 transition-transform"
                      />

                      {/* Informações da Unidade */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wide truncate">
                            {unit.businessName || 'Rede Credenciada Aura'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold shrink-0">
                            {unit.distanceKm !== undefined ? `${unit.distanceKm} km` : 'Perto'}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-stone-900 truncate">
                          {unit.name}
                        </h3>

                        <p className="text-[11px] text-stone-500 line-clamp-1 flex items-center gap-1">
                          <MapPin size={11} className="text-stone-400 shrink-0" />
                          <span>{unit.address}</span>
                        </p>

                        <div className="flex items-center gap-3 pt-1 text-[11px] text-stone-600">
                          <span className="flex items-center gap-1 text-amber-600 font-bold">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <span>{unit.rating || 4.95}</span>
                            <span className="text-stone-400 font-normal">({unit.reviewsCount || 82})</span>
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium">
                            {unit.openingHours || 'Aberto até 20:00'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botões de Ação na Unidade */}
                    <div className="flex items-center gap-2 pt-3 mt-3 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenClinicStore(unit.businessSlug);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Store size={13} className="text-stone-500" />
                        <span>Ver Perfil da Loja</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBooking(unit);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Calendar size={13} />
                        <span>Agendar Aqui</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUNA DA DIREITA: MAPA INTERATIVO CARTOGRÁFICO DE LUXO (7 Colunas no Desktop) */}
        <div
          className={`lg:col-span-7 ${
            mobileView === 'list' ? 'hidden sm:block' : 'block'
          }`}
        >
          <div className="bg-[#FAF8F5] rounded-[36px] border border-stone-200 shadow-sm overflow-hidden relative min-h-[640px] flex flex-col">
            {/* Barra superior de ferramentas do mapa */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-200/80 shadow-xs pointer-events-auto flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-stone-800">
                  Radar Aura Ativo • São Paulo & Região
                </span>
              </div>

              {/* Botões de Zoom */}
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-stone-200/80 shadow-xs pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setMapZoom(z => Math.min(1.4, z + 0.1))}
                  className="p-1.5 text-stone-700 hover:bg-stone-100 rounded-xl cursor-pointer"
                  title="Aproximar"
                >
                  <ZoomIn size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setMapZoom(z => Math.max(0.8, z - 0.1))}
                  className="p-1.5 text-stone-700 hover:bg-stone-100 rounded-xl cursor-pointer"
                  title="Afastar"
                >
                  <ZoomOut size={15} />
                </button>
              </div>
            </div>

            {/* VETOR CARTOGRÁFICO DA CIDADE COM ESTILO EDITORIAL */}
            <div
              className="relative w-full h-[640px] overflow-hidden select-none transition-transform duration-300"
              style={{ transform: `scale(${mapZoom})`, transformOrigin: 'center center' }}
            >
              {/* SVG Background com Malha Urbana e Vias Principais */}
              <svg className="w-full h-full absolute inset-0" xmlns="http://www.w3.org/2000/svg">
                {/* Malha de fundo sofisticada */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F0ECE4" strokeWidth="0.8" />
                  </pattern>
                  <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E2EBE9" />
                    <stop offset="100%" stopColor="#D5E4E1" />
                  </linearGradient>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Rio Pinheiros / Rio Tietê (Curvas suaves) */}
                <path
                  d="M 10 120 Q 30 180, 18 320 T 45 640"
                  fill="none"
                  stroke="url(#riverGrad)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 80 Q 250 110, 600 70"
                  fill="none"
                  stroke="url(#riverGrad)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />

                {/* Parque do Ibirapuera (Área Verde) */}
                <rect x="58%" y="54%" width="90" height="70" rx="20" fill="#EBF2EA" />
                <text x="61%" y="60%" fill="#7E9F7B" fontSize="10" fontWeight="bold">
                  Parque Ibirapuera
                </text>

                {/* Vias Expressas (Av. Paulista, Rebouças, Faria Lima, Moema) */}
                {/* Av. Paulista */}
                <line x1="45%" y1="32%" x2="80%" y2="40%" stroke="#E5D9C8" strokeWidth="6" strokeLinecap="round" />
                <text x="56%" y="34%" fill="#B8A48F" fontSize="9" fontWeight="bold" transform="rotate(11 320, 210)">
                  AV. PAULISTA
                </text>

                {/* Av. Brig. Faria Lima */}
                <line x1="38%" y1="36%" x2="52%" y2="62%" stroke="#E5D9C8" strokeWidth="5" strokeLinecap="round" />
                <text x="44%" y="48%" fill="#B8A48F" fontSize="9" fontWeight="bold" transform="rotate(62 250, 310)">
                  AV. FARIA LIMA
                </text>

                {/* Al. Santos / Jardins */}
                <line x1="48%" y1="35%" x2="78%" y2="43%" stroke="#EAE0D3" strokeWidth="3" strokeDasharray="6,4" />

                {/* Av. Rebouças */}
                <line x1="32%" y1="28%" x2="48%" y2="38%" stroke="#E5D9C8" strokeWidth="4" />

                {/* Av. Moema / Ibirapuera */}
                <line x1="55%" y1="58%" x2="68%" y2="82%" stroke="#E5D9C8" strokeWidth="4" />
                <text x="63%" y="72%" fill="#B8A48F" fontSize="8" fontWeight="bold">
                  AV. IBIRAPUERA
                </text>

                {/* Rod. Castelo Branco (Direção Alphaville) */}
                <line x1="5%" y1="18%" x2="35%" y2="22%" stroke="#E5D9C8" strokeWidth="4" />
                <text x="12%" y="16%" fill="#B8A48F" fontSize="9" fontWeight="bold">
                  ALPHAVILLE
                </text>
              </svg>

              {/* PONTO DO USUÁRIO ("VOCÊ ESTÁ AQUI") COM RADAR ANIMADO */}
              <div
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 pointer-events-none"
                style={{ left: `${userSvgPos.x}%`, top: `${userSvgPos.y}%` }}
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-12 h-12 rounded-full bg-blue-500/20 animate-ping" />
                  <span className="absolute w-7 h-7 rounded-full bg-blue-500/30" />
                  <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md relative z-10" />
                  <div className="absolute top-5 whitespace-nowrap bg-stone-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    Você está aqui
                  </div>
                </div>
              </div>

              {/* PINOS DAS UNIDADES NO MAPA */}
              {units.map((unit) => {
                const pos = getMapCoordinates(unit.latitude, unit.longitude);
                const isSelected = selectedUnitId === unit.id;

                return (
                  <div
                    key={unit.id}
                    onClick={() => setSelectedUnitId(unit.id)}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  >
                    <div className="relative group flex flex-col items-center">
                      {/* Badge do Pino */}
                      <div
                        className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border transition-all ${
                          isSelected
                            ? 'bg-rose-700 text-white border-rose-800 scale-110 shadow-lg ring-4 ring-rose-600/20'
                            : 'bg-white text-stone-900 border-stone-200/90 hover:scale-105'
                        }`}
                      >
                        <MapPin
                          size={13}
                          className={isSelected ? 'text-white' : 'text-rose-700'}
                        />
                        <span className="text-[11px] font-bold whitespace-nowrap max-w-[130px] truncate">
                          {unit.name.replace('Aura Unidade ', '')}
                        </span>
                        <span className="text-[10px] opacity-80">
                          {unit.distanceKm}km
                        </span>
                      </div>

                      {/* Ponta do Pino */}
                      <div
                        className={`w-2 h-2 rotate-45 -mt-1 ${
                          isSelected ? 'bg-rose-700' : 'bg-white border-r border-b border-stone-200'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* POPUP SUSPENSO DA UNIDADE SELECIONADA */}
            {selectedUnit && (
              <div className="absolute bottom-5 left-5 right-5 z-30 animate-in slide-in-from-bottom-4 duration-300">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={selectedUnit.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=300&q=80'}
                      alt={selectedUnit.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wide">
                          {selectedUnit.businessName}
                        </span>
                        <span className="px-2 py-0.2 rounded-full bg-rose-50 text-rose-800 text-[10px] font-semibold">
                          A {selectedUnit.distanceKm} km de você
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-stone-900 truncate">
                        {selectedUnit.name}
                      </h4>
                      <p className="text-xs text-stone-500 truncate flex items-center gap-1 mt-0.5">
                        <Clock size={11} className="text-stone-400" />
                        <span>{selectedUnit.openingHours || 'Aberto até 20:00'}</span>
                        <span>•</span>
                        <span>{selectedUnit.phone || '(11) 98765-4321'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Ações da Unidade */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenClinicStore(selectedUnit.businessSlug)}
                      className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Store size={14} />
                      <span>Ver Perfil</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenBooking(selectedUnit)}
                      className="px-5 py-2.5 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md hover:scale-102"
                    >
                      <Calendar size={14} />
                      <span>Agendar Agora</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NearbyMap = NearbyExplorer;
