import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Business, PlatformModule, PlatformModuleId, PlanType, AuditLogRoot, CommercialPlan } from '../types';
import { dataService } from '../services/dataService';

export const COMMERCIAL_PLANS: CommercialPlan[] = [
  {
    id: 'plan-essencial',
    name: 'Plano Essencial',
    slug: 'essencial',
    tagline: 'O ponto de entrada para esteticistas e clínicas organizarem agenda e clientes.',
    monthlyPrice: 49.90,
    badge: 'Ponto de Entrada',
    includedModules: ['appointments', 'clients'],
    highlightFeatures: [
      'Aba Agenda: Gestão completa de horários e salas',
      'Aba Clientes: Cadastro, histórico e pré-cadastro obrigatório',
      'Portal do Cliente: Agendamento online e Meus Dados',
      'Gestão de Usuários: Apenas Recepcionista e Profissionais',
    ],
  },
  {
    id: 'plan-pro',
    name: 'Plano Gestão Pro',
    slug: 'pro',
    tagline: 'Controle financeiro, precificação científica e gestão de estoque completa.',
    monthlyPrice: 119.90,
    badge: 'O Mais Vendido',
    isPopular: true,
    includedModules: ['appointments', 'clients', 'finance', 'inventory', 'pricing', 'indicators'],
    highlightFeatures: [
      'Tudo do Plano Essencial',
      'Aba Financeiro: Fluxo de caixa (Entradas/Saídas) e DRE simplificado',
      'Aba Estoque: Histórico de movimentações (Entrada/Saída manual)',
      'Aba Precificação: Calculadora de custos e ficha técnica de materiais',
      'Indicadores: Dashboard de faturamento e serviços mais realizados',
    ],
  },
  {
    id: 'plan-marketing',
    name: 'Plano Marketing & Experience',
    slug: 'marketing',
    tagline: 'Atração contínua de clientes, vitrine pública, fidelização e relatórios de auditoria.',
    monthlyPrice: 199.90,
    badge: 'O Premium',
    includedModules: ['appointments', 'clients', 'finance', 'inventory', 'pricing', 'indicators', 'contents', 'vitrine', 'loyalty', 'reports'],
    highlightFeatures: [
      'Tudo do Plano Gestão Pro',
      'Aba Conteúdos: Publicação de dicas, fotos e portfólio de antes & depois',
      'Aba Divulgação: Vitrine pública de serviços para bio do Instagram',
      'Módulo Fidelidade: Cartão 10+1 automático com QR Code',
      'Relatórios Avançados: Auditoria de desvio de consumo (Teórico vs Real)',
    ],
  },
  {
    id: 'plan-enterprise',
    name: 'Plano Enterprise Redes',
    slug: 'enterprise',
    tagline: 'Para redes e clínicas com White-label completo e WhatsApp incluídos.',
    monthlyPrice: 349.90,
    badge: 'Redes & Franquias',
    includedModules: ['appointments', 'clients', 'finance', 'inventory', 'pricing', 'indicators', 'contents', 'vitrine', 'loyalty', 'reports', 'custom_branding', 'whatsapp'],
    highlightFeatures: [
      'Tudo do Marketing & Experience',
      'Add-on Custom Branding (White-label) com domínio próprio',
      'Add-on Automações WhatsApp 24h antes e confirmação ativa',
      'Múltiplas unidades e relatórios consolidados',
      'Suporte prioritário e gerente de contas dedicado',
    ],
  },
];

