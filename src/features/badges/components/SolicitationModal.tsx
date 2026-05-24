import React, { useMemo, useState } from 'react';
import { Badge, Profile, UserBadge } from '@/shared/types';
import { toast } from '@/shared/lib/toast';

interface SolicitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Profile;
  allBadges: Badge[];
  userBadges: UserBadge[];
  onAddSubmission: (_badgeId: string, _description: string) => Promise<void>;
}

const SolicitationModal: React.FC<SolicitationModalProps> = ({
  isOpen,
  onClose,
  user,
  allBadges,
  userBadges,
  onAddSubmission,
}) => {
  const [selectedBadgeId, setSelectedBadgeId] = useState('');
  const [proofDescription, setProofDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const unlockedIds = useMemo(
    () => userBadges.filter((ub) => ub.user_id === user.id).map((ub) => ub.badge_id),
    [userBadges, user.id],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBadgeId || !proofDescription) {
      toast.error('Por favor, selecione um selo e descreva sua conquista.');
      return;
    }

    try {
      setSubmitting(true);
      await onAddSubmission(selectedBadgeId, proofDescription);
      onClose();
      setSelectedBadgeId('');
      setProofDescription('');
      toast.success('Solicitação enviada com sucesso! Sua solicitação será revisada pelo Gestor.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Falha ao enviar solicitação.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-t-2xl md:rounded-2xl p-8 md:p-10 shadow-2xl animate-in slide-in-from-bottom md:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-white pb-2 z-10">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Solicitar Selo</h2>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors text-4xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">1. Qual selo deseja solicitar?</label>
            <select
              value={selectedBadgeId}
              onChange={(e) => setSelectedBadgeId(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand-red transition-all appearance-none"
              required
            >
              <option value="">Selecionar selo...</option>
              {allBadges.filter((badge) => !unlockedIds.includes(badge.id)).map((badge) => (
                <option key={badge.id} value={badge.id}>{badge?.name || 'Badge sem nome'}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">2. Descreva como conseguiu</label>
            <textarea
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 min-h-[120px] outline-none focus:ring-2 focus:ring-brand-red transition-all"
              placeholder="Detalhe sua ação de qualidade aqui..."
              required
            />
          </div>

          <button type="submit" disabled={submitting} className="w-full bg-brand-red text-white font-black py-5 rounded-2xl hover:bg-brand-red-dark shadow-2xl shadow-brand-red-light transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs disabled:opacity-60">
            {submitting ? 'Enviando...' : 'Enviar Solicitação'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SolicitationModal;
