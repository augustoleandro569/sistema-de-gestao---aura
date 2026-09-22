import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  Settings2,
  Zap,
  Play,
  Copy,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  QrCode,
  TrendingDown,
  Users,
  Check,
  X,
  Sparkles,
  ArrowRight,
  ListOrdered,
  Calendar,
  Layers,
  HeartHandshake,
  Star,
  RotateCcw,
  Search,
  Filter,
  CheckCheck,
  Cake,
  FileText,
  Smile,
  Bot,
  Phone,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { dataService } from '../../../services/dataService';
import { useBusiness } from '../../../core/BusinessContext';

export type AutomationTab = 'reguas' | 'transmissao' | 'chat' | 'fila' | 'conexao';

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'agendamento' | 'pos_venda' | 'fidelizacao' | 'retencao';
  triggerType: 'immediate' | '24h_before' | '2h_before' | 'd1_after' | '2h_after' | '30d_return' | 'birthday' | '60d_inactive';
  triggerLabel: string;
  triggerDescription: string;
  active: boolean;
  message: string;
  messagesSent: number;
  confirmationRate: string;
  iconType: 'check' | 'clock' | 'star' | 'rotate' | 'heart' | 'cake' | 'sparkle' | 'shield';
}

interface NotificationQueueItem {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  scheduledFor: string;
  triggerName: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'CONFIRMED';
  preview: string;
  timestamp: string;
}

interface ChatConversation {
  id: string;
  clientName: string;
  clientPhone: string;
  avatarInitials: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'CONFIRMED' | 'RESCHEDULE' | 'DOUBT' | 'WAITING';
  service: string;
  appointmentTime: string;
  messages: {
    id: string;
    sender: 'system' | 'client' | 'agent';
    text: string;
    time: string;
    status?: 'sent' | 'delivered' | 'read';
  }[];
}

