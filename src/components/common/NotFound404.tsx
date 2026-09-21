// src/components/common/NotFound404.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Home } from 'lucide-react';

interface NotFound404Props {
  onBackToApp?: () => void;
}

export const NotFound404: React.FC<NotFound404Props> = ({ onBackToApp }) => {
  const navigate = useNavigate();

  const handleReturn = () => {
    if (onBackToApp) {
      onBackToApp();
    } else {
      navigate('/app/explorar');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-aura-charcoal flex flex-col items-center justify-center p-6 select-none animate-in fade-in">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-aura-linen shadow-luminous text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-aura-linen/80 text-aura-taupe mx-auto flex items-center justify-center shadow-soft-glow">
          <Sparkles size={28} className="text-aura-gold" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold text-aura-taupe uppercase tracking-widest">
            Erro 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-aura-charcoal">
            Página não encontrada
          </h1>
          <p className="text-xs text-aura-slate leading-relaxed">
            O endereço que você tentou acessar não existe, foi removido ou não está disponível para esta sessão.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleReturn}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-aura-rose text-aura-charcoal text-xs font-bold shadow-soft-glow hover:brightness-95 transition-all cursor-pointer"
          >
            <Home size={15} />
            <span>Voltar para o Início</span>
          </button>
        </div>
      </div>
    </div>
  );
};
