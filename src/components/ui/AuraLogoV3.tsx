// src/components/ui/AuraLogoV3.tsx
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export interface AuraLogoV3Props {
  variant?: 'app' | 'business';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  subtitle?: string;
  isLight?: boolean;
}

export const AURA_MONOLINE_PATH =
  'M30 80 L55 20 L80 80 M80 80 C95 80 100 70 100 60 L100 30 C100 20 130 20 130 30 L130 70 C130 80 150 80 160 80 L170 80 L170 30 C170 15 210 15 210 35 C210 50 190 55 170 55 M195 55 L220 80 M220 80 L245 20 L270 80 M235 55 L255 55';

export const AuraLogoV3: React.FC<AuraLogoV3Props> = ({
  variant = 'app',
  size = 'md',
  className = '',
  onClick,
  subtitle,
  isLight = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Valores para interatividade do mouse
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Suavização do movimento (Efeito de seda com física de mola)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const containerSizes: Record<string, string> = {
    xs: 'h-6',
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-12',
    lg: 'h-16 sm:h-20',
    xl: 'h-24 sm:h-28',
  };

  const defaultSubtitle =
    subtitle !== undefined
      ? subtitle
      : variant === 'business'
      ? 'Business Intelligence'
      : 'Beauty Gateway';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center group cursor-pointer select-none ${
        containerSizes[size] || containerSizes.md
      } ${className}`}
    >
      {/* 1. LUZ DE FUNDO (AURA) QUE SEGUE O MOUSE */}
      <motion.div
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
        className="absolute w-24 h-24 bg-aura-rose/40 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      />

      <svg
        viewBox="0 0 320 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto overflow-visible"
      >
        <defs>
          <linearGradient id="auraGradientV3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isLight ? '#FFFFFF' : '#3A3A3A'} />
            <stop offset="50%" stopColor="#C5A059" />
            <stop offset="100%" stopColor={isLight ? '#FFFFFF' : '#3A3A3A'} />
          </linearGradient>
          <filter id="monolineGlowV3" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 2. O TRAÇO ÚNICO (LIGATURA FLUIDA - MONO-LINE FLUIDITY) */}
        <motion.path
          d={AURA_MONOLINE_PATH}
          stroke="url(#auraGradientV3)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 1 }}
          whileHover={{
            pathLength: [1, 0.98, 1],
            strokeWidth: 6,
            filter: 'url(#monolineGlowV3)',
            transition: { duration: 2, repeat: Infinity },
          }}
        />

        {/* 3. A FAÍSCA DE INTERATIVIDADE (PARTÍCULA DE SEDA) */}
        <motion.circle
          style={{ x: springX, y: springY }}
          r="3.5"
          fill="#C5A059"
          className="opacity-0 group-hover:opacity-100 blur-[0.5px] pointer-events-none transition-opacity duration-300"
        />
      </svg>

      {/* SUB-MARCA COM TIPOGRAFIA PREMIUM */}
      {defaultSubtitle && (
        <motion.div
          initial={{ opacity: 0.6, letterSpacing: '0.4em' }}
          whileHover={{
            opacity: 1,
            letterSpacing: '0.7em',
            color: isLight ? '#FFFFFF' : '#3A3A3A',
          }}
          className={`text-[8px] sm:text-[9px] font-bold uppercase transition-all duration-500 whitespace-nowrap pointer-events-none mt-0.5 leading-none ${
            isLight ? 'text-white/70' : 'text-aura-taupe'
          }`}
        >
          {defaultSubtitle}
        </motion.div>
      )}
    </div>
  );
};

export default AuraLogoV3;
