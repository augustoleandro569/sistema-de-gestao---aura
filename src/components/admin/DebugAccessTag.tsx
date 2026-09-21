// src/components/admin/DebugAccessTag.tsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLayout } from '../../layouts/LayoutContext';

export const DebugAccessTag: React.FC = () => {
  const { userProfile } = useAuth();
  const layout = useLayout();

  if (userProfile?.role !== 'PLATFORM_ADMIN') return null;

  return (
    <button
      type="button"
      id="developer-debug-access-tag"
      onClick={() => layout.setCurrentTab('superadmin')}
      className="fixed bottom-4 right-4 z-[9999] cursor-pointer select-none animate-in fade-in slide-in-from-bottom-2 duration-300 group"
      title="Clique para abrir o Cockpit Root da Plataforma"
    >
      <div className="bg-black/90 backdrop-blur-md text-rose-400 hover:text-rose-300 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-2xl border border-rose-900/50 group-hover:border-rose-500/50 transition-all">
        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        <span>Developer Mode: Full Access Active</span>
        <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded ml-1 group-hover:bg-rose-500 group-hover:text-white transition-colors">
          Cockpit ↵
        </span>
      </div>
    </button>
  );
};

export default DebugAccessTag;
