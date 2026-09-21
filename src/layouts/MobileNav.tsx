import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  DollarSign,
  Menu,
  Plus,
  X,
  Sparkles,
  UserCheck,
  Calculator,
  Star,
  Zap,
  BarChart3,
  Bell,
  Settings,
  FileText,
  UserPlus,
  Shield,
  LogIn,
  Package,
  BookOpen
} from 'lucide-react';
import { useLayout } from './LayoutContext';
import { useAuth } from '../context/AuthContext';
import { NavItemKey } from '../components/layout/Sidebar';

interface MobileNavItem {
  id: NavItemKey;
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
}

export const MobileNav: React.FC = () => {
  const layout = useLayout();
  const { userRole, setPortalRoute } = useAuth();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const isClient = userRole === 'CLIENT';

  const clientItems: MobileNavItem[] = [
    {
      id: 'conteudos',
      label: 'Conteúdos',
      icon: BookOpen,
      onClick: () => {
        layout.setCurrentTab('conteudos');
        setPortalRoute('/portal/conteudos');
      },
    },
    {
      id: 'portal',
      label: 'Agendamentos',
      icon: Calendar,
      onClick: () => {
        layout.setCurrentTab('portal');
        setPortalRoute('/portal/agendamento');
      },
    },
    {
      id: 'portal',
      label: 'Fidelidade',
      icon: Sparkles,
      onClick: () => {
        layout.setCurrentTab('portal');
        setPortalRoute('/portal/fidelidade');
      },
    },
  ];

  const adminMainItems: MobileNavItem[] = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'acessos', label: 'Usuários', icon: Shield },
  ];

  const mainItems: MobileNavItem[] = isClient ? clientItems : adminMainItems;

  const moreItems: {
    id: NavItemKey;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeCount?: number;
  }[] = [
    { id: 'login', label: 'Login Portal (Vitrine)', icon: LogIn, badge: 'Aura' },
    { id: 'financeiro', label: 'Financeiro & Caixa', icon: DollarSign },
    { id: 'servicos', label: 'Serviços & Procedimentos', icon: Sparkles },
    { id: 'profissionais', label: 'Equipe de Profissionais', icon: UserCheck },
    { id: 'precificacao', label: 'Precificação & Custos', icon: Calculator, badge: 'Pro' },
    { id: 'estoque', label: 'Controle de Estoque (Insumos)', icon: Package, badge: 'Itens' },
    { id: 'avaliacoes', label: 'Avaliações & NPS', icon: Star },
    { id: 'conteudos', label: 'Conteúdos & Dicas', icon: FileText },
    { id: 'automacoes', label: 'Central de Automações', icon: Zap },
    { id: 'relatorios', label: 'Relatórios Executivos', icon: BarChart3 },
    {
      id: 'notificacoes',
      label: 'Notificações',
      icon: Bell,
      badgeCount: layout.unreadNotificationsCount,
    },
    { id: 'acessos', label: 'Gestão de Acessos (RBAC)', icon: Shield },
    { id: 'configuracoes', label: 'Configurações da Clínica', icon: Settings },
  ];

  const handleSelectTab = (tab: NavItemKey) => {
    layout.setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Full Sheet Drawer for "Mais" */}
      {moreMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMoreMenuOpen(false)}
          />
          <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-3xl p-5 shadow-2xl border-t border-[#EAE3DA] max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE4]">
              <div>
                <h3 className="font-display text-lg font-semibold text-[#2D2725]">Menu Completo</h3>
                <p className="text-xs text-[#8F8278]">Acesso rápido a todos os módulos do sistema</p>
              </div>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(false)}
                className="p-2 text-[#8F8278] hover:text-[#2D2725] rounded-full hover:bg-[#F6F2EC]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 py-4">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = layout.currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      handleSelectTab(item.id);
                      setMoreMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'bg-[#2D2725] text-white border-[#2D2725]'
                        : 'bg-[#FAF8F5] text-[#443C37] border-[#EFEAE2] hover:bg-white hover:border-[#DCCFC4]'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-[#E8D1C5]' : 'text-[#8F8278]'} />
                    <span className="text-xs font-medium truncate flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#FAF2E6] text-[#9C753B] rounded">
                        {item.badge}
                      </span>
                    )}
                    {item.badgeCount !== undefined && item.badgeCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#D89F95] text-white rounded-full">
                        {item.badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Bar Items inside the parent nav */}
      <div className="flex items-center justify-around w-full h-full">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const isActive = layout.currentTab === item.id;
          return (
            <button
              key={`${item.id}-${item.label}`}
              type="button"
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else {
                  handleSelectTab(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                isActive ? 'text-[#2D2725] font-semibold' : 'text-[#8C7F75] hover:text-[#2D2725]'
              }`}
            >
              <Icon size={19} className={isActive ? 'text-[#2D2725]' : 'text-[#8C7F75]'} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* Mais Button */}
        <button
          type="button"
          onClick={() => setMoreMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-[#8C7F75] hover:text-[#2D2725] transition-colors cursor-pointer"
        >
          <Menu size={19} />
          <span className="text-[10px] mt-0.5">Mais</span>
        </button>
      </div>
    </>
  );
};
