
import React from 'react';
import { Badge } from '../types';

interface BadgeCardProps {
  badge: Badge;
  unlocked?: boolean;
  date?: string;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, unlocked = false, date }) => {
  return (
    <div className={`
      relative group overflow-hidden rounded-3xl p-6 transition-all duration-300
      ${unlocked 
        ? 'bg-white shadow-xl shadow-indigo-100 border-2 border-indigo-100 scale-100' 
        : 'bg-slate-50 border-2 border-dashed border-slate-200 opacity-60 grayscale scale-95'}
    `}>
      <div className={`
        w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-3xl
        ${unlocked ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-200 text-slate-400'}
      `}>
        {badge.icon_name || '✨'}
      </div>
      
      <h3 className={`font-bold text-lg mb-1 ${unlocked ? 'text-slate-900' : 'text-slate-500'}`}>
        {badge.name}
      </h3>
      <p className="text-sm text-slate-500 mb-4 leading-relaxed">
        {badge.description}
      </p>
      
      {unlocked && (
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">
            Desbloqueado
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
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-600/5 rounded-full blur-2xl group-hover:bg-indigo-600/10 transition-all"></div>
      )}
    </div>
  );
};

export default BadgeCard;
