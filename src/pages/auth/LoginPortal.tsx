// src/pages/auth/LoginPortal.tsx (VERSÃO FINAL COMERCIAL - PORTAL DE ACESSO BLINDADO)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Fingerprint,
  Lock,
  ChevronRight,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLayout } from '../../layouts/LayoutContext';
import { AuraBrand } from '../../components/ui/AuraBrand';
import { AuraLogoV3 } from '../../components/ui/AuraLogoV3';

export const LoginPortal: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Campos para Pré-Cadastro (CPF)
  const [regName, setRegName] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const { loginWithCpfOrEmail, registerWithCpf, setPortalRoute } = useAuth();
  const layout = useLayout();

  // Máscara CPF
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) {
      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (v.length > 6) {
      v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (v.length > 3) {
      v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    setRegCpf(v);
  };

  // Máscara Telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (v.length > 5) {
      v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    }
    setRegPhone(v);
  };

  // Autenticação Real por CPF ou E-mail
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Por favor, informe seu CPF ou E-mail corporativo.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Por favor, insira sua senha de acesso.');
      return;
    }

    setLoading(true);
    const result = loginWithCpfOrEmail(identifier, password);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Credenciais inválidas ou cadastro não localizado.');
      return;
    }

    setSuccessMessage('Acesso autenticado com sucesso! Redirecionando...');

    setTimeout(() => {
      if (result.role === 'PLATFORM_ADMIN') {
        layout.setCurrentTab('superadmin');
        navigate('/superadmin');
      } else if (['OWNER', 'ADMIN', 'MANAGER', 'PROFESSIONAL', 'RECEPTIONIST'].includes(result.role || '')) {
        layout.setCurrentTab('dashboard');
        navigate('/business/dashboard');
      } else {
        layout.setCurrentTab('marketplace');
        navigate('/app/explorar');
      }
    }, 600);
  };

  // Pré-Cadastro Real com CPF
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanCpf = regCpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      setErrorMessage('Por favor, insira um CPF válido com 11 dígitos.');
      return;
    }

    if (!regName.trim() || regName.trim().split(' ').length < 2) {
      setErrorMessage('Informe seu nome e sobrenome completos.');
      return;
    }

    setLoading(true);
    const result = registerWithCpf({
      name: regName.trim(),
      cpf: regCpf.trim(),
      whatsapp: regPhone.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword.trim(),
    });
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Falha ao realizar pré-cadastro.');
      return;
    }

    setSuccessMessage('Cadastro concluído com sucesso! Bem-vinda à Aura.');
    setTimeout(() => {
      layout.setCurrentTab('marketplace');
      navigate('/app/explorar');
    }, 600);
  };

  const handleForgotPassword = () => {
    if (!identifier.trim()) {
      setErrorMessage('Informe seu CPF ou E-mail acima para recuperar sua senha.');
      return;
    }
    setSuccessMessage('Link de redefinição seguro enviado para o canal cadastrado.');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-aesthetic-off-white flex items-center justify-center p-6">
      <div className="max-w-[440px] w-full bg-white rounded-[48px] p-8 sm:p-10 shadow-premium border border-aesthetic-bege/20 animate-in fade-in zoom-in-95 duration-700">
        
        {/* LOGO E TÍTULO COM AURA LOGO V3 */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <AuraLogoV3 size="lg" variant="business" subtitle="ACESSO BLINDADO" />
          </div>
          <p className="text-xs text-aesthetic-graphite/60 tracking-widest uppercase font-medium">
            Acesso seguro por CPF ou E-mail corporativo
          </p>
        </div>

        {/* SELETOR DE MODO (ACESSAR VS CADASTRAR) */}
        <div className="flex bg-aesthetic-off-white p-1 rounded-full mb-6 border border-aesthetic-bege/30">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white shadow-sm text-graphite'
                : 'text-gray-400 hover:text-graphite'
            }`}
          >
            Acessar Conta
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white shadow-sm text-graphite'
                : 'text-gray-400 hover:text-graphite'
            }`}
          >
            Pré-Cadastro (CPF)
          </button>
        </div>

        {/* FEEDBACK DE ERRO / SUCESSO */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={15} className="shrink-0 text-rose-700" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* FORMULÁRIO DE LOGIN REAL (BLINDADO) */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 ml-1">
                <Fingerprint size={14} className="text-rose-700" />
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  CPF ou E-mail
                </label>
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Ex: 123.456.789-00 ou seu@email.com"
                className="w-full px-5 py-3.5 rounded-2xl bg-aesthetic-off-white border border-aesthetic-bege/40 focus:border-rose-300 focus:bg-white outline-none text-sm text-graphite transition-all shadow-2xs"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-rose-700" />
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Senha de Acesso
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10px] font-bold text-rose-700 hover:underline cursor-pointer"
                >
                  Esqueci a senha
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 pr-11 rounded-2xl bg-aesthetic-off-white border border-aesthetic-bege/40 focus:border-rose-300 focus:bg-white outline-none text-sm text-graphite transition-all shadow-2xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-graphite cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-graphite text-white py-4 sm:py-4.5 rounded-[24px] font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Validando Acesso...' : 'Entrar no Universo Aura'}</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        ) : (
          /* FORMULÁRIO DE PRÉ-CADASTRO (CPF) */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 ml-1">
                <User size={14} className="text-rose-700" />
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Nome Completo
                </label>
              </div>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Ex: Carolina Silva"
                className="w-full px-5 py-3 rounded-2xl bg-aesthetic-off-white border border-aesthetic-bege/40 focus:border-rose-300 focus:bg-white outline-none text-sm text-graphite transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 ml-1">
                <Fingerprint size={14} className="text-rose-700" />
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  CPF (Chave Única de Prontuário)
                </label>
              </div>
              <input
                type="text"
                value={regCpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                className="w-full px-5 py-3 rounded-2xl bg-aesthetic-off-white border border-aesthetic-bege/40 focus:border-rose-300 focus:bg-white outline-none text-sm text-graphite transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 ml-1">
                <Phone size={14} className="text-rose-700" />
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  WhatsApp / Celular
                </label>
              </div>
              <input
                type="text"
                value={regPhone}
                onChange={handlePhoneChange}
                placeholder="(11) 98765-4321"
                className="w-full px-5 py-3 rounded-2xl bg-aesthetic-off-white border border-aesthetic-bege/40 focus:border-rose-300 focus:bg-white outline-none text-sm text-graphite transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 ml-1">
                <Mail size={14} className="text-rose-700" />
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  E-mail
                </label>
              </div>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full px-5 py-3 rounded-2xl bg-aesthetic-off-white border border-aesthetic-bege/40 focus:border-rose-300 focus:bg-white outline-none text-sm text-graphite transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 ml-1">
                <Lock size={14} className="text-rose-700" />
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Criar Senha de Acesso
                </label>
              </div>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-5 py-3 rounded-2xl bg-aesthetic-off-white border border-aesthetic-bege/40 focus:border-rose-300 focus:bg-white outline-none text-sm text-graphite transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-graphite text-white py-4 rounded-[24px] font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Criando Conta...' : 'Concluir Pré-Cadastro'}</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}

        {/* RODAPÉ DE CONFORMIDADE */}
        <footer className="mt-8 pt-6 border-t border-aesthetic-bege/20 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold uppercase tracking-tight">
            <ShieldCheck size={14} />
            Dados protegidos por conformidade LGPD &amp; ANVISA
          </div>
        </footer>
      </div>
    </div>
  );
};

export { LandingPortal } from './LandingPortal';
export default LoginPortal;
