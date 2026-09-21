// src/modules/business/settings/BrandSettings.tsx
import React, { useState, useEffect } from 'react';
import {
  Palette,
  Upload,
  Globe,
  Instagram,
  MessageCircle,
  Check,
  CheckCircle2,
  Lock,
  Sparkles,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useBusiness } from '../../../core/BusinessContext';
import { useModuleAccess } from '../../../hooks/useModuleAccess';
import { UpgradeModal } from '../../../components/modals/UpgradeModal';

export const BrandSettings: React.FC = () => {
  const { currentBusiness, updateBusiness } = useBusiness();
  const { hasAccess, isDeveloper, LockedOverlay } = useModuleAccess('custom_branding');

  // Cores e Identidade da Clínica
  const [primaryColor, setPrimaryColor] = useState<string>(
    currentBusiness?.primary_color || '#EAD7D1'
  );
  const [backgroundColor, setBackgroundColor] = useState<string>(
    currentBusiness?.background_color || '#FAF8F5'
  );
  const [logoUrl, setLogoUrl] = useState<string>(
    currentBusiness?.logo || currentBusiness?.logo_url || ''
  );
  const [instagram, setInstagram] = useState<string>(
    currentBusiness?.instagram || '@suaclinica'
  );
  const [whatsapp, setWhatsapp] = useState<string>(
    currentBusiness?.whatsapp || '(11) 98765-4321'
  );
  const [customDomain, setCustomDomain] = useState<string>(
    currentBusiness?.custom_domain || `agenda.${currentBusiness?.slug || 'clinica'}.aura.app`
  );

  const [isDragging, setIsDragging] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Sincroniza estado se a clínica mudar
  useEffect(() => {
    if (currentBusiness) {
      setPrimaryColor(currentBusiness.primary_color || '#EAD7D1');
      setBackgroundColor(currentBusiness.background_color || '#FAF8F5');
      setLogoUrl(currentBusiness.logo || currentBusiness.logo_url || '');
      setInstagram(currentBusiness.instagram || '@suaclinica');
      setWhatsapp(currentBusiness.whatsapp || '(11) 98765-4321');
      setCustomDomain(currentBusiness.custom_domain || `agenda.${currentBusiness.slug}.aura.app`);
    }
  }, [currentBusiness]);

  // Paleta de luxo pré-definida
  const luxuryPalettes = [
    { name: 'Misty Rose (Padrão Aura)', color: '#EAD7D1' },
    { name: 'Ouro Champagne', color: '#B88746' },
    { name: 'Terracota Chic', color: '#C26B54' },
    { name: 'Verde Spa Botânico', color: '#2D6A4F' },
    { name: 'Grafite Noir', color: '#2D2725' },
    { name: 'Lavanda Serene', color: '#9D8189' },
  ];

  // Leitura de arquivo de logo local (drag-and-drop ou seleção manual)
  const handleProcessLogo = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, envie um arquivo de imagem válido (PNG ou SVG recomendado).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessLogo(e.dataTransfer.files[0]);
    }
  };

  // Salvar Identidade Visual no Tenant
  const handleSaveIdentity = () => {
    if (!currentBusiness) return;

    updateBusiness(currentBusiness.id, {
      primary_color: primaryColor,
      background_color: backgroundColor,
      logo: logoUrl,
      logo_url: logoUrl,
      instagram,
      whatsapp,
      custom_domain: customDomain,
      white_label_enabled: true,
    });

    // Injeta dinamicamente as variáveis no CSS :root para propagação instantânea
    document.documentElement.style.setProperty('--brand-primary', primaryColor);
    document.documentElement.style.setProperty('--brand-bg', backgroundColor);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleDiscardChanges = () => {
    if (currentBusiness) {
      setPrimaryColor(currentBusiness.primary_color || '#EAD7D1');
      setBackgroundColor(currentBusiness.background_color || '#FAF8F5');
      setLogoUrl(currentBusiness.logo || currentBusiness.logo_url || '');
      setInstagram(currentBusiness.instagram || '@suaclinica');
      setWhatsapp(currentBusiness.whatsapp || '(11) 98765-4321');
    }
  };

  const clinicInitial = currentBusiness?.name ? currentBusiness.name.charAt(0).toUpperCase() : 'A';

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20 font-sans text-[#3A3A3A] relative">
      {/* TOAST FEEDBACK */}
      {savedSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-[#2D2725] text-[#FDFCFB] px-6 py-3.5 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2.5 border border-white/20 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Identidade da marca salva e propagada para o Aura App!</span>
        </div>
      )}

      {/* CABEÇALHO */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#8E8E8E]">
            <Palette size={13} className="text-[#C5A059]" />
            <span>Aura White-label & Custom Branding</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#3A3A3A] tracking-tight">
            Identidade da Marca
          </h1>
          <p className="text-sm text-[#8E8E8E] max-w-2xl">
            Personalize a experiência do seu cliente no Aura App com as cores, logotipo e redes sociais oficiais da sua clínica.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasAccess ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1.5">
              <Check size={13} className="text-emerald-600" />
              <span>Plano Pro • White-label Ativo</span>
            </span>
          ) : (
            <button
              onClick={() => setUpgradeModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1.5 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <Lock size={13} className="text-rose-600" />
              <span>Requer Upgrade • Plano Pro</span>
            </button>
          )}
        </div>
      </header>

      {/* ÁREA PRINCIPAL: CONFIGURAÇÃO + PREVIEW REALTIME */}
      <div className="relative">
        {/* BLOQUEIO DE MÓDULO SAAS (LOCKED OVERLAY) SE ESTIVER NO PLANO ESSENCIAL */}
        {!hasAccess && (
          <LockedOverlay
            moduleName="Custom Branding & White-label"
            customDescription="Transforme a experiência da sua clínica com sua própria paleta de cores, logotipo exclusivo e links personalizados no Aura App e na Vitrine Pública."
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* COLUNA ESQUERDA: CONFIGURAÇÕES DA MARCA */}
          <section className="lg:col-span-7 space-y-8">
            
            {/* 1. UPLOAD DE LOGOMARCA */}
            <div className="bg-white p-7 sm:p-8 rounded-[36px] shadow-xs border border-[#F1EBE7]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold text-[#3A3A3A] uppercase tracking-[0.2em]">
                  Logomarca Oficial
                </h3>
                <span className="text-[11px] text-[#8E8E8E]">Portal & Comprovantes</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`w-28 h-28 rounded-full bg-[#FAF8F5] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden shrink-0 relative group ${
                    isDragging ? 'border-[#C5A059] bg-[#F4EFEA]' : 'border-[#D5C4BC]/60'
                  }`}
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo da Clínica"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-2 text-[#8E8E8E]">
                      <Upload size={22} className="mb-1 text-[#C5A059]" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Logo</span>
                    </div>
                  )}

                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-bold tracking-widest uppercase">
                    Alterar
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleProcessLogo(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="space-y-3 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <label className="px-5 py-2.5 bg-[#2D2725] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5">
                      <Upload size={13} />
                      <span>Selecionar Arquivo</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleProcessLogo(e.target.files[0]);
                          }
                        }}
                      />
                    </label>

                    {logoUrl && (
                      <button
                        type="button"
                        onClick={() => setLogoUrl('')}
                        className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#8E8E8E] hover:text-rose-600 transition-colors"
                      >
                        Remover Logo
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-[#8E8E8E]">
                    Envie seu logo em PNG ou SVG transparente com até 2MB. A imagem será ajustada automaticamente no cabeçalho do portal do cliente.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. PALETA DE CORES */}
            <div className="bg-white p-7 sm:p-8 rounded-[36px] shadow-xs border border-[#F1EBE7] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] font-bold text-[#3A3A3A] uppercase tracking-[0.2em]">
                    Cores do Portal & Botões
                  </h3>
                  <p className="text-xs text-[#8E8E8E] mt-0.5">
                    Define a cor de botões de agendamento, realces visuais e detalhes refinados no app do consumidor.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPrimaryColor('#EAD7D1');
                    setBackgroundColor('#FAF8F5');
                  }}
                  className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={11} />
                  <span>Padrão Aura</span>
                </button>
              </div>

              {/* Seletor Personalizado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-widest">
                    Cor Principal (Destaque & Botões)
                  </label>
                  <div className="flex items-center gap-3 p-2.5 bg-[#FAF8F5] rounded-2xl border border-[#F1EBE7]">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-bold text-[#3A3A3A] uppercase">
                        {primaryColor}
                      </span>
                      <span className="text-[10px] text-[#8E8E8E]">Código Hexadecimal</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-widest">
                    Fundo Suave (Canvas)
                  </label>
                  <div className="flex items-center gap-3 p-2.5 bg-[#FAF8F5] rounded-2xl border border-[#F1EBE7]">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-bold text-[#3A3A3A] uppercase">
                        {backgroundColor}
                      </span>
                      <span className="text-[10px] text-[#8E8E8E]">Tom de fundo acolhedor</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paletas de Luxo Pré-definidas */}
              <div className="space-y-2.5 pt-2 border-t border-[#F1EBE7]">
                <label className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-widest block">
                  Paletas Curadas de Luxo Silencioso
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {luxuryPalettes.map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      onClick={() => setPrimaryColor(p.color)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        primaryColor.toLowerCase() === p.color.toLowerCase()
                          ? 'border-[#3A3A3A] bg-[#FAF8F5] shadow-xs'
                          : 'border-[#F1EBE7] bg-white hover:border-[#D5C4BC]'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-xs"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="text-[11px] font-medium text-[#3A3A3A] truncate">
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. REDES SOCIAIS & CONTATO */}
            <div className="bg-white p-7 sm:p-8 rounded-[36px] shadow-xs border border-[#F1EBE7] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-[#3A3A3A] uppercase tracking-[0.2em]">
                  Redes & Contato Integrado
                </h3>
                <span className="text-[11px] text-[#8E8E8E]">Vitrine Pública & WhatsApp</span>
              </div>

              <div className="space-y-3.5">
                <div className="relative">
                  <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E8E]" size={17} />
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@suaclinica"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FAF8F5] border border-[#F1EBE7] outline-none text-xs font-medium text-[#3A3A3A] focus:border-[#C5A059] transition-all"
                  />
                </div>

                <div className="relative">
                  <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E8E]" size={17} />
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="WhatsApp (11) 98765-4321"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FAF8F5] border border-[#F1EBE7] outline-none text-xs font-medium text-[#3A3A3A] focus:border-[#C5A059] transition-all"
                  />
                </div>

                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E8E]" size={17} />
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="agenda.suaclinica.aura.app"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FAF8F5] border border-[#F1EBE7] outline-none text-xs font-medium text-[#3A3A3A] focus:border-[#C5A059] transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* COLUNA DIREITA: PREVIEW EM TEMPO REAL (MOCKUP SMARTPHONE) */}
          <section className="lg:col-span-5 flex flex-col items-center">
            <div className="sticky top-20 w-full max-w-[340px] space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8E8E8E] uppercase tracking-wider">
                  <Smartphone size={13} className="text-[#C5A059]" />
                  <span>Preview em Tempo Real</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Live View
                </span>
              </div>

              {/* MOCKUP DO SMARTPHONE DE LUXO */}
              <div className="mx-auto w-[310px] h-[610px] bg-[#1E1C1B] rounded-[50px] p-3 shadow-2xl border-[6px] border-[#2D2725] relative">
                
                {/* NOTCH & CÂMERA */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#1E1C1B] rounded-b-xl z-30 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-black/60 mr-2" />
                  <div className="w-1 h-1 rounded-full bg-blue-900/40" />
                </div>

                {/* TELA DO CELULAR */}
                <div className="bg-[#FAF8F5] h-full w-full rounded-[38px] overflow-hidden flex flex-col relative text-[#3A3A3A]">
                  
                  {/* BARRA DE STATUS DO DISPOSITIVO */}
                  <div className="pt-2 px-6 pb-1 flex justify-between items-center text-[10px] font-bold text-[#8E8E8E] z-20">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px]">5G</span>
                      <div className="w-4 h-2 border border-[#8E8E8E] rounded-xs p-0.5 flex items-center">
                        <div className="w-full h-full bg-[#8E8E8E] rounded-2xs" />
                      </div>
                    </div>
                  </div>

                  {/* TOPO COM IDENTIDADE DA CLÍNICA */}
                  <div
                    className="p-5 border-b border-[#EDE7DF] flex flex-col items-center justify-center transition-colors duration-300 relative"
                    style={{ backgroundColor: `${primaryColor}22` }}
                  >
                    <div
                      className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-white mb-2"
                      style={{ borderColor: primaryColor }}
                    >
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="Logo Preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="font-serif text-xl font-bold" style={{ color: primaryColor }}>
                          {clinicInitial}
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-sm font-bold text-[#2D2725] tracking-tight">
                      {currentBusiness?.name || 'Sua Clínica de Estética'}
                    </h4>
                    <p className="text-[10px] text-[#8E8E8E] flex items-center gap-1 mt-0.5">
                      <Instagram size={10} className="text-[#C5A059]" />
                      <span>{instagram}</span>
                    </p>
                  </div>

                  {/* CONTEÚDO DO PORTAL DO CLIENTE */}
                  <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    {/* Selo de boas-vindas */}
                    <div className="p-3 bg-white rounded-2xl border border-[#EDE7DF] shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#8E8E8E]">
                          Experiência Exclusiva
                        </span>
                        <div
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ backgroundColor: primaryColor }}
                        />
                      </div>
                      <p className="text-xs font-serif font-bold text-[#2D2725]">
                        Agende seu momento de cuidado
                      </p>
                    </div>

                    {/* Exemplo de card de procedimento */}
                    <div className="bg-white p-3.5 rounded-2xl border border-[#EDE7DF] shadow-2xs space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[11px] font-bold text-[#2D2725]">Limpeza de Pele Diamante</p>
                          <p className="text-[9px] text-[#8E8E8E]">60 min • Com extração e máscara ouro</p>
                        </div>
                        <span
                          className="text-xs font-bold font-serif"
                          style={{ color: primaryColor }}
                        >
                          R$ 280
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#8E8E8E] border border-[#EDE7DF]">
                          Facial
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                          Mais Procurado
                        </span>
                      </div>
                    </div>

                    {/* BOTÃO PRINCIPAL COM COR DINÂMICA DA MARCA */}
                    <div className="pt-2">
                      <button
                        type="button"
                        className="w-full py-3.5 rounded-full text-white text-[11px] font-bold uppercase tracking-widest shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                        style={{
                          backgroundColor: primaryColor,
                          color: '#FFFFFF',
                          textShadow: '0 1px 2px rgba(0,0,0,0.15)'
                        }}
                      >
                        <Sparkles size={13} />
                        <span>Agendar Procedimento</span>
                      </button>
                      <p className="text-[9px] text-center text-[#8E8E8E] mt-2">
                        WhatsApp oficial: {whatsapp}
                      </p>
                    </div>
                  </div>

                  {/* INDICADOR INFERIOR (HOME BAR) */}
                  <div className="pb-2 pt-1 flex justify-center">
                    <div className="w-24 h-1 bg-[#2D2725]/20 rounded-full" />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-center text-[#8E8E8E]">
                Esta é a visualização instantânea que sua paciente terá ao acessar seu link personalizado.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* FOOTER COM AÇÕES */}
      <footer className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-[#F1EBE7] px-2">
        <div className="text-xs text-[#8E8E8E]">
          As alterações feitas aqui são propagadas dinamicamente para o Aura App e Vitrine.
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleDiscardChanges}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-[#8E8E8E] uppercase hover:text-[#3A3A3A] transition-colors cursor-pointer"
          >
            Descartar
          </button>
          
          <button
            type="button"
            onClick={handleSaveIdentity}
            className="px-8 py-3 bg-[#2D2725] text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-black hover:shadow-soft-glow transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check size={15} />
            <span>Salvar Identidade</span>
          </button>
        </div>
      </footer>

      {/* MODAL DE UPGRADE */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        moduleId="custom_branding"
      />
    </div>
  );
};
