
import React from 'react';
import { NavLink } from 'react-router-dom';
import { TrendingUp, Inbox, Trophy, Plus, BarChart3 } from 'lucide-react';
import { Profile } from '@/shared/types';

interface BottomNavProps {
  user: Profile;
  adminViewMode: 'management' | 'personal';
  onOpenSolicitation: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ user, adminViewMode, onOpenSolicitation }) => {
  const isAdmin = ['admin', 'developer', 'supervisor'].includes(user.role);

  const showUserMenu = !isAdmin || (isAdmin && adminViewMode === 'personal');

  // For Admin: Overview, Submissions, Ranking
  // For User: Progress, Solicitar (Floating), Ranking
  
  if (!showUserMenu) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 h-16 z-[70] md:hidden flex items-center justify-around px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {[
          { to: '/admin', label: 'Comando', icon: BarChart3 },
          { to: '/admin/submissions', label: 'Pedidos', icon: Inbox },
          { to: '/ranking', label: 'Ranking', icon: Trophy },
        ].map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin'}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 transition-all duration-300 flex-1
              ${isActive ? 'text-brand-red' : 'text-slate-400'}
            `}
          >
            <link.icon size={20} strokeWidth={2} />
            <span className="text-[9px] font-black uppercase tracking-widest">{link.label}</span>
          </NavLink>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 h-16 z-[70] md:hidden flex items-center justify-around px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {/* Progresso Link */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) => `
          flex flex-col items-center gap-1 transition-all duration-300 flex-1
          ${isActive ? 'text-brand-red' : 'text-slate-400'}
        `}
      >
        <TrendingUp size={20} strokeWidth={2} />
        <span className="text-[9px] font-black uppercase tracking-widest">Progresso</span>
      </NavLink>

      {/* Prominent Floating Button Replacement for "Menu" */}
      <div className="relative -top-5 flex-1 flex justify-center">
        <button
          onClick={onOpenSolicitation}
          className="w-14 h-14 bg-brand-red text-white rounded-xl shadow-2xl flex items-center justify-center active:scale-90 transition-all border-4 border-white"
        >
          <Plus size={24} />
        </button>
        <span className="absolute bottom-[-1.5rem] text-[9px] font-black uppercase tracking-widest text-brand-red">Solicitar</span>
      </div>

      {/* Ranking Link */}
      <NavLink
        to="/ranking"
        className={({ isActive }) => `
          flex flex-col items-center gap-1 transition-all duration-300 flex-1
          ${isActive ? 'text-brand-red' : 'text-slate-400'}
        `}
      >
        <Trophy size={20} strokeWidth={2} />
        <span className="text-[9px] font-black uppercase tracking-widest">Ranking</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;
