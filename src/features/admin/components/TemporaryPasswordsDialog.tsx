import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { IssuedPassword } from '@/shared/types';

interface TemporaryPasswordsDialogProps {
  passwords: IssuedPassword[];
  onClose: () => void;
}

/**
 * Shows the one-time passwords the server generated for accounts the admin
 * just created. The server never returns them again, so the admin must pass
 * them on to each colaborador before closing.
 */
const TemporaryPasswordsDialog: React.FC<TemporaryPasswordsDialogProps> = ({ passwords, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);

  if (passwords.length === 0) return null;

  const handleCopyAll = async () => {
    const text = passwords.map(({ email, temporary_password }) => `${email}: ${temporary_password}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
    } catch {
      // Sem acesso à área de transferência: as senhas continuam visíveis para cópia manual.
      setIsCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="temporary-passwords-title"
        className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in zoom-in-95"
      >
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-brand-primary-light text-brand-primary">
          <KeyRound size={26} />
        </div>
        <h2 id="temporary-passwords-title" className="text-xl font-black text-slate-900 mb-2 tracking-tight text-center">
          Senhas temporárias
        </h2>
        <p className="text-slate-500 text-sm mb-6 text-center">
          Repasse cada senha ao colaborador. Ela vale para o primeiro acesso, quando a troca é obrigatória.
          As senhas não serão exibidas novamente.
        </p>

        <ul className="space-y-2 max-h-64 overflow-y-auto mb-6">
          {passwords.map(({ email, temporary_password }) => (
            <li key={email} className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-slate-600 truncate">{email}</span>
              <code className="text-sm font-black text-slate-900 tracking-wider select-all">{temporary_password}</code>
            </li>
          ))}
        </ul>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleCopyAll}
            className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200 transition-all"
          >
            {isCopied ? 'Copiado!' : 'Copiar tudo'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl transition-all text-white bg-brand-primary hover:bg-brand-primary-dark"
          >
            Já anotei
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemporaryPasswordsDialog;
