import React from 'react';
import {
  UserCheck,
  Star,
  Clock,
  Percent,
  Calendar,
  Phone,
  Mail,
  Award
} from 'lucide-react';
import { dataService } from '../../services/dataService';

interface ProfessionalsViewProps {
  onOpenNewAppointment?: () => void;
}

export const ProfessionalsView: React.FC<ProfessionalsViewProps> = ({ onOpenNewAppointment }) => {
  const professionals = dataService.getProfessionals();

  return (
    <div id="professionals-view" className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EDE7DF] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D2725] text-[#F3E7DC] flex items-center justify-center">
            <UserCheck size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2D2725]">
              Equipe & Profissionais
            </h1>
            <p className="text-xs text-[#8F8278]">
              Controle de comissões, horários de trabalho, especialidades e desempenho
            </p>
          </div>
        </div>
      </div>

      {/* Professionals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {professionals.map((prof) => (
          <div
            key={prof.id}
            className="bg-white rounded-3xl p-6 border border-[#EDE7DF] shadow-xs hover:border-[#D0C2B4] transition-all space-y-4"
          >
            {/* Top row with photo and status */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={prof.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'}
                  alt={prof.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#EAE2D8]"
                />
                <div>
                  <h3 className="text-base font-bold text-[#2D2725] font-display">{prof.name}</h3>
                  <span className="text-xs text-[#8F8278] block">{prof.specialty}</span>
                  <div className="flex items-center gap-1 text-amber-500 mt-1 text-xs font-bold">
                    <Star size={13} className="fill-amber-500" />
                    <span>{prof.averageRating}</span>
                    <span className="text-[#8F8278] font-normal text-[11px]">(5 estrelas)</span>
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Ativo
              </span>
            </div>

            {/* Metrics pills */}
            <div className="grid grid-cols-2 gap-2.5 py-3 px-3 bg-[#FAF8F5] rounded-2xl border border-[#EBE4DC] text-xs">
              <div>
                <span className="text-[10px] text-[#8F8278] block">Comissão Base</span>
                <span className="font-bold text-[#2D2725]">{prof.commissionPercentage}% por serviço</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8F8278] block">Horário Trabalho</span>
                <span className="font-bold text-[#2D2725]">08:00 às 19:00</span>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-1 text-xs text-[#7A6E65]">
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-[#8F8278]" />
                <span>{prof.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-[#8F8278]" />
                <span className="truncate">{prof.email}</span>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2 border-t border-[#F4EFEA]">
              <button
                type="button"
                onClick={onOpenNewAppointment}
                className="w-full py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EDE5] border border-[#E0D7CC] text-xs font-semibold text-[#2D2725] transition-colors"
              >
                Agendar com {prof.name.split(' ')[0]}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
