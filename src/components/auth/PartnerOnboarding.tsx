// src/components/auth/PartnerOnboarding.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  User,
  Building2,
  MapPin,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Check,
  X,
  Store,
  Compass,
  Zap,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../core/BusinessContext';
import { AuraLogoV3 } from '../ui/AuraLogoV3';

export interface PartnerOnboardingProps {
  onClose?: () => void;
  onOpenLogin?: () => void;
}

export interface PlanItem {
  id: 'essencial' | 'pro' | 'elite';
  name: string;
  badge?: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const ONBOARDING_PLANS: PlanItem[] = [
  {
    id: 'essencial',
    name: 'Essencial',
    price: 197,
    description: 'Para consultórios e profissionais autônomos que buscam agenda impecável.',
    features: [
      'Agenda inteligente com lembretes automáticos',
      'Cadastro e prontuário digital de pacientes',
      'Perfil verificado no Marketplace Aura',
      'Até 2 profissionais na equipe',
      'Suporte via e-mail e comunidade'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 347,
    isPopular: true,
    badge: 'Mais Recomendado',
    description: 'Gestão completa com precificação científica, DRE e controle rigoroso de insumos.',
    features: [
      'Tudo do Plano Essencial',
      'DRE e Fluxo de Caixa em tempo real',
      'Estoque auditado com baixa automática por protocolo',
      'Calculadora de custo real e precificação por margem',
      'Destaque no Mapa de Clínicas dos Jardins',
      'Até 5 profissionais na equipe'
    ]
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 597,
    badge: 'Máxima Performance',
    description: 'A solução definitiva com inteligência de marketing, automações e white-label.',
    features: [
      'Tudo do Plano Gestão Pro',
      'Integração oficial WhatsApp com disparos automáticos',
      'White-label completo com domínio próprio',
      'Programa de Fidelidade 10+1 e Cashback Aura',
      'Feed de Conteúdos e Vitrine de Antes & Depois',
      'Equipe ilimitada e consultoria mensal de lucros'
    ]
  }
];

export const PartnerOnboarding: React.FC<PartnerOnboardingProps> = ({
  onClose,
  onOpenLogin
}) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { createBusiness, setCurrentBusinessId } = useBusiness();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Etapa 1: Dados do Gestor
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerCpf, setManagerCpf] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [password, setPassword] = useState('');

  // Etapa 2: Dados da Clínica
  const [businessName, setBusinessName] = useState('');
  const [documentCnpj, setDocumentCnpj] = useState('');
  const [specialty, setSpecialty] = useState('Harmonização Facial & Injetáveis');

  // Etapa 3: Localização
  const [address, setAddress] = useState('Alameda Santos, 1893');
  const [neighborhood, setNeighborhood] = useState('Jardins');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [instagram, setInstagram] = useState('');

