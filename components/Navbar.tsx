
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Profile, UserBadge } from '../types';
import { getUserMonthlyBadgeMetrics } from '../utils/badgeMetrics';

interface NavbarProps {
  user: Profile;
  userBadges: UserBadge[];
  onLogout: () => void;
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, userBadges, onLogout, onToggleSidebar }) => {
  const navigate = useNavigate();
  const isAdmin = user.role === 'admin' ?? user.role === 'developer';
  const monthlyMetrics = getUserMonthlyBadgeMetrics(user.id, userBadges);
  const homeRoute = isAdmin ? '/admin' : '/dashboard';

  return (
    <nav className={`bg-white border-b h-16 sticky top-0 z-[60] flex items-center transition-colors duration-300 ${isAdmin ? 'border-indigo-100' : 'border-slate-200'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-slate-50 text-slate-600 md:hidden hover:bg-slate-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          
          <Link to={homeRoute} className="flex items-center gap-2 group">
            <span className={`text-xl font-black tracking-tighter transition-colors ${isAdmin ? 'text-indigo-600' : 'text-slate-800'}`}>
              LabQuest
            </span>
            {isAdmin && (
              <span className="bg-indigo-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest shadow-sm">
                Admin
              </span>
            )}
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-black text-slate-900 leading-none">{user.full_name}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {isAdmin ? 'Gestor' : `Saldo do mes ${monthlyMetrics.monthlyScore}`}
            </span>
          </div>
          <div className="h-8 w-[1px] bg-slate-100 mx-1"></div>
          <button 
            onClick={() => { onLogout(); navigate('/'); }}
            className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
            title="Sair da Jornada"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
