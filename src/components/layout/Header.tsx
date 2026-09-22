import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Building2,
  Sparkles,
  LogOut,
  User,
  Shield,
  ExternalLink,
  CalendarCheck,
  Calendar,
  Award,
  Menu,
  Store,
  Globe
} from 'lucide-react';
import { NotificationItem, Unit } from '../../types';
import { dataService } from '../../services/dataService';
import { useBusiness } from '../../core/BusinessContext';
import { useLayout } from '../../layouts/LayoutContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenNewAppointment?: () => void;
  onOpenSearch?: () => void;
  notifications?: NotificationItem[];
  onMarkAllNotificationsRead?: () => void;
  onNotificationClick?: (notif: NotificationItem) => void;
  userName?: string;
  userRole?: string;
  clinicName?: string;
  avatarUrl?: string;
  onOpenMobileMenu?: () => void;
  onLogout?: () => void;
  isClient?: boolean;
  onNavigateToPortalRoute?: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewAppointment,
  onOpenSearch,
  notifications = [],
  onMarkAllNotificationsRead,
  onNotificationClick,
  userName = 'Dra. Camila Vasconcelos',
  userRole = 'Diretora Clínica',
  clinicName = 'Sublime Estética & Spa',
  avatarUrl,
  onOpenMobileMenu,
  onLogout,
  isClient = false,
  onNavigateToPortalRoute,
}) => {
  const { currentBusiness, setPublicProfileSlug, isImpersonating, impersonatedBusiness, exitImpersonate } = useBusiness();
  const { userProfile, userRole: currentAuthRole } = useAuth();
  const layout = useLayout();

  const isPlatformAdmin =
    userProfile?.email?.toLowerCase() === 'dev@aura.com.br' ||
    userProfile?.email?.toLowerCase() === 'augusto.leandro569@gmail.com' ||
    userProfile?.email?.toLowerCase() === 'augustoleandro569@gmail.com' ||
    currentAuthRole === 'PLATFORM_ADMIN' ||
    currentAuthRole === 'SUPER_ADMIN' ||
    !!userProfile?.is_root;
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [unitMenuOpen, setUnitMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const unitRef = useRef<HTMLDivElement>(null);

  const units = dataService.getUnits();
  const activeUnitId = dataService.getActiveUnitId();
  const activeUnit = dataService.getActiveUnit();

  const safeNotifications = notifications || [];
  const unreadCount = safeNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (unitRef.current && !unitRef.current.contains(event.target as Node)) {
        setUnitMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="admin-header"
      className="h-18 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EFE9E2] sticky top-0 z-20 px-4 lg:px-8 flex items-center justify-between transition-all"
    >
      {/* Left Area: Mobile Menu, Unit selector & Global Search trigger */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        {onOpenMobileMenu && (
          <button
            id="mobile-menu-btn"
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-[#5C534D] hover:text-[#2D2725] hover:bg-white border border-[#EAE3DA] shadow-xs"
            title="Abrir Menu"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Unit / Clinic badge selector with Dropdown */}
        <div className="relative hidden md:block" ref={unitRef}>
          <button
            id="unit-selector-btn"
            type="button"
            onClick={() => setUnitMenuOpen(!unitMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 border border-[#EAE3DA] shadow-xs text-xs text-[#3E3834] cursor-pointer hover:bg-white hover:border-[#D6CBC0] transition-all"
            title="Selecionar Unidade Operacional"
          >
            <div className="w-5 h-5 rounded-lg bg-[#FAF6F0] flex items-center justify-center text-[#B88746] border border-[#EAE3DA]/50">
              <Building2 size={13} />
            </div>
            <div className="text-left">
              <span className="font-semibold text-graphite block truncate max-w-[150px]">
                {activeUnit ? activeUnit.name : 'Todas as Unidades'}
              </span>
            </div>
            <ChevronDown size={13} className={`text-[#9C8F85] transition-transform duration-200 ${unitMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {unitMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#EAE3DA] p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-[#F4EFE9]">
                <p className="text-[10px] font-bold text-[#8C7F75] uppercase tracking-wider">Unidade de Atendimento</p>
                <p className="text-xs text-[#5C534D] mt-0.5">Filtre a operação por sede ou veja visão consolidada</p>
              </div>

              <div className="py-1 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    dataService.setActiveUnitId('ALL');
                    setUnitMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    activeUnitId === 'ALL'
                      ? 'bg-[#FAF6F0] text-[#8C6226] font-semibold border border-[#EAE3DA]'
                      : 'text-[#5C534D] hover:bg-[#F9F6F0] hover:text-[#2D2725]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className={activeUnitId === 'ALL' ? 'text-[#B88746]' : 'text-gray-400'} />
                    <span>Visão Consolidada (Todas)</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#EAE3DA]/60 text-[#5C534D]">
                    {units.length} sedes
                  </span>
                </button>

                {units.map((u) => {
                  const isSelected = activeUnitId === u.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        dataService.setActiveUnitId(u.id);
                        setUnitMenuOpen(false);
                      }}
                      className={`w-full flex flex-col text-left px-3 py-2 rounded-xl text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#FAF6F0] text-[#8C6226] font-semibold border border-[#EAE3DA]'
                          : 'text-[#5C534D] hover:bg-[#F9F6F0] hover:text-[#2D2725]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{u.name}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#B88746]" />}
                      </div>
                      <span className="text-[10px] text-gray-400 truncate mt-0.5 font-normal">
                        {u.address}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Global Search Button */}
        {onOpenSearch && (
          <button
            id="global-search-btn"
            type="button"
            onClick={onOpenSearch}
            className="flex items-center justify-between w-full max-w-sm px-3.5 py-2 rounded-xl bg-white border border-[#EAE3DA] text-sm text-[#7D7066] hover:border-[#D6CBC0] hover:text-[#2D2725] transition-all shadow-xs group"
          >
            <div className="flex items-center gap-2.5">
              <Search size={16} className="text-[#A39589] group-hover:text-[#2D2725] transition-colors" />
              <span className="text-xs sm:text-sm">Buscar cliente, serviço, horário...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold text-[#8C7F75] bg-[#F4EFE9] border border-[#DFD6CC] rounded-md">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      {/* Right Area: Vitrine Pública, Notifications, User profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Impersonate Indicator Pill */}
        {isImpersonating && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-900 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="max-w-[140px] truncate">Admin: {currentBusiness.name}</span>
            <button
              type="button"
              onClick={() => {
                exitImpersonate();
                layout.setCurrentTab('superadmin');
              }}
              className="text-[10px] uppercase tracking-wider bg-graphite hover:bg-black text-white px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer"
            >
              Sair
            </button>
          </div>
        )}

        {/* Quick Vitrine Pública CTA */}
        <button
          id="header-vitrine-btn"
          type="button"
          onClick={() => {
            setPublicProfileSlug(currentBusiness.slug);
            layout.setCurrentTab('vitrine');
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-[#EAE3DA] hover:border-[#D6CBC0] text-[#5C534D] hover:text-[#2D2725] text-xs font-semibold shadow-xs transition-all cursor-pointer"
          title={`Abrir vitrine pública em /perfil/${currentBusiness.slug}`}
        >
          <Store size={14} className="text-[#B88746]" />
          <span>Vitrine Pública</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            id="notifications-bell-btn"
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 rounded-xl text-[#5C534D] hover:text-[#2D2725] hover:bg-white border border-transparent hover:border-[#EAE3DA] transition-all focus:outline-none"
            title="Notificações do Sistema"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#D89F95] ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Flyout */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#ECE5DD] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2EDE7]">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-[#2D2725]">Notificações</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FAF0ED] text-[#B35848] rounded-full">
                      {unreadCount} novas
                    </span>
                  )}
                </div>
                {unreadCount > 0 && onMarkAllNotificationsRead && (
                  <button
                    type="button"
                    onClick={onMarkAllNotificationsRead}
                    className="text-xs text-[#9C753B] hover:text-[#7F5E2E] font-medium"
                  >
                    Marcar todas lidas
                  </button>
                )}
              </div>

              <div className="divide-y divide-[#F7F4F0] max-h-80 overflow-y-auto mt-2">
                {safeNotifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#9C8F85]">
                    Nenhuma notificação no momento
                  </div>
                ) : (
                  safeNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (onNotificationClick) {
                          onNotificationClick(notif);
                        }
                        setNotificationsOpen(false);
                      }}
                      className={`p-3 text-left hover:bg-[#FAF8F5] rounded-xl transition-colors cursor-pointer ${
                        !notif.read ? 'bg-[#FDF9F7]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-[#2D2725]">{notif.title}</span>
                        <span className="text-[10px] text-[#A89C92] shrink-0">{notif.createdAt}</span>
                      </div>
                      <p className="text-xs text-[#6B6159] mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            id="user-profile-btn"
            type="button"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-3 p-1 sm:px-2 py-1 rounded-xl hover:bg-white hover:border-[#EAE3DA] border border-transparent transition-all"
          >
            <div className="relative">
              <img
                src={avatarUrl || 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=150&q=80'}
                alt={userName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#EBD5CC]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="hidden sm:block text-left">
              <span className="block text-xs font-semibold text-[#2D2725] tracking-tight">{userName}</span>
              <span className="block text-[11px] text-[#8F8278]">{userRole}</span>
            </div>

            <ChevronDown size={14} className="hidden sm:block text-[#9C8F85]" />
          </button>

          {/* Profile Dropdown */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-[#ECE5DD] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-[#F4EFEA] mb-1">
                <span className="text-xs font-bold text-[#2D2725] block">{userName}</span>
                <span className="text-[11px] text-[#8F8278] block">{clinicName}</span>
                <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF2E6] text-[#9C753B] text-[10px] font-semibold">
                  <Shield size={11} /> {userRole}
                </span>
              </div>

              <div className="space-y-0.5">
                {isClient ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        if (onNavigateToPortalRoute) onNavigateToPortalRoute('/portal/perfil');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#4D443E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      <User size={14} className="text-[#8F8278]" />
                      Meu Perfil
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        if (onNavigateToPortalRoute) onNavigateToPortalRoute('/portal/agendamento');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#4D443E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      <Calendar size={14} className="text-[#8F8278]" />
                      Meus Agendamentos
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        if (onNavigateToPortalRoute) onNavigateToPortalRoute('/portal/fidelidade');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#B88746] hover:bg-[#FDF9F2] transition-colors cursor-pointer"
                    >
                      <Award size={14} />
                      Cartão Fidelidade Aura
                    </button>
                  </>
                ) : (
                  <>
                    {isPlatformAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          layout.setCurrentTab('superadmin');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200"
                      >
                        <Shield size={14} className="text-amber-600" />
                        <span>Controle da Plataforma (Root)</span>
                      </button>
                    )}

                    {isImpersonating && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          exitImpersonate();
                          layout.setCurrentTab('superadmin');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200"
                      >
                        <LogOut size={14} className="text-rose-600" />
                        <span>Encerrar Modo Impersonate</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setPublicProfileSlug(currentBusiness.slug);
                        layout.setCurrentTab('vitrine');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#4D443E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      <Store size={14} className="text-[#8F8278]" />
                      Vitrine Pública (/perfil)
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#4D443E] hover:bg-[#FAF8F5] transition-colors"
                    >
                      <Building2 size={14} className="text-[#8F8278]" />
                      Dados da Clínica & CNPJ
                    </button>
                    <div className="px-3 py-1.5 rounded-lg bg-gray-50 text-[11px] text-gray-500 font-medium flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles size={12} className="text-[#B88746]" />
                        <span>Plano da Unidade</span>
                      </span>
                      <span className="font-bold uppercase text-graphite">{currentBusiness.plan_type}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-2 pt-2 border-t border-[#F4EFEA]">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#A64B3B] hover:bg-[#FCF5F3] transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  Sair do Sistema
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
