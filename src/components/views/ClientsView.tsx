import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Calendar,
  DollarSign,
  Filter,
  MessageCircle,
  Clock,
  Sparkles,
  Tag,
  UserPlus,
  Award,
  Gift
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Client, ReturnStatus } from '../../types';
import { LoyaltyModal } from '../loyalty/LoyaltyModal';

interface ClientsViewProps {
  onOpenNewAppointment: () => void;
  onNavigateToCadastro?: () => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  onOpenNewAppointment,
  onNavigateToCadastro,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('todos');
  const [selectedReturnFilter, setSelectedReturnFilter] = useState<string>('todos');
  const [selectedClientForLoyalty, setSelectedClientForLoyalty] = useState<Client | null>(null);

  const clients = dataService.getClients();

  const filteredClients = useMemo(() => {
    const term = searchQuery.toLowerCase().trim();
    return (clients || []).filter((c) => {
      const matchQuery =
        !term ||
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        (c.whatsapp && c.whatsapp.includes(term)) ||
        ((c.cpf || c.documentCpf) && (c.cpf || c.documentCpf)!.toLowerCase().includes(term)) ||
        ((c.medical_notes || c.medicalNotes) && (c.medical_notes || c.medicalNotes)!.toLowerCase().includes(term));

      const matchSegment =
        selectedSegment === 'todos' ? true : c.segment === selectedSegment;

      const matchReturn =
        selectedReturnFilter === 'todos' ? true : c.returnStatus === selectedReturnFilter;

      return matchQuery && matchSegment && matchReturn;
    });
  }, [clients, searchQuery, selectedSegment, selectedReturnFilter]);