export const PLATFORM_MODULES: PlatformModule[] = [
  {
    id: 'appointments',
    name: 'Agenda Inteligente',
    description: 'Gestão completa de horários, salas, confirmações e fila de espera.',
    base_price: 49.90,
    iconName: 'Calendar',
    badge: 'Essencial',
    category: 'core',
    requiredPlanName: 'Plano Essencial',
  },
  {
    id: 'clients',
    name: 'Gestão de Clientes',
    description: 'Cadastro, histórico estético, anamnese e pré-cadastro obrigatório.',
    base_price: 29.90,
    iconName: 'Users',
    badge: 'Essencial',
    category: 'core',
    requiredPlanName: 'Plano Essencial',
  },
  {
    id: 'finance',
    name: 'Financeiro & Fluxo de Caixa',
    description: 'Entradas, saídas, repasse de comissões, faturamento e DRE simplificado.',
    base_price: 59.90,
    iconName: 'DollarSign',
    badge: 'Gestão Pro',
    category: 'gestao',
    requiredPlanName: 'Plano Gestão Pro',
  },
  {
    id: 'inventory',
    name: 'Estoque & Insumos',
    description: 'Histórico de movimentações manuais, custo por dose/ml e auditoria.',
    base_price: 49.90,
    iconName: 'Box',
    badge: 'Gestão Pro',
    category: 'gestao',
    requiredPlanName: 'Plano Gestão Pro',
  },
  {
    id: 'pricing',
    name: 'Calculadora de Precificação',
    description: 'Custos fixos, margem de lucro e ficha técnica científica de procedimentos.',
    base_price: 39.90,
    iconName: 'Calculator',
    badge: 'Gestão Pro',
    category: 'gestao',
    requiredPlanName: 'Plano Gestão Pro',
  },
  {
    id: 'indicators',
    name: 'Indicadores & Faturamento',
    description: 'Dashboard avançado de faturamento, ticket médio e serviços mais realizados.',
    base_price: 39.90,
    iconName: 'BarChart',
    badge: 'Gestão Pro',
    category: 'gestao',
    requiredPlanName: 'Plano Gestão Pro',
  },
  {
    id: 'contents',
    name: 'Conteúdos & Blog',
    description: 'Publicação de artigos, fotos, portfólio de antes & depois e dicas aos clientes.',
    base_price: 39.90,
    iconName: 'FileText',
    badge: 'Marketing',
    category: 'marketing',
    requiredPlanName: 'Plano Marketing & Experience',
  },
  {
    id: 'vitrine',
    name: 'Vitrine Pública de Serviços',
    description: 'Página pública exclusiva da clínica para captação direta e link da bio do Instagram.',
    base_price: 49.90,
    iconName: 'Globe',
    badge: 'Marketing',
    category: 'marketing',
    requiredPlanName: 'Plano Marketing & Experience',
  },
  {
    id: 'loyalty',
    name: 'Módulo Fidelidade 10+1',
    description: 'Cartão fidelidade automático com selos digitais a cada atendimento finalizado.',
    base_price: 39.90,
    iconName: 'Sparkles',
    badge: 'Marketing',
    category: 'marketing',
    requiredPlanName: 'Plano Marketing & Experience',
  },
  {
    id: 'reports',
    name: 'Relatórios Avançados & Desvio',
    description: 'Auditoria de desvio de consumo teórico vs real e rentabilidade por procedimento.',
    base_price: 59.90,
    iconName: 'BarChart3',
    badge: 'Marketing',
    category: 'marketing',
    requiredPlanName: 'Plano Marketing & Experience',
  },
  {
    id: 'custom_branding',
    name: 'Custom Branding (White-label)',
    description: 'Personalização de cores da marca, logomarca no portal do cliente e domínio próprio.',
    base_price: 99.90,
    iconName: 'Palette',
    badge: 'Add-on White-label',
    category: 'addon',
    requiredPlanName: 'Add-on White-label',
  },
  {
    id: 'whatsapp',
    name: 'Automações & WhatsApp',
    description: 'Lembretes 24h antes, confirmação ativa com botões e mensagens pós-venda.',
    base_price: 69.90,
    iconName: 'Zap',
    badge: 'Add-on WhatsApp',
    category: 'addon',
    requiredPlanName: 'Add-on WhatsApp',
  },
];

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'biz-sublime-01',
    name: 'Clínica Sublime Estética & Spa',
    slug: 'sublime-estetica',
    plan_type: 'enterprise',
    planType: 'enterprise',
    status: 'active',
    ownerName: 'Dra. Camila Vasconcelos',
    ownerEmail: 'camila@sublimeestetica.com.br',
    phone: '(11) 98765-4321',
    whatsapp: '5511987654321',
    email: 'contato@sublimeestetica.com.br',
    address: 'Alameda Santos, 1893 - Jardins',
    neighborhood: 'Jardins',
    city: 'São Paulo',
    state: 'SP',
    instagram: '@sublime.estetica',
    description: 'Clínica boutique referência em harmonização facial, estética corporal avançada e protocolos de bem-estar.',
    rating: 4.98,
    reviewsCount: 184,
    followersCount: 1840,
    isHighlightedAds: true,
    highlightBadge: 'Super Clínica • Destaque Aura',
    distanceKm: 0.8,
    deliveryEstimateMinutes: 'Confirmação instantânea • Vagas hoje',
    specialties: ['Facial', 'Corporal', 'Harmonização', 'Laser'],
    logo: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=200&q=80',
    cover: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    primary_color: '#B88746',
    background_color: '#FAF8F5',
    custom_domain: 'agenda.sublimeestetica.com.br',
    white_label_enabled: true,
    createdAt: '2023-08-15T10:00:00Z',
  },
  {
    id: 'biz-bella-02',
    name: 'Studio Bella Visage',
    slug: 'studio-bella',
    plan_type: 'pro',
    planType: 'pro',
    status: 'active',
    ownerName: 'Isabela Fontes',
    ownerEmail: 'isabela@bellavisage.com.br',
    phone: '(11) 97123-4567',
    whatsapp: '5511971234567',
    email: 'atendimento@bellavisage.com.br',
    address: 'Rua Oscar Freire, 920 - Cerqueira César',
    neighborhood: 'Cerqueira César / Jardins',
    city: 'São Paulo',
    state: 'SP',
    instagram: '@bellavisage.studio',
    description: 'Especialistas em visagismo de sobrancelhas, micropigmentação labial e extensão de cílios fio a fio.',
    rating: 4.92,
    reviewsCount: 96,
    followersCount: 920,
    isHighlightedAds: true,
    highlightBadge: 'Cashback 10% Aura',
    distanceKm: 1.2,
    deliveryEstimateMinutes: 'Confirmação instantânea',
    specialties: ['Sobrancelhas', 'Cílios', 'Unhas', 'Micro Labial'],
    logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80',
    cover: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    primary_color: '#D5B0AC',
    background_color: '#FAFAF9',
    custom_domain: 'agenda.bellavisage.com.br',
    white_label_enabled: false,
    createdAt: '2024-02-10T14:30:00Z',
  },
  {
    id: 'biz-aura-03',
    name: 'Aura Concept Harmonização',
    slug: 'aura-concept',
    plan_type: 'marketing',
    planType: 'marketing',
    status: 'active',
    ownerName: 'Dr. Lucas Silveira',
    ownerEmail: 'lucas@auraconcept.com.br',
    phone: '(21) 99876-5432',
    whatsapp: '5521998765432',
    email: 'contato@auraconcept.com.br',
    address: 'Av. das Américas, 3500 - Barra da Tijuca',
    neighborhood: 'Barra da Tijuca',
    city: 'Rio de Janeiro',
    state: 'RJ',
    instagram: '@auraconcept.rj',
    description: 'Protocolos exclusivos de bioestimuladores de colágeno, fios de sustentação e rejuvenescimento facial.',
    rating: 4.95,
    reviewsCount: 142,
    followersCount: 1420,
    isHighlightedAds: false,
    highlightBadge: 'Destaque Rio',
    distanceKm: 2.5,
    deliveryEstimateMinutes: 'Horários para esta semana',
    specialties: ['Facial', 'Corporal', 'Rejuvenescimento'],
    logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=200&q=80',
    cover: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    primary_color: '#C26B54',
    background_color: '#FAF8F5',
    custom_domain: 'agendamento.auraconcept.com.br',
    white_label_enabled: false,
    createdAt: '2024-04-01T09:00:00Z',
  },
  {
    id: 'biz-lelegance-04',
    name: 'L’Élégance Estética Avançada',
    slug: 'lelegance',
    plan_type: 'essencial',
    planType: 'essencial',
    status: 'active',
    ownerName: 'Beatriz Vasques',
    ownerEmail: 'beatriz@lelegance.com.br',
    phone: '(31) 98877-6655',
    whatsapp: '5531988776655',
    email: 'contato@lelegance.com.br',
    address: 'Rua da Bahia, 1200 - Lourdes',
    neighborhood: 'Lourdes',
    city: 'Belo Horizonte',
    state: 'MG',
    instagram: '@lelegance.estetica',
    description: 'Tratamentos de limpeza profunda, peeling químico e drenagem linfática método Renata França.',
    rating: 4.88,
    reviewsCount: 38,
    followersCount: 480,
    isHighlightedAds: false,
    highlightBadge: 'Novo no Aura',
    distanceKm: 3.8,
    deliveryEstimateMinutes: 'Confirmação rápida',
    specialties: ['Facial', 'Depilação', 'Massagem & Spa'],
    logo: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=200&q=80',
    cover: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    primary_color: '#D5B0AC',
    background_color: '#FAFAF9',
    white_label_enabled: false,
    createdAt: '2024-07-20T11:20:00Z',
  },
];

