// src/components/ui/AuraLoaderLigature.tsx
import React from 'react';
import { motion } from 'motion/react';
import { AURA_LIGATURE_PATH } from './AuraBrand';

export interface AuraLoaderLigatureProps {
  message?: string;
  className?: string;
}

export const AuraLoaderLigature: React.FC<AuraLoaderLigatureProps> = ({
  message = 'Sincronizando sua beleza',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div className="w-52 h-24 relative flex items-center justify-center">
        {/* Glow de fundo */}
        <div className="absolute inset-0 bg-aura-rose/20 rounded-full blur-2xl animate-pulse pointer-events-none" />

        <svg viewBox="0 0 400 120" className="w-full h-full fill-none overflow-visible">
          {/* Sombra da Logo ao fundo */}
          <path
            d={AURA_LIGATURE_PATH}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#EAD7D1"
            opacity="0.3"
          />

          {/* Desenho Animado da Ligatura */}
          <motion.path
            d={AURA_LIGATURE_PATH}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#C5A059"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Faísca de Luz Viajante no Traço */}
          <motion.circle
            cx="300"
            cy="20"
            r="4.5"
            fill="#EAD7D1"
            animate={{
              scale: [0.8, 1.8, 0.8],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>

      {message && (
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-4 text-[9px] font-bold text-aura-taupe uppercase tracking-[0.45em] text-center"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default AuraLoaderLigature;
