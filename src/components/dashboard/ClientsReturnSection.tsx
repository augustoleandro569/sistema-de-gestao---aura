import React, { useState } from 'react';
import {
  CalendarClock,
  Clock,
  Phone,
  MessageCircle,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Client, ReturnStatus } from '../../types';
import { dataService } from '../../services/dataService';

interface ClientsReturnSectionProps {
  onOpenNewAppointment: () => void;
}

export const ClientsReturnSection: React.FC<ClientsReturnSectionProps> = ({
  onOpenNewAppointment,
}) => {
  const [activeFilter, setActiveFilter] = useState<ReturnStatus | 'todos'>('todos');
  const [copiedMessageClientId, setCopiedMessageClientId] = useState<string | null>(null);

  const clients = dataService.getClients();

  // Filter clients with return pending
  const returnClients = (clients || []).filter((c) => {
    if (activeFilter === 'todos') {
      return (
        c.returnStatus === 'retorno_hoje' ||
        c.returnStatus === 'retorno_atrasado' ||
        c.returnStatus === 'retorno_proximo'
      );
    }
    return c.returnStatus === activeFilter;
  });

  const getStatusBadge = (status: ReturnStatus) => {
    switch (status) {
      case 'retorno_hoje':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF0ED] text-[#B84E3A] border border-[#F2D7D1]">
            Retorno Hoje
          </span>
        );
      case 'retorno_atrasado':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
            Atrasado
          </span>
        );
      case 'retorno_proximo':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            Em 3 dias
          </span>
        );
      case 'inativo':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-700">
            Inativo
          </span>
        );
      default:
        return null;
    }
  };

  const handleSendWhatsApp = (client: Client) => {
    const text = `Olá, ${client.name}! 💕 Notamos que já está no período recomendado para renovar seu procedimento para manter os resultados impecáveis. Que tal garantir seu próximo horário conosco na Sublime Estética?`;
    const url = `https://wa.me/${client.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div id="clients-return-section" className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EDE7DF] shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F4EFEA]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D89F95]" />
            <h3 className="font-display text-lg sm:text-xl font-semibold text-[#2D2725]">
              Gestão de Retornos & Recorrência
            </h3>
            <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-[#FBF4F2] text-[#B84E3A]">
              Automação CRM
            </span>
          </div>
          <p className="text-xs text-[#8F8278] mt-0.5">
            Monitoramento preventivo por serviço (Sobrancelhas: 15 dias, Limpeza: 30 dias, Laser: 28 dias)
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveFilter('todos')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'todos'
                ? 'bg-[#2D2725] text-white'
                : 'bg-[#FAF8F5] text-[#7A6E65] hover:bg-[#F3EFE9]'
            }`}
          >
            Todos ({clients.filter((c) => c.returnStatus !== 'em_dia' && c.returnStatus !== 'inativo').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('retorno_hoje')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'retorno_hoje'
                ? 'bg-[#B84E3A] text-white'
                : 'bg-[#FAF0ED] text-[#B84E3A] hover:bg-[#F8E5E1]'
            }`}
          >
            Retorno Hoje
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('retorno_atrasado')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'retorno_atrasado'
                ? 'bg-amber-700 text-white'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            Atrasados
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('retorno_proximo')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'retorno_proximo'
                ? 'bg-[#2D2725] text-white'
                : 'bg-[#FAF8F5] text-[#7A6E65] hover:bg-[#F3EFE9]'
            }`}
          >
            Próximos
          </button>
        </div>
      </div>

      {/* List of Clients */}
      <div className="divide-y divide-[#F7F3EE]">
        {returnClients.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#8F8278]">
            Nenhum cliente pendente de retorno neste filtro. Todos os atendimentos em dia!
          </div>
        ) : (
          returnClients.map((client) => (
            <div
              key={client.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F5] rounded-xl px-2 transition-colors"
            >
              {/* Client Info */}
              <div className="flex items-center gap-3">
                <img
                  src={client.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                  alt={client.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#EAE2D8] shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      className="text-sm font-medium text-graphite truncate max-w-[150px] sm:max-w-[220px]"
                      title={client.name}
                    >
                      {client.name}
                    </h3>
                    {getStatusBadge(client.returnStatus)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#8F8278] mt-0.5">
                    <span>Último: {client.lastAppointmentDate || 'Recente'}</span>
                    <span>•</span>
                    <span>Retorno ideal: <strong className="text-[#4A423C]">{client.recommendedReturnDate}</strong></span>
                  </div>
                </div>
              </div>

              {/* Actions: Send WhatsApp Reminder & Book Appointment */}
              <div className="flex items-center gap-2 shrink-0 sm:self-center self-end">
                <button
                  type="button"
                  onClick={() => handleSendWhatsApp(client)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E7F5ED] hover:bg-[#D4EEDE] text-[#227249] text-xs font-semibold transition-colors"
                  title="Enviar mensagem personalizada de retorno via WhatsApp"
                >
                  <MessageCircle size={14} />
                  <span>Lembrete WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenNewAppointment}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2D2725] hover:bg-[#3E3633] text-white text-xs font-semibold transition-colors shadow-2xs"
                >
                  <Calendar size={13} className="text-[#E8D1C5]" />
                  <span>Agendar Retorno</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE4DC] flex items-center justify-between text-xs text-[#8F8278]">
        <div className="flex items-center gap-2">
          <CalendarClock size={15} className="text-[#B88746]" />
          <span>Configuração global: Retorno padrão em <strong>15 dias</strong> (alterável em Configurações &gt; Agenda).</span>
        </div>
        <span className="font-semibold text-[#2D2725]">Taxa de Recompra: 68.4%</span>
      </div>
    </div>
  );
};
