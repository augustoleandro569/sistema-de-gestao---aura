// src/components/views/DashboardView.tsx (VERSÃO PURIFICADA - LUXO SILENCIOSO)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavItemKey } from '../layout/Sidebar';
import { Dashboard } from '../../pages/admin/Dashboard';
import { useLayout } from '../../layouts/LayoutContext';

interface DashboardViewProps {
  onOpenNewAppointment?: () => void;
  onNavigateToTab?: (tab: NavItemKey) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewAppointment,
  onNavigateToTab,
}) => {
  const navigate = useNavigate();
  const layout = useLayout();

  const handleNavigate = (tab: NavItemKey) => {
    layout.setCurrentTab(tab);
    if (onNavigateToTab) {
      onNavigateToTab(tab);
    }
    navigate(`/business/${tab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Dashboard
      onNavigateToTab={handleNavigate as any}
      onOpenNewAppointment={onOpenNewAppointment || layout.openNewAppointment}
    />
  );
};

export default DashboardView;
