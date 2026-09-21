import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LoyaltyCard } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Sparkles,
  Gift,
  Award,
  CheckCircle2,
  Clock,
  RotateCcw,
  Zap,
  Star,
  ShieldCheck,
  PartyPopper
} from 'lucide-react';

interface LoyaltyCardDisplayProps {
  clientId: string;
  clientName?: string;
  onStampAdded?: () => void;
  onRewardRedeemed?: () => void;
  allowManualStamp?: boolean;
}

export const LoyaltyCardDisplay: React.FC<LoyaltyCardDisplayProps> = ({
  clientId,
  clientName,
  onStampAdded,
  onRewardRedeemed,
  allowManualStamp = true,
}) => {
  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard>(() =>
    dataService.getLoyaltyCardByClientId(clientId)
  );
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string>('');

  const stampsCount = loyaltyCard.stampsCount ?? loyaltyCard.stamps_count ?? 0;
  const isRewardAvailable = Boolean(loyaltyCard.rewardAvailable ?? loyaltyCard.reward_available);
  const lastStampDate = loyaltyCard.lastStampAt ?? loyaltyCard.last_stamp_at;

  const handleAddStamp = () => {
    const result = dataService.addLoyaltyStamp(clientId, 'Adicionado manualmente / Simulação Trigger');
    setLoyaltyCard(result.card);
    setRedeemSuccessMsg('');
    if (onStampAdded) onStampAdded();
  };

  const handleRedeem = () => {
    const result = dataService.redeemLoyaltyReward(clientId);
    if (result.success && result.card) {
      setLoyaltyCard(result.card);
      setRedeemSuccessMsg(result.message);
      if (onRewardRedeemed) onRewardRedeemed();
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#2D2725] via-[#3B322F] to-[#1F1B1A] text-[#FAF8F5] rounded-3xl p-5 sm:p-6 shadow-xl border border-[#4E423E] relative overflow-hidden space-y-5">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#B88746]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#E8D1C5]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#4E423E]/80 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#B88746] to-[#D4A566] text-white flex items-center justify-center shadow-lg shadow-[#B88746]/20">
            <Award size={22} className="text-[#FFF8F0]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white tracking-wide">
                Cartão Fidelidade Sublime
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-[#B88746]/20 text-[#E8D1C5] px-2 py-0.5 rounded-full border border-[#B88746]/30">
                10 Selos = 1 Recompensa
              </span>
            </div>
            <p className="text-xs text-[#C5BCB3] mt-0.5">
              {clientName ? `Cliente: ${clientName}` : 'Acúmulo automático a cada atendimento finalizado e pago'}
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-2xl bg-[#3E3431] border border-[#584B46] text-center">
            <span className="text-[10px] text-[#A89D93] uppercase tracking-wider block font-medium">Progresso</span>
            <span className="text-sm font-black text-amber-300 font-mono tracking-wider">
              {stampsCount} / 10 <span className="text-xs font-normal text-[#C5BCB3]">selos</span>
            </span>
          </div>
        </div>
      </div>

      {/* Reward Ready Banner */}
      {isRewardAvailable && (
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/25 to-yellow-500/20 border border-amber-400/40 rounded-2xl p-4 text-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#2D2725] flex items-center justify-center font-black shrink-0 shadow-md">
              <Gift size={22} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-200 flex items-center gap-1.5">
                <PartyPopper size={15} /> Recompensa Desbloqueada (10 Selos Conquistados!)
              </h4>
              <p className="text-xs text-amber-100/90 mt-0.5">
                Este cliente tem direito a 1 procedimento estético gratuito (Revitalização Facial, Peeling ou Hidratação).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRedeem}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#2D2725] text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Gift size={14} />
            <span>Resgatar Recompensa</span>
          </button>
        </div>
      )}

      {/* Redemption success alert */}
      {redeemSuccessMsg && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
          <span>{redeemSuccessMsg}</span>
        </div>
      )}

      {/* 10 Stamps Visual Grid */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs text-[#C5BCB3]">
          <span className="font-medium text-[#E8D1C5] flex items-center gap-1.5">
            <Star size={13} className="text-[#B88746]" />
            Grade de Selos de Atendimento (1 a 10)
          </span>
          <span className="text-[11px] text-[#A89D93]">
            {10 - stampsCount > 0 ? `Faltam ${10 - stampsCount} selo(s) para o prêmio` : 'Cartão 100% completo!'}
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2.5 pt-1">
          {Array.from({ length: 10 }).map((_, index) => {
            const stampNumber = index + 1;
            const isStamped = stampNumber <= stampsCount;
            const isTenth = stampNumber === 10;

            return (
              <motion.div
                key={stampNumber}
                initial={isStamped ? { scale: 0.9, opacity: 0 } : false}
                animate={{ scale: isStamped && isTenth ? 1.05 : 1, opacity: 1 }}
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all aspect-square relative ${
                  isStamped
                    ? isTenth
                      ? 'bg-gradient-to-b from-amber-400 to-amber-600 text-[#2D2725] border-amber-300 shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-gradient-to-b from-[#B88746] to-[#966930] text-white border-[#D4A566] shadow-sm'
                    : 'bg-[#26201E] border-dashed border-[#4E423E] text-[#6E635D]'
                }`}
              >
                {isStamped ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mb-0.5">
                      {isTenth ? (
                        <Gift size={12} className="text-[#2D2725]" />
                      ) : (
                        <CheckCircle2 size={12} className="text-white" />
                      )}
                    </div>
                    <span className="text-[10px] font-black leading-none">
                      {isTenth ? '10 🎁' : `${stampNumber}º`}
                    </span>
                    <span className="text-[8px] uppercase tracking-tighter opacity-80 leading-none mt-0.5">
                      Selo
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 rounded-full border border-dashed border-[#5A4F4A] flex items-center justify-center mb-0.5 text-[9px] font-mono">
                      {stampNumber}
                    </div>
                    <span className="text-[9px] font-medium leading-none">
                      {isTenth ? 'Prêmio' : `${stampNumber}º`}
                    </span>
                    <span className="text-[8px] text-[#5A4F4A] leading-none mt-0.5">
                      {isTenth ? 'Grátis' : 'Vazio'}
                    </span>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 relative z-10">
        <div className="w-full h-2 bg-[#26201E] rounded-full overflow-hidden border border-[#4E423E]/60">
          <div
            className="h-full bg-gradient-to-r from-[#B88746] via-[#D4A566] to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${(stampsCount / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Bottom Footer Info & Trigger Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#4E423E]/60 text-xs text-[#A89D93] relative z-10">
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-[#B88746]" />
          <span>
            {lastStampDate ? (
              <>Último selo: <strong className="text-[#E8D1C5]">{new Date(lastStampDate).toLocaleDateString('pt-BR')}</strong></>
            ) : (
              'Nenhum selo registrado ainda'
            )}
          </span>
        </div>

        {allowManualStamp && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddStamp}
              disabled={stampsCount >= 10}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                stampsCount >= 10
                  ? 'bg-[#3A322F] text-[#6E635D] cursor-not-allowed'
                  : 'bg-[#B88746] hover:bg-[#A37336] text-white shadow-xs'
              }`}
            >
              <Zap size={12} />
              <span>Simular Trigger (+1 Selo)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyCardDisplay;
