// src/components/ui/AuraLogo.tsx
import React from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export interface AuraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
  onClick?: () => void;
  showSparklePop?: boolean;
}

export const AuraLogo: React.FC<AuraLogoProps> = ({
  className = '',
  size = 'md',
  subtitle = 'Beauty Gateway',
  onClick,
  showSparklePop = false,
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Efeito de mola para a luz da Aura seguir o mouse de forma suave
  const shadowX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const shadowY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const iconSizes = {
    sm: 'w-9 h-9 rounded-xl text-lg',
    md: 'w-12 h-12 rounded-2xl text-2xl',
    lg: 'w-14 h-14 rounded-3xl text-3xl',
  };

  const titleSizes = {
    sm: 'text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`relative flex items-center gap-3.5 cursor-pointer group select-none ${className}`}
      whileHover="hover"
      initial="initial"
    >
      {/* 1. A "AURA" INTERATIVA (Luz de fundo suave que segue o mouse) */}
      <motion.div
        style={{ x: shadowX, y: shadowY }}
        className="absolute -inset-4 bg-aura-rose/40 blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />

      {/* 2. O ÍCONE 'A' EVOLUÍDO E VIVO */}
      <motion.div
        variants={{
          initial: { scale: 1, rotate: 0 },
          hover: { scale: 1.08, rotate: [-2, 2, -2], transition: { duration: 0.4 } },
        }}
        className={`${iconSizes[size]} bg-aura-charcoal text-white flex items-center justify-center shadow-soft-glow relative z-10 shrink-0 border border-aura-charcoal/20`}
      >
        <span className="font-serif font-bold tracking-tight">A</span>

        {/* Faísca de brilho constante com pulsação suave */}
        <motion.span
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.9, 1.2, 0.9],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1.5 -right-1.5 text-aura-rose text-base select-none pointer-events-none drop-shadow-xs"
        >
          ✦
        </motion.span>

        {/* Efeito Pop adicional para ganho de selos e conquistas */}
        {showSparklePop && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 2, 0], opacity: [1, 0.8, 0] }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute -top-3 -right-3 text-aura-gold text-2xl select-none pointer-events-none"
          >
            ✨
          </motion.span>
        )}
      </motion.div>

      {/* 3. O NOME 'AURA' COM TIPOGRAFIA QUE RESPIRA */}
      <div className="relative z-10 flex flex-col justify-center">
        <motion.h1
          variants={{
            initial: { letterSpacing: '0.02em' },
            hover: { letterSpacing: '0.14em' },
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`${titleSizes[size]} font-serif font-bold text-aura-charcoal leading-none transition-all`}
        >
          AURA
        </motion.h1>

        {subtitle && (
          <motion.p
            className="text-[9px] font-bold text-aura-taupe uppercase tracking-[0.32em] mt-1 leading-none"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};
