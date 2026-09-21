import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Store,
  Calendar,
  User,
  Heart,
  Search,
  LogOut,
  Building2,
  Shield,
  ShieldCheck,
  ChevronDown,
  Award,
  Bell,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useLayout } from './LayoutContext';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../core/BusinessContext';
import { EcosystemBar } from '../components/layout/EcosystemBar';
import { ConsumerNav } from '../components/layout/ConsumerNav';
import { AuraLogo } from '../components/ui/AuraLogo';
import { AuraBrand } from '../components/ui/AuraBrand';
import { AuraLogoV3 } from '../components/ui/AuraLogoV3';

interface ConsumerLayoutProps {
  children?: React.ReactNode;
  activeConsumerTab?: 'feed' | 'mapa' | 'lojas' | 'horarios';
  onSelectConsumerTab?: (tab: 'feed' | 'mapa' | 'lojas' | 'horarios') => void;
}

export const ConsumerLayout: React.FC<ConsumerLayoutProps> = ({
  children,
  activeConsumerTab = 'feed',
  onSelectConsumerTab,
}) => {
  const navigate = useNavigate();
  const { setActivePillar, setCurrentTab, currentTab } = useLayout();
  const { userProfile, signOut } = useAuth();
  const { currentBusiness } = useBusiness();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Derivar tab ativa se não passada explicitamente via props
  const resolvedTab: 'feed' | 'mapa' | 'lojas' | 'horarios' =
    (activeConsumerTab as 'feed' | 'mapa' | 'lojas' | 'horarios') ||
    (currentTab === 'portal' ? 'horarios' : 'feed');

  const handleTabChange = (tab: 'feed' | 'mapa' | 'lojas' | 'horarios') => {
    if (onSelectConsumerTab) {
      onSelectConsumerTab(tab);
    } else {
      if (tab === 'horarios') {
        navigate('/app/perfil');
        setCurrentTab('portal');
      } else if (tab === 'mapa') {
        navigate('/app/mapa');
        setCurrentTab('marketplace');
      } else if (tab === 'lojas') {
        navigate('/app/mapa');
        setCurrentTab('marketplace');
      } else {
        navigate('/app/explorar');
        setCurrentTab('marketplace');
      }
    }
  };

  const isRootPlatformAdmin =
    userProfile?.role === 'PLATFORM_ADMIN' ||
    userProfile?.email?.toLowerCase() === 'dev@aura.com.br' ||
    userProfile?.email?.toLowerCase() === 'augusto.leandro569@gmail.com';

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#3A3A3A] flex flex-col font-sans">
      {/* Ecosystem Switcher Bar - visível ESTRITAMENTE para desenvolvedores Root da plataforma */}
      {isRootPlatformAdmin && <EcosystemBar />}

      {/* Topbar de Navegação Marketplace (AURA APP - B2C) */}
      <header className="sticky top-0 bg-white/85 backdrop-blur-md border-b border-[#F1EBE7] z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo Aura Estética B2C com Mono-line Fluidity & Interatividade Líquida */}
          <div className="flex items-center gap-3">
            <AuraLogoV3
              size="md"
              variant="app"
              onClick={() => navigate('/app')}
            />

            {/* Localização Atual */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#8E8E8E] bg-[#F9F7F5] px-3 py-1 rounded-full border border-[#F1EBE7] ml-2">
              <MapPin size={12} className="text-[#C5A059]" />
              <span>São Paulo, SP</span>
            </div>
          </div>

          {/* Central Navigation (Desktop) */}
          <div className="hidden md:flex items-center">
            <ConsumerNav />
          </div>

          {/* Área do Usuário & Ações Direitas */}
          <div className="flex items-center gap-3">
            {/* Tag Aura Club / Fidelidade */}
            <button
              onClick={() => navigate('/app/perfil')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#8C6D2D] bg-[#FAF5EB] hover:bg-[#F5ECD7] px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 transition-colors cursor-pointer"
            >
              <Award size={14} className="text-[#C5A059]" />
              <span>Aura Club</span>
            </button>

            {/* Menu Perfil Consumidor */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2.5 bg-white hover:bg-[#F9F7F5] rounded-full border border-[#F1EBE7] shadow-2xs transition-all cursor-pointer"
              >
                <span className="text-xs font-medium text-[#3A3A3A] max-w-[120px] truncate hidden sm:inline-block">
                  {userProfile?.name || 'Cliente Aura'}
                </span>
                <div className="w-8 h-8 rounded-full bg-[#EAD7D1] text-[#3A3A3A] flex items-center justify-center font-bold text-xs shadow-2xs ring-1 ring-[#F1EBE7]">
                  {(userProfile?.name || 'C').charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={14} className="text-[#8E8E8E] mr-1" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-3xl shadow-luminous border border-[#F1EBE7] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-[#F1EBE7]">
                    <p className="text-xs font-bold text-[#3A3A3A] truncate">
                      {userProfile?.name || 'Carolina Silva'}
                    </p>
                    <p className="text-[11px] text-[#8E8E8E] truncate">
                      {userProfile?.email || 'cliente@aura.com'}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-emerald-700 font-semibold">
                      <ShieldCheck size={12} /> Perfil do Consumidor (B2C)
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => handleTabChange('horarios')}
                      className="w-full text-left px-4 py-2 text-xs text-[#3A3A3A] hover:bg-[#F9F7F5] flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Calendar size={14} className="text-[#8E8E8E]" />
                      <span>Meus Agendamentos</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/app/horarios?tab=club');
                        handleTabChange('horarios');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#3A3A3A] hover:bg-[#F9F7F5] flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Award size={14} className="text-[#C5A059]" />
                      <span>Cartão Fidelidade Aura Club</span>
                    </button>
                  </div>

                  {/* Acesso aos outros pilares apenas para desenvolvedor Root da plataforma */}
                  {isRootPlatformAdmin && (
                    <div className="py-1 border-t border-[#F1EBE7] bg-[#F9F7F5]/60">
                      <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8E8E8E]">
                        Cockpit Desenvolvedor Root
                      </div>
                      <button
                        onClick={() => {
                          setActivePillar('business');
                          setCurrentTab('dashboard');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#3A3A3A] font-medium hover:bg-white flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-[#B69D8E]" />
                          <span>Aura Business (Lojista)</span>
                        </div>
                        <ExternalLink size={12} className="text-[#8E8E8E]" />
                      </button>

                      <button
                        onClick={() => {
                          setActivePillar('core');
                          setCurrentTab('superadmin');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#3A3A3A] font-medium hover:bg-white flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Shield size={14} className="text-[#C5A059]" />
                          <span>Aura Control Master</span>
                        </div>
                        <ExternalLink size={12} className="text-[#8E8E8E]" />
                      </button>
                    </div>
                  )}

                  <div className="py-1 border-t border-[#F1EBE7]">
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Sair da Conta</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Dinâmico: Feed Social, Mapa ou Lojas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-12">
        {children}
      </main>

      {/* Bottom Nav (Mobile-First) */}
      <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-auto">
        <ConsumerNav className="shadow-2xl border-aura-border" />
      </div>
    </div>
  );
};
