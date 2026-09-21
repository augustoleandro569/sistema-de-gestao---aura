import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Phone,
  Clock,
  Star,
  Calendar,
  Instagram,
  CheckCircle2,
  ArrowLeft,
  Share2,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  X,
  AlertCircle
} from 'lucide-react';
import { useBusiness } from '../core/BusinessContext';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { Service, Professional } from '../types';

interface BusinessProfileProps {
  businessSlug?: string;
  onBackToApp?: () => void;
  onSelectServiceForBooking?: (serviceId: string) => void;
}

export const BusinessProfile: React.FC<BusinessProfileProps> = ({
  businessSlug,
  onBackToApp,
}) => {
  const { currentBusiness, getBusinessBySlug, publicProfileSlug, setPublicProfileSlug } = useBusiness();
  const { isAuthenticated, userProfile, registerWithCpf } = useAuth();

  const effectiveSlug = businessSlug || publicProfileSlug || currentBusiness.slug;
  const businessData = getBusinessBySlug(effectiveSlug) || currentBusiness;

  const services = dataService.getServices().filter((s) => s.status === 'ativo');
  const contentPosts = dataService.getContentPosts({ status: 'published' }).slice(0, 6);
  const professionals = dataService.getProfessionals().filter((p) => p.status === 'ativo');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState<string>('10:00');
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Pre-registration form state for public guests
  const [clientName, setClientName] = useState('');
  const [clientCpf, setClientCpf] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [lgpdConsent, setLgpdConsent] = useState(true);

  const categories = ['all', 'cat-sobrancelhas', 'cat-facial', 'cat-depilacao', 'cat-massagem'];
  const categoryLabels: Record<string, string> = {
    all: 'Todos os Serviços',
    'cat-sobrancelhas': 'Sobrancelhas & Cílios',
    'cat-facial': 'Facial & Harmonização',
    'cat-depilacao': 'Laser & Depilação',
    'cat-massagem': 'Corporal & Massagens',
  };

  const filteredServices = services.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.categoryId === selectedCategory;
  });

  const handleOpenBooking = (service: Service) => {
    setSelectedService(service);
    if (professionals.length > 0) {
      setSelectedProfessional(professionals[0]);
    }
    setBookingError(null);
    setBookingSuccess(false);
    setBookingModalOpen(true);
  };

  const handleConfirmPublicBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedProfessional) return;

    let targetClientId = userProfile?.clientId;

    // Se o cliente não estiver logado ou cadastrado, valida o pré-cadastro mandatório
    if (!targetClientId) {
      if (!clientName || !clientCpf || !clientWhatsapp) {
        setBookingError('Por favor preencha Nome, CPF e WhatsApp para confirmar seu horário com segurança.');
        return;
      }
      if (!lgpdConsent) {
        setBookingError('É necessário consentir com as normas de prontuário e privacidade LGPD.');
        return;
      }

      const reg = registerWithCpf({
        name: clientName,
        cpf: clientCpf,
        whatsapp: clientWhatsapp,
        email: clientEmail || `${clientCpf.replace(/\D/g, '')}@cliente.aura.com`,
      });

      if (!reg.success || !reg.profile) {
        setBookingError(reg.error || 'Não foi possível validar o pré-cadastro.');
        return;
      }
      targetClientId = reg.profile.clientId;
    }

    if (!targetClientId) {
      // Cria cliente direto caso o clientId não tenha vindo
      const created = dataService.addClient({
        name: clientName || userProfile?.name || 'Cliente Online',
        phone: clientWhatsapp || userProfile?.phone || '(11) 98000-0000',
        whatsapp: clientWhatsapp || userProfile?.whatsapp || '(11) 98000-0000',
        email: clientEmail || userProfile?.email,
        cpf: clientCpf || userProfile?.cpf,
        registrationCompleted: true,
      });
      targetClientId = created.id;
    }

    const res = dataService.addAppointment({
      clientId: targetClientId,
      serviceId: selectedService.id,
      professionalId: selectedProfessional.id,
      date: bookingDate,
      startTime: bookingTime,
      paymentMethod: 'pix',
      notes: 'Agendamento externo realizado via Vitrine Pública Aura.',
    });

    if (res.success) {
      setBookingSuccess(true);
      setBookingError(null);
    } else {
      setBookingError(res.error || 'Erro ao processar agendamento.');
    }
  };

  return (
    <div id="public-business-profile" className="min-h-screen bg-[#FAF8F5] text-[#2D2725] selection:bg-[#EBD5CC]">
      {/* Top Floating Utility Bar */}
      <div className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EFE9E2] px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBackToApp && (
            <button
              type="button"
              onClick={() => {
                setPublicProfileSlug(null);
                onBackToApp();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#EAE3DA] text-xs font-semibold text-[#5C534D] hover:text-[#2D2725] shadow-xs cursor-pointer"
            >
              <ArrowLeft size={14} /> Voltar ao Painel da Clínica
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#8C7F75]">
            <span className="font-semibold text-[#2D2725]">{businessData.name}</span>
            <span>•</span>
            <span className="text-[#9C753B] font-medium">auraestetica.com/perfil/{businessData.slug}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Link da vitrine pública copiado!');
            }}
            className="p-2 rounded-xl bg-white border border-[#EAE3DA] text-[#5C534D] hover:text-[#2D2725] text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Copiar Link"
          >
            <Share2 size={14} /> <span className="hidden md:inline">Compartilhar Vitrine</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleOpenBooking(services[0])}
            className="bg-[#2D2725] text-[#FAF7F2] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#433A37] transition-all shadow-xs cursor-pointer"
          >
            Agendar Agora
          </button>
        </div>
      </div>

      {/* Hero Banner & Logo */}
      <header className="relative">
        <div className="h-64 sm:h-80 w-full overflow-hidden relative">
          <img
            src={businessData.cover || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80'}
            alt={businessData.name}
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D2725]/80 via-transparent to-black/20" />
        </div>

        {/* Business Header Card */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-20 z-10">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE3D7] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                <img
                  src={businessData.logo || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=200&q=80'}
                  alt={businessData.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-md"
                />
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-white" title="Estabelecimento Ativo">
                  <CheckCircle2 size={12} />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2725] tracking-tight">
                    {businessData.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FAF2E6] text-[#9C753B] border border-[#ECD9BD] text-xs font-semibold flex items-center gap-1">
                    <ShieldCheck size={13} /> Verificado Aura
                  </span>
                </div>

                <p className="text-sm text-[#7D7066] max-w-xl mb-3 leading-relaxed">
                  {businessData.description || 'Excelência em estética, acolhimento personalizado e protocolos avançados de beleza e saúde.'}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B6159]">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-[#B88746]" /> {businessData.address || 'São Paulo - SP'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={14} className="text-[#B88746]" /> {businessData.phone || '(11) 98765-4321'}
                  </span>
                  <span className="flex items-center gap-1 text-[#9C753B] font-semibold">
                    <Star size={14} className="fill-[#B88746] text-[#B88746]" /> {businessData.rating || '4.98'} ({businessData.reviewsCount || 184} avaliações)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="w-full md:w-auto flex md:flex-col items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenBooking(services[0])}
                className="w-full md:w-48 bg-[#2D2725] hover:bg-[#3F3734] text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar size={16} className="text-[#E8D1C5]" /> Agendar Horário
              </button>
              {businessData.instagram && (
                <a
                  href={`https://instagram.com/${businessData.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-48 bg-[#FAF6F0] hover:bg-[#F2ECE1] text-[#6B6159] hover:text-[#2D2725] border border-[#EAE3DA] px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Instagram size={14} className="text-pink-600" /> {businessData.instagram}
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Services Showcase */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#EFE9E2] pb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-[#2D2725] tracking-tight">
                  Serviços & Procedimentos
                </h2>
                <p className="text-xs text-[#8C7F75] mt-0.5">Escolha seu procedimento e reserve online em segundos</p>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {categories.map((catKey) => (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setSelectedCategory(catKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === catKey
                        ? 'bg-[#2D2725] text-white shadow-xs'
                        : 'bg-white text-[#6B6159] hover:bg-[#F6F2EC] border border-[#EAE3DA]'
                    }`}
                  >
                    {categoryLabels[catKey]}
                  </button>
                ))}
              </div>
            </div>

            {/* Service Cards List */}
            <div className="space-y-3">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="p-5 rounded-2xl bg-white border border-[#EBE3D7] hover:border-[#D6CBC0] transition-all shadow-xs hover:shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#2D2725] text-base group-hover:text-[#9C753B] transition-colors">
                        {service.name}
                      </h3>
                      {service.timesPerformed > 40 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF0ED] text-[#B35848] text-[10px] font-bold">
                          Mais Pedido
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#7D7066] line-clamp-2 leading-relaxed mb-2">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[#8C7F75]">
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {service.durationMinutes} minutos
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#9C753B] font-medium">
                        <Star size={12} className="fill-[#B88746] text-[#B88746]" /> {service.averageRating}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F4EFE9]">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-[#8C7F75] uppercase tracking-wider block">Valor</span>
                      <span className="text-lg font-bold text-[#2D2725]">
                        R$ {service.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenBooking(service)}
                      className="bg-[#2D2725] hover:bg-[#3F3734] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      Agendar <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right Col: Portfolio, Clinic Info & Equipe */}
          <aside className="space-y-6">
            {/* Equipe / Profissionais */}
            <div className="p-6 rounded-3xl bg-white border border-[#EBE3D7] shadow-xs">
              <h3 className="font-display font-bold text-base text-[#2D2725] mb-4 flex items-center gap-2">
                <UserCheck size={18} className="text-[#B88746]" /> Corpo Clínico
              </h3>
              <div className="space-y-3">
                {professionals.map((prof) => (
                  <div key={prof.id} className="flex items-center gap-3">
                    <img
                      src={prof.photoUrl || 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=150&q=80'}
                      alt={prof.name}
                      className="w-11 h-11 rounded-xl object-cover ring-2 ring-[#EBD5CC]"
                    />
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-[#2D2725] block truncate">{prof.name}</span>
                      <span className="text-[11px] text-[#8C7F75] block truncate">{prof.specialty}</span>
                      <span className="text-[10px] text-[#B88746] font-medium flex items-center gap-0.5 mt-0.5">
                        <Star size={10} className="fill-[#B88746]" /> {prof.averageRating} ({prof.completedAppointmentsCount} atendimentos)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Galeria de Conteúdo / Portfólio */}
            <div className="p-6 rounded-3xl bg-white border border-[#EBE3D7] shadow-xs">
              <h3 className="font-display font-bold text-base text-[#2D2725] mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-[#B88746]" /> Galeria & Resultados
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {contentPosts.map((post) => (
                  <div key={post.id} className="group relative rounded-2xl overflow-hidden border border-[#EAE3DA]">
                    <img
                      src={post.imageUrl || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80'}
                      alt={post.title}
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-2 bg-white">
                      <span className="text-[10px] font-semibold text-[#2D2725] block truncate">{post.title}</span>
                      <span className="text-[9px] text-[#8C7F75] block truncate">{post.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Horário de Funcionamento */}
            <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#EAE3DA]">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#8C6226] mb-3 flex items-center gap-1.5">
                <Clock size={14} /> Horários de Atendimento
              </h4>
              <ul className="space-y-1.5 text-xs text-[#5C534D]">
                <li className="flex justify-between">
                  <span>Segunda a Sexta:</span>
                  <span className="font-semibold text-[#2D2725]">08:00 às 20:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Sábado:</span>
                  <span className="font-semibold text-[#2D2725]">09:00 às 18:00</span>
                </li>
                <li className="flex justify-between text-[#8C7F75]">
                  <span>Domingo:</span>
                  <span>Fechado</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* Floating Sticky CTA Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-30 sm:hidden">
        <button
          type="button"
          onClick={() => handleOpenBooking(services[0])}
          className="bg-[#2D2725] text-white px-5 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 border-2 border-white"
        >
          <Calendar size={16} className="text-[#E8D1C5]" /> Agendar Online
        </button>
      </div>

      {/* Booking Modal with Prerequisite Pre-registration */}
      {bookingModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EDE7DF] max-h-[90vh] overflow-y-auto relative">
            <button
              type="button"
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-display text-2xl font-bold text-[#2D2725] mb-2">Agendamento Solicitado!</h3>
                <p className="text-sm text-[#6B6159] max-w-sm mx-auto mb-6">
                  Seu horário para <strong>{selectedService.name}</strong> em{' '}
                  <strong>{bookingDate} às {bookingTime}</strong> com{' '}
                  <strong>{selectedProfessional?.name}</strong> foi registrado com sucesso.
                </p>
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DE] text-left text-xs text-[#5C534D] space-y-1 mb-6">
                  <p>• Você receberá a confirmação no seu WhatsApp cadastrado.</p>
                  <p>• Caso precise reagendar, avise com pelo menos 2h de antecedência.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="w-full bg-[#2D2725] text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  Concluir
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmPublicBooking} className="space-y-4">
                <div className="pb-3 border-b border-[#F2ECE4]">
                  <span className="text-[10px] font-bold text-[#8C6226] uppercase tracking-wider block">
                    Agendamento Online • {businessData.name}
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#2D2725] mt-0.5">
                    {selectedService.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#6B6159] mt-1">
                    <span>Duração: {selectedService.durationMinutes} min</span>
                    <span>•</span>
                    <span className="font-bold text-[#2D2725]">
                      R$ {selectedService.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {bookingError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* Seleção de Profissional, Data e Horário */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#4A423C] mb-1">Profissional</label>
                    <select
                      value={selectedProfessional?.id || ''}
                      onChange={(e) => {
                        const prof = professionals.find((p) => p.id === e.target.value);
                        if (prof) setSelectedProfessional(prof);
                      }}
                      className="w-full p-2.5 rounded-xl border border-[#D9CFC7] bg-white text-xs text-[#2D2725] focus:outline-none focus:ring-1 focus:ring-[#B88746]"
                    >
                      {professionals.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.specialty})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A423C] mb-1">Data</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#D9CFC7] bg-white text-xs text-[#2D2725] focus:outline-none focus:ring-1 focus:ring-[#B88746]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A423C] mb-1">Horário Desejado</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['09:00', '10:30', '14:00', '15:30', '17:00', '18:30'].map((timeSlot) => (
                      <button
                        key={timeSlot}
                        type="button"
                        onClick={() => setBookingTime(timeSlot)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          bookingTime === timeSlot
                            ? 'bg-[#2D2725] text-white border-[#2D2725]'
                            : 'bg-white text-[#5C534D] border-[#EAE3DA] hover:bg-[#FAF6F0]'
                        }`}
                      >
                        {timeSlot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seção de Pré-Cadastro Seguro (Aura Prontuário) */}
                {!isAuthenticated && (
                  <div className="pt-3 border-t border-[#F2ECE4] space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-[#FAF2E6] text-[#B88746] flex items-center justify-center">
                        <ShieldCheck size={13} />
                      </div>
                      <span className="text-xs font-bold text-[#2D2725]">
                        Identificação e Pré-Cadastro Mandatório
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8C7F75] leading-relaxed">
                      Conforme os protocolos de segurança estética Aura, informe seus dados para abertura de prontuário e confirmação de horário.
                    </p>

                    <div>
                      <label className="block text-[11px] font-medium text-[#4A423C] mb-1">Nome Completo</label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Seu nome e sobrenome"
                        className="w-full p-2.5 rounded-xl border border-[#D9CFC7] text-xs text-[#2D2725] focus:outline-none focus:ring-1 focus:ring-[#B88746]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#4A423C] mb-1">CPF (Chave Única)</label>
                        <input
                          type="text"
                          required
                          value={clientCpf}
                          onChange={(e) => setClientCpf(e.target.value)}
                          placeholder="000.000.000-00"
                          className="w-full p-2.5 rounded-xl border border-[#D9CFC7] text-xs text-[#2D2725] focus:outline-none focus:ring-1 focus:ring-[#B88746]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#4A423C] mb-1">WhatsApp</label>
                        <input
                          type="text"
                          required
                          value={clientWhatsapp}
                          onChange={(e) => setClientWhatsapp(e.target.value)}
                          placeholder="(11) 98765-4321"
                          className="w-full p-2.5 rounded-xl border border-[#D9CFC7] text-xs text-[#2D2725] focus:outline-none focus:ring-1 focus:ring-[#B88746]"
                        />
                      </div>
                    </div>

                    <label className="flex items-start gap-2 text-[11px] text-[#6B6159] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lgpdConsent}
                        onChange={(e) => setLgpdConsent(e.target.checked)}
                        className="rounded text-[#B88746] focus:ring-[#B88746] mt-0.5"
                      />
                      <span>
                        Concordo com os termos da LGPD e autorizo o envio de lembretes e confirmações por WhatsApp.
                      </span>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#2D2725] hover:bg-[#3F3734] text-white py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all mt-4 cursor-pointer"
                >
                  Confirmar Agendamento
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
