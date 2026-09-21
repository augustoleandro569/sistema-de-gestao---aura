import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Clock,
  User,
  Sparkles,
  CheckCircle,
  Play,
  XCircle,
  List,
  Columns,
  Grid,
  UserPlus
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { AppointmentStatus } from '../../types';
import { getTodayDateString } from '../../data/mockDatabase';
import { AppointmentCard } from '../mobile/AppointmentCard';

interface AgendaViewProps {
  onOpenNewAppointment: () => void;
  onNavigateToCadastro?: () => void;
}

type AgendaViewMode = 'dia' | 'semana' | 'lista';

export const AgendaView: React.FC<AgendaViewProps> = ({
  onOpenNewAppointment,
  onNavigateToCadastro,
}) => {
  const [viewMode, setViewMode] = useState<AgendaViewMode>('dia');
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [selectedProfessional, setSelectedProfessional] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedUnit, setSelectedUnit] = useState<string>(dataService.getActiveUnitId() || 'todos');

  const appointments = dataService.getAppointments();
  const professionals = dataService.getProfessionals();
  const units = dataService.getUnits();

  const filteredAppointments = useMemo(() => {
    return (appointments || []).filter((apt) => {
      const matchDate = viewMode === 'dia' ? apt.date === selectedDate : true;
      const matchProf = selectedProfessional === 'todos' ? true : apt.professionalId === selectedProfessional;
      const matchStatus = selectedStatus === 'todos' ? true : apt.status === selectedStatus;
      const matchUnit = selectedUnit === 'todos' || selectedUnit === 'ALL' ? true : (apt.unitId === selectedUnit || apt.unit_id === selectedUnit);
      return matchDate && matchProf && matchStatus && matchUnit;
    });
  }, [appointments, selectedDate, selectedProfessional, selectedStatus, selectedUnit, viewMode]);

  // Available hourly slots for Day view
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  return (
    <div id="agenda-view" className="space-y-6 pb-16">
      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EDE7DF] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D2725] text-[#F3E7DC] flex items-center justify-center">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2D2725]">
              Agenda da Clínica
            </h1>
            <p className="text-xs text-[#8F8278]">
              Controle de horários, profissionais e status em tempo real
            </p>
          </div>
        </div>

        {/* Date Selector & Mode */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1 bg-[#FAF8F5] border border-[#E0D7CC] rounded-xl px-2 py-1">
            <button
              type="button"
              onClick={() => {
                const curr = new Date(selectedDate);
                curr.setDate(curr.getDate() - 1);
                setSelectedDate(curr.toISOString().split('T')[0]);
              }}
              className="p-1 text-[#8F8278] hover:text-[#2D2725]"
            >
              <ChevronLeft size={16} />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-semibold bg-transparent text-[#2D2725] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                const curr = new Date(selectedDate);
                curr.setDate(curr.getDate() + 1);
                setSelectedDate(curr.toISOString().split('T')[0]);
              }}
              className="p-1 text-[#8F8278] hover:text-[#2D2725]"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSelectedDate(getTodayDateString())}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFE9] text-[#4A423C] border border-[#E0D7CC]"
          >
            Hoje
          </button>

          {/* View Mode Buttons */}
          <div className="flex rounded-xl bg-[#F6F2EC] p-1 border border-[#E8E1D7]">
            <button
              type="button"
              onClick={() => setViewMode('dia')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'dia' ? 'bg-white text-[#2D2725] shadow-xs' : 'text-[#85786E]'
              }`}
            >
              Dia
            </button>
            <button
              type="button"
              onClick={() => setViewMode('lista')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'lista' ? 'bg-white text-[#2D2725] shadow-xs' : 'text-[#85786E]'
              }`}
            >
              Lista
            </button>
          </div>

          {onNavigateToCadastro && (
            <button
              type="button"
              onClick={onNavigateToCadastro}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E0D7CC] text-[#2D2725] hover:bg-[#FAF8F5] text-xs font-semibold shadow-2xs transition-all"
            >
              <UserPlus size={15} className="text-[#B88746]" />
              Pré-Cadastro & Agendamento
            </button>
          )}

          <button
            type="button"
            onClick={onOpenNewAppointment}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D2725] hover:bg-[#3D3532] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Plus size={15} className="text-[#E8D1C5]" />
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Filter Filters Bar */}
      <div className="flex items-center gap-3 flex-wrap bg-white p-4 rounded-2xl border border-[#EDE7DF]">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#8F8278] uppercase">
          <Filter size={14} /> Filtros:
        </div>

        {/* Unit Filter */}
        <select
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs font-medium text-[#2D2725]"
        >
          <option value="todos">Todas as Unidades</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        {/* Professional Filter */}
        <select
          value={selectedProfessional}
          onChange={(e) => setSelectedProfessional(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs font-medium text-[#2D2725]"
        >
          <option value="todos">Todos os Profissionais</option>
          {professionals.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs font-medium text-[#2D2725]"
        >
          <option value="todos">Todos os Status</option>
          <option value="agendado">Agendado</option>
          <option value="confirmado">Confirmado</option>
          <option value="em_atendimento">Em Atendimento</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
        </select>

        <span className="text-xs text-[#8F8278] ml-auto">
          {filteredAppointments.length} agendamentos listados
        </span>
      </div>

      {/* Main Agenda Grid / Timeline */}
      {viewMode === 'dia' ? (
        <div className="bg-white rounded-3xl p-5 border border-[#EDE7DF] shadow-xs">
          <div className="space-y-3">
            {timeSlots.map((time) => {
              const aptsAtTime = filteredAppointments.filter((a) => {
                const hour = a.startTime.split(':')[0] + ':00';
                return hour === time;
              });

              return (
                <div key={time} className="flex items-start gap-4 py-2 border-b border-[#F7F4EF] min-h-[72px]">
                  {/* Time label */}
                  <div className="w-14 text-xs font-bold text-[#7A6E65] pt-1 shrink-0 font-display">
                    {time}
                  </div>

                  {/* Slot content */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {aptsAtTime.length === 0 ? (
                      <button
                        type="button"
                        onClick={onOpenNewAppointment}
                        className="h-14 border border-dashed border-[#EAE3DA] rounded-xl flex items-center justify-center text-xs text-[#A39589] hover:border-[#B88746] hover:text-[#2D2725] hover:bg-[#FAF8F5] transition-all group"
                      >
                        <span className="group-hover:inline-flex items-center gap-1">
                          <Plus size={13} /> Horário Livre — Clique para Agendar
                        </span>
                      </button>
                    ) : (
                      aptsAtTime.map((apt) => (
                        <div
                          key={apt.id}
                          className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA] hover:border-[#D0C2B4] transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#2D2725] truncate">
                              {apt.startTime} - {apt.clientName}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-[#2D2725] border border-[#E0D7CC]">
                              {apt.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#7A6E65] mt-1 flex items-center justify-between">
                            <span className="truncate">{apt.serviceName}</span>
                            <span className="font-semibold text-[#B88746]">R$ {apt.finalPrice}</span>
                          </div>
                          <div className="text-[10px] text-[#9C8F85] mt-0.5">
                            Prof: {apt.professionalName} ({apt.durationMinutes} min)
                          </div>
                          <div className="pt-2 mt-2 border-t border-[#EAE3DA] flex items-center justify-between gap-1">
                            <span className="text-[10px] text-[#8F8278]">Fidelidade:</span>
                            {apt.status === 'finalizado' ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                ✓ Selo Creditado
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => dataService.updateAppointmentStatus(apt.id, 'finalizado')}
                                className="text-[10px] font-bold text-white bg-[#2D2725] hover:bg-black px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                                title="Finalizar atendimento (Dispara Trigger de Selo no Cartão Fidelidade)"
                              >
                                <Sparkles size={10} className="text-amber-300" />
                                <span>Finalizar (+1 Selo)</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Lista View */
        <div className="bg-white rounded-3xl p-5 border border-[#EDE7DF] shadow-xs">
          {/* Visualização em Cards para Dispositivos Móveis */}
          <div className="md:hidden space-y-1">
            {filteredAppointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                data={apt}
                onStatusChange={(id, newStatus) => {
                  dataService.updateAppointmentStatus(id, newStatus);
                }}
              />
            ))}
          </div>

          {/* Tabela para Telas Médias e Maiores */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EFEAE2] text-[#8F8278] uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3 font-semibold">Horário</th>
                  <th className="py-2.5 px-3 font-semibold">Cliente</th>
                  <th className="py-2.5 px-3 font-semibold">Serviço</th>
                  <th className="py-2.5 px-3 font-semibold">Profissional</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Duração</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Valor</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F4EF]">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-3 font-bold text-[#2D2725] font-display">
                      {apt.startTime} — {apt.endTime}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#2D2725]">
                      {apt.clientName}
                    </td>
                    <td className="py-3 px-3 text-[#524842]">{apt.serviceName}</td>
                    <td className="py-3 px-3 text-[#7A6E65]">{apt.professionalName}</td>
                    <td className="py-3 px-3 text-center">{apt.durationMinutes} min</td>
                    <td className="py-3 px-3 text-right font-bold text-[#2D2725]">
                      R$ {apt.finalPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {apt.status === 'finalizado' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ✓ Finalizado & Selo
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => dataService.updateAppointmentStatus(apt.id, 'finalizado')}
                          className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#2D2725] hover:bg-black text-white transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                          title="Finalizar atendimento e creditar selo no Cartão Fidelidade"
                        >
                          <Sparkles size={10} className="text-amber-300" />
                          <span>Finalizar (+1 Selo)</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
