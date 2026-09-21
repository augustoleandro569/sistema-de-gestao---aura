import React from 'react';
import { PricingView } from '../../components/views/PricingView';
import { useModuleAccess } from '../../core/useModuleAccess';

export const PricingModule: React.FC = () => {
  const { hasAccess, LockedOverlay } = useModuleAccess('pricing');

  return (
    <div className="relative min-h-[600px] w-full">
      {!hasAccess && <LockedOverlay moduleName="Calculadora de Precificação & Ficha Técnica" />}
      <div className={!hasAccess ? 'filter blur-xs pointer-events-none select-none opacity-40' : ''}>
        <PricingView />
      </div>
    </div>
  );
};
