export type UserRole = 
  | 'PLATFORM_ADMIN'
  | 'SUPER_ADMIN'
  | 'OWNER'
  | 'ADMIN' 
  | 'MANAGER' 
  | 'PROFESSIONAL' 
  | 'RECEPTIONIST' 
  | 'CLIENT';

export const USER_ROLES: UserRole[] = [
  'PLATFORM_ADMIN',
  'SUPER_ADMIN',
  'OWNER',
  'ADMIN',
  'MANAGER',
  'PROFESSIONAL',
  'RECEPTIONIST',
  'CLIENT'
];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  PLATFORM_ADMIN: 'God Mode / Root da Plataforma (SaaS Root Access)',
  SUPER_ADMIN: 'Super Administrador (Dono da Plataforma)',
  OWNER: 'Proprietário(a) / Dono(a) da Clínica',
  ADMIN: 'Administrador(a) / Diretoria',
  MANAGER: 'Gerente da Clínica',
  PROFESSIONAL: 'Profissional / Esteta',
  RECEPTIONIST: 'Recepcionista',
  CLIENT: 'Cliente'
};

// ==============================================================================
// SAAS GLOBAL IDENTITY & LOCAL AFFILIATION TYPES
// Separação entre Identidade Global (profiles) e Afiliação Local (business_members / business_customers)
// ==============================================================================

export interface GlobalProfile {
  id: string;
  full_name: string;
  name?: string;
  email: string;
  cpf?: string;
  whatsapp?: string;
  phone?: string;
  avatar_url?: string;
  avatarUrl?: string;
  global_role: UserRole;
  registration_completed: boolean;
  registrationCompleted?: boolean;
  created_at?: string;
  createdAt?: string;
}

export interface BusinessMember {
  id: string;
  business_id: string;
  businessId?: string;
  profile_id: string;
  profileId?: string;
  role: UserRole;
  unit_id?: string;
  unitId?: string;
  status: 'active' | 'inactive';
  created_at?: string;
  createdAt?: string;
  profile?: GlobalProfile;
}

export interface BusinessCustomer {
  id: string;
  business_id: string;
  businessId?: string;
  profile_id: string;
  profileId?: string;
  loyalty_stamps: number;
  medical_notes?: string;
  created_at?: string;
  createdAt?: string;
  profile?: GlobalProfile;
}

// ==============================================================================
// SaaS MULTI-TENANT ENTERPRISE TYPES
// ==============================================================================

export type PlanType = 'free' | 'essencial' | 'pro' | 'marketing' | 'premium' | 'enterprise';
export type BusinessStatus = 'active' | 'suspended' | 'blocked';

export interface Business {
  id: string;
  name: string;
  slug: string; // Ex: auraestetica.com/perfil/studio-bella
  owner_id?: string;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  plan_type: PlanType;
  planType?: PlanType;
  status: BusinessStatus;
  logo?: string;
  logo_url?: string;
  cover?: string;
  cover_url?: string;
  services?: any[];
  portfolio?: any[];
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  instagram?: string;
  description?: string;
  rating?: number;
  reviewsCount?: number;
  created_at?: string;
  createdAt?: string;
  // White-label & Custom Branding Add-on
  primary_color?: string;
  background_color?: string;
  custom_domain?: string;
  white_label_enabled?: boolean;
  // Aura Marketplace (iFood da Beleza) Fields
  followersCount?: number;
  isHighlightedAds?: boolean;
  highlightBadge?: string;
  distanceKm?: number;
  deliveryEstimateMinutes?: string;
  specialties?: string[];
  neighborhood?: string;
}

// Social Layer: Seguidores da Loja
export interface ShopFollower {
  id: string;
  profile_id: string;
  business_id: string;
  notifications_enabled?: boolean;
  created_at: string;
}

// Métricas de Busca & Demanda do Marketplace
export interface MarketplaceSearchMetric {
  term: string;
  category: string;
  searchCount: number;
  growthPercent: number;
}

export type PlatformModuleId =
  | 'appointments'
  | 'clients'
  | 'finance'
  | 'inventory'
  | 'pricing'
  | 'indicators'
  | 'contents'
  | 'vitrine'
  | 'loyalty'
  | 'reports'
  | 'custom_branding'
  | 'whatsapp';

export interface PlatformModule {
  id: PlatformModuleId | string;
  name: string;
  description: string;
  base_price: number;
  basePrice?: number;
  iconName?: string;
  badge?: string;
  category?: 'core' | 'gestao' | 'marketing' | 'addon';
  requiredPlanName?: string;
}