export const WhatsAppAutomation: React.FC = () => {
  const { currentBusiness } = useBusiness();
  const [activeTab, setActiveTab] = useState<AutomationTab>('reguas');

  // Templates de Automação Estratégicos para Clínicas de Estética
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([
    {
      id: 'template_confirm',
      name: 'Confirmação Imediata de Agendamento',
      category: 'agendamento',
      triggerType: 'immediate',
      triggerLabel: 'Disparo: Imediato ao agendar',
      triggerDescription: 'Enviado assim que o agendamento é registrado no Aura App ou na recepção.',
      active: true,
      message: 'Olá, {{nome_cliente}}! 💕 Seu atendimento de {{servico}} está confirmado para {{data}} às {{hora}} na {{unidade}} com {{profissional}}. Para facilitar seu trajeto, confira as orientações no link: {{link_agendar}}',
      messagesSent: 1284,
      confirmationRate: '98.6%',
      iconType: 'check',
    },
    {
      id: 'template_reminder_24h',
      name: 'Lembrete Preventivo Anti-No Show (24 Horas)',
      category: 'agendamento',
      triggerType: '24h_before',
      triggerLabel: 'Disparo: 24h antes do horário',
      triggerDescription: 'Gatilho principal de proteção de faturamento. Reduz o no-show e possibilita remanejamento de grade.',
      active: true,
      message: 'Passando para lembrar que amanhã temos um encontro marcado para seu {{servico}} às {{hora}} com {{profissional}}! ✨ Por favor, confirme sua presença respondendo [1] SIM ou [2] para REMARCAR. Link direto: {{link_agendar}}',
      messagesSent: 2150,
      confirmationRate: '92.4%',
      iconType: 'clock',
    },
    {
      id: 'template_reminder_2h',
      name: 'Lembrete de Proximidade (2 Horas Antes)',
      category: 'agendamento',
      triggerType: '2h_before',
      triggerLabel: 'Disparo: 2h antes do atendimento',
      triggerDescription: 'Auxilia a cliente no deslocamento e estacionamento na clínica.',
      active: true,
      message: 'Olá, {{nome_cliente}}! 🌸 Seu atendimento de {{servico}} é daqui a pouco, às {{hora}}, na {{unidade}}. Já estamos com a sala e o chá aromático preparados te esperando!',
      messagesSent: 940,
      confirmationRate: '96.8%',
      iconType: 'sparkle',
    },
    {
      id: 'template_pos_d1',
      name: 'Orientações Pós-Procedimento (D+1)',
      category: 'pos_venda',
      triggerType: 'd1_after',
      triggerLabel: 'Disparo: 24h após o procedimento',
      triggerDescription: 'Cuidado contínuo humanizado com orientações clínicas de recuperação e home care.',
      active: true,
      message: 'Olá, {{nome_cliente}}! 💕 Como você acordou hoje após o seu {{servico}}? Lembre-se de manter a hidratação, aplicar filtro solar a cada 3 horas e evitar banhos muito quentes. Qualquer dúvida, estamos aqui!',
      messagesSent: 680,
      confirmationRate: '94.2%',
      iconType: 'shield',
    },
    {
      id: 'template_nps_2h',
      name: 'Pesquisa de Satisfação & NPS (2 Horas Pós)',
      category: 'pos_venda',
      triggerType: '2h_after',
      triggerLabel: 'Disparo: 2 horas após o término',
      triggerDescription: 'Captura a opinião da cliente no momento de maior satisfação com o resultado.',
      active: true,
      message: 'Olá, {{nome_cliente}}! ✨ Foi um prazer receber você na {{unidade}} hoje. De 0 a 10, qual nota você daria para a experiência com {{profissional}}? Sua resposta ajuda a aprimorar nosso cuidado!',
      messagesSent: 890,
      confirmationRate: '81.5%',
      iconType: 'star',
    },
    {
      id: 'template_cycle_return',
      name: 'Retorno Inteligente de Ciclo (30 Dias)',
      category: 'retencao',
      triggerType: '30d_return',
      triggerLabel: 'Disparo: 30 dias após o atendimento',
      triggerDescription: 'Reativa clientes no ciclo ideal de renovação do procedimento estético, aumentando o LTV.',
      active: true,
      message: 'Olá, {{nome_cliente}}! 💕 Já se passaram 30 dias desde seu {{servico}}. Para manter os resultados luminosos e o estímulo de colágeno, preparamos horários especiais para você: {{link_agendar}}',
      messagesSent: 520,
      confirmationRate: '38.2%',
      iconType: 'rotate',
    },
    {
      id: 'template_birthday',
      name: 'Felicitações & Presente de Aniversário',
      category: 'fidelizacao',
      triggerType: 'birthday',
      triggerLabel: 'Disparo: No dia do aniversário da cliente',
      triggerDescription: 'Encanta a cliente no dia dela com um benefício exclusivo na clínica.',
      active: true,
      message: 'Feliz Aniversário, {{nome_cliente}}! 🎂✨ Desejamos um novo ciclo repleto de luz e beleza. Como presente especial da {{unidade}}, você tem R$ 100 de crédito no seu procedimento favorito este mês! Reserve aqui: {{link_agendar}}',
      messagesSent: 174,
      confirmationRate: '68.0%',
      iconType: 'cake',
    },
    {
      id: 'template_inactive_rescue',
      name: 'Resgate de Clientes Inativas (+60 dias)',
      category: 'retencao',
      triggerType: '60d_inactive',
      triggerLabel: 'Disparo: 60 dias sem novo agendamento',
      triggerDescription: 'Detecta perda de frequência e oferece um voucher de boas-vindas para reativar o vínculo.',
      active: false,
      message: 'Sentimos sua falta, {{nome_cliente}}! 🌸 Que tal reservar um momento especial de autocuidado essa semana? Preparamos um mimo exclusivo de 15% OFF na Unidade {{unidade}}: {{link_agendar}}',
      messagesSent: 310,
      confirmationRate: '24.5%',
      iconType: 'heart',
    },
  ]);

  // Fila de Disparos ao Vivo
  const [queue, setQueue] = useState<NotificationQueueItem[]>([
    {
      id: 'q_1',
      clientName: 'Helena Rostand',
      clientPhone: '(11) 98112-4433',
      serviceName: 'Harmonização Facial & Peeling Rose',
      scheduledFor: 'Hoje às 14:00 (em 20 min)',
      triggerName: 'Lembrete Preventivo Anti-No Show',
      status: 'CONFIRMED',
      preview: 'Passando para lembrar que amanhã temos um encontro marcado para seu Harmonização Facial...',
      timestamp: '13:40',
    },
    {
      id: 'q_2',
      clientName: 'Dra. Beatriz Albuquerque',
      clientPhone: '(11) 97234-9988',
      serviceName: 'Drenagem Linfática Luminous',
      scheduledFor: 'Hoje às 15:30',
      triggerName: 'Lembrete de Proximidade (2h)',
      status: 'DELIVERED',
      preview: 'Olá, Beatriz! 🌸 Seu atendimento de Drenagem Linfática é daqui a pouco, às 15:30...',
      timestamp: '13:30',
    },
    {
      id: 'q_3',
      clientName: 'Mariana Siqueira',
      clientPhone: '(11) 99876-1122',
      serviceName: 'Laser Lavieen & Glow',
      scheduledFor: 'Hoje às 16:30',
      triggerName: 'Confirmação Imediata',
      status: 'PENDING',
      preview: 'Olá, Mariana! 💕 Seu atendimento de Laser Lavieen está confirmado para hoje...',
      timestamp: '13:15',
    },
    {
      id: 'q_4',
      clientName: 'Camila Fernandes',
      clientPhone: '(11) 96543-2199',
      serviceName: 'Design com Henna Orgânica',
      scheduledFor: 'Hoje às 11:15',
      triggerName: 'Pesquisa de Satisfação NPS',
      status: 'READ',
      preview: 'Olá, Camila! ✨ Foi um prazer receber você na Unidade Jardins hoje...',
      timestamp: '12:00',
    },
    {
      id: 'q_5',
      clientName: 'Sofia Valença',
      clientPhone: '(11) 98455-7711',
      serviceName: 'Bioestimulador de Colágeno',
      scheduledFor: 'Amanhã às 10:00',
      triggerName: 'Lembrete Preventivo Anti-No Show',
      status: 'PENDING',
      preview: 'Passando para lembrar que amanhã temos um encontro marcado para seu Bioestimulador...',
      timestamp: '10:00',
    },
  ]);

  // Conversas Interativas da Central de Atendimento (Simulador WhatsApp Web)
  const [conversations, setConversations] = useState<ChatConversation[]>([
    {
      id: 'chat_1',
      clientName: 'Helena Rostand',
      clientPhone: '(11) 98112-4433',
      avatarInitials: 'HR',
      lastMessage: '1 - Confirmado com certeza! Chegarei 10 minutinhos antes.',
      lastMessageTime: '13:42',
      unreadCount: 0,
      status: 'CONFIRMED',
      service: 'Harmonização Facial & Peeling Rose',
      appointmentTime: 'Hoje, 14:00',
      messages: [
        {
          id: 'm1',
          sender: 'system',
          text: 'Passando para lembrar que amanhã temos um encontro marcado para seu Harmonização Facial & Peeling Rose às 14:00 com Dra. Camila! ✨ Por favor, confirme sua presença respondendo [1] SIM ou [2] para REMARCAR.',
          time: '13:30',
          status: 'read',
        },
        {
          id: 'm2',
          sender: 'client',
          text: '1 - Confirmado com certeza! Chegarei 10 minutinhos antes.',
          time: '13:42',
        },
        {
          id: 'm3',
          sender: 'agent',
          text: 'Maravilha, Helena! 💕 Nossa equipe já preparou seu protocolo. Até daqui a pouco!',
          time: '13:43',
          status: 'delivered',
        },
      ],
    },
    {
      id: 'chat_2',
      clientName: 'Mariana Siqueira',
      clientPhone: '(11) 99876-1122',
      avatarInitials: 'MS',
      lastMessage: 'Tive um imprevisto na reunião, tem como transferir para quinta?',
      lastMessageTime: '13:20',
      unreadCount: 1,
      status: 'RESCHEDULE',
      service: 'Laser Lavieen & Glow',
      appointmentTime: 'Hoje, 16:30',
      messages: [
        {
          id: 'm21',
          sender: 'system',
          text: 'Olá, Mariana! 💕 Seu atendimento de Laser Lavieen & Glow está confirmado para hoje às 16:30 na Unidade Jardins.',
          time: '12:00',
          status: 'read',
        },
        {
          id: 'm22',
          sender: 'client',
          text: 'Tive um imprevisto na reunião, tem como transferir para quinta?',
          time: '13:20',
        },
      ],
    },
    {
      id: 'chat_3',
      clientName: 'Camila Fernandes',
      clientPhone: '(11) 96543-2199',
      avatarInitials: 'CF',
      lastMessage: 'Adorei a sobrancelha! Nota 10 com estrelinhas ⭐',
      lastMessageTime: '12:15',
      unreadCount: 0,
      status: 'CONFIRMED',
      service: 'Design com Henna Orgânica',
      appointmentTime: 'Hoje, 11:15',
      messages: [
        {
          id: 'm31',
          sender: 'system',
          text: 'Olá, Camila! ✨ Foi um prazer receber você na Unidade Jardins hoje. De 0 a 10, qual nota você daria para a experiência?',
          time: '12:05',
          status: 'read',
        },
        {
          id: 'm32',
          sender: 'client',
          text: 'Adorei a sobrancelha! Nota 10 com estrelinhas ⭐',
          time: '12:15',
        },
      ],
    },
  ]);

  const [selectedChatId, setSelectedChatId] = useState<string>('chat_1');
  const [chatReplyInput, setChatReplyInput] = useState('');

  // Modais de Edição e Teste
  const [editingTemplate, setEditingTemplate] = useState<WhatsAppTemplate | null>(null);
  const [testingTemplate, setTestingTemplate] = useState<WhatsAppTemplate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estados de Transmissão Rápida
  const [broadcastSegment, setBroadcastSegment] = useState<'today' | 'botox90' | 'birthday' | 'inactive'>('today');
  const [broadcastCustomMessage, setBroadcastCustomMessage] = useState('');
  const [broadcastSearch, setBroadcastSearch] = useState('');

  // Configuração de Conexão WhatsApp
  const [connectionMode, setConnectionMode] = useState<'meta' | 'qrcode'>('meta');
  const [qrCodeScanned, setQrCodeScanned] = useState(true);
  const [isRefreshingQr, setIsRefreshingQr] = useState(false);

  // Estados de Teste Interativo
  const [testClientName, setTestClientName] = useState('Helena Rostand');
  const [testPhone, setTestPhone] = useState('11981124433');
  const [testService, setTestService] = useState('Harmonização Facial & Peeling Rose');
  const [testDate, setTestDate] = useState('Amanhã, 22 de Outubro');
  const [testTime, setTestTime] = useState('14:00');
  const [testUnit, setTestUnit] = useState('Unidade Jardins');
  const [testProfessional, setTestProfessional] = useState('Dra. Camila');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Alternar ativação de automação
  const toggleTemplateActive = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.active;
          showToast(nextState ? `Régua "${t.name}" ativada!` : `Régua "${t.name}" pausada.`);
          return { ...t, active: nextState };
        }
        return t;
      })
    );
  };

  // Renderizar Mensagem com Tags Humanizadas
  const renderSampleText = (rawMessage: string) => {
    const parts = rawMessage.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, index) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        return (
          <span
            key={index}
            className="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/60 not-italic inline-block my-0.5"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Renderizar Preview Real com Variáveis Preenchidas
  const renderLiveSubstitutedText = (rawMessage: string) => {
    return rawMessage
      .replace(/\{\{nome_cliente\}\}/g, testClientName)
      .replace(/\{\{servico\}\}/g, testService)
      .replace(/\{\{data\}\}/g, testDate)
      .replace(/\{\{hora\}\}/g, testTime)
      .replace(/\{\{unidade\}\}/g, testUnit)
      .replace(/\{\{profissional\}\}/g, testProfessional)
      .replace(/\{\{link_agendar\}\}/g, 'https://aura.app/agendar');
  };

  // Inserir Tag Dinâmica no Editor
  const insertTag = (tag: string) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      message: editingTemplate.message + ` ${tag} `,
    });
  };

  // Salvar Edição do Template
  const handleSaveTemplate = () => {
    if (!editingTemplate) return;
    setTemplates((prev) =>
      prev.map((t) => (t.id === editingTemplate.id ? editingTemplate : t))
    );
    setEditingTemplate(null);
    showToast('Regra de WhatsApp salva e sincronizada com sucesso!');
  };

  // Disparar Teste
  const handleTriggerTest = (mode: 'simulate' | 'whatsapp') => {
    if (!testingTemplate) return;

    if (mode === 'whatsapp') {
      const text = renderLiveSubstitutedText(testingTemplate.message);
      const cleanPhone = testPhone.replace(/\D/g, '');
      const url = `https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      showToast('Abrindo WhatsApp Web com o disparo pré-formatado...');
    } else {
      const newItem: NotificationQueueItem = {
        id: `q_${Date.now()}`,
        clientName: testClientName,
        clientPhone: testPhone,
        serviceName: testService,
        scheduledFor: 'Agora (Simulação Imediata)',
        triggerName: testingTemplate.name,
        status: 'DELIVERED',
        preview: renderLiveSubstitutedText(testingTemplate.message).substring(0, 70) + '...',
        timestamp: 'Agora',
      };
      setQueue((prev) => [newItem, ...prev]);
      setTestingTemplate(null);
      showToast(`Disparo de teste para ${testClientName} processado na fila!`);
    }
  };

  // Enviar mensagem pelo simulador de chat
  const handleSendChatMessage = () => {
    if (!chatReplyInput.trim() || !selectedChatId) return;

    const newMessage = {
      id: `m_${Date.now()}`,
      sender: 'agent' as const,
      text: chatReplyInput,
      time: 'Agora',
      status: 'delivered' as const,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === selectedChatId) {
          return {
            ...conv,
            lastMessage: chatReplyInput,
            lastMessageTime: 'Agora',
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      })
    );

    setChatReplyInput('');
    showToast('Mensagem enviada com sucesso no atendimento!');
  };

  // Resposta rápida
  const handleQuickReply = (text: string) => {
    setChatReplyInput(text);
  };

  const selectedConversation = conversations.find((c) => c.id === selectedChatId) || conversations[0];

  // Base de clientes para transmissão
  const rawClients = dataService.getClients();
  const filteredBroadcastClients = useMemo(() => {
    let list = rawClients;
    if (broadcastSearch.trim()) {
      const q = broadcastSearch.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q));
    }
    return list;
  }, [rawClients, broadcastSearch]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 font-sans text-[#3A3A3A]">
      {/* TOAST FLUTUANTE DE SUCESSO */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-[#2D2725] text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 text-xs font-medium">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* CABEÇALHO DO MÓDULO & SWITCHER DE ABAS */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#8E8E8E]">
            <span className="font-semibold text-[#B69D8E] uppercase tracking-wider text-[11px]">Relacionamento & Crescimento</span>
            <span aria-hidden="true">·</span>
            <span>Meta Cloud API & WhatsApp Web</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">99.8% Entregabilidade</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3A3A3A] tracking-tight">
            Automação de WhatsApp
          </h1>
          <p className="text-sm text-[#8E8E8E] max-w-2xl leading-relaxed">
            Elimine o no-show, confirme presenças automaticamente e aumente a recompra da sua clínica sem sobrecarregar a recepção.
          </p>
        </div>

        {/* NAVEGAÇÃO DE SUB-ABAS (SEGMENTED CONTROL) */}
        <div className="flex items-center gap-1 p-1 bg-[#FAF8F6] border border-[#F1EBE7] rounded-2xl self-start lg:self-auto overflow-x-auto max-w-full">
          {[
            { id: 'reguas' as AutomationTab, label: 'Réguas Anti-No Show', icon: Zap },
            { id: 'transmissao' as AutomationTab, label: 'Transmissão & Campanhas', icon: Send },
            { id: 'chat' as AutomationTab, label: 'Central de Conversas', icon: MessageSquare, badge: '3' },
            { id: 'fila' as AutomationTab, label: 'Fila de Disparos', icon: Layers, badge: `${queue.length}` },
            { id: 'conexao' as AutomationTab, label: 'Conexão & Saúde', icon: QrCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#3A3A3A] shadow-2xs border border-[#F1EBE7]'
                    : 'text-[#8E8E8E] hover:text-[#3A3A3A] hover:bg-white/50'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#C5A059]' : 'text-[#8E8E8E]'} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-[#FAF5EB] text-[#C5A059]' : 'bg-[#F1EBE7] text-[#8E8E8E]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* STATUS DA CONEXÃO & MÉTRICAS ESSENCIAIS */}
      <section className="bg-white rounded-3xl p-6 border border-[#F1EBE7] shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 md:border-r md:border-[#F1EBE7] md:pr-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <MessageSquare size={24} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-[#3A3A3A]">Instância Conectada</p>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-[#8E8E8E] truncate">+55 (11) 98765-4321</p>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Meta Cloud API • Ativa</p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-xs text-[#8E8E8E]">Taxa de No-Show na Clínica</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-serif font-bold text-emerald-600">3.2%</span>
              <span className="text-xs text-[#8E8E8E] flex items-center gap-1">
                <TrendingDown size={13} className="text-emerald-500" />
                era 18.4%
              </span>
            </div>
            <span className="text-[11px] text-[#8E8E8E] mt-0.5">82% de redução no não comparecimento</span>
          </div>

          <div className="flex flex-col justify-center md:border-l md:border-[#F1EBE7] md:pl-6">
            <span className="text-xs text-[#8E8E8E]">Receita Preservada este Mês</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-serif font-bold text-[#3A3A3A]">R$ 14.800</span>
            </div>
            <span className="text-[11px] text-[#8E8E8E] mt-0.5">52 horários salvos por confirmação prévia</span>
          </div>

          <div className="flex flex-col justify-center md:border-l md:border-[#F1EBE7] md:pl-6">
            <span className="text-xs text-[#8E8E8E]">Tempo Médio de Resposta</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-serif font-bold text-[#3A3A3A]">14 min</span>
              <span className="text-xs text-emerald-600 font-medium">94.1% respondem</span>
            </div>
            <span className="text-[11px] text-[#8E8E8E] mt-0.5">Confirmação automática de grade</span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ABA 1: RÉGUAS AUTOMÁTICAS (ANTI-NO SHOW & CICLOS) */}
      {/* ============================================================ */}
      {activeTab === 'reguas' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#3A3A3A]">
                Réguas Operacionais de Disparo
              </h2>
              <p className="text-xs text-[#8E8E8E]">
                Mensagens enviadas automaticamente com base no ciclo de agendamento e atendimento.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8E8E8E]">
                {templates.filter((t) => t.active).length} de {templates.length} ativas
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {templates.map((tpl) => {
              const isTplActive = tpl.active;
              return (
                <div
                  key={tpl.id}
                  className={`bg-white p-6 rounded-3xl border transition-all space-y-5 shadow-2xs ${
                    isTplActive
                      ? 'border-[#F1EBE7] hover:border-[#EAD7D1]'
                      : 'border-[#F1EBE7]/60 opacity-60 bg-gray-50/40'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#FAF5EB] rounded-2xl text-[#C5A059] shrink-0 border border-[#F1EBE7]">
                        {tpl.iconType === 'check' && <CheckCircle2 size={20} />}
                        {tpl.iconType === 'clock' && <Clock size={20} />}
                        {tpl.iconType === 'star' && <Star size={20} />}
                        {tpl.iconType === 'rotate' && <RotateCcw size={20} />}
                        {tpl.iconType === 'heart' && <HeartHandshake size={20} />}
                        {tpl.iconType === 'cake' && <Cake size={20} />}
                        {tpl.iconType === 'sparkle' && <Sparkles size={20} />}
                        {tpl.iconType === 'shield' && <ShieldCheck size={20} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#3A3A3A] text-sm leading-snug">{tpl.name}</h4>
                        <p className="text-xs text-[#8E8E8E] mt-0.5">{tpl.triggerDescription}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleTemplateActive(tpl.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                          isTplActive
                            ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                            : 'text-gray-500 bg-gray-100 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        {isTplActive ? 'Ativa' : 'Pausada'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingTemplate({ ...tpl })}
                        className="p-2 text-[#8E8E8E] hover:text-[#3A3A3A] rounded-xl hover:bg-[#FAF8F6] border border-[#F1EBE7] transition-colors cursor-pointer"
                        title="Editar Mensagem & Tags"
                      >
                        <Settings2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* VISUALIZAÇÃO DA MENSAGEM COM TAGS DESTACADAS */}
                  <div className="bg-[#FAF8F6] p-4 rounded-2xl border border-[#F1EBE7] text-xs text-[#3A3A3A] leading-relaxed relative">
                    <div>{renderSampleText(tpl.message)}</div>
                  </div>

                  {/* RODAPÉ DO CARD */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs pt-2 border-t border-[#F1EBE7]">
                    <div className="flex items-center gap-2 text-[#8E8E8E]">
                      <Clock size={13} />
                      <span>{tpl.triggerLabel}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#8E8E8E]">
                        <strong className="text-[#3A3A3A]">{tpl.messagesSent}</strong> disparos
                      </span>
                      <button
                        type="button"
                        onClick={() => setTestingTemplate(tpl)}
                        className="text-[#C5A059] hover:text-[#A88544] font-semibold cursor-pointer flex items-center gap-1 transition-colors"
                      >
                        <Play size={13} className="fill-current" />
                        <span>Testar Envio</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* GUIA DE VARIÁVEIS INTELIGENTES */}
          <section className="bg-white rounded-3xl p-6 border border-[#F1EBE7] shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#3A3A3A]">
                Tags Dinâmicas Disponíveis (Substituição em Tempo Real)
              </h3>
              <p className="text-xs text-[#8E8E8E] mt-0.5">
                Utilize as variáveis abaixo para personalizar os disparos com os dados reais de cada atendimento.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { tag: '{{nome_cliente}}', desc: 'Primeiro nome da cliente', example: 'Helena' },
                { tag: '{{servico}}', desc: 'Procedimento agendado', example: 'Peeling Rose' },
                { tag: '{{data}}', desc: 'Data por extenso', example: '24 de Outubro' },
                { tag: '{{hora}}', desc: 'Horário do atendimento', example: '14:30' },
                { tag: '{{unidade}}', desc: 'Filial do atendimento', example: 'Unidade Jardins' },
                { tag: '{{profissional}}', desc: 'Especialista responsável', example: 'Dra. Camila' },
                { tag: '{{link_agendar}}', desc: 'Link direto de auto-agendamento', example: 'aura.app/r/8x9' },
              ].map((item) => (
                <div key={item.tag} className="p-3 rounded-2xl bg-[#FAF8F6] border border-[#F1EBE7] space-y-1">
                  <code className="text-xs font-mono font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-[#F1EBE7] inline-block">
                    {item.tag}
                  </code>
                  <p className="text-xs text-[#3A3A3A] font-medium">{item.desc}</p>
                  <p className="text-[11px] text-[#8E8E8E]">Ex: {item.example}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ============================================================ */}
      {/* ABA 2: TRANSMISSÃO & CAMPANHAS DIRETAS */}
      {/* ============================================================ */}
      {activeTab === 'transmissao' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PAINEL DE CONFIGURAÇÃO DE TRANSMISSÃO */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#F1EBE7] shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-base text-[#3A3A3A]">
                1. Selecione o Segmento Alvo
              </h3>

              <div className="space-y-2">
                {[
                  {
                    id: 'today' as const,
                    title: 'Grade de Hoje (Confirmação Pendente)',
                    desc: 'Clientes com horário hoje que ainda não confirmaram',
                    count: 4,
                  },
                  {
                    id: 'botox90' as const,
                    title: 'Retoque de Toxina Botulínica (+90 dias)',
                    desc: 'Clientes que fizeram aplicação há 3 meses ou mais',
                    count: 18,
                  },
                  {
                    id: 'birthday' as const,
                    title: 'Aniversariantes deste Mês',
                    desc: 'Clientes celebrando aniversário em Outubro',
                    count: 12,
                  },
                  {
                    id: 'inactive' as const,
                    title: 'Resgate de Clientes Inativas (+60 dias)',
                    desc: 'Clientes sem visita há mais de 2 meses',
                    count: 31,
                  },
                ].map((seg) => (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() => {
                      setBroadcastSegment(seg.id);
                      if (seg.id === 'today') {
                        setBroadcastCustomMessage('Olá, {{nome_cliente}}! 💕 Passando para confirmar seu horário hoje às {{hora}} na {{unidade}}. Podemos confirmar?');
                      } else if (seg.id === 'botox90') {
                        setBroadcastCustomMessage('Olá, {{nome_cliente}}! ✨ Já faz 3 meses desde sua aplicação de Toxina Botulínica. Para manter o efeito liso e preventivo, reservamos horários exclusivos essa semana!');
                      } else if (seg.id === 'birthday') {
                        setBroadcastCustomMessage('Parabéns, {{nome_cliente}}! 🎂 No seu mês especial, você tem um mimo de R$ 100 de crédito em procedimentos na {{unidade}}!');
                      } else {
                        setBroadcastCustomMessage('Sentimos sua falta, {{nome_cliente}}! 🌸 Preparamos um presente especial para renovar o seu bem-estar esta semana.');
                      }
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      broadcastSegment === seg.id
                        ? 'bg-[#FAF5EB] border-[#C5A059] text-[#3A3A3A]'
                        : 'bg-white border-[#F1EBE7] hover:bg-[#FAF8F6] text-[#8E8E8E]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#3A3A3A]">{seg.title}</span>
                      <span className="text-[11px] font-semibold text-[#C5A059] bg-white px-2 py-0.5 rounded-md border border-[#F1EBE7]">
                        {seg.count} clientes
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8E8E8E] mt-1">{seg.desc}</p>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-[#3A3A3A] block mb-2">
                  2. Mensagem da Campanha
                </label>
                <textarea
                  rows={5}
                  value={broadcastCustomMessage}
                  onChange={(e) => setBroadcastCustomMessage(e.target.value)}
                  placeholder="Escreva a mensagem personalizada..."
                  className="w-full text-xs p-3.5 rounded-2xl bg-[#FAF8F6] border border-[#F1EBE7] focus:border-[#C5A059] outline-none leading-relaxed"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  showToast(`Campanha agendada para ${filteredBroadcastClients.length} clientes na fila!`);
                }}
                className="w-full py-3 rounded-2xl bg-[#3A3A3A] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              >
                <Send size={14} />
                <span>Disparar Campanha para Lista</span>
              </button>
            </div>
          </div>

          {/* LISTAGEM DE CLIENTES DO SEGMENTO & PREVIEW */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#F1EBE7] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#3A3A3A]">
                    Clientes Selecionadas no Segmento ({filteredBroadcastClients.length})
                  </h3>
                  <p className="text-xs text-[#8E8E8E]">
                    Você pode disparar individualmente pelo WhatsApp Web ou agendar em lote.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-3 text-[#8E8E8E]" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou celular..."
                    value={broadcastSearch}
                    onChange={(e) => setBroadcastSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#FAF8F6] border border-[#F1EBE7] focus:border-[#C5A059] outline-none"
                  />
                </div>
              </div>

              <div className="divide-y divide-[#F1EBE7] max-h-[500px] overflow-y-auto">
                {filteredBroadcastClients.map((client) => {
                  const customizedText = broadcastCustomMessage
                    .replace(/\{\{nome_cliente\}\}/g, client.name.split(' ')[0])
                    .replace(/\{\{unidade\}\}/g, 'Unidade Jardins');

                  const cleanPhone = client.phone.replace(/\D/g, '');
                  const waUrl = `https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encodeURIComponent(customizedText)}`;

                  return (
                    <div
                      key={client.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F6] px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#FAF5EB] text-[#C5A059] flex items-center justify-center text-xs font-bold border border-[#F1EBE7]">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#3A3A3A]">{client.name}</p>
                          <p className="text-[11px] text-[#8E8E8E] font-mono">{client.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Send size={12} />
                          <span>Abrir no WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ABA 3: CENTRAL DE CONVERSAS & RESPOSTAS RÁPIDAS */}
      {/* ============================================================ */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white rounded-3xl border border-[#F1EBE7] shadow-2xs overflow-hidden min-h-[600px]">
          {/* LISTA DE CONVERSAS */}
          <div className="lg:col-span-1 border-r border-[#F1EBE7] flex flex-col">
            <div className="p-4 border-b border-[#F1EBE7] bg-[#FAF8F6]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif font-bold text-sm text-[#3A3A3A]">
                  Atendimentos Recentes
                </h3>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {conversations.length} ativas
                </span>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-[#8E8E8E]" />
                <input
                  type="text"
                  placeholder="Filtrar conversas..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#F1EBE7] outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#F1EBE7]">
              {conversations.map((conv) => {
                const isSelected = conv.id === selectedChatId;
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setSelectedChatId(conv.id)}
                    className={`w-full text-left p-4 transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected ? 'bg-[#FAF5EB]' : 'hover:bg-[#FAF8F6]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#EAD7D1] text-[#3A3A3A] flex items-center justify-center font-bold text-xs shrink-0 border border-white">
                      {conv.avatarInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#3A3A3A] truncate">{conv.clientName}</p>
                        <span className="text-[10px] text-[#8E8E8E]">{conv.lastMessageTime}</span>
                      </div>
                      <p className="text-[11px] text-[#8E8E8E] truncate mt-0.5">{conv.service}</p>
                      <p className="text-xs text-[#3A3A3A] truncate mt-1">{conv.lastMessage}</p>

                      <div className="flex items-center gap-1.5 mt-2">
                        {conv.status === 'CONFIRMED' && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Presença Confirmada
                          </span>
                        )}
                        {conv.status === 'RESCHEDULE' && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Solicitou Remarcação
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ÁREA DE CONVERSA ATIVA */}
          <div className="lg:col-span-2 flex flex-col bg-[#FDFCFB]">
            {/* Header do Chat */}
            <div className="p-4 bg-white border-b border-[#F1EBE7] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF5EB] text-[#C5A059] flex items-center justify-center font-bold text-xs border border-[#F1EBE7]">
                  {selectedConversation.avatarInitials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#3A3A3A]">{selectedConversation.clientName}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#8E8E8E]">
                    <span>{selectedConversation.clientPhone}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedConversation.appointmentTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=55${selectedConversation.clientPhone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-[#FAF8F6] border border-[#F1EBE7] hover:bg-white text-[#8E8E8E] hover:text-[#3A3A3A] transition-colors"
                  title="Abrir no WhatsApp Oficial"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            {/* Mensagens da Conversa */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#F5F2ED]/40">
              {selectedConversation.messages.map((msg) => {
                const isSystem = msg.sender === 'system';
                const isAgent = msg.sender === 'agent';
                const isClient = msg.sender === 'client';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isClient ? 'items-start' : 'items-end'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isSystem
                          ? 'bg-white text-[#3A3A3A] border border-[#F1EBE7] rounded-tr-none'
                          : isAgent
                          ? 'bg-[#EAD7D1] text-[#3A3A3A] rounded-tr-none font-medium'
                          : 'bg-white text-[#111B21] border border-[#DDD5CA] rounded-tl-none'
                      }`}
                    >
                      {isSystem && (
                        <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block mb-1">
                          Disparo Automático Aura
                        </span>
                      )}
                      <p>{msg.text}</p>
                      <div className="flex items-center justify-end gap-1 text-[10px] text-[#8E8E8E] mt-1">
                        <span>{msg.time}</span>
                        {msg.status && <CheckCheck size={12} className="text-[#53BDEB]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BARRA DE RESPOSTAS RÁPIDAS & INPUT */}
            <div className="p-4 bg-white border-t border-[#F1EBE7] space-y-3">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-wider shrink-0">
                  Respostas Rápidas:
                </span>
                {[
                  'Perfeito! Presença confirmada.',
                  'Olá! Gostaria de reagendar para qual dia?',
                  'Segue a localização e estacionamento da clínica.',
                  'Dúvida pós-procedimento? Nossa especialista já vai te responder!',
                ].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => handleQuickReply(quick)}
                    className="px-2.5 py-1 bg-[#FAF8F6] hover:bg-[#FAF5EB] text-[#3A3A3A] rounded-lg text-xs border border-[#F1EBE7] whitespace-nowrap transition-colors cursor-pointer shrink-0"
                  >
                    {quick}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Escreva uma resposta para a cliente..."
                  value={chatReplyInput}
                  onChange={(e) => setChatReplyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendChatMessage();
                  }}
                  className="flex-1 p-3 text-xs bg-[#FAF8F6] rounded-xl border border-[#F1EBE7] focus:border-[#C5A059] outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendChatMessage}
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors cursor-pointer shadow-2xs"
                  title="Enviar mensagem"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ABA 4: FILA DE DISPAROS & AUDITORIA */}
      {/* ============================================================ */}
      {activeTab === 'fila' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#F1EBE7] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-base text-[#3A3A3A]">
                  Fila Operacional de Disparos em Tempo Real
                </h3>
                <p className="text-xs text-[#8E8E8E]">
                  Worker de mensageria processando lembretes a cada 60 segundos com garantia de entrega.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Worker Operando</span>
              </div>
            </div>

            <div className="divide-y divide-[#F1EBE7]">
              {queue.map((item) => (
                <div key={item.id} className="py-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#3A3A3A]">{item.clientName}</span>
                      <span className="text-xs text-[#8E8E8E] font-mono">{item.clientPhone}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#8E8E8E]">{item.scheduledFor}</span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg ${
                          item.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'DELIVERED' || item.status === 'READ'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.status === 'CONFIRMED'
                          ? 'Confirmado'
                          : item.status === 'READ'
                          ? 'Lido'
                          : item.status === 'DELIVERED'
                          ? 'Entregue'
                          : 'Na Fila'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#8E8E8E]">
                    <span>{item.triggerName} • {item.serviceName}</span>
                  </div>

                  <p className="text-xs text-[#3A3A3A] bg-[#FAF8F6] p-3 rounded-xl border border-[#F1EBE7] font-normal leading-relaxed">
                    "{item.preview}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ABA 5: CONEXÃO & SAÚDE DO WHATSAPP */}
      {/* ============================================================ */}
      {activeTab === 'conexao' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CONEXÃO ATIVA */}
          <div className="bg-white rounded-3xl p-6 border border-[#F1EBE7] shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#3A3A3A]">
                Provedor de Conexão WhatsApp
              </h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Saudável (200 OK)
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F6] border border-[#F1EBE7] text-xs">
                <span className="text-[#8E8E8E]">Modo de Operação:</span>
                <span className="font-bold text-[#3A3A3A]">Meta Cloud API Oficial (WABA)</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F6] border border-[#F1EBE7] text-xs">
                <span className="text-[#8E8E8E]">Número Vinculado:</span>
                <span className="font-mono font-bold text-[#3A3A3A]">+55 (11) 98765-4321</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F6] border border-[#F1EBE7] text-xs">
                <span className="text-[#8E8E8E]">Webhook de Status:</span>
                <span className="font-semibold text-emerald-600">Sincronizado (Ativo)</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F6] border border-[#F1EBE7] text-xs">
                <span className="text-[#8E8E8E]">Latência do Servidor:</span>
                <span className="font-mono font-bold text-[#3A3A3A]">138ms</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                showToast('Ping enviado com sucesso! Conexão respondeu em 124ms com status 200 OK.');
              }}
              className="w-full py-3 rounded-2xl bg-[#FAF8F6] hover:bg-[#FAF5EB] text-[#3A3A3A] text-xs font-bold border border-[#F1EBE7] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} className="text-[#C5A059]" />
              <span>Testar Conexão e Latência</span>
            </button>
          </div>

          {/* CONEXÃO ALTERNATIVA (QR CODE / WHATSAPP WEB) */}
          <div className="bg-white rounded-3xl p-6 border border-[#F1EBE7] shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#3A3A3A]">
                Conectar via QR Code (WhatsApp Web)
              </h3>
              <span className="text-xs text-[#8E8E8E]">Alternativa Rápida</span>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-[#FAF8F6] rounded-2xl border border-[#F1EBE7] text-center space-y-4">
              <div className="w-36 h-36 bg-white p-3 rounded-2xl border border-[#F1EBE7] shadow-xs flex items-center justify-center relative">
                <QrCode size={110} className="text-[#3A3A3A]" />
                {isRefreshingQr && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                    <RefreshCw size={24} className="animate-spin text-[#C5A059]" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-[#3A3A3A]">
                  Escaneie com o WhatsApp da sua Clínica
                </p>
                <p className="text-[11px] text-[#8E8E8E] max-w-xs">
                  Abra o WhatsApp no celular &gt; Aparelhos Conectados &gt; Conectar um Aparelho.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsRefreshingQr(true);
                  setTimeout(() => {
                    setIsRefreshingQr(false);
                    showToast('QR Code renovado! Válido por 45 segundos.');
                  }, 800);
                }}
                className="text-xs text-[#C5A059] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>Atualizar QR Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: TESTAR ENVIO INTERATIVO */}
      {/* ============================================================ */}
      {testingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#F1EBE7] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#F1EBE7] pb-4">
              <div>
                <span className="text-[11px] font-semibold text-[#B69D8E] uppercase tracking-wider block">
                  Simulação de Disparo
                </span>
                <h3 className="text-xl font-serif font-bold text-[#3A3A3A]">
                  Testar Régua: {testingTemplate.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTestingTemplate(null)}
                className="p-2 text-[#8E8E8E] hover:text-[#3A3A3A] rounded-xl hover:bg-[#FAF8F6]"
              >
                <X size={20} />
              </button>
            </div>

            {/* CAMPOS DE TESTE */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3A3A3A] block mb-1">
                    Nome da Cliente
                  </label>
                  <input
                    type="text"
                    value={testClientName}
                    onChange={(e) => setTestClientName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#FAF8F6] border border-[#F1EBE7] focus:border-[#C5A059] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3A3A3A] block mb-1">
                    WhatsApp Destinatário
                  </label>
                  <input
                    type="text"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#FAF8F6] border border-[#F1EBE7] focus:border-[#C5A059] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3A3A3A] block mb-1">
                    Procedimento
                  </label>
                  <input
                    type="text"
                    value={testService}
                    onChange={(e) => setTestService(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#FAF8F6] border border-[#F1EBE7] focus:border-[#C5A059] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3A3A3A] block mb-1">
                    Data & Hora
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      className="w-2/3 text-xs p-3 rounded-xl bg-[#FAF8F6] border border-[#F1EBE7] focus:border-[#C5A059] outline-none"
                    />
                    <input
                      type="text"
                      value={testTime}
                      onChange={(e) => setTestTime(e.target.value)}
                      className="w-1/3 text-xs p-3 rounded-xl bg-[#FAF8F6] border border-[#F1EBE7] focus:border-[#C5A059] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PREVIEW DO BALÃO WHATSAPP */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#8E8E8E] block">
                Visualização Real na Tela da Cliente:
              </span>
              <div className="p-5 rounded-2xl bg-[#EFEAE2] border border-[#DDD5CA]">
                <div className="bg-white rounded-2xl rounded-tl-none p-4 max-w-[90%] shadow-2xs text-xs text-[#111B21] leading-relaxed space-y-2">
                  <p>{renderLiveSubstitutedText(testingTemplate.message)}</p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-[#667781] pt-1">
                    <span>14:02</span>
                    <span className="text-[#53BDEB] font-bold">✓✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AÇÕES DE DISPARO */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleTriggerTest('simulate')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#F1EBE7] hover:bg-[#FAF8F6] text-xs font-semibold text-[#3A3A3A] cursor-pointer"
              >
                Simular na Fila
              </button>
              <button
                type="button"
                onClick={() => handleTriggerTest('whatsapp')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Send size={14} />
                <span>Abrir no WhatsApp Real</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDITAR TEMPLATE DE AUTOMAÇÃO */}
      {/* ============================================================ */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#F1EBE7] space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#F1EBE7] pb-4">
              <div>
                <span className="text-[11px] font-semibold text-[#B69D8E] uppercase tracking-wider block">
                  Configuração de Régua
                </span>
                <h3 className="text-xl font-serif font-bold text-[#3A3A3A]">
                  Editar: {editingTemplate.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                className="p-2 text-[#8E8E8E] hover:text-[#3A3A3A] rounded-xl hover:bg-[#FAF8F6]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#3A3A3A] block mb-1">
                  Nome da Automação
                </label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-[#FAF8F6] border border-[#F1EBE7] focus:border-[#C5A059] outline-none font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3A3A3A] block mb-1">
                  Gatilho Temporal
                </label>
                <select
                  value={editingTemplate.triggerType}
                  onChange={(e: any) => {
                    const val = e.target.value;
                    let label = 'Disparo: Imediato ao agendar';
                    if (val === '24h_before') label = 'Disparo: 24h antes do horário';
                    if (val === '2h_before') label = 'Disparo: 2h antes do atendimento';
                    if (val === 'd1_after') label = 'Disparo: 24h pós-procedimento';
                    if (val === '2h_after') label = 'Disparo: 2h pós conclusão';
                    if (val === '30d_return') label = 'Disparo: 30 dias pós atendimento';
                    if (val === 'birthday') label = 'Disparo: No aniversário da cliente';
                    if (val === '60d_inactive') label = 'Disparo: 60 dias sem novo agendamento';
                    setEditingTemplate({
                      ...editingTemplate,
                      triggerType: val,
                      triggerLabel: label,
                    });
                  }}
                  className="w-full text-xs p-3 rounded-xl bg-[#FAF8F6] border border-[#F1EBE7] focus:border-[#C5A059] outline-none"
                >
                  <option value="immediate">Imediatamente ao criar agendamento</option>
                  <option value="24h_before">24 Horas antes do horário (Anti-No Show)</option>
                  <option value="2h_before">2 Horas antes (Lembrete de Proximidade)</option>
                  <option value="d1_after">24 Horas após (Orientações Pós-Procedimento)</option>
                  <option value="2h_after">2 Horas após conclusão (NPS & Avaliação)</option>
                  <option value="30d_return">30 Dias após (Retorno de Ciclo / Manutenção)</option>
                  <option value="birthday">No Aniversário da Cliente (Presente Especial)</option>
                  <option value="60d_inactive">60 Dias sem visita (Resgate de Cliente)</option>
                </select>
              </div>

              {/* BARRA DE TAGS CLICÁVEIS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#3A3A3A] block">
                    Mensagem da Régua
                  </label>
                  <span className="text-[11px] text-[#C5A059] font-medium">
                    Toque para inserir tag no texto:
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 p-2 rounded-2xl bg-[#FAF8F6] border border-[#F1EBE7]">
                  {[
                    '{{nome_cliente}}',
                    '{{servico}}',
                    '{{data}}',
                    '{{hora}}',
                    '{{unidade}}',
                    '{{profissional}}',
                    '{{link_agendar}}',
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => insertTag(tag)}
                      className="px-2.5 py-1 bg-white hover:bg-[#FAF5EB] text-[#3A3A3A] hover:text-[#C5A059] rounded-lg text-xs font-mono font-semibold border border-[#F1EBE7] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus size={11} />
                      {tag}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={5}
                  value={editingTemplate.message}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, message: e.target.value })}
                  className="w-full text-xs p-3.5 rounded-2xl bg-[#FAF8F6] border border-[#F1EBE7] focus:border-[#C5A059] outline-none leading-relaxed"
                  placeholder="Escreva a mensagem..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1EBE7]">
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                className="px-5 py-2.5 rounded-xl border border-[#F1EBE7] hover:bg-[#FAF8F6] text-xs font-semibold text-[#8E8E8E] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveTemplate}
                className="px-6 py-2.5 rounded-xl bg-[#3A3A3A] hover:bg-black text-white text-xs font-semibold shadow-2xs cursor-pointer"
              >
                Salvar Régua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppAutomation;
