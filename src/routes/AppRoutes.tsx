// src/routes/AppRoutes.tsx (RESTRUTURAÇÃO TOTAL - PURGA DE ROTAS & CONVERGÊNCIA AO MARKETPLACE)
import React from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../core/BusinessContext';
import { AuraAppLayout, AuraBusinessLayout } from './AppGuard';
import { LandingPortal } from '../pages/auth/LandingPortal';
import { AuraConsumerGateway } from '../pages/auth/AuraConsumerGateway';
import { Gateway } from '../pages/public/Gateway';
import { BusinessLanding } from '../pages/public/BusinessLanding';
import { AuraHome } from '../pages/public/AuraHome';
import { AuraLandingPage } from '../pages/public/AuraLandingPage';
import { ConsumerHome } from '../pages/public/ConsumerHome';
import { BusinessSales } from '../pages/public/BusinessSales';
import { PartnerRegistration } from '../pages/public/PartnerRegistration';
import { PartnerOnboarding } from '../pages/public/PartnerOnboarding';
import { PlatformCockpit } from '../pages/root/PlatformCockpit';

// O Universo do Consumidor (Aura App - Marketplace)
import { ClientHub } from '../pages/client/ClientHub';
import { ExploreFeed } from '../modules/marketplace/ExploreFeed';
import { SocialFeed } from '../modules/marketplace/SocialFeed';
import { NearbyMap } from '../modules/marketplace/NearbyMap';
import { LoyaltyProfile } from '../modules/marketplace/LoyaltyProfile';

// O Universo do Empreendedor (Aura Business - Gestão)
import { DashboardView as DashboardDRE } from '../components/views/DashboardView';
import { InventoryModule as InventoryManagement } from '../modules/inventory/InventoryModule';
import { AppointmentsModule } from '../modules/appointments/AppointmentsModule';
import { FinanceModule } from '../modules/finance/FinanceModule';
import { PricingModule } from '../modules/pricing/PricingModule';
import { WhatsAppModule } from '../modules/whatsapp/WhatsAppModule';
import { MarketingManager } from '../modules/business/MarketingManager';
import { ClientsView } from '../components/views/ClientsView';
import { ServicesView } from '../components/views/ServicesView';
import { ProfessionalsView } from '../components/views/ProfessionalsView';
import { ReviewsView } from '../components/views/ReviewsView';
import { ReportsView } from '../components/views/ReportsView';
import { SettingsView } from '../components/views/SettingsView';
import { UserManagement } from '../pages/admin/UserManagement';
import { UnitManagement } from '../pages/admin/UnitManagement';
import { SkeletonApp } from '../components/common/SkeletonApp';

/**
 * Wrapper para Vitrine Pública via Slug (/perfil/:slug)
 */
const BusinessLandingWrapper: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  return (
    <BusinessLanding
      businessSlug={slug}
      onBackToApp={() => navigate('/app/explorar')}
    />
  );
};

