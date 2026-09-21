import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Sparkles,
  Box,
  Calculator,
  DollarSign,
  BookOpen,
  Star,
  Store,
  UserCheck,
  Building2,
  Settings,
  Plus,
  Search,
  Bell,
  LogOut,
  ExternalLink,
  ChevronDown,
  Shield,
  Menu,
  X,
  Lock,
  MessageSquare
} from 'lucide-react';
import { useLayout } from './LayoutContext';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../core/BusinessContext';
import { EcosystemBar } from '../components/layout/EcosystemBar';
import { NavItemKey } from '../components/layout/Sidebar';
import { dataService } from '../services/dataService';
import { UpgradeModal } from '../components/modals/UpgradeModal';
import { AuraLogo } from '../components/ui/AuraLogo';
import { AuraBrand } from '../components/ui/AuraBrand';
import { AuraLogoV3 } from '../components/ui/AuraLogoV3';

interface BusinessLayoutProps {
  children?: React.ReactNode;
}

export const BusinessLayout: React.FC<BusinessLayoutProps> = ({ children }) => {
  const { currentTab, setCurrentTab, setActivePillar, openNewAppointment, openSearch } = useLayout();
  const { userProfile, signOut } = useAuth();
  const { currentBusiness, hasAccessToModule, setPublicProfileSlug } = useBusiness();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unitSelectorOpen, setUnitSelectorOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedUpgradeModule, setSelectedUpgradeModule] = useState<string | undefined>(undefined);

  const units = dataService.getUnits();
  const activeUnitId = dataService.getActiveUnitId();
  const activeUnit = units.find(u => u.id === activeUnitId) || units[0];

  const handleNavClick = (tab: NavItemKey, moduleId?: string) => {
    if (moduleId && !hasAccessToModule(moduleId)) {
      setSelectedUpgradeModule(moduleId);
      setUpgradeModalOpen(true);
      return;
    }
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  const navSections = [
    {
      title: 'GESTÃO OPERACIONAL',
      items: [
        { key: 'dashboard' as NavItemKey, label: 'Dashboard DRE', icon: LayoutDashboard },
        { key: 'agenda' as NavItemKey, label: 'Agenda Global', icon: Calendar, moduleId: 'appointments' },
        { key: 'clientes' as NavItemKey, label: 'Clientes & Fichas', icon: Users, moduleId: 'clients' },
        { key: 'servicos' as NavItemKey, label: 'Procedimentos', icon: Sparkles },
      ],
    },
    {
      title: 'CUSTOS & INTELIGÊNCIA',
      items: [
        { key: 'estoque' as NavItemKey, label: 'Estoque & Insumos', icon: Box, moduleId: 'inventory' },
        { key: 'precificacao' as NavItemKey, label: 'Precificação Científica', icon: Calculator, moduleId: 'pricing' },
        { key: 'financeiro' as NavItemKey, label: 'DRE & Financeiro', icon: DollarSign, moduleId: 'finance' },
      ],
    },
    {
      title: 'MARKETING & REDE SOCIAL',
      items: [
        { 
          key: 'conteudos' as NavItemKey, 
          label: 'Marketing & Presença', 
          icon: Sparkles,
          badge: 'Aura Growth',
          moduleId: 'contents'
        },
        { 
          key: 'whatsapp' as NavItemKey, 
          label: 'Automação WhatsApp', 
          icon: MessageSquare, 
          badge: 'No-Show', 
          moduleId: 'whatsapp' 
        },
        { key: 'avaliacoes' as NavItemKey, label: 'Avaliações & NPS', icon: Star, moduleId: 'loyalty' },
        { key: 'vitrine' as NavItemKey, label: 'Vitrine da Loja', icon: Store, moduleId: 'vitrine' },
      ],
    },
    {
      title: 'GOVERNANÇA & ACESSOS',
      items: [
        { key: 'acessos' as NavItemKey, label: 'Gestão de Usuários', icon: UserCheck },
        { key: 'unidades' as NavItemKey, label: 'Unidades & Filiais', icon: Building2 },
        { key: 'configuracoes' as NavItemKey, label: 'Configurações', icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#3A3A3A] flex flex-col font-sans">
      {/* Ecosystem Switcher Bar */}
      <EcosystemBar />

      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 bg-[#F9F7F5]/90 backdrop-blur-md text-[#3A3A3A] z-40 px-4 py-3 flex items-center justify-between border-b border-[#F1EBE7]">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg font-bold tracking-tight text-[#3A3A3A]">
            AURA
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#EAD7D1]/60 text-[#3A3A3A] border border-[#dfc7c0]">
            BUSINESS
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-[#8E8E8E] hover:text-[#3A3A3A] rounded-xl bg-white border border-[#F1EBE7] shadow-2xs cursor-pointer"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex flex-1 relative">
        {/* SIDEBAR DE GESTÃO COMPLETA (A "TORRE DE COMANDO" LUMINOUS LUXURY) */}
        <aside
          className={`fixed inset-y-0 left-0 top-[41px] z-30 w-64 bg-[#F9F7F5]/90 backdrop-blur-xl text-[#3A3A3A] border-r border-[#F1EBE7] flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header da Sidebar com Aura Logo V3 (Business Intelligence) */}
          <div className="p-4 border-b border-[#F1EBE7]">
            <div className="flex items-center justify-between mb-2">
              <AuraLogoV3
                size="sm"
                variant="business"
              />
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A059]"></span>
              </span>
            </div>

            {/* Identificação da Clínica Ativa */}
            <div className="p-3 rounded-2xl bg-white border border-[#F1EBE7] shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF5EB] text-[#C5A059] flex items-center justify-center font-bold text-xs border border-[#F1EBE7]">
                  <Building2 size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#3A3A3A] truncate">
                    {currentBusiness?.name || 'Sublime Estética Avançada'}
                  </p>
                  <p className="text-[10px] text-[#8E8E8E] truncate">
                    Plano Enterprise • Ativa
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navegação Modular da Torre de Comando */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-5 no-scrollbar">
            {navSections.map(section => (
              <div key={section.title} className="space-y-1">
                <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#8E8E8E]">
                  {section.title}
                </h3>
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.key;
                  const isLocked = item.moduleId ? !hasAccessToModule(item.moduleId) : false;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleNavClick(item.key, item.moduleId)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#EAD7D1] text-[#3A3A3A] font-bold border border-[#dfc7c0] shadow-soft-glow'
                          : isLocked
                          ? 'text-[#8E8E8E]/70 hover:text-[#3A3A3A] hover:bg-white/60'
                          : 'text-[#8E8E8E] hover:text-[#3A3A3A] hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} className={isActive ? 'text-[#3A3A3A]' : isLocked ? 'text-[#8E8E8E]/60' : 'text-[#8E8E8E]'} />
                        <span className={isLocked ? 'text-[#8E8E8E]/70' : ''}>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isLocked && (
                          <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60" title="Módulo bloqueado no plano atual">
                            <Lock size={10} />
                            <span>Válvula</span>
                          </span>
                        )}
                        {item.badge && !isLocked && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white text-[#3A3A3A] border border-[#F1EBE7]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Rodapé da Sidebar & Conexão de Ecossistema */}
          <div className="p-3 border-t border-[#F1EBE7] space-y-2">
            {/* Card de Integração: Ver Vitrine Pública */}
            <button
              onClick={() => {
                if (currentBusiness?.slug) {
                  setPublicProfileSlug(currentBusiness.slug);
                }
                setCurrentTab('vitrine');
              }}
              className="w-full p-2.5 rounded-2xl bg-white border border-[#F1EBE7] hover:border-[#EAD7D1] text-left transition-all group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store size={14} className="text-[#C5A059]" />
                  <span className="text-xs font-semibold text-[#3A3A3A] group-hover:text-[#B69D8E] transition-colors">
                    Vitrine Pública da Loja
                  </span>
                </div>
                <ExternalLink size={12} className="text-[#8E8E8E] group-hover:text-[#3A3A3A] transition-colors" />
              </div>
              <p className="text-[10px] text-[#8E8E8E] mt-1">
                Visualizar como os clientes veem sua clínica
              </p>
            </button>

            {/* Informações do Usuário & Logout */}
            <div className="flex items-center justify-between pt-2 px-1">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#EAD7D1] text-[#3A3A3A] flex items-center justify-center text-xs font-bold border border-white">
                  {(userProfile?.name || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#3A3A3A] truncate max-w-[110px]">
                    {userProfile?.name || 'Administrador'}
                  </p>
                  <p className="text-[10px] text-[#8E8E8E] truncate">
                    {userProfile?.role || 'ADMIN'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => signOut()}
                className="p-1.5 text-[#8E8E8E] hover:text-rose-600 hover:bg-white rounded-xl transition-colors cursor-pointer border border-transparent hover:border-[#F1EBE7]"
                title="Sair"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* Backdrop for Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-xs z-20 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* CONTAINER PRINCIPAL DO BUSINESS */}
        <div className="flex-1 md:ml-64 flex flex-col min-w-0">
          {/* Header Superior Administrativo (VERSÃO PURIFICADA - SEM RUÍDO COGNITIVO) */}
          <header className="sticky top-[41px] bg-white/80 backdrop-blur-md border-b border-[#F1EBE7] z-10 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl text-[#3A3A3A] hover:bg-[#F9F7F5] border border-[#F1EBE7] transition-colors cursor-pointer"
                title="Abrir Menu"
              >
                <Menu size={18} />
              </button>

              {/* Seletor de Unidades & Filiais (Jardins, Moema...) */}
              <div className="relative">
                <button
                  onClick={() => setUnitSelectorOpen(!unitSelectorOpen)}
                  className="flex items-center gap-2 text-xs font-semibold text-[#3A3A3A] bg-[#F9F7F5] hover:bg-white px-3.5 py-2 rounded-2xl border border-[#F1EBE7] transition-all cursor-pointer shadow-2xs"
                >
                  <Building2 size={14} className="text-[#C5A059]" />
                  <span className="truncate max-w-[120px] sm:max-w-[180px]">
                    {activeUnit?.name || 'Todas as Unidades'}
                  </span>
                  <ChevronDown size={14} className="text-[#8E8E8E]" />
                </button>

                {unitSelectorOpen && (
                  <div
                    className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-luminous border border-[#F1EBE7] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onClick={() => setUnitSelectorOpen(false)}
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8E8E8E] border-b border-[#F1EBE7]">
                      Selecione a Unidade
                    </div>
                    <button
                      onClick={() => dataService.setActiveUnitId('ALL')}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        activeUnitId === 'ALL'
                          ? 'bg-[#F9F7F5] text-[#3A3A3A] font-bold'
                          : 'text-[#8E8E8E] hover:bg-[#F9F7F5] hover:text-[#3A3A3A]'
                      }`}
                    >
                      <span>Visão Consolidada (Todas)</span>
                      {activeUnitId === 'ALL' && <span className="text-[10px] text-[#C5A059] font-bold">Ativa</span>}
                    </button>
                    {units.map(u => (
                      <button
                        key={u.id}
                        onClick={() => dataService.setActiveUnitId(u.id)}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          activeUnitId === u.id
                            ? 'bg-[#F9F7F5] text-[#3A3A3A] font-bold'
                            : 'text-[#8E8E8E] hover:bg-[#F9F7F5] hover:text-[#3A3A3A]'
                        }`}
                      >
                        <span className="truncate">{u.name}</span>
                        {activeUnitId === u.id && <span className="text-[10px] text-[#C5A059] font-bold">Ativa</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Barra de Busca (Buscar cliente ou serviço...) */}
              <div
                onClick={openSearch}
                className="hidden sm:flex items-center gap-2 h-10 w-full max-w-[340px] md:max-w-[400px] bg-[#F9F7F5] hover:bg-white rounded-2xl px-3.5 border border-[#F1EBE7] hover:border-[#EAD7D1] transition-all cursor-pointer shadow-2xs group"
              >
                <Search size={16} className="text-[#8E8E8E] group-hover:text-[#3A3A3A] transition-colors shrink-0" />
                <span className="text-xs text-[#8E8E8E] truncate">
                  Buscar cliente ou serviço...
                </span>
                <kbd className="hidden lg:inline-flex items-center ml-auto px-1.5 py-0.5 text-[9px] font-semibold text-[#8E8E8E] bg-white border border-[#F1EBE7] rounded">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Perfil & Status do Administrador (O BOTÃO 'NOVO AGENDAMENTO' FOI REMOVIDO DAQUI) */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-[#F1EBE7]">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-[#3A3A3A]">
                    {userProfile?.name || 'Dra. Camila Vasconcelos'}
                  </p>
                  <p className="text-[10px] text-[#8E8E8E] uppercase font-bold tracking-widest">
                    {userProfile?.role || 'Administrador'}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#EAD7D1] text-[#3A3A3A] flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-2xs">
                  {(userProfile?.name || 'Camila').charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </header>

          {/* Área de Conteúdo Principal */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
            {children}
          </main>
        </div>
      </div>

      {/* Modal de Upgrade / Liberação de Válvula */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        moduleId={selectedUpgradeModule}
      />
    </div>
  );
};
