// src/pages/admin/Dashboard.tsx (VERSÃO PURIFICADA - LUXO SILENCIOSO)
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Calendar,
  Users,
  Star,
  DollarSign,
  UserCheck,
  Award,
  Sparkles,
  ArrowRight,
  X,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { StatCard } from '../../components/dashboard/StatGrid';
import { RevenueChart } from '../../components/dashboard/RevenueChart';
import { Overview } from '../../components/dashboard/Overview';
import { ServicesPerformanceSection } from '../../components/dashboard/ServicesPerformanceSection';
import { CustomerSatisfactionWidget } from '../../components/dashboard/CustomerSatisfactionWidget';
import { useBusiness } from '../../core/BusinessContext';
import { UpgradeModal } from '../../components/modals/UpgradeModal';

import { NavItemKey } from '../../components/layout/Sidebar';

export interface DashboardProps {
  onNavigateToTab?: (tab: NavItemKey | string) => void;
  onOpenNewAppointment?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateToTab = (_tab: NavItemKey | string) => {},
  onOpenNewAppointment,
}) => {
  const { currentBusiness } = useBusiness();
  const activeUnit = dataService.getActiveUnit();
  const metrics = dataService.getDashboardMetrics();
  const reviews = dataService.getReviews();

  const [welcomeData, setWelcomeData] = useState<{
    businessName: string;
    promptUpsell: boolean;
  } | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('aura_new_partner_onboarding');
      if (stored) {
        const parsed = JSON.parse(stored);
        setWelcomeData(parsed);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const dismissWelcome = () => {
    try {
      localStorage.removeItem('aura_new_partner_onboarding');
    } catch (e) {
      console.error(e);
    }
    setWelcomeData(null);
  };

  const unitName = activeUnit?.name || 'Unidade Jardins';

  // Faturamento hoje formatado
  const faturamentoHojeFormatted = (metrics.faturamentoHoje || 2840).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div id="admin-dashboard-purified" className="space-y-10 p-4 sm:p-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      {/* BANNER DE BOAS-VINDAS E UPSELL ESTRATÉGICO PARA NOVO PARCEIRO */}
      {welcomeData && (
        <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-aura-charcoal via-[#1C1E24] to-[#121316] text-white border border-aura-linen/20 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 right-0 w-80 h-80 bg-aura-rose/10 rounded-full blur-3xl pointer-events-none" />
          
          <button
            onClick={dismissWelcome}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Dispensar aviso"
          >
            <X size={16} />
          </button>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-widest text-aura-rose">
              <Sparkles size={12} />
              <span>Clínica Provisionada com Sucesso</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Boas-vindas ao Aura Business, {welcomeData.businessName || currentBusiness?.name}!
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sua conta master foi ativada e seus módulos essenciais de <strong>Agenda</strong> e <strong>Precificação</strong> já estão provisionados. Para liberar o <strong>DRE Financeiro em Tempo Real</strong>, <strong>Estoque com Custo por Procedimento</strong> e o <strong>Branding White-label</strong>, ative o pacote de autoridade.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="px-6 py-3 rounded-full bg-white hover:bg-aura-rose hover:text-white text-aura-charcoal font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <span>CONFIGURAR MÓDULOS PRO &amp; DRE</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={dismissWelcome}
                className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white/80 text-xs font-semibold tracking-wider transition-colors cursor-pointer"
              >
                Continuar para a Operação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER PURIFICADO: Apenas identidade e contexto, sem poluição de botões rápidos */}
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2 border-b border-aesthetic-bege/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#9C753B] bg-[#FAF6F0] px-3 py-1 rounded-full border border-[#EBDDCF]">
              <Sparkles size={11} className="text-[#B88746]" />
              Business Intelligence &amp; Gestão
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-graphite tracking-tight">
            Visão Executiva
          </h1>
          <p className="text-sm text-aesthetic-graphite/60 mt-1">
            Desempenho consolidado da {unitName}
          </p>
        </div>
        {/* Mantemos apenas o seletor de unidade e busca global no Header superior */}
      </header>

      {/* MÉTRICAS PURAS - Sem botões de "Novo" no meio do caminho */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          id="stat-faturamento-hoje"
          title="Faturamento Hoje"
          value={faturamentoHojeFormatted}
          subtitle="Receita bruta confirmada no dia"
          icon={DollarSign}
          highlightColor="#B88746"
          trend={{ value: '+14.2%', isPositive: true }}
          onClick={() => onNavigateToTab('financeiro')}
        />
        <StatCard
          id="stat-ocupacao-agenda"
          title="Ocupação de Agenda"
          value="85%"
          subtitle={`${metrics.concluidosHoje} de ${metrics.agendamentosHoje} atendimentos realizados`}
          icon={Calendar}
          highlightColor="#2D2725"
          onClick={() => onNavigateToTab('agenda')}
        />
        <StatCard
          id="stat-novos-clientes"
          title="Novos Clientes"
          value="12"
          subtitle={`${metrics.clientesAtivos} pacientes no cadastro ativo`}
          icon={Users}
          highlightColor="#2D2725"
          trend={{ value: '+8.0%', isPositive: true }}
          onClick={() => onNavigateToTab('clientes')}
        />
        <StatCard
          id="stat-nps-medio"
          title="NPS Médio"
          value="9.8"
          subtitle={`Satisfação de ${metrics.avgRating} estrelas`}
          icon={Star}
          highlightColor="#B88746"
          trend={{ value: '+0.4 pts', isPositive: true }}
          onClick={() => onNavigateToTab('avaliacoes')}
        />
      </div>

      {/* 2. Charts Section: Faturamento & Atendimentos */}
      <section>
        <RevenueChart />
      </section>

      {/* 3. Split: Atendimentos de Hoje + Retornos de Clientes (Overview Bento) */}
      <section>
        <Overview
          className="!px-0"
          onOpenNewAppointment={onOpenNewAppointment}
          onNavigateToAgenda={() => onNavigateToTab('agenda')}
          onNavigateToClients={() => onNavigateToTab('clientes')}
        />
      </section>

      {/* 4. Desempenho dos Serviços */}
      <section>
        <ServicesPerformanceSection />
      </section>

      {/* 5. Satisfação dos Clientes & NPS */}
      <section>
        <CustomerSatisfactionWidget
          reviews={reviews}
          avgRating={metrics.avgRating}
          nps={metrics.nps}
        />
      </section>

      {/* MODAL DE UPGRADE / CONFIGURAÇÃO DE MÓDULOS */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        initialPlanSlug="pro"
      />
    </div>
  );
};

export default Dashboard;
