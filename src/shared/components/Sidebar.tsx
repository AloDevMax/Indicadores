import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Profile, UserBadge, Company, ProductiveUnit } from '@/shared/types';
import { getUserMonthlyBadgeMetrics } from '@/features/badges/badgeMetrics';

interface SidebarProps {
  user: Profile;
  userBadges: UserBadge[];
  isOpen: boolean;
  onClose: () => void;
  adminViewMode?: 'management' | 'personal';
  setAdminViewMode?: (_mode: 'management' | 'personal') => void;
  companies?: Company[];
  productiveUnits?: ProductiveUnit[];
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  userBadges,
  isOpen,
  onClose,
  adminViewMode = 'management',
  setAdminViewMode,
  companies = [],
  productiveUnits = []
}) => {
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  
  if (!user) return null;

  const isAdmin = ['admin', 'developer', 'supervisor'].includes(user.role);
  const isDeveloper = user.role === 'developer';
  const isSupervisor = user.role === 'supervisor';
  const monthlyMetrics = getUserMonthlyBadgeMetrics(user.id, userBadges);
  const showUserMenu = !isAdmin || adminViewMode === 'personal';

  const toggleExpandCompany = (companyId: string) => {
    const newExpanded = new Set(expandedCompanies);
    if (newExpanded.has(companyId)) {
      newExpanded.delete(companyId);
    } else {
      newExpanded.add(companyId);
    }
    setExpandedCompanies(newExpanded);
  };
  
  const getCompanyUnits = (companyId: string) => {
    return productiveUnits.filter(u => u.company_id === companyId);
  };

  const userLinks = [
    { to: '/dashboard', label: 'Meu Progresso', icon: '📈' },
    { to: '/badges', label: 'Meus Selos', icon: '🛡️' },
    { to: '/ranking', label: user.role === 'developer' ? 'Ranking Global' : 'Ranking da Empresa', icon: '🥇' },
  ];

  const rankingLabel = isDeveloper ? 'Ranking Global' : isSupervisor ? 'Ranking da Unidade' : 'Ranking da Empresa';
  const adminLinks = [
    { to: '/admin', label: 'Visão Geral', icon: '📊' },
    { to: '/ranking', label: rankingLabel, icon: '🥇' },
    { to: '/admin/award', label: 'Premiar Selos', icon: '🏆' },
    { to: '/admin/submissions', label: 'Solicitações', icon: '📨' },
    { to: '/admin/users', label: 'Colaboradores', icon: '👥' },
    ...(!isSupervisor ? [{ to: '/admin/companies', label: 'Empresas', icon: '🏢' }] : []),
    ...(isDeveloper ? [{ to: '/admin/badges', label: 'Biblioteca', icon: '🛡️' }] : []),
  ];

  const links = showUserMenu ? userLinks : adminLinks;
  const activeClass = 'bg-brand-red text-white shadow-lg shadow-brand-red-light';
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
                className={`flex-1 flex items-center justify-center py-2.5 rounded-xl transition-all ${adminViewMode === 'management' ? 'bg-white text-brand-red shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <span className="text-lg">📊</span>
              </button>
              <button
                onClick={() => setAdminViewMode('personal')}
                title="Minha Jornada"
                className={`flex-1 flex items-center justify-center py-2.5 rounded-xl transition-all ${adminViewMode === 'personal' ? 'bg-white text-brand-red shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <span className="text-lg">👤</span>
              </button>
            </div>
          )}

          <div className="mb-4 px-4">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              {showUserMenu ? 'Menu do Colaborador' : 'Gestão Operacional'}
            </span>
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              if (link.label === 'Empresas' && !showUserMenu && companies.length > 0) {
                return (
                  <div key={link.to}>
                    <button
                      onClick={() => navigate(link.to)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="flex-1 text-left">{link.label}</span>
                    </button>
                    <div className="ml-2 border-l-2 border-slate-100 pl-2 space-y-1">
                      {companies.map((company) => {
                        const units = getCompanyUnits(company.id);
                        const isExpanded = expandedCompanies.has(company.id);
                        return (
                          <div key={company.id}>
                            <button
                              onClick={() => toggleExpandCompany(company.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                            >
                              <span className="text-sm">{isExpanded ? '▼' : '▶'}</span>
                              <span className="flex-1 text-left truncate">{company.name}</span>
                            </button>
                            {isExpanded && units.length > 0 && (
                              <div className="ml-4 space-y-1">
                                {units.map((unit) => (
                                  <button
                                    key={unit.id}
                                    onClick={() => {
                                      navigate(`/empresas/${company.id}#${unit.id}`);
                                      if (window.innerWidth < 768) onClose();
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-brand-red-light hover:text-brand-red transition-all truncate"
                                  >
                                    <span className="text-sm">📍</span>
                                    <span className="flex-1 text-left truncate">{unit.name}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/admin' || link.to === '/dashboard'}
                  onClick={() => {
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all
                    ${isActive ? activeClass : inactiveClass}
                  `}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-50">
            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-red-light flex items-center justify-center text-xl">
                  {isAdmin ? '🛡️' : '👤'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-black text-slate-900 truncate">{user.full_name}</p>
                  <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest">{user.role}</p>
                </div>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-brand-red" style={{ width: `${Math.min(100, Math.max(0, (monthlyMetrics.positiveCount / 3) * 100))}%` }}></div>
              </div>
              <p className="text-[9px] font-black text-slate-400 mt-2 uppercase tracking-tighter">
                Saldo do mês: {monthlyMetrics.monthlyScore} • {monthlyMetrics.positiveCount} selos
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
