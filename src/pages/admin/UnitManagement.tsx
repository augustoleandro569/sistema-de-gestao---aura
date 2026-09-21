import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  Calendar,
  Users,
  CheckCircle2,
  X,
  Search,
  ArrowRight,
  TrendingUp,
  Clock,
  Shield,
  Edit2
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Unit } from '../../types';

export const UnitManagement: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [activeUnitId, setActiveUnitId] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const loadData = () => {
    setUnits(dataService.getUnits());
    setActiveUnitId(dataService.getActiveUnitId());
  };

  useEffect(() => {
    loadData();
    const unsub = dataService.subscribe(loadData);
    return unsub;
  }, []);

  const filteredUnits = units.filter((u) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      u.name.toLowerCase().includes(term) ||
      u.address.toLowerCase().includes(term) ||
      (u.phone && u.phone.includes(term))
    );
  });

  const handleOpenCreate = () => {
    setEditingUnit(null);
    setName('');
    setAddress('');
    setPhone('');
    setStatus('active');
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setName(unit.name);
    setAddress(unit.address);
    setPhone(unit.phone || '');
    setStatus(unit.status);
    setIsCreateModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    if (editingUnit) {
      dataService.updateUnit(editingUnit.id, {
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim() || undefined,
        status,
      });
      setFeedbackMsg(`Unidade "${name}" atualizada com sucesso!`);
    } else {
      dataService.addUnit({
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim() || undefined,
      });
      setFeedbackMsg(`Nova filial "${name}" cadastrada com sucesso!`);
    }

    setIsCreateModalOpen(false);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleSelectUnitGlobal = (unitId: string) => {
    dataService.setActiveUnitId(unitId);
    setFeedbackMsg(
      unitId === 'ALL'
        ? 'Visão Global (Todas as Unidades) ativada.'
        : `Unidade operacional alternada com sucesso.`
    );
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // Metrics
  const totalUnits = units.length;
  const activeUnits = units.filter((u) => u.status === 'active').length;
  const appointments = dataService.getAppointments();
  const professionals = dataService.getProfessionals();

  return (
    <div id="unit-management-page" className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FAF6F0] text-[#B88746] px-3 py-1 rounded-full border border-[#EBDDCF]">
              SaaS Multiunidades Enterprise
            </span>
          </div>
          <h1 className="text-3xl font-serif text-graphite">Gestão de Unidades</h1>
          <p className="text-sm text-aesthetic-graphite/60 mt-1">
            Controle de filiais, sedes operacionais e governança descentralizada de clínicas.
          </p>
        </div>

        <button
          id="btn-create-unit"
          type="button"
          onClick={handleOpenCreate}
          className="h-12 px-7 bg-graphite text-white rounded-full text-xs font-bold tracking-wider hover:bg-black shadow-lg flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={18} />
          NOVA UNIDADE / FILIAL
        </button>
      </header>

      {feedbackMsg && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-4 py-3 rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
        <div className="bg-white rounded-2xl p-5 border border-aesthetic-bege/40 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#8F8278] uppercase">
            <span>Rede de Filiais</span>
            <Building2 size={18} className="text-[#B88746]" />
          </div>
          <div className="font-display text-3xl font-bold text-graphite mt-2">
            {totalUnits}
          </div>
          <div className="text-xs text-[#8F8278] mt-1">
            {activeUnits} sedes ativas em operação
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-aesthetic-bege/40 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#8F8278] uppercase">
            <span>Profissionais Alocados</span>
            <Users size={18} className="text-purple-600" />
          </div>
          <div className="font-display text-3xl font-bold text-graphite mt-2">
            {professionals.length}
          </div>
          <div className="text-xs text-purple-700 font-medium mt-1">
            Capacidade instalada multi-filial
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-aesthetic-bege/40 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#8F8278] uppercase">
            <span>Agendamentos Globais</span>
            <Calendar size={18} className="text-emerald-600" />
          </div>
          <div className="font-display text-3xl font-bold text-graphite mt-2">
            {appointments.length}
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            Hoje em toda a rede
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-aesthetic-bege/40 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#8F8278] uppercase">
            <span>Filtro Global Atual</span>
            <Shield size={18} className="text-blue-600" />
          </div>
          <div className="font-display text-xl font-bold text-graphite mt-2 truncate">
            {activeUnitId === 'ALL'
              ? 'Todas as Unidades'
              : units.find((u) => u.id === activeUnitId)?.name || 'Consolidado'}
          </div>
          <div className="text-xs text-blue-700 font-medium mt-1">
            Ativo no cabeçalho e relatórios
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 px-2">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aesthetic-graphite/40" />
          <input
            type="text"
            placeholder="Buscar unidade por nome, endereço ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-aesthetic-bege/50 rounded-2xl text-xs text-graphite focus:outline-none focus:ring-1 focus:ring-aesthetic-gold shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSelectUnitGlobal('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeUnitId === 'ALL'
                ? 'bg-graphite text-white shadow-xs'
                : 'bg-white text-[#5C534D] border border-aesthetic-bege/50 hover:bg-[#FAF6F0]'
            }`}
          >
            Visão Consolidada (Geral)
          </button>
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {filteredUnits.map((unit) => {
          const isSelected = activeUnitId === unit.id;
          return (
            <div
              key={unit.id}
              className={`bg-white rounded-3xl p-6 border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-[#B88746] shadow-md ring-2 ring-[#B88746]/20'
                  : 'border-aesthetic-bege/40 hover:border-gray-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] flex items-center justify-center text-[#B88746] border border-[#EBDDCF]">
                      <Building2 size={22} />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-graphite leading-tight">
                        {unit.name}
                      </h3>
                      <span
                        className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          unit.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {unit.status === 'active' ? 'Operação Ativa' : 'Inativa'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(unit)}
                    className="p-2 text-gray-400 hover:text-graphite rounded-xl hover:bg-gray-50 transition-colors"
                    title="Editar Filial"
                  >
                    <Edit2 size={15} />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-gray-600 mt-4 border-t border-aesthetic-bege/20 pt-3">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <span>{unit.address}</span>
                  </div>

                  {unit.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400 shrink-0" />
                      <span>{unit.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-aesthetic-bege/20 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectUnitGlobal(unit.id)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-[#FAF6F0] hover:bg-[#F3EFE9] text-[#8C6226] border border-[#EAE3DA]'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 size={14} />
                      Unidade Ativa no Sistema
                    </>
                  ) : (
                    <>
                      <span>Filtrar por esta Unidade</span>
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Criação / Edição de Unidade */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-aesthetic-bege/30 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-aesthetic-bege/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF6F0] flex items-center justify-center text-[#B88746]">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-graphite">
                    {editingUnit ? 'Editar Unidade' : 'Cadastrar Nova Unidade'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Defina o nome da filial, endereço completo e contato operacional
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-graphite mb-1">
                  Nome da Filial / Unidade *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Unidade Jardins, Unidade Moema..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-aesthetic-off-white border-none text-xs text-graphite focus:outline-none focus:ring-1 focus:ring-aesthetic-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-graphite mb-1">
                  Endereço Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rua, número, bairro, cidade - UF"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-aesthetic-off-white border-none text-xs text-graphite focus:outline-none focus:ring-1 focus:ring-aesthetic-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-graphite mb-1">
                  Telefone / WhatsApp da Recepção
                </label>
                <input
                  type="text"
                  placeholder="(11) 98765-4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-aesthetic-off-white border-none text-xs text-graphite focus:outline-none focus:ring-1 focus:ring-aesthetic-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-graphite mb-1">
                  Status Operacional
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-aesthetic-off-white border-none text-xs text-graphite focus:outline-none focus:ring-1 focus:ring-aesthetic-gold"
                >
                  <option value="active">Ativa (Aberta para agendamentos)</option>
                  <option value="inactive">Inativa (Em reforma / Fechada)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-aesthetic-bege/20">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-500 hover:bg-aesthetic-off-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-full bg-graphite hover:bg-black text-white text-xs font-bold tracking-wider shadow-md transition-all cursor-pointer"
                >
                  {editingUnit ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR UNIDADE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
