import React, { useState } from 'react';
import { Client, LoyaltyCard } from '../../types';
import { dataService } from '../../services/dataService';
import { LoyaltyCardDisplay } from './LoyaltyCardDisplay';
import {
  X,
  Award,
  Gift,
  Zap,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Calendar,
  Phone,
  User,
  ShieldCheck
} from 'lucide-react';

interface LoyaltyModalProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
}

export const LoyaltyModal: React.FC<LoyaltyModalProps> = ({
  client,
  isOpen,
  onClose,
}) => {
  const [refreshKey, setRefreshKey] = useState(0);

  if (!isOpen) return null;

  const card = dataService.getLoyaltyCardByClientId(client.id);
  const stampsCount = card.stampsCount ?? card.stamps_count ?? 0;
  const isRewardReady = Boolean(card.rewardAvailable ?? card.reward_available);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#EDE7DF] space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE3DA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2D2725] text-amber-300 flex items-center justify-center shadow-xs">
              <Award size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2D2725]">
                Cartão Fidelidade & Recompensas
              </h2>
              <p className="text-xs text-[#7A6E65]">
                Gestão de selos por atendimentos finalizados e pagos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#FAF8F5] hover:bg-[#EAE3DA] text-[#7A6E65] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Client Brief */}
        <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#EDE7DF] text-xs">
          <div className="flex items-center gap-3">
            <img
              src={client.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
              alt={client.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#E0D7CC]"
            />
            <div>
              <span className="font-bold text-[#2D2725] block">{client.name}</span>
              <span className="text-[#8F8278]">{client.phone} • {client.segment?.toUpperCase()}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#8F8278] block">Atendimentos na Clínica</span>
            <span className="font-bold text-[#2D2725]">{client.appointmentsCount} concluídos</span>
          </div>
        </div>

        {/* Insight Comercial (Aura Business Power) */}
        {stampsCount >= 8 && (
          <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50/80 rounded-2xl border border-amber-200/90 text-xs flex items-center gap-3 shadow-2xs animate-in fade-in">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-950 block">
                Oportunidade Comercial (Aura Club)
              </span>
              <p className="text-[11px] text-amber-900 font-medium mt-0.5">
                Este cliente tem <strong>{stampsCount} selos</strong>. Ofereça um upgrade no próximo atendimento!
              </p>
            </div>
          </div>
        )}

        {/* Interactive Loyalty Card Display */}
        <LoyaltyCardDisplay
          key={refreshKey}
          clientId={client.id}
          clientName={client.name}
          onStampAdded={() => setRefreshKey((k) => k + 1)}
          onRewardRedeemed={() => setRefreshKey((k) => k + 1)}
          allowManualStamp={true}
        />

        {/* Trigger Rule Explanation Banner */}
        <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#EBDDCF] text-xs text-[#5C524B] space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#8C6239]">
            <Sparkles size={14} className="text-[#B88746]" />
            <span>Regra de Disparo Automático (Trigger de Banco)</span>
          </div>
          <p className="leading-relaxed text-[11px] text-[#7A6E65]">
            Sempre que um agendamento for atualizado para <strong>'Finalizado'</strong> com status de pagamento <strong>'Pago'</strong>, o sistema executa automaticamente a adição de 1 selo ao cartão. Ao atingir o 10º selo, a recompensa é liberada instantaneamente.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EAE3DA]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2D2725] hover:bg-[#3D3532] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Concluir & Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyModal;
