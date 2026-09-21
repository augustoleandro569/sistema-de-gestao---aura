// src/pages/root/PlatformCockpit.tsx
import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Building2,
  Users,
  DollarSign,
  Calendar,
  Search,
  LogIn,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Clock,
  History,
  Lock,
  ChevronRight,
  UserCheck,
  Zap,
  Unlock,
  Check,
  X,
  Edit3,
  Key,
  Shield,
  Layers,
  ArrowRight,
  Filter,
  Sliders,
  Plus,
  Globe,
  Eye,
  ExternalLink,
  Store,
  TrendingUp,
  Percent,
  Coins
} from 'lucide-react';
import { useBusiness } from '../../core/BusinessContext';
import { useAuth } from '../../context/AuthContext';
import { useLayout } from '../../layouts/LayoutContext';
import { dataService, PlatformSettings } from '../../services/dataService';
import { Business, PlanType, Profile, UserRole } from '../../types';
import { BusinessLanding } from '../public/BusinessLanding';

interface ModuleSwitchProps {
  label: string;
  moduleId: string;
  active: boolean;
  onToggle: () => void;
}

const ModuleSwitch: React.FC<ModuleSwitchProps> = ({ label, active, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`p-3 rounded-2xl flex items-center justify-between text-left transition-all border cursor-pointer ${
      active
        ? 'bg-white border-[#EAD7D1] text-[#3A3A3A] shadow-soft-glow'
        : 'bg-[#F9F7F5]/80 border-[#F1EBE7] text-[#8E8E8E] hover:border-[#EAD7D1]/60 hover:text-[#3A3A3A]'
    }`}
  >
    <div className="flex items-center gap-2.5">
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-[#C5A059] shadow-[0_0_8px_rgba(197,160,89,0.5)]' : 'bg-[#8E8E8E]/40'}`} />
      <span className="text-xs font-semibold">{label}</span>
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
      active ? 'bg-[#FAF5EB] text-[#C5A059] border border-[#F1EBE7]' : 'bg-white text-[#8E8E8E] border border-[#F1EBE7]'
    }`}>
      {active ? 'Ativo' : 'Off'}
    </span>
  </button>
);

interface PlanItemProps {
  name: string;
  price: string;
  modulesCount: number;
  slug: string;
  isPopular?: boolean;
}

const PlanItem: React.FC<PlanItemProps> = ({ name, price, modulesCount, slug, isPopular }) => (
  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#F1EBE7] shadow-2xs hover:shadow-soft-glow transition-all">
    <div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-[#3A3A3A]">{name}</span>
        {isPopular && (
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FAF5EB] text-[#C5A059] border border-[#F1EBE7] uppercase tracking-wider">
            Top
          </span>
        )}
      </div>
      <span className="text-[10px] text-[#8E8E8E]">{modulesCount} módulos inclusos</span>
    </div>
    <div className="text-right">
      <span className="text-xs font-bold text-[#3A3A3A]">{price}</span>
      <span className="text-[10px] text-[#8E8E8E] block">/mês</span>
    </div>
  </div>
);

export const PlatformCockpit: React.FC = () => {
  const {
    businesses,
    impersonateAsAdmin,
    isImpersonating,
    impersonatedBusiness,
    exitImpersonate,
    updateBusinessPlan,
    toggleBusinessStatus,
    auditLogs,
    addAuditLog,
    platformStats,
    platformModules,
    businessModulesMap,
    toggleModuleForBusiness,
    commercialPlans,
    createBusiness,
  } = useBusiness();

  const { userProfile } = useAuth();
  const layout = useLayout();

  // Estados de navegação interna do Cockpit
  const [activeTab, setActiveTab] = useState<'tenants' | 'users' | 'monetization' | 'logs'>('tenants');
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Configuração Global de Monetização & Comissões (Aura Core)
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => dataService.getPlatformSettings());

  // Gestão Global de Usuários (Base Aura)
  const [selectedBusinessForUsers, setSelectedBusinessForUsers] = useState<string>('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [allProfiles, setAllProfiles] = useState<Profile[]>(() => dataService.getProfiles());

  // Modal de Edição de Usuário
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('PROFESSIONAL');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Modal de Criação de Estabelecimento
  const [showNewBizModal, setShowNewBizModal] = useState(false);
  const [previewLandingBiz, setPreviewLandingBiz] = useState<Business | null>(null);
  const [newBizName, setNewBizName] = useState('');
  const [newBizOwner, setNewBizOwner] = useState('');
  const [newBizEmail, setNewBizEmail] = useState('');
  const [newBizPhone, setNewBizPhone] = useState('');
  const [newBizCity, setNewBizCity] = useState('São Paulo');
  const [newBizPlan, setNewBizPlan] = useState<PlanType>('pro');

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Filtragem de Estabelecimentos
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      const matchSearch =
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.city?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPlan = planFilter === 'all' || b.plan_type === planFilter;
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchSearch && matchPlan && matchStatus;
    });
  }, [businesses, searchTerm, planFilter, statusFilter]);

  // Filtragem Global de Usuários
  const filteredProfiles = useMemo(() => {
    return allProfiles.filter((p) => {
      const matchBiz =
        selectedBusinessForUsers === 'all' ||
        p.organizationId === selectedBusinessForUsers ||
        p.organization_id === selectedBusinessForUsers ||
        p.businessId === selectedBusinessForUsers ||
        p.business_id === selectedBusinessForUsers;

      const matchSearch =
        p.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        (p.cpf && p.cpf.includes(userSearchTerm)) ||
        (p.phone && p.phone.includes(userSearchTerm));

      return matchBiz && matchSearch;
    });
  }, [allProfiles, selectedBusinessForUsers, userSearchTerm]);

  // Alternar Feature Flag Remota de Módulo
  const handleToggleModule = (biz: Business, modId: string) => {
    const isCurrentlyActive = (businessModulesMap[biz.id] || []).includes(modId);
    toggleModuleForBusiness(biz.id, modId);
    const modObj = platformModules.find((m) => m.id === modId);
    const modLabel = modObj?.name || modId;

    addAuditLog(
      isCurrentlyActive ? 'MODULE_REVOKE' : 'MODULE_GRANT',
      biz.id,
      `Platform Admin ${isCurrentlyActive ? 'desativou' : 'ativou'} o módulo ${modLabel} para a clínica ${biz.name}`
    );

    showNotification(`Módulo ${modLabel} ${isCurrentlyActive ? 'desativado' : 'liberado'} para ${biz.name}`);
  };

  // Impersonate / Logar como Admin da Clínica
  const handleImpersonate = (biz: Business) => {
    impersonateAsAdmin(biz.id);
    addAuditLog(
      'IMPERSONATE_START',
      biz.id,
      `Platform Admin iniciou sessão de suporte (Bypass) na clínica ${biz.name}`
    );
    showNotification(`Sessão de suporte iniciada na clínica ${biz.name}. Role PLATFORM_ADMIN preservada.`);
    layout.setCurrentTab('dashboard');
  };

  // Alternar Status da Clínica
  const handleToggleStatus = (biz: Business) => {
    toggleBusinessStatus(biz.id);
    const newStatus = biz.status === 'active' ? 'suspended' : 'active';
    addAuditLog(
      'BUSINESS_STATUS_CHANGE',
      biz.id,
      `Platform Admin alterou o status da clínica ${biz.name} para ${newStatus.toUpperCase()}`
    );
    showNotification(`Status de ${biz.name} alterado para ${newStatus.toUpperCase()}`);
  };

  // Salvar Edição Global de Usuário
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    const updated = allProfiles.map((p) => {
      if (p.id === editingProfile.id) {
        return {
          ...p,
          name: editName.trim(),
          full_name: editName.trim(),
          email: editEmail.trim().toLowerCase(),
          phone: editPhone.trim(),
          role: editRole,
        };
      }
      return p;
    });

    setAllProfiles(updated);
    addAuditLog(
      'USER_UPDATE_ROOT',
      editingProfile.organizationId || editingProfile.businessId,
      `Platform Admin editou o usuário ${editName} (${editEmail}) alterando cargo para ${editRole}`,
      editEmail
    );

    setEditingProfile(null);
    showNotification(`Perfil de ${editName} atualizado com sucesso na Base Aura.`);
  };

  // Reset de Senha do Usuário
  const handleResetPassword = (profile: Profile) => {
    addAuditLog(
      'PASSWORD_RESET_ROOT',
      profile.organizationId || profile.businessId,
      `Platform Admin gerou token de recuperação para ${profile.email}`,
      profile.email
    );
    showNotification(`Link de redefinição emitido e enviado para ${profile.email}.`);
  };

  // Criação de Nova Clínica
  const handleCreateBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim() || !newBizOwner.trim()) return;

    const created = createBusiness({
      name: newBizName.trim(),
      ownerName: newBizOwner.trim(),
      ownerEmail: newBizEmail.trim().toLowerCase(),
      phone: newBizPhone.trim(),
      city: newBizCity.trim(),
      plan_type: newBizPlan,
      planType: newBizPlan,
      status: 'active',
    });

    addAuditLog(
      'BUSINESS_CREATE_ROOT',
      created.id,
      `Platform Admin provisionou novo tenant: ${created.name} (${created.city}) no plano ${newBizPlan.toUpperCase()}`
    );

    setShowNewBizModal(false);
    setNewBizName('');
    setNewBizOwner('');
    setNewBizEmail('');
    setNewBizPhone('');
    showNotification(`Clínica ${created.name} provisionada com sucesso!`);
  };

  // Handlers de Monetização e Comissões da Plataforma
  const handleUpdateCommissionRate = (rate: number) => {
    const updated = dataService.updatePlatformSettings({ marketplaceCommissionRate: rate });
    setPlatformSettings(updated);
    addAuditLog(
      'SETTINGS_UPDATE_ROOT',
      'AURA_PLATFORM',
      `Taxa de comissão do Marketplace ajustada para ${(rate * 100).toFixed(0)}%`
    );
    showNotification(`Comissão do Marketplace ajustada para ${(rate * 100).toFixed(0)}%.`);
  };

  const handleToggleTakeRate = () => {
    const next = !platformSettings.enableMarketplaceTakeRate;
    const updated = dataService.updatePlatformSettings({ enableMarketplaceTakeRate: next });
    setPlatformSettings(updated);
    addAuditLog(
      'SETTINGS_UPDATE_ROOT',
      'AURA_PLATFORM',
      `Take-rate do Marketplace ${next ? 'ativado' : 'desativado'}`
    );
    showNotification(`Take-rate do Marketplace ${next ? 'ativado' : 'desativado'}.`);
  };

  const handleToggleSaasFee = () => {
    const next = !platformSettings.saasMonthlyFeeEnabled;
    const updated = dataService.updatePlatformSettings({ saasMonthlyFeeEnabled: next });
    setPlatformSettings(updated);
    showNotification(`Mensalidade fixa SaaS ${next ? 'ativada' : 'desativada'}.`);
  };

  const handleUpdateSaasFee = (fee: number) => {
    const updated = dataService.updatePlatformSettings({ saasFixedFee: fee });
    setPlatformSettings(updated);
    showNotification(`Mensalidade SaaS base atualizada para R$ ${fee}.`);
  };

  // Métricas de Monetização do Marketplace
  const marketplaceAppointments = useMemo(() => {
    return dataService.getAppointments().filter(a => a.source === 'marketplace' || a.marketplaceFee);
  }, [platformSettings]);

  const totalMarketplaceGMV = useMemo(() => {
    return marketplaceAppointments.reduce((sum, a) => sum + (a.finalPrice || a.price || 0), 0);
  }, [marketplaceAppointments]);

  const totalMarketplaceCommission = useMemo(() => {
    return marketplaceAppointments.reduce((sum, a) => sum + (a.marketplaceFee || 0), 0);
  }, [marketplaceAppointments]);

  if (previewLandingBiz) {
    return (
      <div className="relative min-h-screen bg-black">
        {/* BARRA SUPERIOR DE INSPEÇÃO ROOT / AUDITORIA */}
        <div className="bg-amber-400 text-black px-4 sm:px-8 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider sticky top-0 z-[100] shadow-xl border-b border-black/20">
          <div className="flex items-center gap-2.5">
            <Shield size={17} className="text-black" />
            <span>Inspetor de Vitrine Digital • {previewLandingBiz.name} (Modo Super Admin)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const url = `${window.location.origin}/perfil/${previewLandingBiz.slug}`;
                navigator.clipboard?.writeText(url);
                showNotification('Link da vitrine pública copiado!');
              }}
              className="bg-black/10 hover:bg-black/20 text-black px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ExternalLink size={12} />
              <span>Copiar Link Exclusivo</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewLandingBiz(null)}
              className="bg-black text-white px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm"
            >
              ← Voltar ao Cockpit
            </button>
          </div>
        </div>

        <BusinessLanding
          business={previewLandingBiz}
          businessSlug={previewLandingBiz.slug}
          onBackToApp={() => setPreviewLandingBiz(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#3A3A3A] p-4 sm:p-8 font-sans antialiased">
      {/* BANNER FEEDBACK TOAST */}
      {feedbackMessage && (
        <div className="fixed top-6 right-6 z-[10000] bg-[#3A3A3A] text-white px-5 py-3 rounded-2xl shadow-soft-glow text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300 border border-[#C5A059]/40">
          <Sparkles size={16} className="text-[#C5A059]" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* BANNER DE IMPERSONATE ATIVO */}
      {isImpersonating && impersonatedBusiness && (
        <div className="mb-8 p-4 bg-[#FAF5EB] border border-[#C5A059]/30 rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#C5A059] animate-ping" />
            <span className="text-xs font-bold text-[#3A3A3A] uppercase tracking-wider">
              Sessão de Suporte Ativa: Visualizando como <span className="text-[#C5A059]">{impersonatedBusiness.name}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={exitImpersonate}
            className="text-xs bg-[#EAD7D1] hover:bg-[#dfc7c0] text-[#3A3A3A] px-4 py-1.5 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer shadow-soft-glow border border-white/80"
          >
            Sair do Suporte
          </button>
        </div>
      )}

      {/* HEADER MASTER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-[#F1EBE7] pb-8 gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#C5A059] uppercase">
              System Intelligence • Root Cockpit
            </span>
            <span className="bg-[#FAF5EB] border border-[#F1EBE7] text-[#C5A059] text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Bypass Transversal
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#3A3A3A] mt-2 font-bold tracking-tight">
            Aura Platform Control
          </h1>
          <p className="text-xs text-[#8E8E8E] mt-1">
            Infraestrutura Root Central • Entidade Superior Multi-tenant
          </p>
        </div>

        {/* MÉTRICAS EM TEMPO REAL */}
        <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="text-right px-4 sm:px-6 border-r border-[#F1EBE7] shrink-0">
            <p className="text-[10px] uppercase text-[#8E8E8E] font-bold tracking-wider">Total Revenue (MRR)</p>
            <p className="text-xl sm:text-2xl font-bold font-serif text-[#3A3A3A]">
              R$ {platformStats.totalMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="text-right px-4 sm:px-6 border-r border-[#F1EBE7] shrink-0">
            <p className="text-[10px] uppercase text-[#8E8E8E] font-bold tracking-wider">Tenants Ativos</p>
            <p className="text-xl sm:text-2xl font-bold font-serif text-[#3A3A3A]">
              {platformStats.activeTenants} <span className="text-xs text-[#8E8E8E] font-normal font-sans">/ {platformStats.totalTenants}</span>
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="text-[10px] uppercase text-[#8E8E8E] font-bold tracking-wider">System Health</p>
            <div className="flex items-center gap-1.5 justify-end">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xl sm:text-2xl font-bold text-emerald-600">Stable 99.9%</p>
            </div>
          </div>
        </div>
      </header>

      {/* BARRA DE AÇÕES E SUB-NAV MASTER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex bg-white p-1 rounded-2xl border border-[#F1EBE7] shadow-luminous">
          <button
            type="button"
            onClick={() => setActiveTab('tenants')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'tenants'
                ? 'bg-[#EAD7D1] text-[#3A3A3A] shadow-soft-glow border border-white/80'
                : 'text-[#8E8E8E] hover:text-[#3A3A3A]'
            }`}
          >
            <Building2 size={15} />
            <span>Estabelecimentos ({businesses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#EAD7D1] text-[#3A3A3A] shadow-soft-glow border border-white/80'
                : 'text-[#8E8E8E] hover:text-[#3A3A3A]'
            }`}
          >
            <Users size={15} />
            <span>Base Global de Usuários ({allProfiles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('monetization')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'monetization'
                ? 'bg-[#EAD7D1] text-[#3A3A3A] shadow-soft-glow border border-white/80'
                : 'text-[#8E8E8E] hover:text-[#3A3A3A]'
            }`}
          >
            <Coins size={15} />
            <span>Monetização & Comissões</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-[#EAD7D1] text-[#3A3A3A] shadow-soft-glow border border-white/80'
                : 'text-[#8E8E8E] hover:text-[#3A3A3A]'
            }`}
          >
            <History size={15} />
            <span>Auditoria Root ({auditLogs.length})</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              layout.setActivePillar('marketplace');
              layout.setCurrentTab('marketplace');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F9F7F5] text-[#3A3A3A] text-xs font-semibold border border-[#F1EBE7] shadow-2xs transition-colors cursor-pointer"
            title="Abrir o Aura App em modo consumidor"
          >
            <Store size={14} className="text-[#C5A059]" />
            <span>Aura App (B2C)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              layout.setActivePillar('business');
              layout.setCurrentTab('dashboard');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F9F7F5] text-[#3A3A3A] text-xs font-semibold border border-[#F1EBE7] shadow-2xs transition-colors cursor-pointer"
            title="Abrir o Aura Business em modo lojista"
          >
            <Building2 size={14} className="text-[#C5A059]" />
            <span>Aura Business (B2B)</span>
          </button>

          {activeTab === 'tenants' && (
            <button
              type="button"
              onClick={() => setShowNewBizModal(true)}
              className="flex items-center gap-2 bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-soft-glow"
            >
              <Plus size={16} />
              <span>Novo Estabelecimento</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: TENANTS & FEATURE FLAGS REMOTAS */}
      {activeTab === 'tenants' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* COLUNA ESQUERDA: GESTÃO DE ESTABELECIMENTOS (TENANTS) */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#3A3A3A] flex items-center gap-2">
                <span>Estabelecimentos Cadastrados</span>
                <span className="text-[10px] text-[#8E8E8E] font-normal">
                  ({filteredBusinesses.length} filtrados)
                </span>
              </h2>

              {/* FILTROS DE BUSCA E STATUS */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E8E]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar clínica, proprietário..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#F1EBE7] rounded-xl text-xs text-[#3A3A3A] placeholder-[#8E8E8E] focus:outline-none focus:border-[#EAD7D1] shadow-2xs"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-[#F1EBE7] rounded-xl text-xs text-[#3A3A3A] px-3 py-2 focus:outline-none focus:border-[#EAD7D1] shadow-2xs cursor-pointer"
                >
                  <option value="all">Status: Todos</option>
                  <option value="active">Ativos</option>
                  <option value="suspended">Suspensos</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredBusinesses.map((biz) => {
                const activeMods = businessModulesMap[biz.id] || [];
                const isBizActive = biz.status === 'active';

                return (
                  <div
                    key={biz.id}
                    className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#F1EBE7] hover:border-[#EAD7D1] transition-all shadow-luminous hover:shadow-soft-glow relative overflow-hidden"
                  >
                    {/* CABEÇALHO DO CARD */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-[#3A3A3A] tracking-tight">{biz.name}</h3>
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                                isBizActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                              }`}
                            >
                              {isBizActive ? 'ATIVA' : 'SUSPENSA'}
                            </span>
                            <span className="bg-[#FAF5EB] text-[#C5A059] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-[#F1EBE7]">
                              PLANO {biz.plan_type.toUpperCase()}
                            </span>
                            {activeMods.includes('vitrine') ? (
                              <span className="bg-emerald-50 text-emerald-700 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-emerald-200/60 flex items-center gap-1.5">
                                <Globe size={11} />
                                <span>Vitrine Online</span>
                              </span>
                            ) : (
                              <span className="bg-amber-50 text-amber-700 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-amber-200/60 flex items-center gap-1.5">
                                <Lock size={11} />
                                <span>Vitrine Bloqueada</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-[#8E8E8E] mt-1">
                          Proprietário: <span className="text-[#3A3A3A] font-medium">{biz.ownerName}</span> • E-mail: {biz.ownerEmail} • Link: <span className="text-[#C5A059] font-mono text-[11px]">auraestetica.com.br/{biz.slug}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewLandingBiz(biz)}
                          className="text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer border bg-[#FAF5EB] hover:bg-[#F3ECE1] text-[#C5A059] border-[#F1EBE7] flex items-center gap-1.5 shadow-2xs"
                          title="Inspecionar Vitrine Pública desta clínica"
                        >
                          <Eye size={12} />
                          <span>Ver Vitrine</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(biz)}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer border shadow-2xs ${
                            isBizActive
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200/60'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200/60'
                          }`}
                        >
                          {isBizActive ? 'Suspender' : 'Reativar'}
                        </button>
                      </div>
                    </div>

                    {/* CONTROLE REMOTO DE MÓDULOS (FEATURE FLAGS) */}
                    <div className="bg-[#F9F7F5] rounded-2xl p-4 sm:p-5 border border-[#F1EBE7] mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-widest flex items-center gap-1.5">
                          <Sliders size={13} className="text-[#C5A059]" />
                          Controle Remoto de Módulos (Feature Flags)
                        </span>
                        <span className="text-[10px] text-[#8E8E8E] font-medium">
                          {activeMods.length} de {platformModules.length} liberados
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {platformModules.map((mod) => (
                          <ModuleSwitch
                            key={mod.id}
                            label={mod.name}
                            moduleId={mod.id}
                            active={activeMods.includes(mod.id)}
                            onToggle={() => handleToggleModule(biz, mod.id)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* RODAPÉ DO CARD COM BYPASS / IMPERSONATE E VITRINE */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-[#F1EBE7]">
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#8E8E8E]">
                        <span>Faturamento Est.: R$ 28.400/mês</span>
                        <span>•</span>
                        <span>Link Bio: /{biz.slug}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setPreviewLandingBiz(biz)}
                          className="text-[10px] font-bold text-[#C5A059] bg-[#FAF5EB] hover:bg-[#F3ECE1] px-3.5 py-2 rounded-xl transition-all uppercase tracking-widest flex items-center gap-1.5 cursor-pointer border border-[#F1EBE7] shadow-2xs"
                        >
                          <Globe size={13} />
                          <span>Vitrine Digital</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleImpersonate(biz)}
                          className="text-[10px] font-bold text-[#3A3A3A] bg-[#EAD7D1] hover:bg-[#dfc7c0] px-4 py-2 rounded-xl transition-all uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-soft-glow border border-white/80 group"
                        >
                          <LogIn size={13} className="group-hover:translate-x-0.5 transition-transform" />
                          <span>Acessar como Admin (Bypass)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* COLUNA DIREITA: CONFIGURAÇÃO DE PLANOS & ALERTAS */}
          <section className="lg:col-span-4 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#3A3A3A]">Configuração de Planos</h2>

            <div className="bg-white rounded-[28px] p-6 border border-[#F1EBE7] shadow-luminous">
              <div className="space-y-3">
                {commercialPlans.map((plan) => (
                  <PlanItem
                    key={plan.id}
                    name={plan.name}
                    price={`R$ ${plan.monthlyPrice.toFixed(2).replace('.', ',')}`}
                    modulesCount={plan.includedModules.length}
                    slug={plan.slug}
                    isPopular={plan.isPopular}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => showNotification('Editor de planos mestre pronto para novas configurações.')}
                className="w-full mt-6 py-3.5 bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-soft-glow flex items-center justify-center gap-2"
              >
                <Plus size={15} />
                <span>Criar Novo Plano</span>
              </button>
            </div>

            {/* ALERTA DE SISTEMA */}
            <div className="bg-[#FAF5EB] rounded-[28px] p-6 border border-[#C5A059]/30 shadow-luminous">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-[#C5A059]" />
                <h3 className="text-[#3A3A3A] text-xs font-bold uppercase tracking-wider">
                  Alerta de Sistema
                </h3>
              </div>
              <p className="text-xs text-[#8E8E8E] leading-relaxed">
                Existem 4 clínicas com pagamento pendente há mais de 5 dias. O motor de bloqueio de abas entrará em vigor automaticamente para os módulos excedentes.
              </p>
            </div>

            {/* AUDITORIA RECENTE COMPACTA */}
            <div className="bg-white rounded-[28px] p-6 border border-[#F1EBE7] shadow-luminous">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#3A3A3A] uppercase tracking-wider">Ações Root Recentes</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('logs')}
                  className="text-[10px] text-[#C5A059] hover:underline uppercase font-bold cursor-pointer"
                >
                  Ver Todos
                </button>
              </div>

              <div className="space-y-3">
                {auditLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="p-3.5 bg-[#F9F7F5] rounded-2xl border border-[#F1EBE7] text-left">
                    <p className="text-[11px] font-medium text-[#3A3A3A] line-clamp-2">{log.details}</p>
                    <span className="text-[9px] text-[#8E8E8E] mt-1 block">
                      {new Date(log.created_at).toLocaleTimeString('pt-BR')} • Root Dev
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* VIEW 2: GESTÃO GLOBAL DE USUÁRIOS (BASE AURA - SEM LIMITES) */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[28px] border border-[#F1EBE7] shadow-luminous">
            <div>
              <h2 className="text-lg font-bold text-[#3A3A3A] tracking-tight">Base Global de Usuários</h2>
              <p className="text-xs text-[#8E8E8E]">
                Acesso direto a todas as contas de profissionais, recepcionistas e administradores da rede Aura.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* DROPDOWN POR CLÍNICA */}
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-[#8E8E8E]" />
                <select
                  value={selectedBusinessForUsers}
                  onChange={(e) => setSelectedBusinessForUsers(e.target.value)}
                  className="bg-white border border-[#F1EBE7] rounded-xl text-xs text-[#3A3A3A] px-3 py-2 focus:outline-none focus:border-[#EAD7D1] shadow-2xs cursor-pointer"
                >
                  <option value="all">Todas as Clínicas (Global)</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* BUSCA GERAL */}
              <div className="relative flex-1 sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E8E]" />
                <input
                  type="text"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  placeholder="Nome, e-mail, CPF..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#F1EBE7] rounded-xl text-xs text-[#3A3A3A] placeholder-[#8E8E8E] focus:outline-none focus:border-[#EAD7D1] shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* TABELA DE USUÁRIOS */}
          <div className="bg-white rounded-[28px] border border-[#F1EBE7] overflow-hidden shadow-luminous">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#F1EBE7] bg-[#F9F7F5] text-[#8E8E8E] uppercase tracking-wider text-[10px] font-bold">
                    <th className="py-4 px-6">Usuário</th>
                    <th className="py-4 px-6">Contato</th>
                    <th className="py-4 px-6">Estabelecimento / Unidade</th>
                    <th className="py-4 px-6">Cargo / Permissão</th>
                    <th className="py-4 px-6 text-right">Ações de Root</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1EBE7]">
                  {filteredProfiles.map((p) => {
                    const matchedBiz = businesses.find(
                      (b) => b.id === p.organizationId || b.id === p.organization_id || b.id === p.businessId
                    );

                    return (
                      <tr key={p.id} className="hover:bg-[#FAF5EB]/40 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-[#3A3A3A]">{p.name}</div>
                          <div className="text-[10px] text-[#8E8E8E]">ID: {p.id}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-[#3A3A3A]">{p.email}</div>
                          <div className="text-[10px] text-[#8E8E8E]">{p.phone || p.cpf || 'Sem telefone'}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-[#3A3A3A] font-medium">
                            {matchedBiz ? matchedBiz.name : 'Aura Core / Sem Unidade'}
                          </div>
                          <div className="text-[10px] text-[#8E8E8E]">{matchedBiz?.city || 'Brasil'}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-block ${
                              p.role === 'ADMIN'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                : p.role === 'MANAGER'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                                : p.role === 'PLATFORM_ADMIN'
                                ? 'bg-[#FAF5EB] text-[#C5A059] border border-[#C5A059]/30'
                                : 'bg-[#F9F7F5] text-[#8E8E8E] border border-[#F1EBE7]'
                            }`}
                          >
                            {p.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProfile(p);
                                setEditName(p.name);
                                setEditEmail(p.email);
                                setEditPhone(p.phone || '');
                                setEditRole(p.role || 'PROFESSIONAL');
                              }}
                              className="p-1.5 rounded-xl bg-[#F9F7F5] hover:bg-[#EAD7D1] text-[#3A3A3A] border border-[#F1EBE7] transition-all cursor-pointer shadow-2xs"
                              title="Editar Perfil"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleResetPassword(p)}
                              className="p-1.5 rounded-xl bg-[#F9F7F5] hover:bg-amber-100 text-[#3A3A3A] hover:text-[#C5A059] border border-[#F1EBE7] transition-all cursor-pointer shadow-2xs"
                              title="Resetar Senha"
                            >
                              <Key size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: MONETIZAÇÃO & COMISSÕES MARKETPLACE (DUAL REVENUE ENGINE) */}
      {activeTab === 'monetization' && (
        <div className="space-y-8">
          {/* Header da Seção */}
          <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-[#F1EBE7] shadow-luminous space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[#C5A059] uppercase">
                    Engenharia Financeira • Aura Core
                  </span>
                  <span className="bg-[#FAF5EB] border border-[#F1EBE7] text-[#C5A059] text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase">
                    Dual Revenue Engine
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif text-[#3A3A3A] font-bold mt-1">
                  Monetização & Comissões de Marketplace
                </h2>
                <p className="text-xs text-[#8E8E8E] mt-1 max-w-2xl">
                  Gerencie as duas alavancas de receita da Aura: a mensalidade fixa de software (SaaS B2B para clínicas) e o take-rate sobre agendamentos captados através do Aura App (Marketplace B2C).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#8E8E8E]">Take-Rate:</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  platformSettings.enableMarketplaceTakeRate
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : 'bg-[#F9F7F5] text-[#8E8E8E] border border-[#F1EBE7]'
                }`}>
                  {platformSettings.enableMarketplaceTakeRate ? 'Ativo' : 'Desativado'}
                </span>
              </div>
            </div>

            {/* 4 Cards de Métricas Financeiras */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#F1EBE7]">
              <div className="p-4 rounded-2xl bg-[#F9F7F5] border border-[#F1EBE7]">
                <p className="text-[10px] uppercase text-[#8E8E8E] font-bold tracking-wider">Take-Rate Vigente</p>
                <p className="text-2xl font-bold font-serif text-[#C5A059] mt-1">
                  {(platformSettings.marketplaceCommissionRate * 100).toFixed(0)}%
                </p>
                <p className="text-[10px] text-[#8E8E8E] mt-0.5">Sobre agendamentos do Aura App</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F9F7F5] border border-[#F1EBE7]">
                <p className="text-[10px] uppercase text-[#8E8E8E] font-bold tracking-wider">GMV Marketplace</p>
                <p className="text-2xl font-bold font-serif text-[#3A3A3A] mt-1">
                  R$ {totalMarketplaceGMV.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-[#8E8E8E] mt-0.5">{marketplaceAppointments.length} agendamentos gerados</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F9F7F5] border border-[#F1EBE7]">
                <p className="text-[10px] uppercase text-[#8E8E8E] font-bold tracking-wider">Comissão Retida</p>
                <p className="text-2xl font-bold font-serif text-emerald-600 mt-1">
                  R$ {totalMarketplaceCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-[#8E8E8E] mt-0.5">Receita líquida da plataforma</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F9F7F5] border border-[#F1EBE7]">
                <p className="text-[10px] uppercase text-[#8E8E8E] font-bold tracking-wider">MRR de Software (SaaS)</p>
                <p className="text-2xl font-bold font-serif text-[#C5A059] mt-1">
                  R$ {platformStats.totalMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-[#8E8E8E] mt-0.5">{platformStats.activeTenants} assinaturas ativas</p>
              </div>
            </div>
          </div>

          {/* Painel de Controle de Políticas de Preço */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alavanca 1: Take-Rate sobre Vendas Marketplace */}
            <div className="bg-white p-6 rounded-[28px] border border-[#F1EBE7] shadow-luminous space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF5EB] text-[#C5A059] border border-[#F1EBE7] flex items-center justify-center">
                    <Percent size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#3A3A3A]">Comissão sobre o Aura App</h3>
                    <p className="text-[11px] text-[#8E8E8E]">Taxa cobrada das clínicas para novas clientes</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleTakeRate}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                    platformSettings.enableMarketplaceTakeRate
                      ? 'bg-[#EAD7D1] text-[#3A3A3A] border-white/80 shadow-soft-glow'
                      : 'bg-[#F9F7F5] text-[#8E8E8E] border-[#F1EBE7] hover:bg-[#F1EBE7]'
                  }`}
                >
                  {platformSettings.enableMarketplaceTakeRate ? 'Ligado' : 'Desligado'}
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider block">
                  Definir Percentual de Comissão (%)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {[0, 0.05, 0.08, 0.10, 0.12, 0.15, 0.20].map((rate) => {
                    const isSelected = Math.abs(platformSettings.marketplaceCommissionRate - rate) < 0.001;
                    return (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => handleUpdateCommissionRate(rate)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#EAD7D1] text-[#3A3A3A] border-white/80 shadow-soft-glow'
                            : 'bg-white hover:bg-[#F9F7F5] text-[#3A3A3A] border-[#F1EBE7]'
                        }`}
                      >
                        {(rate * 100).toFixed(0)}%
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F9F7F5] border border-[#F1EBE7] text-[11px] text-[#8E8E8E] space-y-1">
                <p className="font-semibold text-[#3A3A3A]">Regra de Negócio:</p>
                <p>
                  Quando uma cliente agenda pelo Aura App ou pelo Feed Social, a clínica recebe o agendamento no Aura Business com tag <span className="text-[#C5A059] font-semibold">"Marketplace"</span> e a taxa de <span className="text-[#3A3A3A] font-semibold">{(platformSettings.marketplaceCommissionRate * 100).toFixed(0)}%</span> é debitada automaticamente no extrato DRE.
                </p>
              </div>
            </div>

            {/* Alavanca 2: Mensalidade Fixa SaaS */}
            <div className="bg-white p-6 rounded-[28px] border border-[#F1EBE7] shadow-luminous space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF5EB] text-[#C5A059] border border-[#F1EBE7] flex items-center justify-center">
                    <Coins size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#3A3A3A]">Assinatura Mensal de Software (SaaS)</h3>
                    <p className="text-[11px] text-[#8E8E8E]">Cobrança de licença pelo uso do sistema de gestão</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleSaasFee}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                    platformSettings.saasMonthlyFeeEnabled
                      ? 'bg-[#EAD7D1] text-[#3A3A3A] border-white/80 shadow-soft-glow'
                      : 'bg-[#F9F7F5] text-[#8E8E8E] border-[#F1EBE7] hover:bg-[#F1EBE7]'
                  }`}
                >
                  {platformSettings.saasMonthlyFeeEnabled ? 'Ligado' : 'Desligado'}
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider block">
                  Valor Base de Assinatura Mensal
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[149, 249, 499].map((fee) => {
                    const isSelected = platformSettings.saasFixedFee === fee;
                    return (
                      <button
                        key={fee}
                        type="button"
                        onClick={() => handleUpdateSaasFee(fee)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 border ${
                          isSelected
                            ? 'bg-[#EAD7D1] text-[#3A3A3A] border-white/80 shadow-soft-glow'
                            : 'bg-white hover:bg-[#F9F7F5] text-[#3A3A3A] border-[#F1EBE7]'
                        }`}
                      >
                        <span>R$ {fee}</span>
                        <span className="text-[9px] opacity-75 font-normal">por mês</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F9F7F5] border border-[#F1EBE7] text-[11px] text-[#8E8E8E] space-y-1">
                <p className="font-semibold text-[#3A3A3A]">Receita Combinada Estimada:</p>
                <p>
                  MRR Atual: <span className="text-[#C5A059] font-semibold">R$ {platformStats.totalMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> + Comissões: <span className="text-emerald-600 font-semibold">R$ {totalMarketplaceCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> = Total: <span className="text-[#3A3A3A] font-bold">R$ {(platformStats.totalMRR + totalMarketplaceCommission).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Tabela de Clínicas Parceiras e Performance de Marketplace */}
          <div className="bg-white rounded-[28px] border border-[#F1EBE7] overflow-hidden shadow-luminous">
            <div className="p-6 border-b border-[#F1EBE7] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-base font-bold text-[#3A3A3A] tracking-tight">
                  Performance de Clínicas no Ecossistema
                </h3>
                <p className="text-xs text-[#8E8E8E]">
                  Volume de agendamentos gerados no Aura App vs receita própria da clínica.
                </p>
              </div>
              <div className="text-xs font-semibold text-[#8E8E8E]">
                {businesses.length} Clínicas Monitoradas
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F1EBE7] text-[10px] font-bold text-[#8E8E8E] uppercase tracking-wider bg-[#F9F7F5]">
                    <th className="py-3 px-6">Clínica / Parceiro</th>
                    <th className="py-3 px-6">Plano SaaS</th>
                    <th className="py-3 px-6">Vendas Aura App</th>
                    <th className="py-3 px-6">GMV Marketplace</th>
                    <th className="py-3 px-6">Comissão Aura</th>
                    <th className="py-3 px-6 text-right">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1EBE7] text-xs text-[#3A3A3A]">
                  {businesses.map((biz) => {
                    const bizAppointments = marketplaceAppointments.filter(
                      (a) => (a.businessId || a.business_id) === biz.id
                    );
                    const bizGMV = bizAppointments.reduce(
                      (sum, a) => sum + (a.finalPrice || a.price || 0),
                      0
                    );
                    const bizComm = bizAppointments.reduce(
                      (sum, a) => sum + (a.marketplaceFee || 0),
                      0
                    );

                    return (
                      <tr key={biz.id} className="hover:bg-[#FAF5EB]/40 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-[#3A3A3A]">{biz.name}</div>
                          <div className="text-[10px] text-[#8E8E8E]">{biz.city} • {biz.ownerName}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-[#FAF5EB] text-[#C5A059] border border-[#F1EBE7]">
                            {biz.plan_type}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-[#3A3A3A]">{bizAppointments.length}</span>
                          <span className="text-[10px] text-[#8E8E8E] ml-1">pedidos</span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-[#3A3A3A]">
                          R$ {bizGMV.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-6 font-semibold text-emerald-600">
                          R$ {bizComm.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => impersonateAsAdmin(biz)}
                              className="px-3 py-1.5 rounded-xl bg-[#FAF5EB] hover:bg-[#F3ECE1] text-[#C5A059] text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 border border-[#F1EBE7] shadow-2xs"
                              title="Acessar painel da clínica"
                            >
                              <LogIn size={13} />
                              <span>Aura Business</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewLandingBiz(biz)}
                              className="p-1.5 rounded-xl bg-[#F9F7F5] hover:bg-[#EAD7D1] text-[#3A3A3A] transition-colors cursor-pointer border border-[#F1EBE7] shadow-2xs"
                              title="Ver vitrine pública"
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: AUDITORIA E SEGURANÇA (O LOG DO CRIADOR) */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-6 rounded-[28px] border border-[#F1EBE7] shadow-luminous">
            <div>
              <h2 className="text-lg font-bold text-[#3A3A3A] tracking-tight">O Log do Criador (System Logs)</h2>
              <p className="text-xs text-[#8E8E8E]">
                Registro imutável de todas as intervenções, comandos e ativações executadas com autoridade de PLATFORM_ADMIN.
              </p>
            </div>
            <div className="text-xs font-bold text-[#C5A059] bg-[#FAF5EB] border border-[#F1EBE7] px-3 py-1.5 rounded-full uppercase">
              Gravação Ativa
            </div>
          </div>

          <div className="bg-white rounded-[28px] border border-[#F1EBE7] overflow-hidden shadow-luminous">
            <div className="divide-y divide-[#F1EBE7]">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-5 hover:bg-[#FAF5EB]/40 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF5EB] text-[#C5A059] border border-[#F1EBE7] uppercase tracking-wider">
                        {log.action}
                      </span>
                      {log.target_business_name && (
                        <span className="text-xs font-semibold text-[#3A3A3A]">
                          {log.target_business_name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#3A3A3A]">{log.details}</p>
                  </div>

                  <div className="text-right text-[11px] text-[#8E8E8E] shrink-0">
                    <div>{new Date(log.created_at).toLocaleString('pt-BR')}</div>
                    <div className="text-[10px] text-[#8E8E8E]">{log.ip_address || '177.136.241.10'} • {log.actor_email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR USUÁRIO GLOBAL */}
      {editingProfile && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[10001] p-4">
          <div className="bg-white border border-[#F1EBE7] rounded-[28px] max-w-md w-full p-6 sm:p-8 shadow-soft-glow text-[#3A3A3A] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Root User Override</span>
                <h3 className="text-lg font-bold text-[#3A3A3A] mt-1">Editar Usuário da Base</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProfile(null)}
                className="text-[#8E8E8E] hover:text-[#3A3A3A] p-1 cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E8E8E] block mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F9F7F5] border border-[#F1EBE7] rounded-xl text-xs text-[#3A3A3A] focus:outline-none focus:border-[#EAD7D1]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E8E8E] block mb-1">E-mail</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F9F7F5] border border-[#F1EBE7] rounded-xl text-xs text-[#3A3A3A] focus:outline-none focus:border-[#EAD7D1]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E8E8E] block mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F9F7F5] border border-[#F1EBE7] rounded-xl text-xs text-[#3A3A3A] focus:outline-none focus:border-[#EAD7D1]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E8E8E] block mb-1">Cargo / Role de Acesso</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2.5 bg-[#F9F7F5] border border-[#F1EBE7] rounded-xl text-xs text-[#3A3A3A] focus:outline-none focus:border-[#EAD7D1] cursor-pointer"
                >
                  <option value="PROFESSIONAL">PROFESSIONAL (Atendimento & Agenda)</option>
                  <option value="RECEPTIONIST">RECEPTIONIST (Recepção & Caixa)</option>
                  <option value="MANAGER">MANAGER (Gerente de Unidade)</option>
                  <option value="ADMIN">ADMIN (Administrador Completo)</option>
                  <option value="PLATFORM_ADMIN">PLATFORM_ADMIN (God Mode)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="flex-1 py-3 rounded-xl bg-[#F9F7F5] hover:bg-[#F1EBE7] text-[#3A3A3A] font-bold text-xs uppercase cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white font-bold text-xs uppercase shadow-soft-glow cursor-pointer transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVO ESTABELECIMENTO */}
      {showNewBizModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[10001] p-4">
          <div className="bg-white border border-[#F1EBE7] rounded-[28px] max-w-md w-full p-6 sm:p-8 shadow-soft-glow text-[#3A3A3A] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Novo Tenant SaaS</span>
                <h3 className="text-lg font-bold text-[#3A3A3A] mt-1">Provisionar Estabelecimento</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewBizModal(false)}
                className="text-[#8E8E8E] hover:text-[#3A3A3A] p-1 cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBusinessSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E8E8E] block mb-1">Nome da Clínica</label>
                <input
                  type="text"
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  placeholder="Ex: Belle Harmonização & Laser"
                  className="w-full px-4 py-2.5 bg-[#F9F7F5] border border-[#F1EBE7] rounded-xl text-xs text-[#3A3A3A] placeholder-[#8E8E8E] focus:outline-none focus:border-[#EAD7D1]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E8E8E] block mb-1">Nome do Proprietário</label>
                <input
                  type="text"
                  value={newBizOwner}
                  onChange={(e) => setNewBizOwner(e.target.value)}
                  placeholder="Ex: Dra. Juliana Moraes"
                  className="w-full px-4 py-2.5 bg-[#F9F7F5] border border-[#F1EBE7] rounded-xl text-xs text-[#3A3A3A] placeholder-[#8E8E8E] focus:outline-none focus:border-[#EAD7D1]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E8E8E] block mb-1">E-mail Corporativo</label>
                <input
                  type="email"
                  value={newBizEmail}
                  onChange={(e) => setNewBizEmail(e.target.value)}
                  placeholder="contato@clinica.com.br"
                  className="w-full px-4 py-2.5 bg-[#F9F7F5] border border-[#F1EBE7] rounded-xl text-xs text-[#3A3A3A] placeholder-[#8E8E8E] focus:outline-none focus:border-[#EAD7D1]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8E8E8E] block mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={newBizPhone}
                    onChange={(e) => setNewBizPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-2.5 bg-[#F9F7F5] border border-[#F1EBE7] rounded-xl text-xs text-[#3A3A3A] placeholder-[#8E8E8E] focus:outline-none focus:border-[#EAD7D1]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8E8E8E] block mb-1">Cidade</label>
                  <input
                    type="text"
                    value={newBizCity}
                    onChange={(e) => setNewBizCity(e.target.value)}
                    placeholder="Ex: São Paulo"
                    className="w-full px-4 py-2.5 bg-[#F9F7F5] border border-[#F1EBE7] rounded-xl text-xs text-[#3A3A3A] placeholder-[#8E8E8E] focus:outline-none focus:border-[#EAD7D1]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E8E8E] block mb-1">Plano Inicial</label>
                <select
                  value={newBizPlan}
                  onChange={(e) => setNewBizPlan(e.target.value as PlanType)}
                  className="w-full px-4 py-2.5 bg-[#F9F7F5] border border-[#F1EBE7] rounded-xl text-xs text-[#3A3A3A] focus:outline-none focus:border-[#EAD7D1] cursor-pointer"
                >
                  <option value="essencial">Plano Essencial</option>
                  <option value="pro">Plano Gestão Pro</option>
                  <option value="marketing">Plano Marketing & Experience</option>
                  <option value="enterprise">Plano Enterprise Redes</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewBizModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#F9F7F5] hover:bg-[#F1EBE7] text-[#3A3A3A] font-bold text-xs uppercase cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white font-bold text-xs uppercase shadow-soft-glow cursor-pointer transition-colors"
                >
                  Criar Clínica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformCockpit;
