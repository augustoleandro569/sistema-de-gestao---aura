import React from 'react';
import {
  X,
  Lock,
  Sparkles,
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
  Palette,
  Calendar,
  DollarSign,
  Box,
  Calculator,
  FileText,
  Globe,
  BarChart3,
  Award
} from 'lucide-react';
import { useBusiness, useSubscription } from '../../core/BusinessContext';
import { useAuth } from '../../context/AuthContext';
import { COMMERCIAL_PLANS, PLATFORM_MODULES } from '../../core/BusinessContext';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId?: string;
  initialPlanSlug?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  moduleId,
}) => {
  const {
    currentBusiness,
    toggleModuleForBusiness,
    applyPlanPreset,
    isSuperAdminMode,
    isImpersonating,
  } = useBusiness();
  const { userProfile, userRole } = useAuth();
  const { activeModules } = useSubscription();

  if (!isOpen) return null;

  const isPlatformAdmin =
    userProfile?.email?.toLowerCase() === 'dev@aura.com.br' ||
    userProfile?.email?.toLowerCase() === 'augusto.leandro569@gmail.com' ||
    userRole === 'PLATFORM_ADMIN' ||
    userRole === 'SUPER_ADMIN' ||
    isSuperAdminMode;

  const currentModule = PLATFORM_MODULES.find((m) => m.id === moduleId);
  const isModuleActive = moduleId ? activeModules.includes(moduleId) : false;

  const getModuleIcon = (id?: string) => {
    switch (id) {
      case 'appointments':
        return Calendar;
      case 'finance':
        return DollarSign;
      case 'inventory':
        return Box;
      case 'pricing':
        return Calculator;
      case 'contents':
        return FileText;
      case 'vitrine':
        return Globe;
      case 'loyalty':
        return Award;
      case 'reports':
        return BarChart3;
      case 'custom_branding':
        return Palette;
      case 'whatsapp':
        return Zap;
      default:
        return Sparkles;
    }
  };

  const Icon = getModuleIcon(moduleId);

  const handleInstantUnlockRoot = () => {
    if (!moduleId) return;
    toggleModuleForBusiness(currentBusiness.id, moduleId);
    onClose();
  };

  const handleApplyPlan = (planSlug: string) => {
    applyPlanPreset(currentBusiness.id, planSlug as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#EDE7DF] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 md:p-8 bg-gradient-to-br from-[#2D2725] to-[#1A1716] text-[#F3E7DC] relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B88746] to-[#8C6226] text-white flex items-center justify-center shadow-lg shrink-0">
              <Icon size={28} />
            </div>

            <div className="min-w-0 pr-8">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-widest flex items-center gap-1">
                  <Lock size={10} /> Módulo Bloqueado
                </span>
                {currentModule?.requiredPlanName && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF2E6]/20 text-[#E8D1C5] border border-white/10">
                    Incluso no {currentModule.requiredPlanName}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                {currentModule?.name || 'Recurso Avançado'}
              </h2>
              <p className="text-xs sm:text-sm text-[#D5C9BD] mt-1 leading-relaxed">
                {currentModule?.description ||
                  'Este módulo permite acelerar a gestão e os resultados da sua clínica.'}
              </p>
            </div>
          </div>

          {/* Root Bypass Banner */}
          {isPlatformAdmin && (
            <div className="mt-4 p-3 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-between gap-3 text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-400 shrink-0" />
                <span>
                  <strong>Acesso God Mode (Super Admin):</strong> Você pode liberar este recurso imediatamente para <strong>{currentBusiness.name}</strong>.
                </span>
              </div>
              <button
                type="button"
                onClick={handleInstantUnlockRoot}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
              >
                {isModuleActive ? 'Desativar Módulo' : '⚡ Liberar Módulo (1 Clique)'}
              </button>
            </div>
          )}
        </div>

        {/* Modal Body: Commercial Plans Grid */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FAF8F5]">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-[#2D2725]">
              Planos & Módulos Oficiais do Aura
            </h3>
            <p className="text-xs text-[#7A6E65] mt-1">
              Escolha o plano ideal para a escala da clínica <strong>{currentBusiness.name}</strong> (atualmente no plano <span className="font-semibold uppercase text-[#9C753B]">{currentBusiness.plan_type}</span>).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMMERCIAL_PLANS.filter((p) => p.slug !== 'enterprise').map((plan) => {
              const isCurrent = currentBusiness.plan_type === plan.slug;
              const hasThisModule = moduleId ? plan.includedModules.includes(moduleId) : false;

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-5 border flex flex-col justify-between transition-all relative ${
                    plan.isPopular
                      ? 'bg-white border-[#B88746] shadow-md ring-2 ring-[#B88746]/20'
                      : 'bg-white border-[#EDE7DF] shadow-xs'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span
                        className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs ${
                          plan.isPopular
                            ? 'bg-[#B88746] text-white'
                            : 'bg-[#2D2725] text-[#F3E7DC]'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="text-center pb-4 border-b border-[#F4EFEA]">
                      <h4 className="font-bold text-sm text-[#2D2725]">{plan.name}</h4>
                      <p className="text-[11px] text-[#8F8278] mt-1 line-clamp-2">
                        {plan.tagline}
                      </p>
                      <div className="mt-3">
                        <span className="text-xs text-[#8F8278]">R$ </span>
                        <span className="text-2xl font-bold text-[#2D2725]">
                          {plan.monthlyPrice.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-xs text-[#8F8278]">/mês</span>
                      </div>
                    </div>

                    <div className="py-4 space-y-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8F8278]">
                        Recursos Principais:
                      </p>
                      {plan.highlightFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#4A423C]">
                          <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-tight text-[11px]">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F4EFEA]">
                    <button
                      type="button"
                      disabled={isCurrent}
                      onClick={() => handleApplyPlan(plan.slug)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isCurrent
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : plan.isPopular
                          ? 'bg-[#B88746] hover:bg-[#A37438] text-white shadow-xs'
                          : 'bg-[#2D2725] hover:bg-[#3D3532] text-white'
                      }`}
                    >
                      {isCurrent ? (
                        'Plano Atual'
                      ) : hasThisModule ? (
                        <>
                          <Zap size={14} /> Ativar com {plan.name}
                        </>
                      ) : (
                        <>Fazer Upgrade</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add-ons Spotlight */}
          <div className="bg-white rounded-3xl p-5 border border-[#EDE7DF] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4EFEA]">
              <div>
                <h4 className="text-xs font-bold text-[#2D2725] uppercase tracking-wider">
                  Módulos de Maior Valor Agregado (Add-ons Independentes)
                </h4>
                <p className="text-[11px] text-[#8F8278]">
                  Você pode contratar add-ons avulsos em qualquer plano base.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {/* Custom Branding White-label */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Palette size={16} className="text-[#B88746]" />
                      <span className="text-xs font-bold text-[#2D2725]">
                        Custom Branding (White-label)
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#B88746]">R$ 99,90/mês</span>
                  </div>
                  <p className="text-[11px] text-[#7A6E65] mt-1.5 leading-relaxed">
                    Personalize as cores do sistema, logomarca oficial no portal do cliente e domínio próprio (agenda.suaclinica.com.br).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleModuleForBusiness(currentBusiness.id, 'custom_branding');
                    onClose();
                  }}
                  className="mt-3 w-full py-2 rounded-xl bg-white border border-[#D5C9BD] hover:bg-[#FAF6F0] text-xs font-bold text-[#2D2725] transition-colors cursor-pointer"
                >
                  {activeModules.includes('custom_branding')
                    ? 'Desativar Add-on'
                    : 'Ativar Custom Branding'}
                </button>
              </div>

              {/* WhatsApp Automations */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-emerald-600" />
                      <span className="text-xs font-bold text-[#2D2725]">
                        Automações & WhatsApp
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700">R$ 69,90/mês</span>
                  </div>
                  <p className="text-[11px] text-[#7A6E65] mt-1.5 leading-relaxed">
                    Lembretes automáticos 24h antes, confirmação de presença com botões e mensagens de pós-atendimento.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleModuleForBusiness(currentBusiness.id, 'whatsapp');
                    onClose();
                  }}
                  className="mt-3 w-full py-2 rounded-xl bg-white border border-[#D5C9BD] hover:bg-[#FAF6F0] text-xs font-bold text-[#2D2725] transition-colors cursor-pointer"
                >
                  {activeModules.includes('whatsapp')
                    ? 'Desativar Add-on'
                    : 'Ativar WhatsApp Oficial'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 md:p-5 bg-white border-t border-[#EDE7DF] flex items-center justify-between">
          <span className="text-xs text-[#8F8278]">
            Sem contrato de fidelidade. Cancele ou altere planos a qualquer momento.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#4A423C] text-xs font-semibold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
