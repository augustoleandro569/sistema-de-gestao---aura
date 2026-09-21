// src/routes/AppGuard.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../core/BusinessContext';
import { useLayout } from '../layouts/LayoutContext';
import { LandingPortal } from '../pages/auth/LandingPortal';
import { BusinessLanding } from '../pages/public/BusinessLanding';
import { ConsumerLayout } from '../layouts/ConsumerLayout';
import { BusinessLayout } from '../layouts/BusinessLayout';
import { SkeletonApp } from '../components/common/SkeletonApp';
import { NotFound404 } from '../components/common/NotFound404';
import { BusinessAccessBarrier } from '../components/common/BusinessAccessBarrier';
import { AuraMarketplace } from '../pages/marketplace/AuraMarketplace';
import { ClientPortalView } from '../components/views/ClientPortalView';
import { ContentsView } from '../components/views/ContentsView';
import { GlobalSearchModal } from '../components/layout/GlobalSearchModal';
import { SocialOnboarding } from '../components/auth/SocialOnboarding';
import { PlatformCockpit } from '../pages/root/PlatformCockpit';
import { dataService } from '../services/dataService';

// SaaS Domain Modules
import { DashboardView } from '../components/views/DashboardView';
import { CadastroView } from '../components/views/CadastroView';
import { ClientsView } from '../components/views/ClientsView';
import { ServicesView } from '../components/views/ServicesView';
import { ProfessionalsView } from '../components/views/ProfessionalsView';
import { ReviewsView } from '../components/views/ReviewsView';
import { ReportsView } from '../components/views/ReportsView';
import { SettingsView } from '../components/views/SettingsView';
import { UserManagement } from '../pages/admin/UserManagement';
import { UnitManagement } from '../pages/admin/UnitManagement';
import { NewAppointmentModal } from '../components/modals/NewAppointmentModal';
import { InventoryModule } from '../modules/inventory/InventoryModule';
import { PricingModule } from '../modules/pricing/PricingModule';
import { FinanceModule } from '../modules/finance/FinanceModule';
import { AppointmentsModule } from '../modules/appointments/AppointmentsModule';
import { WhatsAppModule } from '../modules/whatsapp/WhatsAppModule';
import { MarketingManager } from '../modules/business/MarketingManager';

/**
 * AURA APP LAYOUT: O Universo do Consumidor B2C (Marketplace de Estética)
 * Paleta ultra-clara, mobile-first, navegação no polegar, sem menus laterais de gestão.
 */
export interface AuraAppLayoutProps {
  children?: React.ReactNode;
}

