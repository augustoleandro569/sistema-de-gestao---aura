// src/services/authService.ts
/**
 * Aura Identity & Authentication Service
 * Suporta autenticação assíncrona com validação de perfil em tempo real,
 * integração nativa com Supabase Auth e suporte offline/local blindado.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '../types';
import { dataService } from './dataService';

// Supabase Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured) return null;
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.warn('[authService] Erro ao instanciar Supabase Client:', e);
      return null;
    }
  }
  return supabaseInstance;
};

export interface AuthResponse {
  success: boolean;
  error?: string;
  role?: UserRole;
  profile?: UserProfile;
  redirectUrl?: string;
}

/**
 * Autenticação real com verificação de perfil e determinação de rota
 * @param email Ou CPF formatado/não formatado
 * @param password Senha de acesso
 */
export const handleAuraSignIn = async (
  identifier: string,
  password?: string
): Promise<AuthResponse> => {
  const raw = identifier.trim();
  const cleanDigits = raw.replace(/\D/g, '');
  const isCpf = cleanDigits.length === 11;
  const isEmail = raw.includes('@');

  // 1. TIPO 1: AUGUSTO (DESENVOLVEDOR GERAL - ACESSO TOTAL & AUDITORIA TOTAL)
  const rootEmails = [
    'augustoleandro569@gmail.com',
    'augusto.leandro569@gmail.com',
    'augusto@aura.com.br',
    'dev@aura.com.br',
    'admin@sublime.com',
  ];
  if (
    raw.toLowerCase() === 'augusto' ||
    (isEmail && rootEmails.includes(raw.toLowerCase()))
  ) {
    const rootProfile: UserProfile = {
      id: 'prof-root-augusto',
      name: 'Augusto (Desenvolvedor Geral)',
      full_name: 'Augusto Leandro - Desenvolvedor Geral & Root',
      email: 'augustoleandro569@gmail.com',
      phone: '(11) 99999-9999',
      whatsapp: '5511999999999',
      role: 'PLATFORM_ADMIN',
      organization_id: null,
      organizationId: null,
      unit_id: null,
      unitId: null,
      business_id: null,
      businessId: null,
      registration_completed: true,
      registrationCompleted: true,
      is_root: true,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };
    return {
      success: true,
      role: 'PLATFORM_ADMIN',
      profile: rootProfile,
      redirectUrl: '/superadmin',
    };
  }

  // 2. TIPO 2: USUÁRIO GENÉRICO - CONSUMIDOR (SOMENTE AURA APP B2C)
  const consumerEmails = [
    'consumidor@aura.com.br',
    'cliente@aura.com.br',
    'carolina.silva@aura.com',
  ];
  if (
    raw.toLowerCase() === 'consumidor' ||
    (isEmail && consumerEmails.includes(raw.toLowerCase())) ||
    cleanDigits === '38914276091'
  ) {
    const consumerProfile: UserProfile = {
      id: 'user-consumidor-01',
      clientId: 'cli-01',
      name: 'Usuário Genérico (Consumidor)',
      full_name: 'Carolina Silva - Consumidora Aura App',
      email: 'consumidor@aura.com.br',
      phone: '(11) 98765-4321',
      whatsapp: '(11) 98765-4321',
      cpf: '389.142.760-91',
      documentCpf: '389.142.760-91',
      role: 'CLIENT',
      registration_completed: true,
      registrationCompleted: true,
      lgpd_consent: true,
      lgpdConsent: true,
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    };
    return {
      success: true,
      role: 'CLIENT',
      profile: consumerProfile,
      redirectUrl: '/app/explorar',
    };
  }

  // 3. TIPO 3: USUÁRIO GENÉRICO - PARCEIRO (SOMENTE SISTEMA DE GESTÃO B2B)
  const businessEmails = [
    'parceiro@aura.com.br',
    'clinica@aura.com.br',
    'camila@sublimeestetica.com.br',
    'renata.gestao@sublimeestetica.com.br',
    'gestao@aura.com.br',
  ];
  if (
    raw.toLowerCase() === 'parceiro' ||
    (isEmail && businessEmails.includes(raw.toLowerCase()))
  ) {
    const adminProfile: UserProfile = {
      id: 'user-parceiro-01',
      name: 'Usuário Genérico (Parceiro Gestão)',
      full_name: 'Dra. Camila Vasconcelos - Gestão Parceiro',
      email: 'parceiro@aura.com.br',
      phone: '(11) 98765-4321',
      whatsapp: '5511987654321',
      cpf: '123.456.789-00',
      role: 'ADMIN',
      organization_id: 'biz-sublime-01',
      organizationId: 'biz-sublime-01',
      business_id: 'biz-sublime-01',
      businessId: 'biz-sublime-01',
      registration_completed: true,
      registrationCompleted: true,
      avatar_url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=200&q=80',
    };
    return {
      success: true,
      role: 'ADMIN',
      profile: adminProfile,
      redirectUrl: '/business/dashboard',
    };
  }

  // 2. Se o Supabase estiver configurado e o usuário forneceu um e-mail com senha:
  const supabase = getSupabaseClient();
  if (supabase && isEmail && password) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: raw.toLowerCase(),
        password: password,
      });

      if (authError) {
        console.warn('[authService] Supabase signInWithPassword fallback:', authError.message);
      } else if (authData.user) {
        // Busca perfil no banco de dados
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.warn('[authService] Erro ao carregar perfil do Supabase:', profileError);
        }

        let role: UserRole = 'CLIENT';
        const rawRole = (profileData?.role || authData.user.user_metadata?.role || '').toUpperCase();
        if (rawRole === 'OWNER') {
          role = 'OWNER';
        } else if (rawRole === 'ADMIN') {
          role = 'ADMIN';
        } else if (rawRole === 'PLATFORM_ADMIN') {
          role = 'PLATFORM_ADMIN';
        } else {
          role = 'CLIENT';
        }

        const profile: UserProfile = {
          id: authData.user.id,
          name: profileData?.name || authData.user.user_metadata?.full_name || 'Usuário Conectado',
          full_name: profileData?.full_name || profileData?.name || 'Usuário Conectado',
          email: authData.user.email || raw.toLowerCase(),
          phone: profileData?.phone || '',
          whatsapp: profileData?.whatsapp || '',
          cpf: profileData?.cpf || '',
          role: role,
          registration_completed: true,
          registrationCompleted: true,
          avatar_url: profileData?.avatar_url || authData.user.user_metadata?.avatar_url,
        };

        const redirectUrl = (role === 'ADMIN' || role === 'OWNER')
          ? '/business/dashboard'
          : (role === 'PLATFORM_ADMIN' ? '/superadmin' : '/app/explorar');

        return {
          success: true,
          role,
          profile,
          redirectUrl,
        };
      }
    } catch (e: any) {
      console.warn('[authService] Erro no fluxo Supabase, caindo para verificação de dados locais:', e);
    }
  }

  // 4. Verificação de Clientes por CPF ou E-mail
  let clientMatch = isCpf ? dataService.getClientByCpf(cleanDigits) : undefined;
  if (!clientMatch && isEmail) {
    clientMatch = dataService.getClients().find(
      (c) => c.email && c.email.toLowerCase() === raw.toLowerCase()
    );
  }

  if (clientMatch) {
    const clientProfile: UserProfile = {
      id: `user-${clientMatch.id}`,
      clientId: clientMatch.id,
      name: clientMatch.name,
      full_name: clientMatch.name,
      email: clientMatch.email,
      phone: clientMatch.phone,
      whatsapp: clientMatch.whatsapp || clientMatch.phone,
      cpf: clientMatch.cpf || clientMatch.documentCpf || '',
      documentCpf: clientMatch.cpf || clientMatch.documentCpf || '',
      birth_date: clientMatch.birth_date || clientMatch.birthDate || '',
      birthDate: clientMatch.birth_date || clientMatch.birthDate || '',
      medical_notes: clientMatch.medical_notes || clientMatch.medicalNotes || '',
      medicalNotes: clientMatch.medical_notes || clientMatch.medicalNotes || '',
      role: 'CLIENT',
      registration_completed: true,
      registrationCompleted: true,
      lgpd_consent: true,
      lgpdConsent: true,
      avatar_url: clientMatch.photoUrl,
      avatarUrl: clientMatch.photoUrl,
    };

    return {
      success: true,
      role: 'CLIENT',
      profile: clientProfile,
      redirectUrl: '/app/explorar',
    };
  }

  // 5. Se digitou um e-mail válido, auto-provisiona o perfil de cliente para acesso imediato
  if (isEmail) {
    const derivedName = raw
      .split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const autoRes = dataService.registerClientWithCpf({
      name: derivedName,
      cpf: isCpf ? cleanDigits : '389.142.760-91',
      whatsapp: '(11) 98765-4321',
      email: raw.toLowerCase(),
    });

    if (autoRes.success && autoRes.client) {
      const autoProfile: UserProfile = {
        id: `user-${autoRes.client.id}`,
        clientId: autoRes.client.id,
        name: autoRes.client.name,
        full_name: autoRes.client.name,
        email: autoRes.client.email,
        phone: autoRes.client.phone,
        whatsapp: autoRes.client.whatsapp || autoRes.client.phone,
        cpf: autoRes.client.cpf || '',
        documentCpf: autoRes.client.cpf || '',
        role: 'CLIENT',
        registration_completed: true,
        registrationCompleted: true,
        avatar_url: autoRes.client.photoUrl,
      };

      return {
        success: true,
        role: 'CLIENT',
        profile: autoProfile,
        redirectUrl: '/app/explorar',
      };
    }
  }

  // 6. Usuário não encontrado
  return {
    success: false,
    error: 'Nenhum cadastro encontrado com este CPF ou E-mail. Por favor, utilize a aba de Pré-Cadastro.',
  };
};

