// src/pages/marketplace/ConsumerAppointments.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Store,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  CalendarPlus,
  RefreshCw,
  Phone,
  Plus,
  Trophy
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../core/BusinessContext';
import { useLayout } from '../../layouts/LayoutContext';
import { LoyaltyClub } from '../../modules/marketplace/LoyaltyClub';

interface ConsumerAppointmentsProps {
  onNewBookingClick?: () => void;
  onViewClinic?: (businessSlug: string) => void;
}

export const ConsumerAppointments: React.FC<ConsumerAppointmentsProps> = ({
  onNewBookingClick,
  onViewClinic,
}) => {
  const { userProfile } = useAuth();
  const { setPublicProfileSlug } = useBusiness();
  const { setCurrentTab } = useLayout();
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [activeMainTab, setActiveMainTab] = useState<'appointments' | 'loyalty'>(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('tab=club')) {
      return 'loyalty';
    }
    return 'appointments';
  });
  const [version, setVersion] = useState(0);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkTab = () => {
        if (window.location.search.includes('tab=club')) {
          setActiveMainTab('loyalty');
        }
      };
      checkTab();
      window.addEventListener('popstate', checkTab);
      return () => window.removeEventListener('popstate', checkTab);
    }
  }, []);

  const profileId = userProfile?.id || 'user-client-fernanda';

  useEffect(() => {
    const unsub = dataService.subscribe(() => setVersion((v) => v + 1));
    return unsub;
  }, []);

  const allAppointments = useMemo(() => {
    return dataService.getAppointmentsByProfileId(profileId);
  }, [profileId, version]);

  const nowStr = new Date().toISOString().split('T')[0];

  const filteredAppointments = useMemo(() => {
    return allAppointments.filter((apt) => {
      const isPast = apt.date < nowStr || apt.status === 'finalizado';
      if (filterStatus === 'upcoming') {
        return !isPast && apt.status !== 'cancelado';
      }
      if (filterStatus === 'completed') {
        return apt.status === 'finalizado';
      }
      if (filterStatus === 'cancelled') {
        return apt.status === 'cancelado';
      }
      return true;
    });
  }, [allAppointments, filterStatus, nowStr]);

  const upcomingCount = useMemo(() => {
    return allAppointments.filter((a) => a.date >= nowStr && a.status !== 'cancelado' && a.status !== 'finalizado').length;
  }, [allAppointments, nowStr]);

  const completedCount = useMemo(() => {
    return allAppointments.filter((a) => a.status === 'finalizado').length;
  }, [allAppointments]);

  const handleCancel = (id: string, serviceName: string) => {
    if (window.confirm(`Deseja realmente cancelar o agendamento de "${serviceName}"?`)) {
      setCancellingId(id);
      setTimeout(() => {
        dataService.cancelConsumerAppointment(id);
        setCancellingId(null);
        setCancelSuccessMsg('Agendamento cancelado com sucesso.');
        setTimeout(() => setCancelSuccessMsg(null), 4000);
      }, 500);
    }
  };

  const handleViewStore = (slug: string) => {
    if (onViewClinic) {
      onViewClinic(slug);
    } else if (setPublicProfileSlug) {
      setPublicProfileSlug(slug);
      setCurrentTab('vitrine');
    }
  };

  const handleAddToCalendar = (apt: typeof allAppointments[0]) => {
    const title = encodeURIComponent(`${apt.serviceName} - ${apt.businessName}`);
    const details = encodeURIComponent(`Procedimento: ${apt.serviceName}\nProfissional: ${apt.professionalName}\nClínica: ${apt.businessName}\nEndereço: ${apt.businessAddress}`);
    const location = encodeURIComponent(apt.businessAddress || 'Aura Estética');
    const startTimeClean = (apt.startTime || '10:00').replace(':', '') + '00';
    const endTimeClean = (apt.endTime || '11:00').replace(':', '') + '00';
    const dateClean = apt.date.replace(/-/g, '');
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateClean}T${startTimeClean}/${dateClean}T${endTimeClean}&details=${details}&location=${location}`;
    window.open(gCalUrl, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-aura-border pb-6">
        <div>
          <span className="text-[11px] text-aura-taupe font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={13} className="text-aura-gold" />
            {activeMainTab === 'loyalty' ? 'Programa de Recompensas de Luxo' : 'Central Pessoal de Agendamentos'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-aura-charcoal mt-1 font-bold">
            {activeMainTab === 'loyalty' ? 'Aura Club & Fidelidade' : 'Meus Horários'}
          </h1>
          <p className="text-xs text-aura-slate mt-1">
            {activeMainTab === 'loyalty'
              ? 'Acompanhe seus selos digitais e desbloqueie cortesias exclusivas nas melhores clínicas'
              : 'Seus procedimentos agendados e histórico unificado de todas as clínicas da rede Aura'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Subtabs de Navegação */}
          <div className="flex items-center gap-1 bg-white/90 p-1 rounded-full border border-aura-linen shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveMainTab('appointments')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeMainTab === 'appointments'
                  ? 'bg-aura-rose text-aura-charcoal shadow-soft-glow'
                  : 'text-aura-slate hover:text-aura-charcoal'
              }`}
            >
              <Calendar size={13} />
              <span>Horários</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMainTab('loyalty')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeMainTab === 'loyalty'
                  ? 'bg-aura-rose text-aura-charcoal shadow-soft-glow'
                  : 'text-aura-slate hover:text-aura-charcoal'
              }`}
            >
              <Trophy size={13} className={activeMainTab === 'loyalty' ? 'text-[#C26B54]' : 'text-aura-taupe'} />
              <span>Aura Club (10+1)</span>
            </button>
          </div>

          {onNewBookingClick && (
            <button
              onClick={onNewBookingClick}
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-aura-charcoal text-white text-xs font-bold shadow-xs hover:bg-black transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Novo Agendamento</span>
            </button>
          )}
        </div>
      </div>

      {activeMainTab === 'loyalty' ? (
        <LoyaltyClub
          onNavigateToBooking={() => {
            setActiveMainTab('appointments');
            onNewBookingClick?.();
          }}
        />
      ) : (
        <>
          {/* BANNER INFORMATIVO MULTI-CLÍNICA */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-aura-linen shadow-luminous flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-aura-linen flex items-center justify-center text-aura-taupe">
                <Store size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-aura-charcoal">
                  Rede Integrada Multi-Clínica
                </p>
                <p className="text-[11px] text-aura-slate">
                  Seus dados, histórico e horários sincronizados em qualquer clínica Aura participante
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs font-bold">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                {upcomingCount} Próximo{upcomingCount !== 1 ? 's' : ''}
              </span>
              <span className="px-3 py-1 rounded-full bg-aura-linen text-aura-charcoal border border-aura-border">
                {completedCount} Realizado{completedCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

      {/* FEEDBACK DE CANCELAMENTO */}
      {cancelSuccessMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{cancelSuccessMsg}</span>
        </div>
      )}

      {/* FILTRO DE ABAS POR STATUS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterStatus === 'all'
              ? 'bg-aura-rose text-aura-charcoal shadow-soft-glow'
              : 'bg-white text-aura-slate hover:text-aura-charcoal border border-aura-linen'
          }`}
        >
          Todos ({allAppointments.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('upcoming')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterStatus === 'upcoming'
              ? 'bg-aura-rose text-aura-charcoal shadow-soft-glow'
              : 'bg-white text-aura-slate hover:text-aura-charcoal border border-aura-linen'
          }`}
        >
          Próximos ({upcomingCount})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('completed')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterStatus === 'completed'
              ? 'bg-aura-rose text-aura-charcoal shadow-soft-glow'
              : 'bg-white text-aura-slate hover:text-aura-charcoal border border-aura-linen'
          }`}
        >
          Realizados ({completedCount})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('cancelled')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterStatus === 'cancelled'
              ? 'bg-aura-rose text-aura-charcoal shadow-soft-glow'
              : 'bg-white text-aura-slate hover:text-aura-charcoal border border-aura-linen'
          }`}
        >
          Cancelados
        </button>
      </div>

      {/* LISTA DE AGENDAMENTOS */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-aura-linen space-y-4 shadow-luminous">
          <div className="w-16 h-16 rounded-full bg-aura-linen text-aura-taupe mx-auto flex items-center justify-center">
            <Calendar size={28} />
          </div>
          <h3 className="text-lg font-serif font-bold text-aura-charcoal">
            Nenhum agendamento encontrado
          </h3>
          <p className="text-xs text-aura-slate max-w-md mx-auto">
            {filterStatus === 'upcoming'
              ? 'Você não possui nenhum procedimento agendado para os próximos dias.'
              : 'Não há registros nesta categoria no momento.'}
          </p>
          {onNewBookingClick && (
            <button
              onClick={onNewBookingClick}
              type="button"
              className="px-6 py-2.5 rounded-full bg-aura-rose text-aura-charcoal text-xs font-bold shadow-soft-glow hover:brightness-95 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles size={14} />
              <span>Explorar Clínicas &amp; Procedimentos</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => {
            const isCancelled = apt.status === 'cancelado';
            const isCompleted = apt.status === 'finalizado';
            const isUpcoming = !isCancelled && !isCompleted;

            return (
              <div
                key={apt.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-luminous hover:border-aura-taupe/40 ${
                  isCancelled ? 'opacity-65 border-aura-border bg-stone-50/50' : 'border-aura-linen'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* ESQUERDA: CLÍNICA & PROCEDIMENTO */}
                  <div className="space-y-3 flex-1">
                    {/* Badge Clínica */}
                    <div className="flex items-center gap-3">
                      <img
                        src={apt.businessLogo}
                        alt={apt.businessName}
                        className="w-10 h-10 rounded-full object-cover border border-aura-linen shadow-2xs"
                      />
                      <div>
                        <button
                          type="button"
                          onClick={() => handleViewStore(apt.businessSlug)}
                          className="text-xs font-bold text-aura-charcoal hover:text-aura-taupe transition-colors flex items-center gap-1 group text-left cursor-pointer"
                        >
                          <span>{apt.businessName}</span>
                          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <p className="text-[11px] text-aura-slate flex items-center gap-1">
                          <MapPin size={10} className="text-aura-taupe" />
                          <span>{apt.businessAddress}</span>
                        </p>
                      </div>
                    </div>

                    {/* Procedimento e Especialista */}
                    <div>
                      <h3 className="text-base font-serif font-bold text-aura-charcoal">
                        {apt.serviceName}
                      </h3>
                      <p className="text-xs text-aura-taupe mt-0.5">
                        Especialista: <span className="font-semibold text-aura-charcoal">{apt.professionalName}</span>
                      </p>
                    </div>

                    {/* Notas do Agendamento */}
                    {apt.notes && (
                      <p className="text-[11px] text-aura-slate italic bg-aura-linen/60 px-3 py-1.5 rounded-xl border border-aura-border inline-block">
                        &ldquo;{apt.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* DIREITA: DATA, HORÁRIO & STATUS */}
                  <div className="sm:text-right space-y-3 flex flex-col sm:items-end justify-between">
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full w-fit ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isCancelled
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-aura-rose text-aura-charcoal border border-aura-taupe/30 shadow-2xs'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 size={12} /> Realizado
                        </>
                      ) : isCancelled ? (
                        <>
                          <XCircle size={12} /> Cancelado
                        </>
                      ) : (
                        <>
                          <Clock size={12} /> Confirmado
                        </>
                      )}
                    </span>

                    {/* Data & Horário */}
                    <div className="bg-aura-linen/50 px-3 py-1.5 rounded-2xl border border-aura-border text-left sm:text-right">
                      <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold text-aura-charcoal">
                        <Calendar size={13} className="text-aura-taupe" />
                        <span>
                          {new Date(`${apt.date}T00:00:00`).toLocaleDateString('pt-BR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center sm:justify-end gap-1.5 text-[11px] text-aura-slate mt-0.5">
                        <Clock size={11} className="text-aura-taupe" />
                        <span>
                          {apt.startTime} às {apt.endTime} ({apt.durationMinutes} min)
                        </span>
                      </div>
                    </div>

                    {/* Preço */}
                    <div className="text-xs">
                      <span className="text-aura-slate">Valor: </span>
                      <strong className="text-aura-charcoal font-serif text-sm">
                        R$ {Number(apt.finalPrice || apt.originalPrice || 0).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* BARRA DE AÇÕES INFERIOR */}
                <div className="mt-5 pt-4 border-t border-aura-border/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleViewStore(apt.businessSlug)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-aura-charcoal bg-aura-linen hover:bg-aura-border transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Store size={13} className="text-aura-taupe" />
                      <span>Ver Clínica</span>
                    </button>

                    {isUpcoming && (
                      <button
                        type="button"
                        onClick={() => handleAddToCalendar(apt)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold text-aura-charcoal bg-aura-linen hover:bg-aura-border transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <CalendarPlus size={13} className="text-aura-taupe" />
                        <span>Google Agenda</span>
                      </button>
                    )}
                  </div>

                  {isUpcoming && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={cancellingId === apt.id}
                        onClick={() => handleCancel(apt.id, apt.serviceName)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {cancellingId === apt.id ? 'Cancelando...' : 'Cancelar Horário'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      )}
    </div>
  );
};
