// src/components/views/DashboardView.tsx (VERSÃO PURIFICADA - LUXO SILENCIOSO)
import React from 'react';
import { NavItemKey } from '../layout/Sidebar';
import { Dashboard } from '../../pages/admin/Dashboard';

interface DashboardViewProps {
  onOpenNewAppointment?: () => void;
  onNavigateToTab: (tab: NavItemKey) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewAppointment,
  onNavigateToTab,
}) => {
  return (
    <Dashboard
      onNavigateToTab={onNavigateToTab as any}
      onOpenNewAppointment={onOpenNewAppointment}
    />
  );
};

export default DashboardView;
