import React, { useState, useMemo } from 'react';
import { Sparkle, CheckCircle2, Clock, ShieldCheck, X, Trophy, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { dataService } from '../../services/dataService';
import { LoyaltyClub } from '../../modules/marketplace/LoyaltyClub';

interface HistoryItem {
  id: string;
  name: string;
  date: string;
  professional: string;
}

interface InfoFieldProps {
  label: string;
  value?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => {
  return (
    <div className="bg-white/80 p-4 rounded-2xl border border-aesthetic-bege/40 shadow-xs">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold text-graphite mt-1">{value || 'Não informado'}</p>
    </div>
  );
};

export const ProfileView = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'loyalty' | 'data'>('loyalty');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: userProfile?.name || 'Juliana Silveira',
    whatsapp: userProfile?.whatsapp || userProfile?.phone || '(11) 98765-4321',
    email: userProfile?.email || 'juliana.silveira@auraestetica.com.br',
    birth_date: userProfile?.birth_date || userProfile?.birthDate || '1994-07-18',
    cpf: userProfile?.cpf || userProfile?.documentCpf || '389.142.760-91',
  });

  // User details
  const user = useMemo(() => {
    return {
      name: userProfile?.name || 'Juliana Silveira',
      avatar:
        userProfile?.avatar_url ||
        userProfile?.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      whatsapp: userProfile?.whatsapp || userProfile?.phone || '(11) 98765-4321',
      cpf: userProfile?.cpf || userProfile?.documentCpf || '389.142.760-91',
      email: userProfile?.email || 'juliana.silveira@auraestetica.com.br',
      birth_date: userProfile?.birth_date || userProfile?.birthDate || '18/07/1994',
    };
  }, [userProfile]);

  // Dynamic or default stamps count
  const stampsCount = useMemo(() => {
    const clientId = userProfile?.clientId || userProfile?.id || 'cli-1';
    const card = dataService.getLoyaltyCardByClientId(clientId);
    return card?.stampsCount ?? 7;
  }, [userProfile]);

  // Appointment history (from dataService or fallback aesthetic history)
  const history: HistoryItem[] = useMemo(() => {
    const allAppointments = dataService.getAppointments();
    const clientId = userProfile?.clientId || userProfile?.id;
    const clientAppts = allAppointments.filter(
      (a) => (a.clientId === clientId || !clientId) && (a.status === 'finalizado' || (a.status as string) === 'completed')
    );

    if (clientAppts.length > 0) {
      return clientAppts.slice(0, 5).map((a) => ({
        id: a.id,
        name: a.serviceName,
        date: new Date(a.date).toLocaleDateString('pt-BR'),
        professional: a.professionalName,
      }));
    }

    return [
      {
        id: 'h-1',
        name: 'Limpeza de Pele Profunda + Peeling de Diamante',
        date: '08/09/2026',
        professional: 'Dra. Camila Vasconcelos',
      },
      {
        id: 'h-2',
        name: 'Drenagem Linfática Facial com Esferas Criogênicas',
        date: '22/08/2026',
        professional: 'Mariana Lima',
      },
      {
        id: 'h-3',
        name: 'Revitalização Labial Hidragloss & Fototerapia',
        date: '11/08/2026',
        professional: 'Juliana Costa',
      },
    ];
  }, [userProfile]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editForm.name,
      whatsapp: editForm.whatsapp,
      phone: editForm.whatsapp,
      email: editForm.email,
      birth_date: editForm.birth_date,
      birthDate: editForm.birth_date,
      cpf: editForm.cpf,
      documentCpf: editForm.cpf,
    });
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setIsEditModalOpen(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* CABEÇALHO DE BOAS-VINDAS */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-aesthetic-bege/30 pb-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-aesthetic-nude border-2 border-white shadow-lg overflow-hidden shrink-0">
            <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-graphite font-bold">Olá, {user.name}</h1>
            <p className="text-xs text-rose-700 font-bold uppercase tracking-widest mt-0.5">Membro Aura Club</p>
          </div>
        </div>

        {/* SUBTABS DE NAVEGAÇÃO INTERNA */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-aesthetic-bege/40 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('loyalty')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'loyalty'
                ? 'bg-aura-rose text-aura-charcoal shadow-soft-glow'
                : 'text-gray-500 hover:text-graphite'
            }`}
          >
            <Trophy size={14} className={activeTab === 'loyalty' ? 'text-[#C26B54]' : 'text-gray-400'} />
            <span>Aura Club</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'data'
                ? 'bg-aura-rose text-aura-charcoal shadow-soft-glow'
                : 'text-gray-500 hover:text-graphite'
            }`}
          >
            <UserIcon size={14} className={activeTab === 'data' ? 'text-aura-charcoal' : 'text-gray-400'} />
            <span>Dados & Histórico</span>
          </button>
        </div>
      </header>

      {/* CONTEÚDO BASEADO NA ABA ATIVA */}
      {activeTab === 'loyalty' ? (
        <LoyaltyClub stamps={stampsCount} />
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* HISTÓRICO DE SERVIÇOS (TIMELINE) */}
          <section className="space-y-4">
            <h3 className="font-bold text-graphite uppercase text-xs tracking-tighter ml-2">
              Histórico de Procedimentos
            </h3>
            <div className="space-y-3">
              {history.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-5 rounded-2xl border border-aesthetic-bege/10 shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-graphite text-sm">{service.name}</p>
                    <p className="text-[10px] text-gray-400">
                      {service.date} • com {service.professional}
                    </p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full">
                    CONCLUÍDO
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* DADOS CADASTRAIS (EDITÁVEL) */}
          <section className="bg-aesthetic-off-white p-8 rounded-[32px] border border-aesthetic-bege/30">
            <h3 className="font-bold text-graphite uppercase text-xs tracking-widest mb-6">Meus Dados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="WhatsApp" value={user.whatsapp} />
              <InfoField label="CPF" value={user.cpf} />
              <InfoField label="E-mail" value={user.email} />
              <InfoField label="Data de Nascimento" value={user.birth_date} />
            </div>
            <button
              type="button"
              onClick={() => {
                setEditForm({
                  name: user.name,
                  whatsapp: user.whatsapp,
                  email: user.email,
                  birth_date: user.birth_date,
                  cpf: user.cpf,
                });
                setIsEditModalOpen(true);
              }}
              className="mt-8 text-xs font-bold text-rose-700 border-b border-rose-700 pb-1 cursor-pointer hover:text-rose-800 transition-colors"
            >
              SOLICITAR ALTERAÇÃO DE DADOS
            </button>
          </section>
        </div>
      )}

      {/* MODAL DE ALTERAÇÃO DE DADOS */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-[28px] p-6 sm:p-8 shadow-2xl border border-[#EDE7DF] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-graphite">Solicitar Alteração de Dados</h3>
                <p className="text-xs text-[#8A7D73]">
                  Atualize suas informações para manter seu cadastro Aura Club em dia.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FAF7F2] text-[#8A7D73] hover:text-[#2D2725] flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {requestSent ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in zoom-in-95">
                <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-800">Dados Atualizados com Sucesso!</h4>
                <p className="text-xs text-emerald-700">
                  Suas alterações foram sincronizadas com o prontuário da clínica.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-graphite mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1">WhatsApp</label>
                    <input
                      type="text"
                      value={editForm.whatsapp}
                      onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1">CPF</label>
                    <input
                      type="text"
                      value={editForm.cpf}
                      onChange={(e) => setEditForm({ ...editForm, cpf: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1">E-mail</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-graphite mb-1">Data de Nascimento</label>
                    <input
                      type="text"
                      value={editForm.birth_date}
                      onChange={(e) => setEditForm({ ...editForm, birth_date: e.target.value })}
                      placeholder="DD/MM/AAAA"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-aesthetic-bege text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#8A7D73] hover:bg-[#FAF7F2] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#2D2725] text-white hover:bg-[#423936] transition-colors"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
