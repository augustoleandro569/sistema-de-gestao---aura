// src/components/ui/AuraLoader.tsx
import React from 'react';
import { motion } from 'motion/react';
import { AURA_FLOW_PATH } from './AuraBrand';

export interface AuraLoaderProps {
  message?: string;
  className?: string;
}

export const AuraLoader: React.FC<AuraLoaderProps> = ({
  message = 'Sua melhor versão está carregando',
  className = '',
}) => (
  <div className={`flex flex-col items-center justify-center select-none ${className}`}>
    <div className="w-64 h-32 relative">
      <svg
        viewBox="0 0 450 120"
        className="w-full h-full fill-none stroke-aura-rose/20"
        strokeWidth="2"
      >
        {/* Ghost path ao fundo */}
        <path
          d={AURA_FLOW_PATH}
          opacity="0.15"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Caminho animado */}
        <motion.path
          d={AURA_FLOW_PATH}
          stroke="#EAD7D1"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 2.5,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        {/* Faísca animada (✦) */}
        <motion.path
          d="M420 20 L425 10 L430 20 L440 25 L430 30 L425 40 L420 30 L410 25 Z"
          fill="#C5A059"
          animate={{
            scale: [0.8, 1.4, 0.8],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
    <motion.p
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="text-[10px] font-bold text-aura-taupe uppercase tracking-[0.4em] text-center mt-2"
    >
      {message}
    </motion.p>
  </div>
);

export default AuraLoader;
