import React, { useState } from 'react';
import { Shield } from 'lucide-react';

export interface CompleteProfileFormData {
  fullName: string;
  cpf: string;
  whatsapp: string;
}

export interface CompleteProfileFormProps {
  fullName?: string;
  cpf?: string;
  whatsapp?: string;
  onFullNameChange?: (val: string) => void;
  onCpfChange?: (val: string) => void;
  onWhatsappChange?: (val: string) => void;
  onChange?: (data: CompleteProfileFormData) => void;
  disabled?: boolean;
  className?: string;
}

export const CompleteProfileForm: React.FC<CompleteProfileFormProps> = ({
  fullName: controlledFullName,
  cpf: controlledCpf,
  whatsapp: controlledWhatsapp,
  onFullNameChange,
  onCpfChange,
  onWhatsappChange,
  onChange,
  disabled = false,
  className = '',
}) => {
  // Local state for uncontrolled or mixed usage
  const [localFullName, setLocalFullName] = useState('');
  const [localCpf, setLocalCpf] = useState('');
  const [localWhatsapp, setLocalWhatsapp] = useState('');

  const fullNameValue = controlledFullName !== undefined ? controlledFullName : localFullName;
  const cpfValue = controlledCpf !== undefined ? controlledCpf : localCpf;
  const whatsappValue = controlledWhatsapp !== undefined ? controlledWhatsapp : localWhatsapp;

  // Mask CPF
  const handleCpfInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 9) {
      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (v.length > 6) {
      v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (v.length > 3) {
      v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    if (onCpfChange) {
      onCpfChange(v);
    } else {
      setLocalCpf(v);
    }

    if (onChange) {
      onChange({
        fullName: fullNameValue,
        cpf: v,
        whatsapp: whatsappValue,
      });
    }
  };

  // Mask WhatsApp / Phone
  const handleWhatsappInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (v.length > 5) {
      v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    }

    if (onWhatsappChange) {
      onWhatsappChange(v);
    } else {
      setLocalWhatsapp(v);
    }

    if (onChange) {
      onChange({
        fullName: fullNameValue,
        cpf: cpfValue,
        whatsapp: v,
      });
    }
  };

  const handleFullNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (onFullNameChange) {
      onFullNameChange(v);
    } else {
      setLocalFullName(v);
    }

    if (onChange) {
      onChange({
        fullName: v,
        cpf: cpfValue,
        whatsapp: whatsappValue,
      });
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Nome Completo</label>
          <input
            type="text"
            required
            disabled={disabled}
            value={fullNameValue}
            onChange={handleFullNameInput}
            className="w-full p-4 rounded-2xl bg-aesthetic-off-white border-none text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-aesthetic-gold/40 transition-all placeholder:text-gray-400"
            placeholder="Ex: Ana Clara Silva"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">CPF</label>
          <input
            type="text"
            required
            disabled={disabled}
            value={cpfValue}
            onChange={handleCpfInput}
            maxLength={14}
            className="w-full p-4 rounded-2xl bg-aesthetic-off-white border-none text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-aesthetic-gold/40 transition-all placeholder:text-gray-400"
            placeholder="000.000.000-00"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase">WhatsApp para Contato</label>
        <input
          type="text"
          required
          disabled={disabled}
          value={whatsappValue}
          onChange={handleWhatsappInput}
          maxLength={15}
          className="w-full p-4 rounded-2xl bg-aesthetic-off-white border-none text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-aesthetic-gold/40 transition-all placeholder:text-gray-400"
          placeholder="(00) 00000-0000"
        />
      </div>

      <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100 flex gap-3 items-center">
        <Shield className="text-emerald-600 shrink-0" size={20} />
        <p className="text-[10px] text-emerald-700 leading-tight">
          Seus dados estão protegidos conforme as normas da LGPD e serão utilizados apenas para fins de agendamento e segurança na clínica.
        </p>
      </div>
    </div>
  );
};

export default CompleteProfileForm;
