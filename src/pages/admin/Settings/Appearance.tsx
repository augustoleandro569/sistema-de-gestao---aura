import React, { useState } from 'react';
import {
  Palette,
  Upload,
  Globe,
  CheckCircle2,
  Lock,
  Sparkles,
  Eye,
  Zap,
  ShieldCheck,
  Calendar,
  Check
} from 'lucide-react';
import { useBusiness, useSubscription } from '../../../core/BusinessContext';
import { useAuth } from '../../../context/AuthContext';
import { UpgradeModal } from '../../../components/modals/UpgradeModal';

export const AppearanceSettings: React.FC = () => {
  const {
    currentBusiness,
    updateBusiness,
    toggleModuleForBusiness,
    isSuperAdminMode,
    isImpersonating,
  } = useBusiness();
  const { hasModule } = useSubscription();
  const { userProfile, userRole } = useAuth();

  const isPlatformAdmin =
    userProfile?.email?.toLowerCase() === 'dev@aura.com.br' ||
    userProfile?.email?.toLowerCase() === 'augusto.leandro569@gmail.com' ||
    userRole === 'PLATFORM_ADMIN' ||
    userRole === 'SUPER_ADMIN' ||
    isSuperAdminMode ||
    isImpersonating;

  const isAddonActive = hasModule('custom_branding') || isPlatformAdmin;

  const [primaryColor, setPrimaryColor] = useState<string>(
    currentBusiness.primary_color || '#D5B0AC'
  );
  const [backgroundColor, setBackgroundColor] = useState<string>(
    currentBusiness.background_color || '#FAFAF9'
  );
  const [logoUrl, setLogoUrl] = useState<string>(
    currentBusiness.logo || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=200&q=80'
  );
  const [customDomain, setCustomDomain] = useState<string>(
    currentBusiness.custom_domain || `agenda.${currentBusiness.slug}.com.br`
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Paletas de luxo pré-definidas para estética
  const colorPresets = [
    { name: 'Nude Rosê Aura', color: '#D5B0AC' },
    { name: 'Ouro Champagne', color: '#B88746' },
    { name: 'Terracota Chic', color: '#C26B54' },
    { name: 'Verde Spa Botânico', color: '#2D6A4F' },
    { name: 'Grafite Noir', color: '#2D2725' },
    { name: 'Lavanda Serene', color: '#9D8189' },
  ];

  const bgPresets = [
    { name: 'Off-White Puro', color: '#FAFAF9' },
    { name: 'Soft Warm Nude', color: '#FAF8F5' },
    { name: 'Rose Light', color: '#FDF7F7' },
    { name: 'Mint Clean', color: '#F4FAF7' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness(currentBusiness.id, {
      primary_color: primaryColor,
      background_color: backgroundColor,
      logo: logoUrl,
      custom_domain: customDomain,
      white_label_enabled: true,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Simulação de upload de arquivo pegando exemplo de logo de estética
    setLogoUrl('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80');
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
      {/* Header da Sub-aba */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE7DF]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-display font-bold text-[#2D2725]">
              Identidade Visual da Unidade (White-label)
            </h2>
            {isAddonActive ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Check size={12} /> Add-on Ativo
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                <Lock size={12} /> Add-on Bloqueado
              </span>
            )}
          </div>
          <p className="text-xs text-[#8F8278] mt-1">
            Personalize a marca da clínica no Portal do Cliente, comprovantes de agendamento e domínio próprio.
          </p>
        </div>

        {isPlatformAdmin && isImpersonating && (
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-amber-600" />
            Configurando como Super Admin
          </div>
        )}
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 shadow-xs">
          <CheckCircle2 size={16} /> Identidade visual salva com sucesso! O Portal do Cliente agora refletirá suas cores e logotipo.
        </div>
      )}

      {/* Se o Add-on não estiver ativo e não for admin: Exibir Tela de Bloqueio & Venda */}
      {!isAddonActive && (
        <div className="rounded-3xl bg-gradient-to-br from-[#FAF8F5] to-[#F5EFE6] border-2 border-dashed border-[#D5C9BD] p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#B88746] to-[#8C6226] text-white flex items-center justify-center mx-auto shadow-md">
            <Palette size={32} />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-[#2D2725]">
              Deseja a sua própria marca no Aura?
            </h3>
            <p className="text-xs text-[#7A6E65] leading-relaxed">
              Com o add-on <strong>Custom Branding (White-label)</strong>, você substitui as cores e o logo padrão do Aura pela identidade da sua clínica. Seus clientes verão exclusivamente o seu logotipo e suas cores oficiais.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left text-xs">
            <div className="p-3 bg-white rounded-2xl border border-[#EDE7DF] space-y-1">
              <span className="font-bold text-[#2D2725] block">Cores Oficiais</span>
              <p className="text-[11px] text-[#8F8278]">Paleta sob medida no portal e botões.</p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#EDE7DF] space-y-1">
              <span className="font-bold text-[#2D2725] block">Logomarca Própria</span>
              <p className="text-[11px] text-[#8F8278]">No cabeçalho, perfil e comprovantes.</p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#EDE7DF] space-y-1">
              <span className="font-bold text-[#2D2725] block">Domínio Próprio</span>
              <p className="text-[11px] text-[#8F8278]">agenda.suaclinica.com.br</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setUpgradeModalOpen(true)}
              className="px-6 py-3 rounded-full bg-[#2D2725] hover:bg-[#3D3532] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap size={15} /> Ativar Add-on White-label (R$ 99,90/mês)
            </button>
            <button
              type="button"
              onClick={() => toggleModuleForBusiness(currentBusiness.id, 'custom_branding')}
              className="px-5 py-3 rounded-full bg-white border border-[#D5C9BD] hover:bg-[#FAF8F5] text-xs font-semibold text-[#5C534D] transition-colors cursor-pointer"
            >
              Testar em Modo Demonstração
            </button>
          </div>
        </div>
      )}

      {/* Formulário de Identidade Visual (quando ativo) */}
      {isAddonActive && (
        <form onSubmit={handleSave} className="space-y-8">
          {/* 1. Upload de Logo */}
          <div className="space-y-3 bg-white p-6 rounded-3xl border border-[#EDE7DF] shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#4A423C] uppercase tracking-wider">
                Logomarca da Clínica (PNG Transparente / SVG)
              </label>
              <span className="text-[11px] text-[#8F8278]">Recomendado: 400x120px</span>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-[#D5C9BD] hover:border-[#B88746] p-6 rounded-[28px] text-center bg-[#FAF8F5] transition-colors"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <img
                  src={logoUrl}
                  alt="Pré-visualização do Logo"
                  className="h-16 max-w-[200px] object-contain rounded-xl ring-1 ring-black/5 bg-white p-2 shadow-xs"
                />
                <p className="text-xs text-[#5C534D] font-medium mt-1">
                  Arraste sua logo aqui ou insira a URL abaixo
                </p>
                <div className="w-full max-w-md mt-2 flex gap-2">
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://suaclinica.com.br/logo.png"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5C9BD] text-xs text-[#2D2725] focus:outline-none focus:ring-2 focus:ring-[#B88746]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Seletor de Cores Primárias */}
          <div className="bg-white p-6 rounded-3xl border border-[#EDE7DF] shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-[#2D2725] uppercase tracking-wider">
              Paleta de Cores do Sistema
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cor de Destaque */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#4A423C]">
                    Cor de Destaque (Botões, Badges, Destaques)
                  </label>
                  <span className="text-xs font-mono font-bold text-[#2D2725]">{primaryColor}</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-16 h-12 rounded-xl cursor-pointer border border-[#D5C9BD] p-1 bg-white"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C9BD] text-xs font-mono font-bold text-[#2D2725]"
                  />
                </div>

                {/* Presets de Cores */}
                <div className="pt-1">
                  <span className="text-[10px] text-[#8F8278] uppercase font-semibold block mb-1.5">
                    Sugestões de Paleta:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {colorPresets.map((p) => (
                      <button
                        key={p.color}
                        type="button"
                        onClick={() => setPrimaryColor(p.color)}
                        title={p.name}
                        className="w-7 h-7 rounded-lg border border-black/10 shadow-xs transition-transform hover:scale-110 cursor-pointer relative"
                        style={{ backgroundColor: p.color }}
                      >
                        {primaryColor.toLowerCase() === p.color.toLowerCase() && (
                          <Check size={12} className="text-white absolute inset-0 m-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cor de Fundo do Portal */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#4A423C]">
                    Cor de Fundo (Portal do Cliente)
                  </label>
                  <span className="text-xs font-mono font-bold text-[#2D2725]">{backgroundColor}</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-16 h-12 rounded-xl cursor-pointer border border-[#D5C9BD] p-1 bg-white"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C9BD] text-xs font-mono font-bold text-[#2D2725]"
                  />
                </div>

                {/* Presets de Fundo */}
                <div className="pt-1">
                  <span className="text-[10px] text-[#8F8278] uppercase font-semibold block mb-1.5">
                    Fundos Recomendados:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {bgPresets.map((p) => (
                      <button
                        key={p.color}
                        type="button"
                        onClick={() => setBackgroundColor(p.color)}
                        title={p.name}
                        className="w-7 h-7 rounded-lg border border-black/10 shadow-xs transition-transform hover:scale-110 cursor-pointer relative"
                        style={{ backgroundColor: p.color }}
                      >
                        {backgroundColor.toLowerCase() === p.color.toLowerCase() && (
                          <Check size={12} className="text-[#2D2725] absolute inset-0 m-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Domínio Próprio */}
          <div className="bg-white p-6 rounded-3xl border border-[#EDE7DF] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-[#B88746]" />
              <h3 className="text-sm font-bold text-[#2D2725] uppercase tracking-wider">
                Domínio Próprio / Subdomínio
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A423C] mb-1.5">
                Endereço de Acesso dos seus Clientes
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="agenda.suaclinica.com.br"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C9BD] text-xs font-semibold text-[#2D2725]"
                />
              </div>
              <p className="text-[11px] text-[#8F8278] mt-2 leading-relaxed">
                Apontamento DNS: crie uma entrada <strong>CNAME</strong> no seu registrador (GoDaddy, Registro.br, Cloudflare) apontando para <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-[#2D2725]">cname.auraestetica.com.br</code> com SSL automático ativo.
              </p>
            </div>
          </div>

          {/* 4. Preview em Tempo Real */}
          <div className="bg-white p-6 rounded-3xl border border-[#EDE7DF] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F4EFEA]">
              <Eye size={18} className="text-[#B88746]" />
              <h3 className="text-sm font-bold text-[#2D2725] uppercase tracking-wider">
                Preview em Tempo Real do Portal do Cliente
              </h3>
            </div>

            {/* Mock do Portal com as Cores Escolhidas */}
            <div
              className="p-6 rounded-2xl border border-black/10 transition-colors shadow-inner space-y-4"
              style={{ backgroundColor: backgroundColor }}
            >
              {/* Header do mock */}
              <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-black/5 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={logoUrl}
                    alt="Logo Preview"
                    className="h-8 max-w-[120px] object-contain"
                  />
                  <span className="text-xs font-bold text-gray-800">{currentBusiness.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Agendar Horário
                  </span>
                </div>
              </div>

              {/* Card de Procedimento no Mock */}
              <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-800">
                    Harmonização Facial & Protocolo Exclusivo
                  </h4>
                  <p className="text-[11px] text-gray-500">60 min • Avaliação personalizada</p>
                  <span className="text-xs font-bold text-gray-900 mt-1 block">R$ 480,00</span>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  Confirmar
                </button>
              </div>

              <div className="text-[11px] text-[#5C534D] bg-white/70 p-3 rounded-xl border border-black/5 flex items-center gap-2">
                <Sparkles size={14} style={{ color: primaryColor }} />
                <span>
                  <b>Preview:</b> As cores e logo selecionados acima serão aplicados imediatamente ao <b>Portal do Cliente</b> e aos <b>Comprovantes de Confirmação</b>.
                </span>
              </div>
            </div>
          </div>

          {/* Botão de Salvar */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-[#2D2725] hover:bg-[#3D3532] text-white text-xs font-bold tracking-wider uppercase shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Check size={16} /> Salvar Identidade
            </button>
          </div>
        </form>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        moduleId="custom_branding"
      />
    </div>
  );
};
