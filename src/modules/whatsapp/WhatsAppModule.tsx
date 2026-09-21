import React from 'react';
import { WhatsAppAutomation } from '../business/whatsapp/WhatsAppAutomation';
import { useModuleAccess } from '../../core/useModuleAccess';

export const WhatsAppModule: React.FC = () => {
  const { hasAccess, LockedOverlay } = useModuleAccess('whatsapp');

  return (
    <div className="relative min-h-[600px] w-full">
      {!hasAccess && <LockedOverlay moduleName="Automações & WhatsApp Marketing" />}
      <div className={!hasAccess ? 'filter blur-xs pointer-events-none select-none opacity-40' : ''}>
        <WhatsAppAutomation />
      </div>
    </div>
  );
};
