// src/components/ui/AuraLoaderV3.tsx
import React from 'react';
import { motion } from 'motion/react';
import { AURA_MONOLINE_PATH } from './AuraLogoV3';

export interface AuraLoaderV3Props {
  message?: string;
  className?: string;
}

export const AuraLoaderV3: React.FC<AuraLoaderV3Props> = ({
  message = 'Lapidando sua melhor versão',
  className = '',
}) => (
  <div className={`flex flex-col items-center gap-6 select-none ${className}`}>
    <div className="relative flex items-center justify-center">
      {/* Glow pulsante ao fundo */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-aura-rose rounded-full blur-3xl pointer-events-none"
      />

      <svg
        width="180"
        height="60"
        viewBox="0 0 320 100"
        className="relative z-10 overflow-visible"
        fill="none"
      >
        {/* Ghost background path */}
        <path
          d={AURA_MONOLINE_PATH}
          stroke="#EAD7D1"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.2"
        />

        {/* Linha animada do Tear (The Loom) */}
        <motion.path
          d={AURA_MONOLINE_PATH}
          fill="none"
          stroke="#C5A059"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Ponto de luz viajante */}
        <motion.circle
          r="4"
          fill="#EAD7D1"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{ duration: 1.25, repeat: Infinity, ease: 'easeInOut' }}
          cx="270"
          cy="80"
        />
      </svg>
    </div>

    {message && (
      <span className="text-[10px] font-bold text-aura-taupe uppercase tracking-[0.55em] animate-pulse text-center">
        {message}
      </span>
    )}
  </div>
);

export default AuraLoaderV3;
