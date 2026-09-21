// src/components/ui/SplashScreen.tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuraLoaderV3 } from './AuraLoaderV3';

export interface SplashScreenProps {
  isVisible: boolean;
  message?: string;
  signature?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  isVisible,
  message = 'Lapidando sua melhor versão',
  signature = 'The New Era of Beauty',
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="aura-splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: 'easeInOut' },
          }}
          className="fixed inset-0 z-[9999] bg-aura-pearl flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Luz de fundo pulsante sutil (Névoa Rose Luminous) */}
          <motion.div
            animate={{
              opacity: [0.25, 0.45, 0.25],
              scale: [1, 1.12, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-[520px] h-[520px] bg-aura-rose/20 rounded-full blur-[100px] pointer-events-none"
          />

          {/* O Loader Interativo Aura V3: The Loom (O Tear) */}
          <div className="relative z-10">
            <AuraLoaderV3 message={message} />
          </div>

          {/* Assinatura de luxo na base */}
          {signature && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="absolute bottom-10 sm:bottom-12 text-center px-4"
            >
              <p className="text-[10px] sm:text-[11px] font-bold text-aura-taupe uppercase tracking-[0.45em]">
                {signature}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;

