// src/layouts/MainLayout.tsx
import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { useLayout } from './LayoutContext';

export interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { currentTab } = useLayout();

  // Em telas de login/portal de entrada, exibe em tela cheia sem a barra administrativa
  if (currentTab === 'login') {
    return <div className="min-h-screen bg-aesthetic-off-white">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-aesthetic-off-white overflow-x-hidden">
      {/* Sidebar com largura fixa apenas em desktop */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 sticky top-0 h-screen border-r border-aesthetic-bege/50 bg-white z-30">
        <Sidebar />
      </aside>

      {/* Conteúdo Principal: min-w-0 é o segredo para o Flexbox não estourar */}
      <main className="flex-1 min-w-0 flex flex-col relative pb-20 lg:pb-0">
        <Header />
        <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto">
          {children}
        </div>

        {/* Navegação inferior para dispositivos móveis */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-t border-aesthetic-bege/50 px-6 flex justify-between items-center z-50">
          <MobileNav />
        </nav>
      </main>
    </div>
  );
};

