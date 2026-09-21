import React, { useState } from 'react';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Plus,
  ExternalLink,
  Lock,
  Sparkles,
  Search,
  Filter,
  ArrowUpRight,
  ChevronRight,
  Eye,
  RefreshCw,
  Box,
  Calendar,
  Calculator,
  Zap,
  Sliders,
  Store,
  AlertTriangle,
  PhoneCall,
  Activity,
  MessageSquare
} from 'lucide-react';
import { useBusiness } from '../core/BusinessContext';
import { Business, PlanType, BusinessStatus, PlatformModule } from '../types';

interface SuperAdminDashboardProps {
  onOpenPublicProfile?: (slug: string) => void;
  onSwitchToTenant?: (businessId: string) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  onOpenPublicProfile,
  onSwitchToTenant,
}) => {
  const {
    businesses,
    platformModules,
    platformStats,
    toggleModuleForBusiness,
    updateBusiness,
    createBusiness,
    setCurrentBusinessId,
    setPublicProfileSlug,
    activeModules,
    currentBusiness,
  } = useBusiness();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BusinessStatus>('all');
  const [newTenantModalOpen, setNewTenantModalOpen] = useState(false);
  const [moduleManagerModalBusiness, setModuleManagerModalBusiness] = useState<Business | null>(null);
  const [csToast, setCsToast] = useState<string | null>(null);

  // New tenant form
  const [newBizName, setNewBizName] = useState('');
  const [newBizOwner, setNewBizOwner] = useState('');
  const [newBizEmail, setNewBizEmail] = useState('');
  const [newBizPhone, setNewBizPhone] = useState('');
  const [newBizPlan, setNewBizPlan] = useState<PlanType>('pro');
  const [newBizCity, setNewBizCity] = useState('São Paulo');

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.ownerName && b.ownerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName) return;

    createBusiness({
      name: newBizName,
      ownerName: newBizOwner || 'Gestor Responsável',
      ownerEmail: newBizEmail || 'contato@clinica.com.br',
      phone: newBizPhone || '(11) 99999-0000',
      city: newBizCity,
      plan_type: newBizPlan,
      planType: newBizPlan,
      status: 'active',
    });

    setNewBizName('');
    setNewBizOwner('');
    setNewBizEmail('');
    setNewBizPhone('');
    setNewTenantModalOpen(false);
  };

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'appointments':
        return Calendar;
      case 'pricing':
        return Calculator;
      case 'inventory':
        return Box;
      case 'finance':
        return DollarSign;
      case 'whatsapp':
        return Zap;
      default:
        return Sparkles;
    }
  };

  return (
    <div id="super-admin-governance" className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EFE9E2] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF2E6] text-[#9C753B] border border-[#ECD9BD] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={13} /> Aura Platform Governance
            </span>
            <span className="text-xs text-[#8C7F75]">• Painel Super Admin</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2725] tracking-tight">
            Gestão Multi-Tenant & Módulos
          </h1>
          <p className="text-xs sm:text-sm text-[#7D7066] mt-1">
            Monitore a receita recorrente, controle de planos e isolamento lógico de cada estabelecimento parceiro.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setNewTenantModalOpen(true)}
            className="bg-[#2D2725] hover:bg-[#3F3734] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus size={16} className="text-[#E8D1C5]" /> Novo Estabelecimento
          </button>
        </div>
      </div>

      {/* Global SaaS Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: MRR */}
        <div className="p-5 rounded-3xl bg-white border border-[#EBE3D7] shadow-xs hover:border-[#D6CBC0] transition-all">
          <div className="flex items-center justify-between text-[#8C7F75] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">MRR da Plataforma</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF0ED] text-[#B35848] flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#2D2725]">
              R$ {platformStats.totalMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp size={12} className="mr-0.5" /> +18.4%
            </span>
          </div>
          <span className="text-[11px] text-[#9C8F85] mt-1 block">
            ARR projetado: R$ {platformStats.platformARR.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/ano
          </span>
        </div>

        {/* KPI 2: Total Tenants */}
        <div className="p-5 rounded-3xl bg-white border border-[#EBE3D7] shadow-xs hover:border-[#D6CBC0] transition-all">
          <div className="flex items-center justify-between text-[#8C7F75] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Clínicas Parceiras</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] text-[#9C753B] flex items-center justify-center">
              <Building2 size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#2D2725]">
              {platformStats.totalTenants}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              {platformStats.activeTenants} ativas
            </span>
          </div>
          <span className="text-[11px] text-[#9C8F85] mt-1 block">
            {platformStats.suspendedTenants > 0 ? `${platformStats.suspendedTenants} suspensa ou inadimplente` : '100% adimplentes'}
          </span>
        </div>

        {/* KPI 3: Churn Rate */}
        <div className="p-5 rounded-3xl bg-white border border-[#EBE3D7] shadow-xs hover:border-[#D6CBC0] transition-all">
          <div className="flex items-center justify-between text-[#8C7F75] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Taxa de Churn</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#2D2725]">
              {platformStats.churnRate}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              Saudável (&lt; 2%)
            </span>
          </div>
          <span className="text-[11px] text-[#9C8F85] mt-1 block">Retenção de 98.6% nos últimos 12 meses</span>
        </div>

        {/* KPI 4: Active Modules Rate */}
        <div className="p-5 rounded-3xl bg-white border border-[#EBE3D7] shadow-xs hover:border-[#D6CBC0] transition-all">
          <div className="flex items-center justify-between text-[#8C7F75] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Módulos Contratados</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF2E6] text-[#B88746] flex items-center justify-center">
              <Box size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#2D2725]">
              {platformModules.length} Disponíveis
            </span>
            <span className="text-xs text-[#9C753B] font-semibold">
              Add-ons Ativos
            </span>
          </div>
          <span className="text-[11px] text-[#9C8F85] mt-1 block">
            Média de 3.2 módulos por clínica
          </span>
        </div>
      </div>

      {/* COCKPIT DE DESENVOLVEDOR: SAÚDE FINANCEIRA COLETIVA & CHURN RISK */}
      <div className="bg-gradient-to-br from-white via-[#FAF8F5] to-[#F7F2EC] rounded-3xl border border-[#EBE3D7] p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFE9E2]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF2E6] text-[#9C753B] border border-[#ECD9BD] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Activity size={12} /> Cockpit de Desenvolvedor
              </span>
              <span className="text-xs text-[#8C7F75]">• Visão Super Admin</span>
            </div>
            <h2 className="font-display text-xl font-bold text-[#2D2725] tracking-tight">
              Saúde Financeira Coletiva da Rede Aura
            </h2>
            <p className="text-xs text-[#7D7066]">
              Inteligência de ticket médio unificado e detecção preditiva de risco de churn para ação preventiva de Sucesso do Cliente (CS).
            </p>
          </div>

          {csToast && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>{csToast}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card 1: Ticket Médio Global */}
          <div className="bg-white rounded-2xl p-5 border border-[#EBE3D7] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7F75]">
                Ticket Médio Global da Rede
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#FAF0ED] text-[#B35848] flex items-center justify-center">
                <DollarSign size={15} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-[#2D2725]">R$ 268,40</h3>
              <span className="text-xs text-emerald-600 font-semibold flex items-center">
                <TrendingUp size={12} className="mr-0.5" /> +8.4%
              </span>
            </div>
            <p className="text-[11px] text-[#7D7066] leading-relaxed">
              Média ponderada por serviço executado em 1.482 agendamentos finalizados. Harmonização e Bioestimuladores puxam a margem para cima.
            </p>
          </div>

          {/* Card 2 & 3: Alerta Churn Risk (Queda de Lucro em 3 Meses) */}
          <div className="lg:col-span-2 bg-gradient-to-r from-rose-50/70 via-white to-amber-50/50 rounded-2xl p-5 border border-rose-200/80 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-2">
                    <span>Alerta Preditivo de Churn Risk</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-900 text-[10px] font-mono">
                      Queda de Lucro &gt; 3 Meses
                    </span>
                  </h4>
                  <p className="text-[11px] text-rose-800/80 mt-0.5">
                    1 clínica identificada com compressão contínua de margem líquida. Risco iminente de cancelamento de assinatura.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCsToast('Chamado de Sucesso do Cliente aberto! Mensagem pré-formatada enviada.');
                  setTimeout(() => setCsToast(null), 4000);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2D2725] hover:bg-[#3F3734] text-white text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
              >
                <MessageSquare size={13} className="text-[#E8D1C5]" />
                <span>Intervenção CS (WhatsApp)</span>
              </button>
            </div>

            <div className="bg-white/90 rounded-xl p-3.5 border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-[#2D2725] block text-sm">
                  Clínica Lumière Estética &amp; Spa
                </span>
                <span className="text-[11px] text-[#7D7066]">
                  Gestora: Dra. Mariana Costa • Plano Pro • Contratada há 8 meses
                </span>
              </div>

              {/* Histórico 3 Meses */}
              <div className="flex items-center gap-3">
                <div className="text-center px-2 py-1 bg-[#FAF8F5] rounded-lg border border-[#EBE3D7]">
                  <span className="text-[9px] text-[#8C7F75] block uppercase font-bold">Julho</span>
                  <span className="text-xs font-mono font-bold text-emerald-700">R$ 18.200</span>
                  <span className="text-[9px] text-emerald-600 block">38% margem</span>
                </div>
                <span className="text-[#8C7F75]">→</span>
                <div className="text-center px-2 py-1 bg-[#FAF8F5] rounded-lg border border-[#EBE3D7]">
                  <span className="text-[9px] text-[#8C7F75] block uppercase font-bold">Agosto</span>
                  <span className="text-xs font-mono font-bold text-amber-700">R$ 11.400</span>
                  <span className="text-[9px] text-amber-600 block">24% margem</span>
                </div>
                <span className="text-[#8C7F75]">→</span>
                <div className="text-center px-2 py-1 bg-rose-50 rounded-lg border border-rose-200">
                  <span className="text-[9px] text-rose-700 block uppercase font-bold">Setembro</span>
                  <span className="text-xs font-mono font-bold text-rose-700">R$ 5.750</span>
                  <span className="text-[9px] text-rose-600 block">12% margem</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tenants Table & Management */}
      <div className="bg-white rounded-3xl border border-[#EBE3D7] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#F0EBE4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-[#2D2725] tracking-tight">
              Estabelecimentos Cadastrados (Tenants)
            </h2>
            <p className="text-xs text-[#8C7F75] mt-0.5">
              Alterne planos, ative recursos modulares ou suspenda estabelecimentos
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar clínica ou gestor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-[#D9CFC7] text-xs text-[#2D2725] focus:outline-none focus:ring-1 focus:ring-[#B88746] w-48 sm:w-60"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="p-1.5 rounded-xl border border-[#D9CFC7] text-xs text-[#2D2725] bg-white focus:outline-none focus:ring-1 focus:ring-[#B88746]"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="suspended">Suspensos</option>
              <option value="blocked">Bloqueados</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#EFE9E2] text-[#8C7F75] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Estabelecimento</th>
                <th className="px-4 py-3.5">Gestor / Contato</th>
                <th className="px-4 py-3.5">Plano</th>
                <th className="px-4 py-3.5">Módulos Contratados</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Ações de Plataforma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFEA]">
              {filteredBusinesses.map((biz) => {
                const isCurrent = currentBusiness.id === biz.id;

                return (
                  <tr key={biz.id} className="hover:bg-[#FAF9F7] transition-colors">
                    {/* Estabelecimento & Slug */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={biz.logo || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=100&q=80'}
                          alt={biz.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#EAE3DA]"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm text-[#2D2725] block">{biz.name}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.5 rounded-md bg-[#FAF2E6] text-[#9C753B] font-bold text-[9px] uppercase tracking-wider">
                                Em Uso
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#9C8F85] block font-mono">
                            /perfil/{biz.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Gestor */}
                    <td className="px-4 py-4">
                      <span className="font-medium text-[#2D2725] block">{biz.ownerName || 'Dra. Camila'}</span>
                      <span className="text-[11px] text-[#8C7F75] block">{biz.phone}</span>
                    </td>

                    {/* Plano */}
                    <td className="px-4 py-4">
                      <select
                        value={biz.plan_type}
                        onChange={(e) => updateBusiness(biz.id, { plan_type: e.target.value as PlanType })}
                        className="px-2.5 py-1 rounded-lg border border-[#D9CFC7] text-xs font-semibold bg-white text-[#2D2725] focus:outline-none"
                      >
                        <option value="free">Starter (Gratuito)</option>
                        <option value="pro">Pro (R$ 149/m)</option>
                        <option value="premium">Premium (R$ 249/m)</option>
                        <option value="enterprise">Enterprise (R$ 399/m)</option>
                      </select>
                    </td>

                    {/* Módulos Contratados (Pills) */}
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => setModuleManagerModalBusiness(biz)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FAF6F0] hover:bg-[#F2ECE1] border border-[#EAE3DA] text-[11px] font-semibold text-[#8C6226] transition-colors cursor-pointer"
                        title="Gerenciar módulos deste estabelecimento"
                      >
                        <Sliders size={12} />
                        <span>Configurar Módulos</span>
                      </button>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const next = biz.status === 'active' ? 'blocked' : 'active';
                            updateBusiness(biz.id, { status: next });
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                            biz.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                          title={biz.status === 'active' ? 'Clique para suspender/bloquear' : 'Clique para reativar'}
                        >
                          {biz.status === 'active' ? (
                            <>
                              <CheckCircle2 size={11} /> Ativo
                            </>
                          ) : (
                            <>
                              <XCircle size={11} /> Bloqueado
                            </>
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Ver Vitrine Pública */}
                        <button
                          type="button"
                          onClick={() => {
                            setPublicProfileSlug(biz.slug);
                            if (onOpenPublicProfile) onOpenPublicProfile(biz.slug);
                          }}
                          className="p-2 rounded-xl text-[#5C534D] hover:text-[#2D2725] hover:bg-[#F2ECE1] border border-[#EAE3DA] transition-all cursor-pointer"
                          title="Abrir Vitrine Pública (/perfil/:slug)"
                        >
                          <Store size={14} />
                        </button>

                        {/* Acessar como Tenant */}
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentBusinessId(biz.id);
                            if (onSwitchToTenant) onSwitchToTenant(biz.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#2D2725] hover:bg-[#3F3734] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          title="Alternar visão da clínica para este tenant"
                        >
                          <span>Acessar Clínica</span> <ChevronRight size={13} />
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

      {/* Platform Module Pricing Catalog */}
      <div className="bg-white rounded-3xl border border-[#EBE3D7] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-[#2D2725] tracking-tight">
              Catálogo de Módulos da Plataforma (Add-ons)
            </h3>
            <p className="text-xs text-[#8C7F75]">
              Recursos contratáveis individualmente pelas clínicas conforme o plano
            </p>
          </div>
          <span className="text-xs font-bold text-[#9C753B] bg-[#FAF2E6] px-3 py-1 rounded-full border border-[#ECD9BD]">
            5 Módulos Oficiais
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platformModules.map((mod) => {
            const Icon = getModuleIcon(mod.id);
            return (
              <div key={mod.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DE] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#EAE3DA] flex items-center justify-center text-[#B88746]">
                      <Icon size={16} />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-[#2D2725] block">{mod.name}</span>
                      <span className="text-[10px] text-[#9C753B] font-medium">{mod.badge}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#2D2725]">
                    R$ {mod.base_price.toFixed(2).replace('.', ',')}/mês
                  </span>
                </div>
                <p className="text-[11px] text-[#7D7066] leading-relaxed">
                  {mod.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Gerenciador de Módulos do Tenant */}
      {moduleManagerModalBusiness && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EDE7DF] relative">
            <button
              type="button"
              onClick={() => setModuleManagerModalBusiness(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <XCircle size={20} />
            </button>

            <div className="pb-3 border-b border-[#F2ECE4] mb-4">
              <span className="text-[10px] font-bold text-[#8C6226] uppercase tracking-wider block">
                Feature Gating • SaaS
              </span>
              <h3 className="font-display text-lg font-bold text-[#2D2725] mt-0.5">
                {moduleManagerModalBusiness.name}
              </h3>
              <p className="text-xs text-[#8C7F75]">Ative ou desative os módulos contratados para este tenant.</p>
            </div>

            <div className="space-y-2.5">
              {platformModules.map((mod) => {
                const Icon = getModuleIcon(mod.id);
                // Check if this tenant has this module
                const hasMod = (businesses.find((b) => b.id === moduleManagerModalBusiness.id) &&
                  // Let's toggle using toggleModuleForBusiness
                  currentBusiness.id === moduleManagerModalBusiness.id
                    ? activeModules.includes(mod.id)
                    : true); // fallback

                return (
                  <div
                    key={mod.id}
                    className="p-3 rounded-xl border border-[#EAE3DA] flex items-center justify-between bg-[#FAF8F5]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#B88746] border border-[#EAE3DA]">
                        <Icon size={16} />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#2D2725] block">{mod.name}</span>
                        <span className="text-[10px] text-[#8C7F75] block">
                          +R$ {mod.base_price.toFixed(2).replace('.', ',')}/mês
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleModuleForBusiness(moduleManagerModalBusiness.id, mod.id)}
                      className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer bg-[#2D2725] text-white hover:bg-[#3F3734]"
                    >
                      Alternar
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setModuleManagerModalBusiness(null)}
              className="w-full mt-5 bg-[#2D2725] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Salvar Configuração
            </button>
          </div>
        </div>
      )}

      {/* Modal: Novo Tenant */}
      {newTenantModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EDE7DF] relative">
            <button
              type="button"
              onClick={() => setNewTenantModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <XCircle size={20} />
            </button>

            <div className="pb-3 border-b border-[#F2ECE4] mb-4">
              <span className="text-[10px] font-bold text-[#8C6226] uppercase tracking-wider block">
                Novo Tenant SaaS
              </span>
              <h3 className="font-display text-xl font-bold text-[#2D2725] mt-0.5">
                Cadastrar Estabelecimento
              </h3>
              <p className="text-xs text-[#8C7F75]">Crie um novo espaço isolado com vitrine pública e RLS.</p>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#4A423C] mb-1">Nome da Clínica / Salão</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Studio Bella Concept"
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D9CFC7] text-xs text-[#2D2725] focus:outline-none focus:ring-1 focus:ring-[#B88746]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#4A423C] mb-1">Nome do Gestor / Responsável</label>
                  <input
                    type="text"
                    placeholder="Ex: Dra. Mariana Lima"
                    value={newBizOwner}
                    onChange={(e) => setNewBizOwner(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D9CFC7] text-xs text-[#2D2725] focus:outline-none focus:ring-1 focus:ring-[#B88746]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A423C] mb-1">E-mail Principal</label>
                  <input
                    type="email"
                    placeholder="contato@clinica.com.br"
                    value={newBizEmail}
                    onChange={(e) => setNewBizEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D9CFC7] text-xs text-[#2D2725] focus:outline-none focus:ring-1 focus:ring-[#B88746]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#4A423C] mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    placeholder="(11) 98765-4321"
                    value={newBizPhone}
                    onChange={(e) => setNewBizPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D9CFC7] text-xs text-[#2D2725] focus:outline-none focus:ring-1 focus:ring-[#B88746]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A423C] mb-1">Plano Inicial</label>
                  <select
                    value={newBizPlan}
                    onChange={(e) => setNewBizPlan(e.target.value as PlanType)}
                    className="w-full p-2.5 rounded-xl border border-[#D9CFC7] text-xs text-[#2D2725] bg-white focus:outline-none focus:ring-1 focus:ring-[#B88746]"
                  >
                    <option value="free">Starter (Gratuito)</option>
                    <option value="pro">Pro (R$ 149/mês)</option>
                    <option value="premium">Premium (R$ 249/mês)</option>
                    <option value="enterprise">Enterprise (R$ 399/mês)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A423C] mb-1">Cidade / Estado</label>
                <input
                  type="text"
                  placeholder="São Paulo - SP"
                  value={newBizCity}
                  onChange={(e) => setNewBizCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D9CFC7] text-xs text-[#2D2725] focus:outline-none focus:ring-1 focus:ring-[#B88746]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewTenantModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#2D2725] hover:bg-[#3F3734] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Criar Estabelecimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
