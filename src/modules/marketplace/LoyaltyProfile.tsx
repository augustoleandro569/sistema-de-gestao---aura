// src/modules/marketplace/LoyaltyProfile.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Settings,
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Lock,
  Award,
  CheckCircle2,
  Building2,
  FileText,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { BookingModal } from '../../components/marketplace/BookingModal';

export interface LoyaltyProfileProps {
  user?: {
    id?: string;
    name?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    cpf?: string;
    birthDate?: string;
  };
  onNavigateToBooking?: () => void;
}

interface UnitFidelityCard {
  unitId: string;
  unitName: string;
  businessId: string;
  stampsCount: number;
  totalRequired: number;
  rewardTitle: string;
  lastVisit: string;
}

interface CareHistoryItem {
  id: string;
  service: string;
  date: string;
  unit: string;
  unitId: string;
  professional: string;
  status: 'concluido' | 'agendado';
  medicalNotes: string;
  protocolRecommendations: string;
}

export const LoyaltyProfile: React.FC<LoyaltyProfileProps> = ({
  user: propUser,
  onNavigateToBooking
}) => {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useAuth();

  // Dados unificados do usuário (Prop ou AuthContext com fallback gracioso)
  const user = useMemo(() => {
    return {
      id: propUser?.id || userProfile?.id || 'client-augusto',
      name: propUser?.name || userProfile?.name || 'Augusto Leandro',
      avatar:
        propUser?.avatar ||
        userProfile?.avatar_url ||
        userProfile?.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      email: propUser?.email || userProfile?.email || 'augustoleandro569@gmail.com',
      whatsapp: propUser?.whatsapp || userProfile?.whatsapp || userProfile?.phone || '(11) 98765-4321',
      cpf: propUser?.cpf || userProfile?.cpf || userProfile?.documentCpf || '389.142.760-91',
      birthDate: propUser?.birthDate || userProfile?.birth_date || userProfile?.birthDate || '18/07/1994',
    };
  }, [propUser, userProfile]);

  // Isolamento de Tenant: Cartões de Fidelidade por Unidade/Clínica
  const unitCards: UnitFidelityCard[] = useMemo(() => {
    return [
      {
        unitId: 'unit-matriz',
        unitName: 'Unidade Jardins (Matriz)',
        businessId: 'biz-aura-matriz',
        stampsCount: 7,
        totalRequired: 10,
        rewardTitle: 'Peeling de Diamante + Revitalização Facial',
        lastVisit: '08/09/2026',
      },
      {
        unitId: 'unit-moema',
        unitName: 'Unidade Moema (Concept)',
        businessId: 'biz-aura-moema',
        stampsCount: 2,
        totalRequired: 10,
        rewardTitle: 'Drenagem Facial com Esferas Criogênicas',
        lastVisit: '14/08/2026',
      },
    ];
  }, []);

  const [selectedCardUnitId, setSelectedCardUnitId] = useState<string>(unitCards[0].unitId);
  const activeCard = unitCards.find((c) => c.unitId === selectedCardUnitId) || unitCards[0];

  // Histórico Técnico Unificado com Prontuário em Modo Seguro (Somente Leitura)
  const careHistory: CareHistoryItem[] = useMemo(() => {
    return [
      {
        id: 'care-1',
        service: 'Limpeza de Pele Profunda + Peeling de Diamante',
        date: '08/09/2026',
        unit: 'Unidade Jardins (Matriz)',
        unitId: 'unit-matriz',
        professional: 'Dra. Camila Vasconcelos',
        status: 'concluido',
        medicalNotes:
          'Extração sebácea realizada sem intercorrências. Aplicação de máscara calmante de camomila e alta frequência por 5 minutos.',
        protocolRecommendations:
          'Utilizar protetor solar FPS 50 a cada 3 horas. Evitar ácidos glicólico e retinóico por 72h.',
      },
      {
        id: 'care-2',
        service: 'Drenagem Linfática Facial com Esferas Criogênicas',
        date: '22/08/2026',
        unit: 'Unidade Jardins (Matriz)',
        unitId: 'unit-matriz',
        professional: 'Mariana Lima',
        status: 'concluido',
        medicalNotes:
          'Massagem descongestionante com foco em drenagem da região periorbital. Melhora visível do tônus e redução de edema.',
        protocolRecommendations:
          'Ingestão hídrica de no mínimo 2.5L/dia para otimizar os canais de eliminação linfática.',
      },
      {
        id: 'care-3',
        service: 'Revitalização Labial Hidragloss & Fototerapia',
        date: '14/08/2026',
        unit: 'Unidade Moema (Concept)',
        unitId: 'unit-moema',
        professional: 'Juliana Costa',
        status: 'concluido',
        medicalNotes:
          'Microesfoliação suave com blend de ácido hialurônico de baixo peso molecular e fotobiomodulação com LED vermelho.',
        protocolRecommendations:
          'Hidratação labial contínua com lip balm reparador durante o sono.',
      },
    ];
  }, []);

  // Modais de Controle
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedCareDetail, setSelectedCareDetail] = useState<CareHistoryItem | null>(null);
  const [bookingClinicId, setBookingClinicId] = useState<string | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  // Formulário de configurações/dados pessoais
  const [contactPhone, setContactPhone] = useState(user.whatsapp);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateUserProfile) {
      updateUserProfile({ phone: contactPhone, whatsapp: contactPhone });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleNavigateBooking = () => {
    if (onNavigateToBooking) {
      onNavigateToBooking();
    } else {
      navigate('/app/mapa');
    }
  };

  const visibleHistory = showAllHistory ? careHistory : careHistory.slice(0, 3);

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-10 animate-in fade-in duration-700 pb-32">
      {/* 1. HEADER DE IDENTIDADE */}
      <header className="flex justify-between items-start">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-aura-rose/20 p-1 border-2 border-white shadow-luminous shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-aura-charcoal font-bold tracking-tight">
              {user.name}
            </h1>
            <p className="text-[10px] sm:text-xs text-aura-rose font-bold uppercase tracking-[0.3em] mt-1">
              Membro Aura Club
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 bg-white rounded-2xl border border-aura-linen text-aura-taupe hover:text-aura-charcoal hover:border-aura-taupe/40 shadow-xs transition-all cursor-pointer"
          title="Configurações e Dados Pessoais"
          aria-label="Abrir configurações de perfil"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* SELETOR DE CLÍNICAS (MULTI-TENANT / ISOLAMENTO DE SELOS) */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-aura-taupe uppercase tracking-widest px-1">
          Suas Clínicas Favoritas (Selos por Loja)
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {unitCards.map((card) => {
            const isSelected = card.unitId === selectedCardUnitId;
            return (
              <button
                key={card.unitId}
                onClick={() => setSelectedCardUnitId(card.unitId)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-aura-charcoal text-white border-aura-charcoal shadow-md'
                    : 'bg-white text-aura-charcoal/70 border-aura-linen hover:border-aura-taupe/40'
                }`}
              >
                <Building2 size={14} className={isSelected ? 'text-aura-rose' : 'text-aura-taupe'} />
                <span>{card.unitName}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-aura-linen text-aura-charcoal'
                  }`}
                >
                  {card.stampsCount}/{card.totalRequired}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CARTÃO FIDELIDADE DINÂMICO 10+1 */}
      <section className="bg-white rounded-[36px] sm:rounded-[48px] p-6 sm:p-10 shadow-luminous border border-aura-linen relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 pointer-events-none">
          <Sparkles className="text-aura-rose/30" size={44} />
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Award size={16} className="text-aura-gold" />
            <h3 className="text-xs font-bold text-aura-charcoal uppercase tracking-widest">
              Status de Fidelidade
            </h3>
          </div>
          <p className="text-xs text-aura-taupe font-medium italic">
            Válido em: <span className="font-semibold text-aura-charcoal">{activeCard.unitName}</span>
          </p>
        </div>

        {/* GRID DE SELOS 10+1 */}
        <div className="grid grid-cols-5 gap-3 sm:gap-4">
          {[...Array(activeCard.totalRequired)].map((_, i) => {
            const isStamped = i < activeCard.stampsCount;
            const isTenth = i === 9;

            return (
              <div
                key={i}
                className={`aspect-square rounded-full flex flex-col items-center justify-center border-2 transition-all duration-700 relative ${
                  isStamped
                    ? 'bg-aura-rose/20 border-aura-rose text-aura-rose shadow-soft-glow scale-100'
                    : isTenth
                    ? 'bg-amber-50/60 border-dashed border-amber-300 text-amber-600'
                    : 'bg-aura-pearl border-aura-linen text-aura-linen'
                }`}
              >
                {isStamped ? (
                  <Sparkles size={18} fill="currentColor" />
                ) : isTenth ? (
                  <Award size={18} className="text-amber-500 animate-pulse" />
                ) : (
                  <span className="text-[10px] font-bold text-aura-taupe/60">{i + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* MENSAGEM DO CARTÃO */}
        <div className="mt-8 p-5 sm:p-6 bg-aura-linen/40 rounded-[28px] text-center border border-white space-y-1.5">
          <p className="text-xs sm:text-sm text-aura-charcoal/80">
            Faltam{' '}
            <span className="font-bold text-aura-charcoal">
              {activeCard.totalRequired - activeCard.stampsCount} atendimentos
            </span>{' '}
            para seu presente ✨
          </p>
          <p className="text-[11px] text-aura-taupe font-medium">
            Recompensa desbloqueada no 10º selo: <strong className="text-aura-charcoal">{activeCard.rewardTitle}</strong>
          </p>
        </div>

        {/* AÇÃO RÁPIDA DE AGENDAMENTO COM O CARTÃO */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setBookingClinicId(activeCard.businessId)}
            className="w-full py-3.5 px-6 rounded-2xl bg-aura-charcoal hover:bg-black text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar size={16} className="text-aura-rose" />
            <span>Agendar e Ganhar Selo em {activeCard.unitName.split(' ')[1]}</span>
          </button>
        </div>
      </section>

      {/* 3. HISTÓRICO TÉCNICO (TIMELINE DE CUIDADOS & PRONTUÁRIO SEGURO) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <h3 className="text-[10px] font-bold text-aura-taupe uppercase tracking-widest">
              Histórico de Cuidados (Somente Leitura)
            </h3>
          </div>
          <button
            onClick={() => setShowAllHistory(!showAllHistory)}
            className="text-[10px] font-bold text-aura-rose uppercase tracking-wider hover:underline cursor-pointer"
          >
            {showAllHistory ? 'Ver menos' : 'Ver tudo'}
          </button>
        </div>

        <div className="space-y-3">
          {visibleHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedCareDetail(item)}
              className="bg-white p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] border border-aura-linen flex justify-between items-center hover:shadow-md hover:border-aura-taupe/30 transition-all cursor-pointer group"
            >
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-2xl bg-aura-pearl flex items-center justify-center text-aura-taupe group-hover:bg-aura-rose/20 group-hover:text-aura-charcoal transition-colors shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-aura-charcoal group-hover:text-aura-taupe transition-colors">
                    {item.service}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {item.date} • {item.unit} • {item.professional}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-aura-linen group-hover:text-aura-charcoal group-hover:translate-x-1 transition-all shrink-0"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4. MODAL DE PRONTUÁRIO / DETALHE DO CUIDADO (BLINDADO) */}
      {selectedCareDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[36px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-aura-linen relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedCareDetail(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-aura-taupe hover:text-aura-charcoal hover:bg-aura-linen transition-colors cursor-pointer"
              aria-label="Fechar prontuário"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Procedimento Concluído
                  </span>
                  <span className="text-[9px] text-gray-400 flex items-center gap-1">
                    <Lock size={10} /> Documento Blindado
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-aura-charcoal mt-1">
                  {selectedCareDetail.service}
                </h3>
              </div>
            </div>

            <div className="p-4 bg-aura-linen/40 rounded-2xl text-xs space-y-2 text-aura-charcoal/80">
              <div className="flex justify-between border-b border-aura-border pb-1.5">
                <span className="text-gray-400">Data do Atendimento:</span>
                <span className="font-semibold">{selectedCareDetail.date}</span>
              </div>
              <div className="flex justify-between border-b border-aura-border pb-1.5">
                <span className="text-gray-400">Unidade Prestadora:</span>
                <span className="font-semibold">{selectedCareDetail.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Especialista Responsável:</span>
                <span className="font-semibold">{selectedCareDetail.professional}</span>
              </div>
            </div>

            {/* Prontuário Técnico e Observações */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-aura-charcoal">
                <FileText size={14} className="text-aura-taupe" />
                <span>Anotações Técnicas da Sessão</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-aura-linen text-xs text-aura-charcoal/90 leading-relaxed font-sans">
                {selectedCareDetail.medicalNotes}
              </div>
            </div>

            {/* Recomendações Pós-Procedimento */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-aura-charcoal">
                <Sparkles size={14} className="text-aura-rose" />
                <span>Orientações de Home Care</span>
              </div>
              <div className="p-4 rounded-2xl bg-aura-rose/10 border border-aura-rose/30 text-xs text-aura-charcoal leading-relaxed font-sans">
                {selectedCareDetail.protocolRecommendations}
              </div>
            </div>

            <p className="text-[10px] text-gray-400 text-center italic">
              Conforme as diretrizes do Conselho de Saúde e LGPD, este prontuário é protegido e mantido em custódia segura pela clínica emissora.
            </p>

            <button
              onClick={() => setSelectedCareDetail(null)}
              className="w-full py-3.5 bg-aura-charcoal hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-2xl transition-all cursor-pointer"
            >
              Fechar Registro
            </button>
          </div>
        </div>
      )}

      {/* 5. MODAL DE CONFIGURAÇÕES E DADOS PESSOAIS */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[36px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-aura-linen relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-aura-taupe hover:text-aura-charcoal hover:bg-aura-linen transition-colors cursor-pointer"
              aria-label="Fechar configurações"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-aura-linen text-aura-charcoal flex items-center justify-center shrink-0">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-aura-charcoal">Dados do Consumidor</h3>
                <p className="text-xs text-aura-taupe">Seu perfil no ecossistema Aura</p>
              </div>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full px-4 py-3 bg-aura-pearl rounded-2xl border border-aura-linen text-sm text-aura-charcoal font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  CPF (Identificador Único)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={user.cpf}
                    disabled
                    className="w-full px-4 py-3 bg-aura-pearl rounded-2xl border border-aura-linen text-sm text-aura-charcoal font-medium cursor-not-allowed"
                  />
                  <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 bg-aura-pearl rounded-2xl border border-aura-linen text-sm text-aura-charcoal font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-aura-charcoal mb-1">
                  WhatsApp / Celular de Contato
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-white rounded-2xl border border-aura-taupe/40 focus:border-aura-charcoal outline-none text-sm text-aura-charcoal font-medium"
                />
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Contato atualizado com sucesso!</span>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="flex-1 py-3 border border-aura-linen text-aura-taupe hover:text-aura-charcoal text-xs font-bold uppercase tracking-wider rounded-2xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-aura-charcoal hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL DE AGENDAMENTO DIRETO */}
      {bookingClinicId && (
        <BookingModal
          businessId={bookingClinicId}
          onClose={() => setBookingClinicId(null)}
          onSuccess={() => {
            setBookingClinicId(null);
          }}
        />
      )}
    </div>
  );
};

export default LoyaltyProfile;
