// src/pages/auth/LandingPortal.tsx
import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  Heart
} from 'lucide-react';
import { useLayout } from '../../layouts/LayoutContext';
import { dataService } from '../../services/dataService';
import { Service, ContentPost } from '../../types';
import { AuthPortal } from './AuthPortal';

export const LandingPortal: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'servicos' | 'dicas'>('servicos');
  const [selectedServiceModal, setSelectedServiceModal] = useState<Service | null>(null);

  const layout = useLayout();

  // Obter serviços e dicas do sistema
  const services = dataService.getServices();
  const contentPosts = dataService.getContentPosts();
  const clients = dataService.getClients();

  // Fallback visual de imagens de estética
  const serviceImages: Record<string, string> = {
    'serv-1': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    'serv-2': 'https://images.unsplash.com/photo-1512290900672-1f551b9ce637?auto=format&fit=crop&w=600&q=80',
    'serv-3': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    'serv-4': 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80',
    'serv-5': 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80',
    'serv-6': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="min-h-screen bg-aesthetic-off-white flex flex-col items-center justify-center p-0 sm:p-4">
      {/* SEÇÃO DE APRESENTAÇÃO (VITRINE) */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-2xl rounded-[40px] overflow-hidden bg-white border border-aesthetic-bege/20 my-auto">
        
        {/* ESQUERDA: CONTEÚDOS E SERVIÇOS */}
        <div className="p-8 sm:p-12 lg:p-16 space-y-8 bg-white overflow-y-auto max-h-[90vh] scrollbar-hide">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-aesthetic-nude/40 text-[#9C753B] px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <Sparkles size={12} />
              <span>Aura Experience • Sublime Spa</span>
            </div>
            <h1 className="text-4xl font-serif text-graphite leading-tight">
              Excelência em <br /> Estética &amp; Bem-estar
            </h1>
            <p className="text-aesthetic-graphite/50 text-sm">
              Explore nossos procedimentos e dicas exclusivas.
            </p>
          </div>

          {/* Abas de Navegação da Vitrine */}
          <div className="flex gap-4 border-b border-aesthetic-bege/30 pb-2">
            <button
              type="button"
              onClick={() => setActiveFilter('servicos')}
              className={`text-xs font-bold uppercase tracking-wider pb-2 transition-all cursor-pointer ${
                activeFilter === 'servicos'
                  ? 'text-rose-700 border-b-2 border-rose-700'
                  : 'text-aesthetic-graphite/40 hover:text-graphite'
              }`}
            >
              Procedimentos em Destaque
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('dicas')}
              className={`text-xs font-bold uppercase tracking-wider pb-2 transition-all cursor-pointer ${
                activeFilter === 'dicas'
                  ? 'text-rose-700 border-b-2 border-rose-700'
                  : 'text-aesthetic-graphite/40 hover:text-graphite'
              }`}
            >
              Dicas &amp; Cuidados
            </button>
          </div>

          {activeFilter === 'servicos' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cards de Serviço Compactos para Vitrine */}
              {services.slice(0, 6).map((service) => {
                const img = serviceImages[service.id] || fallbackImage;
                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedServiceModal(service)}
                    className="group cursor-pointer bg-aesthetic-off-white/40 hover:bg-white p-3.5 rounded-[28px] border border-aesthetic-bege/30 hover:border-aesthetic-rose/50 transition-all shadow-2xs hover:shadow-md"
                  >
                    <div className="aspect-square bg-aesthetic-nude/30 rounded-3xl mb-3 overflow-hidden relative">
                      <img
                        src={img}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock size={10} className="text-aesthetic-rose" />
                        {service.durationMinutes} min
                      </span>
                    </div>
                    <h3 className="font-semibold text-graphite text-sm group-hover:text-rose-700 transition-colors line-clamp-1">
                      {service.name}
                    </h3>
                    <p className="text-xs text-rose-700 font-bold mt-0.5">
                      A partir de R$ {service.price.toFixed(0)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Cards de Dicas & Conteúdos */
            <div className="space-y-3">
              {contentPosts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="p-4 bg-aesthetic-off-white/40 hover:bg-white rounded-2xl border border-aesthetic-bege/30 hover:border-aesthetic-rose/40 transition-all flex gap-4 items-center"
                >
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase text-rose-700 tracking-wider">
                      {post.category || 'Cuidados Diários'}
                    </span>
                    <h4 className="text-sm font-semibold text-graphite truncate mt-0.5">
                      {post.title}
                    </h4>
                    <p className="text-xs text-aesthetic-graphite/50 line-clamp-1 mt-0.5">
                      {post.description || post.contentBody || 'Cuidados essenciais e novidades exclusivas.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Destaque de Atendimento Exclusivo */}
          <div className="pt-2 border-t border-aesthetic-bege/30 flex items-center justify-between text-xs text-aesthetic-graphite/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              Biossegurança &amp; Registro ANVISA
            </span>
            <span className="text-rose-700 font-semibold">Atendimento Personalizado</span>
          </div>
        </div>

        {/* DIREITA: ACESSO RESTRITO (LOGIN & CADASTRO) */}
        <div className="p-6 sm:p-10 lg:p-12 bg-aesthetic-off-white flex flex-col justify-center items-center border-l border-aesthetic-bege/20 relative overflow-y-auto max-h-[90vh]">
          <AuthPortal />
        </div>
      </div>

      {/* MODAL: DETALHES DO SERVIÇO SELECIONADO NA VITRINE */}
      {selectedServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border border-aesthetic-bege/40">
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-aesthetic-nude/20">
              <img
                src={serviceImages[selectedServiceModal.id] || fallbackImage}
                alt={selectedServiceModal.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedServiceModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-serif text-graphite">
                  {selectedServiceModal.name}
                </h3>
                <span className="text-lg font-bold text-rose-700 whitespace-nowrap">
                  R$ {selectedServiceModal.price.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-aesthetic-graphite/70 leading-relaxed">
                {selectedServiceModal.description ||
                  'Procedimento executado com insumos dermatológicos de alta pureza e protocolos validados de biossegurança.'}
              </p>

              <div className="flex items-center gap-4 text-xs text-aesthetic-graphite/60 pt-2 border-t border-aesthetic-bege/30">
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-[#9C753B]" />
                  Duração: <strong>{selectedServiceModal.durationMinutes} minutos</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles size={13} className="text-rose-700" />
                  Categoria: <strong>{selectedServiceModal.category}</strong>
                </span>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedServiceModal(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 py-3 rounded-full bg-graphite hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Acessar Portal &amp; Agendar
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedServiceModal(null)}
                  className="py-3 px-5 rounded-full border border-aesthetic-bege hover:bg-aesthetic-off-white text-xs font-semibold text-aesthetic-graphite cursor-pointer transition-colors"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPortal;
