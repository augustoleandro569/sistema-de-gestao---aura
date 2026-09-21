// src/utils/permissions.ts
import {
  BookOpen,
  Calendar,
  Sparkles,
  LayoutDashboard,
  Box,
  Calculator,
  DollarSign,
  ShieldCheck,
  User,
  Users,
  UserCheck,
  Star,
  FileText,
  Zap,
  BarChart3,
  Bell,
  Settings,
  Package
} from 'lucide-react';
import { UserRole } from '../types';

export interface SidebarItemDef {
  id: string;
  label: string;
  path: string;
  icon: any;
  badge?: string;
  badgeRating?: string;
}

/**
 * Gatekeeper de Navegação Centralizado
 * Lógica de "Visibilidade Zero": Define com rigor os itens acessíveis por cargo,
 * garantindo que a aba Gestão de Usuários seja restrita exclusivamente ao ADMIN.
 */
export const GET_SIDEBAR_ITEMS = (role: UserRole | string): SidebarItemDef[] => {
  const commonItems: SidebarItemDef[] = [
    { id: 'conteudos', label: 'Conteúdos', path: '/conteudos', icon: BookOpen },
    { id: 'perfil', label: 'Meu Perfil', path: '/perfil', icon: User },
  ];

  if (role === 'CLIENT') {
    return [
      { id: 'hub', label: 'Portal Aura', path: '/hub', icon: Sparkles },
      { id: 'agendamento', label: 'Agendar Serviço', path: '/agendamento', icon: Calendar },
      ...commonItems,
    ];
  }

  if (role === 'ADMIN') {
    return [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { id: 'agenda', label: 'Agenda Global', path: '/agenda', icon: Calendar },
      { id: 'clientes', label: 'Clientes & CRM', path: '/clientes', icon: Users },
      { id: 'servicos', label: 'Serviços & Procedimentos', path: '/servicos', icon: Sparkles },
      { id: 'profissionais', label: 'Equipe de Profissionais', path: '/profissionais', icon: UserCheck },
      { id: 'estoque', label: 'Estoque', path: '/estoque', icon: Box },
      { id: 'precificacao', label: 'Precificação Pro', path: '/precificacao', icon: Calculator, badge: 'Pro' },
      { id: 'financeiro', label: 'Financeiro DRE', path: '/financeiro', icon: DollarSign },
      { id: 'avaliacoes', label: 'Avaliações & NPS', path: '/avaliacoes', icon: Star },
      { id: 'conteudos', label: 'Conteúdos', path: '/conteudos', icon: BookOpen },
      { id: 'automacoes', label: 'Central de Automações', path: '/automacoes', icon: Zap },
      { id: 'relatorios', label: 'Relatórios Executivos', path: '/relatorios', icon: BarChart3 },
      { id: 'acessos', label: 'Gestão de Usuários', path: '/usuarios', icon: ShieldCheck, badge: 'Admin' }, // ITEM EXCLUSIVO ADMIN
      { id: 'notificacoes', label: 'Notificações', path: '/notificacoes', icon: Bell },
      { id: 'configuracoes', label: 'Configurações', path: '/configuracoes', icon: Settings },
    ];
  }

  if (role === 'MANAGER') {
    return [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { id: 'agenda', label: 'Agenda Global', path: '/agenda', icon: Calendar },
      { id: 'clientes', label: 'Clientes', path: '/clientes', icon: Users },
      { id: 'servicos', label: 'Serviços', path: '/servicos', icon: Sparkles },
      { id: 'estoque', label: 'Estoque', path: '/estoque', icon: Box },
      { id: 'financeiro', label: 'Financeiro', path: '/financeiro', icon: DollarSign },
      { id: 'avaliacoes', label: 'Avaliações', path: '/avaliacoes', icon: Star },
      ...commonItems,
    ];
  }

  if (role === 'RECEPTIONIST') {
    return [
      { id: 'dashboard', label: 'Início', path: '/dashboard', icon: LayoutDashboard },
      { id: 'agenda', label: 'Agenda Global', path: '/agenda', icon: Calendar },
      { id: 'clientes', label: 'Clientes & CRM', path: '/clientes', icon: Users },
      { id: 'servicos', label: 'Serviços', path: '/servicos', icon: Sparkles },
      { id: 'estoque', label: 'Estoque', path: '/estoque', icon: Box },
      { id: 'notificacoes', label: 'Notificações', path: '/notificacoes', icon: Bell },
      ...commonItems,
    ];
  }

  if (role === 'PROFESSIONAL') {
    return [
      { id: 'dashboard', label: 'Meu Painel', path: '/dashboard', icon: LayoutDashboard },
      { id: 'agenda', label: 'Minha Agenda', path: '/agenda', icon: Calendar },
      { id: 'clientes', label: 'Meus Clientes', path: '/clientes', icon: Users },
      { id: 'avaliacoes', label: 'Minhas Avaliações', path: '/avaliacoes', icon: Star },
      ...commonItems,
    ];
  }

  return commonItems;
};
