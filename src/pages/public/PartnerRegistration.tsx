// src/pages/public/PartnerRegistration.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  User,
  MapPin,
  Instagram,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Lock,
  Mail,
  Phone,
  Store,
  Compass,
  Zap,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../core/BusinessContext';
import { dataService } from '../../services/dataService';
import { LogoAura } from './AuraHome';

interface PartnerFormData {
  // Step 1: Identidade do Gestor
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  password: string;

  // Step 2: Dados do Negócio
  businessName: string;
  specialty: string;
  planType: 'essencial' | 'pro' | 'enterprise';

  // Step 3: Localização e Presença
  city: string;
  state: string;
  address: string;
  instagram: string;
  acceptTerms: boolean;
}

const SPECIALTY_OPTIONS = [
  'Harmonização Facial & Injetáveis',
  'Dermatologia Estética & Laser',
  'Estética Corporal & Drenagem de Alta Performance',
  'Biomedicina Estética & Peelings',
  'Spa Urbano & Terapias Holísticas',
  'Clínica Multidisciplinar Integrada',
];

export const PartnerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { createBusiness, setCurrentBusinessId } = useBusiness();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<PartnerFormData>({
    managerName: '',
    managerEmail: '',
    managerPhone: '',
    password: '',
    businessName: '',
    specialty: SPECIALTY_OPTIONS[0],
    planType: 'pro',
    city: 'São Paulo',
    state: 'SP',
    address: '',
    instagram: '',
    acceptTerms: true,
  });

  const updateField = (field: keyof PartnerFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!form.managerName.trim()) {
        setError('Por favor, informe seu nome completo.');
        return;
      }
      if (!form.managerEmail.trim() || !form.managerEmail.includes('@')) {
        setError('Informe um e-mail corporativo válido.');
        return;
      }
      if (!form.managerPhone.trim() || form.managerPhone.length < 10) {
        setError('Informe seu WhatsApp comercial com DDD.');
        return;
      }
      if (!form.password || form.password.length < 6) {
        setError('A senha deve conter no mínimo 6 caracteres.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!form.businessName.trim()) {
        setError('Informe o nome da sua clínica ou consultório.');
        return;
      }
      if (!form.specialty) {
        setError('Selecione a especialidade principal do seu negócio.');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.city.trim() || !form.state.trim()) {
      setError('Por favor, informe sua cidade e estado.');
      return;
    }
    if (!form.acceptTerms) {
      setError('Você precisa aceitar os termos de uso para parceiros Aura.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Criação do Usuário Gestor (Local & Auth)
      const cleanPhone = form.managerPhone.replace(/\D/g, '');
      const userId = `usr-biz-${Date.now()}`;
      
      const newBizProfile = {
        id: userId,
        name: form.managerName.trim(),
        full_name: form.managerName.trim(),
        email: form.managerEmail.trim().toLowerCase(),
        phone: form.managerPhone,
        whatsapp: cleanPhone,
        role: 'ADMIN' as const,
        registration_completed: true,
        registrationCompleted: true,
        avatar_url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=200&q=80',
      };

      // 2. Criação do Business Tenant (Multi-Tenant)
      const cleanInsta = form.instagram.replace(/^@/, '').trim();
      const newBusiness = createBusiness({
        name: form.businessName.trim(),
        ownerName: form.managerName.trim(),
        ownerEmail: form.managerEmail.trim().toLowerCase(),
        phone: form.managerPhone,
        whatsapp: cleanPhone,
        city: form.city.trim(),
        state: form.state.trim().toUpperCase(),
        address: form.address.trim() || `${form.city} - ${form.state}`,
        instagram: cleanInsta ? `@${cleanInsta}` : undefined,
        plan_type: form.planType,
        planType: form.planType,
        status: 'active',
        specialties: [form.specialty],
        followersCount: 1,
        rating: 5.0,
        reviewsCount: 0,
        logo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=200&q=80',
        cover: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
      });

      // 3. Vínculo de Propriedade (Role OWNER/ADMIN em business_members no dataService)
      dataService.createOrLinkStaff({
        businessId: newBusiness.id,
        email: form.managerEmail.trim().toLowerCase(),
        name: form.managerName.trim(),
        phone: form.managerPhone,
        role: 'ADMIN',
      });

      // 4. Registrar Unidade Matriz para a Clínica
      dataService.addUnit({
        name: `${form.businessName.trim()} - Matriz`,
        address: form.address.trim() || `${form.city.trim()} - ${form.state.trim().toUpperCase()}`,
        phone: form.managerPhone,
      });

      // 5. Definir Tenant Ativo no Contexto e Redirecionar
      setCurrentBusinessId(newBusiness.id);

      // 6. Realizar Login com Privilégios de Administrador
      login('ADMIN', {
        ...newBizProfile,
        businessId: newBusiness.id,
        business_id: newBusiness.id,
      });

      // Registrar flag de boas-vindas para disparar o upsell amigável de configuração
      try {
        localStorage.setItem('aura_new_partner_onboarding', JSON.stringify({
          businessId: newBusiness.id,
          businessName: newBusiness.name,
          createdAt: new Date().toISOString(),
          promptUpsell: true,
        }));
      } catch (err) {
        console.error(err);
      }

      // Redirecionamento para o Painel de Gestão (Business Dashboard)
      navigate('/business/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Erro no onboarding parceiro:', err);
      setError('Ocorreu um erro ao registrar sua clínica. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aura-pearl text-aura-charcoal flex flex-col font-sans selection:bg-aura-rose selection:text-aura-charcoal">
      {/* HEADER ELEGANTE */}
      <header className="px-6 sm:px-12 py-5 sm:py-6 border-b border-aura-border/60 bg-aura-pearl/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-aura-taupe hover:text-aura-charcoal transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Voltar ao Portal</span>
          </button>
        </div>

        <LogoAura />

        <div className="flex items-center gap-2 text-xs text-aura-taupe">
          <ShieldCheck size={16} className="text-emerald-700" />
          <span className="hidden sm:inline font-medium">Credenciamento Oficial</span>
        </div>
      </header>

      {/* CONTAINER DO ONBOARDING */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10 sm:py-16">
        {/* TÍTULO & INTRODUÇÃO */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-aura-linen shadow-2xs">
            <Sparkles size={12} className="text-aura-rose" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-aura-charcoal">
              Aura Business Gateway
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-normal text-aura-charcoal tracking-tight">
            Seja um Parceiro Aura
          </h1>
          <p className="text-sm sm:text-base text-aura-taupe max-w-lg mx-auto">
            Integre sua clínica ao 1º marketplace de estética de alto padrão e assuma a gestão científica do seu negócio.
          </p>
        </div>

        {/* STEPPER PROGRESS BAR */}
        <div className="mb-10 max-w-xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-aura-linen -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-aura-charcoal -translate-y-1/2 transition-all duration-500 z-0"
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            />

            {/* Passo 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  step >= 1
                    ? 'bg-aura-charcoal text-white shadow-soft-glow'
                    : 'bg-white text-aura-taupe border border-aura-linen'
                }`}
              >
                {step > 1 ? <Check size={16} /> : '1'}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-aura-charcoal mt-2">
                Gestor
              </span>
            </div>

            {/* Passo 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  step >= 2
                    ? 'bg-aura-charcoal text-white shadow-soft-glow'
                    : 'bg-white text-aura-taupe border border-aura-linen'
                }`}
              >
                {step > 2 ? <Check size={16} /> : '2'}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-aura-charcoal mt-2">
                Negócio
              </span>
            </div>

            {/* Passo 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  step >= 3
                    ? 'bg-aura-charcoal text-white shadow-soft-glow'
                    : 'bg-white text-aura-taupe border border-aura-linen'
                }`}
              >
                3
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-aura-charcoal mt-2">
                Presença
              </span>
            </div>
          </div>
        </div>

        {/* ALERTA DE ERRO */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3 animate-in fade-in">
            <span className="font-bold">Atenção:</span> {error}
          </div>
        )}

        {/* CARD PRINCIPAL COM DESIGN LUMINOUS LUXURY */}
        <div className="bg-white rounded-[36px] border border-aura-linen p-8 sm:p-12 shadow-luminous">
          {/* STEP 1: IDENTIDADE DO GESTOR */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-aura-linen/80 pb-4">
                <h2 className="text-xl font-serif font-bold text-aura-charcoal flex items-center gap-2">
                  <User size={20} className="text-aura-rose" />
                  Identidade do Gestor Responsável
                </h2>
                <p className="text-xs text-aura-taupe mt-1">
                  Quem será o administrador titular da conta com privilégios de proprietário (OWNER).
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-aura-taupe mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={form.managerName}
                    onChange={(e) => updateField('managerName', e.target.value)}
                    placeholder="Ex: Dra. Ana Beatriz Vasconcelos"
                    className="w-full px-4 py-3.5 rounded-2xl bg-aura-pearl/50 border border-aura-linen focus:border-aura-charcoal focus:bg-white text-sm outline-none transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-aura-taupe mb-2">
                      E-mail Corporativo *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 text-aura-taupe/60" size={16} />
                      <input
                        type="email"
                        value={form.managerEmail}
                        onChange={(e) => updateField('managerEmail', e.target.value)}
                        placeholder="gestao@suaclinica.com.br"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-aura-pearl/50 border border-aura-linen focus:border-aura-charcoal focus:bg-white text-sm outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-aura-taupe mb-2">
                      WhatsApp Comercial *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 text-aura-taupe/60" size={16} />
                      <input
                        type="tel"
                        value={form.managerPhone}
                        onChange={(e) => updateField('managerPhone', e.target.value)}
                        placeholder="(11) 98765-4321"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-aura-pearl/50 border border-aura-linen focus:border-aura-charcoal focus:bg-white text-sm outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-aura-taupe mb-2">
                    Senha Mestre de Acesso *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-aura-taupe/60" size={16} />
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      placeholder="Mínimo de 6 caracteres seguros"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-aura-pearl/50 border border-aura-linen focus:border-aura-charcoal focus:bg-white text-sm outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-full bg-aura-charcoal hover:bg-black text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-soft-glow hover:scale-102 transition-all cursor-pointer"
                >
                  Continuar para Dados do Negócio
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DADOS DO NEGÓCIO */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-aura-linen/80 pb-4">
                <h2 className="text-xl font-serif font-bold text-aura-charcoal flex items-center gap-2">
                  <Building2 size={20} className="text-aura-rose" />
                  Dados do Negócio &amp; Posicionamento
                </h2>
                <p className="text-xs text-aura-taupe mt-1">
                  Como sua clínica será apresentada no Marketplace e nos relatórios de gestão.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-aura-taupe mb-2">
                    Nome Comercial da Clínica *
                  </label>
                  <div className="relative">
                    <Store className="absolute left-4 top-3.5 text-aura-taupe/60" size={16} />
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(e) => updateField('businessName', e.target.value)}
                      placeholder="Ex: Sublime Estética Avançada &amp; Spa"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-aura-pearl/50 border border-aura-linen focus:border-aura-charcoal focus:bg-white text-sm outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-aura-taupe mb-2">
                    Especialidade Principal no Marketplace *
                  </label>
                  <select
                    value={form.specialty}
                    onChange={(e) => updateField('specialty', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-aura-pearl/50 border border-aura-linen focus:border-aura-charcoal focus:bg-white text-sm outline-none transition-all cursor-pointer text-aura-charcoal"
                  >
                    {SPECIALTY_OPTIONS.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seletor de Plano Inicial */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-aura-taupe mb-2">
                    Plano Desejado (Período de Degustação 14 dias grátis)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div
                      onClick={() => updateField('planType', 'essencial')}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        form.planType === 'essencial'
                          ? 'bg-aura-pearl border-aura-charcoal shadow-xs'
                          : 'border-aura-linen bg-white hover:border-aura-taupe/50'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest text-aura-taupe">Entrada</span>
                      <p className="font-serif font-bold text-sm text-aura-charcoal mt-1">Essencial</p>
                      <p className="text-xs text-aura-taupe mt-0.5">R$ 149/mês</p>
                    </div>

                    <div
                      onClick={() => updateField('planType', 'pro')}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                        form.planType === 'pro'
                          ? 'bg-aura-pearl border-aura-charcoal shadow-xs ring-1 ring-aura-charcoal'
                          : 'border-aura-linen bg-white hover:border-aura-taupe/50'
                      }`}
                    >
                      <span className="absolute top-2 right-2 text-[8px] font-bold uppercase tracking-wider bg-aura-charcoal text-white px-2 py-0.5 rounded-full">
                        Mais Escolhido
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-aura-rose">Gestão Completa</span>
                      <p className="font-serif font-bold text-sm text-aura-charcoal mt-1">Plano Pro</p>
                      <p className="text-xs text-aura-taupe mt-0.5">R$ 299/mês</p>
                    </div>

                    <div
                      onClick={() => updateField('planType', 'enterprise')}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        form.planType === 'enterprise'
                          ? 'bg-aura-pearl border-aura-charcoal shadow-xs'
                          : 'border-aura-linen bg-white hover:border-aura-taupe/50'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest text-aura-taupe">Franquias</span>
                      <p className="font-serif font-bold text-sm text-aura-charcoal mt-1">Aura Elite</p>
                      <p className="text-xs text-aura-taupe mt-0.5">R$ 599/mês</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-aura-taupe hover:text-aura-charcoal cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-full bg-aura-charcoal hover:bg-black text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-soft-glow hover:scale-102 transition-all cursor-pointer"
                >
                  Continuar para Localização
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: LOCALIZAÇÃO E PRESENÇA */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-aura-linen/80 pb-4">
                <h2 className="text-xl font-serif font-bold text-aura-charcoal flex items-center gap-2">
                  <Compass size={20} className="text-aura-rose" />
                  Localização e Presença Digital
                </h2>
                <p className="text-xs text-aura-taupe mt-1">
                  Permita que clientes encontrem sua clínica no Mapa e via Instagram.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-aura-taupe mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Ex: São Paulo"
                      className="w-full px-4 py-3.5 rounded-2xl bg-aura-pearl/50 border border-aura-linen focus:border-aura-charcoal focus:bg-white text-sm outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-aura-taupe mb-2">
                      Estado (UF) *
                    </label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) => updateField('state', e.target.value.toUpperCase())}
                      placeholder="SP"
                      maxLength={2}
                      className="w-full px-4 py-3.5 rounded-2xl bg-aura-pearl/50 border border-aura-linen focus:border-aura-charcoal focus:bg-white text-sm outline-none transition-all uppercase"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-aura-taupe mb-2">
                    Endereço Completo &amp; Bairro
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 text-aura-taupe/60" size={16} />
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="Ex: Rua Oscar Freire, 1420 - Jardins"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-aura-pearl/50 border border-aura-linen focus:border-aura-charcoal focus:bg-white text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-aura-taupe mb-2">
                    Instagram Oficial da Clínica
                  </label>
                  <div className="relative">
                    <Instagram className="absolute left-4 top-3.5 text-aura-taupe/60" size={16} />
                    <input
                      type="text"
                      value={form.instagram}
                      onChange={(e) => updateField('instagram', e.target.value)}
                      placeholder="@suaclinica"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-aura-pearl/50 border border-aura-linen focus:border-aura-charcoal focus:bg-white text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.acceptTerms}
                      onChange={(e) => updateField('acceptTerms', e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-aura-charcoal border-aura-linen focus:ring-aura-charcoal cursor-pointer"
                    />
                    <span className="text-xs text-aura-taupe leading-relaxed">
                      Concordo com os Termos de Uso e Políticas de Privacidade para Parceiros Credenciados Aura, autorizando o provisionamento do ambiente multi-tenant e a inclusão no Marketplace de Beleza.
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-aura-linen">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-aura-taupe hover:text-aura-charcoal cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-4 rounded-full bg-aura-charcoal hover:bg-black text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-soft-glow hover:scale-102 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>PROVISIONANDO CLÍNICA...</span>
                    </>
                  ) : (
                    <>
                      <span>CRIAR MINHA CLÍNICA</span>
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* BENEFÍCIOS RÁPIDOS INFERIORES */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-xs font-bold text-aura-charcoal">Ativação Imediata</p>
            <p className="text-[11px] text-aura-taupe">Acesso instantâneo à Agenda e ao DRE Financeiro</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-aura-charcoal">Sem Fidelidade Forçada</p>
            <p className="text-[11px] text-aura-taupe">Cancele ou altere seu plano a qualquer momento</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-aura-charcoal">Conformidade Total</p>
            <p className="text-[11px] text-aura-taupe">Prontuários e fichas dentro dos padrões ANVISA e LGPD</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PartnerRegistration;
