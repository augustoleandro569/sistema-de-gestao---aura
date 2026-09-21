import React from 'react';
import { Header as BaseHeader } from '../components/layout/Header';
import { useLayout } from './LayoutContext';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { NotificationItem } from '../types';

interface LayoutHeaderProps {
  onOpenNewAppointment?: () => void;
  onOpenSearch?: () => void;
  notifications?: NotificationItem[];
  onMarkAllNotificationsRead?: () => void;
  onNotificationClick?: (notif: NotificationItem) => void;
  userName?: string;
  userRole?: string;
  clinicName?: string;
  avatarUrl?: string;
}

export const Header: React.FC<LayoutHeaderProps> = (props) => {
  const layout = useLayout();
  const { logout, userProfile, userRole, setPortalRoute } = useAuth();
  const isClient = (userProfile?.role || userRole) === 'CLIENT';
  const profile = dataService.getProfile();
  const org = dataService.getOrganization();
  const notifications = props.notifications ?? dataService.getNotifications();

  const handleOpenSearch = props.onOpenSearch ?? layout.openSearch;
  const handleOpenNewAppointment = props.onOpenNewAppointment ?? layout.openNewAppointment;

  const handleNotificationClick =
    props.onNotificationClick ??
    ((notif: NotificationItem) => {
      if (notif.linkAction === 'agenda') {
        layout.setCurrentTab('agenda');
      } else {
        layout.setCurrentTab('dashboard');
      }
    });

  return (
    <BaseHeader
      onOpenMobileMenu={isClient ? undefined : () => layout.setIsMobileMenuOpen(true)}
      onOpenSearch={isClient ? undefined : handleOpenSearch}
      onOpenNewAppointment={isClient ? undefined : handleOpenNewAppointment}
      notifications={notifications}
      onMarkAllNotificationsRead={
        props.onMarkAllNotificationsRead ?? (() => dataService.markAllNotificationsAsRead())
      }
      onNotificationClick={handleNotificationClick}
      userName={props.userName ?? userProfile?.name ?? profile?.name ?? 'Dra. Camila Vasconcelos'}
      userRole={
        props.userRole ??
        (userProfile?.role === 'CLIENT' ? 'Cliente Sublime' : (profile?.roleTitle ?? (profile?.role === 'ADMIN' ? 'Diretora Clínica' : 'Gestora')))
      }
      clinicName={props.clinicName ?? org?.name ?? 'Sublime Estética & Spa'}
      avatarUrl={props.avatarUrl ?? userProfile?.avatar_url ?? profile?.avatarUrl}
      isClient={isClient}
      onNavigateToPortalRoute={(route: string) => {
        setPortalRoute(route);
        layout.setCurrentTab('portal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      onLogout={() => {
        logout();
        layout.setCurrentTab('login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  );
};
