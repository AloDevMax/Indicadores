
import React, { useMemo, useState } from 'react';
import { Profile, Badge, UserBadge } from '../types';

interface RankingProps {
  users: Profile[];
  badges: Badge[];
  userBadges: UserBadge[];
}

const CATEGORIES = ['todos', 'qualidade', 'segurança', 'eficiência', 'processos', 'serviço'];

const Ranking: React.FC<RankingProps> = ({ users, badges, userBadges }) => {
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const filteredExplorers = useMemo(() => users.filter(u => u.role === 'user'), [users]);

  const sortedUsers = useMemo(() => {
    if (selectedCategory === 'todos') {
      return [...filteredExplorers].sort((a, b) => (b.xp || 0) - (a.xp || 0));
    }

    // Dynamic XP calculation based on category if needed, or just filter users with badges in that category
    const usersWithCalculatedXp = filteredExplorers.map(user => {
      const earnedBadgeIds = userBadges
        .filter(ub => ub.user_id === user.id)
        .map(ub => ub.badge_id);
      
      const categoryXp = badges
        .filter(b => b.category === selectedCategory && earnedBadgeIds.includes(b.id))
        .reduce((sum, b) => sum + b.points, 0);

      return { ...user, categoryXp };
    });

    return usersWithCalculatedXp.sort((a, b) => (b.categoryXp || 0) - (a.categoryXp || 0));
  }, [selectedCategory, filteredExplorers, userBadges, badges]);

  const topThree = sortedUsers.slice(0, 3);
  const remainingUsers = sortedUsers.slice(3);

  const getUserBadges = (userId: string) => {
    const earnedBadgeIds = userBadges
      .filter(ub => ub.user_id === userId)
      .map(ub => ub.badge_id);
    return badges.filter(b => earnedBadgeIds.includes(b.id));
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="text-center space-y-6">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">hall da fama</h1>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">os lendários exploradores da excelência</p>
        
        <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-2xl mx-auto">
          {CATEGORIES.map(cat => (
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

      {/* Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-end pt-10">
        {topThree[1] && (
          <button onClick={() => setSelectedUser(topThree[1])} className="w-full text-left order-2 md:order-1 bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl text-center space-y-4 transform md:scale-90 relative hover:scale-95 transition-transform duration-500">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl">🥈</div>
            <div className="w-24 h-24 rounded-[32px] bg-slate-100 mx-auto flex items-center justify-center text-3xl shadow-inner">👤</div>
            <div><h3 className="font-black text-slate-900 truncate">{topThree[1].full_name}</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NV {topThree[1].level}</p></div>
            <div className="bg-slate-50 py-2 rounded-2xl"><span className="text-sm font-black text-slate-600">{topThree[1].xp} XP</span></div>
          </button>
        )}
        {topThree[0] && (
          <button onClick={() => setSelectedUser(topThree[0])} className="w-full text-left order-1 md:order-2 bg-indigo-600 p-10 rounded-[50px] shadow-2xl text-center space-y-6 relative z-10 hover:scale-105 transition-transform duration-500 text-white">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-6xl drop-shadow-lg">🥇</div>
            <div className="w-32 h-32 rounded-[40px] bg-white/20 mx-auto flex items-center justify-center text-5xl shadow-inner animate-pulse">👑</div>
            <div><h3 className="font-black text-xl truncate">{topThree[0].full_name}</h3><p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mt-1">mestre supremo • NV {topThree[0].level}</p></div>
            <div className="bg-white/10 py-3 rounded-[24px] border border-white/10"><span className="text-lg font-black">{topThree[0].xp} XP</span></div>
          </button>
        )}
        {topThree[2] && (
          <button onClick={() => setSelectedUser(topThree[2])} className="w-full text-left order-3 md:order-3 bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl text-center space-y-4 transform md:scale-90 relative hover:scale-95 transition-transform duration-500">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl">🥉</div>
            <div className="w-24 h-24 rounded-[32px] bg-amber-50 mx-auto flex items-center justify-center text-3xl shadow-inner">👤</div>
            <div><h3 className="font-black text-slate-900 truncate">{topThree[2].full_name}</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NV {topThree[2].level}</p></div>
            <div className="bg-amber-50/50 py-2 rounded-2xl"><span className="text-sm font-black text-amber-600">{topThree[2].xp} XP</span></div>
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-10">
            <h2 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight flex items-center gap-3"><span>📈</span> ranking global</h2>
            <div className="space-y-3">
              {remainingUsers.map((user, index) => (
                <button key={user.id} onClick={() => setSelectedUser(user)} className="w-full text-left flex items-center justify-between p-6 rounded-[24px] bg-slate-50/50 hover:bg-white hover:shadow-lg border border-transparent transition-all group">
                  <div className="flex items-center gap-6">
                    <span className="w-10 text-center font-black text-slate-300 group-hover:text-indigo-600 transition-colors">#{index + 4}</span>
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm">👤</div>
                    <div><div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{user.full_name}</div><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NV {user.level}</div></div>
                  </div>
                  <div className="text-right"><div className="text-sm font-black text-slate-900">{user.xp}</div><div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">experiência total</div></div>
                </button>
              ))}
              {sortedUsers.length === 0 && <div className="py-20 text-center text-slate-400 font-bold uppercase text-xs">nenhum explorador no ranking</div>}
            </div>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start mb-8 shrink-0">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-4xl shadow-inner">👤</div>
                <div><h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedUser.full_name}</h2><div className="flex items-center gap-4 mt-2"><span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">NV {selectedUser.level}</span></div></div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-300 hover:text-slate-900 transition-colors text-4xl leading-none">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-8">
              <div className="bg-slate-50 p-6 rounded-3xl flex items-center justify-around text-center">
                <div><div className="text-2xl font-black text-indigo-600">{selectedUser.xp}</div><div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">experiência</div></div>
                <div className="w-[1px] h-8 bg-slate-200"></div>
                <div><div className="text-2xl font-black text-slate-900">{getUserBadges(selectedUser.id).length}</div><div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">selos</div></div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">coleção de selos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {getUserBadges(selectedUser.id).map(badge => (
                    <div key={badge.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">{badge.icon_name}</div>
                      <div><div className="font-bold text-slate-900 text-sm">{badge.name}</div><div className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{badge.category}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedUser(null)} className="mt-8 w-full py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all text-slate-600">fechar perfil</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ranking;