export const INITIAL_BUSINESS_MODULES: Record<string, string[]> = {
  // Sublime (Enterprise): todos os módulos e add-ons ativos
  'biz-sublime-01': [
    'appointments',
    'clients',
    'finance',
    'inventory',
    'pricing',
    'indicators',
    'contents',
    'vitrine',
    'loyalty',
    'reports',
    'custom_branding',
    'whatsapp',
  ],
  // Bella Visage (Gestão Pro): Essencial + Finanças, Estoque, Precificação, Indicadores
  // Bloqueados: Conteúdos, Vitrine, Fidelidade, Relatórios, Custom Branding, WhatsApp
  'biz-bella-02': [
    'appointments',
    'clients',
    'finance',
    'inventory',
    'pricing',
    'indicators',
  ],
  // Aura Concept (Marketing & Experience): Essencial + Gestão Pro + Marketing
  // Bloqueados: Custom Branding, WhatsApp
  'biz-aura-03': [
    'appointments',
    'clients',
    'finance',
    'inventory',
    'pricing',
    'indicators',
    'contents',
    'vitrine',
    'loyalty',
    'reports',
  ],
  // L'Élégance (Plano Essencial): apenas Agenda e Clientes
  // Bloqueados: Todo o resto
  'biz-lelegance-04': [
    'appointments',
    'clients',
  ],
};

