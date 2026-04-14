import React from 'react';
import { Badge, BadgeTone } from '../types';
import { BADGE_TONE_LABELS } from '../utils/badgeMetrics';

interface BadgeCardProps {
  badge: Badge;
  unlocked?: boolean;
  date?: string;
  tone?: BadgeTone;
}

const TONE_STYLES: Record<BadgeTone, { card: string; icon: string; chip: string }> = {
  bronze: {
    card: 'border-[#b87932] shadow-[0_20px_60px_rgba(184,121,50,0.18)]',
    icon: 'bg-[#b87932] text-white',
    chip: 'bg-[#f4e2ce] text-[#8e5b22]',
  },
  silver: {
    card: 'border-slate-400 shadow-[0_20px_60px_rgba(148,163,184,0.18)]',
    icon: 'bg-slate-400 text-white',
    chip: 'bg-slate-100 text-slate-600',
  },
  gold: {
    card: 'border-amber-400 shadow-[0_20px_60px_rgba(251,191,36,0.2)]',
    icon: 'bg-amber-400 text-slate-900',
    chip: 'bg-amber-100 text-amber-700',
  },
  loss_1: {
    card: 'border-rose-300 bg-rose-50',
    icon: 'bg-rose-400 text-white',
    chip: 'bg-rose-100 text-rose-700',
  },
  loss_2: {
    card: 'border-rose-500 bg-rose-100',
    icon: 'bg-rose-600 text-white',
    chip: 'bg-rose-200 text-rose-800',
  },
};

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, unlocked = false, date, tone = 'bronze' }) => {
  // Proteção contra badge undefined
  if (!badge) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
        <div className="w-16 h-16 rounded-2xl mb-4 bg-slate-200 animate-pulse"></div>
        <div className="h-4 bg-slate-200 rounded mb-2 animate-pulse"></div>
        <div className="h-3 bg-slate-200 rounded animate-pulse"></div>
      </div>
    );
  }
  const toneStyle = TONE_STYLES[tone];
  const hasCustomImage = Boolean(badge.image_url);

  return (
    <div className={`
      relative group overflow-hidden rounded-3xl p-6 transition-all duration-300
      ${unlocked
        ? `bg-white shadow-xl border-2 scale-100 ${toneStyle.card}`
        : 'bg-slate-50 border-2 border-dashed border-slate-200 opacity-60 grayscale scale-95'}
    `}>
      <div className={`
        w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-3xl overflow-hidden
        ${unlocked ? `${toneStyle.icon} ${!hasCustomImage ? 'animate-pulse' : ''}` : 'bg-slate-200 text-slate-400'}
      `}>
        {hasCustomImage ? (
          <img
            src={badge.image_url}
            alt={badge.name}
            className="w-full h-full object-contain p-2 bg-white"
          />
        ) : (
          badge.icon_name || '✨'
        )}
      </div>

      <h3 className={`font-bold text-lg mb-1 ${unlocked ? 'text-slate-900' : 'text-slate-500'}`}>
        {badge?.name || 'Badge sem nome'}
      </h3>
      <p className="text-sm text-slate-500 mb-4 leading-relaxed">
        {badge.description}
      </p>

      {unlocked && (
        <div className="flex items-center justify-between mt-auto">
          <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${toneStyle.chip}`}>
            {BADGE_TONE_LABELS[tone]}
          </span>
          {date && <span className="text-[10px] text-slate-400">{new Date(date).toLocaleDateString('pt-BR')}</span>}
        </div>
      )}

      {!unlocked && (
        <div className="mt-auto">
          <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-1 rounded-full">
            Bloqueado
          </span>
        </div>
      )}

      {unlocked && (
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-slate-900/5 rounded-full blur-2xl group-hover:bg-slate-900/10 transition-all"></div>
      )}
    </div>
  );
};

export default BadgeCard;