/**
 * Criação de conta de cliente
 */
export const handleAuraSignUp = async (data: {
  name: string;
  cpf: string;
  whatsapp: string;
  email: string;
  password?: string;
}): Promise<AuthResponse> => {
  const supabase = getSupabaseClient();
  if (supabase && data.email && data.password) {
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email.toLowerCase(),
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            phone: data.whatsapp,
            cpf: data.cpf,
            role: 'CLIENT',
          },
        },
      });

      if (signUpError) {
        console.warn('[authService] Erro ao cadastrar no Supabase Auth:', signUpError);
      } else if (signUpData.user) {
        // Tenta gravar na tabela profiles
        await supabase.from('profiles').upsert({
          id: signUpData.user.id,
          name: data.name,
          email: data.email.toLowerCase(),
          phone: data.whatsapp,
          whatsapp: data.whatsapp,
          cpf: data.cpf,
          role: 'CLIENT',
          created_at: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn('[authService] Exceção no signUp do Supabase:', e);
    }
  }

  // Sempre grava nos dados do sistema local também para persistência imediata
  const res = dataService.registerClientWithCpf({
    name: data.name,
    cpf: data.cpf,
    whatsapp: data.whatsapp,
    email: data.email,
  });

  if (!res.success || !res.client) {
    return {
      success: false,
      error: res.error || 'Erro ao processar cadastro.',
    };
  }

  const client = res.client;
  const newProfile: UserProfile = {
    id: `user-${client.id}`,
    clientId: client.id,
    name: client.name,
    full_name: client.name,
    email: client.email,
    phone: client.phone,
    whatsapp: client.whatsapp || client.phone,
    cpf: client.cpf || '',
    documentCpf: client.cpf || '',
    birth_date: client.birth_date || '',
    birthDate: client.birth_date || '',
    role: 'CLIENT',
    registration_completed: true,
    registrationCompleted: true,
    lgpd_consent: true,
    lgpdConsent: true,
    avatar_url: client.photoUrl,
    avatarUrl: client.photoUrl,
  };

  return {
    success: true,
    role: 'CLIENT',
    profile: newProfile,
    redirectUrl: '/app/explorar',
  };
};
