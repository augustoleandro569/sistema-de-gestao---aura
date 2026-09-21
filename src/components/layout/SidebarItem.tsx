import React from 'react';
import { LucideIcon, Lock } from 'lucide-react';
import { useSubscription } from '../../core/BusinessContext';
import { PLATFORM_MODULES } from '../../core/BusinessContext';

interface SidebarItemProps {
  module?: string;
  label: string;
  icon: LucideIcon;
  path: string;
  active?: boolean;
  isCollapsed?: boolean;
  isMobileView?: boolean;
  badge?: string;
  unreadCount?: number;
  clientsToReturnCount?: number;
  onClick: () => void;
  onOpenUpgrade?: (moduleId: string) => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  module,
  label,
  icon: Icon,
  path,
  active = false,
  isCollapsed = false,
  isMobileView = false,
  badge,
  unreadCount = 0,
  clientsToReturnCount = 0,
  onClick,
  onOpenUpgrade,
}) => {
  const { hasModule } = useSubscription();

  // Se nenhum módulo foi especificado, o item é irrestrito (ex: Dashboard, Notificações, etc)
  const isLocked = module ? !hasModule(module) : false;

  const targetModule = module ? PLATFORM_MODULES.find((m) => m.id === module) : undefined;
  const planRequired = targetModule?.requiredPlanName || 'Plano Superior';

  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      if (onOpenUpgrade && module) {
        onOpenUpgrade(module);
      }
      return;
    }
    onClick();
  };

  return (
    <div className={`relative group ${isLocked ? 'opacity-65' : ''}`}>
      <button
        id={`nav-item-${path.replace(/\//g, '-')}`}
        type="button"
        onClick={handleClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-left ${
          active
            ? 'bg-[#2D2725] text-[#FAF7F2] shadow-sm'
            : isLocked
            ? 'text-[#7D726A] hover:bg-[#F2ECE4] hover:text-[#2D2725]'
            : 'text-[#5C534D] hover:bg-[#F6F2EC] hover:text-[#2D2725]'
        }`}
        title={isCollapsed && !isMobileView ? (isLocked ? `${label} (Bloqueado)` : label) : undefined}
      >
        <div
          className={`flex items-center justify-center shrink-0 w-6 h-6 rounded-md transition-colors ${
            active
              ? 'text-[#E8D1C5]'
              : isLocked
              ? 'text-rose-700/80'
              : 'text-[#85786E] group-hover:text-[#2D2725]'
          }`}
        >
          <Icon size={19} strokeWidth={active ? 2.2 : 1.9} />
        </div>

        {(!isCollapsed || isMobileView) && (
          <div className="flex items-center justify-between flex-1 truncate min-w-0">
            <span className={`truncate ${isLocked ? 'line-through-none' : ''}`}>
              {label}
            </span>

            {/* Lock Indicator when module is restricted */}
            {isLocked && (
              <div className="ml-auto pl-2 flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                  {targetModule?.badge || 'Upgrade'}
                </span>
                <Lock size={13} className="text-rose-700 shrink-0" />
              </div>
            )}

            {/* Normal Badges when unlocked */}
            {!isLocked && (
              <>
                {path === '/admin/notificacoes' && unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#D89F95] text-white rounded-full ml-auto">
                    {unreadCount}
                  </span>
                )}

                {path === '/admin/clientes' && clientsToReturnCount > 0 && (
                  <span
                    className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#EBD5CC] text-[#6A3F36] rounded-md ml-auto"
                    title="Clientes para retorno"
                  >
                    {clientsToReturnCount} ret
                  </span>
                )}

                {path === '/admin/avaliacoes' && (
                  <span className="flex items-center gap-0.5 text-[11px] font-semibold text-[#B88746] ml-auto">
                    ★ 4.98
                  </span>
                )}

                {badge && (
                  <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold text-[#9C753B] bg-[#FAF2E6] border border-[#ECD9BD] rounded ml-auto">
                    {badge}
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </button>

      {/* TOOLTIP DE VENDA AO PASSAR O MOUSE NO MÓDULO BLOQUEADO */}
      {isLocked && (
        <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 w-56 bg-[#1A1716] text-white p-3 rounded-2xl shadow-xl border border-white/10 text-[11px] hidden group-hover:block z-50 animate-in fade-in zoom-in-95 pointer-events-auto">
          <div className="flex items-center gap-1.5 text-rose-300 font-bold uppercase tracking-wider text-[9px] mb-1">
            <Lock size={11} /> Módulo Bloqueado
          </div>
          <p className="text-gray-300 text-[11px] leading-relaxed">
            Este recurso faz parte do <strong>{planRequired}</strong>. Deseja ativar agora para seu estabelecimento?
          </p>
          <button
            type="button"
            onClick={() => onOpenUpgrade && module && onOpenUpgrade(module)}
            className="mt-2.5 w-full py-1.5 px-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-xs transition-all cursor-pointer text-center"
          >
            Ver Planos & Ativar
          </button>
        </div>
      )}

      {/* Tooltip simples de navegação quando apenas recolhido e desbloqueado */}
      {!isLocked && isCollapsed && !isMobileView && (
        <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#2D2725] text-[#FAF7F2] text-xs rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
};
