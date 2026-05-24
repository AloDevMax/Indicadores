import React, { useMemo, useState } from 'react';
import { Profile, Badge, BadgeLegendSettings, UserBadge, BadgeSubmission } from '@/shared/types';
import BadgeCard from '@/features/badges/components/BadgeCard';
import { BADGE_TONE_LABELS, getUserMonthlyBadgeMetrics } from '@/features/badges/badgeMetrics';
import { Tag, Inbox } from 'lucide-react';

interface UserBadgesPageProps {
  user: Profile;
  allBadges: Badge[];
  userBadges: UserBadge[];
  badgeLegends: BadgeLegendSettings;
  submissions: BadgeSubmission[];
}

const UserBadgesPage: React.FC<UserBadgesPageProps> = ({ user, allBadges, userBadges, badgeLegends, submissions }) => {
  const [monthFilter, setMonthFilter] = useState<string>('all');

  const myUnlockedBadges = useMemo(() => userBadges.filter(ub => ub.user_id === user.id), [userBadges, user.id]);
  const monthlyMetrics = useMemo(() => getUserMonthlyBadgeMetrics(user.id, userBadges), [user.id, userBadges]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    myUnlockedBadges.forEach(ub => {
      const date = new Date(ub.awarded_at);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(yearMonth);
    });
    return Array.from(months).sort().reverse();
  }, [myUnlockedBadges]);

  const filteredUnlockedBadges = useMemo(() => {
    if (monthFilter === 'all') return myUnlockedBadges;
    return myUnlockedBadges.filter(ub => {
      const date = new Date(ub.awarded_at);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return yearMonth === monthFilter;
    });
  }, [myUnlockedBadges, monthFilter]);

  const mySubmissions = useMemo(() => submissions.filter(s => s.user_id === user.id).sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()), [submissions, user.id]);

  const formatMonthLabel = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <header className="space-y-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Meus Selos</h1>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(['bronze', 'silver', 'gold', 'loss_1', 'loss_2'] as const).map(tone => (
            <div key={tone} className="bg-white rounded-2xl border border-slate-100 px-4 py-4 shadow-sm">
              <div className="text-lg font-black text-slate-900">{monthlyMetrics.counts[tone]}</div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{BADGE_TONE_LABELS[tone]}</div>
            </div>
          ))}
        </div>
      </header>

      <section className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 space-y-3">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legenda Minimizada</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
          {Object.entries(badgeLegends).map(([tone, label]) => (
            <div key={tone} className="bg-slate-50 rounded-2xl px-4 py-3">
              <span className="font-black text-slate-900">{BADGE_TONE_LABELS[tone as keyof typeof badgeLegends]}:</span> {label}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <Tag size={20} strokeWidth={2} />
            <h2 className="text-xl font-black text-slate-900">selos recebidos</h2>
            <span className="bg-brand-primary-light text-brand-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase">
              {filteredUnlockedBadges.length} exibidos
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filtrar Período:</label>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-600 outline-none"
            >
              <option value="all">todos os tempos</option>
              {availableMonths.map(month => (
                <option key={month} value={month}>{formatMonthLabel(month)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {filteredUnlockedBadges.map(award => {
            const badge = allBadges.find(item => item.id === award.badge_id);
            if (!badge) return null;
            return <BadgeCard key={award.id} badge={badge} unlocked={true} tone={award.tone} date={award.awarded_at} />;
          })}
          {filteredUnlockedBadges.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Nenhum Selo Registrado neste Período.</p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Inbox size={20} strokeWidth={2} />
          <h2 className="text-xl font-black text-slate-900">histórico de solicitações</h2>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-5">data</th>
                  <th className="px-6 py-5">selo</th>
                  <th className="px-6 py-5">status</th>
                  <th className="px-6 py-5 hidden md:table-cell">evidência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mySubmissions.map(sub => (
                  <tr key={sub.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5 text-xs font-bold text-slate-500">{new Date(sub.submitted_at).toLocaleDateString()}</td>
                    <td className="px-6 py-5"><div className="font-black text-slate-900 text-sm uppercase">{sub.badge_name}</div></td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        sub.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        sub.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {sub.status === 'pending' ? 'em análise' : sub.status === 'approved' ? 'aprovado' : 'recusado'}
                      </span>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell"><p className="text-[10px] text-slate-400 font-medium max-w-xs truncate italic">"{sub.description}"</p></td>
                  </tr>
                ))}
                {mySubmissions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">Nenhuma Solicitação Enviada até o Momento.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserBadgesPage;
