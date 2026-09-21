import React, { useState } from 'react';
import {
  Zap,
  MessageCircle,
  Clock,
  Send,
  Calendar,
  RotateCcw,
  Star,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Settings,
  Sparkles
} from 'lucide-react';

interface AutomationRule {
  id: string;
  title: string;
  trigger: string;
  channel: string;
  enabled: boolean;
  sampleMessage: string;
  iconColor: string;
}

export const AutomationsView: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      title: 'Confirmação Imediata de Agendamento',
      trigger: 'Imediatamente após a criação do agendamento',
      channel: 'WhatsApp Automático',
      enabled: true,
      sampleMessage: 'Olá, {nome}! ✨ Seu horário na Sublime Estética foi confirmado para {data} às {horario} para {servico} com {profissional}. Mal podemos esperar para cuidar de você!',
      iconColor: '#227249',
    },
    {
      id: '2',
      title: 'Lembrete de Antecedência (24 Horas Antes)',
      trigger: '24 horas antes do horário agendado',
      channel: 'WhatsApp Automático',
      enabled: true,
      sampleMessage: 'Oi, {nome}! 💕 Passando para lembrar do seu atendimento amanhã às {horario}. Por favor, responda 1 para CONFIRMAR ou 2 para REMARCAR.',
      iconColor: '#B88746',
    },
    {
      id: '3',
      title: 'Pesquisa de Satisfação & NPS',
      trigger: '2 horas após o status mudar para "Finalizado"',
      channel: 'WhatsApp Automático',
      enabled: true,
      sampleMessage: 'Olá, {nome}! Como foi sua experiência com {profissional} hoje? De 0 a 10, o quanto você recomendaria nossa clínica para uma amiga?',
      iconColor: '#D89F95',
    },
    {
      id: '4',
      title: 'Aviso de Ciclo de Retorno Inteligente',
      trigger: 'Ao ultrapassar o prazo de retorno configurado para o serviço (ex: 15 dias)',
      channel: 'WhatsApp Automático',
      enabled: true,
      sampleMessage: 'Olá, {nome}! 💕 Já está chegando a hora de renovar seu procedimento de {servico} para manter o resultado impecável. Que tal reservar seu próximo horário? Clique aqui: [LINK_AGENDA]',
      iconColor: '#2D2725',
    },
    {
      id: '5',
      title: 'Resgate de Clientes Inativos (+60 dias)',
      trigger: '60 dias sem novo atendimento registrado',
      channel: 'WhatsApp Automático',
      enabled: false,
      sampleMessage: 'Sentimos sua falta, {nome}! 🌸 Preparamos um mimo exclusivo de 15% OFF para você retornar e renovar o seu bem-estar esta semana!',
      iconColor: '#B84E3A',
    },
  ]);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  return (
    <div id="automations-view" className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EDE7DF] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D2725] text-[#F3E7DC] flex items-center justify-center">
            <Zap size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2D2725]">
              Central de Automações & WhatsApp
            </h1>
            <p className="text-xs text-[#8F8278]">
              Disparos programados para confirmação, NPS pós-procedimento e lembretes de retorno
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
          API WhatsApp Conectada e Ativa
        </span>
      </div>

      {/* Rules List */}
      <div className="grid grid-cols-1 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white rounded-3xl p-6 border border-[#EDE7DF] shadow-xs space-y-4 hover:border-[#D0C2B4] transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: rule.iconColor }}
                >
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2D2725] font-display">
                    {rule.title}
                  </h3>
                  <span className="text-xs text-[#8F8278] block flex items-center gap-1">
                    <Clock size={12} /> Disparo: {rule.trigger}
                  </span>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => toggleRule(rule.id)}
                className="flex items-center gap-2 self-end sm:self-center"
              >
                <span className="text-xs font-semibold text-[#7A6E65]">
                  {rule.enabled ? 'Ativo' : 'Pausado'}
                </span>
                {rule.enabled ? (
                  <ToggleRight size={32} className="text-emerald-700" />
                ) : (
                  <ToggleLeft size={32} className="text-[#C4B7AC]" />
                )}
              </button>
            </div>

            {/* Template Box */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EAE3DA]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9C753B] block mb-1">
                Modelo de Mensagem Personalizada
              </span>
              <p className="text-xs text-[#4A423C] font-mono leading-relaxed">
                "{rule.sampleMessage}"
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#8F8278] pt-1">
              <span>Canal: {rule.channel}</span>
              <span className="text-emerald-700 font-semibold">
                Variáveis dinâmicas: &#123;nome&#125;, &#123;servico&#125;, &#123;horario&#125;, &#123;data&#125;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
