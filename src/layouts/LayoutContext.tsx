import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NavItemKey } from '../components/layout/Sidebar';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';

export type AuraPillar = 'marketplace' | 'business' | 'core';

interface LayoutContextType {
  activePillar: AuraPillar;
  setActivePillar: (pillar: AuraPillar) => void;
  currentTab: NavItemKey;
  setCurrentTab: (tab: NavItemKey) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNewAppointmentOpen: boolean;
  setIsNewAppointmentOpen: (open: boolean) => void;
  openNewAppointment: () => void;
  openSearch: () => void;
  unreadNotificationsCount: number;
  clientsToReturnCount: number;
  tick: number;
  refreshData: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userRole, isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavItemKey>(() => (userRole === 'CLIENT' ? 'portal' : 'dashboard'));
  const [activePillar, setActivePillarState] = useState<AuraPillar>(() => {
    // Check if URL or default
    if (
      typeof window !== 'undefined' &&
      (window.location.pathname.startsWith('/app') || window.location.pathname.startsWith('/marketplace'))
    ) {
      return 'marketplace';
    }
    return 'business';
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [tick, setTick] = useState(0);

  const setActivePillar = (pillar: AuraPillar) => {
    setActivePillarState(pillar);
    if (pillar === 'marketplace') {
      setCurrentTab('marketplace');
    } else if (pillar === 'core') {
      setCurrentTab('superadmin');
    } else if (pillar === 'business') {
      if (currentTab === 'marketplace' || currentTab === 'superadmin') {
        setCurrentTab(userRole === 'CLIENT' ? 'portal' : 'dashboard');
      }
    }
  };

  // Sync pillar with currentTab
  useEffect(() => {
    if (currentTab === 'marketplace') {
      setActivePillarState('marketplace');
    } else if (currentTab === 'superadmin') {
      setActivePillarState('core');
    } else {
      setActivePillarState('business');
    }
  }, [currentTab]);

  // Sincroniza a aba ativa quando o perfil de usuário muda (ex: Login como CLIENT)
  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'CLIENT') {
        setCurrentTab((prev) => (prev === 'dashboard' || prev === 'login' ? 'portal' : prev));
      } else {
        setCurrentTab((prev) => (prev === 'portal' || prev === 'login' ? 'dashboard' : prev));
      }
    }
  }, [userRole, isAuthenticated]);

  useEffect(() => {
    const unsubscribe = dataService.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  const notifications = dataService.getNotifications();
  const metrics = dataService.getDashboardMetrics();

  const unreadNotificationsCount = (notifications || []).filter((n) => !n.read).length;
  const clientsToReturnCount = metrics?.clientesParaRetornoCount || 0;

  const openNewAppointment = () => setIsNewAppointmentOpen(true);
  const openSearch = () => setIsSearchOpen(true);
  const refreshData = () => setTick((prev) => prev + 1);

  return (
    <LayoutContext.Provider
      value={{
        activePillar,
        setActivePillar,
        currentTab,
        setCurrentTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isSearchOpen,
        setIsSearchOpen,
        isNewAppointmentOpen,
        setIsNewAppointmentOpen,
        openNewAppointment,
        openSearch,
        unreadNotificationsCount,
        clientsToReturnCount,
        tick,
        refreshData,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    // Fallback safe default context if accessed outside of provider
    const notifications = dataService.getNotifications();
    const metrics = dataService.getDashboardMetrics();
    return {
      activePillar: 'business',
      setActivePillar: () => {},
      currentTab: 'dashboard',
      setCurrentTab: () => {},
      isSidebarCollapsed: false,
      setIsSidebarCollapsed: () => {},
      isMobileMenuOpen: false,
      setIsMobileMenuOpen: () => {},
      isSearchOpen: false,
      setIsSearchOpen: () => {},
      isNewAppointmentOpen: false,
      setIsNewAppointmentOpen: () => {},
      openNewAppointment: () => {},
      openSearch: () => {},
      unreadNotificationsCount: (notifications || []).filter((n) => !n.read).length,
      clientsToReturnCount: metrics?.clientesParaRetornoCount || 0,
      tick: 0,
      refreshData: () => {},
    };
  }
  return context;
};
