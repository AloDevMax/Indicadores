import React from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';

export type ConfirmVariant = 'danger' | 'default';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Generic "are you sure?" confirmation modal. Rendered once by ConfirmProvider
 * (see `useConfirm`) and driven by whatever action last called `confirm(...)`.
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-sm rounded-2xl p-10 shadow-2xl animate-in zoom-in-95 text-center">
        <div
          className={`w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
            isDanger ? 'bg-rose-50 text-rose-600' : 'bg-brand-primary-light text-brand-primary'
          }`}
        >
          {isDanger ? <AlertTriangle size={26} /> : <HelpCircle size={26} />}
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">{title}</h2>
        <p className="text-slate-500 text-sm mb-8">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200 transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-4 font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl transition-all text-white ${
              isDanger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-brand-primary hover:bg-brand-primary-dark'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
