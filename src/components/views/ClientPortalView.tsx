// src/components/views/ClientPortalView.tsx (VERSÃO PURIFICADA - LUXO SILENCIOSO)
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BookingPage } from '../../pages/client/Booking';
import { LoyaltyCardDisplay } from '../loyalty/LoyaltyCardDisplay';
import { LoyaltyClub } from '../../modules/marketplace/LoyaltyClub';
import { LoginPortal } from '../../pages/auth/LoginPortal';
import { ProfileView } from '../../pages/client/ProfileView';
import { ClientHub } from '../../pages/client/ClientHub';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

export const ClientPortalView: React.FC = () => {
  const {
    userProfile,
    portalRoute,
    setPortalRoute,
  } = useAuth();

  const isHub = !portalRoute || portalRoute === '/portal/hub';

  // Se estiver no Hub, exibe puramente o Hub de 3 Eixos sem nenhuma barra de atalhos ou menus laterais
  if (isHub) {
    return <ClientHub />;
  }

  // Obter título contextual da página atual
  const getContextualTitle = () => {
    switch (portalRoute) {
      case '/portal/agendamento':
        return 'Novo Agendamento';
      case '/portal/fidelidade':
        return 'Programa de Fidelidade Aura Club';
      case '/portal/perfil':
        return 'Meu Perfil & Prontuário';
      case '/portal/cadastro':
        return 'Cadastro de Paciente';
      case '/portal/login':
        return 'Autenticação Segura';
      default:
        return 'Área do Paciente';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Topo Contextual com Retorno ao Hub Central (Clean Desk Policy) */}
      <div className="bg-white rounded-3xl p-4 md:p-5 shadow-xs border border-aesthetic-bege/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPortalRoute('/portal/hub')}
            className="w-10 h-10 rounded-2xl bg-aesthetic-off-white hover:bg-aesthetic-nude/40 text-graphite flex items-center justify-center transition-all cursor-pointer shadow-2xs border border-aesthetic-bege/60 group"
            title="Voltar ao Hub do Paciente"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h2 className="text-base font-serif font-bold text-graphite tracking-tight">
              {getContextualTitle()}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-aesthetic-graphite/60">
                {userProfile?.name || 'Carolina Silva'}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <ShieldCheck size={11} /> Perfil Verificado
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPortalRoute('/portal/hub')}
          className="text-xs font-bold text-rose-700 hover:text-rose-900 tracking-wider uppercase transition-colors px-3 py-1.5 rounded-xl hover:bg-rose-50 cursor-pointer"
        >
          Voltar ao Início
        </button>
      </div>

      {/* Exibição da Página do Portal Selecionada no Hub */}
      <div className="min-h-[500px]">
        {portalRoute === '/portal/login' ? (
          <LoginPortal />
        ) : portalRoute === '/portal/fidelidade' || portalRoute === '/portal/cadastro' ? (
          <LoyaltyClub
            onNavigateToBooking={() => setPortalRoute('/portal/agendamento')}
          />
        ) : portalRoute === '/portal/perfil' ? (
          <ProfileView />
        ) : portalRoute === '/portal/agendamento' ? (
          <BookingPage />
        ) : (
          <ClientHub />
        )}
      </div>
    </div>
  );
};

export default ClientPortalView;
