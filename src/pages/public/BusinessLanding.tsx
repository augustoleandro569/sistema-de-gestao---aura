// src/pages/public/BusinessLanding.tsx
import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Phone,
  Instagram,
  Clock,
  Star,
  ChevronRight,
  MessageCircle,
  Sparkles,
  Calendar,
  CheckCircle2,
  Share2,
  X,
  ArrowLeft,
  ShieldCheck,
  Award,
  AlertCircle,
  ExternalLink,
  Lock,
  UserCheck
} from 'lucide-react';
import { useBusiness } from '../../core/BusinessContext';
import { useAuth } from '../../context/AuthContext';
import { useLayout } from '../../layouts/LayoutContext';
import { dataService } from '../../services/dataService';
import { Business, Service, Professional } from '../../types';

export interface BusinessLandingProps {
  business?: Business;
  businessSlug?: string;
  onBackToApp?: () => void;
  onNavigateToClientPortal?: () => void;
}

export const BusinessLanding: React.FC<BusinessLandingProps> = ({
  business: propBusiness,
  businessSlug,
  onBackToApp,
  onNavigateToClientPortal,
}) => {
  const {
    currentBusiness,
    getBusinessBySlug,
    publicProfileSlug,
    setPublicProfileSlug,
    businessModulesMap,
    isSuperAdminMode,
  } = useBusiness();

  const { isAuthenticated, userProfile, registerWithCpf } = useAuth();
  const layout = useLayout();

  // 1. Resolução do Tenant / Estabelecimento
  const effectiveSlug = businessSlug || publicProfileSlug || propBusiness?.slug || currentBusiness?.slug || 'studio-bella';
  const resolvedBusiness = propBusiness || getBusinessBySlug(effectiveSlug) || currentBusiness;

  const business = resolvedBusiness || {
    id: 'biz-default',
    name: 'Studio Bella Visage',
    slug: 'studio-bella',
    city: 'São Paulo',
    address: 'Rua Oscar Freire, 920 - Cerqueira César, São Paulo - SP',
    phone: '(11) 97123-4567',
    whatsapp: '5511971234567',
    instagram: '@bellavisage.studio',
    rating: 4.9,
    reviewsCount: 120,
    cover: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=80',
    cover_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=80',
    logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80',
    logo_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80',
    primary_color: '#B88746',
    white_label_enabled: false,
    status: 'active',
    plan_type: 'pro',
  };

  // Normalização de cover e logo
  const coverUrl =
    business.cover_url ||
    business.cover ||
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=80';
  const logoUrl =
    business.logo_url ||
    business.logo ||
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80';

  // 2. Verificação de Acesso ao Módulo Vitrine
  const activeModules = businessModulesMap[business.id] || ['appointments', 'vitrine'];
  const hasVitrineModule = activeModules.includes('vitrine') || isSuperAdminMode || userProfile?.role === 'PLATFORM_ADMIN';
  const isSuspended = business.status === 'suspended' && userProfile?.role !== 'PLATFORM_ADMIN';

  // 3. Integração com as Abas do SaaS (Serviços, Conteúdos/Portfólio, Unidades, Branding)
  // Aba Serviços: Espelho dos procedimentos cadastrados
  const servicesList: Service[] = useMemo(() => {
    if (business.services && business.services.length > 0) {
      return business.services;
    }
    const all = dataService.getServices();
    return all.filter((s) => s.status === 'ativo').slice(0, 8);
  }, [business.services]);

  // Aba Conteúdos: Fotos de Antes & Depois publicadas
  const portfolioList = useMemo(() => {
    if (business.portfolio && business.portfolio.length > 0) {
      return business.portfolio;
    }
    const posts = dataService.getContentPosts({ status: 'published' });
    const withImages = posts.filter((p) => p.imageUrl || p.image_url);
    if (withImages.length > 0) {
      return withImages.slice(0, 6).map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        image_url: p.imageUrl || p.image_url,
        category: p.category,
      }));
    }
    // Fallback de alta qualidade para o Luxo Silencioso
    return [
      {
        id: 'port-1',
        title: 'Harmonização Full Face',
        image_url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80',
        category: 'Facial',
      },
      {
        id: 'port-2',
        title: 'Microblading Fio a Fio',
        image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        category: 'Sobrancelhas',
      },
      {
        id: 'port-3',
        title: 'Glow Skin Peeling',
        image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        category: 'Pele & Glow',
      },
      {
        id: 'port-4',
        title: 'Extensão de Cílios Soft Volume',
        image_url: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=800&q=80',
        category: 'Olhar',
      },
    ];
  }, [business.portfolio]);

  // Aba Unidades: Endereço e Horários
  const units = useMemo(() => dataService.getUnits(), []);
  const primaryUnit = units[0];
  const formattedAddress = business.address || primaryUnit?.address || 'Alameda Santos, 1893 - Jardins, São Paulo - SP';

  // Aba Branding: Cor primária dinâmica se tiver módulo contratado
  const brandColor = business.white_label_enabled && business.primary_color ? business.primary_color : '#2D2725';
  const accentColor = business.primary_color || '#B88746';

  // 4. Estados do Fluxo de Agendamento Online
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState<string>('14:00');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Dados do visitante / pré-cadastro simplificado
  const [guestName, setGuestName] = useState('');
  const [guestCpf, setGuestCpf] = useState('');
  const [guestWhatsapp, setGuestWhatsapp] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const professionals = useMemo(() => dataService.getProfessionals().filter((p) => p.status === 'ativo'), []);

  // Abrir Modal com Serviço pré-selecionado
  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    if (professionals.length > 0) {
      setSelectedProfessional(professionals[0]);
    }
    setBookingError(null);
    setBookingSuccess(false);
    setBookingModalOpen(true);
  };

  // Abrir Modal genérico
  const handleOpenGeneralBooking = () => {
    if (servicesList.length > 0 && !selectedService) {
      setSelectedService(servicesList[0]);
    }
    if (professionals.length > 0 && !selectedProfessional) {
      setSelectedProfessional(professionals[0]);
    }
    setBookingError(null);
    setBookingSuccess(false);
    setBookingModalOpen(true);
  };

  // Confirmar Agendamento e Salvar no Sistema
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) {
      setBookingError('Selecione um procedimento para continuar.');
      return;
    }

    let targetClientId = userProfile?.clientId;

    // Se o cliente não estiver logado, valida pré-cadastro sem fricção
    if (!targetClientId) {
      if (!guestName.trim() || !guestCpf.trim() || !guestWhatsapp.trim()) {
        setBookingError('Por favor informe Nome, CPF e WhatsApp para assegurar sua reserva.');
        return;
      }

      // Registro rápido na base de dados
      const reg = registerWithCpf({
        name: guestName.trim(),
        cpf: guestCpf.trim(),
        whatsapp: guestWhatsapp.trim(),
        email: guestEmail.trim() || `${guestCpf.replace(/\D/g, '')}@cliente.aura.com`,
      });

      if (reg.profile?.clientId) {
        targetClientId = reg.profile.clientId;
      } else {
        const newClient = dataService.addClient({
          name: guestName.trim(),
          cpf: guestCpf.trim(),
          phone: guestWhatsapp.trim(),
          whatsapp: guestWhatsapp.trim(),
          email: guestEmail.trim(),
          registrationCompleted: true,
        });
        targetClientId = newClient.id;
      }
    }

    const prof = selectedProfessional || professionals[0];
    const res = dataService.addAppointment({
      clientId: targetClientId,
      serviceId: selectedService.id,
      professionalId: prof?.id || 'prof-1',
      date: bookingDate,
      startTime: bookingTime,
      paymentMethod: 'pix',
      notes: `Agendado via Vitrine Pública Oficial (${business.name})`,
    });

    if (res.success) {
      setBookingSuccess(true);
      setBookingError(null);
    } else {
      setBookingError(res.error || 'Não foi possível processar o horário. Tente outro intervalo.');
    }
  };

  // Copiar Link Exclusivo da Vitrine
  const handleCopyLink = () => {
    const url = `${window.location.origin}/perfil/${business.slug}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Abrir WhatsApp da Clínica com mensagem
  const handleOpenWhatsApp = () => {
    const phoneDigits = (business.whatsapp || business.phone || '5511971234567').replace(/\D/g, '');
    const text = encodeURIComponent(
      `Olá ${business.name}! Estive vendo a vitrine digital de vocês e gostaria de tirar uma dúvida sobre os procedimentos.`
    );
    window.open(`https://wa.me/${phoneDigits}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  // Se o módulo da vitrine estiver desabilitado e não for Super Admin
  if (!hasVitrineModule || isSuspended) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-[#2D2725]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#EDE7DF] shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#EDE7DF]/50 flex items-center justify-center mx-auto text-[#2D2725]">
            <Lock size={26} />
          </div>
          <h2 className="text-xl font-serif text-[#2D2725]">Vitrine Temporariamente Indisponível</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            A página pública de {business.name} está em manutenção ou aguardando liberação do módulo de divulgação.
          </p>
          {onBackToApp && (
            <button
              type="button"
              onClick={onBackToApp}
              className="mt-4 px-6 py-2.5 bg-[#2D2725] text-white rounded-full text-xs font-bold uppercase tracking-wider"
            >
              Voltar ao Painel
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white animate-fade-in text-[#2D2725] selection:bg-[#F5EFEB] selection:text-[#2D2725] font-sans antialiased">
      {/* 0. BARRA SUPERIOR DE UTILIDADE / LINK EXCLUSIVO */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EDE7DF]/60 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          {onBackToApp && (
            <button
              type="button"
              onClick={onBackToApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#EDE7DF] text-[#2D2725] font-semibold transition-colors cursor-pointer border border-[#EDE7DF]"
            >
              <ArrowLeft size={13} />
              <span>Painel</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="font-serif text-[#2D2725] font-semibold tracking-tight">{business.name}</span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="hidden sm:inline font-mono text-[11px] text-[#B88746] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#EDE7DF]/60">
              auraestetica.com.br/{business.slug}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {userProfile?.role === 'PLATFORM_ADMIN' && (
            <span className="hidden md:inline-block bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              God Mode Preview
            </span>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#EDE7DF] text-[#2D2725] font-medium transition-colors cursor-pointer border border-[#EDE7DF]"
            title="Copiar Link para o Instagram"
          >
            {copiedLink ? <CheckCircle2 size={13} className="text-emerald-600" /> : <Share2 size={13} />}
            <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
          </button>

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                if (onNavigateToClientPortal) {
                  onNavigateToClientPortal();
                } else {
                  layout.setCurrentTab('portal');
                }
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2D2725] text-white hover:bg-black font-semibold transition-colors cursor-pointer text-[11px]"
            >
              <UserCheck size={13} />
              <span>Área do Cliente</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. HERO SECTION (CAPA E LOGO) */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-[#FAF7F2]">
        <img
          src={coverUrl}
          className="w-full h-full object-cover select-none"
          alt={`Capa da ${business.name}`}
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/20" /> {/* Overlay suave */}

        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-24 md:translate-x-0 z-10">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white ring-1 ring-black/5">
            <img
              src={logoUrl}
              className="w-full h-full object-cover"
              alt={`Logo da ${business.name}`}
            />
          </div>
        </div>
      </section>

      {/* 2. CABEÇALHO E INFO RÁPIDA */}
      <header className="pt-20 md:pt-8 md:pl-72 px-6 pb-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#2D2725] tracking-tight">
              {business.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1 text-[#2D2725] font-semibold">
                <Star size={14} className="text-[#D89F95] fill-[#D89F95]" />
                <span>{business.rating || 4.9}</span>
                <span className="text-gray-400 font-normal">({business.reviewsCount || 120} avaliações)</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-gray-400" />
                <span>{business.city || 'São Paulo, SP'}</span>
              </span>
              {business.instagram && (
                <a
                  href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-[#2D2725] transition-colors"
                >
                  <Instagram size={14} className="text-[#D89F95]" />
                  <span>{business.instagram}</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="flex-1 md:flex-none px-6 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-emerald-200/50"
            >
              <MessageCircle size={18} />
              <span>WHATSAPP</span>
            </button>
            <button
              type="button"
              onClick={handleOpenGeneralBooking}
              className="flex-1 md:flex-none px-8 py-3 bg-[#2D2725] hover:bg-black text-white rounded-full text-xs font-bold shadow-xl transition-all cursor-pointer tracking-wider"
            >
              AGENDAR ONLINE
            </button>
          </div>
        </div>
      </header>

      {/* 3. CONTEÚDO PRINCIPAL (CARDÁPIO DE SERVIÇOS & PORTFÓLIO / ASIDE) */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 py-12">
        {/* COLUNA ESQUERDA: SERVIÇOS E CONTEÚDOS */}
        <div className="lg:col-span-8 space-y-14">
          {/* SEÇÃO DE SERVIÇOS (CARDÁPIO DE BELEZA) */}
          <section id="procedimentos">
            <div className="flex items-center justify-between mb-6 border-b border-[#EDE7DF] pb-3">
              <div>
                <h2 className="text-2xl font-serif text-[#2D2725] tracking-tight">Procedimentos</h2>
                <p className="text-xs text-gray-500 mt-0.5">Selecione o procedimento desejado para agendar seu horário</p>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {servicesList.length} disponíveis
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {servicesList.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleSelectService(service)}
                  className="group flex justify-between items-center p-6 rounded-3xl border border-[#EDE7DF]/60 hover:border-[#D89F95] hover:bg-[#FAF7F2]/40 transition-all cursor-pointer shadow-xs"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[#2D2725] group-hover:text-[#9C753B] transition-colors text-base">
                        {service.name}
                      </h3>
                      {service.isPopular && (
                        <span className="bg-[#FAF7F2] text-[#B88746] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#EDE7DF]">
                          Destaque
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {service.description || 'Procedimento personalizado com avaliação estética completa e produtos premium.'}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-2 font-medium">
                      {service.durationMinutes || 60} min • {service.categoryName || 'Estética'}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-serif text-lg font-bold text-[#2D2725]">
                      R$ {Number(service.price).toFixed(2).replace('.', ',')}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-[#B88746] group-hover:text-[#9C753B] uppercase tracking-widest">
                      Selecionar →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* GALERIA DE PORTFÓLIO (VINDO DO MÓDULO CONTEÚDOS / ANTES & DEPOIS) */}
          <section id="portfolio">
            <div className="flex items-center justify-between mb-6 border-b border-[#EDE7DF] pb-3">
              <div>
                <h2 className="text-2xl font-serif text-[#2D2725] tracking-tight">Antes & Depois</h2>
                <p className="text-xs text-gray-500 mt-0.5">Resultados reais de protocolos executados na clínica</p>
              </div>
              <span className="text-xs font-bold text-[#B88746] uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={14} /> Resultados
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {portfolioList.map((post) => (
                <div
                  key={post.id}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm bg-gray-100"
                >
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-4 text-white">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-[#D89F95] mb-1">
                      {post.category || 'Protocolo'}
                    </span>
                    <h4 className="text-xs font-bold font-serif leading-tight text-white line-clamp-2">
                      {post.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* COLUNA DIREITA: SOBRE E CONTATO */}
        <aside className="lg:col-span-4 space-y-8">
          {/* HORÁRIOS */}
          <div className="bg-[#FAF7F2] p-8 rounded-[40px] border border-[#EDE7DF]">
            <h3 className="text-xs font-bold text-[#2D2725] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={16} className="text-[#B88746]" />
              <span>Horários</span>
            </h3>
            <div className="space-y-3.5 text-sm text-gray-600">
              <div className="flex justify-between items-center pb-2 border-b border-[#EDE7DF]/60">
                <span>Segunda a Sexta</span>
                <span className="font-bold text-[#2D2725]">09:00 - 20:00</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#EDE7DF]/60">
                <span>Sábado</span>
                <span className="font-bold text-[#2D2725]">09:00 - 15:00</span>
              </div>
              <div className="flex justify-between items-center text-[#D89F95]">
                <span>Domingo</span>
                <span className="font-bold italic">Fechado</span>
              </div>
            </div>
          </div>

          {/* LOCALIZAÇÃO */}
          <div className="bg-[#2D2725] p-8 rounded-[40px] text-white shadow-xl">
            <h3 className="text-xs font-bold text-[#D89F95] uppercase tracking-widest mb-4">
              Localização
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-6 font-medium">
              {formattedAddress}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formattedAddress)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 bg-white/10 hover:bg-white/20 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <span>Ver no Google Maps</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* CLUBE DE FIDELIDADE AURA */}
          <div className="bg-gradient-to-br from-[#FAF7F2] to-[#EDE7DF]/40 p-8 rounded-[40px] border border-[#EDE7DF] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#B88746]/10 text-[#B88746] flex items-center justify-center">
              <Award size={20} />
            </div>
            <h4 className="text-sm font-bold text-[#2D2725] font-serif">Clube Fidelidade Aura</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              A cada atendimento concluído nesta clínica, você acumula carimbos digitais no seu cartão e desbloqueia procedimentos de cortesia.
            </p>
          </div>
        </aside>
      </main>

      {/* 4. BOTÃO FLUTUANTE MOBILE (CTA PRINCIPAL SEMPRE AO ALCANCE DO POLEGAR) */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-6 duration-300">
        <button
          type="button"
          onClick={handleOpenGeneralBooking}
          className="w-full bg-[#2D2725] text-white py-4.5 px-6 rounded-full font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-98 transition-transform cursor-pointer border border-white/10 tracking-wider text-xs"
        >
          <span>AGENDAR MEU HORÁRIO</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 5. MODAL DE AGENDAMENTO INTEGRADO (O FLUXO DE VENDA DEFINITIVO) */}
      {bookingModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EDE7DF] max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
            {/* Fechar Modal */}
            <button
              type="button"
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-[#2D2725] p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {bookingSuccess ? (
              /* TELA DE SUCESSO DO AGENDAMENTO */
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 size={32} />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                    Reserva Confirmada
                  </span>
                  <h3 className="text-2xl font-serif text-[#2D2725] mt-2">
                    Horário Agendado com Sucesso!
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                    Sua solicitação foi registrada no sistema da {business.name}. Enviamos a confirmação e lembrete para seu WhatsApp.
                  </p>
                </div>

                <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EDE7DF] text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Procedimento:</span>
                    <span className="font-bold text-[#2D2725]">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Data & Horário:</span>
                    <span className="font-bold text-[#2D2725]">
                      {new Date(bookingDate + 'T12:00:00').toLocaleDateString('pt-BR')} às {bookingTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Profissional:</span>
                    <span className="font-bold text-[#2D2725]">{selectedProfessional?.name || 'Equipe Especializada'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Valor Estimado:</span>
                    <span className="font-bold text-[#B88746]">
                      R$ {Number(selectedService?.price || 0).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* FIDELIZAÇÃO: CONVITE AO PORTAL DO CLIENTE */}
                <div className="bg-gradient-to-r from-[#F5EFEB] to-[#FAF7F2] p-4 rounded-2xl border border-[#EDE7DF] text-xs text-left flex items-start gap-3">
                  <Award size={20} className="text-[#B88746] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#2D2725]">1º Selo de Fidelidade Pré-Registrado!</p>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      Você acumulou pontos nesta reserva. Acesse seu Portal do Cliente para acompanhar seu cartão digital.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingModalOpen(false);
                      if (onNavigateToClientPortal) {
                        onNavigateToClientPortal();
                      } else {
                        layout.setCurrentTab('portal');
                      }
                    }}
                    className="flex-1 py-3.5 bg-[#2D2725] text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    Ver Meus Selos no Portal
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="px-6 py-3.5 bg-gray-100 text-[#2D2725] rounded-full font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            ) : (
              /* FORMULÁRIO DE RESERVA E LOGIN/CADASTRO */
              <form onSubmit={handleConfirmBooking} className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-[#B88746] uppercase tracking-widest">
                    Agendamento Online
                  </span>
                  <h3 className="text-xl font-serif text-[#2D2725] mt-0.5">
                    Reservar Horário
                  </h3>
                  <p className="text-xs text-gray-500">
                    Escolha data, horário e confirme sua vaga instantaneamente
                  </p>
                </div>

                {bookingError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* PROCEDIMENTO SELECIONADO */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1.5">
                    Procedimento Escolhido
                  </label>
                  <select
                    value={selectedService?.id || ''}
                    onChange={(e) => {
                      const found = servicesList.find((s) => s.id === e.target.value);
                      if (found) setSelectedService(found);
                    }}
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE7DF] rounded-2xl text-xs text-[#2D2725] font-semibold focus:outline-none focus:border-[#B88746]"
                  >
                    {servicesList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — R$ {Number(s.price).toFixed(2).replace('.', ',')} ({s.durationMinutes || 60}m)
                      </option>
                    ))}
                  </select>
                </div>

                {/* DATA E HORÁRIO */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1.5">
                      Data Preferida
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE7DF] rounded-2xl text-xs text-[#2D2725] font-medium focus:outline-none focus:border-[#B88746]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1.5">
                      Horário
                    </label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE7DF] rounded-2xl text-xs text-[#2D2725] font-medium focus:outline-none focus:border-[#B88746]"
                    >
                      <option value="09:00">09:00 (Manhã)</option>
                      <option value="10:30">10:30 (Manhã)</option>
                      <option value="14:00">14:00 (Tarde)</option>
                      <option value="15:30">15:30 (Tarde)</option>
                      <option value="17:00">17:00 (Tarde)</option>
                      <option value="18:30">18:30 (Noite)</option>
                    </select>
                  </div>
                </div>

                {/* IDENTIFICAÇÃO DO CLIENTE (SEM ATRITO / PORTAL SIMPLIFICADO) */}
                {isAuthenticated && userProfile ? (
                  <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/60 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <UserCheck size={16} className="text-emerald-700" />
                      <div>
                        <span className="font-bold text-[#2D2725] block">{userProfile.name}</span>
                        <span className="text-[10px] text-gray-500">{userProfile.phone || userProfile.cpf}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
                      Conectada
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3 pt-1 border-t border-[#EDE7DF]/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      Seus Dados para Confirmação
                    </span>

                    <div>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Seu Nome Completo"
                        className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DF] rounded-xl text-xs text-[#2D2725] placeholder-gray-400 focus:outline-none focus:border-[#B88746]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={guestWhatsapp}
                        onChange={(e) => setGuestWhatsapp(e.target.value)}
                        placeholder="WhatsApp (Ex: 11 99999-9999)"
                        className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DF] rounded-xl text-xs text-[#2D2725] placeholder-gray-400 focus:outline-none focus:border-[#B88746]"
                        required
                      />
                      <input
                        type="text"
                        value={guestCpf}
                        onChange={(e) => setGuestCpf(e.target.value)}
                        placeholder="CPF (apenas números)"
                        className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EDE7DF] rounded-xl text-xs text-[#2D2725] placeholder-gray-400 focus:outline-none focus:border-[#B88746]"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#2D2725] hover:bg-black text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    <span>Confirmar Agendamento Agora</span>
                  </button>
                  <p className="text-[10px] text-gray-400 text-center mt-2.5">
                    Garantia de atendimento sem filas • Cancelamento gratuito até 2h antes
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessLanding;
