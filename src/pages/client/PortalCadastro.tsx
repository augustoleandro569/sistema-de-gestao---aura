/**
 * @deprecated OBSOLETO: O fluxo de pré-cadastro interno foi substituído pelo Onboarding unificado
 * no login e pelo LoyaltyProfile (/app/perfil). Este arquivo foi removido do fluxo ativo de rotas.
 */
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  FileText,
  AlertCircle,
  Sparkles,
  Phone,
  Calendar as CalendarIcon,
  CreditCard
} from 'lucide-react';

export const PortalCadastro: React.FC = () => {
  const { userProfile, completeRegistration, setPortalRoute } = useAuth();

  const [name, setName] = useState(userProfile?.name || '');
  const [cpf, setCpf] = useState(userProfile?.cpf || '');
  const [birthDate, setBirthDate] = useState(userProfile?.birth_date || '');
  const [whatsapp, setWhatsapp] = useState(userProfile?.whatsapp || userProfile?.phone || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [medicalNotes, setMedicalNotes] = useState(userProfile?.medical_notes || '');
  const [lgpdConsent, setLgpdConsent] = useState(userProfile?.lgpd_consent ?? true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mask CPF
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 9) {
      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (v.length > 6) {
      v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (v.length > 3) {
      v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    setCpf(v);
  };

  // Mask Phone / WhatsApp
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (v.length > 5) {
      v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    }
    setWhatsapp(v);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }
    const rawCpf = cpf.replace(/\D/g, '');
    if (rawCpf.length < 11) {
      setError('Por favor, informe um CPF válido com 11 dígitos.');
      return;
    }
    if (!birthDate) {
      setError('Por favor, informe sua data de nascimento.');
      return;
    }
    const rawPhone = whatsapp.replace(/\D/g, '');
    if (rawPhone.length < 10) {
      setError('Por favor, informe um número de WhatsApp válido.');
      return;
    }
    if (!lgpdConsent) {
      setError('É obrigatório aceitar os termos de consentimento para tratamento de dados em saúde estética.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      completeRegistration({
        name: name.trim(),
        cpf: cpf.trim(),
        birth_date: birthDate,
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        medical_notes: medicalNotes.trim(),
        lgpd_consent: lgpdConsent,
      });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div id="portal-cadastro-page" className="w-full max-w-3xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-200">
      {/* Informative Alert Banner */}
      <div className="bg-[#FAF3EA] border border-[#F0DFCD] rounded-3xl p-5 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#F5E6D3] text-[#B88746] flex items-center justify-center shrink-0 mt-0.5">
          <ShieldAlert size={22} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#B88746] bg-white px-2 py-0.5 rounded-md border border-[#F0DFCD]">
              Redirecionamento Automático
            </span>
            <span className="text-xs font-bold text-[#4A423C]">
              Passo 1: Validação de Cadastro
            </span>
          </div>
          <p className="text-xs text-[#7A6E65] leading-relaxed">
            Seus dados cadastrais e histórico de saúde são essenciais para garantir um atendimento seguro e personalizado. Ao preencher as informações abaixo, o agendamento no calendário será liberado instantaneamente.
          </p>
        </div>
      </div>

      {/* Main Registration Form */}
      <div className="bg-white border border-[#EAE3DA] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-[#EAE3DA] pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#2D2725]">
            Ficha de Pré-Cadastro & Prontuário Estético
          </h2>
          <p className="text-xs text-[#7A6E65] mt-1">
            Preencha seus dados para habilitar o agendamento seguro com nossos especialistas.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#4A423C] mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Carolina Duarte Meirelles"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A423C] mb-1">
                CPF (Documento Único) *
              </label>
              <input
                type="text"
                required
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                maxLength={14}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs font-mono text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A423C] mb-1">
                Data de Nascimento *
              </label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A423C] mb-1">
                WhatsApp (com DDD) *
              </label>
              <input
                type="text"
                required
                placeholder="(11) 99999-9999"
                value={whatsapp}
                onChange={handleWhatsappChange}
                maxLength={15}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A423C] mb-1">
                E-mail (Opcional)
              </label>
              <input
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746]"
              />
            </div>

            {/* Medical notes for aesthetic biosafety */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#4A423C]">
                  Prontuário & Observações Médicas / Estéticas (medical_notes)
                </label>
                <span className="text-[10px] font-bold text-[#B88746] bg-[#FAF3EA] px-2 py-0.5 rounded border border-[#F3E5D4]">
                  Importante para Estética
                </span>
              </div>
              <textarea
                rows={3}
                placeholder="Informe se possui alergias a medicamentos, cosméticos, ácido salicílico, histórico de cicatriz queloide, gravidez/lactação ou cirurgias estéticas recentes..."
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#2D2725] placeholder-[#A89D93] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B88746] resize-none"
              />
            </div>
          </div>

          {/* LGPD Consent */}
          <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE3DA] rounded-2xl space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={lgpdConsent}
                onChange={(e) => setLgpdConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-[#B88746] focus:ring-[#B88746] border-[#D0C2B4]"
              />
              <span className="text-xs text-[#5C524B] leading-snug">
                Autorizo a coleta e o armazenamento seguro de meus dados clínicos e de contato estritamente para fins de atendimento estético, biossegurança e lembretes de consultas, em conformidade com a <strong>LGPD</strong>.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-5 rounded-xl bg-[#2D2725] hover:bg-black text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span>Salvando e liberando agendamento...</span>
            ) : (
              <>
                <UserCheck size={16} className="text-[#E8D1C5]" />
                <span>Salvar Cadastro & Ir para Agendamento</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PortalCadastro;
