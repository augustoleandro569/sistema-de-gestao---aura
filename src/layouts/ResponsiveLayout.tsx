// src/layouts/ResponsiveLayout.tsx
import React from 'react';
import { ConsumerLayout } from './ConsumerLayout';
import { BusinessLayout } from './BusinessLayout';
import { EcosystemBar } from '../components/layout/EcosystemBar';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLayout } from './LayoutContext';

export interface ResponsiveLayoutProps {
  children: React.ReactNode;
  role?: UserRole | string;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children, role }) => {
  const { userRole } = useAuth();
  const { activePillar } = useLayout();
  const effectiveRole = (role || userRole) as string;
  const isClient = effectiveRole === 'CLIENT';

  // 1. ARQUITETURA DUAL ECOSSISTEMA: AURA APP (Consumidor B2C)
  // Clientes e modo Marketplace operam exclusivamente no ConsumerLayout
  if (activePillar === 'marketplace' || isClient) {
    return <ConsumerLayout>{children}</ConsumerLayout>;
  }

  // 2. ARQUITETURA DUAL ECOSSISTEMA: AURA BUSINESS (Lojista B2B)
  // Gestão de clínica, estoque, DRE, agenda e precificação
  if (activePillar === 'business') {
    return <BusinessLayout>{children}</BusinessLayout>;
  }

  // 3. AURA CORE (Platform Control Master / Super Admin)
  return (
    <div className="min-h-screen bg-[#0F1115] text-slate-300 flex flex-col font-sans">
      <EcosystemBar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