export const AppRoutes: React.FC = () => {
  const { userProfile, isAuthenticated, loading } = useAuth();
  const { publicProfileSlug, setPublicProfileSlug } = useBusiness();

  if (loading) return <SkeletonApp />;

  // 1. GATEWAY DE ENTRADA (AuraHome: A Nova Landing Page de Conversão & Portal de Acesso)
  if (!isAuthenticated) {
    if (publicProfileSlug) {
      return (
        <BusinessLanding
          businessSlug={publicProfileSlug}
          onBackToApp={() => setPublicProfileSlug(null)}
        />
      );
    }
    return (
      <Routes>
        <Route path="/perfil/:slug" element={<BusinessLandingWrapper />} />
        <Route path="/gateway" element={<Gateway />} />
        <Route path="/login" element={<Gateway />} />
        <Route path="/portal" element={<Gateway />} />
        <Route path="/consumidor" element={<AuraConsumerGateway />} />
        <Route path="/business" element={<BusinessSales />} />
        <Route path="/business/sales" element={<BusinessSales />} />
        <Route path="/negocios" element={<BusinessSales />} />
        <Route path="/seja-um-parceiro" element={<PartnerOnboarding />} />
        <Route path="/parceiro" element={<PartnerOnboarding />} />
        <Route path="/cadastro-parceiro" element={<PartnerOnboarding />} />
        <Route path="/onboarding-parceiro" element={<PartnerOnboarding />} />
        <Route path="/business/cadastro" element={<PartnerOnboarding />} />
        <Route path="/home" element={<Gateway />} />
        <Route path="/landing" element={<AuraLandingPage />} />
        <Route path="/" element={<Gateway />} />
        <Route path="*" element={<Gateway />} />
      </Routes>
    );
  }

  // 2. ROOT / PLATFORM ADMIN (Cockpit Master)
  if (userProfile?.role === 'PLATFORM_ADMIN') {
    return (
      <Routes>
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-[#0F1115] text-slate-300 flex flex-col font-sans">
              <PlatformCockpit />
            </div>
          }
        />
      </Routes>
    );
  }

  // 3. SEPARAÇÃO DE UNIVERSOS (SEM SOBREPOSIÇÃO)

  // 🎨 UNIVERSO CONSUMIDOR (AURA APP - Marketplace)
  if (userProfile?.role === 'CLIENT') {
    return (
      <AuraAppLayout>
        <Routes>
          {/* O HUB dos 3 Containers (Novo Agendamento, Conteúdos & Dicas, Meu Perfil) */}
          <Route index element={<ClientHub />} />
          <Route path="/" element={<ClientHub />} />
          <Route path="/app" element={<ClientHub />} />
          <Route path="/hub" element={<ClientHub />} />
          <Route path="/portal/hub" element={<ClientHub />} />

          {/* Aba 1: O Feed Social Luminous Luxury */}
          <Route path="explorar" element={<SocialFeed />} />
          <Route path="/app/explorar" element={<SocialFeed />} />
          <Route path="/app/feed" element={<SocialFeed />} />
          <Route path="/marketplace" element={<Navigate to="/app/explorar" replace />} />
          <Route path="/marketplace/feed" element={<Navigate to="/app/explorar" replace />} />

          {/* Aba 2: O Mapa de clínicas */}
          <Route path="mapa" element={<NearbyMap />} />
          <Route path="/app/mapa" element={<NearbyMap />} />
          <Route path="/app/clinicas" element={<Navigate to="/app/mapa" replace />} />

          {/* Aba 3: Fidelidade Aura Club e Dados */}
          <Route path="perfil" element={<LoyaltyProfile />} />
          <Route path="/app/perfil" element={<LoyaltyProfile />} />
          <Route path="/app/horarios" element={<LoyaltyProfile />} />
          <Route path="/portal" element={<Navigate to="/app/perfil" replace />} />
          <Route path="/portal/*" element={<Navigate to="/app/perfil" replace />} />

          {/* Fallback do Consumidor para o Hub */}
          <Route path="*" element={<ClientHub />} />
        </Routes>
      </AuraAppLayout>
    );
  }

  // 🏢 UNIVERSO EMPREENDEDOR (AURA BUSINESS - Gestão)
  return (
    <AuraBusinessLayout>
      <Routes>
        <Route index element={<DashboardDRE />} />
        <Route path="/" element={<DashboardDRE />} />
        <Route path="dashboard" element={<DashboardDRE />} />
        <Route path="/business" element={<Navigate to="/business/dashboard" replace />} />
        <Route path="/business/dashboard" element={<DashboardDRE />} />

        <Route path="estoque" element={<InventoryManagement />} />
        <Route path="/business/estoque" element={<InventoryManagement />} />

        <Route path="agenda" element={<AppointmentsModule />} />
        <Route path="agendamentos" element={<AppointmentsModule />} />
        <Route path="/business/agenda" element={<AppointmentsModule />} />
        <Route path="/business/agendamentos" element={<AppointmentsModule />} />

        <Route path="financeiro" element={<FinanceModule />} />
        <Route path="/business/financeiro" element={<FinanceModule />} />

        <Route path="precificacao" element={<PricingModule />} />
        <Route path="/business/precificacao" element={<PricingModule />} />

        <Route path="whatsapp" element={<WhatsAppModule />} />
        <Route path="/business/whatsapp" element={<WhatsAppModule />} />
        <Route path="/business/automacoes" element={<WhatsAppModule />} />

        <Route path="marketing" element={<MarketingManager />} />
        <Route path="/business/marketing" element={<MarketingManager />} />
        <Route path="/business/conteudos" element={<MarketingManager />} />

        <Route path="clientes" element={<ClientsView />} />
        <Route path="/business/clientes" element={<ClientsView />} />

        <Route path="servicos" element={<ServicesView />} />
        <Route path="/business/servicos" element={<ServicesView />} />

        <Route path="profissionais" element={<ProfessionalsView />} />
        <Route path="/business/profissionais" element={<ProfessionalsView />} />

        <Route path="avaliacoes" element={<ReviewsView />} />
        <Route path="/business/avaliacoes" element={<ReviewsView />} />

        <Route path="relatorios" element={<ReportsView />} />
        <Route path="/business/relatorios" element={<ReportsView />} />

        <Route path="configuracoes" element={<SettingsView />} />
        <Route path="/business/configuracoes" element={<SettingsView />} />

        <Route path="usuarios" element={<UserManagement />} />
        <Route path="/business/usuarios" element={<UserManagement />} />
        <Route path="/business/acessos" element={<UserManagement />} />

        <Route path="unidades" element={<UnitManagement />} />
        <Route path="/business/unidades" element={<UnitManagement />} />

        <Route path="marketplace" element={<Navigate to="/app/explorar" replace />} />
        <Route path="/marketplace" element={<Navigate to="/app/explorar" replace />} />

        {/* Bloqueio de rotas do consumidor no ambiente empreendedor */}
        <Route path="/app/*" element={<Navigate to="/business/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/business/dashboard" replace />} />
      </Routes>
    </AuraBusinessLayout>
  );
};

export default AppRoutes;
