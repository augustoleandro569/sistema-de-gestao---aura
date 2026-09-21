import React, { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { dataService } from '../../services/dataService';
import { Service, Professional } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

export const FullCalendarComponent: React.FC = () => {
  const { userProfile } = useAuth();
  const services = useMemo(() => dataService.getServices().filter((s) => s.status === 'ativo'), []);
  const professionals = useMemo(() => dataService.getProfessionals().filter((p) => p.status === 'ativo'), []);

  // Today
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Booking states
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>(professionals[0]?.id || '');
  const [selectedTime, setSelectedTime] = useState<string>('14:00');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao_credito' | 'dinheiro'>('pix');
  const [clientNotes, setClientNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    id: string;
    protocol: string;
    serviceName: string;
    professionalName: string;
    date: string;
    time: string;
    price: number;
  } | null>(null);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedProfessional = professionals.find((p) => p.id === selectedProfessionalId) || professionals[0];

  // Calendar calculations
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Generate slots for selected date
  const availableTimeSlots = useMemo(() => {
    return [
      { time: '09:00', period: 'Manhã', available: true },
      { time: '10:00', period: 'Manhã', available: true },
      { time: '11:15', period: 'Manhã', available: true },
      { time: '13:30', period: 'Tarde', available: true },
      { time: '14:00', period: 'Tarde', available: true },
      { time: '15:15', period: 'Tarde', available: false }, // Simulating occupied
      { time: '16:00', period: 'Tarde', available: true },
      { time: '17:30', period: 'Tarde', available: true },
      { time: '18:30', period: 'Noite', available: true },
      { time: '19:15', period: 'Noite', available: true },
    ];
  }, [selectedDate, selectedProfessionalId]);

  const handleConfirmBooking = () => {
    if (!selectedService || !selectedProfessional) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Find or create client in dataService
      let clientId = userProfile?.clientId;
      if (!clientId && userProfile?.cpf) {
        const existing = dataService.findClientByCpfOrPhone(userProfile.cpf);
        if (existing) clientId = existing.id;
      }

      if (!clientId) {
        const newClient = dataService.createClient({
          name: userProfile?.name || 'Cliente Online',
          phone: userProfile?.phone || '(11) 99999-9999',
          whatsapp: userProfile?.whatsapp || userProfile?.phone || '5511999999999',
          email: userProfile?.email || '',
          cpf: userProfile?.cpf || '',
          documentCpf: userProfile?.cpf || '',
          birth_date: userProfile?.birth_date || '',
          medical_notes: userProfile?.medical_notes || '',
          lgpd_consent: true,
          registration_completed: true,
        });
        clientId = newClient.id;
      }

      // Calculate endTime based on duration
      const [startHour, startMin] = selectedTime.split(':').map(Number);
      const totalMinutes = startHour * 60 + startMin + (selectedService.durationMinutes || 60);
      const endHour = Math.floor(totalMinutes / 60);
      const endMin = totalMinutes % 60;
      const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

      const appointment = dataService.createAppointment({
        clientId,
        serviceId: selectedService.id,
        professionalId: selectedProfessional.id,
        date: selectedDate,
        startTime: selectedTime,
        endTime,
        price: selectedService.price,
        cost: selectedService.directCost || 35,
        paymentMethod,
        notes: clientNotes ? `[Agendamento Online Cliente] ${clientNotes}` : '[Agendamento Online Cliente]',
      });

      const protocolNum = `SUB-${Math.floor(100000 + Math.random() * 900000)}`;

      setConfirmedBooking({
        id: appointment.id,
        protocol: protocolNum,
        serviceName: selectedService.name,
        professionalName: selectedProfessional.name,
        date: selectedDate,
        time: selectedTime,
        price: selectedService.price,
      });

      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div id="full-calendar-component" className="w-full max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Top Banner: Verified Client Confirmation */}
      <div className="bg-white border border-[#E8DFC0] rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-white via-[#FCFAF7] to-[#FAF5EE]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF5ED] border border-[#BCE1C8] text-[#257A47] flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-[#2D2725]">
                Agendamento Online Liberado
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#EAF5ED] text-[#257A47] border border-[#BCE1C8]">
                ✓ Pré-Cadastro Concluído
              </span>
            </div>
            <p className="text-xs text-[#7A6E65] mt-0.5">
              Olá, <strong className="text-[#2D2725]">{userProfile?.name}</strong>! Seus dados cadastrais e prontuário estético estão validados.
              {userProfile?.cpf && ` CPF: ${userProfile.cpf}`}
            </p>
          </div>
        </div>

        {userProfile?.medical_notes && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF3EA] border border-[#EFE2D3] text-[11px] text-[#785934] max-w-md">
            <FileText size={14} className="shrink-0 text-[#B88746]" />
            <span className="truncate">
              <strong>Ficha Médica:</strong> {userProfile.medical_notes}
            </span>
          </div>
        )}
      </div>

      {/* Confirmation View if appointment was just created */}
      {confirmedBooking ? (
        <div className="bg-white border border-[#BCE1C8] rounded-3xl p-6 sm:p-8 shadow-xs text-center max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-[#EAF5ED] text-[#257A47] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#257A47] bg-[#EAF5ED] px-3 py-1 rounded-full">
              Reserva Confirmada com Sucesso
            </span>
            <h3 className="text-2xl font-bold text-[#2D2725]">
              Procedimento Agendado!
            </h3>
            <p className="text-xs text-[#7A6E65]">
              Protocolo: <span className="font-mono font-bold text-[#2D2725]">{confirmedBooking.protocol}</span>
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F5] border border-[#EAE3DA] rounded-2xl text-left space-y-2.5 text-xs text-[#4A423C]">
            <div className="flex justify-between pb-2 border-b border-[#EAE3DA]">
              <span className="text-[#8F8278]">Procedimento:</span>
              <strong className="text-[#2D2725]">{confirmedBooking.serviceName}</strong>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#EAE3DA]">
              <span className="text-[#8F8278]">Especialista:</span>
              <strong className="text-[#2D2725]">{confirmedBooking.professionalName}</strong>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#EAE3DA]">
              <span className="text-[#8F8278]">Data & Horário:</span>
              <strong className="text-[#2D2725]">{confirmedBooking.date} às {confirmedBooking.time}</strong>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-[#8F8278]">Valor do Atendimento:</span>
              <strong className="text-base text-[#257A47]">R$ {confirmedBooking.price.toFixed(2)}</strong>
            </div>
          </div>

          <div className="space-y-2.5">
            <a
              href={`https://wa.me/5511999999999?text=${encodeURIComponent(
                `Olá! Acabei de agendar meu procedimento de ${confirmedBooking.serviceName} no dia ${confirmedBooking.date} às ${confirmedBooking.time}. Protocolo: ${confirmedBooking.protocol}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle size={15} />
              <span>Receber Lembretes no WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => setConfirmedBooking(null)}
              className="w-full py-3 px-4 rounded-xl bg-white border border-[#EAE3DA] hover:bg-[#FAF8F5] text-[#2D2725] text-xs font-semibold transition-all"
            >
              Fazer Outro Agendamento
            </button>
          </div>
        </div>
      ) : (
        /* Interactive Calendar & Scheduling Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Calendar & Time Slots */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Select Service & Professional */}
            <div className="bg-white border border-[#EAE3DA] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FAF3EA] text-[#B88746] flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="text-sm font-bold text-[#2D2725]">
                  Escolha o Procedimento & Especialista
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A423C] mb-1.5">
                    Procedimento Estético
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs font-medium text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                  >
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name} — R$ {srv.price.toFixed(2)} ({srv.durationMinutes} min)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A423C] mb-1.5">
                    Profissional Especialista
                  </label>
                  <select
                    value={selectedProfessionalId}
                    onChange={(e) => setSelectedProfessionalId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs font-medium text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                  >
                    {professionals.map((pro) => (
                      <option key={pro.id} value={pro.id}>
                        {pro.name} ({pro.specialty})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Full Interactive Calendar */}
            <div className="bg-white border border-[#EAE3DA] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF3EA] text-[#B88746] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-[#2D2725]">
                    Selecione a Data ({monthNames[currentMonth]} de {currentYear})
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg border border-[#EAE3DA] text-[#7A6E65] hover:bg-[#FAF8F5] transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-lg border border-[#EAE3DA] text-[#7A6E65] hover:bg-[#FAF8F5] transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
                  <span key={d} className="text-[11px] font-semibold text-[#8F8278] py-1">
                    {d}
                  </span>
                ))}
              </div>

              {/* Month Days Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {/* Empty slots for month start */}
                {[...Array(firstDayIndex)].map((_, i) => (
                  <div key={`empty-${i}`} className="h-11 rounded-xl bg-transparent" />
                ))}

                {/* Days of month */}
                {[...Array(daysInMonth)].map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const isSelected = selectedDate === dateStr;
                  const isToday = new Date().toISOString().split('T')[0] === dateStr;
                  const isPast = new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      disabled={isPast}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`h-11 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all relative ${
                        isSelected
                          ? 'bg-[#2D2725] text-white shadow-xs scale-105'
                          : isPast
                          ? 'text-[#C5BCB3] bg-transparent cursor-not-allowed'
                          : 'bg-[#FAF8F5] border border-[#F0EBE4] text-[#2D2725] hover:border-[#B88746] hover:bg-white'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {isToday && (
                        <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-[#E8D1C5]' : 'bg-[#B88746]'}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Step 3: Available Time Slots */}
              <div className="pt-4 border-t border-[#EAE3DA] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4A423C] flex items-center gap-1.5">
                    <Clock size={14} className="text-[#B88746]" />
                    Horários Disponíveis em {selectedDate}
                  </span>
                  <span className="text-[10px] text-[#8F8278]">
                    Duração: {selectedService.durationMinutes} min
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {availableTimeSlots.map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all text-center flex flex-col items-center justify-center ${
                          !slot.available
                            ? 'bg-[#FAF8F5] text-[#C5BCB3] border border-transparent cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-[#B88746] text-white shadow-xs'
                            : 'bg-[#FAF8F5] border border-[#EAE3DA] text-[#2D2725] hover:bg-white hover:border-[#B88746]'
                        }`}
                      >
                        <span>{slot.time}</span>
                        <span className={`text-[9px] font-normal ${isSelected ? 'text-[#FAF3EA]' : 'text-[#8F8278]'}`}>
                          {slot.available ? slot.period : 'Ocupado'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Summary & Checkout Confirmation */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white border border-[#EAE3DA] rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 sticky top-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE3DA]">
                <h3 className="text-sm font-bold text-[#2D2725]">
                  Resumo do Agendamento
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#B88746] bg-[#FAF3EA] px-2 py-0.5 rounded-md">
                  Online
                </span>
              </div>

              {/* Service Details Card */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE3DA] rounded-2xl space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-[#2D2725]">
                      {selectedService.name}
                    </h4>
                    <span className="text-[11px] text-[#7A6E65]">
                      {selectedService.category} • {selectedService.durationMinutes} minutos
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#2D2725]">
                    R$ {selectedService.price.toFixed(2)}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#EAE3DA] flex items-center gap-2 text-xs text-[#5C524B]">
                  <User size={13} className="text-[#B88746]" />
                  <span>Profissional: <strong>{selectedProfessional.name}</strong></span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#5C524B]">
                  <CalendarIcon size={13} className="text-[#B88746]" />
                  <span>Data: <strong>{selectedDate}</strong> às <strong>{selectedTime}</strong></span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#4A423C]">
                  Forma de Pagamento Preferida
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`py-2 px-1 rounded-xl text-[11px] font-semibold border transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-[#B88746] bg-[#FAF3EA] text-[#B88746]'
                        : 'border-[#EAE3DA] bg-[#FAF8F5] text-[#7A6E65] hover:bg-white'
                    }`}
                  >
                    PIX (5% off)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cartao_credito')}
                    className={`py-2 px-1 rounded-xl text-[11px] font-semibold border transition-all ${
                      paymentMethod === 'cartao_credito'
                        ? 'border-[#B88746] bg-[#FAF3EA] text-[#B88746]'
                        : 'border-[#EAE3DA] bg-[#FAF8F5] text-[#7A6E65] hover:bg-white'
                    }`}
                  >
                    Cartão
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('dinheiro')}
                    className={`py-2 px-1 rounded-xl text-[11px] font-semibold border transition-all ${
                      paymentMethod === 'dinheiro'
                        ? 'border-[#B88746] bg-[#FAF3EA] text-[#B88746]'
                        : 'border-[#EAE3DA] bg-[#FAF8F5] text-[#7A6E65] hover:bg-white'
                    }`}
                  >
                    Na Recepção
                  </button>
                </div>
              </div>

              {/* Observation notes */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#4A423C]">
                  Observações para a Clínica (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Ex: Prefiro atendimento na cabine mais silenciosa..."
                  className="w-full p-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA] text-xs text-[#2D2725] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B88746] resize-none"
                />
              </div>

              {/* Total Price breakdown */}
              <div className="pt-2 border-t border-[#EAE3DA] space-y-1.5 text-xs text-[#7A6E65]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {selectedService.price.toFixed(2)}</span>
                </div>
                {paymentMethod === 'pix' && (
                  <div className="flex justify-between text-[#257A47] font-semibold">
                    <span>Desconto PIX (5%):</span>
                    <span>- R$ {(selectedService.price * 0.05).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#2D2725] pt-1">
                  <span>Total a Pagar:</span>
                  <span className="text-base text-[#B88746]">
                    R$ {(selectedService.price * (paymentMethod === 'pix' ? 0.95 : 1)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="w-full py-3 px-4 rounded-xl bg-[#2D2725] hover:bg-black text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Processando Reserva...</span>
                ) : (
                  <>
                    <Sparkles size={14} className="text-[#E8D1C5]" />
                    <span>Confirmar Agendamento</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-[#9E9085] text-center leading-tight">
                Cancelamento gratuito até 24h antes do procedimento. Lembretes automáticos enviados via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullCalendarComponent;
