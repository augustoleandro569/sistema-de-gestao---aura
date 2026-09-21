// src/pages/auth/AuthPortal.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  User,
  Fingerprint,
  Phone,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLayout } from '../../layouts/LayoutContext';
import { AuraLogoV3 } from '../../components/ui/AuraLogoV3';
import { AuraLoaderV3 } from '../../components/ui/AuraLoaderV3';

export interface AuthPortalProps {
  initialView?: 'login' | 'signup';
  defaultRole?: 'CLIENT' | 'BUSINESS';
  onClose?: () => void;
  onSuccess?: () => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({
  initialView = 'login',
  defaultRole,
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [view, setView] = useState<'login' | 'signup'>(initialView);
  const [identifier, setIdentifier] = useState(
    defaultRole === 'BUSINESS' ? 'camila@sublimeestetica.com.br' : ''
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form fields for registration
  const [regFullName, setRegFullName] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const { signInWithCredentials, signUpWithCredentials } = useAuth();
  const layout = useLayout();

  // Formata CPF: 000.000.000-00
  const formatCPF = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    return raw
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  // Formata Telefone / WhatsApp: (00) 00000-0000
  const formatPhone = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 10) {
      return raw.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return raw.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Informe seu CPF ou E-mail para continuar.');
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithCredentials(identifier, password);

      if (!result.success) {
        setError(result.error || 'Credenciais inválidas ou cadastro não encontrado.');
        setLoading(false);
        return;
      }

      // Redirecionamento baseado estritamente na função (Role) retornada do perfil
      if (result.role === 'PLATFORM_ADMIN') {
        layout.setCurrentTab('superadmin');
        if (onSuccess) onSuccess();
        navigate(result.redirectUrl || '/superadmin');
      } else if (
        ['OWNER', 'ADMIN', 'MANAGER', 'PROFESSIONAL', 'RECEPTIONIST'].includes(
          result.role || ''
        )
      ) {
        layout.setCurrentTab('dashboard');
        if (onSuccess) onSuccess();
        navigate(result.redirectUrl || '/business/dashboard');
      } else {
        // Papel CLIENT (Consumidor) ➔ Redireciona para o Aura App Marketplace
        layout.setCurrentTab('marketplace');
        if (onSuccess) onSuccess();
        navigate(result.redirectUrl || '/app/explorar');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err?.message || 'Falha ao processar autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCpf = regCpf.replace(/\D/g, '');
    const cleanPhone = regWhatsapp.replace(/\D/g, '');

    if (!regFullName.trim() || regFullName.trim().split(' ').length < 2) {
      setError('Por favor, informe seu nome e sobrenome completos.');
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

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setError('Informe um e-mail válido para confirmações.');
      return;
    }

    if (!regPassword.trim() || regPassword.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const result = await signUpWithCredentials({
        name: regFullName.trim(),
        cpf: regCpf.trim(),
        whatsapp: regWhatsapp.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword.trim(),
      });

      if (!result.success) {
        setError(result.error || 'Falha ao processar cadastro.');
        setLoading(false);
        return;
      }

      // Cadastro concluído com sucesso ➔ Redireciona imediatamente para o Feed de Consumo
      layout.setCurrentTab('marketplace');
      if (onSuccess) onSuccess();
      navigate(result.redirectUrl || '/app/explorar');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err?.message || 'Erro durante a criação da conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white rounded-[32px] border border-aura-linen shadow-2xl relative">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-aura-taupe hover:text-aura-charcoal hover:bg-aura-linen/50 transition-colors cursor-pointer"
          aria-label="Fechar modal"
        >
          <X size={18} />
        </button>
      )}

      {/* CABEÇALHO DO PORTAL COM AURA LOGO V3 */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="mb-3">
          <AuraLogoV3
            size="md"
            variant={defaultRole === 'BUSINESS' ? 'business' : 'app'}
            subtitle={defaultRole === 'BUSINESS' ? 'PORTAL DO PARCEIRO' : 'ACESSO UNIFICADO'}
          />
        </div>
        <p className="text-xs text-aura-taupe mt-1">
          {view === 'login'
            ? 'Acesso seguro por CPF ou E-mail corporativo'
            : 'O CPF é a chave única para segurança de prontuários'}
        </p>
      </div>

      {/* SELETOR DE MODO */}
      <div className="flex bg-aura-linen/60 p-1 rounded-full mb-6 border border-aura-linen">
        <button
          type="button"
          onClick={() => {
            setView('login');
            setError(null);
          }}
          className={`flex-1 py-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
            view === 'login'
              ? 'bg-white shadow-xs text-aura-charcoal'
              : 'text-aura-taupe hover:text-aura-charcoal'
          }`}
        >
          ACESSAR CONTA
        </button>
        <button
          type="button"
          onClick={() => {
            setView('signup');
            setError(null);
          }}
          className={`flex-1 py-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
            view === 'signup'
              ? 'bg-white shadow-xs text-aura-charcoal'
              : 'text-aura-taupe hover:text-aura-charcoal'
          }`}
        >
          PRÉ-CADASTRO (CPF)
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2.5">
          <AlertCircle size={16} className="shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* TELA DE CARREGAMENTO COM O AURA LOADER V3 */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center">
          <AuraLoaderV3 message="Validando credenciais e perfil..." />
        </div>
      ) : view === 'login' ? (
        /* FORMULÁRIO DE LOGIN */
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-aura-taupe uppercase tracking-wider flex items-center gap-1.5">
              <Fingerprint size={12} className="text-aura-rose" />
              CPF ou E-mail
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Ex: 123.456.789-00 ou seu@email.com"
                className="w-full p-3.5 rounded-2xl bg-aura-pearl border border-aura-linen focus:border-aura-rose focus:bg-white text-sm outline-hidden text-aura-charcoal transition-all placeholder:text-aura-taupe/60"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-aura-taupe uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={12} className="text-aura-rose" />
                Senha de Acesso
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-aura-taupe hover:text-aura-charcoal flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{showPassword ? 'Ocultar' : 'Exibir'}</span>
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3.5 rounded-2xl bg-aura-pearl border border-aura-linen focus:border-aura-rose focus:bg-white text-sm outline-hidden text-aura-charcoal transition-all placeholder:text-aura-taupe/60"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-aura-charcoal text-white rounded-full font-bold hover:bg-black transition-all shadow-md text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-50"
          >
            ENTRAR NO UNIVERSO AURA
            <ChevronRight size={16} />
          </button>
        </form>
      ) : (
        /* FORMULÁRIO DE PRÉ-CADASTRO (CPF OBRIGATÓRIO) */
        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-aura-taupe uppercase tracking-wider">
              Nome Completo *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 text-aura-taupe" size={16} />
              <input
                type="text"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                placeholder="Ex: Carolina Silva"
                className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-aura-pearl border border-aura-linen focus:border-aura-rose focus:bg-white text-sm outline-hidden text-aura-charcoal"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-aura-taupe uppercase tracking-wider flex items-center justify-between">
              <span>CPF (Chave Única do Prontuário) *</span>
              <span className="text-[9px] text-aura-rose font-bold">11 DÍGITOS</span>
            </label>
            <div className="relative">
              <Fingerprint className="absolute left-3.5 top-3.5 text-aura-taupe" size={16} />
              <input
                type="text"
                value={regCpf}
                onChange={(e) => setRegCpf(formatCPF(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-aura-pearl border border-aura-linen focus:border-aura-rose focus:bg-white text-sm outline-hidden text-aura-charcoal font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-aura-taupe uppercase tracking-wider">
              WhatsApp (DDD + Número) *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 text-aura-taupe" size={16} />
              <input
                type="tel"
                value={regWhatsapp}
                onChange={(e) => setRegWhatsapp(formatPhone(e.target.value))}
                placeholder="(11) 99999-9999"
                maxLength={15}
                className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-aura-pearl border border-aura-linen focus:border-aura-rose focus:bg-white text-sm outline-hidden text-aura-charcoal"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-aura-taupe uppercase tracking-wider">
              E-mail *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-aura-taupe" size={16} />
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-aura-pearl border border-aura-linen focus:border-aura-rose focus:bg-white text-sm outline-hidden text-aura-charcoal"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-aura-taupe uppercase tracking-wider">
              Senha de Acesso *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-aura-taupe" size={16} />
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-aura-pearl border border-aura-linen focus:border-aura-rose focus:bg-white text-sm outline-hidden text-aura-charcoal"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-aura-charcoal text-white rounded-full font-bold hover:bg-black transition-all shadow-md text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-50"
          >
            CONCLUIR CADASTRO E ACESSAR
            <ChevronRight size={16} />
          </button>
        </form>
      )}

      {/* RODAPÉ DE SEGURANÇA JURÍDICA */}
      <div className="mt-5 pt-3 border-t border-aura-linen flex items-center justify-center gap-2 text-[10px] text-aura-taupe">
        <ShieldCheck size={13} className="text-emerald-600" />
        <span>Dados protegidos por conformidade LGPD &amp; ANVISA</span>
      </div>
    </div>
  );
};

export default AuthPortal;
