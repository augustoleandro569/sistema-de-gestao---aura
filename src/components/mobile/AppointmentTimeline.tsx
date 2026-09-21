// src/components/mobile/AppointmentTimeline.tsx
import React from 'react';
import { Appointment } from '../../types';
import { dataService } from '../../services/dataService';

export interface TimelineAppointmentItem {
  id: string;
  horaInicio: string;
  horaFim: string;
  cliente: string;
  servico: string;
  profissional: string;
  status: string;
  valor: string | number;
}

export interface AppointmentTimelineProps {
  atendimentos?: (TimelineAppointmentItem | Appointment)[];
  concluidosCount?: number;
  totalCount?: number;
  onNavigateToAgenda?: () => void;
  className?: string;
}

export const AppointmentTimeline: React.FC<AppointmentTimelineProps> = ({
  atendimentos: customAtendimentos,
  concluidosCount,
  totalCount,
  onNavigateToAgenda,
  className = '',
}) => {
  const metrics = dataService.getDashboardMetrics();
  const rawList = customAtendimentos || metrics.todayAppointments || [];

  // Normalize list to ensure expected properties
  const items: TimelineAppointmentItem[] = rawList.map((item) => {
    if ('horaInicio' in item) {
      return item;
    }
    const apt = item as Appointment;
    return {
      id: apt.id,
      horaInicio: apt.startTime,
      horaFim: apt.endTime,
      cliente: apt.clientName,
      servico: apt.serviceName,
      profissional: apt.professionalName,
      status: apt.status === 'finalizado' ? 'Concluído' : apt.status === 'em_atendimento' ? 'Em Atendimento' : apt.status === 'confirmado' ? 'Confirmado' : apt.status,
      valor: apt.finalPrice.toFixed(2),
    };
  });

  const concluidos = concluidosCount ?? metrics.concluidosHoje ?? 2;
  const total = totalCount ?? (metrics.agendamentosHoje || items.length || 6);

  return (
    <section className={`w-full overflow-hidden ${className}`}>
      <header className="px-4 mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-graphite leading-tight font-display">Atendimentos</h2>
          <p className="text-xs text-aesthetic-graphite/60">{concluidos}/{total} concluídos hoje</p>
        </div>
        <button
          type="button"
          onClick={onNavigateToAgenda}
          className="text-xs font-semibold text-rose-700 hover:underline cursor-pointer"
        >
          Ver Agenda →
        </button>
      </header>

      {/* CONTAINER COM ROLAGEM LATERAL */}
      <div className="overflow-x-auto pb-4 scrollbar-hide px-4">
        <div className="flex flex-col gap-3 min-w-[500px]">
          {/* min-w garante que a info não esprema */}

          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white rounded-2xl p-3 border border-aesthetic-bege/30 shadow-sm"
            >
              {/* COLUNA FIXA: HORÁRIO (Visualmente destacada) */}
              <div className="flex flex-col items-center justify-center border-r border-aesthetic-bege/30 pr-4 mr-4 min-w-[70px]">
                <span className="text-sm font-bold text-graphite">{item.horaInicio}</span>
                <span className="text-[10px] text-aesthetic-graphite/50">{item.horaFim}</span>
              </div>

              {/* ÁREA DE CONTEÚDO (Livre para ocupar espaço) */}
              <div className="flex-1 flex items-center justify-between gap-6">
                {/* CLIENTE E SERVIÇO */}
                <div className="min-w-[180px]">
                  <h4 className="text-sm font-bold text-graphite truncate" title={item.cliente}>{item.cliente}</h4>
                  <p className="text-xs text-aesthetic-graphite/70 truncate" title={item.servico}>{item.servico}</p>
                </div>

                {/* PROFISSIONAL */}
                <div className="flex items-center gap-2 min-w-[120px]">
                  <div className="w-6 h-6 rounded-full bg-aesthetic-bege shrink-0" />
                  <span className="text-xs text-aesthetic-graphite/80 truncate" title={item.profissional}>{item.profissional}</span>
                </div>

                {/* STATUS E PREÇO */}
                <div className="flex items-center gap-4 min-w-[150px] justify-end">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 uppercase">
                    {item.status}
                  </span>
                  <span className="text-sm font-bold text-graphite whitespace-nowrap">
                    R$ {typeof item.valor === 'number' ? item.valor.toFixed(2) : item.valor}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="p-6 text-center rounded-2xl bg-white border border-aesthetic-bege/30">
              <p className="text-sm text-graphite font-medium">Nenhum atendimento para hoje</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AppointmentTimeline;