  const handleSendWhatsApp = (client: Client) => {
    const text = `Olá, ${client.name}! Tudo bem? Passando para te desejar um ótimo dia e conferir se precisa de algo na Sublime Estética!`;
    const url = `https://wa.me/${client.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div id="clients-view" className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EDE7DF] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D2725] text-[#F3E7DC] flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2D2725]">
              Gestão de Clientes & CRM
            </h1>
            <p className="text-xs text-[#8F8278]">
              Histórico de procedimentos, ticket acumulado e acompanhamento de retornos
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-2xl border border-[#EDE7DF]">
        {/* Search input */}
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC]">
          <Search size={16} className="text-[#8F8278] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, telefone ou CPF..."
            className="w-full bg-transparent text-xs text-[#2D2725] placeholder-[#9C8F85] focus:outline-none"
          />
        </div>

        {/* Segment Filter */}
        <select
          value={selectedSegment}
          onChange={(e) => setSelectedSegment(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs font-medium text-[#2D2725]"
        >
          <option value="todos">Todos os Segmentos</option>
          <option value="vip">VIP</option>
          <option value="recorrente">Recorrente</option>
          <option value="novo">Novos</option>
          <option value="em_risco">Em Risco</option>
        </select>

        {/* Return Status Filter */}
        <select
          value={selectedReturnFilter}
          onChange={(e) => setSelectedReturnFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs font-medium text-[#2D2725]"
        >
          <option value="todos">Todos os Retornos</option>
          <option value="retorno_hoje">Retorno Hoje</option>
          <option value="retorno_atrasado">Retorno Atrasado</option>
          <option value="retorno_proximo">Retorno Próximo</option>
          <option value="em_dia">Em Dia</option>
        </select>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-2xl p-5 border border-[#EDE7DF] shadow-xs hover:border-[#D0C2B4] transition-all space-y-3"
          >
            {/* Top row with photo and tags */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={client.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                  alt={client.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#EAE2D8]"
                />
                <div>
                  <h3 className="text-sm font-bold text-[#2D2725] font-display">{client.name}</h3>
                  <span className="text-xs text-[#8F8278] flex items-center gap-1 mt-0.5">
                    <Phone size={11} /> {client.phone}
                  </span>
                  {(client.cpf || client.documentCpf) && (
                    <span className="text-[10px] text-[#9E9085] block font-mono">
                      CPF: {client.cpf || client.documentCpf}
                    </span>
                  )}
                  {(client.birth_date || client.birthDate) && (
                    <span className="text-[10px] text-[#9E9085] block">
                      Nasc: {client.birth_date || client.birthDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Segment pill & Registration status */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-[#FAF2E6] text-[#9C753B]">
                  {client.segment}
                </span>
                {(client.registration_completed || client.registrationCompleted || client.preRegistrationCompleted) ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ✓ Cadastro Completo
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    Pendente
                  </span>
                )}
              </div>
            </div>

            {/* Financial and loyalty stats */}
            <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#FAF8F5] rounded-xl border border-[#EBE4DC] text-center">
              <div>
                <span className="text-[10px] text-[#8F8278] block">Atendimentos</span>
                <span className="text-xs font-bold text-[#2D2725]">{client.appointmentsCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8F8278] block">Gasto Total</span>
                <span className="text-xs font-bold text-[#2D2725]">R$ {client.totalSpent.toLocaleString('pt-BR')}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8F8278] block">Retorno</span>
                <span
                  className={`text-[10px] font-bold ${
                    client.returnStatus === 'retorno_hoje'
                      ? 'text-[#B84E3A]'
                      : client.returnStatus === 'retorno_atrasado'
                      ? 'text-amber-800'
                      : 'text-emerald-800'
                  }`}
                >
                  {client.returnStatus === 'retorno_hoje'
                    ? 'Hoje'
                    : client.returnStatus === 'retorno_atrasado'
                    ? 'Atrasado'
                    : 'Em dia'}
                </span>
              </div>
            </div>

            {/* Medical / Aesthetic Notes (medical_notes) */}
            {(client.medical_notes || client.medicalNotes) && (
              <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBDDCF] text-[11px] text-[#4A423C]">
                <div className="flex items-center gap-1 font-semibold text-[#8C6239] text-[10px] uppercase tracking-wider mb-0.5">
                  <Sparkles size={11} className="text-[#B88746]" /> Prontuário Estético (medical_notes)
                </div>
                <p className="italic text-[#5C524B] line-clamp-2">
                  {client.medical_notes || client.medicalNotes}
                </p>
              </div>
            )}

            {/* Loyalty Card Summary */}
            {(() => {
              const loyalty = dataService.getLoyaltyCardByClientId(client.id);
              const stamps = loyalty?.stampsCount ?? loyalty?.stamps_count ?? 0;
              const hasReward = Boolean(loyalty?.rewardAvailable ?? loyalty?.reward_available);

              return (
                <div className="space-y-1.5">
                  <div
                    onClick={() => setSelectedClientForLoyalty(client)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-between gap-2 ${
                      hasReward
                        ? 'bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-yellow-500/15 border-amber-300 shadow-xs'
                        : 'bg-[#FAF8F5] border-[#EAE3DA] hover:border-[#B88746]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                          hasReward ? 'bg-amber-400 text-[#2D2725]' : 'bg-[#B88746] text-white'
                        }`}
                      >
                        {hasReward ? <Gift size={13} /> : <Award size={13} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-[#2D2725]">Cartão Fidelidade</span>
                          {hasReward && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-amber-400 text-[#2D2725] rounded-full">
                              Prêmio Pronto!
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#7A6E65]">
                          {hasReward ? '10/10 selos completos • Procedimento Grátis' : `${stamps} de 10 selos acumulados`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-xs font-mono font-bold text-[#B88746]">
                        {stamps}/10
                      </span>
                    </div>
                  </div>

                  {stamps >= 8 && !hasReward && (
                    <div className="p-2 rounded-lg bg-amber-50/90 border border-amber-200/80 flex items-center gap-2 text-[10px] text-amber-950 font-medium shadow-2xs">
                      <Sparkles size={13} className="text-amber-600 shrink-0" />
                      <span>
                        Este cliente tem <strong>{stamps} selos</strong>. Ofereça um upgrade no próximo atendimento!
                      </span>
                    </div>
                  )}
                </div>
              );
          })()}

            {/* Notes if any */}
            {client.notes && !client.medical_notes && (
              <p className="text-[11px] text-[#7A6E65] italic line-clamp-2">
                "{client.notes}"
              </p>
            )}

            {/* Action buttons */}
            <div className="pt-2 border-t border-[#F4EFEA] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedClientForLoyalty(client)}
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#7A6E65] hover:text-[#2D2725] text-xs font-semibold border border-[#EAE3DA] transition-colors"
                title="Abrir Cartão Fidelidade"
              >
                <Award size={13} className="text-[#B88746]" />
                <span>Fidelidade</span>
              </button>
              <button
                type="button"
                onClick={() => handleSendWhatsApp(client)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[#E7F5ED] hover:bg-[#D4EEDE] text-[#227249] text-xs font-semibold transition-colors"
              >
                <MessageCircle size={13} />
                WhatsApp
              </button>
              <button
                type="button"
                onClick={onOpenNewAppointment}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[#2D2725] hover:bg-[#3D3532] text-white text-xs font-semibold transition-colors"
              >
                <Calendar size={13} className="text-[#E8D1C5]" />
                Agendar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Loyalty Modal */}
      {selectedClientForLoyalty && (
        <LoyaltyModal
          client={selectedClientForLoyalty}
          isOpen={Boolean(selectedClientForLoyalty)}
          onClose={() => setSelectedClientForLoyalty(null)}
        />
      )}
    </div>
  );
};
