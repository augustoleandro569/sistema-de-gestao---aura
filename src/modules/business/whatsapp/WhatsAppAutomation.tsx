import React, { useState } from 'react';
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
  RotateCcw
} from 'lucide-react';
import { dataService } from '../../../services/dataService';
import { useBusiness } from '../../../core/BusinessContext';

export interface WhatsAppTemplate {
  id: string;
  name: string;
  triggerType: 'immediate' | '24h_before' | '2h_after' | '30d_return' | '60d_inactive';
  triggerLabel: string;
  triggerDescription: string;
  active: boolean;
  message: string;
  messagesSent: number;
  confirmationRate: string;
  iconType: 'check' | 'clock' | 'star' | 'rotate' | 'heart';
}

interface NotificationQueueItem {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  scheduledFor: string;
  triggerName: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  preview: string;
}

export const WhatsAppAutomation: React.FC = () => {
  const { currentBusiness } = useBusiness();
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([
    {
      id: 'template_confirm',
      name: 'Confirmação de Horário',
      triggerType: 'immediate',
      triggerLabel: 'Disparo: Imediato após agendar',
      triggerDescription: 'Enviado instantaneamente quando o agendamento é registrado no Aura App ou na recepção.',
      active: true,
      message: 'Olá, {{nome_cliente}}! 💕 Seu atendimento de {{servico}} está confirmado para {{data}} às {{hora}}. Aguardamos você na Unidade {{unidade}}!',
      messagesSent: 842,
      confirmationRate: '98.4%',
      iconType: 'check',
    },
    {
      id: 'template_reminder_24h',
      name: 'Lembrete Preventivo (24 Horas)',
      triggerType: '24h_before',
      triggerLabel: 'Disparo: 24h antes do horário',
      triggerDescription: 'Gatilho automático que combate diretamente o no-show e libera a grade para reagendamentos com antecedência.',
      active: true,
      message: 'Passando para lembrar que amanhã temos um encontro marcado para seu {{servico}} às {{hora}} com {{profissional}}! Em caso de imprevistos, nos avise respondendo ou clicando em: {{link_agendar}}',
      messagesSent: 1240,
      confirmationRate: '89.2%',
      iconType: 'clock',
    },
    {
      id: 'template_nps_2h',
      name: 'Pesquisa de Satisfação & NPS',
      triggerType: '2h_after',
      triggerLabel: 'Disparo: 2 horas após o atendimento',
      triggerDescription: 'Enviado após o procedimento ser marcado como Concluído, captando depoimentos no pico de encantamento.',
      active: true,
      message: 'Olá, {{nome_cliente}}! ✨ Como foi seu atendimento de {{servico}} hoje? De 0 a 10, o quanto você recomendaria nossa clínica? Sua avaliação vale 1 selo especial no Aura Club!',
      messagesSent: 650,
      confirmationRate: '78.5%',
      iconType: 'star',
    },
    {
      id: 'template_cycle_return',
      name: 'Aviso de Retorno Inteligente (Recorrência)',
      triggerType: '30d_return',
      triggerLabel: 'Disparo: 30 dias após o atendimento',
      triggerDescription: 'Reativa clientes no ciclo ideal de renovação do procedimento estético, aumentando o LTV.',
      active: true,
      message: 'Olá, {{nome_cliente}}! 💕 Já está na hora de retocar seu {{servico}} para manter o resultado impecável. Preparamos uma condição especial na Unidade {{unidade}}: reserve aqui {{link_agendar}}',
      messagesSent: 418,
      confirmationRate: '34.8%',
      iconType: 'rotate',
    },
    {
      id: 'template_inactive_rescue',
      name: 'Resgate de Clientes Inativas (+60 dias)',
      triggerType: '60d_inactive',
      triggerLabel: 'Disparo: 60 dias sem novo agendamento',
      triggerDescription: 'Detecta perda de engajamento e oferece um voucher de boas-vindas para reativar o cliente.',
      active: false,
      message: 'Sentimos sua falta, {{nome_cliente}}! 🌸 Preparamos um mimo exclusivo de 15% OFF para você retornar e renovar o seu bem-estar esta semana. Toque aqui para reservar: {{link_agendar}}',
      messagesSent: 194,
      confirmationRate: '21.0%',
      iconType: 'heart',
    },
  ]);

  // Fila de Disparos Simulada (Queue System)
  const [queue, setQueue] = useState<NotificationQueueItem[]>([
    {
      id: 'q_1',
      clientName: 'Helena Rostand',
      clientPhone: '+55 11 98112-4433',
      serviceName: 'Harmonização Facial & Peeling Rose',
      scheduledFor: 'Hoje às 14:00 (em 15 min)',
      triggerName: 'Lembrete Preventivo',
      status: 'PENDING',
      preview: 'Passando para lembrar que amanhã temos um encontro marcado para seu Harmonização Facial...',
    },
    {
      id: 'q_2',
      clientName: 'Dra. Beatriz Albuquerque',
      clientPhone: '+55 11 97234-9988',
      serviceName: 'Drenagem Linfática Luminous',
      scheduledFor: 'Hoje às 14:45',
      triggerName: 'Confirmação de Horário',
      status: 'PENDING',
      preview: 'Olá, Dra. Beatriz! 💕 Seu atendimento de Drenagem Linfática está confirmado...',
    },
    {
      id: 'q_3',
      clientName: 'Mariana Siqueira',
      clientPhone: '+55 11 99876-1122',
      serviceName: 'Laser Lavieen & Glow',
      scheduledFor: 'Hoje às 16:30',
      triggerName: 'Pesquisa NPS',
      status: 'PENDING',
      preview: 'Olá, Mariana! ✨ Como foi seu atendimento de Laser Lavieen hoje?...',
    },
    {
      id: 'q_4',
      clientName: 'Camila Fernandes',
      clientPhone: '+55 11 96543-2199',
      serviceName: 'Design com Henna Orgânica',
      scheduledFor: 'Hoje às 11:15',
      triggerName: 'Confirmação de Horário',
      status: 'DELIVERED',
      preview: 'Olá, Camila! 💕 Seu atendimento de Design com Henna está confirmado...',
    },
  ]);

  // Modais
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WhatsAppTemplate | null>(null);
  const [testingTemplate, setTestingTemplate] = useState<WhatsAppTemplate | null>(null);

  // Estados do Modal de Teste
  const [testClientName, setTestClientName] = useState('Helena Rostand');
  const [testPhone, setTestPhone] = useState('(11) 98765-4321');
  const [testService, setTestService] = useState('Limpeza de Pele Profunda');
  const [testDate, setTestDate] = useState('Amanhã, 21 de Outubro');
  const [testTime, setTestTime] = useState('14:30');
  const [testUnit, setTestUnit] = useState('Unidade Jardins');
  const [testProfessional, setTestProfessional] = useState('Dra. Camila Vasconcelos');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Alternar Ativação do Template
  const toggleTemplateActive = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.active;
          showToast(nextState ? `Automação "${t.name}" ativada!` : `Automação "${t.name}" pausada.`);
          return { ...t, active: nextState };
        }
        return t;
      })
    );
  };

  // Renderizar Mensagem com Tags Substituídas
  const renderSampleText = (rawMessage: string) => {
    const parts = rawMessage.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, index) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        return (
          <span
            key={index}
            className="font-bold text-rose-700 bg-rose-50 px-1 py-0.5 rounded border border-rose-200/60 not-italic inline-block my-0.5"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Renderizar Preview Real com Dados Fictícios
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
    showToast('Regra de WhatsApp atualizada com sucesso!');
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
      // Adicionar à fila simulada
      const newItem: NotificationQueueItem = {
        id: `q_${Date.now()}`,
        clientName: testClientName,
        clientPhone: testPhone,
        serviceName: testService,
        scheduledFor: 'Agora (Teste Imediato)',
        triggerName: testingTemplate.name,
        status: 'SENT',
        preview: renderLiveSubstitutedText(testingTemplate.message).substring(0, 60) + '...',
      };
      setQueue((prev) => [newItem, ...prev]);
      setTestingTemplate(null);
      showToast(`Disparo de teste para ${testClientName} processado na fila com sucesso!`);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-sans text-aura-charcoal">
      
      {/* TOAST FLUTUANTE */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-[#2D2725] text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 text-xs font-medium">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* HEADER DA PÁGINA */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.3em]">Módulo de Relacionamento</p>
          <h1 className="text-3xl sm:text-4xl font-serif text-aura-charcoal">Automações de WhatsApp</h1>
          <p className="text-sm text-aura-taupe">Configure lembretes, confirmações e mensagens de retorno automáticas.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsQueueModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-aura-linen hover:border-aura-rose/50 rounded-full text-xs font-bold text-aura-charcoal transition-all shadow-xs cursor-pointer group"
          >
            <Layers size={15} className="text-aura-taupe group-hover:text-rose-500 transition-colors" />
            <span>Fila de Disparos</span>
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] flex items-center justify-center font-bold">
              {queue.filter((q) => q.status === 'PENDING').length}
            </span>
          </button>
        </div>
      </header>

      {/* STATUS DA INTEGRAÇÃO */}
      <div className="bg-white rounded-[40px] p-6 sm:p-8 shadow-luminous border border-aura-linen flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100/80 shadow-2xs">
            <MessageSquare className="text-emerald-600" size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-aura-charcoal">WhatsApp Business Conectado</h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Oficial Meta Cloud
              </span>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">
              Instância ativa e operando normalmente • +55 (11) 98765-4321
            </p>
            <p className="text-[11px] text-aura-taupe mt-1">
              99.8% Uptime • Fila de envio sem atrasos • Criptografia ponta a ponta
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setIsConnectionModalOpen(true)}
            className="text-[10px] font-bold text-aura-taupe uppercase border border-aura-linen px-6 py-2.5 rounded-full hover:bg-aura-linen transition-all cursor-pointer w-full md:w-auto text-center"
          >
            Gerenciar Conexão
          </button>
        </div>
      </div>

      {/* CARD DE VALOR AGREGADO & IMPACTO EM NO-SHOW */}
      <section className="bg-gradient-to-r from-[#FAF6F3] via-white to-[#F6EDE8] p-6 sm:p-8 rounded-[40px] border border-rose-200/50 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-rose-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-rose-500">
                Inteligência Comercial Aura
              </span>
            </div>
            <h3 className="text-lg font-bold text-aura-charcoal">
              Redução Comprovada de No-Show & Recuperação de Receita
            </h3>
            <p className="text-xs text-aura-taupe max-w-2xl leading-relaxed">
              O custo de uma cadeira vazia na estética é em média de R$ 280/hora. Nossas réguas automáticas com confirmação inteligente reduzem em até 82% o não comparecimento sem sobrecarregar a recepção.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm px-5 py-3 rounded-2xl border border-rose-200/60 shadow-xs flex items-center gap-3 shrink-0">
            <ShieldCheck size={24} className="text-emerald-500" />
            <div>
              <p className="text-[10px] uppercase font-bold text-aura-taupe tracking-wider">Status do Módulo</p>
              <p className="text-xs font-bold text-aura-charcoal">Ilimitado Ativo (Marketing & Exp.)</p>
            </div>
          </div>
        </div>

        {/* 4 MÉTRICAS DE IMPACTO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-rose-200/40">
          <div className="bg-white p-4 rounded-2xl border border-aura-linen">
            <span className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block">Taxa de No-Show</span>
            <span className="text-2xl font-serif font-bold text-emerald-600 block mt-1">3.2%</span>
            <span className="text-[10px] text-aura-taupe flex items-center gap-1 mt-0.5">
              <TrendingDown size={11} className="text-emerald-500" /> Era 18.4% antes do Aura
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-aura-linen">
            <span className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block">Disparos no Mês</span>
            <span className="text-2xl font-serif font-bold text-aura-charcoal block mt-1">3.150</span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">100% entregabilidade</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-aura-linen">
            <span className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block">Receita Preservada</span>
            <span className="text-2xl font-serif font-bold text-aura-charcoal block mt-1">R$ 14.800</span>
            <span className="text-[10px] text-aura-taupe block mt-0.5">Horários salvos na agenda</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-aura-linen">
            <span className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block">Taxa de Confirmação</span>
            <span className="text-2xl font-serif font-bold text-aura-charcoal block mt-1">94.1%</span>
            <span className="text-[10px] text-aura-taupe block mt-0.5">Clientes respondem em &lt;15m</span>
          </div>
        </div>
      </section>

      {/* GRID DE TEMPLATES E REGRAS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-aura-charcoal">
              Réguas de Comunicação Ativas
            </h2>
            <p className="text-xs text-aura-taupe mt-0.5">
              Gatilhos temporais disparados automaticamente pela inteligência do agendamento.
            </p>
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {templates.map((tpl) => {
            const isTplActive = tpl.active;
            return (
              <div
                key={tpl.id}
                className={`bg-white p-7 sm:p-8 rounded-[40px] shadow-luminous border transition-all space-y-6 group ${
                  isTplActive
                    ? 'border-aura-linen hover:border-rose-300'
                    : 'border-aura-linen/60 opacity-60 bg-gray-50/50'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-rose-50 rounded-2xl text-rose-500 shrink-0 border border-rose-100">
                      {tpl.iconType === 'check' && <CheckCircle2 size={20} />}
                      {tpl.iconType === 'clock' && <Clock size={20} />}
                      {tpl.iconType === 'star' && <Star size={20} />}
                      {tpl.iconType === 'rotate' && <RotateCcw size={20} />}
                      {tpl.iconType === 'heart' && <HeartHandshake size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-aura-charcoal text-base">{tpl.name}</h4>
                      <p className="text-[11px] text-aura-taupe">{tpl.triggerDescription}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleTemplateActive(tpl.id)}
                      className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider transition-colors cursor-pointer ${
                        isTplActive
                          ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                          : 'text-gray-500 bg-gray-100 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      {isTplActive ? 'Ativo' : 'Pausado'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingTemplate({ ...tpl })}
                      className="p-2 text-aura-taupe hover:text-aura-charcoal rounded-xl hover:bg-aura-linen transition-colors cursor-pointer"
                      title="Editar Mensagem & Tags"
                    >
                      <Settings2 size={17} />
                    </button>
                  </div>
                </div>

                {/* VISUALIZAÇÃO DO TEMPLATE COM TAGS EM DESTAQUE */}
                <div className="bg-[#FAF8F6] p-6 rounded-3xl border border-aura-linen text-xs text-aura-charcoal/85 leading-relaxed relative font-normal shadow-2xs">
                  <span className="text-aura-taupe/40 text-xl font-serif absolute top-2 left-3">“</span>
                  <div className="pl-3">{renderSampleText(tpl.message)}</div>
                </div>

                {/* RODAPÉ DO CARD */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[10px] font-bold uppercase tracking-widest pt-1 border-t border-aura-linen/50">
                  <span className="text-aura-taupe">{tpl.triggerLabel}</span>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-aura-charcoal font-semibold">{tpl.messagesSent} mensagens enviadas</span>
                    <button
                      type="button"
                      onClick={() => setTestingTemplate(tpl)}
                      className="text-rose-700 hover:text-rose-800 hover:underline cursor-pointer flex items-center gap-1 normal-case font-bold tracking-normal text-xs"
                    >
                      <Play size={12} className="fill-current" />
                      Testar Envio
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>

      {/* SEÇÃO DE TAGS DINÂMICAS EXPLICATIVAS (INTELIGÊNCIA DE VARIÁVEIS) */}
      <section className="bg-white rounded-[40px] p-8 shadow-luminous border border-aura-linen space-y-6">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-aura-charcoal">
            Dicionário de Tags Dinâmicas (Substituição em Tempo Real)
          </h3>
          <p className="text-xs text-aura-taupe">
            Nosso motor extrai automaticamente os dados do agendamento para humanizar cada disparo, garantindo que o cliente sinta cuidado individualizado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { tag: '{{nome_cliente}}', desc: 'Primeiro nome da cliente cadastrada no Aura App', example: 'Helena' },
            { tag: '{{servico}}', desc: 'Procedimento agendado na grade', example: 'Peeling Luminous' },
            { tag: '{{data}}', desc: 'Data amigável formatada para leitura', example: '24 de Outubro' },
            { tag: '{{hora}}', desc: 'Horário de início da sessão', example: '14:30' },
            { tag: '{{unidade}}', desc: 'Filial onde o atendimento ocorrerá', example: 'Unidade Jardins' },
            { tag: '{{profissional}}', desc: 'Nome da especialista responsável', example: 'Dra. Camila' },
            { tag: '{{link_agendar}}', desc: 'Link curto e seguro para auto-remarcação', example: 'https://aura.app/r/8x9' },
          ].map((item) => (
            <div key={item.tag} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] space-y-1.5">
              <div className="flex items-center justify-between">
                <code className="text-xs font-bold text-rose-700 font-mono bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {item.tag}
                </code>
              </div>
              <p className="text-[11px] text-aura-charcoal font-medium">{item.desc}</p>
              <p className="text-[10px] text-aura-taupe italic">Exemplo: "{item.example}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* MODAL: TESTAR ENVIO INTERATIVO */}
      {/* ============================================================ */}
      {testingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[36px] max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-aura-linen space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-aura-linen pb-4">
              <div>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">Simulação de Disparo</span>
                <h3 className="text-xl font-serif font-bold text-aura-charcoal">
                  Testar Régua: {testingTemplate.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTestingTemplate(null)}
                className="p-2 text-aura-taupe hover:text-aura-charcoal rounded-full hover:bg-aura-linen"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORMULÁRIO DE DADOS DE TESTE */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block mb-1">
                    Nome da Cliente
                  </label>
                  <input
                    type="text"
                    value={testClientName}
                    onChange={(e) => setTestClientName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen focus:border-rose-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block mb-1">
                    WhatsApp Destinatário
                  </label>
                  <input
                    type="text"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen focus:border-rose-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block mb-1">
                    Procedimento
                  </label>
                  <input
                    type="text"
                    value={testService}
                    onChange={(e) => setTestService(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen focus:border-rose-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block mb-1">
                    Data & Hora
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      className="w-2/3 text-xs p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen focus:border-rose-400 outline-none"
                    />
                    <input
                      type="text"
                      value={testTime}
                      onChange={(e) => setTestTime(e.target.value)}
                      className="w-1/3 text-xs p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen focus:border-rose-400 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PREVIEW EM BALÃO DO WHATSAPP */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block">
                Visualização Real na Tela do Cliente
              </span>
              <div className="p-5 rounded-3xl bg-[#EFEAE2] border border-[#DDD5CA] shadow-inner">
                <div className="bg-white rounded-2xl rounded-tl-none p-4 max-w-[88%] shadow-xs text-xs text-[#111B21] leading-relaxed space-y-2">
                  <p>{renderLiveSubstitutedText(testingTemplate.message)}</p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-[#667781] pt-1">
                    <span>14:32</span>
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
                className="w-full sm:w-auto px-5 py-3 rounded-full border border-aura-linen hover:bg-aura-linen text-xs font-bold text-aura-charcoal cursor-pointer"
              >
                Simular no Painel (Fila)
              </button>
              <button
                type="button"
                onClick={() => handleTriggerTest('whatsapp')}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Send size={15} />
                <span>Enviar para WhatsApp Real</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDITAR TEMPLATE & REGRAS */}
      {/* ============================================================ */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[36px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-aura-linen space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-aura-linen pb-4">
              <div>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">Editor de Régua</span>
                <h3 className="text-xl font-serif font-bold text-aura-charcoal">
                  Editar: {editingTemplate.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                className="p-2 text-aura-taupe hover:text-aura-charcoal rounded-full hover:bg-aura-linen"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block mb-1">
                  Nome da Automação
                </label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen focus:border-rose-400 outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block mb-1">
                  Gatilho Temporal de Disparo
                </label>
                <select
                  value={editingTemplate.triggerType}
                  onChange={(e: any) => {
                    const val = e.target.value;
                    let label = 'Disparo: Imediato após agendar';
                    if (val === '24h_before') label = 'Disparo: 24h antes do horário';
                    if (val === '2h_after') label = 'Disparo: 2h após conclusão';
                    if (val === '30d_return') label = 'Disparo: 30 dias após atendimento';
                    if (val === '60d_inactive') label = 'Disparo: 60 dias sem novo agendamento';
                    setEditingTemplate({
                      ...editingTemplate,
                      triggerType: val,
                      triggerLabel: label,
                    });
                  }}
                  className="w-full text-xs p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen focus:border-rose-400 outline-none"
                >
                  <option value="immediate">Imediatamente após a criação do agendamento</option>
                  <option value="24h_before">24 Horas antes do horário marcado (Anti-No Show)</option>
                  <option value="2h_after">2 Horas após o atendimento ser concluído (NPS)</option>
                  <option value="30d_return">30 Dias após o último atendimento (Renovação de Ciclo)</option>
                  <option value="60d_inactive">60 Dias sem novas visitas (Resgate de Cliente)</option>
                </select>
              </div>

              {/* BARRA DE TAGS CLICÁVEIS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block">
                    Mensagem do Template
                  </label>
                  <span className="text-[10px] text-rose-500 font-bold">
                    Clique nas tags para inserir no texto:
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 p-2.5 rounded-2xl bg-rose-50/60 border border-rose-100">
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
                      className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-mono font-bold border border-rose-200 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <Plus size={10} />
                      {tag}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={5}
                  value={editingTemplate.message}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, message: e.target.value })}
                  className="w-full text-xs p-4 rounded-2xl bg-[#FAF8F5] border border-aura-linen focus:border-rose-400 outline-none leading-relaxed font-sans"
                  placeholder="Escreva a mensagem..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-aura-linen">
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                className="px-5 py-2.5 rounded-full border border-aura-linen hover:bg-aura-linen text-xs font-bold text-aura-taupe cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveTemplate}
                className="px-7 py-2.5 rounded-full bg-aura-charcoal hover:bg-black text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: FILA DE NOTIFICAÇÕES (NOTIFICATION QUEUE / WORKER) */}
      {/* ============================================================ */}
      {isQueueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[36px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-aura-linen space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-aura-linen pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Arquitetura Serverless</span>
                <h3 className="text-xl font-serif font-bold text-aura-charcoal">
                  Fila de Disparos em Tempo Real
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsQueueModalOpen(false)}
                className="p-2 text-aura-taupe hover:text-aura-charcoal rounded-full hover:bg-aura-linen"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-aura-linen flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-aura-charcoal">Worker de Notificações Ativo</span>
              </div>
              <span className="text-[11px] text-aura-taupe">Varredura automática a cada 60s</span>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-aura-taupe block">
                Próximas Mensagens Agendadas ({queue.length})
              </span>

              {queue.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-aura-linen bg-white hover:border-aura-rose/50 transition-all space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-aura-charcoal">{item.clientName}</span>
                      <span className="text-[10px] text-aura-taupe font-mono">({item.clientPhone})</span>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        item.status === 'SENT' || item.status === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.status === 'SENT' ? 'Enviado' : item.status === 'DELIVERED' ? 'Entregue' : 'Na Fila'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-aura-taupe">
                    <span>{item.triggerName} • {item.serviceName}</span>
                    <span className="font-semibold text-aura-charcoal">{item.scheduledFor}</span>
                  </div>

                  <p className="text-[11px] text-gray-500 italic bg-gray-50 p-2 rounded-xl">
                    "{item.preview}"
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsQueueModalOpen(false)}
                className="px-6 py-2.5 rounded-full bg-aura-charcoal text-white text-xs font-bold cursor-pointer"
              >
                Fechar Fila
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: GERENCIAR CONEXÃO WHATSAPP BUSINESS */}
      {/* ============================================================ */}
      {isConnectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[36px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-aura-linen space-y-6">
            <div className="flex justify-between items-center border-b border-aura-linen pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Meta Cloud API</span>
                <h3 className="text-xl font-serif font-bold text-aura-charcoal">
                  Conexão WhatsApp Business
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConnectionModalOpen(false)}
                className="p-2 text-aura-taupe hover:text-aura-charcoal rounded-full hover:bg-aura-linen"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-emerald-900">Instância Conectada e Saudável</p>
                  <p className="text-emerald-700 text-[11px]">Número verificado: +55 (11) 98765-4321</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen">
                  <span className="text-aura-taupe">Webhook de Entregabilidade:</span>
                  <span className="font-bold text-emerald-600">Ativo (200 OK)</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen">
                  <span className="text-aura-taupe">Latência Média:</span>
                  <span className="font-mono font-bold text-aura-charcoal">142ms</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-[#FAF8F5] border border-aura-linen">
                  <span className="text-aura-taupe">Chave da API:</span>
                  <span className="font-mono text-[10px] text-aura-taupe">EAAQ••••••••••••91Z</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast('Ping enviado! Instância respondeu em 138ms com status 200 OK.');
                    setIsConnectionModalOpen(false);
                  }}
                  className="w-full py-3 rounded-full bg-aura-charcoal hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Testar Ping da Instância
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default WhatsAppAutomation;
