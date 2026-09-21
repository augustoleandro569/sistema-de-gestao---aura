// src/modules/marketplace/LoyaltyClub.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Trophy,
  History,
  ShieldCheck,
  Gift,
  ChevronRight,
  Store,
  CheckCircle2,
  Lock,
  ArrowRight,
  QrCode,
  X,
  ExternalLink,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

export interface LoyaltyClubProps {
  stamps?: number;
  initialEstablishmentId?: string;
  onNavigateToBooking?: (clinicName?: string) => void;
}

interface EstablishmentLoyaltyCard {
  id: string;
  businessName: string;
  unitName: string;
  category: string;
  stamps: number;
  maxStamps: number;
  rewardTitle: string;
  rewardAvailable: boolean;
  history: {
    id: string;
    serviceName: string;
    date: string;
    professional: string;
    unit: string;
  }[];
}

export const LoyaltyClub: React.FC<LoyaltyClubProps> = ({
  stamps: externalStamps,
  initialEstablishmentId,
  onNavigateToBooking,
}) => {
  const { userProfile } = useAuth();
  const [activeEstablishmentId, setActiveEstablishmentId] = useState<string>(
    initialEstablishmentId || 'est-1'
  );
  const [redeemModalOpen, setRedeemModalOpen] = useState<boolean>(false);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [voucherCopied, setVoucherCopied] = useState<boolean>(false);
  const [localVersion, setLocalVersion] = useState(0);

  // Escuta alterações de agendamentos e cartões no dataService
  useEffect(() => {
    const unsub = dataService.subscribe(() => setLocalVersion((v) => v + 1));
    return unsub;
  }, []);

  // Dados multi-clínica integrados ao sistema Aura
  const establishments: EstablishmentLoyaltyCard[] = useMemo(() => {
    const clientId = userProfile?.clientId || userProfile?.id || 'cli-1';
    const primaryCard = dataService.getLoyaltyCardByClientId(clientId);
    const primaryStamps =
      externalStamps !== undefined
        ? externalStamps
        : primaryCard?.stampsCount ?? primaryCard?.stamps_count ?? 7;

    // Buscar histórico de agendamentos finalizados do cliente
    const allAppointments = dataService.getAppointments();
    const finishedAppts = allAppointments
      .filter((a) => a.status === 'finalizado' && (a.clientId === clientId || !a.clientId))
      .slice(0, 3)
      .map((a) => ({
        id: a.id,
        serviceName: a.serviceName,
        date: new Date(a.date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
        }),
        professional: a.professionalName,
        unit: 'Unidade Jardins',
      }));

    const defaultHistory1 =
      finishedAppts.length > 0
        ? finishedAppts
        : [
            {
              id: 'h-1',
              serviceName: 'Limpeza de Pele Glow & Peeling',
              date: '12 de Setembro',
              professional: 'Dra. Camila Vasconcelos',
              unit: 'Unidade Jardins',
            },
            {
              id: 'h-2',
              serviceName: 'Drenagem Linfática Facial Criogênica',
              date: '28 de Agosto',
              professional: 'Mariana Lima',
              unit: 'Unidade Jardins',
            },
          ];

    return [
      {
        id: 'est-1',
        businessName: 'Sublime Estética Avançada',
        unitName: 'Unidade Jardins',
        category: 'Estética Facial & Corporal',
        stamps: primaryStamps,
        maxStamps: 10,
        rewardTitle: 'Limpeza de Pele Diamante com Máscara Ouro',
        rewardAvailable: primaryStamps >= 10,
        history: defaultHistory1,
      },
      {
        id: 'est-2',
        businessName: 'Studio Bella Sobrancelhas & Glow',
        unitName: 'Unidade Itaim Bibi',
        category: 'Design & Harmonização do Olhar',
        stamps: 4,
        maxStamps: 10,
        rewardTitle: 'Design Personalizado + Hidragloss Labial',
        rewardAvailable: false,
        history: [
          {
            id: 'h-3',
            serviceName: 'Brow Lamination & Design',
            date: '05 de Setembro',
            professional: 'Juliana Costa',
            unit: 'Unidade Itaim Bibi',
          },
          {
            id: 'h-4',
            serviceName: 'Coloração Refectocil com Queratina',
            date: '15 de Agosto',
            professional: 'Juliana Costa',
            unit: 'Unidade Itaim Bibi',
          },
        ],
      },
      {
        id: 'est-3',
        businessName: 'Atelier Facial & Laser',
        unitName: 'Unidade Moema',
        category: 'Laser & Rejuvenescimento',
        stamps: 10,
        maxStamps: 10,
        rewardTitle: 'Sessão Laser Rejuvenescimento Facial',
        rewardAvailable: true,
        history: [
          {
            id: 'h-5',
            serviceName: 'Laser Fracionado Não Ablativo',
            date: '02 de Setembro',
            professional: 'Dr. Roberto Mendes',
            unit: 'Unidade Moema',
          },
        ],
      },
    ];
  }, [userProfile, externalStamps, localVersion]);

  // Cartão selecionado
  const currentCard = useMemo(() => {
    return (
      establishments.find((e) => e.id === activeEstablishmentId) ||
      establishments[0]
    );
  }, [establishments, activeEstablishmentId]);

  const stamps = currentCard.stamps;

  const handleOpenRedeem = () => {
    const randomCode = `AURA-${currentCard.businessName
      .substring(0, 3)
      .toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setVoucherCode(randomCode);
    setRedeemModalOpen(true);
  };

  const handleCopyVoucher = () => {
    if (voucherCode) {
      navigator.clipboard?.writeText(voucherCode);
      setVoucherCopied(true);
      setTimeout(() => setVoucherCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-700 pb-24 px-4 font-sans text-aura-charcoal">
      {/* HEADER DO CLUBE */}
      <header className="text-center pt-8">
        <div className="inline-flex p-3.5 bg-aura-rose/25 rounded-2xl mb-4 shadow-soft-glow ring-1 ring-aura-rose/50">
          <Trophy className="text-[#C26B54]" size={28} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-aura-charcoal font-bold tracking-tight">
          Aura Club
        </h1>
        <p className="text-[10px] text-aura-taupe font-bold uppercase tracking-[0.3em] mt-2">
          Sua fidelidade recompensada
        </p>
      </header>

      {/* SELETOR MULTI-CLÍNICA: CARTÕES POR ESTABELECIMENTO */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-bold text-aura-taupe uppercase tracking-widest flex items-center gap-1.5">
            <Store size={13} className="text-aura-gold" />
            Cartões por Estabelecimento
          </span>
          <span className="text-[10px] font-medium text-aura-slate">
            {establishments.length} estabelecimentos
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {establishments.map((est) => {
            const isSelected = est.id === currentCard.id;
            return (
              <button
                key={est.id}
                type="button"
                onClick={() => setActiveEstablishmentId(est.id)}
                className={`px-4 py-2.5 rounded-2xl text-left shrink-0 transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-white border-aura-charcoal shadow-sm ring-1 ring-aura-charcoal/10'
                    : 'bg-white/60 border-aura-linen hover:bg-white hover:border-aura-border'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      est.rewardAvailable
                        ? 'bg-emerald-500 animate-pulse'
                        : isSelected
                        ? 'bg-[#C26B54]'
                        : 'bg-aura-slate/40'
                    }`}
                  />
                  <p className="text-xs font-bold text-aura-charcoal truncate max-w-[170px]">
                    {est.businessName}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 mt-1">
                  <span className="text-[10px] text-aura-slate">
                    {est.unitName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      est.rewardAvailable
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-aura-linen text-aura-charcoal'
                    }`}
                  >
                    {est.stamps}/10
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CARTÃO DIGITAL 10+1 (O CORAÇÃO DO MÓDULO) */}
      <section className="bg-white rounded-[48px] p-8 shadow-luminous border border-aura-linen relative overflow-hidden transition-all duration-500">
        {/* Glow Luminous Luxury de Fundo */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-aura-rose/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-aura-gold/10 rounded-full blur-3xl pointer-events-none" />

        {/* CABEÇALHO DO CARTÃO */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
          <div>
            <h2 className="text-xs font-bold text-aura-charcoal uppercase tracking-widest flex items-center gap-1.5">
              <span>Cartão de Selos</span>
              <span className="text-aura-slate/50 font-normal">•</span>
              <span className="text-aura-taupe font-medium normal-case">
                {currentCard.businessName}
              </span>
            </h2>
            <p className="text-[10px] text-aura-slate mt-0.5">
              {currentCard.unitName}
            </p>
          </div>

          <span className="text-[10px] font-bold text-[#C26B54] bg-aura-rose/20 px-3.5 py-1.5 rounded-full border border-aura-rose/40 shadow-xs flex items-center gap-1.5">
            <Sparkles size={12} />
            <span>{stamps} de 10 concluídos</span>
          </span>
        </div>

        {/* GRID DE SELOS PREMIUM (5 colunas x 2 linhas) */}
        <div className="grid grid-cols-5 gap-3.5 sm:gap-4">
          {[...Array(10)].map((_, i) => {
            const isCompleted = i < stamps;
            const isNext = i === stamps;

            return (
              <div
                key={i}
                title={isCompleted ? `Selo #${i + 1} creditado` : `Selo #${i + 1} pendente`}
                className={`aspect-square rounded-full flex items-center justify-center border-2 transition-all duration-700 relative group ${
                  isCompleted
                    ? 'bg-aura-rose/20 border-[#C26B54] text-[#C26B54] shadow-soft-glow scale-105'
                    : isNext
                    ? 'bg-aura-pearl border-dashed border-aura-taupe/60 text-aura-taupe'
                    : 'bg-aura-pearl border-aura-linen text-aura-slate/50'
                }`}
              >
                {isCompleted ? (
                  <Sparkles
                    size={19}
                    className="animate-pulse duration-1000"
                    fill="currentColor"
                  />
                ) : (
                  <span className="text-[10px] font-bold">{i + 1}</span>
                )}

                {/* Efeito Glow Dourado ao Hover */}
                {isCompleted && (
                  <div className="absolute inset-0 rounded-full bg-aura-gold/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xs" />
                )}
              </div>
            );
          })}
        </div>

        {/* MENSAGEM DE STATUS & RECOMPENSA */}
        <div className="mt-10 p-6 bg-aura-linen/50 rounded-[32px] text-center border border-white transition-all">
          {stamps < 10 ? (
            <div className="space-y-2">
              <p className="text-xs text-aura-charcoal/80 leading-relaxed">
                Faltam apenas{' '}
                <span className="text-aura-charcoal font-bold text-sm">
                  {10 - stamps} atendimentos
                </span>{' '}
                para você desbloquear sua cortesia exclusiva ✨
              </p>
              <p className="text-[11px] text-aura-taupe font-medium">
                Prêmio:{' '}
                <span className="text-aura-charcoal font-semibold">
                  {currentCard.rewardTitle}
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                <Gift size={13} />
                <span>Recompensa 10+1 Pronta</span>
              </div>
              <p className="text-sm font-bold text-aura-charcoal uppercase tracking-widest font-serif">
                ✨ Recompensa Liberada!
              </p>
              <p className="text-xs text-aura-slate">
                Você conquistou:{' '}
                <strong className="text-aura-charcoal">
                  {currentCard.rewardTitle}
                </strong>
              </p>
              <button
                type="button"
                onClick={handleOpenRedeem}
                className="w-full bg-aura-charcoal text-white py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles size={14} className="text-aura-rose" />
                <span>Resgatar Cortesia</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* HISTÓRICO RECENTE (TRANSPARÊNCIA) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <History size={16} className="text-aura-taupe" />
            <h3 className="text-[10px] font-bold text-aura-taupe uppercase tracking-widest">
              Últimos Atendimentos
            </h3>
          </div>
          <span className="text-[10px] text-aura-slate font-medium">
            Verificados com Sucesso
          </span>
        </div>

        <div className="space-y-3">
          {currentCard.history.map((item) => (
            <div
              key={item.id}
              className="bg-white/70 backdrop-blur-xs p-5 rounded-3xl border border-aura-linen flex justify-between items-center group cursor-pointer hover:bg-white hover:border-aura-border transition-all shadow-2xs"
            >
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-2xl bg-aura-rose/20 flex items-center justify-center text-[#C26B54] shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-aura-charcoal group-hover:text-[#C26B54] transition-colors">
                    {item.serviceName}
                  </p>
                  <p className="text-[11px] text-aura-slate mt-0.5">
                    {item.date} • {item.unit}
                  </p>
                  <p className="text-[10px] text-aura-taupe">
                    Com {item.professional}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 hidden sm:inline-block">
                  Selo Creditado
                </span>
                <ChevronRight
                  size={16}
                  className="text-aura-slate group-hover:text-[#C26B54] group-hover:translate-x-0.5 transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INFO DE SEGURANÇA (ANTI-FRAUDE & CRÉDITO AUTOMÁTICO) */}
      <footer className="text-center p-6 sm:p-8 bg-aura-pearl rounded-[40px] border border-dashed border-aura-linen space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-aura-taupe text-[10px] font-bold uppercase tracking-wider">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Certificação Anti-Fraude</span>
        </div>
        <p className="text-[10px] text-aura-taupe leading-relaxed max-w-md mx-auto">
          Os selos são creditados automaticamente após a finalização e pagamento
          do serviço na recepção da clínica por profissionais credenciados da
          equipe Aura.
        </p>
      </footer>

      {/* MODAL DE RESGATE DE CORTESIA DIGITAL (VOUCHER DE LUXO) */}
      {redeemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[36px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-aura-border space-y-6 relative animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setRedeemModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-aura-linen hover:bg-aura-border text-aura-charcoal flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Cabeçalho do Voucher */}
            <div className="text-center space-y-2 pt-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
                <Gift size={26} />
              </div>
              <h3 className="text-xl font-serif font-bold text-aura-charcoal">
                Cortesia Exclusiva 10+1
              </h3>
              <p className="text-xs text-aura-slate">
                Apresente este voucher na recepção ao realizar o procedimento
              </p>
            </div>

            {/* Cartão do Voucher */}
            <div className="p-5 rounded-3xl bg-gradient-to-b from-[#FAF8F5] to-white border border-[#EAD7D1] space-y-4 shadow-sm text-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C26B54]">
                  {currentCard.businessName}
                </span>
                <h4 className="text-sm font-bold text-aura-charcoal mt-1">
                  {currentCard.rewardTitle}
                </h4>
                <p className="text-[11px] text-aura-slate mt-0.5">
                  Válido na {currentCard.unitName}
                </p>
              </div>

              {/* Código de Segurança */}
              <div className="py-3 px-4 bg-white rounded-2xl border border-aura-linen inline-block shadow-2xs">
                <span className="text-[10px] text-aura-slate block uppercase tracking-wider">
                  Código de Validação
                </span>
                <span className="text-lg font-mono font-bold text-aura-charcoal tracking-widest">
                  {voucherCode}
                </span>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleCopyVoucher}
                  className="text-xs font-bold text-[#C26B54] hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  {voucherCopied ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span>Código Copiado!</span>
                    </>
                  ) : (
                    <span>Copiar Código do Voucher</span>
                  )}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-aura-slate text-center leading-relaxed">
              O agendamento da cortesia pode ser feito pelo WhatsApp oficial ou
              diretamente na recepção da clínica.
            </div>

            <button
              type="button"
              onClick={() => {
                setRedeemModalOpen(false);
                if (onNavigateToBooking) {
                  onNavigateToBooking(currentCard.businessName);
                }
              }}
              className="w-full bg-aura-charcoal text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all cursor-pointer"
            >
              Concluir & Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyClub;
