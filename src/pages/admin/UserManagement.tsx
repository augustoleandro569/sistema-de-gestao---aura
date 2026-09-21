import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Settings,
  CheckCircle,
  XCircle,
  Search,
  X,
  Mail,
  User,
  Phone,
  Sparkles,
  CreditCard,
  Building2,
  Calendar,
  Lock,
  Scissors,
  Check,
  Award,
  FileText,
  AlertCircle
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Profile, UserRole, USER_ROLES, USER_ROLE_LABELS, GlobalProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const UserManagement: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<Profile | null>(null);

  // Form State para Criação / Vinculação Desacoplada de Perfil
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpf, setCpf] = useState('');
  const [role, setRole] = useState<UserRole>('PROFESSIONAL');
  const [selectedUnit, setSelectedUnit] = useState<string>('unit-matriz');
  const [specialty, setSpecialty] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [foundGlobalProfile, setFoundGlobalProfile] = useState<GlobalProfile | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const servicesList = useMemo(() => dataService.getServices(), []);
  const unitsList = useMemo(() => dataService.getUnits(), []);

  const { userProfile, userRole } = useAuth();

  const loadProfiles = () => {
    const list = dataService.getProfiles({
      id: userProfile?.id || 'prof-admin-01',
      role: (userRole as UserRole) || 'ADMIN',
      organizationId: userProfile?.business_id || userProfile?.organizationId || 'biz-sublime-01',
    });
    setProfiles(list);
  };

  useEffect(() => {
    loadProfiles();
    const unsubscribe = dataService.subscribe(loadProfiles);
    return unsubscribe;
  }, []);

  // Real-time Global Identity Lookup
  const handleEmailChange = (val: string) => {
    setEmail(val);
    setErrorMessage('');
    const found = dataService.findGlobalProfileByEmailOrCpf(val);
    if (found) {
      setFoundGlobalProfile(found);
      if (!fullName) setFullName(found.full_name || found.name || '');
      if (!whatsapp) setWhatsapp(found.whatsapp || found.phone || '');
      if (!cpf && found.cpf) setCpf(found.cpf);
    } else {
      if (cpf) {
        const foundByCpf = dataService.findGlobalProfileByEmailOrCpf(cpf);
        setFoundGlobalProfile(foundByCpf || null);
      } else {
        setFoundGlobalProfile(null);
      }
    }
  };

  const handleCpfChange = (val: string) => {
    setCpf(val);
    setErrorMessage('');
    const found = dataService.findGlobalProfileByEmailOrCpf(val);
    if (found) {
      setFoundGlobalProfile(found);
      if (!fullName) setFullName(found.full_name || found.name || '');
      if (!whatsapp) setWhatsapp(found.whatsapp || found.phone || '');
      if (!email && found.email) setEmail(found.email);
    } else if (email) {
      const foundByEmail = dataService.findGlobalProfileByEmailOrCpf(email);
      setFoundGlobalProfile(foundByEmail || null);
    } else {
      setFoundGlobalProfile(null);
    }
  };

  // Filtros de visualização
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const nameMatch =
        (p.full_name || p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.specialty && p.specialty.toLowerCase().includes(searchTerm.toLowerCase()));

      let roleMatch = true;
      if (selectedRoleFilter === 'OWNER') roleMatch = p.role === 'OWNER';
      else if (selectedRoleFilter === 'ADMIN') roleMatch = p.role === 'ADMIN' || p.role === 'MANAGER' || p.role === 'OWNER';
      else if (selectedRoleFilter === 'PROFESSIONAL') roleMatch = p.role === 'PROFESSIONAL';
      else if (selectedRoleFilter === 'RECEPTIONIST') roleMatch = p.role === 'RECEPTIONIST';
      else if (selectedRoleFilter === 'CLIENT') roleMatch = p.role === 'CLIENT';

      return nameMatch && roleMatch;
    });
  }, [profiles, searchTerm, selectedRoleFilter]);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleToggleService = (serviceTitle: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceTitle)
        ? prev.filter((s) => s !== serviceTitle)
        : [...prev, serviceTitle]
    );
  };

  const handleCreateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!fullName.trim() || !email.trim()) {
      setErrorMessage('Nome completo e e-mail são obrigatórios.');
      return;
    }

    const targetBizId = userProfile?.business_id || userProfile?.organizationId || 'biz-sublime-01';

    if (role === 'CLIENT') {
      const res = dataService.createOrLinkCustomer({
        businessId: targetBizId,
        name: fullName.trim(),
        email: email.trim(),
        cpf: cpf.trim() || undefined,
        phone: whatsapp.trim() || undefined,
        medicalNotes: medicalNotes.trim() || undefined,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Erro ao vincular cliente à clínica.');
        return;
      }

      setSuccessMessage(
        res.wasExistingGlobal
          ? `✨ Cliente ${fullName.trim()} já existente na Aura vinculado(a) à sua clínica com sucesso!`
          : `✅ Novo perfil de cliente criado e cadastrado com sucesso!`
      );
    } else {
      const specialtySummary =
        role === 'PROFESSIONAL'
          ? selectedServices.length > 0
            ? selectedServices.join(', ')
            : specialty.trim() || 'Estética Geral'
          : specialty.trim() || undefined;

      const res = dataService.createOrLinkStaff({
        businessId: targetBizId,
        name: fullName.trim(),
        email: email.trim(),
        cpf: cpf.trim() || undefined,
        phone: whatsapp.trim() || undefined,
        role,
        unitId: selectedUnit,
        specialty: specialtySummary,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Erro ao vincular membro da equipe.');
        return;
      }

      setSuccessMessage(
        res.wasExistingGlobal
          ? `✨ Profissional ${fullName.trim()} vinculado(a) à sua clínica como ${USER_ROLE_LABELS[role]}!`
          : `✅ Perfil criado com sucesso como ${USER_ROLE_LABELS[role]}!`
      );
    }

    // Reset Form
    setTimeout(() => {
      setFullName('');
      setEmail('');
      setWhatsapp('');
      setCpf('');
      setRole('PROFESSIONAL');
      setSpecialty('');
      setMedicalNotes('');
      setSelectedServices([]);
      setFoundGlobalProfile(null);
      setSuccessMessage('');
      setErrorMessage('');
      setIsCreateModalOpen(false);
    }, 2000);
  };

  const renderRoleBadge = (userRole: UserRole) => {
    switch (userRole) {
      case 'PLATFORM_ADMIN':
        return (
          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-200">
            ROOT / GOD MODE
          </span>
        );
      case 'OWNER':
        return (
          <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-200">
            PROPRIETÁRIO(A)
          </span>
        );
      case 'ADMIN':
        return (
          <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-3 py-1 rounded-full border border-purple-100">
            ADMINISTRADOR
          </span>
        );
      case 'MANAGER':
        return (
          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-100">
            GERENTE
          </span>
        );
      case 'PROFESSIONAL':
        return (
          <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-3 py-1 rounded-full border border-rose-100">
            PROFISSIONAL
          </span>
        );
      case 'RECEPTIONIST':
        return (
          <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-100">
            RECEPÇÃO
          </span>
        );
      case 'CLIENT':
        return (
          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-100">
            CLIENTE
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-3 py-1 rounded-full">
            {userRole}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* 1. O Centro de Governança (Aba Gestão de Usuários) - Header com Botão Único */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-2">
        <div>
          <h1 className="text-3xl font-serif text-graphite">Gestão de Usuários & Acessos</h1>
          <p className="text-sm text-aesthetic-graphite/60 mt-1">
            Arquitetura desacoplada: identidade global única (profiles) com afiliações locais blindadas.
          </p>
        </div>

        {/* BOTÃO ÚNICO DE CRIAÇÃO */}
        <button
          type="button"
          onClick={() => {
            setErrorMessage('');
            setSuccessMessage('');
            setFoundGlobalProfile(null);
            setIsCreateModalOpen(true);
          }}
          className="h-12 px-8 bg-graphite text-white rounded-full text-xs font-bold tracking-widest hover:bg-black shadow-lg flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <UserPlus size={18} />
          CRIAR OU VINCULAR USUÁRIO
        </button>
      </header>

      {/* FILTROS DE VISUALIZAÇÃO */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 px-2">
        <div className="flex bg-white p-1 rounded-2xl border border-aesthetic-bege/30 shadow-2xs overflow-x-auto">
          {[
            { id: 'ALL', label: 'Todos os Usuários' },
            { id: 'ADMIN', label: 'Dono & Gestão' },
            { id: 'PROFESSIONAL', label: 'Profissionais' },
            { id: 'RECEPTIONIST', label: 'Recepção' },
            { id: 'CLIENT', label: 'Clientes Vinculados' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedRoleFilter(tab.id)}
              className={`px-5 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedRoleFilter === tab.id
                  ? 'bg-graphite text-white shadow-xs'
                  : 'text-aesthetic-graphite/70 hover:bg-aesthetic-off-white hover:text-graphite'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Barra de Busca rápida */}
        <div className="relative min-w-[280px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aesthetic-graphite/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, e-mail, CPF ou função..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-aesthetic-bege/40 text-xs text-graphite focus:outline-none focus:ring-1 focus:ring-aesthetic-gold"
          />
        </div>
      </div>

      {/* TABELA DE GESTÃO CENTRALIZADA */}
      <div className="bg-white rounded-[40px] shadow-premium border border-aesthetic-bege/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-aesthetic-off-white/50 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-aesthetic-bege/20">
                <th className="px-8 py-6">Identidade Global</th>
                <th className="px-8 py-6">Nível de Acesso (Role)</th>
                <th className="px-8 py-6">Vínculo Local / Atuação</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aesthetic-bege/10">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-xs text-gray-400">
                    Nenhum perfil encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((user) => {
                  const initials = getInitials(user.full_name || user.name);
                  const isProfessional = user.role === 'PROFESSIONAL';
                  const isOwner = user.role === 'OWNER';
                  const isAdmin = user.role === 'ADMIN' || user.role === 'MANAGER' || isOwner;
                  const isClient = user.role === 'CLIENT';

                  return (
                    <tr key={user.id} className="hover:bg-aesthetic-off-white/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          {user.avatarUrl || user.avatar_url ? (
                            <img
                              src={user.avatarUrl || user.avatar_url}
                              alt={user.name}
                              className="w-12 h-12 rounded-2xl object-cover border border-aesthetic-bege/30 shadow-xs"
                            />
                          ) : (
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs shadow-xs ${
                                isOwner
                                  ? 'bg-amber-100 text-amber-900'
                                  : isProfessional
                                  ? 'bg-aesthetic-nude text-rose-700'
                                  : isAdmin
                                  ? 'bg-purple-100 text-purple-700'
                                  : isClient
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {initials}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-graphite text-sm">{user.full_name || user.name}</p>
                              {user.is_root && (
                                <span className="bg-black text-amber-300 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                                  ROOT
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-400">{user.email}</p>
                            {user.cpf && (
                              <p className="text-[9px] text-gray-400 font-mono">CPF: {user.cpf}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        {renderRoleBadge(user.role)}
                      </td>

                      <td className="px-8 py-6 text-xs text-gray-500 max-w-xs">
                        <div className="truncate font-medium text-graphite">
                          {user.specialty || (isClient ? 'Cliente Regular da Clínica' : isOwner ? 'Proprietário(a) Geral' : isAdmin ? 'Diretoria Executiva' : 'Atendimento & Operações')}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {user.unitId === 'unit-matriz'
                            ? 'Unidade Jardins (Matriz)'
                            : user.unitId === 'unit-itaim'
                            ? 'Unidade Itaim Bibi'
                            : 'Todas as Unidades'}
                        </div>
                      </td>

                      <td className="px-8 py-6 text-center">
                        {user.status === 'inactive' ? (
                          <div className="inline-flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Inativo
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 text-emerald-600 text-[10px] font-bold uppercase">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ativo
                          </div>
                        )}
                      </td>

                      <td className="px-8 py-6 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedUserForDetail(user)}
                          className="p-2.5 hover:bg-aesthetic-off-white rounded-full transition-all cursor-pointer"
                          title="Gerenciar Permissões e RLS"
                        >
                          <Settings size={20} className="text-aesthetic-bege group-hover:text-graphite transition-colors" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. O Formulário de Criação / Vinculação de Perfil (Centralizado com Auditoria Global) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-aesthetic-bege/30 space-y-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-aesthetic-bege/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-graphite text-white flex items-center justify-center font-bold">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-graphite">
                    {foundGlobalProfile ? 'Vincular Usuário à Clínica' : 'Criar Novo Perfil'}
                  </h3>
                  <p className="text-xs text-aesthetic-graphite/60">
                    {foundGlobalProfile
                      ? 'Reutilização de identidade global sem duplicidade de conta'
                      : 'Ponto único de verdade para identidades e acessos'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-aesthetic-off-white flex items-center justify-center text-gray-400 hover:text-graphite cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Banner de Identidade Global Encontrada */}
            {foundGlobalProfile && (
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs flex items-start gap-3 animate-in fade-in">
                <Sparkles size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-900">
                    ✨ Cadastro Global Encontrado na Plataforma Aura!
                  </p>
                  <p className="text-amber-800 leading-relaxed text-[11px]">
                    Este e-mail/CPF já possui cadastro na Aura pertencente a <strong>{foundGlobalProfile.full_name}</strong>. Deseja vinculá-lo à sua clínica? Os dados globais serão preservados e nenhum conflito de conta será gerado.
                  </p>
                </div>
              </div>
            )}

            {/* Banner de Mensagem de Erro amigável */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
                <AlertCircle size={18} className="text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Banner de Sucesso */}
            {successMessage ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
                <CheckCircle size={20} className="text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleCreateProfileSubmit} className="space-y-5">
                {/* 1. Dados Base: E-mail, CPF, Nome, WhatsApp */}
                <div className="space-y-3.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    1. Identidade Global (Chaves de Busca Únicas)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-graphite mb-1">E-mail *</label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          required
                          placeholder="usuario@email.com"
                          value={email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-aesthetic-off-white border-none text-xs text-graphite focus:outline-none focus:ring-1 focus:ring-aesthetic-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-graphite mb-1">CPF (Validação Global)</label>
                      <div className="relative">
                        <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="000.000.000-00"
                          value={cpf}
                          onChange={(e) => handleCpfChange(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-aesthetic-off-white border-none text-xs text-graphite focus:outline-none focus:ring-1 focus:ring-aesthetic-gold"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1">Nome Completo *</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Dra. Mariana Duarte"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-aesthetic-off-white border-none text-xs text-graphite focus:outline-none focus:ring-1 focus:ring-aesthetic-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1">WhatsApp de Contato</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="(11) 98888-7777"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-aesthetic-off-white border-none text-xs text-graphite focus:outline-none focus:ring-1 focus:ring-aesthetic-gold"
                      />
                    </div>
                  </div>

                  {role !== 'CLIENT' && (
                    <div>
                      <label className="block text-xs font-semibold text-graphite mb-1">Unidade Principal de Atuação (RLS) *</label>
                      <div className="relative">
                        <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          value={selectedUnit}
                          onChange={(e) => setSelectedUnit(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-aesthetic-off-white border-none text-xs text-graphite focus:outline-none focus:ring-1 focus:ring-aesthetic-gold cursor-pointer"
                        >
                          {unitsList.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} — {u.address}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Definição de Papel (Role) */}
                <div className="space-y-3 pt-2 border-t border-aesthetic-bege/20">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    2. Papel e Permissões na Clínica (Role Local)
                  </span>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      {
                        key: 'OWNER' as UserRole,
                        title: 'OWNER',
                        desc: 'Proprietário(a). Visão plena de todas as unidades, DRE e governança.',
                      },
                      {
                        key: 'ADMIN' as UserRole,
                        title: 'ADMIN',
                        desc: 'Administrador(a). Gestão operacional, faturamento e usuários.',
                      },
                      {
                        key: 'PROFESSIONAL' as UserRole,
                        title: 'PROFESSIONAL',
                        desc: 'Profissional. Agenda isolada por unidade + histórico técnico.',
                      },
                      {
                        key: 'RECEPTIONIST' as UserRole,
                        title: 'RECEPTIONIST',
                        desc: 'Recepção. Agenda global da unidade + movimentação de estoque.',
                      },
                      {
                        key: 'CLIENT' as UserRole,
                        title: 'CLIENT',
                        desc: 'Cliente. Vínculo de fidelidade, agendamento e prontuário seguro.',
                      },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setRole(opt.key)}
                        className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          role === opt.key
                            ? 'bg-graphite text-white border-graphite shadow-sm'
                            : 'bg-aesthetic-off-white/80 border-aesthetic-bege/30 text-graphite hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-xs font-bold tracking-wider">{opt.title}</span>
                          {role === opt.key && <Check size={14} className="text-aesthetic-gold" />}
                        </div>
                        <p className={`text-[10px] leading-relaxed ${role === opt.key ? 'text-gray-300' : 'text-gray-500'}`}>
                          {opt.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Campos específicos para Profissional */}
                {role === 'PROFESSIONAL' && (
                  <div className="space-y-3 pt-2 border-t border-aesthetic-bege/20 animate-in fade-in">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      3. Especialidade & Procedimentos Habilitados
                    </span>

                    <div>
                      <label className="block text-xs font-semibold text-graphite mb-1">
                        Título da Especialidade Principal
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Especialista em Harmonização Facial, Microagulhamento..."
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-aesthetic-off-white border-none text-xs text-graphite focus:outline-none focus:ring-1 focus:ring-aesthetic-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-graphite mb-1.5">
                        Serviços Habilitados para Execução
                      </label>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-aesthetic-off-white/50 rounded-2xl border border-aesthetic-bege/20">
                        {servicesList.map((srv) => {
                          const isSelected = selectedServices.includes(srv.title);
                          return (
                            <button
                              key={srv.id}
                              type="button"
                              onClick={() => handleToggleService(srv.title)}
                              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-rose-700 text-white shadow-xs'
                                  : 'bg-white text-gray-600 border border-aesthetic-bege/40 hover:border-gray-400'
                              }`}
                            >
                              {srv.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Campos específicos para Cliente */}
                {role === 'CLIENT' && (
                  <div className="space-y-3 pt-2 border-t border-aesthetic-bege/20 animate-in fade-in">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      3. Prontuário & Observações Clínicas
                    </span>
                    <div>
                      <label className="block text-xs font-semibold text-graphite mb-1">
                        Observações Médicas / Histórico de Pele
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Ex: Histórico de alergias, sensibilidade cutânea ou preferências de atendimento..."
                        value={medicalNotes}
                        onChange={(e) => setMedicalNotes(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-aesthetic-off-white border-none text-xs text-graphite focus:outline-none focus:ring-1 focus:ring-aesthetic-gold resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Notice de Segurança e RLS */}
                <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100 flex items-start gap-2.5 text-[11px] text-emerald-800">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    {foundGlobalProfile
                      ? 'Vínculo multi-tenant blindado: o usuário terá acesso restrito a esta clínica via Row Level Security (RLS).'
                      : 'Novo perfil global registrado com auditoria de integridade e validação de CPF sem duplicidade.'}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-500 hover:bg-aesthetic-off-white transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-full bg-graphite hover:bg-black text-white text-xs font-bold tracking-wider shadow-md transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    {foundGlobalProfile ? 'VINCULAR À CLÍNICA' : 'CRIAR E VINCULAR'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal de Detalhes / Permissões do Usuário */}
      {selectedUserForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-aesthetic-bege/30 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-aesthetic-bege/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-aesthetic-nude flex items-center justify-center font-bold text-rose-700">
                  {getInitials(selectedUserForDetail.full_name || selectedUserForDetail.name)}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-graphite">
                    {selectedUserForDetail.full_name || selectedUserForDetail.name}
                  </h3>
                  <p className="text-xs text-gray-400">{selectedUserForDetail.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForDetail(null)}
                className="w-8 h-8 rounded-full hover:bg-aesthetic-off-white flex items-center justify-center text-gray-400 hover:text-graphite cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center p-3 bg-aesthetic-off-white rounded-2xl">
                <span className="text-gray-500 font-medium">Nível de Acesso (Role)</span>
                <div>{renderRoleBadge(selectedUserForDetail.role)}</div>
              </div>

              <div className="flex justify-between items-center p-3 bg-aesthetic-off-white rounded-2xl">
                <span className="text-gray-500 font-medium">Vínculo / Especialidade</span>
                <span className="font-semibold text-graphite">
                  {selectedUserForDetail.specialty || (selectedUserForDetail.role === 'CLIENT' ? 'Cliente' : 'Geral')}
                </span>
              </div>

              {selectedUserForDetail.cpf && (
                <div className="flex justify-between items-center p-3 bg-aesthetic-off-white rounded-2xl">
                  <span className="text-gray-500 font-medium">CPF (Chave Global)</span>
                  <span className="font-mono font-semibold text-graphite">
                    {selectedUserForDetail.cpf}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center p-3 bg-aesthetic-off-white rounded-2xl">
                <span className="text-gray-500 font-medium">Status no Sistema</span>
                <span className="font-bold text-emerald-600 uppercase text-[10px]">
                  {selectedUserForDetail.status === 'inactive' ? 'Inativo' : 'Ativo'}
                </span>
              </div>

              <div className="p-3.5 bg-purple-50/50 rounded-2xl border border-purple-100 text-[11px] text-purple-900 leading-relaxed">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-purple-800">
                  <ShieldCheck size={14} /> Regras RLS Herdadas
                </div>
                {selectedUserForDetail.role === 'PLATFORM_ADMIN'
                  ? 'God Mode Ativo: ignora business_id e unit_id com acesso irrestrito a todas as entidades da plataforma.'
                  : selectedUserForDetail.role === 'OWNER'
                  ? 'Visão plena de todas as unidades da clínica. Permissão para gerenciar finanças, equipe, preços e módulos.'
                  : selectedUserForDetail.role === 'ADMIN'
                  ? 'Acesso irrestrito a todos os módulos da organização: Financeiro, DRE, Precificação, Estoque e Gestão de Usuários.'
                  : selectedUserForDetail.role === 'PROFESSIONAL'
                  ? 'Isolamento por unidade (Staff Unit Isolation). Acesso restrito à agenda própria e histórico técnico dos seus pacientes.'
                  : selectedUserForDetail.role === 'RECEPTIONIST'
                  ? 'Acesso à agenda global da unidade, controle de recepção e movimentação de estoque.'
                  : 'Acesso isolado ao Hub Aura do Cliente: visualiza apenas os próprios agendamentos e selos de fidelidade.'}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedUserForDetail(null)}
                className="px-6 py-2 rounded-full bg-graphite text-white text-xs font-bold cursor-pointer hover:bg-black transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
