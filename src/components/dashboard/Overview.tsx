// src/components/dashboard/Overview.tsx
import React, { useState } from 'react';
import {
  MessageCircle as WhatsAppIcon,
  CheckCircle2,
  Clock,
  User,
  Sparkles,
  ArrowRight,
  Check,
  Play
} from 'lucide-react';
import { Appointment, Client, ReturnStatus, AppointmentStatus } from '../../types';
import { dataService } from '../../services/dataService';

export interface OverviewProps {
  onNavigateToAgenda?: () => void;
  onNavigateToClients?: () => void;
  onOpenNewAppointment?: () => void;
  className?: string;
}

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md';
}

const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md' }) => {
  const [imageError, setImageError] = useState(false);
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const sizeClasses = size === 'sm' ? 'w-9 h-9 text-xs' : 'w-11 h-11 text-sm';

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImageError(true)}
        className={`${sizeClasses} rounded-full object-cover shrink-0 border border-aesthetic-bege/60`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-[#FAF0ED] text-[#B84E3A] font-semibold flex items-center justify-center shrink-0 border border-[#F2D7D1]`}
    >
      {initials || <User size={16} />}
    </div>
  );
};

const Badge: React.FC<{ type: ReturnStatus }> = ({ type }) => {
  switch (type) {
    case 'retorno_hoje':
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          Retorno Hoje
        </span>
      );
    case 'retorno_atrasado':
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          Atrasado
        </span>
      );
    case 'retorno_proximo':
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          Próximo
        </span>
      );
    case 'inativo':
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
          Inativo
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
          Em dia
        </span>
      );
  }
};

const AppointmentStatusBadge: React.FC<{ status: AppointmentStatus }> = ({ status }) => {
  switch (status) {
    case 'finalizado':
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          Concluído
        </span>
      );
    case 'em_atendimento':
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Em Atendimento
        </span>
      );
    case 'confirmado':
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          Confirmado
        </span>
      );
    case 'aguardando':
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
          Aguardando
        </span>
      );
    case 'cancelado':
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-800 border border-red-200">
          Cancelado
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700">
          Agendado
        </span>
      );
  }
};

interface AppointmentRowProps {
  data: Appointment;
  onStatusChange?: (id: string, status: AppointmentStatus) => void;
}

