import React, { useState } from 'react';
import { DREDashboard } from '../business/finance/DREDashboard';
import { FinancialView } from '../../components/views/FinancialView';
import { useModuleAccess } from '../../core/useModuleAccess';
import { useLayout } from '../../layouts/LayoutContext';
import { FileSpreadsheet, BarChart3 } from 'lucide-react';

export const FinanceModule: React.FC = () => {
  const { hasAccess, LockedOverlay } = useModuleAccess('finance');
  const layout = useLayout();
  const [activeSubTab, setActiveSubTab] = useState<'dre' | 'analytics'>('dre');

  return (
    <div className="relative min-h-[600px] w-full space-y-4">
      {!hasAccess && (
        <LockedOverlay
          moduleName="Motor DRE Dinâmico & Inteligência Financeira"
          description="Pare de estimar seu lucro. Ative o DRE e tenha o controle real de cada centavo da sua clínica."
        />
      )}
      <div className={!hasAccess ? 'filter blur-xs pointer-events-none select-none opacity-40' : ''}>
        {/* Sub-navegação do Módulo Financeiro */}
        <div className="flex items-center gap-2 border-b border-[#EDE7DF] pb-3 mb-6">
          <button
            type="button"
            onClick={() => setActiveSubTab('dre')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'dre'
                ? 'bg-[#2D2725] text-white shadow-xs'
                : 'text-[#8F8278] hover:text-[#2D2725] hover:bg-[#FAF8F5]'
            }`}
          >
            <FileSpreadsheet size={15} className={activeSubTab === 'dre' ? 'text-[#D4AF37]' : ''} />
            <span>Demonstrativo DRE & Fluxo de Caixa</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'analytics'
                ? 'bg-[#2D2725] text-white shadow-xs'
                : 'text-[#8F8278] hover:text-[#2D2725] hover:bg-[#FAF8F5]'
            }`}
          >
            <BarChart3 size={15} className={activeSubTab === 'analytics' ? 'text-[#D4AF37]' : ''} />
            <span>Gráficos & Extrato Conciliado</span>
          </button>
        </div>

        {activeSubTab === 'dre' ? (
          <DREDashboard onNavigateToEstoque={() => layout.setCurrentTab('estoque')} />
        ) : (
          <FinancialView />
        )}
      </div>
    </div>
  );
};
