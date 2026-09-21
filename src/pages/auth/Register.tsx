// src/pages/auth/Register.tsx
import React, { useState } from 'react';
import { User, Phone, Fingerprint, Mail, Lock, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLayout } from '../../layouts/LayoutContext';

interface RegistrationPageProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onSuccess,
  onSwitchToLogin
}) => {
  const { registerWithCpf, login } = useAuth();
  let layout: ReturnType<typeof useLayout> | null = null;
  try {
    layout = useLayout();
  } catch {
    // optional layout context
  }

  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Formatação de CPF: 000.000.000-00
  const handleCpfChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    const formatted = raw
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(formatted);
  };

  // Formatação de WhatsApp: (00) 00000-0000
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 10) {
      setWhatsapp(raw.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3'));
    } else {
      setWhatsapp(raw.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCpf = cpf.replace(/\D/g, '');
    const cleanPhone = whatsapp.replace(/\D/g, '');

    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
      setError('Por favor, digite seu nome e sobrenome completos.');
      return;
    }

    if (cleanCpf.length !== 11) {
      setError('CPF inválido. Certifique-se de digitar os 11 dígitos.');
      return;
    }

    if (cleanPhone.length < 10) {
      setError('WhatsApp inválido. Digite DDD + Número.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Informe um e-mail válido para confirmações.');
      return;
    }

    if (!password.trim() || password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    try {
      setLoading(true);

      const res = registerWithCpf({
        name: fullName.trim(),
        cpf: cpf.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (!res.success) {
        setError(res.error || 'Erro ao registrar pré-cadastro.');
        setLoading(false);
        return;
      }

      if (layout?.setCurrentTab) {
        layout.setCurrentTab('portal');
      }

      if (onSuccess) {
        onSuccess();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err?.message || 'Falha ao processar cadastro.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-graphite mb-2">Criar sua Conta Aura</h1>
          <p className="text-sm text-aesthetic-graphite/50 font-medium">
            Sua jornada de autocuidado começa com um cadastro seguro.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* DADOS ESSENCIAIS */}
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-4 text-aesthetic-bege" size={18} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nome Completo"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-aesthetic-bege outline-none focus:ring-2 ring-rose-200 transition-all text-sm"
                required
              />
            </div>

            <div className="relative">
              <Fingerprint className="absolute left-4 top-4 text-aesthetic-bege" size={18} />
              <input
                type="text"
                value={cpf}
                onChange={(e) => handleCpfChange(e.target.value)}
                placeholder="CPF (Apenas números)"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-aesthetic-bege outline-none focus:ring-2 ring-rose-200 transition-all text-sm font-mono"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-4 text-aesthetic-bege" size={18} />
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="WhatsApp (DDD + Número)"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-aesthetic-bege outline-none focus:ring-2 ring-rose-200 transition-all text-sm"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-4 text-aesthetic-bege" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-aesthetic-bege outline-none focus:ring-2 ring-rose-200 transition-all text-sm"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 text-aesthetic-bege" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crie uma senha forte"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-aesthetic-bege outline-none focus:ring-2 ring-rose-200 transition-all text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-graphite text-white py-4 rounded-full font-bold shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'PROCESSANDO CADASTRO...' : 'CONCLUIR E ACESSAR PORTAL'}
            <ChevronRight size={18} />
          </button>
        </form>

        {onSwitchToLogin && (
          <div className="text-center pt-2">
            <p className="text-xs text-aesthetic-graphite/60">
              Já possui cadastro no Aura?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-rose-700 font-bold hover:underline cursor-pointer"
              >
                Acessar com CPF ou E-mail
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
