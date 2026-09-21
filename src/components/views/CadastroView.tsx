import React, { useState, useEffect, useMemo } from 'react';
import {
  UserPlus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  Sparkles,
  User,
  Phone,
  Mail,
  FileText,
  Search,
  ShieldCheck,
  HeartHandshake,
  Check,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  Tag,
  CreditCard,
  AlertTriangle,
  ArrowLeft,
  UserCheck,
  Eye,
  CheckCircle
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Client, Service, Professional, Appointment, PaymentMethod } from '../../types';
import { getTodayDateString } from '../../data/mockDatabase';

interface CadastroViewProps {
  onNavigateToAgenda?: () => void;
}

export const CadastroView: React.FC<CadastroViewProps> = ({ onNavigateToAgenda }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Navigation steps: 1 = Pré-Cadastro, 2 = Agendamento, 3 = Confirmação
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Sub-tab in Step 1: 'novo' (novo formulário) or 'buscar' (pesquisar cliente já cadastrado)
  const [preRegMode, setPreRegMode] = useState<'novo' | 'buscar'>('novo');

  // Step 1: New Pre-Registration Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [documentCpf, setDocumentCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [allergies, setAllergies] = useState('');
  const [healthConditions, setHealthConditions] = useState('');
  const [skinTypeOrConcerns, setSkinTypeOrConcerns] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [notes, setNotes] = useState('');
  const [lgpdConsent, setLgpdConsent] = useState(true);

  // Search existing pre-registered client
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);

  // Active verified client for scheduling
  const [confirmedClient, setConfirmedClient] = useState<Client | null>(null);

  // Step 2: Appointment Form State
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(getTodayDateString());
  const [appointmentTime, setAppointmentTime] = useState('14:00');
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [appointmentError, setAppointmentError] = useState<string | null>(null);

  // Step 3: Success state
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Notification banners
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Load data & subscribe to updates
  const loadData = () => {
    setClients(dataService.getClients());
    setServices(dataService.getServices());
    setProfessionals(dataService.getProfessionals());
    setAppointments(dataService.getAppointments());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = dataService.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  // Initialize appointment defaults once services/professionals load
  useEffect(() => {
    if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
    if (professionals.length > 0 && !selectedProfessionalId) {
      setSelectedProfessionalId(professionals[0].id);
    }
  }, [services, professionals, selectedServiceId, selectedProfessionalId]);

  // Handle Search for Existing Pre-registered client
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const cleanQ = searchQuery.toLowerCase().trim();
    const cleanNumbers = searchQuery.replace(/\D/g, '');

    const filtered = clients.filter((c) => {
      const matchName = c.name.toLowerCase().includes(cleanQ);
      const matchEmail = c.email?.toLowerCase().includes(cleanQ);
      const matchPhone = cleanNumbers.length >= 3 && (c.phone.replace(/\D/g, '').includes(cleanNumbers) || (c.whatsapp || '').replace(/\D/g, '').includes(cleanNumbers));
      const matchCpf = cleanNumbers.length >= 3 && (c.documentCpf || '').replace(/\D/g, '').includes(cleanNumbers);
      return matchName || matchEmail || matchPhone || matchCpf;
    });

    setSearchResults(filtered);
  }, [searchQuery, clients]);

  // Calculate duration and end time for Step 2
  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedProfessional = professionals.find((p) => p.id === selectedProfessionalId);
  const serviceDuration = selectedService?.durationMinutes || 45;
  const originalPrice = selectedService?.price || 0;
  const finalPrice = Math.max(0, originalPrice - discount);

  const calculatedEndTime = useMemo(() => {
    if (!appointmentTime) return '';
    const [h, m] = appointmentTime.split(':').map(Number);
    const totalMin = h * 60 + m + serviceDuration;
    const endH = Math.floor(totalMin / 60);
    const endM = totalMin % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }, [appointmentTime, serviceDuration]);

  // Conflict validation for Step 2
  const conflictDetails = useMemo(() => {
    if (!selectedProfessionalId || !appointmentDate || !appointmentTime) return null;

    const [startH, startM] = appointmentTime.split(':').map(Number);
    const newStart = startH * 60 + startM;
    const newEnd = newStart + serviceDuration;

    const conflictApt = appointments.find((apt) => {
      if (
        apt.professionalId !== selectedProfessionalId ||
        apt.date !== appointmentDate ||
        apt.status === 'cancelado'
      ) {
        return false;
      }
      const [aptStartH, aptStartM] = apt.startTime.split(':').map(Number);
      const [aptEndH, aptEndM] = apt.endTime.split(':').map(Number);
      const aptStart = aptStartH * 60 + aptStartM;
      const aptEnd = aptEndH * 60 + aptEndM;
      return newStart < aptEnd && newEnd > aptStart;
    });

    if (conflictApt) {
      return `Conflito com o agendamento de ${conflictApt.clientName} (${conflictApt.startTime} às ${conflictApt.endTime}) com ${conflictApt.professionalName}.`;
    }

    return null;
  }, [selectedProfessionalId, appointmentDate, appointmentTime, serviceDuration, appointments]);

  // Step 1: Submit new pre-registration
  const handlePreRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    setFeedbackSuccess(null);

    if (!name.trim() || !phone.trim()) {
      setFeedbackError('Nome completo e Telefone / WhatsApp são obrigatórios.');
      return;
    }

    if (!lgpdConsent) {
      setFeedbackError('É necessário o consentimento do uso dos dados para o prontuário da clínica.');
      return;
    }

    // Check if client with same CPF or phone already exists
    const cleanNewPhone = phone.replace(/\D/g, '');
    const cleanNewCpf = documentCpf.replace(/\D/g, '');

    const existingMatch = clients.find((c) => {
      if (cleanNewCpf && (c.documentCpf || '').replace(/\D/g, '') === cleanNewCpf) return true;
      if (cleanNewPhone && c.phone.replace(/\D/g, '') === cleanNewPhone) return true;
      return false;
    });

    let activeClient: Client;

    if (existingMatch) {
      // Update existing
      const updated = dataService.updateClient(existingMatch.id, {
        name: name.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        email: email.trim(),
        cpf: documentCpf.trim(),
        documentCpf: documentCpf.trim(),
        birth_date: birthDate || existingMatch.birthDate,
        birthDate: birthDate || existingMatch.birthDate,
        address: address.trim() || existingMatch.address,
        allergies: allergies.trim() || existingMatch.allergies,
        healthConditions: healthConditions.trim() || existingMatch.healthConditions,
        skinTypeOrConcerns: skinTypeOrConcerns.trim() || existingMatch.skinTypeOrConcerns,
        emergencyContact: emergencyContact.trim() || existingMatch.emergencyContact,
        medical_notes: medicalNotes.trim() || existingMatch.medical_notes || existingMatch.medicalNotes,
        medicalNotes: medicalNotes.trim() || existingMatch.medical_notes || existingMatch.medicalNotes,
        notes: notes.trim() || existingMatch.notes,
        lgpd_consent: lgpdConsent,
        lgpdConsent: lgpdConsent,
        registration_completed: true,
        registrationCompleted: true,
        preRegistrationCompleted: true,
      });
      activeClient = updated || existingMatch;
      setFeedbackSuccess(`Pré-cadastro atualizado com sucesso para ${activeClient.name}! Agendamento liberado.`);
    } else {
      // Create new client
      activeClient = dataService.addClient({
        name: name.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        email: email.trim(),
        cpf: documentCpf.trim(),
        documentCpf: documentCpf.trim(),
        birth_date: birthDate,
        birthDate,
        address: address.trim(),
        allergies: allergies.trim(),
        healthConditions: healthConditions.trim(),
        skinTypeOrConcerns: skinTypeOrConcerns.trim(),
        emergencyContact: emergencyContact.trim(),
        medical_notes: medicalNotes.trim(),
        medicalNotes: medicalNotes.trim(),
        notes: notes.trim() || medicalNotes.trim(),
        lgpd_consent: lgpdConsent,
        lgpdConsent: lgpdConsent,
        registration_completed: true,
        registrationCompleted: true,
      });
      setFeedbackSuccess(`Pré-cadastro concluído com sucesso para ${activeClient.name}! Agendamento liberado.`);
    }

    setConfirmedClient(activeClient);
    setCurrentStep(2); // Automatically advance to unlocked scheduling step!
  };

  // Select an already registered client from search
  const handleSelectClient = (client: Client) => {
    setConfirmedClient(client);
    setFeedbackSuccess(`Cliente selecionado: ${client.name}. Pré-cadastro verificado e agendamento liberado!`);
    setCurrentStep(2);
  };

  // Step 2: Submit Appointment
  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentError(null);

    if (!confirmedClient) {
      setAppointmentError('Atenção: Nenhum cliente pré-cadastrado foi selecionado.');
      setCurrentStep(1);
      return;
    }

    if (!selectedServiceId || !selectedProfessionalId || !appointmentDate || !appointmentTime) {
      setAppointmentError('Preencha todos os campos do agendamento.');
      return;
    }

    if (conflictDetails) {
      setAppointmentError(conflictDetails);
      return;
    }

    const result = dataService.addAppointment({
      clientId: confirmedClient.id,
      serviceId: selectedServiceId,
      professionalId: selectedProfessionalId,
      date: appointmentDate,
      startTime: appointmentTime,
      discount,
      paymentMethod,
      notes: appointmentNotes,
    });

    if (result.success && result.appointment) {
      setCreatedAppointment(result.appointment);
      setCurrentStep(3); // Show confirmed summary!
    } else {
      setAppointmentError(result.error || 'Erro ao realizar agendamento.');
    }
  };

  // Reset entire flow for a new client
  const handleResetFlow = () => {
    setName('');
    setPhone('');
    setWhatsapp('');
    setEmail('');
    setDocumentCpf('');
    setBirthDate('');
    setAddress('');
    setAllergies('');
    setHealthConditions('');
    setSkinTypeOrConcerns('');
    setEmergencyContact('');
    setNotes('');
    setConfirmedClient(null);
    setCreatedAppointment(null);
    setSearchQuery('');
    setFeedbackError(null);
    setFeedbackSuccess(null);
    setAppointmentError(null);
    setCurrentStep(1);
  };

  // Send WhatsApp message to client with confirmation
  const handleSendWhatsAppConfirmation = () => {
    if (!createdAppointment || !confirmedClient) return;
    const dateFormatted = new Date(createdAppointment.date + 'T00:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    });

    const msg =
      `Olá, *${confirmedClient.name}*! ✨\n\n` +
      `Seu agendamento na *Clínica Sublime Estética* foi confirmado com sucesso!\n\n` +
      `🗓 *Data:* ${dateFormatted}\n` +
      `⏰ *Horário:* ${createdAppointment.startTime} às ${createdAppointment.endTime}\n` +
      `💆‍♀️ *Procedimento:* ${createdAppointment.serviceName}\n` +
      `👩‍⚕️ *Especialista:* ${createdAppointment.professionalName}\n` +
      `💵 *Valor:* R$ ${createdAppointment.finalPrice.toFixed(2).replace('.', ',')}\n\n` +
      `📍 *Local:* Alameda Santos, 1893, Conj. 62 - Cerqueira César / Jardins\n` +
      `Qualquer dúvida ou necessidade de reagendamento, nos avise com antecedência. Até breve! 🌸`;

    const cleanNum = confirmedClient.whatsapp || confirmedClient.phone.replace(/\D/g, '');
    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* HEADER PRINCIPAL */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE2D7] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#2D2725] text-[#F3E7DC] shadow-xs flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#E8D1C5]" /> 1º PASSO DO ATENDIMENTO
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#EBF5EE] text-[#1E6B3F] border border-[#CDE5D5] flex items-center gap-1">
              <ShieldCheck size={12} /> PROTOCOLO DE SEGURANÇA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#2D2725] tracking-tight">
            Pré-Cadastro & Agendamento Exclusivo
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6E65] max-w-2xl leading-relaxed">
            Por normas de biossegurança e prontuário estético individualizado, o cliente <strong>somente consegue realizar agendamentos após a validação do pré-cadastro</strong>.
          </p>
        </div>

        {/* Status Tracker */}
        <div className="flex items-center gap-3 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EDE7DF] shrink-0">
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8F8278]">Status do Fluxo</span>
            <span className="text-xs font-bold text-[#2D2725]">
              {currentStep === 1
                ? 'Aguardando Pré-Cadastro'
                : currentStep === 2
                ? 'Agendamento Liberado 🔓'
                : 'Agendamento Confirmado 🎉'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E0D7CC] flex items-center justify-center text-[#2D2725] shadow-xs">
            {currentStep === 1 ? (
              <Lock size={18} className="text-amber-600 animate-pulse" />
            ) : currentStep === 2 ? (
              <Unlock size={18} className="text-emerald-600" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-600" />
            )}
          </div>
        </div>
      </div>

      {/* STEPPER PROGRESS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 Indicator */}
        <div
          onClick={() => {
            if (currentStep !== 1) setCurrentStep(1);
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            currentStep === 1
              ? 'bg-white border-[#2D2725] shadow-md ring-2 ring-[#2D2725]/10'
              : confirmedClient
              ? 'bg-[#F4F9F5] border-[#CDE5D5]'
              : 'bg-white/60 border-[#EDE7DF]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                confirmedClient
                  ? 'bg-emerald-600 text-white'
                  : currentStep === 1
                  ? 'bg-[#2D2725] text-white'
                  : 'bg-[#EDE7DF] text-[#8F8278]'
              }`}
            >
              {confirmedClient ? <Check size={16} /> : '1'}
            </div>
            <div>
              <p className="text-xs font-bold text-[#2D2725] flex items-center gap-1.5">
                Passo 1: Pré-Cadastro Obrigatório
                {confirmedClient && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Concluído
                  </span>
                )}
              </p>
              <p className="text-[11px] text-[#8F8278]">
                {confirmedClient
                  ? `Cliente: ${confirmedClient.name} (${confirmedClient.phone})`
                  : 'Dados cadastrais, contato e anamnese básica'}
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#B3A69A]" />
        </div>

        {/* Step 2 Indicator */}
        <div
          onClick={() => {
            if (confirmedClient) setCurrentStep(2);
          }}
          className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
            currentStep === 2
              ? 'bg-white border-[#2D2725] shadow-md ring-2 ring-[#2D2725]/10 cursor-pointer'
              : currentStep === 3
              ? 'bg-[#F4F9F5] border-[#CDE5D5] cursor-pointer'
              : 'bg-[#FAF8F5]/80 border-[#E8E1D7] opacity-80 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                currentStep === 3
                  ? 'bg-emerald-600 text-white'
                  : currentStep === 2
                  ? 'bg-[#2D2725] text-white'
                  : 'bg-[#E8E1D7] text-[#9E9085]'
              }`}
            >
              {currentStep === 3 ? <Check size={16} /> : currentStep === 2 ? '2' : <Lock size={15} />}
            </div>
            <div>
              <p className="text-xs font-bold text-[#2D2725] flex items-center gap-1.5">
                Passo 2: Agendamento do Serviço
                {!confirmedClient ? (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <Lock size={10} /> Bloqueado até Passo 1
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <Unlock size={10} /> Liberado
                  </span>
                )}
              </p>
              <p className="text-[11px] text-[#8F8278]">
                {confirmedClient
                  ? 'Procedimento, especialista, dia, hora e pagamento'
                  : 'Requer pré-cadastro verificado para liberação'}
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#B3A69A]" />
        </div>
      </div>

      {/* FEEDBACK BANNERS */}
      {feedbackSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
            <span className="font-medium">{feedbackSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            Fechar
          </button>
        </div>
      )}

      {feedbackError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-700 shrink-0" />
            <span className="font-medium">{feedbackError}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackError(null)}
            className="text-rose-700 hover:text-rose-900 text-xs font-bold"
          >
            Fechar
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ETAPA 1: PRÉ-CADASTRO DO CLIENTE (OBRIGATÓRIO) */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE2D7] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EBE4]">
            <div>
              <h2 className="text-xl font-display font-bold text-[#2D2725] flex items-center gap-2">
                <UserPlus className="text-[#B88746]" size={20} />
                Etapa 1: Pré-Cadastro de Cliente
              </h2>
              <p className="text-xs text-[#7A6E65] mt-0.5">
                Preencha os dados do novo cliente ou busque um cadastro existente no sistema
              </p>
            </div>

            {/* Sub-tab switcher */}
            <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#EDE7DF] shrink-0">
              <button
                type="button"
                onClick={() => setPreRegMode('novo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  preRegMode === 'novo'
                    ? 'bg-white text-[#2D2725] shadow-xs'
                    : 'text-[#8F8278] hover:text-[#2D2725]'
                }`}
              >
                + Novo Pré-Cadastro
              </button>
              <button
                type="button"
                onClick={() => setPreRegMode('buscar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  preRegMode === 'buscar'
                    ? 'bg-white text-[#2D2725] shadow-xs'
                    : 'text-[#8F8278] hover:text-[#2D2725]'
                }`}
              >
                🔍 Localizar Cadastrado
              </button>
            </div>
          </div>

          {/* MODO A: FORMULÁRIO DE NOVO PRÉ-CADASTRO */}
          {preRegMode === 'novo' ? (
            <form onSubmit={handlePreRegistrationSubmit} className="space-y-6">
              {/* Bloco 1: Identificação Básica */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8F8278] flex items-center gap-1.5">
                  <User size={14} className="text-[#B88746]" /> 1. Dados Pessoais Obrigatórios
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#4A423C] mb-1">
                      Nome Completo do Cliente *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Gabriela Fontana Silveira"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] placeholder-[#A89D93] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A423C] mb-1">
                      CPF *
                    </label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={documentCpf}
                      onChange={(e) => setDocumentCpf(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] placeholder-[#A89D93] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A423C] mb-1">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(11) 99999-8888"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (!whatsapp) setWhatsapp(e.target.value);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] placeholder-[#A89D93] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A423C] mb-1">
                      E-mail para Confirmação
                    </label>
                    <input
                      type="email"
                      placeholder="gabriela@exemplo.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] placeholder-[#A89D93] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A423C] mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                    />
                  </div>
                </div>
              </div>

              {/* Bloco 2: Localização & Emergência */}
              <div className="space-y-3 pt-4 border-t border-[#F0EBE4]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8F8278] flex items-center gap-1.5">
                  <Phone size={14} className="text-[#B88746]" /> 2. Endereço & Contato de Apoio
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A423C] mb-1">
                      Endereço Residencial (Bairro / Cidade)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Av. Paulista, 1000 - Bela Vista, São Paulo"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] placeholder-[#A89D93] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A423C] mb-1">
                      Contato de Emergência (Nome e Telefone)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Carlos (Esposo) - (11) 98888-7777"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] placeholder-[#A89D93] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                    />
                  </div>
                </div>
              </div>

              {/* Bloco 3: Anamnese & Cuidados Estéticos Especiais */}
              <div className="space-y-3 pt-4 border-t border-[#F0EBE4]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8F8278] flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-amber-600" /> 3. Ficha Estética & Saúde Prévia
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A423C] mb-1">
                      Alergias ou Sensibilidades Conhecidas
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Ácido salicílico, látex, iodo, anestésicos tópicos..."
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] placeholder-[#A89D93] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A423C] mb-1">
                      Condições Especiais (Gestante, Lactante, Cirurgias Recentes)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Lactante (6 meses), cicatriz recente, botox prévio..."
                      value={healthConditions}
                      onChange={(e) => setHealthConditions(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] placeholder-[#A89D93] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#4A423C] mb-1">
                      Tipo de Pele ou Queixa Principal / Objetivo Estético
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Pele mista com tendência a oleosidade na zona T; busca rejuvenescimento e estímulo de colágeno facial."
                      value={skinTypeOrConcerns}
                      onChange={(e) => setSkinTypeOrConcerns(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] placeholder-[#A89D93] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746] resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-[#4A423C]">
                        Prontuário & Observações Médicas / Estéticas (medical_notes)
                      </label>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#B88746] bg-[#FAF3EA] px-2 py-0.5 rounded-md border border-[#F3E5D4]">
                        Importante para Estética
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Ex: Histórico de rosácea leve, uso de ácidos noturnos, restrição a peelings abrasivos ou observações de biossegurança..."
                      value={medicalNotes}
                      onChange={(e) => setMedicalNotes(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] placeholder-[#A89D93] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* LGPD & Consentimento */}
              <div className="pt-4 border-t border-[#F0EBE4] space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={lgpdConsent}
                    onChange={(e) => setLgpdConsent(e.target.checked)}
                    className="mt-0.5 rounded text-[#2D2725] focus:ring-[#B88746]"
                  />
                  <span className="text-[11px] text-[#7A6E65] leading-relaxed">
                    Declaro que as informações preenchidas são verdadeiras e autorizo o armazenamento seguro dos dados para fins de prontuário estético e agendamento de procedimentos, em conformidade com a <strong>LGPD</strong> e políticas da clínica.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F0EBE4]">
                <div className="text-xs text-[#8F8278] flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>Ao concluir, a Etapa de Agendamento será liberada imediatamente.</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#2D2725] hover:bg-black text-white text-xs font-semibold tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <CheckCircle2 size={16} className="text-[#E8D1C5]" />
                  <span>Concluir Pré-Cadastro & Liberar Agendamento</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>
          ) : (
            /* MODO B: BUSCAR CLIENTE JÁ CADASTRADO */
            <div className="space-y-4">
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EDE7DF] space-y-3">
                <p className="text-xs font-semibold text-[#4A423C]">
                  Busque o cliente pelo nome, CPF ou número de WhatsApp para carregar o cadastro prévio:
                </p>
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-3 text-[#8F8278]" />
                  <input
                    type="text"
                    placeholder="Digite o nome, CPF ou telefone do cliente..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#E0D7CC] text-xs text-[#2D2725] placeholder-[#A89D93] focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                  />
                </div>
              </div>

              {/* Search Results List */}
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                  {searchResults.map((cli) => (
                    <div
                      key={cli.id}
                      onClick={() => handleSelectClient(cli)}
                      className="p-4 rounded-2xl bg-white border border-[#EDE7DF] hover:border-[#2D2725] hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={cli.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                          alt={cli.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#EDE7DF]"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#2D2725] truncate group-hover:text-[#B88746] transition-colors">
                            {cli.name}
                          </p>
                          <p className="text-[11px] text-[#8F8278] truncate flex items-center gap-1">
                            <Phone size={10} /> {cli.phone}
                          </p>
                          {cli.documentCpf && (
                            <p className="text-[10px] text-[#9E9085]">CPF: {cli.documentCpf}</p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-full bg-[#2D2725] group-hover:bg-[#B88746] text-white text-[10px] font-bold uppercase tracking-wider shrink-0 transition-colors"
                      >
                        Selecionar →
                      </button>
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-8 bg-[#FAF8F5] rounded-2xl border border-dashed border-[#E0D7CC] space-y-2">
                  <UserPlus className="mx-auto text-[#B3A69A]" size={24} />
                  <p className="text-xs font-semibold text-[#4A423C]">
                    Nenhum cliente pré-cadastrado encontrado para "{searchQuery}".
                  </p>
                  <p className="text-[11px] text-[#8F8278]">
                    Deseja realizar o pré-cadastro agora?
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPreRegMode('novo');
                      setName(searchQuery);
                    }}
                    className="px-4 py-2 rounded-full bg-[#2D2725] text-white text-xs font-semibold"
                  >
                    Fazer Pré-Cadastro Novo
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-[#8F8278]">
                  Digite pelo menos 3 caracteres para buscar entre os clientes já cadastrados.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ETAPA 2: AGENDAMENTO EXCLUSIVO (LIBERADO SOMENTE APÓS PRÉ-CADASTRO) */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Confirmed Client Banner */}
          {confirmedClient ? (
            <div className="bg-[#EBF5EE] rounded-3xl p-5 border border-[#CDE5D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={confirmedClient.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                  alt={confirmedClient.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-300"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#14492A] font-display">
                      {confirmedClient.name}
                    </h3>
                    <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle size={10} /> Pré-Cadastro Verificado
                    </span>
                  </div>
                  <p className="text-xs text-[#2A6E46] mt-0.5">
                    Telefone: {confirmedClient.phone} {confirmedClient.whatsapp && `• WhatsApp: ${confirmedClient.whatsapp}`} {(confirmedClient.cpf || confirmedClient.documentCpf) && `• CPF: ${confirmedClient.cpf || confirmedClient.documentCpf}`} {(confirmedClient.birth_date || confirmedClient.birthDate) && `• Nasc: ${confirmedClient.birth_date || confirmedClient.birthDate}`}
                  </p>
                  {(confirmedClient.medical_notes || confirmedClient.medicalNotes || confirmedClient.allergies) && (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#14492A] bg-white/80 px-2.5 py-1 rounded-lg border border-[#CDE5D5]">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-[#B88746]">Prontuário Estético:</span>
                      <span className="truncate max-w-lg">{confirmedClient.medical_notes || confirmedClient.medicalNotes || confirmedClient.allergies}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#CDE5D5] text-[#14492A] text-xs font-semibold hover:bg-emerald-100/50 transition-colors"
                >
                  Trocar Cliente
                </button>
              </div>
            </div>
          ) : (
            /* Locked State (if arrived without client) */
            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                  <Lock size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Agendamento Bloqueado</h4>
                  <p className="text-xs text-amber-800">
                    O pré-cadastro do cliente é mandatório para prosseguir com a reserva de horário.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-full bg-amber-900 text-white text-xs font-semibold hover:bg-amber-950 transition-colors"
              >
                Voltar para o Pré-Cadastro
              </button>
            </div>
          )}

          {/* Form de Agendamento */}
          {confirmedClient && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE2D7] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE4]">
                <div>
                  <h2 className="text-xl font-display font-bold text-[#2D2725] flex items-center gap-2">
                    <Calendar className="text-[#B88746]" size={20} />
                    Etapa 2: Seleção de Procedimento & Horário
                  </h2>
                  <p className="text-xs text-[#7A6E65]">
                    Escolha o procedimento desejado, a profissional e o horário na agenda da clínica
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    ✓ Horários em Tempo Real
                  </span>
                </div>
              </div>

              {appointmentError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle size={16} className="shrink-0 text-red-700" />
                  <span>{appointmentError}</span>
                </div>
              )}

              <form onSubmit={handleAppointmentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Procedimento */}
                  <div>
                    <label className="block text-xs font-semibold text-[#4A423C] mb-1.5 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#B88746]" /> Procedimento / Serviço *
                    </label>
                    <select
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — {s.durationMinutes} min — R$ {s.price.toFixed(2).replace('.', ',')}
                        </option>
                      ))}
                    </select>
                    {selectedService && (
                      <p className="text-[11px] text-[#8F8278] mt-1.5 italic">
                        {selectedService.description}
                      </p>
                    )}
                  </div>

                  {/* Profissional */}
                  <div>
                    <label className="block text-xs font-semibold text-[#4A423C] mb-1.5 flex items-center gap-1.5">
                      <UserCheck size={13} className="text-[#B88746]" /> Especialista Responsável *
                    </label>
                    <select
                      value={selectedProfessionalId}
                      onChange={(e) => setSelectedProfessionalId(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                    >
                      {professionals.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.roleTitle || 'Especialista'})
                        </option>
                      ))}
                    </select>
                    {selectedProfessional && (
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#7A6E65]">
                        <span>Comissão: {selectedProfessional.commissionRate}%</span>
                        <span>•</span>
                        <span>Avaliação: ⭐ {selectedProfessional.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Data */}
                  <div>
                    <label className="block text-xs font-semibold text-[#4A423C] mb-1.5 flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#B88746]" /> Data do Atendimento *
                    </label>
                    <input
                      type="date"
                      required
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                    />
                  </div>

                  {/* Horário */}
                  <div>
                    <label className="block text-xs font-semibold text-[#4A423C] mb-1.5 flex items-center gap-1.5">
                      <Clock size={13} className="text-[#B88746]" /> Horário de Início *
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                      >
                        {[
                          '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
                          '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
                          '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
                          '18:00', '18:30', '19:00'
                        ].map((timeSlot) => (
                          <option key={timeSlot} value={timeSlot}>
                            {timeSlot}
                          </option>
                        ))}
                      </select>
                      <span className="text-xs text-[#8F8278] whitespace-nowrap">
                        até {calculatedEndTime}
                      </span>
                    </div>
                  </div>

                  {/* Pagamento */}
                  <div>
                    <label className="block text-xs font-semibold text-[#4A423C] mb-1.5 flex items-center gap-1.5">
                      <CreditCard size={13} className="text-[#B88746]" /> Forma de Pagamento Pretendida
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                    >
                      <option value="pix">PIX (Confirmação Imediata)</option>
                      <option value="cartao_credito">Cartão de Crédito</option>
                      <option value="cartao_debito">Cartão de Débito</option>
                      <option value="dinheiro">Dinheiro</option>
                      <option value="link_pagamento">Link de Pagamento Online</option>
                    </select>
                  </div>

                  {/* Desconto Cortesia */}
                  <div>
                    <label className="block text-xs font-semibold text-[#4A423C] mb-1.5 flex items-center gap-1.5">
                      <Tag size={13} className="text-[#B88746]" /> Desconto Promocional (R$)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="5"
                      value={discount}
                      onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                    />
                  </div>
                </div>

                {/* Resumo Financeiro */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE7DF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[#8F8278] block text-[10px]">Valor Tabela:</span>
                      <span className="font-bold text-[#2D2725]">R$ {originalPrice.toFixed(2).replace('.', ',')}</span>
                    </div>
                    {discount > 0 && (
                      <div>
                        <span className="text-emerald-700 block text-[10px]">Desconto:</span>
                        <span className="font-bold text-emerald-700">- R$ {discount.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-[#8F8278] block text-[10px]">Duração Estimada:</span>
                      <span className="font-bold text-[#2D2725]">{serviceDuration} minutos</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#8F8278] uppercase tracking-wider font-semibold block">
                      Total a Pagar
                    </span>
                    <span className="text-lg font-bold text-[#2D2725] font-display">
                      R$ {finalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Conflict warning if any */}
                {conflictDetails && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-700 shrink-0" />
                    <span>{conflictDetails}</span>
                  </div>
                )}

                {/* Observações */}
                <div>
                  <label className="block text-xs font-semibold text-[#4A423C] mb-1">
                    Instruções ou Observações para a Profissional
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Primeira sessão do protocolo. Cliente prefere música relaxante suave."
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                  />
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-between pt-4 border-t border-[#F0EBE4]">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 rounded-full border border-[#E0D7CC] text-[#2D2725] text-xs font-semibold hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} /> Voltar ao Cadastro
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3 rounded-full bg-[#2D2725] hover:bg-black text-white text-xs font-semibold tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 size={16} className="text-[#E8D1C5]" />
                    <span>Confirmar Agendamento</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ETAPA 3: CONFIRMAÇÃO & COMPROVANTE */}
      {/* ========================================================================= */}
      {currentStep === 3 && createdAppointment && confirmedClient && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EAE2D7] shadow-lg space-y-6 text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800">
              PRÉ-CADASTRO & AGENDAMENTO CONCLUÍDOS
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-display font-bold text-[#2D2725] mt-2">
              Agendamento Confirmado com Sucesso!
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6E65] mt-1">
              O horário está reservado e sincronizado com a agenda e com o prontuário da cliente.
            </p>
          </div>

          {/* Resumo do Comprovante */}
          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EDE7DF] text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D7]">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#8F8278]">Cliente Pré-Cadastrado</p>
                <p className="text-sm font-bold text-[#2D2725]">{confirmedClient.name}</p>
                <p className="text-xs text-[#8F8278]">{confirmedClient.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-[#8F8278]">Protocolo</p>
                <p className="text-xs font-mono font-bold text-[#2D2725]">{createdAppointment.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#8F8278] block text-[10px]">Procedimento</span>
                <span className="font-semibold text-[#2D2725]">{createdAppointment.serviceName}</span>
              </div>
              <div>
                <span className="text-[#8F8278] block text-[10px]">Especialista</span>
                <span className="font-semibold text-[#2D2725]">{createdAppointment.professionalName}</span>
              </div>
              <div>
                <span className="text-[#8F8278] block text-[10px]">Data & Horário</span>
                <span className="font-semibold text-[#2D2725]">
                  {createdAppointment.date} às {createdAppointment.startTime} ({createdAppointment.durationMinutes} min)
                </span>
              </div>
              <div>
                <span className="text-[#8F8278] block text-[10px]">Valor Final</span>
                <span className="font-bold text-emerald-800">
                  R$ {createdAppointment.finalPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSendWhatsAppConfirmation}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <MessageSquare size={16} />
              <span>Enviar Confirmação no WhatsApp</span>
            </button>

            {onNavigateToAgenda && (
              <button
                type="button"
                onClick={onNavigateToAgenda}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#2D2725] hover:bg-black text-white text-xs font-bold transition-all cursor-pointer"
              >
                Ver na Agenda
              </button>
            )}

            <button
              type="button"
              onClick={handleResetFlow}
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#E0D7CC] text-[#2D2725] text-xs font-bold hover:bg-[#FAF8F5] transition-all cursor-pointer"
            >
              Novo Pré-Cadastro
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEÇÃO INFERIOR: CLIENTES PRÉ-CADASTRADOS RECENTES */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE2D7] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-display font-bold text-[#2D2725] flex items-center gap-2">
              <UserCheck size={18} className="text-[#B88746]" />
              Clientes Pré-Cadastrados no Sistema ({clients.length})
            </h3>
            <p className="text-xs text-[#7A6E65]">
              Clientes aptos para agendamento imediato ou já agendados
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.slice(0, 6).map((cli) => {
            const hasNextAppointment = Boolean(cli.nextAppointmentDate);
            return (
              <div
                key={cli.id}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE7DF] flex flex-col justify-between gap-3 hover:border-[#D0C2B4] transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={cli.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                      alt={cli.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-[#E0D7CC]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#2D2725]">{cli.name}</h4>
                      <p className="text-[11px] text-[#8F8278] flex items-center gap-1">
                        <Phone size={10} /> {cli.phone}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      hasNextAppointment
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {hasNextAppointment ? 'Agendado' : 'Aguardando'}
                  </span>
                </div>

                <div className="text-[11px] text-[#7A6E65] space-y-1 pt-2 border-t border-[#EDE7DF]">
                  {cli.documentCpf && (
                    <p className="flex justify-between">
                      <span className="text-[#9E9085]">CPF:</span>
                      <span className="font-mono font-medium">{cli.documentCpf}</span>
                    </p>
                  )}
                  {cli.allergies && (
                    <p className="flex justify-between text-amber-800 font-medium">
                      <span>Alergias:</span>
                      <span className="truncate max-w-[150px]">{cli.allergies}</span>
                    </p>
                  )}
                  {cli.nextAppointmentDate && (
                    <p className="flex justify-between text-emerald-800 font-medium">
                      <span>Próx. Atendimento:</span>
                      <span>{cli.nextAppointmentDate}</span>
                    </p>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleSelectClient(cli)}
                    className="w-full py-2 rounded-xl bg-[#2D2725] hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Calendar size={13} className="text-[#E8D1C5]" />
                    <span>Agendar para este Cliente →</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CadastroView;