export interface CommercialPlan {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  monthlyPrice: number;
  badge?: string;
  isPopular?: boolean;
  includedModules: string[];
  highlightFeatures: string[];
}

export interface BusinessModule {
  business_id: string;
  businessId?: string;
  module_id: string;
  moduleId?: string;
  status: boolean;
  expires_at?: string;
  expiresAt?: string;
}

export type AppointmentStatus = 
  | 'agendado' 
  | 'confirmado' 
  | 'aguardando' 
  | 'em_atendimento' 
  | 'finalizado' 
  | 'cancelado' 
  | 'nao_compareceu' 
  | 'reagendado';

export type PaymentMethod = 
  | 'pix' 
  | 'cartao_credito' 
  | 'cartao_debito' 
  | 'dinheiro' 
  | 'link_pagamento' 
  | 'transferencia';

export type ReturnStatus = 
  | 'retorno_proximo' 
  | 'retorno_hoje' 
  | 'retorno_atrasado' 
  | 'inativo' 
  | 'em_dia';

export interface Unit {
  id: string;
  organizationId?: string;
  organization_id?: string;
  businessId?: string;
  business_id?: string;
  name: string;
  address: string;
  phone?: string;
  status: 'active' | 'inactive';
  activeProfessionalsCount?: number;
  todayAppointmentsCount?: number;
  createdAt?: string;
  created_at?: string;
  // Geo-Localização e Coordenadas Geo-espaciais (Para o Mapa & Proximidade)
  latitude?: number;
  longitude?: number;
  neighborhood?: string;
  city?: string;
  rating?: number;
  reviewsCount?: number;
  distanceKm?: number;
  openingHours?: string;
  imageUrl?: string;
  businessSlug?: string;
  businessName?: string;
}

export interface Organization {
  id: string;
  name: string;
  document: string; // CNPJ
  slug: string;
  phone: string;
  email: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  settings: {
    defaultReturnDays: number;
    businessHoursStart: string; // "08:00"
    businessHoursEnd: string; // "20:00"
    slotIntervalMinutes: number; // 30
    currency: string;
  };
  logoUrl?: string;
}

export interface Profile {
  id: string;
  organizationId: string;
  organization_id?: string;
  businessId?: string;
  business_id?: string;
  unitId?: string;
  unit_id?: string;
  name: string;
  full_name?: string;
  email: string;
  phone?: string;
  cpf?: string;
  documentCpf?: string;
  role: UserRole;
  roleTitle?: string;
  role_title?: string;
  specialty?: string; // Ex: 'Design de Sobrancelhas', 'Estética Avançada'
  status?: 'active' | 'inactive' | 'pending_invite';
  is_root?: boolean;
  avatarUrl?: string;
  avatar_url?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  full_name?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  cpf?: string;
  documentCpf?: string;
  birthDate?: string;
  birth_date?: string;
  registrationCompleted?: boolean;
  registration_completed?: boolean;
  lgpdConsent?: boolean;
  lgpd_consent?: boolean;
  medicalNotes?: string;
  medical_notes?: string;
  avatarUrl?: string;
  avatar_url?: string;
  role?: UserRole;
  clientId?: string;
  businessId?: string | null;
  business_id?: string | null;
  organizationId?: string | null;
  organization_id?: string | null;
  unitId?: string | null;
  unit_id?: string | null;
  is_root?: boolean;
  raw_user_meta_data?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    picture?: string;
    email?: string;
    [key: string]: any;
  };
}

export interface AuditLogRoot {
  id: string;
  actor_email: string;
  actor_role: string;
  action: string;
  target_business_id?: string;
  target_business_name?: string;
  target_user_id?: string;
  target_user_email?: string;
  details: string;
  created_at: string;
  ip_address?: string;
}

export interface Client {
  id: string;
  organizationId: string;
  name: string;
  photoUrl?: string;
  phone: string;
  whatsapp: string;
  email: string;
  // Dados complementares / SQL schema columns
  cpf?: string;
  documentCpf?: string;
  birthDate?: string;
  birth_date?: string;
  address?: string;
  totalSpent: number;
  appointmentsCount: number;
  averageTicket: number;
  satisfactionScore: number; // 1-5
  lastAppointmentDate?: string;
  nextAppointmentDate?: string;
  recommendedReturnDate?: string;
  returnStatus: ReturnStatus;
  segment: 'novo' | 'recorrente' | 'vip' | 'em_risco' | 'inativo';
  notes?: string;
  medicalNotes?: string;
  medical_notes?: string; // Importante para estética
  lgpdConsent: boolean;
  lgpd_consent?: boolean;
  registrationCompleted?: boolean;
  registration_completed?: boolean;
  createdAt: string;
  // Pré-Cadastro
  preRegistrationCompleted?: boolean;
  preRegisteredAt?: string;
  allergies?: string;
  healthConditions?: string;
  skinTypeOrConcerns?: string;
  emergencyContact?: string;
}

