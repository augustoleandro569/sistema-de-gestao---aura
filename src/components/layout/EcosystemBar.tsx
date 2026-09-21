import React from 'react';
import { ShoppingBag, Briefcase, Shield, Sparkles, ChevronRight } from 'lucide-react';
import { useLayout, AuraPillar } from '../../layouts/LayoutContext';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../core/BusinessContext';

interface EcosystemBarProps {
  className?: string;
  condensed?: boolean;
}

export const EcosystemBar: React.FC<EcosystemBarProps> = ({ className = '', condensed = false }) => {
  const { activePillar, setActivePillar, currentTab } = useLayout();
  const { userProfile, userRole } = useAuth();
  const { currentBusiness } = useBusiness();

  const isPlatformAdmin =
    userProfile?.email?.toLowerCase() === 'dev@aura.com.br' ||
    userProfile?.email?.toLowerCase() === 'augusto.leandro569@gmail.com' ||
    userRole === 'PLATFORM_ADMIN' ||
    userRole === 'SUPER_ADMIN' ||
    !!userProfile?.is_root;

  const pillars = [
    {
      id: 'marketplace' as AuraPillar,
      label: 'Aura App',
      tagline: 'Marketplace & Descoberta',
      icon: ShoppingBag,
      badge: 'iFood da Estética',
      activeGradient: 'from-amber-600 to-rose-600 text-white shadow-md shadow-rose-900/20',
      activeBorder: 'border-amber-400/40',
    },
    {
      id: 'business' as AuraPillar,
      label: 'Aura Business',
      tagline: 'SaaS de Gestão da Clínica',
      icon: Briefcase,
      badge: currentBusiness?.name ? currentBusiness.name.split(' ')[0] : 'SaaS',
      activeGradient: 'from-[#2D2725] to-[#4A3E39] text-[#F5EBE1] shadow-md shadow-black/20',
      activeBorder: 'border-[#8F8278]/40',
    },
    {
      id: 'core' as AuraPillar,
      label: 'Aura Core',
      tagline: 'Governança & Rede Root',
      icon: Shield,
      badge: 'Plataforma',
      activeGradient: 'from-rose-600 to-slate-900 text-white shadow-md shadow-rose-900/30',
      activeBorder: 'border-rose-500/40',
      adminOnly: true,
    },
  ];

  const visiblePillars = pillars.filter(p => !p.adminOnly || isPlatformAdmin);

  return (
    <div
      className={`w-full bg-[#181514] text-slate-200 border-b border-[#2D2725] px-3 sm:px-6 py-2 transition-all ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="font-serif italic font-bold text-base text-amber-200 tracking-wider">
              AURA
            </span>
            <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="hidden md:inline-block text-[11px] text-[#A6998E] font-medium">
              Ecossistema Integrado de Beleza & Estética
            </span>
          </div>

          <div className="inline-flex sm:hidden items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-semibold">
            <Sparkles size={11} />
            <span>Rede Ativa</span>
          </div>
        </div>

        {/* Center / Right: 3-Pillar Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#231F1D] border border-[#3A3330] w-full sm:w-auto justify-center">
          {visiblePillars.map((pillar) => {
            const Icon = pillar.icon;
            const isActive = activePillar === pillar.id;

            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActivePillar(pillar.id)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-r ${pillar.activeGradient} border ${pillar.activeBorder}`
                    : 'text-[#A6998E] hover:text-white hover:bg-white/5'
                }`}
                title={`${pillar.label}: ${pillar.tagline}`}
              >
                <Icon size={14} className={isActive ? 'animate-pulse' : 'text-[#8F8278] group-hover:text-white'} />
                <span className="whitespace-nowrap">{pillar.label}</span>
                {pillar.badge && (
                  <span
                    className={`hidden lg:inline-block text-[9px] uppercase px-1.5 py-0.2 rounded font-bold tracking-wider ${
                      isActive
                        ? 'bg-black/30 text-amber-200'
                        : 'bg-white/5 text-[#8F8278] group-hover:text-slate-300'
                    }`}
                  >
                    {pillar.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
