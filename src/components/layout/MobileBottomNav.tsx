import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Menu,
  X,
  Sparkles,
  DollarSign,
  Package,
  Star,
  Settings,
  Shield,
  FileText,
  UserCheck,
  Zap,
  BarChart3,
  Globe,
  LogIn,
  Calculator,
  Bell
} from 'lucide-react';
import { NavItemKey } from './Sidebar';

interface MobileBottomNavProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  onOpenNewAppointment?: () => void;
  unreadNotificationsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  unreadNotificationsCount,
}) => {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const mainItems = [
    { id: 'dashboard' as NavItemKey, label: 'Início', icon: LayoutDashboard },
    { id: 'agenda' as NavItemKey, label: 'Agenda', icon: Calendar },
    { id: 'clientes' as NavItemKey, label: 'Clientes', icon: Users },
    { id: 'financeiro' as NavItemKey, label: 'Financeiro', icon: DollarSign },
  ];

  const moreItems = [
    { id: 'estoque' as NavItemKey, label: 'Controle de Estoque', icon: Package },
    { id: 'servicos' as NavItemKey, label: 'Serviços & Procedimentos', icon: Sparkles },
    { id: 'profissionais' as NavItemKey, label: 'Equipe de Profissionais', icon: UserCheck },
    { id: 'precificacao' as NavItemKey, label: 'Precificação & Custos', icon: Calculator },
    { id: 'avaliacoes' as NavItemKey, label: 'Avaliações & NPS', icon: Star },
    { id: 'conteudos' as NavItemKey, label: 'Conteúdos & Dicas', icon: FileText },
    { id: 'automacoes' as NavItemKey, label: 'Central de Automações', icon: Zap },
    { id: 'relatorios' as NavItemKey, label: 'Relatórios Executivos', icon: BarChart3 },
    { id: 'portal' as NavItemKey, label: 'Portal do Paciente', icon: Globe },
    { id: 'acessos' as NavItemKey, label: 'Gestão de Acessos (RBAC)', icon: Shield },
    { id: 'configuracoes' as NavItemKey, label: 'Configurações da Clínica', icon: Settings },
  ];

  return (
    <>
      {/* Drawer for "Mais" menu */}
      {moreMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMoreMenuOpen(false)}
          />
          <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-3xl p-5 shadow-2xl border-t border-[#EAE3DA] max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE4]">
              <div>
                <h3 className="font-display text-lg font-semibold text-[#2D2725]">Menu da Clínica</h3>
                <p className="text-xs text-[#8F8278]">Navegação estruturada por módulos</p>
              </div>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(false)}
                className="p-2 text-[#8F8278] hover:text-[#2D2725] rounded-full hover:bg-[#F6F2EC] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 py-4">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id);
                      setMoreMenuOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#2D2725] text-white border-[#2D2725]'
                        : 'bg-[#FAF8F5] text-[#4A423C] border-[#EAE3DA] hover:border-[#D6CBC0]'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-[#E8D1C5]' : 'text-[#8F8278]'} />
                    <span className="text-xs font-medium truncate flex-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar (Clean Desk Policy - Sem botões flutuantes) */}
      <nav
        id="mobile-bottom-nav"
        className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#EAE3DA] flex items-center justify-around px-2 z-40 shadow-sm"
      >
        {mainItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 cursor-pointer transition-colors ${
                isActive ? 'text-[#2D2725] font-semibold' : 'text-[#8C7F75] hover:text-[#2D2725]'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-[#2D2725]' : 'text-[#8C7F75]'} />
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          );
        })}

        {/* "Mais" Button */}
        <button
          id="mobile-more-btn"
          type="button"
          onClick={() => setMoreMenuOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-[#8C7F75] hover:text-[#2D2725] cursor-pointer"
        >
          <Menu size={20} />
          <span className="text-[10px] mt-1">Mais</span>
        </button>
      </nav>
    </>
  );
};