export interface LoyaltyCard {
  id: string;
  clientId: string;
  client_id?: string;
  organizationId: string;
  organization_id?: string;
  stampsCount: number; // De 0 a 10
  stamps_count?: number;
  rewardAvailable: boolean;
  reward_available?: boolean;
  lastStampAt?: string;
  last_stamp_at?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface Professional {
  id: string;
  organizationId: string;
  unitId?: string;
  unit_id?: string;
  name: string;
  photoUrl?: string;
  phone: string;
  email: string;
  specialty: string;
  commissionPercentage: number;
  status: 'ativo' | 'inativo' | 'ferias';
  monthlyCost?: number;
  colorHex?: string;
  schedule: {
    daysOfWeek: number[]; // 1=Segunda, 6=Sábado
    workStart: string;
    workEnd: string;
    breakStart?: string;
    breakEnd?: string;
  };
  averageRating: number;
  completedAppointmentsCount: number;
}

export interface ServiceCategory {
  id: string;
  organizationId: string;
  name: string;
  color: string;
  iconName: string;
}

export interface Service {
  id: string;
  organizationId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  isPopular?: boolean;
  categoryName?: string;
  commissionRate: number; // percent
  recommendedReturnDays: number;
  enabledProfessionalIds: string[];
  status: 'ativo' | 'inativo';
  imageUrl?: string;
  // Financial calculation fields
  directCost: number; // Produtos + insumos
  laborCost: number; // Mão de obra
  fixedCostAllocation: number; // Rateio custos fixos
  taxAndCardRate: number; // % imposto + taxas de cartão
  totalCost: number;
  total_cost?: number; // Alias para precificação
  suggestedPrice: number;
  profitMargin: number; // % de lucro
  margin_percent?: number; // Alias para precificação
  sale_price?: number; // Preço de venda
  averageRating: number;
  timesPerformed: number;
}

export interface Appointment {
  id: string;
  organizationId: string;
  unitId?: string;
  unit_id?: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  originalPrice: number;
  discount: number;
  finalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pago' | 'pendente' | 'estornado';
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  // Marketplace Canal Integration
  origin?: 'marketplace' | 'direct';
  source?: 'marketplace' | 'direct' | string;
  marketplaceCommission?: number;
  marketplaceFee?: number;
  businessId?: string;
  business_id?: string;
  price?: number;
}

export interface FinancialTransaction {
  id: string;
  organizationId: string;
  unitId?: string;
  unit_id?: string;
  type: 'entrada' | 'saida';
  category: string;
  description: string;
  amount: number;
  date: string;
  status: 'concluido' | 'previsto' | 'cancelado';
  paymentMethod: PaymentMethod;
  clientId?: string;
  clientName?: string;
  professionalId?: string;
  serviceId?: string;
  appointmentId?: string;
  receiptUrl?: string;
}

export interface DREPeriodData {
  periodLabel: string;
  unitId?: string;
  faturamentoBruto: number;
  impostosETaxas: number;
  taxPercent: number;
  receitaLiquida: number;
  custoInsumos: number;
  custoComissoes: number;
  margemContribuicao: number;
  margemContribuicaoPercent: number;
  custosFixos: number;
  custosFixosDetails: Array<{ category: string; description: string; amount: number; unitId?: string }>;
  lucroLiquidoReal: number;
  margemLiquidaPercent: number;
  isLucroPositivo: boolean;
  totalCustos: number;
  atendimentosCount: number;
  desperdicioAuditado: number;
  temAlertaDesperdicio: boolean;
  alertaMensagem?: string;
  detalhesInsumosPorServico: Array<{ serviceName: string; count: number; unitCost: number; totalCost: number }>;
  detalhesComissoesPorProfissional: Array<{ professionalName: string; count: number; totalRevenue: number; totalCommission: number }>;
}

export interface ServiceCostBreakdown {
  serviceId: string;
  serviceName: string;
  currentPrice: number;
  productsCost: number;
  disposablesCost: number;
  directCost: number;
  laborHourlyRate: number;
  laborCost: number;
  commissionValue: number;
  cardFeeValue: number;
  taxValue: number;
  fixedCostAllocation: number;
  totalCost: number;
  grossProfit: number;
  profitMarginPercent: number;
  desiredMarginPercent: number;
  suggestedPrice: number;
}

export interface Review {
  id: string;
  organizationId: string;
  clientId: string;
  clientName: string;
  appointmentId: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  overallRating: number; // 1-5
  serviceRating: number;
  professionalRating: number;
  punctualityRating: number;
  environmentRating: number;
  npsScore: number; // 0-10
  comment?: string;
  publicPermission: boolean;
  createdAt: string;
  status: 'aprovado' | 'pendente' | 'alerta_negativo';
}

export interface NotificationItem {
  id: string;
  organizationId?: string;
  title: string;
  message: string;
  type: 'agendamento' | 'retorno' | 'avaliacao_negativa' | 'financeiro' | 'sistema';
  read: boolean;
  createdAt: string;
  timestamp?: string;
  linkAction?: string;
  actionUrl?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: 'confirmacao_agendamento' | 'lembrete_24h' | 'pos_atendimento' | 'solicitacao_avaliacao' | 'aviso_retorno' | 'cliente_inativo' | 'aniversario';
  channel: 'whatsapp' | 'sms' | 'email';
  timing: string; // "24h antes", "1h após", "15 dias após"
  messageTemplate: string;
  isActive: boolean;
  executionsCount: number;
}

export type ContentPostCategory = 'Dicas' | 'Portfolio' | 'Novidades' | 'Informativos';
export type ContentPostStatus = 'draft' | 'published';

export interface ContentPost {
  id: string;
  organizationId: string;
  organization_id?: string;
  title: string;
  description?: string;
  contentBody?: string;
  content_body?: string;
  imageUrl?: string;
  image_url?: string;
  category: ContentPostCategory | string;
  status: ContentPostStatus;
  createdAt: string;
  created_at?: string;
  authorId?: string;
  author_id?: string;
  authorName?: string;
  // Marketplace Social Feed integration
  businessId?: string;
  business_id?: string;
  businessName?: string;
  business_name?: string;
  businessSlug?: string;
  business_slug?: string;
  businessLogo?: string;
  business_logo?: string;
  publishToMarketplace?: boolean;
  publish_to_marketplace?: boolean;
  linkedServiceId?: string;
  linked_service_id?: string;
  linkedServiceName?: string;
  promoDiscountPercent?: number;
  promo_discount_percent?: number;
  // Growth & ROI metrics for Aura Business
  viewsCount?: number;
  clicksCount?: number;
  unitId?: string;
  unit_id?: string;
  unitName?: string;
  marketplaceTag?: 'Dica' | 'Antes e Depois' | 'Promoção' | 'Portfólio' | string;
  roiEstimated?: number;
  followersGained?: number;
}

export type InventoryItemStatus = 'ok' | 'reposicao_necessaria' | 'critico';

export interface InventoryItem {
  id: string;
  organizationId: string;
  organization_id?: string;
  unitId?: string;
  unit_id?: string;
  name: string;
  category: string;
  currentStock: number;
  current_quantity?: number;
  minStock: number;
  min_quantity?: number;
  unit: string;
  unit_measure?: string; // 'ml', 'g', 'un'
  unitCost: number;
  cost_price?: number; // Preço de compra
  lastRestockedAt?: string;
  last_restocked_at?: string;
  supplier?: string;
}

// Vínculo Serviço x Material (Ficha Técnica)
export interface ServiceMaterial {
  id: string;
  serviceId?: string;
  service_id?: string;
  itemId?: string;
  item_id?: string;
  inventoryItemId?: string; // alias to item_id
  name: string;
  quantity: number; // mapped to quantity_used
  quantityUsed?: number;
  quantity_used?: number;
  unitPrice: number; // cost_price
  unitPriceCalculated?: number;
  unit?: string; // unit_measure
  unit_measure?: string;
}

// src/types/inventory.ts
export interface InventoryLog {
  id: string;
  item_id?: string;
  itemId?: string;
  item_name?: string;
  type: 'IN' | 'OUT'; // Entrada ou Saída
  quantity: number;
  unit?: string; // 'unidades', 'ml', 'g', 'kit'
  reason: string; // 'Compra', 'Uso em Serviço', 'Ajuste', 'Vencimento'
  supplier?: string; // Fornecedor no caso de compra/entrada
  client_name?: string; // Cliente no caso de consumo de procedimento
  clientName?: string;
  service_name?: string; // Serviço no caso de consumo
  unit_price_at_moment: number;
  created_at: string;
}
