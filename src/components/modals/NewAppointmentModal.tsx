import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Sparkles,
  UserCheck,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Tag,
  UserPlus,
  Building2
} from 'lucide-react';
import { Client, Service, Professional, PaymentMethod } from '../../types';
import { dataService } from '../../services/dataService';
import { getTodayDateString } from '../../data/mockDatabase';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onNavigateToCadastro?: () => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onNavigateToCadastro,
}) => {
  const clients = useMemo(() => dataService.getClients(), [isOpen]);
  const services = useMemo(() => dataService.getServices(), [isOpen]);
  const professionals = useMemo(() => dataService.getProfessionals(), [isOpen]);
  const existingAppointments = useMemo(() => dataService.getAppointments(), [isOpen]);
  const units = useMemo(() => dataService.getUnits(), [isOpen]);

  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    dataService.getActiveUnitId() !== 'ALL' ? dataService.getActiveUnitId() : 'unit-matriz'
  );
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [startTime, setStartTime] = useState('14:00');
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Set default selections
  useEffect(() => {
    if (isOpen) {
      const activeUnit = dataService.getActiveUnitId();
      setSelectedUnitId(activeUnit !== 'ALL' ? activeUnit : (units[0]?.id || 'unit-matriz'));
      if (clients.length > 0) setSelectedClientId(clients[0].id);
      if (services.length > 0) setSelectedServiceId(services[0].id);
      if (professionals.length > 0) setSelectedProfessionalId(professionals[0].id);
      setDate(getTodayDateString());
      setStartTime('14:00');
      setDiscount(0);
      setPaymentMethod('pix');
      setNotes('');
      setErrorMessage(null);
    }
  }, [isOpen, clients, services, professionals, units]);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedProfessional = professionals.find((p) => p.id === selectedProfessionalId);
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  // Calculate duration and end time
  const duration = selectedService?.durationMinutes || 45;
  const originalPrice = selectedService?.price || 0;
  const finalPrice = Math.max(0, originalPrice - discount);

  const endTime = useMemo(() => {
    if (!startTime) return '';
    const [h, m] = startTime.split(':').map(Number);
    const totalMin = h * 60 + m + duration;
    const endH = Math.floor(totalMin / 60);
    const endM = totalMin % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }, [startTime, duration]);

  // Real-time conflict validation
  const conflictDetails = useMemo(() => {
    if (!selectedProfessionalId || !date || !startTime) return null;

    const [startH, startM] = startTime.split(':').map(Number);
    const newStart = startH * 60 + startM;
    const newEnd = newStart + duration;

    // Check against existing appointments
    const conflictApt = existingAppointments.find((apt) => {
      if (apt.professionalId !== selectedProfessionalId || apt.date !== date || apt.status === 'cancelado') {
        return false;
      }
      const [aptStartH, aptStartM] = apt.startTime.split(':').map(Number);
      const [aptEndH, aptEndM] = apt.endTime.split(':').map(Number);
      const aptStart = aptStartH * 60 + aptStartM;
      const aptEnd = aptEndH * 60 + aptEndM;
      return newStart < aptEnd && newEnd > aptStart;
    });

    if (conflictApt) {
      return `Conflito com o agendamento de ${conflictApt.clientName} (${conflictApt.startTime} às ${conflictApt.endTime})`;
    }

    return null;
  }, [selectedProfessionalId, date, startTime, duration, existingAppointments]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedClientId || !selectedServiceId || !selectedProfessionalId) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (conflictDetails) {
      setErrorMessage(`Não é possível agendar: ${conflictDetails}.`);
      return;
    }

    const result = dataService.addAppointment({
      clientId: selectedClientId,
      serviceId: selectedServiceId,
      professionalId: selectedProfessionalId,
      unitId: selectedUnitId,
      date,
      startTime,
      discount,
      paymentMethod,
      notes,
    });

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMessage(result.error || 'Erro ao criar agendamento.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E8E1D7] overflow-hidden my-6 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#EFE8DF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2D2725] text-[#F3E7DC] flex items-center justify-center">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-[#2D2725]">
                Novo Agendamento
              </h3>
              <p className="text-xs text-[#8F8278]">
                Controle inteligente de agenda sem sobreposição de horários
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#8F8278] hover:text-[#2D2725] rounded-full hover:bg-[#EFE8DF] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 0. Unidade / Filial */}
          <div>
            <label className="block text-xs font-semibold text-[#4A423C] mb-1.5 flex items-center gap-1.5">
              <Building2 size={13} className="text-[#B88746]" /> Unidade / Filial do Atendimento *
            </label>
            <select
              id="appointment-unit-select"
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-sm text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
              required
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.address}
                </option>
              ))}
            </select>
          </div>

          {/* 1. Cliente */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#4A423C] flex items-center gap-1.5">
                <User size={13} className="text-[#8F8278]" /> Cliente Pré-Cadastrado *
              </label>
              {onNavigateToCadastro && (
                <button
                  type="button"
                  onClick={onNavigateToCadastro}
                  className="text-[11px] text-[#B88746] hover:text-[#976a30] font-semibold flex items-center gap-1 transition-colors"
                >
                  <UserPlus size={12} /> + Fazer Pré-Cadastro Primeiro
                </button>
              )}
            </div>
            <select
              id="appointment-client-select"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-sm text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
              required
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.phone} {c.documentCpf ? `(CPF: ${c.documentCpf})` : ''}
                </option>
              ))}
            </select>
            {selectedClient && (
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#7A6E65] bg-[#F4F9F5] px-2.5 py-1.5 rounded-lg border border-[#CDE5D5]">
                <span className="flex items-center gap-1 text-emerald-800 font-medium">
                  <CheckCircle2 size={12} className="text-emerald-600" /> Pré-Cadastro Verificado & Liberado
                </span>
                {selectedClient.allergies && (
                  <span className="text-amber-800 font-medium truncate max-w-[200px]">
                    ⚠️ Alergias: {selectedClient.allergies}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 2. Serviço & Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A423C] mb-1.5 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#C5A880]" /> Procedimento / Serviço *
              </label>
              <select
                id="appointment-service-select"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-sm text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                required
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (R$ {s.price})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Profissional */}
            <div>
              <label className="block text-xs font-semibold text-[#4A423C] mb-1.5 flex items-center gap-1.5">
                <UserCheck size={13} className="text-[#8F8278]" /> Profissional Habilitado *
              </label>
              <select
                id="appointment-professional-select"
                value={selectedProfessionalId}
                onChange={(e) => setSelectedProfessionalId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-sm text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                required
              >
                {professionals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.specialty.split('&')[0].trim()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Data & Horário */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-[#4A423C] mb-1.5 flex items-center gap-1.5">
                <Calendar size={13} className="text-[#8F8278]" /> Data *
              </label>
              <input
                id="appointment-date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-sm text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A423C] mb-1.5 flex items-center gap-1.5">
                <Clock size={13} className="text-[#8F8278]" /> Horário Início *
              </label>
              <input
                id="appointment-start-time-input"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                step="900"
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-sm text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A423C] mb-1.5">
                Duração & Término
              </label>
              <div className="px-3.5 py-2 rounded-xl bg-[#F0EAE1] text-xs text-[#524842] flex items-center justify-between font-medium">
                <span>{duration} min</span>
                <span className="font-bold">Até {endTime}</span>
              </div>
            </div>
          </div>

          {/* Conflict Warning Indicator */}
          {conflictDetails ? (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-amber-600" />
              <span>{conflictDetails}</span>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
              <span>Horário 100% disponível para {selectedProfessional?.name}</span>
            </div>
          )}

          {/* 5. Valores e Pagamento */}
          <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#E8E0D5] space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] text-[#8F8278] block">Preço Tabela</span>
                <span className="text-sm font-bold text-[#2D2725]">
                  R$ {originalPrice.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#8F8278] block">Desconto (R$)</span>
                <input
                  type="number"
                  min="0"
                  max={originalPrice}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1 text-xs rounded-lg bg-white border border-[#D5C9BD] text-[#2D2725] focus:outline-none focus:ring-1 focus:ring-[#B88746]"
                />
              </div>
              <div>
                <span className="text-[11px] text-[#8F8278] block">Valor Final</span>
                <span className="text-sm font-extrabold text-[#2D2725]">
                  R$ {finalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A423C] mb-1 flex items-center gap-1.5">
                <CreditCard size={13} className="text-[#8F8278]" /> Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5C9BD] text-xs text-[#2D2725] focus:outline-none"
              >
                <option value="pix">PIX (Instantâneo)</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="link_pagamento">Link de Pagamento Online</option>
              </select>
            </div>
          </div>

          {/* 6. Observações */}
          <div>
            <label className="block text-xs font-semibold text-[#4A423C] mb-1">
              Observações Especiais do Atendimento (Opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Alergia a algum cosmético, preferência de temperatura da sala, etc."
              className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] placeholder-[#9C8F85] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-[#EFE8DF] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#7D7066] hover:bg-[#F3EDE5] rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              id="confirm-appointment-submit-btn"
              type="submit"
              disabled={Boolean(conflictDetails)}
              className="px-5 py-2.5 rounded-xl bg-[#2D2725] hover:bg-[#3D3532] text-white text-xs font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
