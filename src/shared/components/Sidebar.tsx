import React from 'react';
import { NavLink } from 'react-router-dom';
import { TrendingUp, Shield, Trophy, BarChart3, Award, Inbox, Users, User } from 'lucide-react';
import { Profile, ProductiveUnit } from '@/shared/types';

interface SidebarProps {
  user: Profile;
  isOpen: boolean;
  onClose: () => void;
  adminViewMode?: 'management' | 'personal';
  setAdminViewMode?: (_mode: 'management' | 'personal') => void;
  productiveUnits?: ProductiveUnit[];
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  isOpen,
  onClose,
  adminViewMode = 'management',
  setAdminViewMode,
}) => {
  if (!user) return null;

  const isAdmin = ['admin', 'developer', 'supervisor'].includes(user.role);
  const isDeveloper = user.role === 'developer';
  const isSupervisor = user.role === 'supervisor';
  const showUserMenu = !isAdmin || adminViewMode === 'personal';

  const userLinks = [
    { to: '/dashboard', label: 'Meu Progresso', icon: TrendingUp },
    { to: '/badges', label: 'Meus Selos', icon: Shield },
    { to: '/ranking', label: user.role === 'developer' ? 'Ranking Global' : 'Ranking da Empresa', icon: Trophy },
  ];

  const rankingLabel = isDeveloper ? 'Ranking Global' : isSupervisor ? 'Ranking da Unidade' : 'Ranking da Empresa';
  const adminLinks = [
    { to: '/admin', label: 'Visão Geral', icon: BarChart3 },
    { to: '/ranking', label: rankingLabel, icon: Trophy },
    { to: '/admin/award', label: 'Premiar Selos', icon: Award },
    { to: '/admin/submissions', label: 'Solicitações', icon: Inbox },
    { to: '/admin/users', label: 'Colaboradores', icon: Users },
    ...(isDeveloper ? [{ to: '/admin/badges', label: 'Biblioteca', icon: Shield }] : []),
  ];

  const links = showUserMenu ? userLinks : adminLinks;
  const activeClass = 'bg-brand-primary text-white shadow-lg shadow-brand-primary-light';
  const inactiveClass = 'text-slate-500 hover:bg-slate-100 hover:text-slate-900';

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed left-0 top-0 bottom-0 md:top-16 w-64 bg-white border-r border-slate-100 z-[100] transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-6 overflow-y-auto">
          <div className="md:hidden flex items-center justify-between mb-8">
            <img src="/logo-horizontal.jpeg" alt="LabVW" className="h-8 w-auto object-contain" />
            <button onClick={onClose} className="text-slate-300 hover:text-slate-900 text-2xl">&times;</button>
          </div>

          {isAdmin && setAdminViewMode && (
            <div className="mb-8 p-1.5 bg-slate-100 rounded-2xl flex gap-1 shadow-inner">
              <button
                onClick={() => setAdminViewMode('management')}
                title="Gestão Operacional"
                className={`flex-1 flex items-center justify-center py-2.5 rounded-xl transition-all ${adminViewMode === 'management' ? 'bg-white text-brand-primary shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <BarChart3 size={20} strokeWidth={2} />
              </button>
              <button
                onClick={() => setAdminViewMode('personal')}
                title="Painel Pessoal"
                className={`flex-1 flex items-center justify-center py-2.5 rounded-xl transition-all ${adminViewMode === 'personal' ? 'bg-white text-brand-primary shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <User size={20} strokeWidth={2} />
              </button>
            </div>
          )}

          <div className="mb-4 px-4">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              {showUserMenu ? 'Menu do Colaborador' : 'Gestão Operacional'}
            </span>
          </div>

          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin' || link.to === '/dashboard'}
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all
                  ${isActive ? activeClass : inactiveClass}
                `}
              >
                <link.icon size={20} strokeWidth={2} />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