export const AppointmentRow: React.FC<AppointmentRowProps> = ({ data, onStatusChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border border-aesthetic-bege/40 hover:bg-aesthetic-off-white/60 hover:border-aesthetic-bege transition-all">
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="w-11 h-11 rounded-2xl bg-white border border-[#EAE3DA] flex flex-col items-center justify-center shrink-0 shadow-2xs">
          <span className="text-xs font-bold text-graphite font-display">{data.startTime}</span>
          <span className="text-[9px] text-[#8F8278]">{data.endTime}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4
              className="text-sm font-medium text-graphite truncate max-w-[150px] sm:max-w-[200px]"
              title={data.clientName}
            >
              {data.clientName}
            </h4>
            <AppointmentStatusBadge status={data.status} />
          </div>

          <div className="flex items-center gap-2 text-xs text-[#524842] mt-1 truncate">
            <span
              className="font-medium text-graphite truncate max-w-[150px] sm:max-w-[220px]"
              title={data.serviceName}
            >
              {data.serviceName}
            </span>
            <span>•</span>
            <span className="text-[#9C753B] truncate max-w-[120px]" title={data.professionalName}>
              {data.professionalName}
            </span>
            <span className="text-[#8F8278] shrink-0">({data.durationMinutes} min)</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        {data.status === 'confirmado' && onStatusChange && (
          <button
            type="button"
            onClick={() => onStatusChange(data.id, 'em_atendimento')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2D2725] bg-white border border-aesthetic-bege rounded-xl hover:bg-[#FAF8F5] transition-colors"
            title="Iniciar atendimento"
          >
            <Play size={12} className="text-amber-600 fill-amber-600" />
            Iniciar
          </button>
        )}

        {data.status === 'em_atendimento' && onStatusChange && (
          <button
            type="button"
            onClick={() => onStatusChange(data.id, 'finalizado')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
            title="Finalizar atendimento"
          >
            <Check size={13} strokeWidth={2.5} />
            Finalizar
          </button>
        )}

        <span className="text-xs font-bold text-graphite font-display">
          R$ {data.finalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export const Overview: React.FC<OverviewProps> = ({
  onNavigateToAgenda,
  onNavigateToClients,
  onOpenNewAppointment,
  className = '',
}) => {
  const metrics = dataService.getDashboardMetrics();
  const clients = dataService.getClients();

  const atendimentos = (metrics.todayAppointments || []).slice(0, 5);

  // Clientes para retorno ordenados por criticidade
  const clientesRetorno = (clients || [])
    .filter(
      (c) =>
        c.returnStatus === 'retorno_hoje' ||
        c.returnStatus === 'retorno_atrasado' ||
        c.returnStatus === 'retorno_proximo'
    )
    .slice(0, 4);

  const handleStatusChange = (appointmentId: string, newStatus: AppointmentStatus) => {
    dataService.updateAppointmentStatus(appointmentId, newStatus);
  };

  const handleSendWhatsApp = (cliente: Client) => {
    const cleanPhone = (cliente.whatsapp || cliente.phone || '').replace(/\D/g, '');
    const message = `Olá, ${cliente.name}! Aqui é da Sublime Estética. Notamos que está no momento ideal de agendar o seu retorno para manter seus resultados impecáveis. Gostaria de verificar os horários disponíveis esta semana?`;
    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-[1600px] mx-auto px-4 md:px-8 ${className}`}
    >
      {/* COLUNA ESQUERDA: ATENDIMENTOS (7/12) */}
      <section className="lg:col-span-7 flex flex-col gap-4">
        <div className="bg-white rounded-[32px] p-8 shadow-premium border border-aesthetic-bege/20 h-full flex flex-col justify-between">
          <div>
            <header className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-graphite flex items-center gap-2 font-display">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Atendimentos de Hoje
                </h2>
                <p className="text-aesthetic-graphite/60 text-sm">
                  Fluxo diário de cabines e recepção ({metrics.concluidosHoje}/{metrics.agendamentosHoje} concluídos)
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateToAgenda}
                className="text-rose-700 font-medium text-sm hover:underline flex items-center gap-1"
              >
                Ver Agenda Completa →
              </button>
            </header>

            <div className="space-y-4">
              {atendimentos.length > 0 ? (
                atendimentos.map((item) => (
                  <AppointmentRow
                    key={item.id}
                    data={item}
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <div className="p-8 text-center rounded-2xl bg-aesthetic-off-white/50 border border-aesthetic-bege/40">
                  <Clock size={28} className="mx-auto text-[#9C8F85] mb-2" />
                  <p className="text-sm font-medium text-graphite">Nenhum atendimento para hoje</p>
                  <p className="text-xs text-[#8F8278] mt-0.5">
                    Todos os horários estão livres para novos agendamentos
                  </p>
                </div>
              )}
            </div>
          </div>

          {atendimentos.length > 0 && (
            <div className="pt-6 mt-6 border-t border-aesthetic-bege/30 flex items-center justify-between">
              <span className="text-xs text-[#8F8278]">
                {metrics.agendamentosHoje - metrics.concluidosHoje} atendimentos restantes hoje
              </span>
              <span className="text-[11px] font-medium text-rose-700/80">
                Operação diária ativa
              </span>
            </div>
          )}
        </div>
      </section>

      {/* COLUNA DIREITA: CRM & RETORNOS (5/12) */}
      <section className="lg:col-span-5 flex flex-col gap-4">
        <div className="bg-white rounded-[32px] p-8 shadow-premium border border-aesthetic-bege/20 h-full flex flex-col justify-between">
          <div>
            <header className="mb-8">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-semibold text-graphite leading-tight font-display">
                  Gestão de <br /> Retornos & Recorrência
                </h2>
                <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  Automação CRM
                </span>
              </div>
              <p className="text-aesthetic-graphite/60 text-sm mt-2">
                Monitoramento preventivo por serviço ({metrics.clientesParaRetornoCount} clientes no ciclo)
              </p>
            </header>

            <div className="space-y-4">
              {clientesRetorno.length > 0 ? (
                clientesRetorno.map((cliente) => (
                  <div
                    key={cliente.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-2xl hover:bg-aesthetic-off-white transition-colors border border-transparent hover:border-aesthetic-bege/40"
                  >
                    <div className="flex gap-3 min-w-0 items-center flex-1">
                      <Avatar src={cliente.photoUrl} name={cliente.name} />
                      <div className="min-w-0 flex-1">
                        <h4
                          className="font-medium truncate text-graphite text-sm max-w-[150px] sm:max-w-[180px]"
                          title={cliente.name}
                        >
                          {cliente.name}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          Último atendimento • {cliente.lastAppointmentDate || 'Recente'}
                        </p>
                      </div>
                    </div>

                    {/* Ações que se adaptam ao espaço */}
                    <div className="flex flex-row sm:flex-col items-end gap-2 shrink-0 self-end sm:self-center">
                      <Badge type={cliente.returnStatus} />
                      <button
                        type="button"
                        onClick={() => handleSendWhatsApp(cliente)}
                        className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 border border-emerald-200 bg-white px-3 py-1.5 rounded-full hover:bg-emerald-50 transition-colors shadow-2xs"
                        title="Enviar lembrete pelo WhatsApp"
                      >
                        <WhatsAppIcon size={14} className="text-emerald-600" />
                        Lembrete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center rounded-2xl bg-aesthetic-off-white/50 border border-aesthetic-bege/40">
                  <CheckCircle2 size={28} className="mx-auto text-emerald-600 mb-2" />
                  <p className="text-sm font-medium text-graphite">Todos os retornos em dia</p>
                  <p className="text-xs text-[#8F8278] mt-0.5">
                    Nenhum cliente com retorno pendente no momento
                  </p>
                </div>
              )}
            </div>
          </div>

          {onNavigateToClients && (
            <div className="pt-6 mt-6 border-t border-aesthetic-bege/30 flex items-center justify-between">
              <span className="text-xs text-[#8F8278]">Ciclo de recompra inteligente</span>
              <button
                type="button"
                onClick={onNavigateToClients}
                className="text-xs font-semibold text-rose-700 hover:underline flex items-center gap-1"
              >
                Ver todos os clientes →
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Overview;
