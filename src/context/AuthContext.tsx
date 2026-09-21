import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';
import { dataService } from '../services/dataService';
import { handleAuraSignIn, handleAuraSignUp, AuthResponse } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  userProfile: UserProfile | null;
  loading: boolean;
  portalRoute: string;
  setPortalRoute: (route: string) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  toggleRegistrationStatus: () => void;
  completeRegistration: (data: {
    name: string;
    cpf: string;
    birth_date: string;
    whatsapp: string;
    email?: string;
    medical_notes?: string;
    lgpd_consent: boolean;
  }) => void;
  selectClientAsUser: (clientId: string) => void;
  resetUserToPending: () => void;
  login: (role?: UserRole, profile?: Partial<UserProfile>) => void;
  signInWithCredentials: (identifier: string, password?: string) => Promise<AuthResponse>;
  loginWithCpfOrEmail: (identifier: string, password?: string) => {
    success: boolean;
    error?: string;
    role?: UserRole;
    profile?: UserProfile;
  };
  registerWithCpf: (data: {
    name: string;
    cpf: string;
    whatsapp: string;
    email: string;
    password?: string;
  }) => {
    success: boolean;
    error?: string;
    profile?: UserProfile;
  };
  signUpWithCredentials: (data: {
    name: string;
    cpf: string;
    whatsapp: string;
    email: string;
    password?: string;
  }) => Promise<AuthResponse>;
  loginWithGoogle?: (googleData?: any) => { isProfileIncomplete: boolean; profile: UserProfile };
  logout: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'sublime_client_user_profile';
