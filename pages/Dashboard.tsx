import React, { useMemo } from 'react';
import { Profile, Badge, BadgeLegendSettings, BadgeSubmission, UserBadge } from '../types';
import BadgeCard from '../components/BadgeCard';
import { BADGE_TONE_LABELS, getUserMonthlyBadgeMetrics } from '../utils/badgeMetrics';

interface DashboardProps {
  user: Profile;
  allBadges: Badge[];
  userBadges: UserBadge[];
  badgeLegends: BadgeLegendSettings;
  submissions: BadgeSubmission[];
  onOpenSolicitation: () => void;
  onVerifyEmail?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  allBadges,
  userBadges,
  badgeLegends,
  submissions,
  onOpenSolicitation,
  onVerifyEmail,
}) => {
  const isAdmin = user.role === 'admin';

  const mySubmissions = useMemo(() => submissions.filter(s => s.user_id === user.id), [submissions, user.id]);
  const myUnlockedBadges = useMemo(() => userBadges.filter(ub => ub.user_id === user.id), [userBadges, user.id]);
  const monthlyMetrics = useMemo(() => getUserMonthlyBadgeMetrics(user.id, userBadges), [user.id, userBadges]);
  const progress = Math.min(100, Math.max(0, (monthlyMetrics.positiveCount / 3) * 100));

  return (
    <div className="relative min-h-[calc(100vh-8rem)] space-y-8 md:space-y-12 animate-in fade-in duration-500 pb-24 md:pb-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-6 md:bg-transparent md:p-0 rounded-3xl border border-slate-100 md:border-none shadow-sm md:shadow-none">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">olá, {user.full_name.split(' ')[0]}!</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-slate-500 font-bold uppercase text-[10px] md:text-xs tracking-widest">
              {isAdmin ? 'centro de comando pessoal' : 'saldo mensal de selos'}
            </p>
            {!user.email_verified && onVerifyEmail && (
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <div className="md:col-span-2 bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-xl border border-slate-100 flex flex-col sm:flex-row items-center gap-6 md:gap-10">
          <div className="relative shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] md:rounded-[40px] bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-4xl md:text-5xl shadow-2xl shadow-indigo-200">
              {isAdmin ? '🛡️' : '🏷️'}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white text-slate-900 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-black border-4 border-indigo-100 text-base md:text-lg">
              {monthlyMetrics.monthlyScore}
            </div>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="flex justify-between items-end gap-4">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900">saldo do mês</h3>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">bronze, prata, ouro e perdas</p>
              </div>
              <div className="text-[10px] md:text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl">
                {monthlyMetrics.positiveCount} positivos
              </div>
            </div>

            <div className="w-full h-3 md:h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-white">
              <div className="h-full bg-indigo-600 transition-all duration-1000 ease-out" style={{ width: `${Math.max(progress, 5)}%` }}></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
              {(['bronze', 'silver', 'gold', 'loss_1', 'loss_2'] as const).map(tone => (
                <div key={tone} className="bg-slate-50 rounded-2xl px-3 py-2">
                  <div className="text-sm font-black text-slate-900">{monthlyMetrics.counts[tone]}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{BADGE_TONE_LABELS[tone]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-indigo-600 p-8 md:p-10 rounded-[32px] md:rounded-[40px] shadow-xl shadow-indigo-200 text-white flex flex-col justify-center items-center text-center space-y-2">
          <div className="text-4xl md:text-5xl font-black">{monthlyMetrics.lossCount}</div>
          <div className="font-black uppercase text-[10px] tracking-[0.2em] opacity-80">perdas do mês</div>
        </div>
      </div>

      <section className="bg-white rounded-[32px] border border-slate-100 shadow-xl p-6 space-y-3">
        <button className="text-left w-full">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">legenda minimizada</div>
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
          {Object.entries(badgeLegends).map(([tone, label]) => (
            <div key={tone} className="bg-slate-50 rounded-2xl px-4 py-3">
              <span className="font-black text-slate-900">{BADGE_TONE_LABELS[tone as keyof typeof badgeLegends]}:</span> {label}
            </div>
          ))}
        </div>
      </section>

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

      <section className="space-y-6">
        <h3 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight px-1">galeria de conquistas</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {allBadges.map((badge) => {
            const badgeAward = myUnlockedBadges.find(ub => ub.badge_id === badge.id);
            return (
              <BadgeCard
                key={badge.id}
                badge={badge}
                unlocked={Boolean(badgeAward)}
                tone={badgeAward?.tone}
                date={badgeAward?.awarded_at}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
