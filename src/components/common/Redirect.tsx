import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

interface RedirectProps {
  to: string;
}

export const Redirect: React.FC<RedirectProps> = ({ to }) => {
  const { setPortalRoute } = useAuth();

  useEffect(() => {
    // Perform automatic transition
    const timer = setTimeout(() => {
      setPortalRoute(to);
    }, 150);

    return () => clearTimeout(timer);
  }, [to, setPortalRoute]);

  return (
    <div
      id="portal-redirect-guard"
      className="w-full min-h-[460px] flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full bg-white border border-[#EAE3DA] rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF3EA] border border-[#F0DFCD] text-[#B88746] flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert size={28} />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#B88746] bg-[#FAF3EA] px-2.5 py-1 rounded-full border border-[#F3E5D4]">
            1º Passo Obrigatório
          </span>
          <h2 className="text-xl font-bold text-[#2D2725]">
            Cadastro Pendente
          </h2>
          <p className="text-xs text-[#7A6E65] leading-relaxed">
            Para garantir sua segurança em procedimentos estéticos e cumprir as diretrizes de biossegurança, é necessário completar seu pré-cadastro antes de escolher a data do atendimento.
          </p>
        </div>

        <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE3DA] text-xs text-[#5C524B] flex items-center justify-center gap-2">
          <Loader2 size={15} className="animate-spin text-[#B88746]" />
          <span>Redirecionando para a página de registro...</span>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setPortalRoute(to)}
            className="w-full py-3 px-4 rounded-xl bg-[#2D2725] hover:bg-black text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Ir para o Formulário de Cadastro</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Redirect;
