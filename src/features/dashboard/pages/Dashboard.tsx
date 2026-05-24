import React, { useMemo } from 'react';
import { Profile, Badge, BadgeLegendSettings, BadgeSubmission, UserBadge, Company, ProductiveUnit, ImportSourceConfig, ImportSourceField, ImportBindingSnapshot } from '@/shared/types';
import BadgeCard from '@/features/badges/components/BadgeCard';
import { BADGE_TONE_LABELS, getUserBadgeSummary, getUserMonthlyBadgeMetrics } from '@/features/badges/badgeMetrics';
import { Shield, Tag, Plus, FileText } from 'lucide-react';

interface DashboardProps {
  user: Profile;
  allBadges: Badge[];
  userBadges: UserBadge[];
  badgeLegends: BadgeLegendSettings;
  submissions: BadgeSubmission[];
  users: Profile[];
  companies: Company[];
  productiveUnits: ProductiveUnit[];
  importSources: ImportSourceConfig[];
  importBindingSnapshot: ImportBindingSnapshot | null;
  onOpenSolicitation: () => void;
  onVerifyEmail?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  allBadges,
  userBadges,
  badgeLegends,
  submissions,
  users,
  companies,
  productiveUnits,
  importSources,
  importBindingSnapshot,
  onOpenSolicitation,
  onVerifyEmail,
}) => {
  const isAdmin = ['admin', 'developer'].includes(user?.role);

  const mySubmissions = useMemo(() => submissions.filter(s => s.user_id === user.id), [submissions, user.id]);
  const myUnlockedBadges = useMemo(() => userBadges.filter(ub => ub.user_id === user.id), [userBadges, user.id]);
  const myBadgeSummary = useMemo(() => getUserBadgeSummary(user.id, userBadges), [user.id, userBadges]);
  const monthlyMetrics = useMemo(() => getUserMonthlyBadgeMetrics(user.id, userBadges), [user.id, userBadges]);

  const visibleCollaborators = useMemo(() => {
    const base = users.filter(profile => profile.role === 'user');

    if (isAdmin) return base;

    return base.filter(profile => {
      if (profile.id === user.id) return true;
      if (user.productive_unit_id) return profile.productive_unit_id === user.productive_unit_id;
      if (user.company_id) return profile.company_id === user.company_id;
      return profile.id === user.id;
    });
  }, [isAdmin, user.id, user.company_id, user.productive_unit_id, users]);
  const groupedCollaborators = useMemo(() => {
    const groups = new Map<string, {
      companyId: string;
      companyName: string;
      units: Map<string, { unitId: string; unitName: string; collaborators: Profile[] }>;
    }>();

    visibleCollaborators.forEach((collaborator) => {
      const companyId = collaborator.company_id || 'independente';
      const companyName = companies.find(company => company.id === collaborator.company_id)?.name || 'Independente';
      const unitId = collaborator.productive_unit_id || `${companyId}-sem-unidade`;
      const unitName = productiveUnits.find(unit => unit.id === collaborator.productive_unit_id)?.name || 'Sem unidade produtiva';

      if (!groups.has(companyId)) {
        groups.set(companyId, { companyId, companyName, units: new Map() });
      }

      const companyGroup = groups.get(companyId)!;

      if (!companyGroup.units.has(unitId)) {
        companyGroup.units.set(unitId, { unitId, unitName, collaborators: [] });
      }

      companyGroup.units.get(unitId)!.collaborators.push(collaborator);
    });

    return Array.from(groups.values()).map(group => ({
      ...group,
      units: Array.from(group.units.values()),
    }));
  }, [companies, productiveUnits, visibleCollaborators]);

  // Só renderiza quando os dados essenciais estiverem disponíveis
  if (!allBadges || allBadges.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-brand-red font-bold text-xl uppercase tracking-widest">Carregando dados...</div>
      </div>
    );
  }

  const linkedImportSource = importSources.find(source => source.id === importBindingSnapshot?.sourceId) || importSources[0];
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
          className="hidden md:flex bg-brand-red text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-red-dark transition-all shadow-xl shadow-brand-red-light items-center justify-center gap-3 active:scale-95"
        >
          <Plus size={20} strokeWidth={2} /> Solicitar meu selo
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-2xl shadow-xl border border-slate-100 space-y-4">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900">Saldo do Mês</h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">Bronze, Prata, Ouro e Perdas</p>
          </div>

          <div className="w-full h-3 md:h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-white">
            <div className="h-full bg-brand-red transition-all duration-1000 ease-out" style={{ width: `${Math.max(progress, 5)}%` }}></div>
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

        <div className="bg-brand-red p-8 md:p-10 rounded-2xl md:rounded-2xl shadow-xl shadow-brand-red-light text-white flex flex-col justify-center items-center text-center space-y-2">
          <div className="text-4xl md:text-5xl font-black">{monthlyMetrics.lossCount}</div>
          <div className="font-black uppercase text-[10px] tracking-[0.2em] opacity-80">Perdas do Mês</div>
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resumo de Selos</div>
            <h3 className="text-xl font-black text-slate-900 mt-2">Distribuição pessoal de selos</h3>
          </div>
          <div className="bg-brand-red-light text-brand-red-dark px-4 py-3 rounded-2xl text-center min-w-[110px]">
            <div className="text-2xl font-black">{myBadgeSummary.total}</div>
            <div className="text-[10px] font-black uppercase tracking-widest">Total</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lista de Selos</div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(myBadgeSummary.byBadge).length > 0 ? (
                Object.entries(myBadgeSummary.byBadge).map(([badgeId, count]) => {
                  const badge = allBadges.find((entry) => entry.id === badgeId);
                  return (
                    <span key={badgeId} className="px-3 py-2 rounded-2xl bg-slate-100 text-slate-700 font-bold">
                      {badge?.name || 'Selo'} x{count}
                    </span>
                  );
                })
              ) : (
                <span className="text-sm font-bold text-slate-400">Nenhum selo registrado ainda.</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contagem por Tipo</div>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(myBadgeSummary.byBadge).length > 0 ? (
                Object.entries(myBadgeSummary.byBadge).map(([badgeId, count]) => {
                  const badge = allBadges.find((entry) => entry.id === badgeId);
                  return (
                    <div key={badgeId} className="bg-slate-50 rounded-2xl px-4 py-3">
                      <div className="text-sm font-black text-slate-900">{count}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{badge?.name || 'Selo'}</div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-slate-50 rounded-2xl px-4 py-3 text-sm font-bold text-slate-400">
                  Aguardando importação ou concessão de selos.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 space-y-3">
        <button className="text-left w-full">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legenda Minimizada</div>
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
          {Object.entries(badgeLegends).map(([tone, label]) => (
            <div key={tone} className="bg-slate-50 rounded-2xl px-4 py-3">
              <span className="font-black text-slate-900">{BADGE_TONE_LABELS[tone as keyof typeof badgeLegends]}:</span> {label}
            </div>
          ))}
        </div>
      </section>

      {linkedImportSource && (
        <section className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 space-y-4">
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fonte Excel Vinculada ao Dashboard</div>
            <h3 className="text-lg font-black text-slate-900 mt-2">{linkedImportSource?.name || 'Fonte sem nome'}</h3>
            {linkedImportSource.description && <p className="text-sm text-slate-500 mt-2">{linkedImportSource.description}</p>}
            {importBindingSnapshot && <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-3">Último Vínculo: {new Date(importBindingSnapshot.importedAt).toLocaleString('pt-BR')}</p>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(Object.entries(linkedImportSource.columns) as [ImportSourceField, string][]).map(([field, column]) => (
              <div key={field} className="bg-slate-50 rounded-2xl px-4 py-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{field}</div>
                <div className="text-sm font-bold text-slate-900 mt-1">{importBindingSnapshot?.matchedColumns[field] || column}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {mySubmissions.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest px-1">Solicitações Recentes</h3>
          <div className="flex flex-col gap-3">
            {mySubmissions.slice(0, 3).map(sub => (
              <div key={sub.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl"><FileText size={20} strokeWidth={2} /></div>
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
        <h3 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight px-1">Indicadores Obtidos</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {(allBadges || []).map((badge) => {
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

      <section className="space-y-6">
        <div className="px-1">
          <h3 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">Selos por colaborador</h3>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
            {isAdmin ? 'Visão geral da operação' : 'Visão da sua empresa ou unidade'}
          </p>
        </div>

        <div className="space-y-6">
          {groupedCollaborators.map((companyGroup) => (
            <div key={companyGroup.companyId} className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h4 className="text-xl font-black text-slate-900">{companyGroup.companyName}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                    {companyGroup.units.reduce((total, unit) => total + unit.collaborators.length, 0)} colaboradores
                  </p>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-brand-red bg-brand-red-light px-4 py-2 rounded-xl">
                  {companyGroup.units.length} unidades
                </div>
              </div>

              <div className="space-y-5">
                {companyGroup.units.map((unitGroup) => (
                  <div key={unitGroup.unitId} className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-5 space-y-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <h5 className="text-lg font-black text-slate-900">{unitGroup.unitName}</h5>
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-teal mt-2">
                          {unitGroup.collaborators.length} colaboradores na unidade
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {unitGroup.collaborators.map((collaborator) => {
                        const collaboratorBadges = userBadges.filter(ub => ub.user_id === collaborator.id);
                        const collaboratorMetrics = getUserMonthlyBadgeMetrics(collaborator.id, userBadges);

                        return (
                          <div key={collaborator.id} className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-5 space-y-5">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h6 className="text-lg font-black text-slate-900">{collaborator.full_name}</h6>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">{collaborator.email}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-black text-slate-900">{collaboratorMetrics.monthlyScore}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Saldo do Mês</div>
                              </div>
                            </div>

                            {collaboratorBadges.length > 0 ? (
                              <div className="flex flex-wrap gap-3">
                                {collaboratorBadges.map((userBadge) => {
                                  const badge = allBadges.find(item => item.id === userBadge.badge_id);
                                  if (!badge) return null;

                                  const toneAccent =
                                    userBadge.tone === 'gold' ? 'border-amber-400 bg-amber-50' :
                                    userBadge.tone === 'silver' ? 'border-slate-400 bg-slate-50' :
                                    userBadge.tone === 'bronze' ? 'border-amber-700 bg-orange-50' :
                                    userBadge.tone === 'loss_2' ? 'border-rose-600 bg-rose-100' :
                                    'border-rose-400 bg-rose-50';

                                  return (
                                    <div key={userBadge.id} className={`min-w-[140px] rounded-2xl border-2 px-4 py-3 ${toneAccent}`}>
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden bg-slate-100">
                                          {badge.image_url ? (
                                            <img src={badge.image_url} alt={badge.name} className="w-full h-full object-cover" />
                                          ) : (
                                            <span>{badge.icon_name}</span>
                                          )}
                                        </div>
                                        <div className="min-w-0">
                                          <div className="text-xs font-black text-slate-900 truncate">{badge?.name || 'Badge sem nome'}</div>
                                          <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                                            {BADGE_TONE_LABELS[userBadge.tone]}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="rounded-2xl bg-slate-50 px-4 py-5 text-sm font-bold text-slate-400">
                                Nenhum selo atribuído ainda.
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