const BIZ_STORAGE_KEY = 'aura_saas_businesses';
const ACTIVE_BIZ_KEY = 'aura_saas_active_business_id';
const MODULES_STORAGE_KEY = 'aura_saas_business_modules';
const AUDIT_LOGS_KEY = 'aura_saas_audit_logs_root';

export const INITIAL_AUDIT_LOGS: AuditLogRoot[] = [
  {
    id: 'audit-01',
    actor_email: 'dev@aura.com.br',
    actor_role: 'PLATFORM_ADMIN',
    action: 'PLATFORM_BOOTSTRAP',
    details: 'Inicialização do cluster SaaS Multi-tenant e ativação de RLS God Mode',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    ip_address: '177.136.241.10',
  },
  {
    id: 'audit-02',
    actor_email: 'dev@aura.com.br',
    actor_role: 'PLATFORM_ADMIN',
    action: 'MODULE_GRANT',
    target_business_id: 'biz-sublime-01',
    target_business_name: 'Clínica Sublime Estética & Spa',
    details: 'Liberação de todos os módulos para plano Enterprise',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    ip_address: '177.136.241.10',
  },
  {
    id: 'audit-03',
    actor_email: 'dev@aura.com.br',
    actor_role: 'PLATFORM_ADMIN',
    action: 'IMPERSONATE_START',
    target_business_id: 'biz-bella-02',
    target_business_name: 'Studio Bella Visage',
    details: 'Suporte técnico via Impersonate: verificação de agendamentos pendentes',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    ip_address: '177.136.241.10',
  }
];

