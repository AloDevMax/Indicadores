
import React, { useState, useRef, useMemo } from 'react';
import { Profile, Badge, BadgeSubmission, UserBadge } from '../types';

interface SolicitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Profile;
  allBadges: Badge[];
  userBadges: UserBadge[];
  onAddSubmission: (_submission: BadgeSubmission) => void;
}

const SolicitationModal: React.FC<SolicitationModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  allBadges, 
  userBadges,
  onAddSubmission
}) => {
  const [selectedBadgeId, setSelectedBadgeId] = useState('');
  const [proofDescription, setProofDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const unlockedIds = useMemo(() => 
    userBadges.filter(ub => ub.user_id === user.id).map(ub => ub.badge_id), 
    [userBadges, user.id]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBadgeId || !proofDescription) {
      alert('Por favor, selecione um selo e descreva sua conquista.');
      return;
    }

    const badge = allBadges.find(b => b.id === selectedBadgeId);
    
    const newSubmission: BadgeSubmission = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: user.id,
      badge_id: selectedBadgeId,
      description: proofDescription,
      status: 'pending',
      submitted_at: new Date().toISOString(),
      user_name: user.full_name,
      badge_name: badge?.name || 'Conquista desconhecida'
    };

    onAddSubmission(newSubmission);
    onClose();
    setSelectedBadgeId('');
    setProofDescription('');
    setSelectedFile(null);
    alert('Solicitação enviada com sucesso! Sua conquista será revisada pelo Comandante.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-t-[32px] md:rounded-[40px] p-8 md:p-10 shadow-2xl animate-in slide-in-from-bottom md:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-white pb-2 z-10">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Solicitar Selo</h2>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors text-4xl leading-none">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 pb-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">1. Qual selo você conquistou?</label>
            <select 
              value={selectedBadgeId}
              onChange={(e) => setSelectedBadgeId(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-600 transition-all appearance-none"
              required
            >
              <option value="">Selecionar conquista...</option>
              {allBadges.filter(b => !unlockedIds.includes(b.id)).map(badge => (
                <option key={badge.id} value={badge.id}>{badge.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">2. Descreva como conseguiu</label>
            <textarea 
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 min-h-[120px] outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
              placeholder="Detalhe sua ação de qualidade aqui..."
              required
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">3. Anexe uma evidência (opcional)</label>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="proof-upload-global" />
            <label htmlFor="proof-upload-global" className="flex items-center gap-3 p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-600 transition-all group">
              <span className="text-2xl group-hover:scale-110 transition-transform">📂</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                {selectedFile ? selectedFile.name : 'Carregar foto ou documento'}
              </span>
            </label>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs">
            Enviar Solicitação
          </button>
        </form>
      </div>
    </div>
  );
};

export default SolicitationModal;
