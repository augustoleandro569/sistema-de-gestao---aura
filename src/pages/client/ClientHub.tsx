// src/pages/client/ClientHub.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Sparkles, Gift, ArrowRight, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLayout } from '../../layouts/LayoutContext';

export interface ClientHubProps {
  user?: {
    name: string;
    avatar_url?: string;
    avatarUrl?: string;
  };
  userName?: string;
  userAvatar?: string;
  onNavigateToBooking?: () => void;
  onNavigateToContents?: () => void;
  onNavigateToProfile?: () => void;
}

interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  primary?: boolean;
  onClick: () => void;
  badge?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  subtitle,
  icon,
  primary,
  onClick,
  badge,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-8 sm:p-10 rounded-[40px] sm:rounded-[48px] border transition-all duration-300 group cursor-pointer flex flex-col justify-between min-h-[220px] sm:min-h-[240px] overflow-hidden ${
        primary
          ? 'bg-aura-charcoal text-white border-aura-charcoal shadow-2xl hover:scale-[1.01]'
          : 'bg-white text-aura-charcoal border-aura-linen shadow-sm hover:shadow-xl hover:border-aura-rose/40 hover:scale-[1.01]'
      }`}
    >
      {primary && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-aura-rose/10 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="flex items-start justify-between relative z-10">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs ${
            primary
              ? 'bg-white/10 text-aura-rose'
              : 'bg-aura-pearl text-aura-charcoal border border-aura-linen'
          }`}
        >
          {icon}
        </div>

        {badge && (
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
              primary
                ? 'bg-white/15 text-aura-rose border border-white/20'
                : 'bg-aura-pearl text-aura-charcoal border border-aura-linen'
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="space-y-2 relative z-10 mt-6">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
          {title}
        </h3>
        <p
          className={`text-xs sm:text-sm leading-relaxed ${
            primary ? 'text-aura-linen/80' : 'text-aura-taupe'
          }`}
        >
          {subtitle}
        </p>
      </div>

      <div className="pt-4 flex items-center gap-2 relative z-10">
        <span
          className={`text-xs font-bold uppercase tracking-widest group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-2 ${
            primary ? 'text-aura-rose' : 'text-aura-charcoal'
          }`}
        >
          <span>Acessar</span>
          <ArrowRight size={14} />
        </span>
      </div>
    </div>
  );
};

export const ClientHub: React.FC<ClientHubProps> = ({
  user,
  userName,
  userAvatar,
  onNavigateToBooking,
  onNavigateToContents,
  onNavigateToProfile,
}) => {
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();
  let layout: ReturnType<typeof useLayout> | null = null;
  try {
    layout = useLayout();
  } catch {
    // optional layout context
  }

  const currentUser = user || {
    name: userName || userProfile?.name || 'Augusto Leandro',
    avatar_url: userAvatar || userProfile?.avatar_url || userProfile?.avatarUrl,
  };

  const firstName = (currentUser.name || 'Cliente').split(' ')[0];

  const handleBooking = () => {
    if (onNavigateToBooking) {
      onNavigateToBooking();
    } else {
      if (layout?.setCurrentTab) layout.setCurrentTab('marketplace');
      navigate('/app/mapa');
    }
  };

  const handleContents = () => {
    if (onNavigateToContents) {
      onNavigateToContents();
    } else {
      if (layout?.setCurrentTab) layout.setCurrentTab('marketplace');
      navigate('/app/explorar');
    }
  };

  const handleProfile = () => {
    if (onNavigateToProfile) {
      onNavigateToProfile();
    } else {
      if (layout?.setCurrentTab) layout.setCurrentTab('portal');
      navigate('/app/perfil');
    }
  };

  return (
    <div className="bg-aura-pearl min-h-screen p-6 sm:p-10 md:p-14 selection:bg-aura-rose selection:text-aura-charcoal font-sans pb-32">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* HEADER LIMPO "LUMINOUS LUXURY" */}
        <header className="flex justify-between items-center pb-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif text-aura-charcoal tracking-tight font-normal">
              Sua <span className="font-bold">Aura</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-aura-taupe font-bold uppercase tracking-[0.25em] mt-1">
              Olá, {firstName} • Concierge Digital Ativa
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={logout}
              className="text-[10px] font-bold text-aura-taupe hover:text-aura-charcoal uppercase tracking-widest px-3 py-1.5 rounded-full hover:bg-white/60 transition-all cursor-pointer"
            >
              Sair
            </button>
            <button
              type="button"
              onClick={handleProfile}
              className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-aura-linen flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all group"
              title="Meu Perfil Aura Club"
            >
              <User size={20} className="text-aura-rose group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </header>

        {/* HUB DE AÇÃO RÁPIDA - TRIÂNGULO DE VALOR */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Agendar Momento (Primary) */}
          <ActionCard
            title="Agendar Momento"
            subtitle="Explorar o mapa por geolocalização e reservar horários em tempo real."
            icon={<Calendar size={26} />}
            primary
            badge="Geolocalização"
            onClick={handleBooking}
          />

          {/* Card 2: Inspirar (Social Feed) */}
          <ActionCard
            title="Inspirar"
            subtitle="Revista digital de estética com antes/depois e dicas das clínicas que você segue."
            icon={<Sparkles size={26} />}
            badge="Revista Digital"
            onClick={handleContents}
          />

          {/* Card 3: Meu Aura Club (Fidelidade) */}
          <ActionCard
            title="Meu Aura Club"
            subtitle="Cartão fidelidade 10+1 que acumula selos auditados a cada atendimento concluído."
            icon={<Gift size={26} />}
            badge="7 de 10 Selos"
            onClick={handleProfile}
          />
        </main>
      </div>
    </div>
  );
};

export default ClientHub;
