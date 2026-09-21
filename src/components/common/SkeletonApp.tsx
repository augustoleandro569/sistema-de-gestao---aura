// src/components/common/SkeletonApp.tsx
import React from 'react';
import { AuraLoaderV3 } from '../ui/AuraLoaderV3';

export const SkeletonApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-aura-pearl flex flex-col items-center justify-center p-6 select-none font-sans">
      <AuraLoaderV3 message="Validando credenciais & isolando ambiente seguro..." />
    </div>
  );
};

export default SkeletonApp;


