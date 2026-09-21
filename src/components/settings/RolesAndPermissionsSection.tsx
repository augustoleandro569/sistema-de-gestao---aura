import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Lock,
  Eye,
  CheckCircle,
  Copy,
  Terminal,
  UserCheck,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Shield
} from 'lucide-react';
import { UserRole, USER_ROLES, USER_ROLE_LABELS, Profile } from '../../types';
import { dataService } from '../../services/dataService';
import { useLayout } from '../../layouts';

export const RolesAndPermissionsSection: React.FC = () => {
  const layout = useLayout();
  const [copied, setCopied] = useState(false);
  const [simulatedActorRole, setSimulatedActorRole] = useState<UserRole>('ADMIN');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('prof-admin-01');

  const allProfiles = dataService.getProfiles(); // Raw profiles list

  // Determine current simulated actor
  const currentActor = allProfiles.find(p => p.id === selectedProfileId) || allProfiles[0];

  // Execute RLS Query with simulated actor
  const rlsFilteredProfiles = dataService.getProfiles({
    id: currentActor.id,
    role: currentActor.role,
    organizationId: currentActor.organizationId
  });

  const sqlCode = `-- 1. Definição dos Cargos
CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'PROFESSIONAL', 'RECEPTIONIST', 'CLIENT');

-- 2. Tabela de Perfis (Profiles)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'CLIENT',
  specialty TEXT, -- Ex: 'Design de Sobrancelhas', 'Estética Avançada'
  avatar_url TEXT,
  status TEXT DEFAULT 'active', -- active, inactive, pending_invite
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Segurança RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Exemplo: Clientes só veem o próprio perfil
CREATE POLICY "Clients can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Exemplo: Admin vê todos os perfis da sua organização
CREATE POLICY "Admins can view all profiles in org" 
ON profiles FOR ALL 
USING (role = 'ADMIN' AND organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRoleChange = (profileId: string, newRole: UserRole) => {
    dataService.updateProfileRole(profileId, newRole);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'MANAGER':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PROFESSIONAL':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'RECEPTIONIST':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CLIENT':
        return 'bg-[#FAF6F0] text-[#8C6D58] border-[#EADCCE]';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EDE7DF] shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F4EFEA]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D2725] text-amber-300 flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-[#2D2725]">
              Controle de Acesso por Função (RBAC) & Segurança RLS
            </h3>
            <p className="text-xs text-[#8F8278]">
              Enum <code className="text-[#B88746] font-semibold">user_role</code>, coluna de perfil e políticas Row Level Security ativas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              layout.setCurrentTab('acessos');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-graphite hover:bg-black text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
          >
            <Shield size={14} />
            <span>Abrir Gestão de Acessos</span>
            <ArrowRight size={13} />
          </button>

          <button
            type="button"
            onClick={handleCopySql}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#D5C9BD] text-xs font-semibold text-[#2D2725] transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle size={14} className="text-emerald-600" />
                <span className="text-emerald-700">SQL Copiado!</span>
              </>
            ) : (
              <>
                <Copy size={14} className="text-[#7A6E65]" />
                <span>Copiar Script SQL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: 4 Regras de Implementação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] space-y-1">
          <div className="flex items-center gap-1.5 text-[#B88746] font-bold">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px]">1</span>
            <span>Enum user_role</span>
          </div>
          <p className="text-[#7A6E65] text-[11px]">
            Tipagem segura: <code className="font-mono text-[10px] text-[#2D2725]">ADMIN, MANAGER, PROFESSIONAL, RECEPTIONIST, CLIENT</code>.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] space-y-1">
          <div className="flex items-center gap-1.5 text-[#B88746] font-bold">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px]">2</span>
            <span>Coluna profiles.role</span>
          </div>
          <p className="text-[#7A6E65] text-[11px]">
            Padrão seguro: <code className="font-mono text-[10px] text-[#2D2725]">DEFAULT 'CLIENT'</code> para novos cadastros de usuários.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] space-y-1">
          <div className="flex items-center gap-1.5 text-blue-700 font-bold">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">3</span>
            <span>RLS do Cliente</span>
          </div>
          <p className="text-[#7A6E65] text-[11px]">
            Privacidade estrita: Cliente acessa apenas seu próprio perfil (<code className="font-mono text-[10px] text-[#2D2725]">auth.uid() = id</code>).
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] space-y-1">
          <div className="flex items-center gap-1.5 text-purple-700 font-bold">
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[10px]">4</span>
            <span>RLS do Admin/Gestor</span>
          </div>
          <p className="text-[#7A6E65] text-[11px]">
            Multitenant: <code className="font-mono text-[10px] text-[#2D2725]">ADMIN/MANAGER</code> leem todos os usuários da mesma clínica.
          </p>
        </div>
      </div>

      {/* SQL Script Viewer */}
      <div className="rounded-2xl bg-[#1E1B19] p-4 text-xs font-mono text-[#E6DFD7] space-y-2 border border-[#3A332F]">
        <div className="flex items-center justify-between text-[11px] text-[#A89D93] pb-2 border-b border-[#332C28]">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-amber-400" />
            <span>database/profiles.sql</span>
          </div>
          <span className="text-emerald-400 font-sans text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
            PostgreSQL / Supabase RLS
          </span>
        </div>
        <pre className="overflow-x-auto text-[11px] leading-relaxed whitespace-pre font-mono text-[#D8CFCE] py-1">
          {sqlCode}
        </pre>
      </div>

      {/* RLS Live Simulator */}
      <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EDE7DF] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-[#B88746]" />
            <h4 className="font-bold text-sm text-[#2D2725]">
              Simulador Interativo de Políticas RLS (Row Level Security)
            </h4>
          </div>
          <span className="text-[11px] text-[#7A6E65]">
            Alterne o usuário autenticado para observar a filtragem de dados
          </span>
        </div>

        {/* User Selector for Simulation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#4A423C] mb-1">
              Usuário Autenticado (<code className="font-mono text-[11px]">auth.uid()</code>):
            </label>
            <select
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5C9BD] text-xs font-semibold text-[#2D2725] focus:ring-2 focus:ring-[#B88746] focus:outline-none"
            >
              {allProfiles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — Papel: {p.role} ({USER_ROLE_LABELS[p.role]})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#E0D7CC] flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8F8278]">
              Política RLS Aplicada pelo Banco:
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              {currentActor.role === 'CLIENT' ? (
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Regra 3: "Clientes acessam apenas próprio perfil" (auth.uid() = id)
                </span>
              ) : currentActor.role === 'ADMIN' || currentActor.role === 'MANAGER' ? (
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Regra 4: "Admins leem todos da organização" ({currentActor.role})
                </span>
              ) : (
                <span className="text-xs font-bold text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                  Acesso Padrão: Perfil individual ({currentActor.role})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Results of query */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7A6E65]">
            <span>
              Registros retornados pela consulta <code className="font-mono text-[#2D2725]">SELECT * FROM profiles</code>:
            </span>
            <span className="font-bold text-[#2D2725] bg-white px-2.5 py-0.5 rounded-full border border-[#E0D7CC]">
              {rlsFilteredProfiles.length} de {allProfiles.length} usuários visíveis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {rlsFilteredProfiles.map((p) => (
              <div
                key={p.id}
                className="p-3 bg-white rounded-xl border border-[#EAE3DA] flex items-center gap-3 shadow-2xs"
              >
                <img
                  src={p.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={p.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#EDE7DF] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-[#2D2725] truncate">{p.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getRoleBadgeColor(p.role)}`}>
                      {p.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#7A6E65] truncate">{p.email}</div>
                  <div className="text-[10px] text-[#9C8F85] flex items-center justify-between mt-1">
                    <span>ID: <code className="font-mono">{p.id.slice(0, 11)}</code></span>
                    <span className="text-[#B88746] font-medium">{p.roleTitle || USER_ROLE_LABELS[p.role]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {rlsFilteredProfiles.length === 1 && currentActor.role === 'CLIENT' && (
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
              <Lock size={14} className="shrink-0 text-blue-600" />
              <span>
                <strong>Segurança RLS Garantida:</strong> O cliente não tem visibilidade dos perfis de administradores, recepcionistas ou outros clientes da clínica.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Profiles Role Management Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#B88746]" />
            <h4 className="font-bold text-sm text-[#2D2725]">
              Gestão de Funções dos Usuários na Organização
            </h4>
          </div>
          <span className="text-xs text-[#8F8278]">
            Altere a coluna <code className="font-mono font-bold text-[#2D2725]">role</code> em tempo real
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#EDE7DF]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#7A6E65] font-semibold border-b border-[#EDE7DF]">
              <tr>
                <th className="py-2.5 px-3">Usuário</th>
                <th className="py-2.5 px-3">E-mail</th>
                <th className="py-2.5 px-3">Função Atual (user_role)</th>
                <th className="py-2.5 px-3">Permissão RLS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFEA] bg-white">
              {allProfiles.map((p) => (
                <tr key={p.id} className="hover:bg-[#FCFAF7] transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={p.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt={p.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#EDE7DF]"
                      />
                      <div>
                        <span className="font-bold text-[#2D2725] block">{p.name}</span>
                        <span className="text-[10px] text-[#8F8278]">{p.roleTitle || USER_ROLE_LABELS[p.role]}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-[#7A6E65] font-mono text-[11px]">{p.email}</td>
                  <td className="py-2.5 px-3">
                    <select
                      value={p.role}
                      onChange={(e) => handleRoleChange(p.id, e.target.value as UserRole)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getRoleBadgeColor(p.role)} bg-white focus:outline-none focus:ring-1 focus:ring-[#B88746] cursor-pointer`}
                    >
                      {USER_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role} ({USER_ROLE_LABELS[role]})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2.5 px-3">
                    {p.role === 'ADMIN' || p.role === 'MANAGER' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700">
                        <CheckCircle size={12} /> Acesso Total à Organização
                      </span>
                    ) : p.role === 'CLIENT' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700">
                        <Lock size={12} /> Apenas Próprio Perfil
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <UserCheck size={12} /> Operacional da Clínica
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
