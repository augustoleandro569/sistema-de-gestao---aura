// src/components/common/BusinessAccessBarrier.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Globe, Store, ArrowRight } from 'lucide-react';
import { useBusiness } from '../../core/BusinessContext';
import { useLayout } from '../../layouts/LayoutContext';

interface BusinessAccessBarrierProps {
  onGoToDashboard?: () => void;
  onGoToStorefront?: () => void;
}

export const BusinessAccessBarrier: React.FC<BusinessAccessBarrierProps> = ({
  onGoToDashboard,
  onGoToStorefront,
}) => {
  const navigate = useNavigate();
  const { currentBusiness, setPublicProfileSlug } = useBusiness();
  const { setCurrentTab, setActivePillar } = useLayout();

  const handleDashboard = () => {
    setActivePillar('business');
    setCurrentTab('dashboard');
    navigate('/business/dashboard');
    if (onGoToDashboard) onGoToDashboard();
  };

  const handleStorefront = () => {
    if (currentBusiness?.slug) {
      setPublicProfileSlug(currentBusiness.slug);
      setCurrentTab('vitrine');
    }
    if (onGoToStorefront) onGoToStorefront();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-aura-charcoal flex flex-col items-center justify-center p-6 select-none animate-in fade-in">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-aura-linen shadow-luminous text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#FAF5EB] text-[#C5A059] mx-auto flex items-center justify-center border border-[#F1EBE7] shadow-soft-glow">
          <Shield size={30} />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 uppercase tracking-wider">
            Ambiente de Consumo Restrito
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-aura-charcoal">
            Acesso Restrito ao Aura App
          </h1>
          <p className="text-xs text-aura-slate leading-relaxed max-w-md mx-auto">
            O feed e o catálogo do <strong>Aura App</strong> são desenhados exclusivamente para clientes finais. Como gestor ou profissional da clínica <strong>{currentBusiness?.name || 'Aura'}</strong>, sua operação deve permanecer focada na gestão, agenda e finanças dentro do <strong>Aura Business</strong>.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#F9F7F5] border border-[#F1EBE7] text-left space-y-2">
          <p className="text-[11px] font-bold text-aura-charcoal flex items-center gap-1.5">
            <Store size={14} className="text-[#C5A059]" />
            <span>Quer ver como os clientes enxergam sua clínica?</span>
          </p>
          <p className="text-[11px] text-aura-slate">
            Você pode conferir a <strong>Vitrine Pública</strong> da sua clínica sem precisar acessar o feed social do consumidor.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleDashboard}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-aura-rose text-aura-charcoal text-xs font-bold shadow-soft-glow hover:brightness-95 transition-all cursor-pointer"
          >
            <LayoutDashboard size={16} />
            <span>Ir para o Painel da Clínica (Aura Business)</span>
          </button>

          <button
            type="button"
            onClick={handleStorefront}
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white text-aura-charcoal border border-aura-border text-xs font-bold hover:bg-aura-linen/40 transition-all cursor-pointer"
          >
            <Globe size={15} className="text-aura-taupe" />
            <span>Visualizar Minha Vitrine Pública</span>
          </button>
        </div>
      </div>
    </div>
  );
};
