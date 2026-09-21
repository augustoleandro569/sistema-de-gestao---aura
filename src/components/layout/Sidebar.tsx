import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Sparkles,
  UserCheck,
  Calculator,
  DollarSign,
  Star,
  FileText,
  Zap,
  BarChart,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Shield,
  HeartHandshake,
  X,
  Plus,
  UserPlus,
  Globe,
  LogIn,
  Package,
  BookOpen,
  Box,
  Building2,
  Store,
  Layers,
  ShoppingBag,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../core/BusinessContext';
import { dataService } from '../../services/dataService';
import { UserRole } from '../../types';
import { SidebarItem } from './SidebarItem';
import { UpgradeModal } from '../modals/UpgradeModal';
import { AuraLogo } from '../ui/AuraLogo';
import { AuraBrand } from '../ui/AuraBrand';
import { AuraLogoV3 } from '../ui/AuraLogoV3';

export type NavItemKey =
  | 'cadastro'
  | 'login'
  | 'portal'
  | 'dashboard'
  | 'agenda'
  | 'clientes'
  | 'servicos'
  | 'profissionais'
  | 'precificacao'
  | 'estoque'
  | 'financeiro'
  | 'avaliacoes'
  | 'conteudos'
  | 'automacoes'
  | 'whatsapp'
  | 'relatorios'
  | 'notificacoes'
  | 'acessos'
  | 'unidades'
  | 'configuracoes'
  | 'superadmin'
  | 'vitrine'
  | 'marketplace';

export interface NavItemDef {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
  badgeRating?: string;
  accent?: boolean;
  module?: string;
}

export const navItems: Record<string, NavItemDef[]> = {
  CLIENT: [
    { label: 'Explorar Conteúdos', icon: BookOpen, path: '/portal/conteudos' },
    { label: 'Meus Agendamentos', icon: Calendar, path: '/portal/agenda' },
    { label: 'Perfil & Fidelidade', icon: Sparkles, path: '/portal/perfil' },
  ],
  ADMIN: [
    { label: 'Dashboard DRE', icon: BarChart, path: '/admin/dashboard' },
    { label: 'Agenda Global', icon: Calendar, path: '/admin/agenda', module: 'appointments' },
    { label: 'Gestão de Clientes', icon: Users, path: '/admin/clientes', module: 'clients' },
    { label: 'Estoque & Insumos', icon: Box, path: '/admin/estoque', module: 'inventory' },
    { label: 'Precificação Científica', icon: Calculator, path: '/admin/precificacao', module: 'pricing' },
    { label: 'DRE & Financeiro', icon: DollarSign, path: '/admin/financeiro', module: 'finance' },
    { label: 'Marketing Marketplace', icon: ShoppingBag, path: '/marketplace', badge: 'Ponte App' },
    { label: 'Serviços & Protocolos', icon: Sparkles, path: '/admin/servicos' },
    { label: 'Profissionais & Equipe', icon: UserCheck, path: '/admin/profissionais' },
    { label: 'Avaliações & NPS', icon: Star, path: '/admin/avaliacoes' },
    { label: 'Marketing & Presença', icon: Sparkles, path: '/admin/conteudos', module: 'contents' },
    { label: 'Automação WhatsApp', icon: MessageSquare, path: '/admin/whatsapp', module: 'whatsapp', badge: 'No-Show' },
    { label: 'Relatórios Executivos', icon: BarChart3, path: '/admin/relatorios', module: 'reports' },
    { label: 'Vitrine Pública White-label', icon: Globe, path: '/admin/vitrine', module: 'vitrine', badge: 'Vitrine' },
    { label: 'Controle da Plataforma', icon: Shield, path: '/admin/superadmin', badge: 'God Mode' },
    { label: 'Gestão de Usuários', icon: ShieldCheck, path: '/admin/acessos', badge: 'Admin' },
    { label: 'Unidades & Filiais', icon: Building2, path: '/admin/unidades', badge: 'Unidades' },
    { label: 'Notificações', icon: Bell, path: '/admin/notificacoes' },
    { label: 'Configurações & White-label', icon: Settings, path: '/admin/configuracoes' },
  ],
  RECEPTIONIST: [
    { label: 'Dashboard', icon: BarChart, path: '/admin/dashboard' },
    { label: 'Aura Marketplace', icon: ShoppingBag, path: '/marketplace', badge: 'App' },
    { label: 'Agenda', icon: Calendar, path: '/admin/agenda', module: 'appointments' },
    { label: 'Clientes', icon: Users, path: '/admin/clientes', module: 'clients' },
    { label: 'Serviços', icon: Sparkles, path: '/admin/servicos' },
    { label: 'Estoque', icon: Box, path: '/admin/estoque', module: 'inventory' },
    { label: 'Vitrine Pública', icon: Globe, path: '/admin/vitrine', module: 'vitrine', badge: 'Site' },
    { label: 'Notificações', icon: Bell, path: '/admin/notificacoes' },
  ],
  PROFESSIONAL: [
    { label: 'Dashboard', icon: BarChart, path: '/admin/dashboard' },
    { label: 'Minha Agenda', icon: Calendar, path: '/admin/agenda', module: 'appointments' },
    { label: 'Clientes', icon: Users, path: '/admin/clientes', module: 'clients' },
    { label: 'Avaliações', icon: Star, path: '/admin/avaliacoes' },
    { label: 'Conteúdos', icon: FileText, path: '/admin/conteudos', module: 'contents' },
  ],
};

