// src/components/ui/AuraBrand.tsx
import React from 'react';
import { motion } from 'motion/react';

export interface BrandProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'app' | 'business';
  isLight?: boolean;
  className?: string;
  onClick?: () => void;
  subtitle?: string;
  accentColor?: string;
}

export type AuraBrandProps = BrandProps;

export const AURA_FLOW_PATH =
  'M30 100 L70 20 L110 100 M110 100 C130 100 130 80 130 70 L130 40 C130 20 170 20 170 40 L170 80 C170 100 210 100 210 80 L210 30 C210 10 250 10 270 30 C285 45 285 65 270 80 L210 80 M275 80 L320 100 M320 100 L360 20 L400 100 M340 70 L380 70';

// Alias para compatibilidade
export const AURA_LIGATURE_PATH = AURA_FLOW_PATH;

export const AuraBrand: React.FC<BrandProps> = ({
  size = 'md',
  variant = 'app',
  isLight = false,
  className = '',
  onClick,
  subtitle,
}) => {
  const sizes = {
    sm: 'h-6',
    md: 'h-12',
    lg: 'h-20',
    xl: 'h-32',
  };

  const labelText =
    subtitle !== undefined
      ? subtitle
      : variant === 'business'
      ? 'Business Intelligence'
      : 'Beauty Gateway';

  return (
    <motion.div
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center cursor-pointer group select-none ${sizes[size]} ${className}`}
      whileHover="hover"
      initial="initial"
    >
      <svg
        viewBox="0 0 450 120"
        className={`h-full w-auto transition-colors duration-500 overflow-visible ${
          isLight ? 'stroke-white' : 'stroke-aura-charcoal'
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* LIGATURA A-U-R-A FLOW */}
        <motion.path
          d={AURA_FLOW_PATH}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hover: {
              pathLength: [1, 0.98, 1],
              stroke: '#EAD7D1', // Aura Rose no hover
              filter: 'drop-shadow(0 0 8px rgba(234, 215, 209, 0.8))',
            },
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* SPARKLE (✦) - A Assinatura do Brilho */}
        <motion.path
          d="M420 20 L425 10 L430 20 L440 25 L430 30 L425 40 L420 30 L410 25 Z"
          fill={isLight ? '#FFFFFF' : '#C5A059'}
          variants={{
            hover: { scale: [1, 1.5, 1], rotate: 90 },
          }}
          transition={{ duration: 0.8 }}
        />
      </svg>

      {/* IDENTIFICADOR DE AMBIENTE */}
      {labelText && (
        <motion.span
          className={`text-[0.25em] font-bold tracking-[0.6em] uppercase mt-1 pointer-events-none whitespace-nowrap leading-none ${
            isLight ? 'text-white/70' : 'text-aura-taupe'
          }`}
          variants={{
            hover: {
              letterSpacing: '0.8em',
              color: isLight ? '#FFFFFF' : '#3A3A3A',
            },
          }}
          transition={{ duration: 0.3 }}
        >
          {labelText}
        </motion.span>
      )}
    </motion.div>
  );
};

export default AuraBrand;
