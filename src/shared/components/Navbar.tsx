import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Profile, UserBadge } from '@/shared/types';
import { getUserMonthlyBadgeMetrics } from '@/features/badges/badgeMetrics';

interface NavbarProps {
  user: Profile;
  userBadges: UserBadge[];
  onLogout: () => void;
  onToggleSidebar: () => void;
}

const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

const Navbar: React.FC<NavbarProps> = ({ user, userBadges, onLogout, onToggleSidebar }) => {
  const navigate = useNavigate();
  const isAdmin = ['admin', 'developer', 'supervisor'].includes(user.role);
  const isSupervisor = user.role === 'supervisor';
  const isDeveloper = user.role === 'developer';
  const monthlyMetrics = getUserMonthlyBadgeMetrics(user.id, userBadges);
  const homeRoute = isAdmin ? '/admin' : '/dashboard';

  const rolePill = isDeveloper
    ? { label: 'Dev', bg: 'bg-violet-600' }
    : isSupervisor
      ? { label: 'Supervisor', bg: 'bg-emerald-600' }
      : isAdmin
        ? { label: 'Admin', bg: 'bg-indigo-600' }
        : null;

  const roleSubtitle = isDeveloper
    ? 'Desenvolvedor'
    : isSupervisor
      ? 'Supervisor de Unidade'
      : isAdmin
        ? 'Gestor'
        : `+${monthlyMetrics.monthlyScore} pts este mês`;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 sticky top-0 z-[60] flex items-center shadow-sm">
      <div className="w-full px-4 md:px-6 flex items-center justify-between gap-4">

        {/* Esquerda: hamburguer + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <Link to={homeRoute} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <span className="text-white text-xs font-black tracking-tighter">LQ</span>
            </div>
            <span className="text-base font-black text-slate-900 tracking-tight hidden sm:block">
              LabQuest
            </span>
            {rolePill && (
              <span className={`${rolePill.bg} text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest hidden sm:inline`}>
                {rolePill.label}
              </span>
            )}
          </Link>
        </div>

        {/* Direita: usuário + logout */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-100">
            {/* Avatar com iniciais */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm ${rolePill?.bg ?? 'bg-slate-400'}`}>
              {getInitials(user.full_name)}
            </div>

            {/* Nome e subtítulo */}
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-xs font-black text-slate-900">{user.full_name.split(' ')[0]}</span>
              <span className="text-[10px] font-semibold text-slate-400 mt-0.5">{roleSubtitle}</span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => { onLogout(); navigate('/'); }}
            className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Sair"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
