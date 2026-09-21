import React, { useState } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  User,
  Phone,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Building2,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Business, Service, Professional } from '../../types';

interface BookingModalProps {
  businessId: string;
  initialServiceQuery?: string;
  onClose: () => void;
  onSuccess: (appointmentId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  businessId,
  initialServiceQuery,
  onClose,
  onSuccess,
}) => {
  const business = dataService.getBusinessById(businessId) || dataService.getAllBusinesses()[0];
  const services = dataService.getServices().filter(s => s.status === 'ativo');
  const professionals = dataService.getProfessionals().filter(p => p.status === 'ativo');

  // Pre-select service if matches query
  const matchedService = initialServiceQuery
    ? services.find(s => s.name.toLowerCase().includes(initialServiceQuery.toLowerCase()))
    : undefined;

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    matchedService?.id || services[0]?.id || ''
  );
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>('any');
  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState<string>('10:00');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedData, setConfirmedData] = useState<any>(null);

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];
  const selectedProfessional = professionals.find(p => p.id === selectedProfessionalId);

  const availableHours = ['09:00', '10:00', '11:00', '13:30', '14:30', '16:00', '17:30', '19:00'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Por favor, informe seu nome e telefone WhatsApp para confirmação.');
      return;
    }

    setIsSubmitting(true);

    try {
      const apt = dataService.createMarketplaceAppointment({
        businessId: business.id,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        professionalId: selectedProfessionalId === 'any' ? professionals[0]?.id : selectedProfessionalId,
        professionalName:
          selectedProfessionalId === 'any'
            ? 'Primeiro profissional disponível'
            : selectedProfessional?.name || 'Profissional especialista',
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim(),
        date,
        time,
        notes,
        price: selectedService.price,
      });

      setConfirmedData(apt);
      onSuccess(apt.id);
    } catch (err) {
      console.error(err);
      alert('Erro ao confirmar agendamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-900 to-[#2A2421] text-white flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={business.logo || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=150&q=80'}
              alt={business.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-md bg-white"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  Aura Marketplace
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-200 px-1.5 py-0.2 rounded font-mono">
                  iFood de Beleza
                </span>
              </div>
              <h2 className="text-lg font-serif font-bold text-white leading-tight">
                {business.name}
              </h2>
              <p className="text-xs text-stone-300">
                {business.neighborhood || 'Jardins'}, {business.city || 'São Paulo'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {confirmedData ? (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold font-serif text-stone-900">
                Agendamento Confirmado com Sucesso!
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Seu agendamento foi registrado e sincronizado instantaneamente no sistema de gestão de{' '}
                <strong className="text-stone-900">{business.name}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500">Procedimento:</span>
                <span className="font-bold text-stone-900">{confirmedData.serviceName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500">Data e Horário:</span>
                <span className="font-bold text-amber-800">
                  {confirmedData.date} às {confirmedData.startTime}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500">Valor do Procedimento:</span>
                <span className="font-bold text-emerald-700 text-base">
                  R$ {confirmedData.finalPrice?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-stone-400 pt-2 border-t border-stone-200">
                <span>Protocolo de Confirmação:</span>
                <span className="font-mono">{confirmedData.id}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-500 justify-center">
              <ShieldCheck size={16} className="text-amber-600" />
              <span>Garantia de atendimento e suporte Aura Marketplace</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Concluir & Voltar ao Feed
            </button>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Service Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                1. Escolha o Procedimento Desejado
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                {services.map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedServiceId === srv.id
                        ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{srv.name}</p>
                      <p className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                        <Clock size={12} />
                        <span>{srv.durationMinutes} minutos</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-stone-900">
                        R$ {srv.price.toFixed(2)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <CalendarIcon size={14} className="text-amber-600" />
                  <span>2. Data do Agendamento</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock size={14} className="text-amber-600" />
                  <span>3. Horário Disponível</span>
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
                >
                  {availableHours.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Professional Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User size={14} className="text-amber-600" />
                <span>4. Profissional</span>
              </label>
              <select
                value={selectedProfessionalId}
                onChange={(e) => setSelectedProfessionalId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
              >
                <option value="any">Primeiro profissional disponível</option>
                {professionals.map((pro) => (
                  <option key={pro.id} value={pro.id}>
                    {pro.name} ({pro.specialty || 'Especialista'})
                  </option>
                ))}
              </select>
            </div>

            {/* Client Info */}
            <div className="pt-2 border-t border-stone-200 space-y-3">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                5. Seus Dados de Contato
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Seu nome completo"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-3 text-stone-400" />
                    <input
                      type="tel"
                      placeholder="WhatsApp (ex: 11 99999-8888)"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Observações ou cuidados com a pele (opcional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
              </div>
            </div>

            {/* Summary & Submit */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-stone-500 block">Total a Pagar na Clínica:</span>
                <span className="text-xl font-bold text-stone-900 font-serif">
                  R$ {selectedService ? selectedService.price.toFixed(2) : '0.00'}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Confirmando...' : 'Confirmar Agendamento'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
