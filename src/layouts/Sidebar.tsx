import React from 'react';
import { Sidebar as BaseSidebar, NavItemKey } from '../components/layout/Sidebar';
import { useLayout } from './LayoutContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface LayoutSidebarProps {
  currentTab?: NavItemKey;
  onSelectTab?: (tab: NavItemKey) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  unreadNotificationsCount?: number;
  clientsToReturnCount?: number;
  role?: UserRole | string;
}

export const Sidebar: React.FC<LayoutSidebarProps> = (props) => {
  const layout = useLayout();
  const { userRole } = useAuth();

  const currentTab = props.currentTab ?? layout.currentTab;
  const onSelectTab = props.onSelectTab ?? layout.setCurrentTab;
  const collapsed = props.collapsed ?? layout.isSidebarCollapsed;
  const onToggleCollapse = props.onToggleCollapse ?? (() => layout.setIsSidebarCollapsed((prev) => !prev));
  const unreadNotificationsCount = props.unreadNotificationsCount ?? layout.unreadNotificationsCount;
  const clientsToReturnCount = props.clientsToReturnCount ?? layout.clientsToReturnCount;
  const role = props.role ?? userRole;

  return (
    <div className="h-full w-full">
      <BaseSidebar
        role={role}
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
        unreadNotificationsCount={unreadNotificationsCount}
        clientsToReturnCount={clientsToReturnCount}
        isMobileOpen={layout.isMobileMenuOpen}
        onCloseMobile={() => layout.setIsMobileMenuOpen(false)}
        onOpenNewAppointment={layout.openNewAppointment}
      />
    </div>
  );
};
