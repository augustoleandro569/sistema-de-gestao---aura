// src/pages/public/PartnerOnboarding.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { AuraLogoV3 } from '../../components/ui/AuraLogoV3';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../core/BusinessContext';
import { dataService } from '../../services/dataService';
import {
  Building2,
  User,
  MapPin,
  Check,
  ChevronRight,
  ArrowLeft,
  Mail,
  Phone,
  Sparkles,
  Lock,
  Instagram,
  CheckCircle2,
  ShieldCheck,
  Award,
  Crown,
  Zap,
  Globe,
  X
} from 'lucide-react';

interface StepIndicatorProps {
  current: number;
  target: number;
  label: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ current, target, label }) => {
  const isDone = current > target;
  const isCurrent = current === target;

  return (
    <div className="flex items-center gap-4 group">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500 ${
          isDone
            ? 'bg-aura-rose text-white shadow-soft-glow'
            : isCurrent
            ? 'border-2 border-aura-rose text-white bg-aura-rose/20 shadow-soft-glow'
            : 'border border-white/20 text-white/40 bg-white/5'
        }`}
      >
        {isDone ? <Check size={14} className="stroke-[3]" /> : target}
      </div>
      <div>
        <p
          className={`text-[9px] font-bold uppercase tracking-[0.25em] transition-colors ${
            isCurrent ? 'text-aura-rose' : isDone ? 'text-white/80' : 'text-white/30'
          }`}
        >
          Etapa 0{target}
        </p>
        <p
          className={`text-xs font-semibold tracking-wide transition-colors ${
            isCurrent ? 'text-white' : isDone ? 'text-white/90' : 'text-white/40'
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

interface AuraInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const AuraInput: React.FC<AuraInputProps> = ({ label, icon, ...props }) => {
  return (
    <div className="space-y-1.5 text-left">
      <label className="text-[10px] font-bold text-aura-taupe uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-4 text-aura-taupe pointer-events-none">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`w-full p-4 rounded-2xl bg-aura-pearl border border-aura-linen outline-hidden text-sm font-medium text-aura-charcoal focus:border-aura-rose focus:bg-white transition-all ${
            icon ? 'pl-11' : 'pl-4'
          }`}
        />
      </div>
    </div>
  );
};

export const PartnerOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { createBusiness, setCurrentBusinessId } = useBusiness();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Form State
  // Step 1: Identidade do Gestor
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [managerCpf, setManagerCpf] = useState('');
  const [managerPassword, setManagerPassword] = useState('');

  // Step 2: Sobre o Negócio
  const [businessName, setBusinessName] = useState('');
  const [specialty, setSpecialty] = useState('Estética Facial & Harmonização');
  const [instagram, setInstagram] = useState('');

  // Step 3: Unidades & Localização
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [neighborhood, setNeighborhood] = useState('Jardins');
  const [address, setAddress] = useState('');

  // Step 4: Escolha do Plano
  const [selectedPlan, setSelectedPlan] = useState<'essencial' | 'pro' | 'enterprise'>('pro');

  const plans = [
    {
      id: 'essencial' as const,
      name: 'Essencial',
      price: 'R$ 197',
      period: '/mês',
      description: 'Ideal para profissionais autônomas e estúdios em fase de estruturação.',
      features: ['Agenda Digital & Prontuário', 'Controle Financeiro Básico', 'Vitrine Simples no Marketplace'],
    },
    {
      id: 'pro' as const,
      name: 'Profissional Pro',
      badge: 'Mais Escolhido',
      price: 'R$ 347',
      period: '/mês',
      description: 'Perfeito para clínicas consolidadas que buscam escala e inteligência DRE.',
      features: ['DRE & Margem por Procedimento', 'Controle de Estoque & Lotes', 'Destaque no Marketplace Nacional', 'WhatsApp Integrado'],
    },
    {
      id: 'enterprise' as const,
      name: 'Elite Enterprise',
      price: 'R$ 597',
      period: '/mês',
      description: 'Para grandes clínicas e franquias multidisciplinares com múltiplas salas.',
      features: ['Multi-profissionais Ilimitados', 'Auditoria Biomédica Completa', 'Suporte Prioritário VIP', 'API Aberta & Relatórios Avançados'],
    },
  ];

  const handleNextStep = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleCompleteOnboarding();
    }
  };

  const handleCompleteOnboarding = async () => {
    setIsSubmitting(true);

    try {
      // 1. Gera e cadastra o Business multi-tenant
      const fallbackName = businessName.trim() || 'Aura Concept Harmonização';
      const cleanSlug = fallbackName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const newBiz = await createBusiness({
        name: fallbackName,
        tradeName: fallbackName,
        corporateReason: `${fallbackName} Estética LTDA`,
        document: '32.145.890/0001-44',
        email: managerEmail.trim() || 'contato@suaclinica.com.br',
        phone: managerPhone.trim() || '(11) 98765-4321',
        slug: cleanSlug,
        subdomain: cleanSlug,
        address: address.trim() || 'Rua Oscar Freire, 1200',
        neighborhood: neighborhood.trim() || 'Jardins',
        city: city.trim() || 'São Paulo',
        state: state.trim() || 'SP',
        instagram: instagram.trim() || '@suaclinica',
        plan_type: selectedPlan,
        planType: selectedPlan,
      });

      setCurrentBusinessId(newBiz.id);

      // 2. Realiza o login como Dono/Administrador da Clínica
      login('OWNER', {
        name: managerName.trim() || 'Gestora Aura',
        email: managerEmail.trim() || 'gestora@suaclinica.com.br',
        cpf: managerCpf.trim() || '123.456.789-00',
        phone: managerPhone.trim() || '(11) 98765-4321',
        role: 'OWNER',
        business_id: newBiz.id,
      });

      setSuccessAnimation(true);

      // 3. Redirecionamento suave para o Dashboard do Aura Business
      setTimeout(() => {
        navigate('/business/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Erro ao finalizar onboarding do parceiro:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-aura-pearl flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-aura-rose/30 selection:text-aura-charcoal">
      {/* BARRA SUPERIOR: BOTÃO RETORNAR AO PORTAL / HOME */}
      <div className="max-w-[1050px] w-full flex justify-between items-center px-3 py-2 mb-2">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-aura-taupe hover:text-aura-charcoal transition-all group py-1 px-3 rounded-full hover:bg-white/80 border border-transparent hover:border-aura-linen cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-aura-rose" />
          <span>Retornar ao Portal</span>
        </button>

        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aura-taupe/70 hidden sm:inline-block">
          Aura Business Onboarding
        </span>
      </div>

      <div className="max-w-[1050px] w-full bg-white rounded-[40px] sm:rounded-[60px] shadow-luminous border border-aura-linen flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-500 mb-6">
        {/* LADO ESQUERDO: CONTEÚDO ASPIRACIONAL (35%) */}
        <div className="md:w-[35%] bg-aura-charcoal p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="z-10">
            <AuraLogoV3
              size="sm"
              variant="business"
              subtitle="Business Intelligence"
              onClick={() => navigate('/')}
            />
            <h2 className="text-3xl sm:text-4xl font-serif leading-tight mt-10 sm:mt-12">
              Leve sua clínica para o <span className="text-aura-rose italic">nível Elite.</span>
            </h2>
            <p className="text-aura-taupe text-xs sm:text-sm mt-4 sm:mt-6 leading-relaxed font-light">
              Junte-se à maior rede de estética do país e tenha acesso a ferramentas de gestão que garantem seu lucro real e agenda lotada.
            </p>
          </div>

          {/* INDICADOR DE ETAPAS VISUAL */}
          <div className="z-10 space-y-5 sm:space-y-6 my-8">
            <StepIndicator current={step} target={1} label="Identidade do Gestor" />
            <StepIndicator current={step} target={2} label="Sobre o Negócio" />
            <StepIndicator current={step} target={3} label="Unidades & Localização" />
            <StepIndicator current={step} target={4} label="Escolha do Plano" />
          </div>

          <div className="z-10 pt-4 border-t border-white/10 text-[10px] text-white/50 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} className="text-aura-rose" />
            <span>Multi-Tenant Seguro • Criptografia SSL</span>
          </div>

          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-aura-rose/15 rounded-full blur-[100px] pointer-events-none" />
        </div>

        {/* LADO DIREITO: O FORMULÁRIO DINÂMICO (65%) */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-white overflow-y-auto">
          {successAnimation ? (
            <div className="my-auto py-12 text-center space-y-6 animate-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-soft-glow">
                <Check size={40} className="stroke-[3]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-serif text-aura-charcoal">Clínica Ativada com Sucesso!</h3>
                <p className="text-sm text-aura-taupe max-w-md mx-auto">
                  Sua vitrine no marketplace foi provisionada e o cockpit do Aura Business está pronto para uso.
                </p>
              </div>
              <div className="pt-4">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-aura-rose">
                  <Sparkles size={14} /> Carregando seu Dashboard...
                </span>
              </div>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                {/* ETAPA 1: IDENTIDADE DO GESTOR */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 sm:space-y-8"
                  >
                    <header>
                      <span className="text-[10px] font-bold text-aura-rose uppercase tracking-[0.3em] bg-aura-pearl px-3.5 py-1 rounded-full border border-aura-rose/25">
                        Passo 1 de 4
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif text-aura-charcoal mt-3">
                        Bem-vinda ao Aura Business
                      </h3>
                      <p className="text-xs sm:text-sm text-aura-taupe mt-1">
                        Inicie seu cadastro com seus dados pessoais de gestora.
                      </p>
                    </header>

                    <div className="space-y-4">
                      <AuraInput
                        icon={<User size={18} />}
                        label="Nome Completo da Gestora"
                        placeholder="Ex: Dra. Ana Clara Silva"
                        value={managerName}
                        onChange={(e) => setManagerName(e.target.value)}
                      />
                      <AuraInput
                        icon={<Mail size={18} />}
                        type="email"
                        label="E-mail Corporativo de Acesso"
                        placeholder="ana@suaclinica.com.br"
                        value={managerEmail}
                        onChange={(e) => setManagerEmail(e.target.value)}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <AuraInput
                          icon={<Phone size={18} />}
                          label="WhatsApp Profissional"
                          placeholder="(11) 98765-4321"
                          value={managerPhone}
                          onChange={(e) => setManagerPhone(e.target.value)}
                        />
                        <AuraInput
                          label="CPF da Responsável"
                          placeholder="000.000.000-00"
                          value={managerCpf}
                          onChange={(e) => setManagerCpf(e.target.value)}
                        />
                      </div>
                      <AuraInput
                        icon={<Lock size={18} />}
                        type="password"
                        label="Crie sua Senha de Acesso"
                        placeholder="••••••••••••"
                        value={managerPassword}
                        onChange={(e) => setManagerPassword(e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}

                {/* ETAPA 2: SOBRE O NEGÓCIO */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 sm:space-y-8"
                  >
                    <header>
                      <span className="text-[10px] font-bold text-aura-rose uppercase tracking-[0.3em] bg-aura-pearl px-3.5 py-1 rounded-full border border-aura-rose/25">
                        Passo 2 de 4
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif text-aura-charcoal mt-3">
                        Sobre a sua Clínica
                      </h3>
                      <p className="text-xs sm:text-sm text-aura-taupe mt-1">
                        Como você quer aparecer no Marketplace para os clientes Augustus?
                      </p>
                    </header>

                    <div className="space-y-4">
                      <AuraInput
                        icon={<Building2 size={18} />}
                        label="Nome Fantasia da Clínica"
                        placeholder="Ex: Aura Concept Harmonização"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                      />

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-bold text-aura-taupe uppercase tracking-widest ml-1">
                          Especialidade Principal
                        </label>
                        <select
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                          className="w-full p-4 rounded-2xl bg-aura-pearl border border-aura-linen outline-hidden text-sm font-medium text-aura-charcoal focus:border-aura-rose focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                          <option>Estética Facial & Harmonização</option>
                          <option>Dermatologia Estética & Laser</option>
                          <option>Estética Corporal & Drenagem</option>
                          <option>Sobrancelhas, Cílios & Micropigmentação</option>
                          <option>Spa Urbano & Bem-Estar</option>
                          <option>Clínica Multidisciplinar Integrada</option>
                        </select>
                      </div>

                      <AuraInput
                        icon={<Instagram size={18} />}
                        label="Instagram da Clínica (Vitrine Social)"
                        placeholder="@suaclinica.estetica"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                      />

                      {/* VANTAGEM COMPETITIVA READY TO SELL */}
                      <div className="p-4 rounded-2xl bg-aura-rose/10 border border-aura-rose/30 flex items-start gap-3">
                        <Sparkles size={18} className="text-aura-rose shrink-0 mt-0.5" />
                        <div className="text-left text-xs">
                          <p className="font-bold text-aura-charcoal">Recurso Exclusivo: "Ready to Sell"</p>
                          <p className="text-aura-taupe mt-0.5">
                            Sua vitrine no marketplace já iniciará pré-configurada com fotos e protocolos editoriais da especialidade <strong>{specialty}</strong> para você já começar faturando.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ETAPA 3: UNIDADES & LOCALIZAÇÃO */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 sm:space-y-8"
                  >
                    <header>
                      <span className="text-[10px] font-bold text-aura-rose uppercase tracking-[0.3em] bg-aura-pearl px-3.5 py-1 rounded-full border border-aura-rose/25">
                        Passo 3 de 4
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif text-aura-charcoal mt-3">
                        Localização da Unidade
                      </h3>
                      <p className="text-xs sm:text-sm text-aura-taupe mt-1">
                        Permita que os clientes próximos encontrem sua clínica no Mapa Inteligente.
                      </p>
                    </header>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <AuraInput
                            label="Cidade"
                            placeholder="São Paulo"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                        <div>
                          <AuraInput
                            label="Estado (UF)"
                            placeholder="SP"
                            maxLength={2}
                            value={state}
                            onChange={(e) => setState(e.target.value.toUpperCase())}
                          />
                        </div>
                      </div>

                      <AuraInput
                        icon={<MapPin size={18} />}
                        label="Bairro de Atendimento"
                        placeholder="Ex: Jardins, Itaim Bibi, Moema"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                      />

                      <AuraInput
                        label="Endereço Completo & Número"
                        placeholder="Ex: Rua Oscar Freire, 1200 - Conjunto 42"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />

                      <div className="p-4 rounded-2xl bg-aura-pearl border border-aura-linen flex items-center gap-3 text-xs text-aura-taupe">
                        <Globe size={18} className="text-aura-rose shrink-0" />
                        <span>Sua clínica receberá um endereço web exclusivo: <strong>aura.app/perfil/{businessName ? businessName.toLowerCase().replace(/\s+/g, '-') : 'sua-clinica'}</strong></span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ETAPA 4: ESCOLHA DO PLANO */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 sm:space-y-8"
                  >
                    <header>
                      <span className="text-[10px] font-bold text-aura-rose uppercase tracking-[0.3em] bg-aura-pearl px-3.5 py-1 rounded-full border border-aura-rose/25">
                        Passo 4 de 4
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif text-aura-charcoal mt-3">
                        Escolha seu Plano Aura
                      </h3>
                      <p className="text-xs sm:text-sm text-aura-taupe mt-1">
                        Selecione o plano ideal para a escala de atendimento da sua clínica.
                      </p>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {plans.map((p) => {
                        const isSelected = selectedPlan === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedPlan(p.id)}
                            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                              isSelected
                                ? 'border-aura-rose bg-white shadow-luminous scale-102'
                                : 'border-aura-linen bg-aura-pearl/50 hover:border-aura-taupe/40'
                            }`}
                          >
                            {p.badge && (
                              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-aura-charcoal text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                                {p.badge}
                              </span>
                            )}

                            <div>
                              <p className="text-xs font-bold text-aura-charcoal uppercase tracking-wider">
                                {p.name}
                              </p>
                              <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-2xl font-serif font-bold text-aura-charcoal">
                                  {p.price}
                                </span>
                                <span className="text-[10px] text-aura-taupe">{p.period}</span>
                              </div>
                              <p className="text-[11px] text-aura-taupe mt-2 leading-relaxed">
                                {p.description}
                              </p>
                            </div>

                            <div className="pt-4 border-t border-aura-linen/60 mt-4 space-y-1.5 text-left">
                              {p.features.map((feat, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-[10px] text-aura-charcoal">
                                  <Check size={12} className="text-aura-rose shrink-0" />
                                  <span className="line-clamp-1">{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 pt-2 text-[11px] text-aura-taupe">
                      <ShieldCheck size={16} className="text-emerald-600" />
                      <span>Sem taxa de adesão ou fidelidade. Cancele a qualquer momento.</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* BOTÕES DE NAVEGAÇÃO DO FORMULÁRIO */}
              <div className="mt-8 pt-6 border-t border-aura-linen flex gap-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    disabled={isSubmitting}
                    className="px-6 sm:px-8 py-4 rounded-full font-bold text-xs text-aura-taupe uppercase tracking-widest hover:bg-aura-linen transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ArrowLeft size={16} /> Voltar
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  className="flex-1 bg-aura-charcoal text-white py-4 sm:py-5 rounded-[24px] font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Provisionando sua Clínica...</span>
                  ) : step === 4 ? (
                    <>
                      <span>FINALIZAR E ACESSAR DASHBOARD</span>
                      <Crown size={16} className="text-aura-rose" />
                    </>
                  ) : (
                    <>
                      <span>Próxima Etapa</span>
                      <ChevronRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="mt-4 text-[10px] text-aura-taupe font-bold uppercase tracking-[0.4em]">
        Aura Platform • Business Intelligence &amp; Multi-Tenant Architecture
      </p>
    </div>
  );
};

export default PartnerOnboarding;
