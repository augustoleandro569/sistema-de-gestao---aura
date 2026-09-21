import React from 'react';
import { AgendaView } from '../../components/views/AgendaView';
import { useModuleAccess } from '../../core/useModuleAccess';

interface AppointmentsModuleProps {
  onOpenNewAppointment: () => void;
  onNavigateToCadastro: () => void;
}

export const AppointmentsModule: React.FC<AppointmentsModuleProps> = ({
  onOpenNewAppointment,
  onNavigateToCadastro,
}) => {
  const { hasAccess, LockedOverlay } = useModuleAccess('appointments');

  return (
    <div className="relative min-h-[600px] w-full">
      {!hasAccess && <LockedOverlay moduleName="Agenda & Agendamentos" />}
      <div className={!hasAccess ? 'filter blur-xs pointer-events-none select-none opacity-40' : ''}>
        <AgendaView
          onOpenNewAppointment={onOpenNewAppointment}
          onNavigateToCadastro={onNavigateToCadastro}
        />
      </div>
    </div>
  );
};