export const NAV_ITEMS = navItems.ADMIN;

interface SidebarProps {
  currentTab?: NavItemKey;
  activeTab?: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  collapsed?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  unreadNotificationsCount?: number;
  clientsToReturnCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenNewAppointment?: () => void;
  role?: UserRole | string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  activeTab,
  onSelectTab,
  collapsed = false,
  isCollapsed,
  onToggleCollapse,
  unreadNotificationsCount = 0,
  clientsToReturnCount = 0,
  isMobileOpen = false,
  onCloseMobile,
  onOpenNewAppointment,
  role,
}) => {
  const { userRole, userProfile, portalRoute, setPortalRoute } = useAuth();
  const { currentBusiness, businesses, setCurrentBusinessId, setPublicProfileSlug } = useBusiness();
  const [tenantSwitcherOpen, setTenantSwitcherOpen] = useState(false);
  const [upgradeModalModule, setUpgradeModalModule] = useState<string | null>(null);

  const isPlatformAdmin =
    userProfile?.email?.toLowerCase() === 'dev@aura.com.br' ||
    userProfile?.email?.toLowerCase() === 'augusto.leandro569@gmail.com' ||
    userRole === 'PLATFORM_ADMIN' ||
    userRole === 'SUPER_ADMIN' ||
    !!userProfile?.is_root;

  const effectiveRole = (role || userRole || 'ADMIN') as keyof typeof navItems;
  const baseNavItems = navItems[effectiveRole] || navItems.ADMIN;
  const currentNavItems = baseNavItems.filter((item) => {
    if (item.path === '/admin/superadmin') {
      return isPlatformAdmin;
    }
    return true;
  });

  const selectedTab = currentTab || activeTab || 'dashboard';
  const isCurrentlyCollapsed = isCollapsed !== undefined ? isCollapsed : collapsed;

  const handleItemClick = (item: NavItemDef) => {
    if (item.path === '/portal/conteudos') {
      onSelectTab('conteudos');
      setPortalRoute('/portal/conteudos');
    } else if (item.path === '/portal/agenda') {
      onSelectTab('portal');
      setPortalRoute('/portal/agendamento');
    } else if (item.path === '/portal/perfil') {
      onSelectTab('portal');
      setPortalRoute('/portal/fidelidade');
    } else if (item.path === '/admin/vitrine') {
      setPublicProfileSlug(currentBusiness.slug);
      onSelectTab('vitrine');
    } else if (item.path === '/admin/superadmin') {
      onSelectTab('superadmin');
    } else if (item.path === '/marketplace') {
      onSelectTab('marketplace');
    } else if (item.path.startsWith('/admin/')) {
      const tab = item.path.replace('/admin/', '') as NavItemKey;
      onSelectTab(tab);
    } else if (item.path.startsWith('/portal/')) {
      onSelectTab('portal');
      setPortalRoute(item.path);
    } else if (item.path === '/portal') {
      onSelectTab('portal');
    }
  };

  const isItemActive = (item: NavItemDef) => {
    if (effectiveRole === 'CLIENT') {
      if (item.path === '/portal/conteudos') {
        return selectedTab === 'conteudos';
      }
      if (item.path === '/portal/agenda') {
        return (
          selectedTab === 'portal' &&
          (portalRoute === '/portal/agendamento' ||
            portalRoute === '/portal/agenda' ||
            portalRoute === '/portal/cadastro' ||
            portalRoute === '/portal/login')
        );
      }
      if (item.path === '/portal/perfil') {
        return (
          selectedTab === 'portal' &&
          (portalRoute === '/portal/fidelidade' || portalRoute === '/portal/perfil')
        );
      }
      return false;
    }

    const adminTab = item.path.replace('/admin/', '') as NavItemKey;
    return selectedTab === adminTab;
  };

  const renderNavContent = (isMobileView: boolean) => (
    <>
      {/* Brand Header com Aura Logo V3 (Mono-line Fluidity) */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-[#F0EBE4]">
        {!isCurrentlyCollapsed || isMobileView ? (
          <div className="flex items-center gap-2 overflow-hidden py-1">
            <AuraLogoV3
              size="sm"
              variant="business"
            />
          </div>
        ) : (
          <div className="mx-auto">
            <AuraLogoV3
              size="xs"
              variant="business"
              subtitle=""
            />
          </div>
        )}

        {isMobileView ? (
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-2 rounded-lg text-[#8C7F75] hover:text-[#2D2725] hover:bg-[#F5F0E8] transition-colors"
          >
            <X size={20} />
          </button>
        ) : onToggleCollapse ? (
          <button
            id="sidebar-toggle-btn"
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-[#8C7F75] hover:text-[#2D2725] hover:bg-[#F5F0E8] transition-colors focus:outline-none"
            title={isCurrentlyCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
          >
            {isCurrentlyCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        ) : null}
      </div>

      {/* Multi-Tenant Switcher Widget (when expanded) */}
      {(!isCurrentlyCollapsed || isMobileView) && effectiveRole !== 'CLIENT' && (
        <div className="p-3 border-b border-[#F0EBE4] bg-[#FAF8F5]/60 relative">
          <div className="text-[10px] font-bold text-[#8C7F75] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Estabelecimento Ativo</span>
            <span className="text-[#9C753B] font-semibold uppercase">{currentBusiness.plan_type}</span>
          </div>

          <button
            type="button"
            onClick={() => setTenantSwitcherOpen(!tenantSwitcherOpen)}
            className="w-full p-2 rounded-xl bg-white border border-[#EAE3DA] hover:border-[#D6CBC0] shadow-xs flex items-center justify-between transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={currentBusiness.logo || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=80&q=80'}
                alt={currentBusiness.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#EAE3DA] shrink-0"
              />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[#2D2725] block truncate leading-tight">
                  {currentBusiness.name}
                </span>
                <span className="text-[10px] text-[#8C7F75] block truncate font-mono">
                  /{currentBusiness.slug}
                </span>
              </div>
            </div>
            <ChevronDown size={14} className={`text-[#8C7F75] transition-transform ${tenantSwitcherOpen ? 'rotate-180' : ''}`} />
          </button>

          {tenantSwitcherOpen && (
            <div className="absolute left-3 right-3 mt-1.5 bg-white rounded-2xl shadow-xl border border-[#EAE3DA] p-2 z-50 space-y-1 animate-in fade-in">
              <p className="px-2 py-1 text-[10px] font-bold text-[#8C7F75] uppercase tracking-wider">
                Alternar Tenant (Clínica)
              </p>
              {businesses.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setCurrentBusinessId(b.id);
                    setTenantSwitcherOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    currentBusiness.id === b.id
                      ? 'bg-[#FAF6F0] text-[#8C6226] font-semibold border border-[#EAE3DA]'
                      : 'text-[#5C534D] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="block truncate font-medium">{b.name}</span>
                    <span className="block text-[10px] text-gray-400 font-normal">Plano {b.plan_type}</span>
                  </div>
                  {currentBusiness.id === b.id && (
                    <span className="w-2 h-2 rounded-full bg-[#B88746] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {currentNavItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item);

          return (
            <SidebarItem
              key={item.path}
              module={item.module}
              label={item.label}
              icon={Icon as any}
              path={item.path}
              active={active}
              isCollapsed={isCurrentlyCollapsed}
              isMobileView={isMobileView}
              badge={item.badge}
              unreadCount={item.path === '/admin/notificacoes' ? unreadNotificationsCount : 0}
              clientsToReturnCount={item.path === '/admin/clientes' ? clientsToReturnCount : 0}
              onClick={() => {
                handleItemClick(item);
                if (isMobileView && onCloseMobile) {
                  onCloseMobile();
                }
              }}
              onOpenUpgrade={(modId) => setUpgradeModalModule(modId)}
            />
          );
        })}
      </div>

      {/* Multi-Tenant SaaS Status & Unit */}
      <div className="p-4 border-t border-aura-linen bg-aura-pearl/60">
        {!isCurrentlyCollapsed || isMobileView ? (
          <div className="p-3.5 rounded-2xl bg-white border border-aura-linen shadow-xs flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-aura-taupe uppercase tracking-wider">
                Unidade Ativa
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" title="Online & Sincronizado" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-aura-charcoal truncate">
                {dataService.getActiveUnit()?.name || 'Jardins - Matriz'}
              </p>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-aura-charcoal text-white">
                {currentBusiness.plan_type}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Unidade Conectada" />
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id="admin-sidebar"
        className={`hidden md:flex flex-col bg-[#FDFCFB] border-r border-[#EFE9E2] h-full w-full transition-all duration-300 z-30 select-none ${
          isCurrentlyCollapsed ? 'w-[76px]' : 'w-full'
        }`}
      >
        {renderNavContent(false)}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer content */}
          <aside className="relative w-72 max-w-[85vw] bg-[#FDFCFB] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {renderNavContent(true)}
          </aside>
        </div>
      )}

      {/* Modal de Upgrade & Venda de Módulos */}
      <UpgradeModal
        isOpen={!!upgradeModalModule}
        onClose={() => setUpgradeModalModule(null)}
        moduleId={upgradeModalModule || undefined}
      />
    </>
  );
};

export default Sidebar;