const AUTH_STATE_KEY = 'sublime_is_authenticated';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STATE_KEY);
      return stored !== null ? stored === 'true' : false;
    } catch {
      return false;
    }
  });
  const [portalRoute, setPortalRoute] = useState<string>('/portal/agendamento');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Initialize user profile
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(AUTH_STATE_KEY) === 'true';
      const stored = localStorage.getItem(STORAGE_KEY);
      if (storedAuth && stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        setUserProfile(parsed);
        setIsAuthenticated(true);
      } else {
        setUserProfile(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUserProfile(null);
      setIsAuthenticated(false);
    } finally {
      // Quick hydration
      const timer = setTimeout(() => {
        setLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const login = (role: UserRole = 'ADMIN', profile?: Partial<UserProfile>) => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem(AUTH_STATE_KEY, 'true');
    } catch (e) {
      console.error(e);
    }

    const baseProfile: UserProfile = {
      id: profile?.id || (role === 'CLIENT' ? 'user-client-01' : 'user-admin-01'),
      name: profile?.name || (role === 'ADMIN' ? 'Dra. Camila Vasconcelos' : 'Cliente Conectado'),
      email: profile?.email || (role === 'ADMIN' ? 'camila@sublimeestetica.com.br' : 'cliente@aura.com'),
      phone: profile?.phone || '(11) 98765-4321',
      role: role,
      registration_completed: true,
      registrationCompleted: true,
      ...profile,
    };

    saveProfile(baseProfile);
  };

  /**
   * Autenticação assíncrona blindada com Supabase Auth + RLS e verificação de perfil
   */
  const signInWithCredentials = async (
    identifier: string,
    password?: string
  ): Promise<AuthResponse> => {
    const res = await handleAuraSignIn(identifier, password);
    if (res.success && res.profile) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem(AUTH_STATE_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
      saveProfile(res.profile);
    }
    return res;
  };

  /**
   * Cadastro assíncrono blindado com Supabase Auth e perfil
   */
  const signUpWithCredentials = async (data: {
    name: string;
    cpf: string;
    whatsapp: string;
    email: string;
    password?: string;
  }): Promise<AuthResponse> => {
    const res = await handleAuraSignUp(data);
    if (res.success && res.profile) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem(AUTH_STATE_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
      saveProfile(res.profile);
      setPortalRoute('/portal/hub');
    }
    return res;
  };

  /**
   * Fluxo de Identidade Proprietário Aura
   * Cadastro com chave única de negócio (CPF)
   */
  const registerWithCpf = (data: {
    name: string;
    cpf: string;
    whatsapp: string;
    email: string;
    password?: string;
  }) => {
    const res = dataService.registerClientWithCpf(data);
    if (!res.success || !res.client) {
      return { success: false, error: res.error || 'Erro ao realizar cadastro.' };
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
      medical_notes: client.medical_notes || '',
      medicalNotes: client.medical_notes || '',
      role: 'CLIENT',
      registration_completed: true,
      registrationCompleted: true,
      lgpd_consent: true,
      lgpdConsent: true,
      avatar_url: client.photoUrl,
      avatarUrl: client.photoUrl,
    };

    setIsAuthenticated(true);
    try {
      localStorage.setItem(AUTH_STATE_KEY, 'true');
    } catch (e) {
      console.error(e);
    }
    saveProfile(newProfile);
    setPortalRoute('/portal/hub');

    return {
      success: true,
      profile: newProfile,
    };
  };

  /**
   * Login proprietário por CPF ou E-mail
   */
  const loginWithCpfOrEmail = (identifier: string, _password?: string) => {
    const raw = identifier.trim();
    const cleanDigits = raw.replace(/\D/g, '');
    const isCpf = cleanDigits.length === 11;
    const isEmail = raw.includes('@');

    // 0. GOD MODE: Autenticação Root da Plataforma (PLATFORM_ADMIN)
    const rootEmails = ['dev@aura.com.br', 'augusto.leandro569@gmail.com'];
    if (isEmail && rootEmails.includes(raw.toLowerCase())) {
      const rootProfile: UserProfile = {
        id: 'prof-root-01',
        name: 'Root Platform Dev (Engenheiro Chefe)',
        full_name: 'Root Platform Dev (Engenheiro Chefe)',
        email: raw.toLowerCase(),
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
      setIsAuthenticated(true);
      try {
        localStorage.setItem(AUTH_STATE_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
      saveProfile(rootProfile);
      return { success: true, role: 'PLATFORM_ADMIN' as UserRole, profile: rootProfile };
    }

    // 1. Procurar perfil de gestão/administração se for email corporativo conhecido
    const adminEmails = ['camila@sublimeestetica.com.br', 'renata.gestao@sublimeestetica.com.br', 'admin@sublime.com'];
    if (isEmail && adminEmails.includes(raw.toLowerCase())) {
      const adminProfile: UserProfile = {
        id: 'user-admin-01',
        name: 'Dra. Camila Vasconcelos',
        email: raw.toLowerCase(),
        phone: '(11) 98765-4321',
        whatsapp: '5511987654321',
        role: 'ADMIN',
        registration_completed: true,
        registrationCompleted: true,
        avatar_url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=200&q=80',
      };
      setIsAuthenticated(true);
      try {
        localStorage.setItem(AUTH_STATE_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
      saveProfile(adminProfile);
      return { success: true, role: 'ADMIN' as UserRole, profile: adminProfile };
    }

    // 2. Procurar em clientes por CPF
    let clientMatch = isCpf ? dataService.getClientByCpf(cleanDigits) : undefined;

    // 3. Se não achou por CPF ou não era CPF, procurar por e-mail
    if (!clientMatch && isEmail) {
      clientMatch = dataService.getClients().find(
        (c) => c.email && c.email.toLowerCase() === raw.toLowerCase()
      );
    }

    // 4. Se encontrou o cliente:
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
      setIsAuthenticated(true);
      try {
        localStorage.setItem(AUTH_STATE_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
      saveProfile(clientProfile);
      setPortalRoute('/portal/hub');
      return { success: true, role: 'CLIENT' as UserRole, profile: clientProfile };
    }

    // Fallback: se digitou credenciais de demonstração ou usuário não encontrado
    return {
      success: false,
      error: 'Nenhum cadastro encontrado com este CPF ou E-mail. Por favor, crie sua conta.',
    };
  };

  /**
   * Gatilho legado de compatibilidade
   */
  const loginWithGoogle = (googleData?: any) => {
    return registerWithCpf({
      name: googleData?.name || googleData?.full_name || 'Carolina Silva',
      cpf: googleData?.cpf || '523.841.902-33',
      whatsapp: googleData?.whatsapp || '(11) 98765-4321',
      email: googleData?.email || 'carolina.silva@aura.com',
    }) as any;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem(AUTH_STATE_KEY, 'false');
    } catch (e) {
      console.error(e);
    }
  };

  const saveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.error('Error saving userProfile:', e);
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    const regCompleted = updates.registration_completed !== undefined 
      ? updates.registration_completed 
      : (updates.registrationCompleted !== undefined ? updates.registrationCompleted : userProfile.registration_completed);

    const updated: UserProfile = {
      ...userProfile,
      ...updates,
      registration_completed: regCompleted,
      registrationCompleted: regCompleted,
    };
    saveProfile(updated);
  };

  const toggleRegistrationStatus = () => {
    if (!userProfile) return;
    const nextStatus = !userProfile.registration_completed;
    updateUserProfile({
      registration_completed: nextStatus,
      registrationCompleted: nextStatus,
      cpf: nextStatus && !userProfile.cpf ? '412.890.345-12' : userProfile.cpf,
      birth_date: nextStatus && !userProfile.birth_date ? '1996-03-22' : userProfile.birth_date,
      lgpd_consent: nextStatus ? true : userProfile.lgpd_consent,
    });
  };

  const completeRegistration = (data: {
    name: string;
    cpf: string;
    birth_date: string;
    whatsapp: string;
    email?: string;
    medical_notes?: string;
    lgpd_consent: boolean;
  }) => {
    if (!userProfile) return;

    // Persist to dataService so the clinic system also has this client registered!
    const clientRecord = dataService.createClient({
      name: data.name,
      phone: data.whatsapp,
      whatsapp: data.whatsapp,
      email: data.email || userProfile.email,
      cpf: data.cpf,
      documentCpf: data.cpf,
      birth_date: data.birth_date,
      birthDate: data.birth_date,
      medical_notes: data.medical_notes,
      medicalNotes: data.medical_notes,
      notes: data.medical_notes,
      lgpd_consent: data.lgpd_consent,
      lgpdConsent: data.lgpd_consent,
      registration_completed: true,
      registrationCompleted: true,
    });

    const updated: UserProfile = {
      ...userProfile,
      name: data.name,
      cpf: data.cpf,
      documentCpf: data.cpf,
      birth_date: data.birth_date,
      birthDate: data.birth_date,
      whatsapp: data.whatsapp,
      phone: data.whatsapp,
      email: data.email || userProfile.email,
      medical_notes: data.medical_notes,
      medicalNotes: data.medical_notes,
      lgpd_consent: data.lgpd_consent,
      lgpdConsent: data.lgpd_consent,
      registration_completed: true,
      registrationCompleted: true,
      clientId: clientRecord.id,
    };

    saveProfile(updated);
    setPortalRoute('/portal/agendamento');
  };

  const selectClientAsUser = (clientId: string) => {
    const client = dataService.getClientById(clientId);
    if (!client) return;

    const regCompleted = Boolean(client.registration_completed || client.registrationCompleted || client.cpf);
    const profile: UserProfile = {
      id: `user-${client.id}`,
      clientId: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      whatsapp: client.whatsapp || client.phone,
      cpf: client.cpf || client.documentCpf || '',
      documentCpf: client.cpf || client.documentCpf || '',
      birth_date: client.birth_date || client.birthDate || '',
      birthDate: client.birth_date || client.birthDate || '',
      medical_notes: client.medical_notes || client.medicalNotes || client.notes || '',
      medicalNotes: client.medical_notes || client.medicalNotes || client.notes || '',
      lgpd_consent: Boolean(client.lgpd_consent ?? client.lgpdConsent ?? true),
      lgpdConsent: Boolean(client.lgpd_consent ?? client.lgpdConsent ?? true),
      registration_completed: regCompleted,
      registrationCompleted: regCompleted,
      avatar_url: client.photoUrl,
      role: 'CLIENT',
    };

    saveProfile(profile);
  };

  const resetUserToPending = () => {
    const pendingProfile: UserProfile = {
      id: 'user-client-pending',
      name: 'Mariana Duarte',
      email: 'mariana.duarte@email.com',
      phone: '(11) 97112-9900',
      whatsapp: '5511971129900',
      cpf: '',
      birth_date: '',
      registration_completed: false,
      registrationCompleted: false,
      lgpd_consent: false,
      lgpdConsent: false,
      medical_notes: '',
      medicalNotes: '',
      role: 'CLIENT',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    };
    saveProfile(pendingProfile);
    setPortalRoute('/portal/agendamento');
  };

  const userRole: UserRole = userProfile?.role || 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userProfile,
        loading,
        portalRoute,
        setPortalRoute,
        updateUserProfile,
        toggleRegistrationStatus,
        completeRegistration,
        selectClientAsUser,
        resetUserToPending,
        login,
        loginWithCpfOrEmail,
        registerWithCpf,
        loginWithGoogle,
        logout,
        signOut: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