interface BusinessContextType {
  businesses: Business[];
  currentBusiness: Business;
  businessStatus: string;
  setCurrentBusinessId: (id: string) => void;
  activeModules: string[];
  businessModulesMap: Record<string, string[]>;
  platformModules: PlatformModule[];
  commercialPlans: CommercialPlan[];
  hasAccessToModule: (moduleId: string) => boolean;
  toggleModuleForBusiness: (businessId: string, moduleId: string) => void;
  activateModuleForCurrent: (moduleId: string) => void;
  applyPlanPreset: (businessId: string, planType: PlanType) => void;
  updateBusiness: (businessId: string, updates: Partial<Business>) => void;
  createBusiness: (data: Partial<Business>) => Business;
  updateBusinessPlan: (businessId: string, planType: PlanType) => void;
  toggleBusinessStatus: (businessId: string) => void;
  // Impersonate (God Mode)
  isImpersonating: boolean;
  impersonatedBusiness: Business | null;
  impersonateAsAdmin: (businessId: string) => void;
  exitImpersonate: () => void;
  // Auditoria Root
  auditLogs: AuditLogRoot[];
  addAuditLog: (action: string, targetBusinessId?: string, details?: string, targetEmail?: string) => void;
  // Modos de Acesso
  isSuperAdminMode: boolean;
  setIsSuperAdminMode: (enabled: boolean) => void;
  publicProfileSlug: string | null;
  setPublicProfileSlug: (slug: string | null) => void;
  getBusinessBySlug: (slug: string) => Business | undefined;
  platformStats: {
    totalTenants: number;
    activeTenants: number;
    suspendedTenants: number;
    totalMRR: number;
    platformARR: number;
    churnRate: number;
  };
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    try {
      const stored = localStorage.getItem(BIZ_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BUSINESSES;
  });

