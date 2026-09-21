// src/components/mobile/AppointmentCard.tsx
import React from 'react';
import { User as UserIcon } from 'lucide-react';
import { Appointment, AppointmentStatus } from '../../types';

export interface AppointmentCardProps {
  data?: Appointment;
  appointment?: Appointment;
  startTime?: string;
  endTime?: string;
  clientName?: string;
  serviceName?: string;
  professionalName?: string;
  finalPrice?: number | string;
  status?: AppointmentStatus | string;
  onStatusChange?: (id: string, newStatus: AppointmentStatus) => void;
  onFinalizar?: () => void;
  onClick?: () => void;
  className?: string;
}

const getStatusColor = (statusStr: string): string => {
  const s = statusStr.toLowerCase().trim();
  if (s === 'em_atendimento' || s === 'em atendimento') {
    return 'bg-amber-100 text-amber-900 border border-amber-300';
  }
  if (s === 'finalizado' || s === 'concluído' || s === 'concluido') {
    return 'bg-emerald-100 text-emerald-900 border border-emerald-300';
  }
  if (s === 'confirmado') {
    return 'bg-blue-100 text-blue-900 border border-blue-300';
  }
  if (s === 'aguardando') {
    return 'bg-purple-100 text-purple-900 border border-purple-300';
  }
  if (s === 'cancelado') {
    return 'bg-rose-100 text-rose-900 border border-rose-300';
  }
  if (s === 'nao_compareceu' || s === 'não compareceu') {
    return 'bg-stone-100 text-stone-800 border border-stone-300';
  }
  return 'bg-stone-100 text-stone-700 border border-stone-200';
};

const getStatusLabel = (statusStr: string): string => {
  const s = statusStr.toLowerCase().trim();
  if (s === 'em_atendimento' || s === 'em atendimento') return 'Em Atendimento';
  if (s === 'finalizado' || s === 'concluído' || s === 'concluido') return 'Concluído';
  if (s === 'confirmado') return 'Confirmado';
  if (s === 'aguardando') return 'Aguardando';
  if (s === 'cancelado') return 'Cancelado';
  if (s === 'nao_compareceu' || s === 'não compareceu') return 'Não Compareceu';
  if (s === 'agendado') return 'Agendado';
  return statusStr;
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  data,
  appointment,
  startTime,
  endTime,
  clientName,
  serviceName,
  professionalName,
  finalPrice,
  status,
  onStatusChange,
  onFinalizar,
  onClick,
  className = '',
}) => {
  const apt = data || appointment;

  const displayClientName = clientName || apt?.clientName || 'Cliente';
  const displayServiceName = serviceName || apt?.serviceName || 'Procedimento Estético';
  const displayProfessionalName = professionalName || apt?.professionalName || 'Profissional';
  const rawStatus = status || apt?.status || 'agendado';
  const statusLabel = getStatusLabel(rawStatus);
  const statusColor = getStatusColor(rawStatus);
  const normalizedStatus = rawStatus.toLowerCase().trim();

  const timeStart = startTime || apt?.startTime || '09:00';
  const timeEnd = endTime || apt?.endTime || '09:40';
  const timeRange = `${timeStart} - ${timeEnd}`;

  const priceValue = finalPrice !== undefined ? finalPrice : apt?.finalPrice ?? 85;
  const priceFormatted =
    typeof priceValue === 'number'
      ? priceValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : priceValue;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 shadow-sm border border-aesthetic-bege/30 mb-4 transition-all active:scale-[0.98] ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* LINHA 1: META INFORMAÇÃO */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-aesthetic-off-white px-2 py-1 rounded-md">
            <span className="text-xs font-bold text-graphite">{timeRange}</span>
          </div>
        </div>
        {/* Status Badge - Posição fixa no topo direito */}
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      {/* LINHA 2: CLIENTE E SERVIÇO */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-graphite truncate" title={displayClientName}>
          {displayClientName}
        </h3>
        <p className="text-sm text-aesthetic-graphite/70 truncate" title={displayServiceName}>
          {displayServiceName}
        </p>
      </div>

      {/* LINHA 3: RODAPÉ DO CARD (Ações e Preço) */}
      <div className="flex justify-between items-center pt-3 border-t border-dashed border-aesthetic-bege/50">
        <div className="flex items-center gap-1.5 text-xs text-aesthetic-graphite/60">
          <UserIcon size={12} />
          <span className="truncate max-w-[100px]" title={displayProfessionalName}>
            {displayProfessionalName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-graphite">R$ {priceFormatted}</span>

          {/* Botão de ação compacto apenas se necessário */}
          {(normalizedStatus === 'em_atendimento' || normalizedStatus === 'em atendimento') && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onFinalizar) {
                  onFinalizar();
                } else if (apt?.id && onStatusChange) {
                  onStatusChange(apt.id, 'finalizado');
                }
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm shadow-emerald-200 transition-all active:scale-95 cursor-pointer"
            >
              Finalizar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
