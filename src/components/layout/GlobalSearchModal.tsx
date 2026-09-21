import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  User,
  Sparkles,
  Calendar,
  Calculator,
  ArrowRight,
  Clock,
  Phone,
  UserPlus
} from 'lucide-react';
import { Client, Service, Appointment } from '../../types';
import { NavItemKey } from './Sidebar';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  services: Service[];
  appointments: Appointment[];
  onNavigateToTab: (tab: NavItemKey) => void;
  onSelectClient?: (client: Client) => void;
  onOpenNewAppointment: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  clients,
  services,
  appointments,
  onNavigateToTab,
  onOpenNewAppointment,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle search
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();
  const safeClients = clients || [];
  const safeServices = services || [];
  const safeAppointments = appointments || [];

  const filteredClients = cleanQuery
    ? safeClients.filter(
        (c) =>
          c.name.toLowerCase().includes(cleanQuery) ||
          c.phone.includes(cleanQuery) ||
          (c.documentCpf && c.documentCpf.includes(cleanQuery))
      )
    : safeClients.slice(0, 3);

  const filteredServices = cleanQuery
    ? safeServices.filter(
        (s) =>
          s.name.toLowerCase().includes(cleanQuery) ||
          s.description.toLowerCase().includes(cleanQuery)
      )
    : safeServices.slice(0, 3);

  const filteredAppointments = cleanQuery
    ? safeAppointments.filter(
        (a) =>
          a.clientName.toLowerCase().includes(cleanQuery) ||
          a.serviceName.toLowerCase().includes(cleanQuery) ||
          a.professionalName.toLowerCase().includes(cleanQuery)
      )
    : safeAppointments.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E8E1D7] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#EFE9E2] bg-[#FAF8F5]">
          <Search size={20} className="text-[#9C8F85] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar clientes por nome ou telefone, serviços ou horários..."
            className="flex-1 bg-transparent text-[#2D2725] placeholder-[#9C8F85] text-sm focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#9C8F85] hover:text-[#2D2725]"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 text-xs text-[#8C7F75] hover:bg-[#EFE9E2] rounded-md transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-[#F4EFEA] space-y-4">
          {/* Quick Actions */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F8278] block mb-2">
              Ações Rápidas
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToTab('cadastro');
                }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#2D2725] bg-[#2D2725] hover:bg-black text-white transition-all text-left text-xs font-semibold shadow-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center shrink-0">
                  <UserPlus size={14} />
                </div>
                <div>
                  <span className="block">Pré-Cadastro</span>
                  <span className="text-[10px] text-[#E8D1C5] block font-normal">1º Passo Obrigatório</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNewAppointment();
                }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#EAE3DA] hover:border-[#D0C2B4] hover:bg-[#FAF8F5] transition-all text-left text-xs font-semibold text-[#2D2725]"
              >
                <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#EAE3DA] text-[#2D2725] flex items-center justify-center shrink-0">
                  <Calendar size={14} />
                </div>
                <span>Novo Agendamento</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToTab('precificacao');
                }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#EAE3DA] hover:border-[#D0C2B4] hover:bg-[#FAF8F5] transition-all text-left text-xs font-semibold text-[#2D2725]"
              >
                <div className="w-7 h-7 rounded-lg bg-[#B88746] text-white flex items-center justify-center shrink-0">
                  <Calculator size={14} />
                </div>
                <span>Precificação & Custos</span>
              </button>
            </div>
          </div>

          {/* Clientes */}
          <div className="pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F8278]">
                Clientes ({filteredClients.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToTab('clientes');
                }}
                className="text-[11px] text-[#B88746] hover:underline flex items-center gap-1"
              >
                Ver todos <ArrowRight size={11} />
              </button>
            </div>

            <div className="space-y-1">
              {filteredClients.length === 0 ? (
                <p className="text-xs text-[#9C8F85] py-1">Nenhum cliente encontrado.</p>
              ) : (
                filteredClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => {
                      onClose();
                      onNavigateToTab('clientes');
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F5] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#EBD5CC] text-[#5C3D36] flex items-center justify-center text-xs font-bold shrink-0">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#2D2725] block">{client.name}</span>
                        <span className="text-[11px] text-[#8F8278] flex items-center gap-1">
                          <Phone size={10} /> {client.phone}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-[#2D2725] block">
                        R$ {client.totalSpent.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-[10px] text-[#8F8278]">
                        {client.appointmentsCount} atendimentos
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Serviços */}
          <div className="pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F8278]">
                Serviços ({filteredServices.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToTab('servicos');
                }}
                className="text-[11px] text-[#B88746] hover:underline flex items-center gap-1"
              >
                Ver catálogo <ArrowRight size={11} />
              </button>
            </div>

            <div className="space-y-1">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => {
                    onClose();
                    onNavigateToTab('servicos');
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F5] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={16} className="text-[#C5A880] shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-[#2D2725] block">{service.name}</span>
                      <span className="text-[10px] text-[#8F8278]">Duração: {service.durationMinutes} min</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#2D2725]">
                      R$ {service.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-emerald-700 block">
                      Margem {service.profitMargin.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agendamentos */}
          <div className="pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F8278]">
                Agendamentos Hoje ({filteredAppointments.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToTab('agenda');
                }}
                className="text-[11px] text-[#B88746] hover:underline flex items-center gap-1"
              >
                Ver agenda <ArrowRight size={11} />
              </button>
            </div>

            <div className="space-y-1">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => {
                    onClose();
                    onNavigateToTab('agenda');
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F5] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Clock size={15} className="text-[#8F8278]" />
                    <div>
                      <span className="text-xs font-semibold text-[#2D2725]">
                        {apt.startTime} — {apt.clientName}
                      </span>
                      <span className="text-[10px] text-[#8F8278] block">
                        {apt.serviceName} • {apt.professionalName}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${
                      apt.status === 'finalizado'
                        ? 'bg-emerald-50 text-emerald-800'
                        : apt.status === 'em_atendimento'
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-[#F2ECE5] text-[#554A43]'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#F5F0E8] border-t border-[#EAE3DA] flex items-center justify-between text-[11px] text-[#8C7F75]">
          <span>Dica: Pressione ESC para fechar</span>
          <span>Aura Estética OS</span>
        </div>
      </div>
    </div>
  );
};