  const [currentBusinessId, setCurrentBusinessIdState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_BIZ_KEY);
      if (stored && INITIAL_BUSINESSES.some((b) => b.id === stored)) return stored;
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BUSINESSES[0].id;
  });

  const [businessModulesMap, setBusinessModulesMap] = useState<Record<string, string[]>>(() => {
    try {
      const stored = localStorage.getItem(MODULES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BUSINESS_MODULES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogRoot[]>(() => {
    try {
      const stored = localStorage.getItem(AUDIT_LOGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [impersonatedBusiness, setImpersonatedBusiness] = useState<Business | null>(null);
  const [isSuperAdminMode, setIsSuperAdminMode] = useState<boolean>(false);
  const [publicProfileSlug, setPublicProfileSlug] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(BIZ_STORAGE_KEY, JSON.stringify(businesses));
    } catch (e) {
      console.error(e);
    }
  }, [businesses]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_BIZ_KEY, currentBusinessId);
    } catch (e) {
      console.error(e);
    }
  }, [currentBusinessId]);

  useEffect(() => {
    try {
      localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(businessModulesMap));
    } catch (e) {
      console.error(e);
    }
  }, [businessModulesMap]);

  const currentBusiness =
    businesses.find((b) => b.id === currentBusinessId) || businesses[0] || INITIAL_BUSINESSES[0];

  const activeModules = businessModulesMap[currentBusiness.id] || ['appointments'];

  const hasAccessToModule = (moduleId: string): boolean => {
    if (isSuperAdminMode) return true; // Super Admin has unconstrained access
    return activeModules.includes(moduleId);
  };

  const setCurrentBusinessId = (id: string) => {
    if (businesses.some((b) => b.id === id)) {
      setCurrentBusinessIdState(id);
    }
  };

  const toggleModuleForBusiness = (businessId: string, moduleId: string) => {
    setBusinessModulesMap((prev) => {
      const currentList = prev[businessId] || ['appointments'];
      const exists = currentList.includes(moduleId);
      const updated = exists ? currentList.filter((m) => m !== moduleId) : [...currentList, moduleId];
      return {
        ...prev,
        [businessId]: updated,
      };
    });
  };

  const activateModuleForCurrent = (moduleId: string) => {
    toggleModuleForBusiness(currentBusiness.id, moduleId);
  };

  const updateBusiness = (businessId: string, updates: Partial<Business>) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === businessId ? { ...b, ...updates, planType: updates.plan_type || updates.planType || b.plan_type } : b))
    );
  };

  const createBusiness = (data: Partial<Business>): Business => {
    const newBiz: Business = {
      id: `biz-${Date.now()}`,
      name: data.name || 'Nova Clínica Estética',
      slug: (data.name || 'clinica')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-'),
      plan_type: data.plan_type || 'pro',
      planType: data.plan_type || 'pro',
      status: 'active',
      ownerName: data.ownerName || 'Gestor Responsável',
      ownerEmail: data.ownerEmail || 'contato@clinica.com.br',
      phone: data.phone || '(11) 99999-0000',
      whatsapp: data.whatsapp || '5511999990000',
      city: data.city || 'São Paulo',
      state: data.state || 'SP',
      rating: 5.0,
      reviewsCount: 0,
      logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80',
      cover: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      createdAt: new Date().toISOString(),
      ...data,
    };

    setBusinesses((prev) => [...prev, newBiz]);
    setBusinessModulesMap((prev) => ({
      ...prev,
      [newBiz.id]: ['appointments', 'pricing'],
    }));

    // Sincronizar com a lista do dataService para que o marketplace encontre a nova clínica imediatamente
    try {
      const currentList = dataService.getAllBusinesses();
      if (!currentList.some((b) => b.id === newBiz.id)) {
        currentList.push(newBiz);
        localStorage.setItem('businesses_list', JSON.stringify(currentList));
      }
    } catch (err) {
      console.error('Erro ao sincronizar dataService:', err);
    }

    return newBiz;
  };

  const addAuditLog = (
    action: string,
    targetBusinessId?: string,
    details?: string,
    targetEmail?: string
  ) => {
    const targetBiz = businesses.find((b) => b.id === targetBusinessId);
    const newLog: AuditLogRoot = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actor_email: 'dev@aura.com.br',
      actor_role: 'PLATFORM_ADMIN',
      action,
      target_business_id: targetBusinessId,
      target_business_name: targetBiz?.name,
      target_user_email: targetEmail,
      details: details || `Ação ${action} executada com privilégios de ROOT`,
      created_at: new Date().toISOString(),
      ip_address: '177.136.241.10',
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated.slice(0, 100)));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const impersonateAsAdmin = (businessId: string) => {
    const target = businesses.find((b) => b.id === businessId);
    if (!target) return;
    setImpersonatedBusiness(target);
    setCurrentBusinessIdState(target.id);
    addAuditLog(
      'IMPERSONATE_START',
      target.id,
      `Acesso mestre concedido como Administrador da unidade [${target.name}] sem restrições de RLS`
    );
  };

  const exitImpersonate = () => {
    if (impersonatedBusiness) {
      addAuditLog(
        'IMPERSONATE_EXIT',
        impersonatedBusiness.id,
        `Sessão de suporte impersonate finalizada na unidade [${impersonatedBusiness.name}]. Retorno ao Root Dashboard.`
      );
    }
    setImpersonatedBusiness(null);
  };

  const updateBusinessPlan = (businessId: string, planType: PlanType) => {
    const target = businesses.find((b) => b.id === businessId);
    updateBusiness(businessId, { plan_type: planType, planType });
    addAuditLog(
      'PLAN_CHANGE',
      businessId,
      `Alteração de plano contratual de [${target?.name}] para [${planType.toUpperCase()}]`
    );
  };

  const toggleBusinessStatus = (businessId: string) => {
    const target = businesses.find((b) => b.id === businessId);
    if (!target) return;
    const nextStatus = target.status === 'active' ? 'suspended' : 'active';
    updateBusiness(businessId, { status: nextStatus });
    addAuditLog(
      nextStatus === 'active' ? 'TENANT_ACTIVATE' : 'TENANT_SUSPEND',
      businessId,
      `Status do estabelecimento [${target.name}] alterado para [${nextStatus.toUpperCase()}]`
    );
  };

  const getBusinessBySlug = (slug: string): Business | undefined => {
    return businesses.find((b) => b.slug === slug || b.id === slug);
  };

  // Calcular métricas globais para a Governança Super Admin
  const activeTenantsCount = businesses.filter((b) => b.status === 'active').length;
  const suspendedTenantsCount = businesses.filter((b) => b.status !== 'active').length;

  // Cálculo de MRR Real:
  // Base por plano: free: 0, pro: 149, premium: 249, enterprise: 399
  // + valor dos módulos adicionais contratados
  const totalMRR = businesses.reduce((sum, b) => {
    if (b.status === 'blocked') return sum;
    const basePlanPrice =
      b.plan_type === 'enterprise' ? 399.0 : b.plan_type === 'premium' ? 249.0 : b.plan_type === 'pro' ? 149.0 : 0;
    const mods = businessModulesMap[b.id] || [];
    const modulesSum = mods.reduce((mSum, modId) => {
      const mod = PLATFORM_MODULES.find((pm) => pm.id === modId);
      return mSum + (mod ? mod.base_price : 0);
    }, 0);
    return sum + basePlanPrice + modulesSum;
  }, 0);

  const applyPlanPreset = (businessId: string, planType: PlanType) => {
    const plan = COMMERCIAL_PLANS.find(
      (p) => p.slug === planType || (planType === 'free' && p.slug === 'essencial')
    );
    const targetBiz = businesses.find((b) => b.id === businessId);
    if (plan) {
      setBusinessModulesMap((prev) => ({
        ...prev,
        [businessId]: [...plan.includedModules],
      }));
      updateBusiness(businessId, { plan_type: planType, planType });
      addAuditLog(
        'PLAN_PRESET_APPLIED',
        businessId,
        `Pacote de módulos comerciais [${plan.name}] aplicado com sucesso para [${targetBiz?.name}]`
      );
    }
  };

  const platformARR = totalMRR * 12;
  const churnRate = 1.4; // 1.4% saudável

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        currentBusiness,
        businessStatus: currentBusiness?.status || 'active',
        setCurrentBusinessId,
        activeModules,
        businessModulesMap,
        platformModules: PLATFORM_MODULES,
        commercialPlans: COMMERCIAL_PLANS,
        hasAccessToModule,
        toggleModuleForBusiness,
        activateModuleForCurrent,
        applyPlanPreset,
        updateBusiness,
        createBusiness,
        updateBusinessPlan,
        toggleBusinessStatus,
        isImpersonating: !!impersonatedBusiness,
        impersonatedBusiness,
        impersonateAsAdmin,
        exitImpersonate,
        auditLogs,
        addAuditLog,
        isSuperAdminMode,
        setIsSuperAdminMode,
        publicProfileSlug,
        setPublicProfileSlug,
        getBusinessBySlug,
        platformStats: {
          totalTenants: businesses.length,
          activeTenants: activeTenantsCount,
          suspendedTenants: suspendedTenantsCount,
          totalMRR,
          platformARR,
          churnRate,
        },
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

export const useSubscription = () => {
  const {
    hasAccessToModule,
    activeModules,
    currentBusiness,
    isSuperAdminMode,
    toggleModuleForBusiness,
    isImpersonating,
    commercialPlans,
  } = useBusiness();

  return {
    hasModule: (moduleId: string) => hasAccessToModule(moduleId),
    activeModules,
    currentPlan: currentBusiness.plan_type,
    currentBusiness,
    isSuperAdmin: isSuperAdminMode,
    isImpersonating,
    commercialPlans,
    toggleModule: (moduleId: string) => toggleModuleForBusiness(currentBusiness.id, moduleId),
  };
};
