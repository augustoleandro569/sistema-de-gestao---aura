// src/components/layout/ConsumerNav.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, User } from 'lucide-react';

interface ConsumerNavProps {
  className?: string;
  onNavigate?: (path: string) => void;
}

export const ConsumerNav: React.FC<ConsumerNavProps> = ({ className = '', onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // O Hub de 4 Pontos Essenciais do Consumidor: Início (Hub), Feed (Inspirar), Mapa (Agendar) e Perfil (Aura Club)
  const navItems = [
    { id: 'hub', label: 'Início', icon: Sparkles, path: '/app' },
    { id: 'explorar', label: 'Feed', icon: Sparkles, path: '/app/explorar' },
    { id: 'mapa', label: 'Mapa', icon: MapPin, path: '/app/mapa' },
    { id: 'perfil', label: 'Aura Club', icon: User, path: '/app/perfil' },
  ];

  const handleClick = (path: string) => {
    navigate(path);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <nav className={`flex items-center bg-white/90 backdrop-blur-md px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-[#EBE3D7] shadow-lg shadow-amber-900/5 gap-1.5 sm:gap-2 ${className}`}>
      {navItems.map((item) => {
        const isActive =
          location.pathname === item.path ||
          (item.path === '/app' && (location.pathname === '/app' || location.pathname === '/hub' || location.pathname === '/')) ||
          (item.path === '/app/explorar' &&
            (location.pathname === '/marketplace' ||
              location.pathname === '/marketplace/feed' ||
              location.pathname === '/explorar')) ||
          (item.path === '/app/mapa' && location.pathname === '/mapa') ||
          (item.path === '/app/perfil' &&
            (location.pathname === '/perfil' ||
              location.pathname === '/app/horarios' ||
              location.pathname === '/portal' ||
              location.pathname.startsWith('/portal/')));

        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.path)}
            type="button"
            className={`
              flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-full transition-all duration-300 group cursor-pointer select-none
              ${isActive 
                ? 'bg-[#FAF0ED] text-[#B35848] border border-[#ECD9BD] font-bold shadow-xs' 
                : 'text-[#8C7F75] hover:text-[#2D2725] hover:bg-[#FAF8F5]'}
            `}
          >
            <item.icon 
              size={17} 
              className={isActive ? 'text-[#B35848]' : 'text-[#8C7F75] group-hover:text-[#2D2725]'} 
            />
            <span className="text-xs font-bold tracking-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

