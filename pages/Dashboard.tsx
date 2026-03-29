
import React, { useMemo } from 'react';
import { Profile, Badge, BadgeSubmission, UserBadge } from '../types';
import BadgeCard from '../components/BadgeCard';

interface DashboardProps {
  user: Profile;
  allBadges: Badge[];
  userBadges: UserBadge[];
  submissions: BadgeSubmission[];
  onOpenSolicitation: () => void;
  onVerifyEmail: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  allBadges, 
  userBadges, 
  submissions,
  onOpenSolicitation,
  onVerifyEmail,
}) => {
  const isAdmin = user.role === 'admin';
  
  // Filtros de conectividade
  const mySubmissions = useMemo(() => 
    submissions.filter(s => s.user_id === user.id), 
    [submissions, user.id]
  );

  const myUnlockedBadges = useMemo(() => 
    userBadges.filter(ub => ub.user_id === user.id), 
    [userBadges, user.id]
  );

  const unlockedIds = useMemo(() => 
    myUnlockedBadges.map(ub => ub.badge_id), 
    [myUnlockedBadges]
  );

  // Lógica de gamificação
  const nextLevelXp = (user.level || 1) * 1000;
  const progress = ((user.xp || 0) / nextLevelXp) * 100;

  return (
    <div className="relative min-h-[calc(100vh-8rem)] space-y-8 md:space-y-12 animate-in fade-in duration-500 pb-24 md:pb-8">
      
      {/* HEADER MOBILE-FIRST: Stacked on mobile, horizontal on MD */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-6 md:bg-transparent md:p-0 rounded-3xl border border-slate-100 md:border-none shadow-sm md:shadow-none">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">olá, {user.full_name.split(' ')[0]}!</h1>
          <div className="flex items-center gap-2">
            <p className="text-slate-500 font-bold uppercase text-[10px] md:text-xs tracking-widest">
              {isAdmin ? 'centro de comando pessoal' : 'sua jornada rumo à excelência'}
            </p>
            {!user.email_verified && (
              <button onClick={onVerifyEmail} className="text-xs font-bold px-2 py-1 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200">
                Verificar e-mail
              </button>
            )}
            {user.email_verified && (
              <span className="text-xs font-bold px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700">E-mail verificado</span>
            )}
          </div>
        </div>
        
        <button 
          onClick={onOpenSolicitation}
          className="hidden md:flex bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 items-center justify-center gap-3 active:scale-95"
        >
          <span>✨</span> solicitar meu selo
        </button>
      </header>

      {/* STATS MOBILE-FIRST: Column on small, Grid on MD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        
        {/* Level Card */}
        <div className="md:col-span-2 bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-xl border border-slate-100 flex flex-col sm:flex-row items-center gap-6 md:gap-10">
          <div className="relative shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] md:rounded-[40px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl md:text-5xl shadow-2xl shadow-indigo-200">
              {isAdmin ? '🛡️' : '👤'}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-slate-900 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-black border-4 border-white text-base md:text-lg">
              {user.level}
            </div>
          </div>
          
          <div className="flex-1 w-full space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900">nível {user.level}</h3>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">explorador de qualidade</p>
              </div>
              <div className="text-[10px] md:text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl">
                {user.xp} XP
              </div>
            </div>
            
            <div className="w-full h-3 md:h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-white">
              <div 
                className="h-full bg-indigo-600 transition-all duration-1000 ease-out"
                style={{ width: `${Math.max(progress, 5)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Badges Count Card */}
        <div className="bg-indigo-600 p-8 md:p-10 rounded-[32px] md:rounded-[40px] shadow-xl shadow-indigo-200 text-white flex flex-col justify-center items-center text-center space-y-1">
          <div className="text-4xl md:text-5xl font-black">{unlockedIds.length}</div>
          <div className="font-black uppercase text-[10px] tracking-[0.2em] opacity-80">selos conquistados</div>
        </div>
      </div>

      {/* RECENT SUBMISSIONS */}
      {mySubmissions.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest px-1">solicitações recentes</h3>
          <div className="flex flex-col gap-3">
            {mySubmissions.slice(0, 3).map(sub => (
              <div key={sub.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl">📋</div>
                  <div>
                    <div className="text-xs font-black text-slate-900 uppercase">{sub.badge_name}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">{new Date(sub.submitted_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                  sub.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                  sub.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {sub.status === 'pending' ? 'em análise' : sub.status === 'approved' ? 'aprovado' : 'recusado'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BADGES GALLERY: 2 columns on mobile, 4 on desktop */}
      <section className="space-y-6">
        <h3 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight px-1">galeria de conquistas</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {allBadges.map((badge) => (
            <BadgeCard 
              key={badge.id} 
              badge={badge} 
              unlocked={unlockedIds.includes(badge.id)}
              date={myUnlockedBadges.find(ub => ub.badge_id === badge.id)?.awarded_at}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