  // Etapa 4: Escolha do Plano
  const [selectedPlan, setSelectedPlan] = useState<'essencial' | 'pro' | 'elite'>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const formatCPF = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 3) return raw;
    if (raw.length <= 6) return `${raw.slice(0, 3)}.${raw.slice(3)}`;
    if (raw.length <= 9) return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
    return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9)}`;
  };

  const formatCNPJ = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 14);
    if (raw.length <= 2) return raw;
    if (raw.length <= 5) return `${raw.slice(0, 2)}.${raw.slice(2)}`;
    if (raw.length <= 8) return `${raw.slice(0, 2)}.${raw.slice(2, 5)}.${raw.slice(5)}`;
    if (raw.length <= 12) return `${raw.slice(0, 2)}.${raw.slice(2, 5)}.${raw.slice(5, 8)}/${raw.slice(8)}`;
    return `${raw.slice(0, 2)}.${raw.slice(2, 5)}.${raw.slice(5, 8)}/${raw.slice(8, 12)}-${raw.slice(12)}`;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!managerName || !managerEmail) {
        alert('Por favor, preencha o nome e o e-mail do gestor.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!businessName) {
        alert('Por favor, informe o nome fantasia da sua clínica.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!city || !address) {
        alert('Por favor, informe o endereço e cidade da clínica.');
        return;
      }
      setStep(4);
    }
  };

  const handleCompleteRegistration = async () => {
    setIsSubmitting(true);
    
    // Simula conciliação instantânea e provisionamento
    setTimeout(() => {
      try {
        const newBiz = createBusiness({
          name: businessName || 'Minha Clínica Estética',
          ownerName: managerName || 'Gestor Responsável',
          ownerEmail: managerEmail || 'contato@clinica.com.br',
          phone: managerPhone || '(11) 98765-4321',
          whatsapp: managerPhone ? managerPhone.replace(/\D/g, '') : '5511987654321',
          address: `${address} - ${neighborhood}`,
          neighborhood: neighborhood || 'Jardins',
          city: city || 'São Paulo',
          state: state || 'SP',
          instagram: instagram || '@suaclinica',
          plan_type: selectedPlan === 'elite' ? 'enterprise' : selectedPlan === 'pro' ? 'pro' : 'essencial',
          planType: selectedPlan === 'elite' ? 'enterprise' : selectedPlan === 'pro' ? 'pro' : 'essencial',
        });

        setCurrentBusinessId(newBiz.id);

        login('ADMIN', {
          name: managerName || 'Gestora Aura',
          email: managerEmail || 'gestao@aura.com.br',
          cpf: managerCpf || '123.456.789-00',
          phone: managerPhone || '(11) 98765-4321',
          role: 'ADMIN',
        });

        setSuccessAnimation(true);

        setTimeout(() => {
          if (onClose) onClose();
          navigate('/business/dashboard');
        }, 1500);
      } catch (err) {
        console.error(err);
        setIsSubmitting(false);
      }
    }, 1200);
  };

  return (
    <div className="relative bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl border border-aura-linen overflow-hidden max-w-4xl w-full mx-auto">
      {/* Botão de Fechar */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-aura-pearl hover:bg-aura-linen/80 text-aura-taupe hover:text-aura-charcoal transition-all z-20"
        >
          <X size={18} />
        </button>
      )}

      {/* HEADER DO ONBOARDING */}
      <div className="bg-aura-pearl/60 border-b border-aura-linen px-6 sm:px-10 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <AuraLogoV3 size="sm" variant="business" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-aura-taupe pt-1">
              Credenciamento de Parceiro • Aura Business
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-aura-taupe">Etapa {step} de 4</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s === step
                      ? 'w-6 bg-aura-charcoal'
                      : s < step
                      ? 'w-2 bg-emerald-500'
                      : 'w-2 bg-aura-linen'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* TÍTULO DA ETAPA */}
        <div className="mt-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-aura-charcoal">
                1. Identidade do Gestor
              </h2>
              <p className="text-xs text-aura-taupe mt-1">
                Seus dados de acesso seguro à torre de comando da clínica.
              </p>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-aura-charcoal">
                2. Perfil da Clínica
              </h2>
              <p className="text-xs text-aura-taupe mt-1">
                Nome fantasia, área de especialidade e documentação do estabelecimento.
              </p>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-aura-charcoal">
                3. Localização &amp; Presença
              </h2>
              <p className="text-xs text-aura-taupe mt-1">
                Endereço comercial para exibição qualificada no Mapa Aura dos Jardins e região.
              </p>
            </div>
          )}
          {step === 4 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-aura-charcoal">
                4. Escolha seu Plano Aura
              </h2>
              <p className="text-xs text-aura-taupe mt-1">
                Planos flexíveis que pagam a si mesmos com a redução de perdas de estoque e retenção de pacientes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CORPO DO FORMULÁRIO */}
      <div className="p-6 sm:p-10">
        {successAnimation ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-aura-charcoal">
              Clínica Credenciada com Sucesso!
            </h3>
            <p className="text-sm text-aura-taupe max-w-md mx-auto">
              Inicializando seu ambiente DRE, catálogo de procedimentos e vitrine de agendamentos...
            </p>
          </div>
        ) : (
          <div>
            {/* ETAPA 1: DADOS DO GESTOR */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe">
                      Nome Completo do Responsável *
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-taupe" />
                      <input
                        type="text"
                        placeholder="Ex: Dra. Camila Vasconcelos"
                        value={managerName}
                        onChange={(e) => setManagerName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-aura-pearl/40 border border-aura-linen rounded-xl text-sm focus:outline-hidden focus:border-aura-charcoal transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe">
                      E-mail de Acesso Corporativo *
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-taupe" />
                      <input
                        type="email"
                        placeholder="camila@suaclinica.com.br"
                        value={managerEmail}
                        onChange={(e) => setManagerEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-aura-pearl/40 border border-aura-linen rounded-xl text-sm focus:outline-hidden focus:border-aura-charcoal transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe">
                      CPF do Gestor *
                    </label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={managerCpf}
                      onChange={(e) => setManagerCpf(formatCPF(e.target.value))}
                      className="w-full px-4 py-3 bg-aura-pearl/40 border border-aura-linen rounded-xl text-sm focus:outline-hidden focus:border-aura-charcoal transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe">
                      WhatsApp Corporativo
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-taupe" />
                      <input
                        type="text"
                        placeholder="(11) 98765-4321"
                        value={managerPhone}
                        onChange={(e) => setManagerPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-aura-pearl/40 border border-aura-linen rounded-xl text-sm focus:outline-hidden focus:border-aura-charcoal transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe">
                      Senha Master
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-taupe" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-aura-pearl/40 border border-aura-linen rounded-xl text-sm focus:outline-hidden focus:border-aura-charcoal transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-xs text-aura-taupe/80 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                  <span>Ambiente criptografado com isolamento de tenant em conformidade com a LGPD.</span>
                </div>
              </div>
            )}

            {/* ETAPA 2: DADOS DA CLÍNICA */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe">
                      Nome Fantasia da Clínica *
                    </label>
                    <div className="relative">
                      <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-taupe" />
                      <input
                        type="text"
                        placeholder="Ex: Sublime Estética Facial &amp; Corporal"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-aura-pearl/40 border border-aura-linen rounded-xl text-sm focus:outline-hidden focus:border-aura-charcoal transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe">
                      CNPJ ou CPF do Negócio
                    </label>
                    <input
                      type="text"
                      placeholder="00.000.000/0001-00"
                      value={documentCnpj}
                      onChange={(e) => setDocumentCnpj(formatCNPJ(e.target.value))}
                      className="w-full px-4 py-3 bg-aura-pearl/40 border border-aura-linen rounded-xl text-sm focus:outline-hidden focus:border-aura-charcoal transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe">
                    Especialidade Principal *
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-4 py-3 bg-aura-pearl/40 border border-aura-linen rounded-xl text-sm focus:outline-hidden focus:border-aura-charcoal transition-all"
                  >
                    <option value="Harmonização Facial & Injetáveis">Harmonização Facial &amp; Injetáveis (Botox, Preenchimento, Bioestimulador)</option>
                    <option value="Dermatologia Estética & Laser">Dermatologia Estética &amp; Laser (Lavieen, Ultraformer)</option>
                    <option value="Estética Corporal & Drenagem">Estética Corporal Avançada &amp; Pós-Operatório</option>
                    <option value="Biomedicina Estética & Peelings">Biomedicina Estética &amp; Harmonização Glútea</option>
                    <option value="Spa Urbano & Bem-Estar">Spa Urbano, Massoterapia &amp; Terapias Holísticas</option>
                    <option value="Visagismo & Micropigmentação">Sobrancelhas, Visagismo &amp; Extensão de Cílios</option>
                  </select>
                </div>
              </div>
            )}

            {/* ETAPA 3: LOCALIZAÇÃO */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe">
                    Endereço Completo (Rua e Número) *
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-taupe" />
                    <input
                      type="text"
                      placeholder="Ex: Alameda Santos, 1893"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-aura-pearl/40 border border-aura-linen rounded-xl text-sm focus:outline-hidden focus:border-aura-charcoal transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      placeholder="Jardins"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full px-4 py-3 bg-aura-pearl/40 border border-aura-linen rounded-xl text-sm focus:outline-hidden focus:border-aura-charcoal transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      placeholder="São Paulo"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-aura-pearl/40 border border-aura-linen rounded-xl text-sm focus:outline-hidden focus:border-aura-charcoal transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe">
                      Estado (UF)
                    </label>
                    <input
                      type="text"
                      placeholder="SP"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 bg-aura-pearl/40 border border-aura-linen rounded-xl text-sm focus:outline-hidden focus:border-aura-charcoal transition-all uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe">
                    Instagram da Clínica (Opcional para vitrine)
                  </label>
                  <input
                    type="text"
                    placeholder="@suaclinica.estetica"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full px-4 py-3 bg-aura-pearl/40 border border-aura-linen rounded-xl text-sm focus:outline-hidden focus:border-aura-charcoal transition-all"
                  />
                </div>
              </div>
            )}

            {/* ETAPA 4: ESCOLHA DO PLANO */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ONBOARDING_PLANS.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                          isSelected
                            ? 'bg-aura-charcoal text-white border-aura-charcoal shadow-xl ring-2 ring-aura-rose/40'
                            : 'bg-aura-pearl/30 border-aura-linen hover:border-aura-rose text-aura-charcoal'
                        }`}
                      >
                        {plan.badge && (
                          <div
                            className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full w-max mb-3 ${
                              isSelected
                                ? 'bg-aura-rose text-white'
                                : 'bg-aura-rose/20 text-aura-rose'
                            }`}
                          >
                            {plan.badge}
                          </div>
                        )}

                        <div>
                          <h4 className="text-lg font-serif font-bold mb-1">
                            {plan.name}
                          </h4>
                          <p
                            className={`text-xs mb-4 line-clamp-2 ${
                              isSelected ? 'text-gray-300' : 'text-aura-taupe'
                            }`}
                          >
                            {plan.description}
                          </p>

                          <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-sm font-medium">R$</span>
                            <span className="text-3xl font-serif font-bold">
                              {plan.price}
                            </span>
                            <span
                              className={`text-[10px] ${
                                isSelected ? 'text-gray-400' : 'text-aura-taupe'
                              }`}
                            >
                              /mês
                            </span>
                          </div>

                          <ul className="space-y-2 text-[11px] mb-6">
                            {plan.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <Check
                                  size={13}
                                  className={`shrink-0 mt-0.5 ${
                                    isSelected ? 'text-emerald-400' : 'text-emerald-600'
                                  }`}
                                />
                                <span className={isSelected ? 'text-gray-200' : 'text-aura-taupe'}>
                                  {f}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          type="button"
                          className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                            isSelected
                              ? 'bg-aura-rose text-white shadow-soft-glow'
                              : 'bg-white border border-aura-linen text-aura-charcoal hover:bg-aura-charcoal hover:text-white'
                          }`}
                        >
                          {isSelected ? '✓ Selecionado' : 'Selecionar'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-emerald-50 border border-emerald-200/60 p-4 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                    <span>Garantia de 14 dias: Cancele a qualquer momento sem multa ou fidelidade.</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                    Ativação Imediata
                  </span>
                </div>
              </div>
            )}

            {/* BOTÕES DE NAVEGAÇÃO ENTRE ETAPAS */}
            <div className="mt-8 pt-6 border-t border-aura-linen flex justify-between items-center">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as any)}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-aura-taupe hover:text-aura-charcoal transition-colors px-4 py-2"
                >
                  <ArrowLeft size={14} />
                  <span>Voltar</span>
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 bg-aura-charcoal text-white hover:bg-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-md hover:scale-102 transition-all"
                >
                  <span>Próximo Passo</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteRegistration}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-aura-charcoal hover:bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-102 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Ativando Assinatura...</span>
                  ) : (
                    <>
                      <span>Concluir &amp; Ativar Clínica</span>
                      <Sparkles size={14} className="text-aura-rose" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* LINK PARA JÁ CADASTRADOS */}
            {onOpenLogin && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="text-xs text-aura-taupe hover:text-aura-charcoal font-medium underline underline-offset-4"
                >
                  Já é parceiro Aura? Acessar minha conta corporativa
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
