// src/components/auth/SocialOnboarding.tsx
import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

interface SocialOnboardingProps {
  userProfile: UserProfile | null;
  onCompleted?: () => void;
}

export const SocialOnboarding: React.FC<SocialOnboardingProps> = ({
  userProfile,
  onCompleted,
}) => {
  const { updateUserProfile, completeRegistration } = useAuth();

  const [cpf, setCpf] = useState(userProfile?.cpf || userProfile?.documentCpf || '');
  const [whatsapp, setWhatsapp] = useState(userProfile?.whatsapp || userProfile?.phone || '');
  const [birthDate, setBirthDate] = useState(userProfile?.birth_date || userProfile?.birthDate || '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Se não houver perfil, ou se o usuário já tiver CPF e WhatsApp preenchidos, não bloqueia
  if (!userProfile) return null;

  const isProfileIncomplete =
    !userProfile.cpf ||
    !userProfile.whatsapp ||
    userProfile.cpf.replace(/\D/g, '').length < 11 ||
    userProfile.whatsapp.replace(/\D/g, '').length < 10;

  if (!isProfileIncomplete) return null;

  const firstName = (userProfile.name || 'Cliente').split(' ')[0];
  const avatar =
    userProfile.avatar_url ||
    userProfile.avatarUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

  // Formatação de CPF: 000.000.000-00
  const formatCPF = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    return raw
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  // Formatação de WhatsApp: (00) 00000-0000
  const formatPhone = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 10) {
      return raw.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return raw.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCpf = cpf.replace(/\D/g, '');
    const cleanPhone = whatsapp.replace(/\D/g, '');

    if (cleanCpf.length < 11) {
      setError('Por favor, informe um CPF válido com 11 dígitos.');
      return;
    }

    if (cleanPhone.length < 10) {
      setError('Por favor, informe um número de WhatsApp válido com DDD.');
      return;
    }

    setLoading(true);

    try {
      // Sincroniza e completa o perfil do usuário
      completeRegistration({
        name: userProfile.name,
        cpf: cpf.trim(),
        birth_date: birthDate || '1995-06-15',
        whatsapp: whatsapp.trim(),
        email: userProfile.email,
        lgpd_consent: true,
      });

      if (onCompleted) {
        onCompleted();
      }
    } catch (err) {
      console.error('Erro ao concluir cadastro social:', err);
      setError('Ocorreu um erro ao salvar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="social-onboarding-overlay"
      className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300"
    >
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-8 sm:p-10 border border-aesthetic-bege/20 animate-in zoom-in-95 duration-200">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-rose-300 p-1 relative shadow-md">
            <img
              src={avatar}
              alt={userProfile.name}
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs">
              <ShieldCheck size={14} />
            </div>
          </div>
          <h2 className="text-2xl font-serif text-graphite font-bold">
            Quase pronto, {firstName}!
          </h2>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Identidade digital do Google sincronizada com sucesso. Para sua segurança e validação
            de agendamentos, precisamos de apenas mais dois dados.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Seu CPF (Documento Único) *
            </label>
            <input
              id="social-onboarding-cpf"
              type="text"
              required
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              placeholder="000.000.000-00"
              maxLength={14}
              className="w-full p-4 rounded-2xl bg-aesthetic-off-white border border-aesthetic-bege/30 focus:border-rose-300 focus:bg-white outline-none text-sm font-medium text-graphite transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              WhatsApp para Notificações *
            </label>
            <input
              id="social-onboarding-whatsapp"
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
              placeholder="(00) 00000-0000"
              maxLength={15}
              className="w-full p-4 rounded-2xl bg-aesthetic-off-white border border-aesthetic-bege/30 focus:border-rose-300 focus:bg-white outline-none text-sm font-medium text-graphite transition-all"
            />
          </div>

          <div className="flex items-center gap-2 px-1 text-[11px] text-gray-400">
            <Lock size={12} className="text-emerald-600 shrink-0" />
            <span>Dados protegidos por criptografia e em conformidade com a LGPD.</span>
          </div>

          <button
            id="btn-submit-social-onboarding"
            type="submit"
            disabled={loading}
            className="w-full bg-graphite text-white py-4 rounded-full font-bold shadow-xl hover:bg-black transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <span>{loading ? 'SINCRONIZANDO...' : 'CONCLUIR E ACESSAR PORTAL'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