export const AuraAppLayout: React.FC<AuraAppLayoutProps> = ({ children }) => {
  const { userProfile } = useAuth();
  const layout = useLayout();
  const location = useLocation();

  const clients = dataService.getClients();
  const services = dataService.getServices();
  const appointments = dataService.getAppointments();

  const isPerfil =
    location.pathname.includes('/perfil') ||
    location.pathname.includes('/horarios') ||
    layout.currentTab === 'portal';
  const isMapa = location.pathname.includes('/mapa');

  return (
    <ConsumerLayout activeConsumerTab={isPerfil ? 'horarios' : isMapa ? 'mapa' : 'feed'}>
      {children ? (
        children
      ) : isPerfil ? (
        <ClientPortalView />
      ) : layout.currentTab === 'conteudos' ? (
        <ContentsView />
      ) : (
        <AuraMarketplace initialTab={isMapa ? 'nearby' : 'feed'} />
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={layout.isSearchOpen}
        onClose={() => layout.setIsSearchOpen(false)}
        clients={clients}
        services={services}
        appointments={appointments}
        onNavigateToTab={(tab) => {
          layout.setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenNewAppointment={layout.openNewAppointment}
      />

      {/* Cadastro Relâmpago Obrigatório */}
      <SocialOnboarding userProfile={userProfile} />
    </ConsumerLayout>
  );
};

/**
 * AURA BUSINESS LAYOUT: O Universo do Empreendedor B2B (SaaS de Gestão)
 * Focado em produtividade, DRE, estoque, precificação, agenda e controle.
 */
export interface AuraBusinessLayoutProps {
  children?: React.ReactNode;
}

export const AuraBusinessLayout: React.FC<AuraBusinessLayoutProps> = ({ children }) => {
  const { userProfile, userRole } = useAuth();
  const { currentBusiness, setPublicProfileSlug } = useBusiness();
  const layout = useLayout();
  const location = useLocation();
  const navigate = useNavigate();

  const clients = dataService.getClients();
  const services = dataService.getServices();
  const appointments = dataService.getAppointments();

  // Mapeamento de rotas de negócio: /business/:tab
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/business/')) {
      const tabName = path.replace('/business/', '').split('/')[0];
      const validTabs = [
        'dashboard',
        'agenda',
        'clientes',
        'servicos',
        'precificacao',
        'estoque',
        'financeiro',
        'profissionais',
        'avaliacoes',
        'conteudos',
        'automacoes',
        'relatorios',
        'acessos',
        'unidades',
        'configuracoes',
        'vitrine',
        'marketplace',
      ];
      if (validTabs.includes(tabName) && layout.currentTab !== tabName) {
        layout.setCurrentTab(tabName as any);
      }
    }
  }, [location.pathname]);

  return (
    <BusinessLayout>
      {children ? (
        children
      ) : (
        <>
          {layout.currentTab === 'cadastro' && (
            <CadastroView onNavigateToAgenda={() => layout.setCurrentTab('agenda')} />
          )}

          {layout.currentTab === 'dashboard' && (
            <DashboardView
              onOpenNewAppointment={layout.openNewAppointment}
              onNavigateToTab={(tab) => {
                layout.setCurrentTab(tab);
                navigate(`/business/${tab}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {layout.currentTab === 'agenda' && (
            <AppointmentsModule
              onOpenNewAppointment={layout.openNewAppointment}
              onNavigateToCadastro={() => {
                layout.setCurrentTab('cadastro');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {layout.currentTab === 'clientes' && (
            <ClientsView
              onOpenNewAppointment={layout.openNewAppointment}
              onNavigateToCadastro={() => {
                layout.setCurrentTab('cadastro');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {layout.currentTab === 'servicos' && (
            <ServicesView
              onNavigateToPricing={() => {
                layout.setCurrentTab('precificacao');
                navigate('/business/precificacao');
              }}
              onOpenNewAppointment={layout.openNewAppointment}
            />
          )}

          {layout.currentTab === 'precificacao' && <PricingModule />}

          {layout.currentTab === 'estoque' && <InventoryModule />}

          {layout.currentTab === 'financeiro' && <FinanceModule />}

          {layout.currentTab === 'profissionais' && (
            <ProfessionalsView onOpenNewAppointment={layout.openNewAppointment} />
          )}

          {layout.currentTab === 'avaliacoes' && <ReviewsView />}

          {/* A Ponte: Onde a dona da loja gerencia marketing, ROI e publica conteúdos para o feed do consumidor */}
          {layout.currentTab === 'conteudos' && <MarketingManager />}

          {(layout.currentTab === 'automacoes' || layout.currentTab === 'whatsapp') && (
            <WhatsAppModule />
          )}

          {layout.currentTab === 'relatorios' && <ReportsView />}

          {layout.currentTab === 'acessos' &&
            (userRole === 'ADMIN' ||
            userRole === 'MANAGER' ||
            (userRole as any) === 'SUPER_ADMIN' ||
            (userRole as any) === 'PLATFORM_ADMIN' ? (
              <UserManagement />
            ) : (
              <DashboardView
                onOpenNewAppointment={layout.openNewAppointment}
                onNavigateToTab={layout.setCurrentTab}
              />
            ))}

          {layout.currentTab === 'unidades' &&
            (userRole === 'ADMIN' ||
            userRole === 'MANAGER' ||
            (userRole as any) === 'SUPER_ADMIN' ||
            (userRole as any) === 'PLATFORM_ADMIN' ? (
              <UnitManagement />
            ) : (
              <DashboardView
                onOpenNewAppointment={layout.openNewAppointment}
                onNavigateToTab={layout.setCurrentTab}
              />
            ))}

          {layout.currentTab === 'configuracoes' && <SettingsView />}

          {layout.currentTab === 'marketplace' && <AuraMarketplace />}

          {layout.currentTab === 'vitrine' && (
            <BusinessLanding
              businessSlug={currentBusiness.slug}
              onBackToApp={() => layout.setCurrentTab('dashboard')}
            />
          )}
        </>
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={layout.isSearchOpen}
        onClose={() => layout.setIsSearchOpen(false)}
        clients={clients}
        services={services}
        appointments={appointments}
        onNavigateToTab={(tab) => {
          layout.setCurrentTab(tab);
          navigate(`/business/${tab}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenNewAppointment={layout.openNewAppointment}
      />

      {/* Novo Agendamento */}
      <NewAppointmentModal
        isOpen={layout.isNewAppointmentOpen}
        onClose={() => layout.setIsNewAppointmentOpen(false)}
        onSuccess={() => {
          layout.refreshData();
        }}
        onNavigateToCadastro={() => {
          layout.setIsNewAppointmentOpen(false);
          layout.setCurrentTab('cadastro');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Cadastro Relâmpago */}
      <SocialOnboarding userProfile={userProfile} />
    </BusinessLayout>
  );
};

/**
 * APP GUARD: O Guardião de Ambientes (Router Guard)
 * Filtro de Segregação Absoluta:
 * - Se não está logado ➔ Redireciona para /portal/login
 * - Se CLIENT tenta acessar /business/* ou /admin/* ➔ Redireciona para /app/explorar
 * - Se STAFF tenta acessar /app/* ou /marketplace/* ➔ Redireciona para /business/dashboard
 * - Caso contrário ➔ Libera acesso seguro via <Outlet />
 */
export const AppGuard: React.FC = () => {
  const { userProfile, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <SkeletonApp />; // Carregamento elegante

  // 1. Se não está logado, volta para o Portal de Login
  if (!isAuthenticated) {
    return <Navigate to="/portal/login" replace />;
  }

  // 2. SEGREGAÇÃO DE UNIVERSOS
  const role = userProfile?.role || 'CLIENT';
  const isStaff = ['OWNER', 'ADMIN', 'MANAGER', 'PROFESSIONAL', 'RECEPTIONIST'].includes(role);
  const isClient = role === 'CLIENT';

  const pathname = location.pathname;

  // Se o usuário é CLIENTE e tenta entrar em qualquer rota /business ou /admin
  if (isClient && (pathname.startsWith('/business') || pathname.startsWith('/admin'))) {
    console.warn("Acesso negado: Redirecionando Consumidor para o Aura App.");
    return <Navigate to="/app/explorar" replace />;
  }

  // Se o usuário é LOJISTA e tenta entrar no Aura App de consumo
  if (isStaff && (pathname.startsWith('/app') || pathname.startsWith('/marketplace'))) {
    return <Navigate to="/business/dashboard" replace />;
  }

  return <Outlet />;
};
