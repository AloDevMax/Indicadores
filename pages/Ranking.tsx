import React, { useEffect, useMemo, useState } from 'react';
import { Badge, BadgeLegendSettings, Profile, UserBadge } from '../types';
import { BADGE_TONE_LABELS, BADGE_TONE_WEIGHTS, getUserMonthlyBadgeMetrics, getUserMonthlyBadges } from '../utils/badgeMetrics';
import { fetchBootstrapData } from '../utils/api';

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

interface RankingProps {
  currentUser: Profile;
}

const Ranking: React.FC<RankingProps> = ({ currentUser }) => {
  const isSupervisor = currentUser.role === 'supervisor';
  const now = new Date();
  const [users, setUsers] = useState<Profile[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [badgeLegends, setBadgeLegends] = useState<BadgeLegendSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [filterMonth, setFilterMonth] = useState(now.getUTCMonth());
  const [filterYear, setFilterYear] = useState(now.getUTCFullYear());

  const referenceDate = useMemo(() => new Date(Date.UTC(filterYear, filterMonth, 15)), [filterMonth, filterYear]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchBootstrapData().then(data => {
      if (cancelled || !data) return;
      setUsers(data.users || []);
      setBadges(data.badges || []);
      setUserBadges(data.userBadges || []);
      setBadgeLegends(data.badgeLegends || null);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const filteredExplorers = useMemo(() => users.filter(u => {
    if (u.role !== 'user') return false;
    if (isSupervisor) return u.productive_unit_id === currentUser.productive_unit_id;
    return true;
  }), [users, isSupervisor, currentUser.productive_unit_id]);

  const categories = useMemo(() => {
    const unique = [...new Set(badges.map(b => b.category).filter(Boolean))].sort();
    return ['Todos', ...unique];
  }, [badges]);

  const sortedUsers = useMemo(() => {
    return [...filteredExplorers]
      .map(user => {
        const metrics = getUserMonthlyBadgeMetrics(user.id, userBadges, referenceDate);
        const categoryScore = selectedCategory === 'Todos'
          ? metrics.monthlyScore
          : metrics.monthlyBadges
              .filter(ub => badges.find(b => b.id === ub.badge_id)?.category === selectedCategory)
              .reduce((sum, ub) => sum + BADGE_TONE_WEIGHTS[ub.tone], 0);
        return { ...user, monthlyScore: metrics.monthlyScore, monthlyMetrics: metrics, categoryScore };
      })
      .sort((a, b) => {
        if (b.categoryScore !== a.categoryScore) return b.categoryScore - a.categoryScore;
        return b.monthlyScore - a.monthlyScore;
      });
  }, [selectedCategory, filteredExplorers, userBadges, badges, referenceDate]);

  const topThree = sortedUsers.slice(0, 3);
  const remainingUsers = sortedUsers.slice(3);

  const scoreLabel = selectedCategory === 'Todos' ? 'saldo do mês' : selectedCategory.toLowerCase();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-bounce text-indigo-600 font-bold text-sm uppercase tracking-widest">Carregando ranking...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="text-center space-y-6">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hall da fama</h1>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Saldo mensal de selos por colaborador</p>

        <div className="flex items-center justify-center gap-3 mt-2">
          <select
            value={filterMonth}
            onChange={e => setFilterMonth(Number(e.target.value))}
            className="px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
          >
            {MONTH_NAMES.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select
            value={filterYear}
            onChange={e => setFilterYear(Number(e.target.value))}
            className="px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
          >
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-2xl mx-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-end pt-10">
        {topThree[1] && (
          <button onClick={() => setSelectedUser(topThree[1])} className="w-full text-left order-2 md:order-1 bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl text-center space-y-4 transform md:scale-90 relative hover:scale-95 transition-transform duration-500">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl">🥈</div>
            <div className="w-24 h-24 rounded-[32px] bg-slate-100 mx-auto flex items-center justify-center text-3xl shadow-inner">👤</div>
            <div><h3 className="font-black text-slate-900 truncate">{topThree[1].full_name}</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{scoreLabel}</p></div>
            <div className="bg-slate-50 py-2 rounded-2xl"><span className="text-sm font-black text-slate-600">{topThree[1].categoryScore}</span></div>
          </button>
        )}
        {topThree[0] && (
          <button onClick={() => setSelectedUser(topThree[0])} className="w-full text-left order-1 md:order-2 bg-indigo-600 p-10 rounded-[50px] shadow-2xl text-center space-y-6 relative z-10 hover:scale-105 transition-transform duration-500 text-white">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-6xl drop-shadow-lg">🥇</div>
            <div className="w-32 h-32 rounded-[40px] bg-white/20 mx-auto flex items-center justify-center text-5xl shadow-inner animate-pulse">👑</div>
            <div><h3 className="font-black text-xl truncate">{topThree[0].full_name}</h3><p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mt-1">{scoreLabel}</p></div>
            <div className="bg-white/10 py-3 rounded-[24px] border border-white/10"><span className="text-lg font-black">{topThree[0].categoryScore}</span></div>
          </button>
        )}
        {topThree[2] && (
          <button onClick={() => setSelectedUser(topThree[2])} className="w-full text-left order-3 md:order-3 bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl text-center space-y-4 transform md:scale-90 relative hover:scale-95 transition-transform duration-500">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl">🥉</div>
            <div className="w-24 h-24 rounded-[32px] bg-amber-50 mx-auto flex items-center justify-center text-3xl shadow-inner">👤</div>
            <div><h3 className="font-black text-slate-900 truncate">{topThree[2].full_name}</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{scoreLabel}</p></div>
            <div className="bg-amber-50/50 py-2 rounded-2xl"><span className="text-sm font-black text-amber-600">{topThree[2].categoryScore}</span></div>
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-10">
            <h2 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight flex items-center gap-3"><span>📈</span> ranking mensal</h2>
            <div className="space-y-3">
              {remainingUsers.map((user, index) => (
                <button key={user.id} onClick={() => setSelectedUser(user)} className="w-full text-left flex items-center justify-between p-6 rounded-[24px] bg-slate-50/50 hover:bg-white hover:shadow-lg border border-transparent transition-all group">
                  <div className="flex items-center gap-6">
                    <span className="w-10 text-center font-black text-slate-300 group-hover:text-indigo-600 transition-colors">#{index + 4}</span>
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm">👤</div>
                    <div>
                      <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{user.full_name}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.monthlyMetrics.positiveCount} selos positivos</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900">{user.categoryScore}</div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{scoreLabel}</div>
                  </div>
                </button>
              ))}
              {sortedUsers.length === 0 && <div className="py-20 text-center text-slate-400 font-bold uppercase text-xs">nenhum explorador no ranking</div>}
            </div>
          </div>
        </div>
      </div>

      {badgeLegends && (
        <section className="max-w-4xl mx-auto bg-white rounded-[32px] border border-slate-100 shadow-xl p-6 space-y-3">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">legenda minimizada</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
            {Object.entries(badgeLegends).map(([tone, label]) => (
              <div key={tone} className="bg-slate-50 rounded-2xl px-4 py-3">
                <span className="font-black text-slate-900">{BADGE_TONE_LABELS[tone as keyof typeof badgeLegends]}:</span> {label}
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start mb-8 shrink-0">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-4xl shadow-inner">👤</div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedUser.full_name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      saldo {getUserMonthlyBadgeMetrics(selectedUser.id, userBadges, referenceDate).monthlyScore}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-300 hover:text-slate-900 transition-colors text-4xl leading-none">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-8">
              {(() => {
                const metrics = getUserMonthlyBadgeMetrics(selectedUser.id, userBadges, referenceDate);
                const monthlyUserBadges = getUserMonthlyBadges(selectedUser.id, userBadges, referenceDate);
                return (
                  <>
                    <div className="bg-slate-50 p-6 rounded-3xl flex items-center justify-around text-center">
                      <div><div className="text-2xl font-black text-indigo-600">{metrics.monthlyScore}</div><div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">saldo do mês</div></div>
                      <div className="w-[1px] h-8 bg-slate-200"></div>
                      <div><div className="text-2xl font-black text-slate-900">{metrics.positiveCount}</div><div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">selos positivos</div></div>
                      <div className="w-[1px] h-8 bg-slate-200"></div>
                      <div><div className="text-2xl font-black text-red-500">{metrics.lossCount}</div><div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">perdas</div></div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">selos do mês</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {monthlyUserBadges.map((ub, idx) => {
                          const badge = badges.find(b => b.id === ub.badge_id);
                          const weight = BADGE_TONE_WEIGHTS[ub.tone];
                          const toneLabel = BADGE_TONE_LABELS[ub.tone];
                          const isLoss = weight < 0;
                          return (
                            <div key={`${ub.badge_id}-${idx}`} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner overflow-hidden shrink-0">
                                {badge?.image_url ? (
                                  <img src={badge.image_url} alt={badge.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span>{badge?.icon_name || '🏅'}</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-slate-900 text-sm truncate">{badge?.name || 'Selo'}</div>
                                <div className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{toneLabel}</div>
                              </div>
                              <div className={`text-sm font-black shrink-0 ${isLoss ? 'text-red-500' : 'text-emerald-600'}`}>
                                {weight > 0 ? `+${weight}` : weight}
                              </div>
                            </div>
                          );
                        })}
                        {monthlyUserBadges.length === 0 && (
                          <div className="col-span-2 py-8 text-center text-slate-400 font-bold text-xs uppercase">Nenhum selo no mês selecionado</div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            <button onClick={() => setSelectedUser(null)} className="mt-8 w-full py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all text-slate-600">fechar perfil</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ranking;
