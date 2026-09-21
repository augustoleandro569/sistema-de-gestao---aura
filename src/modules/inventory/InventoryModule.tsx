import React from 'react';
import { Inventory } from '../../pages/admin/Inventory';
import { useModuleAccess } from '../../core/useModuleAccess';

export const InventoryModule: React.FC = () => {
  const { hasAccess, LockedOverlay } = useModuleAccess('inventory');

  return (
    <div className="relative min-h-[600px] w-full">
      {!hasAccess && <LockedOverlay moduleName="Controle de Estoque & Auditoria" />}
      <div className={!hasAccess ? 'filter blur-xs pointer-events-none select-none opacity-40' : ''}>
        <Inventory />
      </div>
    </div>
  );
};
