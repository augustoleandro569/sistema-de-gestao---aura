// src/hooks/useModuleAccess.tsx
import React from 'react';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from './useAuth';
import { useBusiness } from '../core/BusinessContext';

export interface LockedOverlayProps {
  moduleName?: string;
  customDescription?: string;
  description?: string;
}

export const useModuleAccess = (moduleId: string) => {
  const { userProfile } = useAuth();
  const { activeModules, businessStatus, currentBusiness, platformModules, activateModuleForCurrent, isSuperAdminMode } = useBusiness();

  // REGRA DE OURO: Se for PLATFORM_ADMIN, o acesso é VITALÍCIO e IRRESTRITO
  const isDeveloper = userProfile?.role === 'PLATFORM_ADMIN' || isSuperAdminMode;
  const currentStatus = businessStatus || currentBusiness?.status || 'active';

  // O acesso é liberado se:
  // 1. O usuário for o Desenvolvedor (Bypass)
  // 2. OU o módulo estiver ativo E a clínica estiver com status 'active'
  const hasAccess = isDeveloper || (activeModules.includes(moduleId) && currentStatus === 'active');

  const targetModule = platformModules?.find((m) => m.id === moduleId);
  const moduleLabel = targetModule?.name || moduleId;
  const modulePrice = targetModule ? `R$ ${targetModule.base_price.toFixed(2).replace('.', ',')}/mês` : 'R$ 49,90/mês';

  return {
    hasAccess,
    isDeveloper,
    // O Overlay de bloqueio só será renderizado se não for o Desenvolvedor
    LockedOverlay: isDeveloper
      ? () => null
      : ({ moduleName, customDescription, description }: LockedOverlayProps = {}) => (
          <div
            id={`locked-overlay-${moduleId}`}
            className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300"
          >
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-aesthetic-bege max-w-md w-full relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
                <Lock size={32} />
              </div>
              <h3 className="text-lg font-bold text-graphite mb-1">
                {moduleName || `Módulo Indisponível`}
              </h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                {customDescription || description || targetModule?.description || 'Este recurso não faz parte do seu plano atual.'}
              </p>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-aesthetic-bege/40 mb-6 text-left space-y-1.5 text-xs text-graphite">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-gray-500">Investimento adicional:</span>
                  <span className="font-bold text-rose-700">{modulePrice}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 text-[11px]">
                  <CheckCircle2 size={13} className="shrink-0" />
                  <span>Sem fidelidade • Liberação instantânea</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => activateModuleForCurrent?.(moduleId)}
                className="w-full bg-graphite hover:bg-black text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles size={14} className="text-[#E8D1C5]" /> ATIVAR RECURSO
              </button>
            </div>
          </div>
        ),
  };
};

export default useModuleAccess;
