import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LayoutProvider } from './layouts';
import { AuthProvider } from './context/AuthContext';
import { BusinessProvider } from './core/BusinessContext';
import { AppRoutes } from './routes/AppRoutes';
import { DebugAccessTag } from './components/admin/DebugAccessTag';
import { SplashScreen } from './components/ui/SplashScreen';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula o tempo de carregamento de assets e autenticação para uma transição suave
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <BusinessProvider>
          <LayoutProvider>
            <SplashScreen isVisible={loading} />
            <main className="animate-in fade-in duration-1000 min-h-screen">
              <AppRoutes />
            </main>
            <DebugAccessTag />
          </LayoutProvider>
        </BusinessProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}



