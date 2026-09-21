import React, { useState } from 'react';
import {
  Settings,
  CalendarClock,
  Building,
  Clock,
  CheckCircle2,
  Shield,
  Save,
  Bell,
  CreditCard,
  Palette,
  Sparkles,
  Zap,
  Lock,
  Check
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { RolesAndPermissionsSection } from '../settings/RolesAndPermissionsSection';
import { AppearanceSettings } from '../../pages/admin/Settings/Appearance';
import { BrandSettings } from '../../modules/business/settings/BrandSettings';
import { useBusiness, useSubscription } from '../../core/BusinessContext';
import { UpgradeModal } from '../modals/UpgradeModal';

export const SettingsView: React.FC = () => {
  const org = dataService.getOrganization();
  const { currentBusiness, commercialPlans, platformModules } = useBusiness();
  const { activeModules } = useSubscription();

  const [activeSubTab, setActiveSubTab] = useState<'general' | 'appearance' | 'subscription'>('appearance');
  const [returnDaysDefault, setReturnDaysDefault] = useState(org.settings.defaultReturnDays);
  const [openingTime, setOpeningTime] = useState(org.settings.businessHoursStart);
  const [closingTime, setClosingTime] = useState(org.settings.businessHoursEnd);
  const [clinicName, setClinicName] = useState(org.name);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedUpgradeModule, setSelectedUpgradeModule] = useState<string | undefined>(undefined);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.updateDefaultReturnDays(returnDaysDefault);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="settings-view" className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EDE7DF] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D2725] text-[#F3E7DC] flex items-center justify-center">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2D2725]">
              Configurações da Clínica & Parâmetros
            </h1>
            <p className="text-xs text-[#8F8278]">
              Ajuste regras de retorno, identidade visual (White-label), módulos contratados e dados da unidade
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <CheckCircle2 size={15} /> Alterações salvas com sucesso!
          </div>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EDE7DF] pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('appearance')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'appearance'
              ? 'bg-[#2D2725] text-[#F3E7DC] shadow-xs'
              : 'text-[#6E635B] hover:bg-[#F2ECE4] hover:text-[#2D2725]'
          }`}
        >
          <Palette size={15} /> Minha Marca (Custom Branding)
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('general')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'general'
              ? 'bg-[#2D2725] text-[#F3E7DC] shadow-xs'
              : 'text-[#6E635B] hover:bg-[#F2ECE4] hover:text-[#2D2725]'
          }`}
        >
          <Building size={15} /> Parâmetros Gerais & Horários
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('subscription')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'subscription'
              ? 'bg-[#2D2725] text-[#F3E7DC] shadow-xs'
              : 'text-[#6E635B] hover:bg-[#F2ECE4] hover:text-[#2D2725]'
          }`}
        >
          <CreditCard size={15} /> Plano & Módulos Contratados
        </button>
      </div>

      {/* Tab 1: Minha Marca & Custom Branding (White-label) */}
      {activeSubTab === 'appearance' && (
        <div className="pt-2">
          <BrandSettings />
        </div>
      )}

      {/* Tab 2: General & Operations */}
      {activeSubTab === 'general' && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. Regras de Retorno Inteligente */}
          <div className="bg-white rounded-3xl p-6 border border-[#EDE7DF] shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#F4EFEA]">
              <CalendarClock size={18} className="text-[#B88746]" />
              <h3 className="font-display text-base font-bold text-[#2D2725]">
                Regras do Ciclo de Retorno dos Clientes
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-[#4A423C] mb-1.5">
                  Prazo Padrão de Retorno (dias_retorno_padrao) *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={returnDaysDefault}
                    onChange={(e) => setReturnDaysDefault(Number(e.target.value) || 15)}
                    className="w-32 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C9BD] text-sm font-bold text-[#2D2725] focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                    required
                  />
                  <span className="text-xs text-[#7A6E65]">dias corridos</span>
                </div>
                <p className="text-[11px] text-[#8F8278] mt-1.5 leading-relaxed">
                  Este valor é dinâmico e serve como base caso um serviço não possua prazo específico. Cada procedimento possui seu próprio prazo individual no catálogo.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] text-xs text-[#524842] space-y-2">
                <strong className="text-[#2D2725] block">Prazos Ativos por Procedimento:</strong>
                <div className="flex justify-between">
                  <span>Design de Sobrancelhas:</span>
                  <span className="font-bold text-[#2D2725]">15 dias</span>
                </div>
                <div className="flex justify-between">
                  <span>Limpeza de Pele Profunda:</span>
                  <span className="font-bold text-[#2D2725]">30 dias</span>
                </div>
                <div className="flex justify-between">
                  <span>Depilação a Laser Soprano:</span>
                  <span className="font-bold text-[#2D2725]">28 dias</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Horário de Funcionamento & Unidade */}
          <div className="bg-white rounded-3xl p-6 border border-[#EDE7DF] shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#F4EFEA]">
              <Building size={18} className="text-[#B88746]" />
              <h3 className="font-display text-base font-bold text-[#2D2725]">
                Dados da Clínica & Horário de Atendimento
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A423C] mb-1.5">
                  Nome da Clínica / Salão
                </label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C9BD] text-xs font-semibold text-[#2D2725]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A423C] mb-1.5">
                  Abertura da Clínica
                </label>
                <input
                  type="time"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C9BD] text-xs font-semibold text-[#2D2725]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A423C] mb-1.5">
                  Fechamento da Clínica
                </label>
                <input
                  type="time"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C9BD] text-xs font-semibold text-[#2D2725]"
                />
              </div>
            </div>
          </div>

          {/* 3. Arquitetura Multi-Unidade (SaaS Ready) */}
          <div className="bg-white rounded-3xl p-6 border border-[#EDE7DF] shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4EFEA]">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-[#B88746]" />
                <h3 className="font-display text-base font-bold text-[#2D2725]">
                  Ambiente Multi-Unidade & Franquias (SaaS)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF2E6] text-[#9C753B]">
                Unidade Atual: {currentBusiness.name}
              </span>
            </div>

            <p className="text-xs text-[#7A6E65]">
              Sua organização suporta separação por <strong>organization_id</strong> e relatórios consolidados entre todas as filiais.
            </p>
          </div>

          {/* 4. Controle de Acesso por Função (RBAC) & Políticas RLS */}
          <RolesAndPermissionsSection />

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2D2725] hover:bg-[#3D3532] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Save size={15} />
              Salvar Alterações
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Plan & Subscription */}
      {activeSubTab === 'subscription' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 border border-[#EDE7DF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8F8278]">
                Plano Atual da Clínica
              </span>
              <h2 className="text-2xl font-bold font-display text-[#2D2725] capitalize">
                Plano {currentBusiness.plan_type}
              </h2>
              <p className="text-xs text-[#7A6E65] mt-1">
                Estabelecimento: <strong>{currentBusiness.name}</strong> • Status: <span className="text-emerald-700 font-semibold uppercase">{currentBusiness.status}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedUpgradeModule(undefined);
                setUpgradeModalOpen(true);
              }}
              className="px-6 py-3 rounded-full bg-[#B88746] hover:bg-[#A37438] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
            >
              <Sparkles size={15} /> Mudar de Plano ou Adicionar Módulos
            </button>
          </div>

          {/* Status dos Módulos da Unidade */}
          <div className="bg-white rounded-3xl p-6 border border-[#EDE7DF] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#2D2725] uppercase tracking-wider">
              Módulos Ativos & Disponíveis para sua Clínica
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {platformModules.map((mod) => {
                const isActive = activeModules.includes(mod.id);

                return (
                  <div
                    key={mod.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isActive
                        ? 'bg-white border-emerald-200 shadow-xs'
                        : 'bg-[#FAF8F5] border-[#EDE7DF] opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#2D2725]">{mod.name}</span>
                        {isActive ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check size={10} /> Ativo
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Lock size={10} /> Bloqueado
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#7A6E65] line-clamp-2">
                        {mod.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#F4EFEA] flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[#8F8278]">
                        {mod.requiredPlanName || 'Avulso'}
                      </span>
                      {!isActive && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUpgradeModule(mod.id);
                            setUpgradeModalOpen(true);
                          }}
                          className="text-[11px] font-bold text-rose-700 hover:text-rose-900 cursor-pointer"
                        >
                          Ativar Agora →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        moduleId={selectedUpgradeModule}
      />
    </div>
  );
};

