// src/pages/superadmin/GlobalDashboard.tsx
import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Building2,
  Users,
  DollarSign,
  Calendar,
  Search,
  ExternalLink,
  LogIn,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Sliders,
  Filter,
  RefreshCw,
  Clock,
  History,
  Lock,
  ChevronRight,
  Check,
  X,
  UserCheck,
  UserX,
  FileText,
  BadgeCheck,
  Layers,
  Store,
  Palette,
  Globe,
  Save,
  Zap,
  Unlock,
  Eye
} from 'lucide-react';
import { useBusiness } from '../../core/BusinessContext';
import { useAuth } from '../../context/AuthContext';
import { useLayout } from '../../layouts/LayoutContext';
import { dataService } from '../../services/dataService';
import { Business, PlanType, Profile, UserRole, USER_ROLE_LABELS } from '../../types';

export const GlobalDashboard: React.FC = () => {
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
    setPublicProfileSlug,
    platformModules,
    businessModulesMap,
    toggleModuleForBusiness,
    applyPlanPreset,
    updateBusiness,
  } = useBusiness();

  const { userProfile, login } = useAuth();
  const layout = useLayout();

  // Estados de Busca e Filtros - Tenants
  const [tenantSearch, setTenantSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Estados de Busca e Filtros - Usuários Globais
  const [userSearch, setUserSearch] = useState('');
  const [userUnitFilter, setUserUnitFilter] = useState<string>('all');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');

  // Estados de Feedback e Modais
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedUserForPasswordReset, setSelectedUserForPasswordReset] = useState<Profile | null>(null);
  const [tempPassword, setTempPassword] = useState('aura@2026!');
  const [activeTab, setActiveTab] = useState<'tenants' | 'users' | 'audit' | 'billing'>('tenants');

  // Estado de Governança de Módulos & Branding de Tenant
  const [selectedTenantForGovernance, setSelectedTenantForGovernance] = useState<Business | null>(null);
  const [governanceTab, setGovernanceTab] = useState<'modules' | 'branding'>('modules');
  const [brandingForm, setBrandingForm] = useState({
    primary_color: '#B88746',
    background_color: '#FAF8F5',
    logo: '',
    cover: '',
    custom_domain: '',
    white_label_enabled: false,
    slug: '',
  });

  const openTenantGovernance = (biz: Business) => {
    setSelectedTenantForGovernance(biz);
    setGovernanceTab('modules');
    setBrandingForm({
      primary_color: biz.primary_color || '#B88746',
      background_color: biz.background_color || '#FAF8F5',
      logo: biz.logo || '',
      cover: biz.cover || '',
      custom_domain: biz.custom_domain || '',
      white_label_enabled: !!biz.white_label_enabled,
      slug: biz.slug || '',
    });
  };

  const handleToggleModuleForTenant = (moduleId: string) => {
    if (!selectedTenantForGovernance) return;
    toggleModuleForBusiness(selectedTenantForGovernance.id, moduleId);
    const currentList = businessModulesMap[selectedTenantForGovernance.id] || [];
    const isActivating = !currentList.includes(moduleId);
    const mod = platformModules.find((m) => m.id === moduleId);
    addAuditLog(
      isActivating ? 'MODULE_MANUAL_GRANT' : 'MODULE_MANUAL_REVOKE',
      selectedTenantForGovernance.id,
      `Super Admin ${isActivating ? 'liberou' : 'revogou'} módulo [${mod?.name || moduleId}] para [${selectedTenantForGovernance.name}]`
    );
    showNotification(`Módulo ${mod?.name || moduleId} ${isActivating ? 'liberado' : 'bloqueado'} com sucesso!`);
  };

  const handleApplyPresetToTenant = (planType: PlanType) => {
    if (!selectedTenantForGovernance) return;
    applyPlanPreset(selectedTenantForGovernance.id, planType);
    showNotification(`Preset do plano ${planType.toUpperCase()} aplicado para ${selectedTenantForGovernance.name}!`);
  };

  const handleSaveTenantBranding = () => {
    if (!selectedTenantForGovernance) return;
    updateBusiness(selectedTenantForGovernance.id, brandingForm);
    addAuditLog(
      'TENANT_BRANDING_UPDATE',
      selectedTenantForGovernance.id,
      `Super Admin atualizou identidade visual e white-label do tenant [${selectedTenantForGovernance.name}]`
    );
    showNotification(`Identidade visual de ${selectedTenantForGovernance.name} atualizada com sucesso!`);
    setSelectedTenantForGovernance((prev) => (prev ? { ...prev, ...brandingForm } : null));
  };

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Carregar todos os usuários do SaaS (Global - Sem filtros RLS)
  const allUsers = useMemo(() => {
    return dataService.getAllUsersGlobal();
  }, [successMessage]);

  // Filtragem de Estabelecimentos
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((biz) => {
      const matchSearch =
        biz.name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
        biz.slug.toLowerCase().includes(tenantSearch.toLowerCase()) ||
        (biz.ownerName && biz.ownerName.toLowerCase().includes(tenantSearch.toLowerCase())) ||
        (biz.ownerEmail && biz.ownerEmail.toLowerCase().includes(tenantSearch.toLowerCase()));

      const matchPlan = planFilter === 'all' || biz.plan_type === planFilter;
      const matchStatus = statusFilter === 'all' || biz.status === statusFilter;

      return matchSearch && matchPlan && matchStatus;
    });
  }, [businesses, tenantSearch, planFilter, statusFilter]);

  // Filtragem Global de Usuários
  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      const term = userSearch.toLowerCase();
      const matchSearch =
        u.name.toLowerCase().includes(term) ||
        (u.email && u.email.toLowerCase().includes(term)) ||
        (u.phone && u.phone.includes(term)) ||
        (u.cpf && u.cpf.includes(term));

      const matchUnit =
        userUnitFilter === 'all' ||
        u.organizationId === userUnitFilter ||
        u.organization_id === userUnitFilter ||
        u.businessId === userUnitFilter ||
        u.business_id === userUnitFilter;

      const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;

      return matchSearch && matchUnit && matchRole;
    });
  }, [allUsers, userSearch, userUnitFilter, userRoleFilter]);

  // Ação Master: IMPERSONATE (Logar como Admin da Clínica)
  const handleImpersonate = (biz: Business) => {
    impersonateAsAdmin(biz.id);
    showNotification(`⚡ Acesso Master ativado! Você agora está operando como Administrador de "${biz.name}".`);
    // Redireciona para o dashboard operacional da clínica com bypass total
    layout.setCurrentTab('dashboard');
  };

  // Alterar Plano de uma Unidade
  const handlePlanChange = (bizId: string, newPlan: PlanType) => {
    updateBusinessPlan(bizId, newPlan);
    showNotification(`Plano do estabelecimento atualizado para ${newPlan.toUpperCase()} com sucesso!`);
  };

  // Alternar Status (Ativo / Suspenso)
  const handleToggleStatus = (biz: Business) => {
    toggleBusinessStatus(biz.id);
    showNotification(
      `Estabelecimento "${biz.name}" agora está ${biz.status === 'active' ? 'SUSPENSO' : 'ATIVO'}.`
    );
  };

  // Reset de Senha Master de Usuário
  const handleConfirmPasswordReset = () => {
    if (!selectedUserForPasswordReset) return;
    dataService.updateUserPasswordRoot(selectedUserForPasswordReset.id, tempPassword);
    addAuditLog(
      'RESET_PASSWORD',
      selectedUserForPasswordReset.businessId || selectedUserForPasswordReset.organizationId,
      `Reset de senha mestre executado para o usuário [${selectedUserForPasswordReset.email}]`,
      selectedUserForPasswordReset.email
    );
    showNotification(`Senha provisória de ${selectedUserForPasswordReset.name} redefinida para "${tempPassword}".`);
    setSelectedUserForPasswordReset(null);
  };

  // Alterar Role de Usuário Globalmente
  const handleUserRoleChange = (user: Profile, newRole: UserRole) => {
    dataService.updateProfileRole(user.id, newRole);
    addAuditLog(
      'UPDATE_USER_ROLE',
      user.businessId || user.organizationId,
      `Cargo de [${user.name} / ${user.email}] alterado para [${newRole}]`,
      user.email
    );
    showNotification(`Permissão de ${user.name} atualizada para ${newRole}.`);
  };

  // Alternar Status de Usuário (Ativar/Bloquear)
  const handleToggleUserStatus = (user: Profile) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    dataService.updateUserStatusRoot(user.id, nextStatus);
    addAuditLog(
      nextStatus === 'active' ? 'USER_ACTIVATE' : 'USER_SUSPEND',
      user.businessId || user.organizationId,
      `Usuário [${user.name}] foi ${nextStatus === 'active' ? 'Reativado' : 'Bloqueado'} na plataforma`,
      user.email
    );
    showNotification(`Usuário ${user.name} agora está ${nextStatus === 'active' ? 'ATIVO' : 'BLOQUEADO'}.`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* NOTIFICAÇÃO DE SUCESSO / AÇÃO */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-graphite text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-aesthetic-gold/40 animate-fade-in">
          <Sparkles size={18} className="text-aesthetic-gold" />
          <span className="text-xs font-semibold">{successMessage}</span>
        </div>
      )}

      {/* BANNER SE ESTIVER EM MODO IMPERSONATE */}
      {isImpersonating && impersonatedBusiness && (
        <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md">
              ⚡
            </div>
            <div>
              <h4 className="text-sm font-bold text-graphite flex items-center gap-2">
                MODO IMPERSONATE EM ANDAMENTO
                <span className="text-[10px] bg-amber-500/20 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                  ADMIN ATIVO
                </span>
              </h4>
              <p className="text-xs text-graphite/60">
                Você está conectado com privilégios completos na unidade: <strong>{impersonatedBusiness.name}</strong> ({impersonatedBusiness.id})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={exitImpersonate}
            className="px-5 py-2.5 rounded-xl bg-graphite hover:bg-black text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <X size={14} />
            <span>Encerrar Impersonate &amp; Retornar</span>
          </button>
        </div>
      )}

      {/* CABEÇALHO MASTER (GOD MODE ROOT ACCESS) */}
      <div className="bg-gradient-to-r from-graphite via-black to-[#2A1E22] text-white p-6 sm:p-8 rounded-[36px] shadow-xl relative overflow-hidden">
        {/* Marca d'água de background */}
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-aesthetic-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F3E5AB] px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <ShieldAlert size={14} className="text-[#D4AF37]" />
              <span>SaaS Root Access • God Mode</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
              Painel de Controle Global da Plataforma
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Visão de satélite de toda a infraestrutura Aura. Acesse dados brutos, faturamentos globais,
              gestão de tenants com bypass de RLS e impersonate administrativo instantâneo.
            </p>
          </div>

          {/* Badges de Status do Root */}
          <div className="flex flex-wrap items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
            <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-left">
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Usuário Master</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {userProfile?.email || 'dev@aura.com.br'}
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-left">
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Bypass RLS</span>
              <span className="text-xs font-bold text-[#F3E5AB] flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-400" /> Ativo
              </span>
            </div>
          </div>
        </div>

        {/* NAVEGAÇÃO ENTRE ABAS DO ROOT */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('tenants')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'tenants'
                ? 'bg-[#D4AF37] text-graphite shadow-md'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Building2 size={15} />
            <span>Estabelecimentos &amp; Tenants ({businesses.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-[#D4AF37] text-graphite shadow-md'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Users size={15} />
            <span>Usuários Globais (Sem Filtro) ({allUsers.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'bg-[#D4AF37] text-graphite shadow-md'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <History size={15} />
            <span>Auditoria Root ({auditLogs.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'billing'
                ? 'bg-[#D4AF37] text-graphite shadow-md'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <DollarSign size={15} />
            <span>SaaS Billing &amp; MRR Global</span>
          </button>
        </div>
      </div>

      {/* METRIC CARDS GLOBAIS DE PLATAFORMA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receita Global MRR */}
        <div className="bg-white p-5 rounded-3xl border border-aesthetic-bege/40 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-aesthetic-graphite/50 uppercase tracking-wider">
              Receita Global (MRR)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-graphite">
              R$ {platformStats.totalMRR.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp size={12} /> +12%
            </span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">
            ARR projetado: R$ {(platformStats.totalMRR * 12).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
          </span>
        </div>

        {/* Agendamentos Hoje na Nuvem Aura */}
        <div className="bg-white p-5 rounded-3xl border border-aesthetic-bege/40 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-aesthetic-graphite/50 uppercase tracking-wider">
              Agendamentos Hoje
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-graphite">1.240</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp size={12} /> +18%
            </span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Distribuídos em todas as unidades</span>
        </div>

        {/* Total de Tenants / Unidades */}
        <div className="bg-white p-5 rounded-3xl border border-aesthetic-bege/40 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-aesthetic-graphite/50 uppercase tracking-wider">
              Tenants Cadastrados
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-graphite">{businesses.length}</span>
            <span className="text-[11px] font-bold text-blue-600">
              {platformStats.activeTenants} ativos
            </span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">
            {platformStats.suspendedTenants} em revisão / suspensos
          </span>
        </div>

        {/* Taxa de Churn e Inadimplência */}
        <div className="bg-white p-5 rounded-3xl border border-aesthetic-bege/40 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-aesthetic-graphite/50 uppercase tracking-wider">
              Inadimplência Global
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-graphite">2.1%</span>
            <span className="text-[11px] font-bold text-emerald-600">Excelente</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Retenção de clientes de 98.6%</span>
        </div>
      </div>

      {/* ABA 1: GESTÃO DE ESTABELECIMENTOS (TENANTS) */}
      {activeTab === 'tenants' && (
        <div className="bg-white rounded-[32px] border border-aesthetic-bege/40 shadow-xs overflow-hidden">
          {/* Barra de Filtros e Busca */}
          <div className="p-5 border-b border-aesthetic-bege/30 flex flex-col md:flex-row items-center justify-between gap-4 bg-aesthetic-off-white/40">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3 text-gray-400" size={16} />
              <input
                type="text"
                value={tenantSearch}
                onChange={(e) => setTenantSearch(e.target.value)}
                placeholder="Buscar por clínica, slug, dono ou email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-aesthetic-bege/60 text-xs text-graphite outline-none focus:border-rose-700"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Filter size={14} />
                <span>Plano:</span>
              </div>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-white border border-aesthetic-bege/60 text-xs text-graphite font-medium outline-none"
              >
                <option value="all">Todos os Planos</option>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-white border border-aesthetic-bege/60 text-xs text-graphite font-medium outline-none"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="suspended">Suspensos</option>
              </select>
            </div>
          </div>

          {/* Tabela de Estabelecimentos */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-graphite">
              <thead className="bg-aesthetic-off-white/80 border-b border-aesthetic-bege/40 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Estabelecimento / Slug</th>
                  <th className="py-4 px-6">Proprietário(a)</th>
                  <th className="py-4 px-6">Plano Contratual</th>
                  <th className="py-4 px-6">Módulos Ativos</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Governança Master (God Mode)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aesthetic-bege/20">
                {filteredBusinesses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      Nenhum estabelecimento encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredBusinesses.map((biz) => {
                    const isCurrent = biz.id === impersonatedBusiness?.id;
                    const mods = businessModulesMap[biz.id] || [];
                    const hasBranding = mods.includes('custom_branding');

                    return (
                      <tr key={biz.id} className="hover:bg-aesthetic-off-white/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={biz.logo}
                              alt={biz.name}
                              className="w-10 h-10 rounded-2xl object-cover border border-aesthetic-bege/40 shadow-2xs"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-graphite block text-sm">{biz.name}</span>
                                {hasBranding && (
                                  <span
                                    title="White-label Ativo (Cores & Domínio Próprio)"
                                    className="w-2.5 h-2.5 rounded-full ring-2 ring-white"
                                    style={{ backgroundColor: biz.primary_color || '#B88746' }}
                                  />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-[10px] text-gray-400">/{biz.slug}</span>
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md font-mono">
                                  {biz.city || 'São Paulo'} - {biz.state || 'SP'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="font-medium text-graphite block">{biz.ownerName || 'Gestor Registrado'}</span>
                          <span className="text-gray-400 text-[11px] block">{biz.ownerEmail}</span>
                          <span className="text-gray-400 text-[10px] font-mono">{biz.phone}</span>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <select
                              value={biz.plan_type}
                              onChange={(e) => handlePlanChange(biz.id, e.target.value as PlanType)}
                              className={`py-1 px-2.5 rounded-lg text-xs font-bold uppercase tracking-wider outline-none border cursor-pointer ${
                                biz.plan_type === 'enterprise'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : biz.plan_type === 'premium'
                                  ? 'bg-[#D4AF37]/10 text-amber-800 border-[#D4AF37]/30'
                                  : biz.plan_type === 'pro'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-gray-100 text-gray-600 border-gray-200'
                              }`}
                            >
                              <option value="free">FREE</option>
                              <option value="pro">PRO</option>
                              <option value="premium">PREMIUM</option>
                              <option value="enterprise">ENTERPRISE</option>
                            </select>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <button
                            type="button"
                            onClick={() => openTenantGovernance(biz)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF5EE] hover:bg-[#F3EAD8] text-[#8F6A35] text-[11px] font-bold border border-[#E8DCC8] transition-colors cursor-pointer"
                            title="Clique para gerenciar módulos e identidade visual"
                          >
                            <Sliders size={12} />
                            <span>{mods.length}/{platformModules.length} Ativos</span>
                          </button>
                        </td>

                        <td className="py-4 px-6">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(biz)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                              biz.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                biz.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            <span>{biz.status === 'active' ? 'Ativo & Operando' : 'Suspenso'}</span>
                          </button>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Gerenciar Módulos & Branding */}
                            <button
                              type="button"
                              onClick={() => openTenantGovernance(biz)}
                              className="px-3 py-1.5 rounded-xl bg-aesthetic-off-white hover:bg-aesthetic-bege/60 text-graphite text-[11px] font-bold transition-colors cursor-pointer border border-aesthetic-bege/40 flex items-center gap-1.5 shadow-2xs"
                              title="Gerenciar módulos liberados e identidade visual White-label"
                            >
                              <Palette size={13} className="text-[#B88746]" />
                              <span>Módulos & Branding</span>
                            </button>

                            {/* Ver Vitrine Pública */}
                            <button
                              type="button"
                              onClick={() => {
                                setPublicProfileSlug(biz.slug);
                                layout.setCurrentTab('vitrine');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              title="Visualizar Vitrine Pública do Estabelecimento"
                              className="p-2 rounded-xl bg-aesthetic-off-white hover:bg-aesthetic-bege/60 text-gray-600 transition-colors cursor-pointer border border-aesthetic-bege/30"
                            >
                              <Store size={15} />
                            </button>

                            {/* BOTAO MASTER: LOGAR COMO ADMIN (IMPERSONATE) */}
                            <button
                              type="button"
                              onClick={() => handleImpersonate(biz)}
                              className={`px-3.5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-sm ${
                                isCurrent
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  : 'bg-graphite text-white hover:bg-black hover:scale-102'
                              }`}
                            >
                              <LogIn size={14} className="text-[#F3E5AB]" />
                              <span>{isCurrent ? 'Admin Conectado' : 'Logar como Admin'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 2: GESTÃO GLOBAL DE USUÁRIOS ("SEM FILTRO") */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-[32px] border border-aesthetic-bege/40 shadow-xs overflow-hidden">
          {/* Barra de Filtros e Busca */}
          <div className="p-5 border-b border-aesthetic-bege/30 flex flex-col md:flex-row items-center justify-between gap-4 bg-aesthetic-off-white/40">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3 text-gray-400" size={16} />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Buscar por Nome, CPF ou E-mail em todo o SaaS..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-aesthetic-bege/60 text-xs text-graphite outline-none focus:border-rose-700"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Building2 size={14} />
                <span>Unidade:</span>
              </div>
              <select
                value={userUnitFilter}
                onChange={(e) => setUserUnitFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-white border border-aesthetic-bege/60 text-xs text-graphite font-medium outline-none"
              >
                <option value="all">Todas as Clínicas / Unidades</option>
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-white border border-aesthetic-bege/60 text-xs text-graphite font-medium outline-none"
              >
                <option value="all">Todos os Cargos</option>
                <option value="PLATFORM_ADMIN">Platform Admin (Root)</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Gerente</option>
                <option value="PROFESSIONAL">Profissional / Esteta</option>
                <option value="RECEPTIONIST">Recepção</option>
                <option value="CLIENT">Cliente</option>
              </select>
            </div>
          </div>

          {/* Tabela Global de Usuários */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-graphite">
              <thead className="bg-aesthetic-off-white/80 border-b border-aesthetic-bege/40 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Usuário / Identidade</th>
                  <th className="py-4 px-6">CPF (Chave Única)</th>
                  <th className="py-4 px-6">Clínica Vinculada</th>
                  <th className="py-4 px-6">Permissão / Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Ações Master</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aesthetic-bege/20">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      Nenhum usuário encontrado na base global.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const clinic = businesses.find(
                      (b) => b.id === u.businessId || b.id === u.organizationId || b.id === u.organization_id
                    );
                    const isRoot = u.is_root || u.role === 'PLATFORM_ADMIN';

                    return (
                      <tr key={u.id} className="hover:bg-aesthetic-off-white/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-aesthetic-bege/40 flex items-center justify-center font-bold text-graphite text-xs overflow-hidden">
                              {u.avatarUrl || u.avatar_url ? (
                                <img
                                  src={u.avatarUrl || u.avatar_url}
                                  alt={u.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                u.name.substring(0, 2).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-graphite">{u.name}</span>
                                {isRoot && (
                                  <span className="bg-black text-[#F3E5AB] text-[9px] font-mono px-1.5 py-0.5 rounded-sm font-bold">
                                    ROOT
                                  </span>
                                )}
                              </div>
                              <span className="text-gray-400 text-[11px] block">{u.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 font-mono text-gray-600">
                          {u.cpf || u.documentCpf || 'Não informado'}
                        </td>

                        <td className="py-4 px-6">
                          <span className="font-medium text-graphite block">{clinic?.name || 'Aura Platform Central'}</span>
                          <span className="text-[10px] text-gray-400 font-mono">ID: {u.organizationId || 'root'}</span>
                        </td>

                        <td className="py-4 px-6">
                          <select
                            value={u.role}
                            disabled={isRoot}
                            onChange={(e) => handleUserRoleChange(u, e.target.value as UserRole)}
                            className="py-1 px-2 rounded-lg bg-aesthetic-off-white border border-aesthetic-bege/50 text-xs font-semibold text-graphite outline-none cursor-pointer disabled:opacity-60"
                          >
                            <option value="PLATFORM_ADMIN">Platform Admin</option>
                            <option value="ADMIN">Administrador</option>
                            <option value="MANAGER">Gerente</option>
                            <option value="PROFESSIONAL">Profissional</option>
                            <option value="RECEPTIONIST">Recepção</option>
                            <option value="CLIENT">Cliente</option>
                          </select>
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              u.status === 'active' || !u.status
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.status === 'active' || !u.status ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            <span>{u.status === 'active' || !u.status ? 'Ativo' : 'Inativo'}</span>
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Reset de Senha Master */}
                            <button
                              type="button"
                              onClick={() => setSelectedUserForPasswordReset(u)}
                              title="Redefinir Senha do Usuário"
                              className="px-2.5 py-1.5 rounded-lg bg-aesthetic-off-white hover:bg-aesthetic-bege/60 text-gray-700 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-aesthetic-bege/40"
                            >
                              <KeyRound size={13} className="text-amber-600" />
                              <span>Resetar Senha</span>
                            </button>

                            {/* Alternar Ativo/Inativo */}
                            {!isRoot && (
                              <button
                                type="button"
                                onClick={() => handleToggleUserStatus(u)}
                                title={u.status === 'active' ? 'Bloquear Acesso' : 'Reativar Acesso'}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${
                                  u.status === 'active'
                                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {u.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 3: TERMINAL DE AUDITORIA ROOT (audit_logs_root) */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-[32px] border border-aesthetic-bege/40 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-aesthetic-bege/30 flex items-center justify-between bg-aesthetic-off-white/40">
            <div>
              <h3 className="text-base font-bold text-graphite flex items-center gap-2">
                <ShieldAlert size={18} className="text-rose-700" />
                <span>Trilha de Auditoria Root (audit_logs_root)</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Registro criptográfico e cronológico de todas as operações realizadas com permissões de Super Admin.
              </p>
            </div>
            <div className="text-right font-mono text-xs text-gray-500">
              Total de Registros: {auditLogs.length}
            </div>
          </div>

          <div className="divide-y divide-aesthetic-bege/20 max-h-[600px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 sm:p-5 hover:bg-aesthetic-off-white/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold bg-graphite text-white px-2 py-0.5 rounded-md">
                      {log.action}
                    </span>
                    <span className="text-xs font-bold text-graphite">{log.details}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 font-mono">
                    <span>Ator: {log.actor_email}</span>
                    {log.target_business_name && <span>• Unidade: {log.target_business_name}</span>}
                    {log.target_user_email && <span>• Alvo: {log.target_user_email}</span>}
                    {log.ip_address && <span>• IP: {log.ip_address}</span>}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-gray-400 block">
                    {new Date(log.created_at).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(log.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 4: SAAS BILLING & FATURAMENTO GLOBAL (MRR) */}
      {activeTab === 'billing' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header da Aba Billing */}
          <div className="bg-white rounded-[32px] border border-aesthetic-bege/40 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 text-[#B88746] flex items-center justify-center shrink-0 mt-0.5">
                  <DollarSign size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#B88746]/10 text-[#B88746] text-[10px] font-bold uppercase tracking-wider">
                      PLATFORM_ADMIN • SaaS Governance
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                      Faturamento em Dia
                    </span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-graphite mt-1">
                    SaaS Billing &amp; Receita Recorrente Global (MRR)
                  </h2>
                  <p className="text-xs text-aesthetic-graphite/60 mt-0.5">
                    Visão de faturamento de mensalidades, cobrança de add-ons, inadimplência e rentabilidade por módulo.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right px-4 py-2 bg-aesthetic-off-white rounded-2xl border border-aesthetic-bege/30">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    MRR Consolidado
                  </span>
                  <span className="text-xl font-bold font-serif text-graphite">
                    R$ 14.850,00<span className="text-xs font-sans text-gray-500 font-normal">/mês</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-KPIs de SaaS Billing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-aesthetic-bege/20">
              <div className="p-4 rounded-2xl bg-aesthetic-off-white/60 border border-aesthetic-bege/30">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  ARR Projetado (Anual)
                </span>
                <span className="text-lg font-bold font-serif text-graphite mt-0.5 block">
                  R$ 178.200,00
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                  +24.8% vs ano anterior
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-aesthetic-off-white/60 border border-aesthetic-bege/30">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Assinaturas Ativas
                </span>
                <span className="text-lg font-bold font-serif text-graphite mt-0.5 block">
                  {businesses.length} Clínicas
                </span>
                <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">
                  Ticket Médio: R$ 742,50/mês
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-aesthetic-off-white/60 border border-aesthetic-bege/30">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Inadimplência
                </span>
                <span className="text-lg font-bold font-serif text-rose-600 mt-0.5 block">
                  1 Clínica em Atraso
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  R$ 590,00 pendente (vencido há 4 dias)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-aesthetic-off-white/60 border border-aesthetic-bege/30">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Add-ons Contratados
                </span>
                <span className="text-lg font-bold font-serif text-graphite mt-0.5 block">
                  42 Módulos Extras
                </span>
                <span className="text-[10px] text-[#B88746] font-semibold mt-0.5 block">
                  R$ 7.761,00 em expansão MRR
                </span>
              </div>
            </div>
          </div>

          {/* MÓDULOS MAIS RENTÁVEIS (RANKING DE CONTRATAÇÃO) */}
          <div className="bg-white rounded-[32px] border border-aesthetic-bege/40 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-aesthetic-bege/30">
              <div>
                <h3 className="font-serif text-lg font-bold text-graphite">
                  Módulos Mais Rentáveis &amp; Adoção de Funcionalidades
                </h3>
                <p className="text-xs text-aesthetic-graphite/60">
                  Qual add-on gera mais receita para a plataforma Aura
                </p>
              </div>
              <span className="text-xs font-bold text-[#B88746] bg-[#B88746]/10 px-3 py-1 rounded-full">
                5 Add-ons Disponíveis
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'whatsapp',
                  name: 'Automação & Confirmação WhatsApp Oficial',
                  price: 'R$ 189/mês',
                  tenantsCount: 14,
                  percent: 70,
                  monthlyRevenue: 'R$ 2.646,00',
                  badge: 'Mais Vendido',
                  color: 'bg-emerald-500'
                },
                {
                  id: 'finance',
                  name: 'Inteligência Financeira & Motor DRE Dinâmico',
                  price: 'R$ 249/mês',
                  tenantsCount: 11,
                  percent: 55,
                  monthlyRevenue: 'R$ 2.739,00',
                  badge: 'Maior Ticket',
                  color: 'bg-[#B88746]'
                },
                {
                  id: 'inventory',
                  name: 'Controle de Estoque & Ficha Técnica Pro',
                  price: 'R$ 149/mês',
                  tenantsCount: 9,
                  percent: 45,
                  monthlyRevenue: 'R$ 1.341,00',
                  badge: 'Alta Retenção',
                  color: 'bg-blue-500'
                },
                {
                  id: 'pricing',
                  name: 'Motor de Precificação & Margens Reais',
                  price: 'R$ 129/mês',
                  tenantsCount: 8,
                  percent: 40,
                  monthlyRevenue: 'R$ 1.032,00',
                  badge: 'Essencial',
                  color: 'bg-purple-500'
                },
              ].map((mod) => (
                <div
                  key={mod.id}
                  className="p-5 rounded-2xl bg-aesthetic-off-white/50 border border-aesthetic-bege/30 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-graphite">{mod.name}</h4>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white border border-aesthetic-bege/40 text-gray-600">
                          {mod.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 font-mono mt-0.5 block">
                        Preço unitário: {mod.price}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold font-mono text-graphite block">
                        {mod.monthlyRevenue}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {mod.tenantsCount} clínicas
                      </span>
                    </div>
                  </div>

                  {/* Barra de Adoção */}
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Adesão de Clínicas</span>
                      <span>{mod.percent}% das clínicas</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-aesthetic-bege/20 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${mod.color}`}
                        style={{ width: `${mod.percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TABELA DE ASSINATURAS & STATUS DE INADIMPLÊNCIA */}
          <div className="bg-white rounded-[32px] border border-aesthetic-bege/40 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-aesthetic-bege/30">
              <div>
                <h3 className="font-serif text-lg font-bold text-graphite">
                  Status de Pagamento &amp; Inadimplência por Estabelecimento
                </h3>
                <p className="text-xs text-aesthetic-graphite/60">
                  Gerencie a adimplência, suspensão imediata de acesso ou reenvio de cobrança
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-aesthetic-bege/40 text-aesthetic-graphite/50 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3 font-semibold">Clínica / Tenant</th>
                    <th className="py-3 px-3 font-semibold">Plano Base</th>
                    <th className="py-3 px-3 font-semibold">Add-ons Ativos</th>
                    <th className="py-3 px-3 font-semibold">Mensalidade</th>
                    <th className="py-3 px-3 font-semibold">Status Cobrança</th>
                    <th className="py-3 px-3 font-semibold text-center">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aesthetic-bege/20">
                  {businesses.map((biz, idx) => {
                    const isOverdue = idx === 1; // 1 clínica simulada em atraso
                    const isBlocked = biz.status === 'suspended' || isOverdue;
                    const basePrice = biz.plan_type === 'enterprise' ? 1190 : biz.plan_type === 'professional' ? 590 : 290;
                    const activeModsCount = (businessModulesMap[biz.id] || []).length;
                    const totalPrice = basePrice + activeModsCount * 149;

                    return (
                      <tr key={biz.id} className="hover:bg-aesthetic-off-white/50 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={biz.logo}
                              alt={biz.name}
                              className="w-8 h-8 rounded-xl object-cover border border-aesthetic-bege/40"
                            />
                            <div>
                              <span className="font-bold text-graphite block">{biz.name}</span>
                              <span className="text-[10px] text-gray-400 font-mono">{biz.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-aesthetic-off-white text-graphite border border-aesthetic-bege/40 text-[10px] font-bold uppercase">
                            {biz.plan_type}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-[11px] text-gray-600">
                            {activeModsCount} módulos liberados
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-graphite">
                          R$ {totalPrice.toFixed(2)}
                          <span className="text-[10px] font-sans text-gray-400 block font-normal">
                            Venc. dia 10
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          {isOverdue ? (
                            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold flex items-center gap-1 w-fit">
                              <AlertTriangle size={11} />
                              Atraso (4 dias)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1 w-fit">
                              <CheckCircle2 size={11} />
                              Em Dia (PIX Pago)
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {isOverdue ? (
                              <button
                                type="button"
                                onClick={() => {
                                  toggleBusinessStatus(biz.id);
                                  showNotification(`Acesso de ${biz.name} suspenso por inadimplência.`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Lock size={11} />
                                <span>Bloquear Acesso</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  showNotification(`Fatura e comprovante de ${biz.name} reenviados com sucesso.`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-aesthetic-off-white hover:bg-white text-gray-700 border border-aesthetic-bege/40 text-[10px] font-semibold transition-all cursor-pointer"
                              >
                                2ª Via Fatura
                              </button>
                            )}
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

      {/* MODAL DE RESET DE SENHA MASTER */}
      {selectedUserForPasswordReset && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-aesthetic-bege/50 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-aesthetic-bege/30 pb-3">
              <div className="flex items-center gap-2 text-rose-700">
                <KeyRound size={20} />
                <h3 className="font-bold text-base text-graphite">Reset Master de Senha</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForPasswordReset(null)}
                className="text-gray-400 hover:text-graphite cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Você está redefinindo a senha do usuário{' '}
              <strong>{selectedUserForPasswordReset.name}</strong> ({selectedUserForPasswordReset.email}).
              Essa ação será registrada no terminal de auditoria root.
            </p>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Nova Senha Temporária
              </label>
              <input
                type="text"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-aesthetic-off-white border border-aesthetic-bege/60 font-mono text-sm text-graphite outline-none focus:border-rose-700"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setSelectedUserForPasswordReset(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmPasswordReset}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-graphite hover:bg-black text-white transition-all cursor-pointer shadow-md flex items-center gap-2"
              >
                <Check size={14} />
                <span>Confirmar e Atualizar Senha</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MASTER DE GOVERNANÇA DE TENANT (MÓDULOS & BRANDING) */}
      {selectedTenantForGovernance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-aesthetic-bege/50 p-6 sm:p-7 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-aesthetic-bege/30 pb-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedTenantForGovernance.logo}
                  alt={selectedTenantForGovernance.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-aesthetic-bege/50 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-graphite font-serif">
                      {selectedTenantForGovernance.name}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">
                      Plano {selectedTenantForGovernance.plan_type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    ID: <span className="font-mono">{selectedTenantForGovernance.id}</span> • Slug: <span className="font-mono">/{selectedTenantForGovernance.slug}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTenantForGovernance(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-graphite hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sub-abas de Governança */}
            <div className="flex items-center gap-2 border-b border-aesthetic-bege/30 pb-2">
              <button
                type="button"
                onClick={() => setGovernanceTab('modules')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  governanceTab === 'modules'
                    ? 'bg-graphite text-white shadow-xs'
                    : 'text-gray-500 hover:bg-aesthetic-off-white hover:text-graphite'
                }`}
              >
                <Sliders size={14} />
                <span>
                  Módulos Contratados (
                  {(businessModulesMap[selectedTenantForGovernance.id] || []).length}/{platformModules.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setGovernanceTab('branding')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  governanceTab === 'branding'
                    ? 'bg-graphite text-white shadow-xs'
                    : 'text-gray-500 hover:bg-aesthetic-off-white hover:text-graphite'
                }`}
              >
                <Palette size={14} />
                <span>Identidade Visual &amp; White-label</span>
              </button>
            </div>

            {/* Conteúdo Aba 1: Módulos com Bypass Total */}
            {governanceTab === 'modules' && (
              <div className="space-y-5">
                {/* Presets Rápidos */}
                <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#EBDCC8] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F6A35] block">
                    Aplicar Pacote Comercial Pré-configurado (1 Clique)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyPresetToTenant('free')}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 text-[11px] font-bold text-gray-700 border border-gray-200 cursor-pointer shadow-2xs"
                    >
                      Essencial (Agenda + Clientes)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPresetToTenant('pro')}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-[11px] font-bold text-blue-700 border border-blue-200 cursor-pointer shadow-2xs"
                    >
                      Gestão Pro (+ Financeiro + Estoque)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPresetToTenant('marketing')}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-[11px] font-bold text-amber-800 border border-amber-200 cursor-pointer shadow-2xs"
                    >
                      Marketing &amp; Experience
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // Liberar todos os módulos
                        platformModules.forEach((m) => {
                          const current = businessModulesMap[selectedTenantForGovernance.id] || [];
                          if (!current.includes(m.id)) {
                            toggleModuleForBusiness(selectedTenantForGovernance.id, m.id);
                          }
                        });
                        addAuditLog(
                          'ALL_MODULES_SUPER_ADMIN_BYPASS',
                          selectedTenantForGovernance.id,
                          `Super Admin liberou TODOS os módulos para [${selectedTenantForGovernance.name}] via God Mode`
                        );
                        showNotification(`Todos os módulos liberados para ${selectedTenantForGovernance.name}!`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-graphite hover:bg-black text-[11px] font-bold text-[#F3E5AB] cursor-pointer shadow-2xs flex items-center gap-1.5"
                    >
                      <Zap size={12} className="text-aesthetic-gold" />
                      <span>Liberar TODOS (God Mode Bypass)</span>
                    </button>
                  </div>
                </div>

                {/* Lista de Módulos Individuais */}
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {platformModules.map((mod) => {
                    const activeList = businessModulesMap[selectedTenantForGovernance.id] || [];
                    const isModActive = activeList.includes(mod.id);

                    return (
                      <div
                        key={mod.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                          isModActive
                            ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                            : 'bg-aesthetic-off-white/60 border-aesthetic-bege/40 opacity-70'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-graphite">{mod.name}</span>
                            <span className="text-[10px] font-semibold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                              R$ {mod.base_price.toFixed(2).replace('.', ',')}/mês
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">
                              id: {mod.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                            {mod.description}
                          </p>
                        </div>

                        {/* Botão de Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleModuleForTenant(mod.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                            isModActive
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                              : 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs'
                          }`}
                        >
                          {isModActive ? (
                            <>
                              <Check size={13} />
                              <span>Liberado</span>
                            </>
                          ) : (
                            <>
                              <Lock size={13} />
                              <span>Bloqueado</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Conteúdo Aba 2: Branding & White-label */}
            {governanceTab === 'branding' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-aesthetic-off-white border border-aesthetic-bege/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl border border-white shadow-2xs flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: brandingForm.primary_color }}
                    >
                      A
                    </div>
                    <div>
                      <span className="text-xs font-bold text-graphite block">
                        Preview de Identidade Visual da Unidade
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {brandingForm.primary_color} • {brandingForm.custom_domain || 'Sem domínio próprio'}
                      </span>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-bold text-graphite cursor-pointer">
                    <input
                      type="checkbox"
                      checked={brandingForm.white_label_enabled}
                      onChange={(e) =>
                        setBrandingForm((prev) => ({ ...prev, white_label_enabled: e.target.checked }))
                      }
                      className="rounded text-rose-700 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                    />
                    <span>White-label Ativo</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Cor Primária */}
                  <div>
                    <label className="block text-xs font-bold text-graphite mb-1">
                      Cor Primária da Marca (HEX)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandingForm.primary_color}
                        onChange={(e) =>
                          setBrandingForm((prev) => ({ ...prev, primary_color: e.target.value }))
                        }
                        className="w-10 h-10 rounded-xl border border-aesthetic-bege/60 cursor-pointer p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={brandingForm.primary_color}
                        onChange={(e) =>
                          setBrandingForm((prev) => ({ ...prev, primary_color: e.target.value }))
                        }
                        className="flex-1 p-2.5 rounded-xl bg-white border border-aesthetic-bege/60 font-mono text-xs text-graphite"
                      />
                    </div>
                  </div>

                  {/* Tom de Fundo */}
                  <div>
                    <label className="block text-xs font-bold text-graphite mb-1">
                      Tom de Fundo Personalizado
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandingForm.background_color}
                        onChange={(e) =>
                          setBrandingForm((prev) => ({ ...prev, background_color: e.target.value }))
                        }
                        className="w-10 h-10 rounded-xl border border-aesthetic-bege/60 cursor-pointer p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={brandingForm.background_color}
                        onChange={(e) =>
                          setBrandingForm((prev) => ({ ...prev, background_color: e.target.value }))
                        }
                        className="flex-1 p-2.5 rounded-xl bg-white border border-aesthetic-bege/60 font-mono text-xs text-graphite"
                      />
                    </div>
                  </div>

                  {/* Domínio Próprio */}
                  <div>
                    <label className="block text-xs font-bold text-graphite mb-1">
                      Domínio Próprio (CNAME)
                    </label>
                    <input
                      type="text"
                      placeholder="agenda.nomedaclinica.com.br"
                      value={brandingForm.custom_domain}
                      onChange={(e) =>
                        setBrandingForm((prev) => ({ ...prev, custom_domain: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl bg-white border border-aesthetic-bege/60 text-xs text-graphite font-mono"
                    />
                  </div>

                  {/* Slug da Vitrine */}
                  <div>
                    <label className="block text-xs font-bold text-graphite mb-1">
                      Slug da Vitrine Pública
                    </label>
                    <input
                      type="text"
                      placeholder="ex: clinica-luxo"
                      value={brandingForm.slug}
                      onChange={(e) =>
                        setBrandingForm((prev) => ({ ...prev, slug: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl bg-white border border-aesthetic-bege/60 text-xs text-graphite font-mono"
                    />
                  </div>

                  {/* URL do Logo */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-graphite mb-1">
                      URL da Logomarca (PNG/SVG com transparência)
                    </label>
                    <input
                      type="text"
                      placeholder="https://exemplo.com/logo.png"
                      value={brandingForm.logo}
                      onChange={(e) =>
                        setBrandingForm((prev) => ({ ...prev, logo: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl bg-white border border-aesthetic-bege/60 text-xs text-graphite font-mono"
                    />
                  </div>

                  {/* URL da Foto de Capa */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-graphite mb-1">
                      URL da Imagem de Capa da Vitrine
                    </label>
                    <input
                      type="text"
                      placeholder="https://exemplo.com/cover.jpg"
                      value={brandingForm.cover}
                      onChange={(e) =>
                        setBrandingForm((prev) => ({ ...prev, cover: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl bg-white border border-aesthetic-bege/60 text-xs text-graphite font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={handleSaveTenantBranding}
                    className="px-6 py-2.5 rounded-xl bg-graphite hover:bg-black text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Save size={14} />
                    <span>Salvar Branding do Tenant</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalDashboard;
