
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Profile } from '../types';

interface BottomNavProps {
  user: Profile;
  adminViewMode: 'management' | 'personal';
  onOpenSolicitation: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ user, adminViewMode, onOpenSolicitation }) => {
  const isAdmin = user.role === 'admin' ?? user.role === 'developer';

  const showUserMenu = !isAdmin ?? (isAdmin && adminViewMode === 'personal');

  // For Admin: Overview, Submissions, Ranking
  // For User: Progress, Solicitar (Floating), Ranking
  
  if (!showUserMenu) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 h-16 z-[70] md:hidden flex items-center justify-around px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {[
          { to: '/admin', label: 'Comando', icon: '📊' },
          { to: '/admin/submissions', label: 'Pedidos', icon: '📨' },
          { to: '/ranking', label: 'Ranking', icon: '🥇' },
        ].map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin'}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 transition-all duration-300 flex-1
              ${isActive ? 'text-indigo-600' : 'text-slate-400'}
            `}
          >
            <span className="text-xl leading-none">{link.icon}</span>
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
          ${isActive ? 'text-indigo-600' : 'text-slate-400'}
        `}
      >
        <span className="text-xl leading-none">📈</span>
        <span className="text-[9px] font-black uppercase tracking-widest">Progresso</span>
      </NavLink>

      {/* Prominent Floating Button Replacement for "Menu" */}
      <div className="relative -top-5 flex-1 flex justify-center">
        <button 
          onClick={onOpenSolicitation}
          className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-300 flex items-center justify-center text-2xl active:scale-90 transition-all border-4 border-white"
        >
          ✨
        </button>
        <span className="absolute bottom-[-1.5rem] text-[9px] font-black uppercase tracking-widest text-indigo-600">Solicitar</span>
      </div>

      {/* Ranking Link */}
      <NavLink
        to="/ranking"
        className={({ isActive }) => `
          flex flex-col items-center gap-1 transition-all duration-300 flex-1
          ${isActive ? 'text-indigo-600' : 'text-slate-400'}
        `}
      >
        <span className="text-xl leading-none">🥇</span>
        <span className="text-[9px] font-black uppercase tracking-widest">Ranking</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;
