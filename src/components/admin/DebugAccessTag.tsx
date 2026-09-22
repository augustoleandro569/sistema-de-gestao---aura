// src/components/admin/DebugAccessTag.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLayout } from '../../layouts/LayoutContext';
import { LogOut } from 'lucide-react';

export const DebugAccessTag: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const layout = useLayout();

  if (userProfile?.role !== 'PLATFORM_ADMIN') return null;

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    logout();
    layout.setCurrentTab('portal');
    navigate('/');
  };

  return (
    <div
      id="developer-debug-access-container"
      className="fixed bottom-4 right-4 z-[9999] select-none animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center gap-1.5 bg-black/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-2xl border border-rose-900/60"
    >
      <button
        type="button"
        id="developer-debug-access-tag"
        onClick={() => layout.setCurrentTab('superadmin')}
        className="cursor-pointer text-rose-400 hover:text-rose-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
        title="Clique para abrir o Cockpit Root da Plataforma"
      >
        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        <span className="hidden sm:inline">Developer Mode</span>
        <span className="text-[9px] bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white px-2 py-0.5 rounded transition-colors">
          Cockpit ↵
        </span>
      </button>

      <span className="text-zinc-600">|</span>

      <button
        type="button"
        id="developer-quick-logout-btn"
        onClick={handleLogout}
        className="cursor-pointer text-zinc-400 hover:text-white hover:bg-rose-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
        title="Sair do sistema (Logout imediato)"
      >
        <LogOut size={11} className="text-rose-400 group-hover:text-white" />
        <span>Sair</span>
      </button>
    </div>
  );
};

export default DebugAccessTag;
