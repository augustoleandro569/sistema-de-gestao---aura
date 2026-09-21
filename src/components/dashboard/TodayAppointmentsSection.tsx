import React from 'react';
import {
  Clock,
  User,
  Sparkles,
  CheckCircle,
  Play,
  XCircle,
  Check,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '../../types';
import { dataService } from '../../services/dataService';

interface TodayAppointmentsSectionProps {
  appointments: Appointment[];
  onOpenNewAppointment: () => void;
  onNavigateToAgenda: () => void;
}

export const TodayAppointmentsSection: React.FC<TodayAppointmentsSectionProps> = ({
  appointments,
  onOpenNewAppointment,
  onNavigateToAgenda,
}) => {
  const handleStatusChange = (appointmentId: string, newStatus: AppointmentStatus) => {
    dataService.updateAppointmentStatus(appointmentId, newStatus);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'finalizado':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Concluído
          </span>
        );
      case 'em_atendimento':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Em Atendimento
          </span>
        );
      case 'confirmado':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            Confirmado
          </span>
        );
      case 'aguardando':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            Aguardando Recepção
          </span>
        );
      case 'cancelado':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
            Cancelado
          </span>
        );
      case 'nao_compareceu':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-800">
            Não Compareceu
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FAF6F0] text-[#7A6E65] border border-[#E8E1D7]">
            Agendado
          </span>
        );
    }
  };

  return (
    <div id="today-appointments-section" className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EDE7DF] shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F4EFEA]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h3 className="font-display text-lg sm:text-xl font-semibold text-[#2D2725]">
              Atendimentos de Hoje
            </h3>
            <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-[#F2EDE6] text-[#4A423C]">
              Tempo Real
            </span>
          </div>
          <p className="text-xs text-[#8F8278] mt-0.5">
            Fluxo diário de cabines e controle operacional da recepção
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToAgenda}
          className="text-xs font-semibold text-[#B88746] hover:text-[#916730] hover:underline"
        >
          Ver Agenda Completa →
        </button>
      </div>

      {/* Appointments List */}
      <div className="divide-y divide-[#F7F3EE]">
        {appointments.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#8F8278]">
            Nenhum agendamento para hoje ainda. Clique em Novo Agendamento para iniciar.
          </div>
        ) : (
          appointments.map((apt) => (
            <div
              key={apt.id}
              className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#FAF8F5] rounded-xl px-2 transition-colors"
            >
              {/* Time & Service & Client */}
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-14 text-center shrink-0">
                  <span className="text-sm font-bold text-[#2D2725] font-display block">
                    {apt.startTime}
                  </span>
                  <span className="text-[10px] text-[#8F8278] block">{apt.endTime}</span>
                </div>

                <div className="w-1 h-10 rounded-full bg-[#EAE2D8] hidden sm:block shrink-0" />

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className="text-sm font-medium text-graphite truncate max-w-[150px] sm:max-w-[200px]"
                      title={apt.clientName}
                    >
                      {apt.clientName}
                    </h3>
                    <span className="text-xs text-[#8F8278]">• {apt.clientPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#524842] mt-0.5">
                    <span
                      className="font-semibold text-graphite truncate max-w-[150px] sm:max-w-[220px]"
                      title={apt.serviceName}
                    >
                      {apt.serviceName}
                    </span>
                    <span>com</span>
                    <span
                      className="font-medium text-[#9C753B] truncate max-w-[120px]"
                      title={apt.professionalName}
                    >
                      {apt.professionalName}
                    </span>
                    <span>({apt.durationMinutes} min)</span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                <div className="text-right mr-2 hidden sm:block">
                  <span className="text-sm font-bold text-[#2D2725] block">
                    R$ {apt.finalPrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-[#8F8278]">
                    {apt.paymentMethod === 'pix' ? 'PIX' : apt.paymentMethod === 'cartao_credito' ? 'Cartão Crédito' : 'Cartão Débito'}
                  </span>
                </div>

                {getStatusBadge(apt.status)}

                {/* Status action switches */}
                <div className="flex items-center gap-1">
                  {apt.status !== 'em_atendimento' && apt.status !== 'finalizado' && apt.status !== 'cancelado' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(apt.id, 'em_atendimento')}
                      className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors"
                      title="Iniciar Atendimento"
                    >
                      <Play size={15} />
                    </button>
                  )}

                  {apt.status === 'em_atendimento' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(apt.id, 'finalizado')}
                      className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors"
                      title="Finalizar Procedimento"
                    >
                      <CheckCircle size={17} />
                    </button>
                  )}

                  {apt.status !== 'finalizado' && apt.status !== 'cancelado' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(apt.id, 'cancelado')}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      title="Cancelar Agendamento"
                    >
                      <XCircle size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
