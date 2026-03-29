
import React, { useState, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Badge, Profile, Company, ProductiveUnit, BadgeSubmission, UserBadge, BadgeLegendSettings, BadgeTone } from '../types';
import BadgeCard from '../components/BadgeCard';
import { BADGE_TONE_LABELS, getUserMonthlyBadgeMetrics } from '../utils/badgeMetrics';

interface AdminPanelProps {
  activeMode: 'management' | 'personal';
  setActiveMode: (_mode: 'management' | 'personal') => void;
  badges: Badge[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  productiveUnits: ProductiveUnit[];
  setProductiveUnits: React.Dispatch<React.SetStateAction<ProductiveUnit[]>>;
  badgeLegends: BadgeLegendSettings;
  setBadgeLegends: React.Dispatch<React.SetStateAction<BadgeLegendSettings>>;
  users: Profile[];
  setUsers: React.Dispatch<React.SetStateAction<Profile[]>>;
  userBadges: UserBadge[];
  setUserBadges: React.Dispatch<React.SetStateAction<UserBadge[]>>;
  submissions: BadgeSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<BadgeSubmission[]>>;
  onOpenSolicitation?: () => void;
}

interface ExcelRow {
  explorador: string;
  empresa: string;
  selo: string;
  premio: string;
}

interface ImportPreview {
  row: ExcelRow;
  user?: Profile;
  badge?: Badge;
  company?: Company;
  status: 'valid' | 'invalid';
  reason?: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  activeMode, 
  setActiveMode,
  badges,
  setBadges,
  companies,
  setCompanies,
  productiveUnits,
  setProductiveUnits,
  badgeLegends,
  setBadgeLegends,
  users,
  setUsers,
  userBadges,
  setUserBadges,
  submissions,
  setSubmissions,
  onOpenSolicitation
}) => {
  const location = useLocation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const view = useMemo(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'admin' || !path) return 'overview';
    return path as 'overview' | 'submissions' | 'users' | 'award' | 'badges' | 'companies';
  }, [location.pathname]);

  // UI State
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedAwardBadge, setSelectedAwardBadge] = useState<string>('');
  const [selectedAwardTone, setSelectedAwardTone] = useState<BadgeTone>('bronze');
  
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isDeleteBadgeModalOpen, setIsDeleteBadgeModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [badgeToDelete, setBadgeToDelete] = useState<Badge | null>(null);

  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isProductiveUnitModalOpen, setIsProductiveUnitModalOpen] = useState(false);
  const [editingProductiveUnit, setEditingProductiveUnit] = useState<ProductiveUnit | null>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isBulkInviteModalOpen, setIsBulkInviteModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [sendEmailOnAward, setSendEmailOnAward] = useState(false);

  const sendEmailNotification = (to: string, subject: string, message: string) => {
    /* no mock local, log + toast */
    console.log('ENVIANDO EMAIL PARA', to, subject, message);
    // Em backend real, chamar API de envio de e-mail aqui.
    return true;
  };

  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);

  const [bulkInviteEmails, setBulkInviteEmails] = useState('');
  const [bulkInviteCompanyId, setBulkInviteCompanyId] = useState('');
  const [bulkInviteProductiveUnitId, setBulkInviteProductiveUnitId] = useState('');

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [viewingUserBadges, setViewingUserBadges] = useState<Profile | null>(null);
  const [importPreviews, setImportPreviews] = useState<ImportPreview[]>([]);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(true);
  
  const [userSearch, setUserSearch] = useState('');

  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('');
  const [selectedProductiveUnitFilter, setSelectedProductiveUnitFilter] = useState<string>('');

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const adminProfile = users.find(u => u.role === 'admin') || users[0];
  const categories = ['Qualidade', 'Segurança', 'Eficiência', 'Processos', 'Serviço'];
  const getUnitsByCompany = (companyId?: string) => productiveUnits.filter(unit => unit.company_id === companyId);
  const adminMonthlyMetrics = getUserMonthlyBadgeMetrics(adminProfile.id, userBadges);

  const upsertUserBadge = (targetUserId: string, badgeId: string, tone: BadgeTone) => {
    const existingAward = userBadges.find(ub => ub.user_id === targetUserId && ub.badge_id === badgeId);

    if (existingAward) {
      setUserBadges(prev => prev.map(ub => ub.id === existingAward.id ? { ...ub, tone, awarded_at: new Date().toISOString(), awarded_by: adminProfile.id } : ub));
      return;
    }

    const newAward: UserBadge = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: targetUserId,
      badge_id: badgeId,
      awarded_at: new Date().toISOString(),
      awarded_by: adminProfile.id,
      tone,
    };

    setUserBadges(prev => [...prev, newAward]);
  };

  const handleLegendChange = (tone: BadgeTone, value: string) => {
    setBadgeLegends(prev => ({ ...prev, [tone]: value }));
  };

  const handleReviewSubmission = (submissionId: string, status: 'approved' | 'rejected') => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status } : s));

    if (status === 'approved') {
      upsertUserBadge(submission.user_id, submission.badge_id, 'bronze');
    }
    
    alert(`Solicitação ${status === 'approved' ? 'aprovada e selo concedido' : 'rejeitada'}.`);
  };

  const handleSaveBadge = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const badgeData: Badge = {
      id: editingBadge?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      points: Number(formData.get('points')),
      category: formData.get('category') as string,
      icon_name: (formData.get('icon_name') as string) || '✨',
    };
    setBadges(prev => editingBadge ? prev.map(b => b.id === editingBadge.id ? badgeData : b) : [...prev, badgeData]);
    setIsBadgeModalOpen(false);
  };

  const handleDeleteBadge = () => {
    if (badgeToDelete) {
      setBadges(prev => prev.filter(b => b.id !== badgeToDelete.id));
      setIsDeleteBadgeModalOpen(false);
      setBadgeToDelete(null);
    }
  };

  const handleSaveCompany = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const companyData: Company = {
      id: editingCompany?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
    };
    setCompanies(prev => editingCompany ? prev.map(c => c.id === editingCompany.id ? companyData : c) : [...prev, companyData]);
    setIsCompanyModalOpen(false);
  };

  const handleSaveProductiveUnit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const companyId = formData.get('company_id') as string;

    if (!companyId) {
      alert('Selecione a empresa da unidade produtiva.');
      return;
    }

    const productiveUnitData: ProductiveUnit = {
      id: editingProductiveUnit?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      company_id: companyId,
    };

    setProductiveUnits(prev => editingProductiveUnit ? prev.map(unit => unit.id === editingProductiveUnit.id ? productiveUnitData : unit) : [...prev, productiveUnitData]);
    setIsProductiveUnitModalOpen(false);
    setEditingProductiveUnit(null);
  };

  const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const companyId = (formData.get('company_id') as string) || undefined;
    const productiveUnitId = (formData.get('productive_unit_id') as string) || undefined;
    const validProductiveUnitId = productiveUnitId && productiveUnits.some(unit => unit.id === productiveUnitId && unit.company_id === companyId)
      ? productiveUnitId
      : undefined;

    const userData: Profile = {
      id: editingUser?.id || Math.random().toString(36).substr(2, 9),
      email: formData.get('email') as string,
      full_name: formData.get('full_name') as string,
      role: formData.get('role') as 'admin' | 'user',
      company_id: companyId,
      productive_unit_id: validProductiveUnitId,
      level: editingUser?.level || 1,
      xp: editingUser?.xp || 0,
      created_at: editingUser?.created_at || new Date().toISOString(),
    };
    setUsers(prev => editingUser ? prev.map(u => u.id === editingUser.id ? userData : u) : [...prev, userData]);
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleBulkInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const emails = bulkInviteEmails
      .split(/[\n,;]/)
      .map(e => e.trim())
      .filter(e => e !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    if (emails.length === 0) {
      alert('Por favor, insira e-mails válidos para o convite.');
      return;
    }

    const validProductiveUnitId = bulkInviteProductiveUnitId && productiveUnits.some(unit => unit.id === bulkInviteProductiveUnitId && unit.company_id === bulkInviteCompanyId)
      ? bulkInviteProductiveUnitId
      : undefined;

    const newUsers: Profile[] = emails.map(email => ({
      id: Math.random().toString(36).substr(2, 9),
      email,
      full_name: email.split('@')[0],
      role: 'user',
      company_id: bulkInviteCompanyId || undefined,
      productive_unit_id: validProductiveUnitId,
      level: 1,
      xp: 0,
      created_at: new Date().toISOString(),
    }));

    setUsers(prev => [...prev, ...newUsers]);
    alert(`${emails.length} convites enviados com sucesso para os novos exploradores!`);
    setIsBulkInviteModalOpen(false);
    setBulkInviteEmails('');
    setBulkInviteCompanyId('');
    setBulkInviteProductiveUnitId('');
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      if (userToDelete.id === adminProfile.id) {
        alert("Você não pode excluir seu próprio perfil administrativo.");
        setIsDeleteUserModalOpen(false);
        return;
      }
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setIsDeleteUserModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleAwardBadges = () => {
    if (selectedUsers.length === 0 || !selectedAwardBadge) return;
    const badge = badges.find(b => b.id === selectedAwardBadge);
    selectedUsers.forEach(userId => upsertUserBadge(userId, selectedAwardBadge, selectedAwardTone));

    if (badge) {
      setUsers(prev => prev.map(u => {
        if (!selectedUsers.includes(u.id)) return u;

        const updatedUser = {
          ...u,
          notifications: [
            ...(u.notifications || []),
            {
              id: Math.random().toString(36).slice(2, 10),
              title: 'Selo concedido',
              message: `Parabens ${u.full_name}, voce recebeu o selo ${badge.name} com marcacao ${BADGE_TONE_LABELS[selectedAwardTone]}.`,
              sent_at: new Date().toISOString(),
              read: false,
            }
          ]
        };

        if (sendEmailOnAward && u.email_verified) {
          sendEmailNotification(u.email, 'Selo concedido', `Ola ${u.full_name}, voce recebeu o selo ${badge.name} com marcacao ${BADGE_TONE_LABELS[selectedAwardTone]}.`);
        }

        return updatedUser;
      }));
    }

    alert(`${selectedUsers.length} exploradores foram premiados!`);
    setSelectedUsers([]);
    setSelectedAwardBadge('');
  };

  const handleAssignBadgeToUser = (targetUserId: string, badgeId: string, tone: BadgeTone) => {
    upsertUserBadge(targetUserId, badgeId, tone);
  };

  const handleRemoveBadgeFromUser = (targetUserId: string, badgeId: string) => {
    const badgeAward = userBadges.find(ub => ub.user_id === targetUserId && ub.badge_id === badgeId);
    if (!badgeAward) return;

    setUserBadges(prev => prev.filter(ub => ub.id !== badgeAward.id));
  };
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws) as ExcelRow[];

      const previews: ImportPreview[] = data.map(row => {
        const exploradorStr = row['explorador']?.toString().toLowerCase().trim();
        const empresaStr = row['empresa']?.toString().toLowerCase().trim();
        const seloStr = row['selo']?.toString().toLowerCase().trim();
        const premio = row['premio']?.toString().toUpperCase().trim();

        const userFound = users.find(u => u.full_name.toLowerCase().includes(exploradorStr) || u.email.toLowerCase().includes(exploradorStr));
        const badgeFound = badges.find(b => b.name.toLowerCase().includes(seloStr));

        let status: 'valid' | 'invalid' = 'valid';
        let reason = '';

        if (!userFound) { status = 'invalid'; reason = 'explorador não encontrado'; }
        else if (!badgeFound) { status = 'invalid'; reason = 'selo não encontrado'; }
        else if (premio !== 'S') { status = 'invalid'; reason = 'premio não autorizado (N)'; }

        return { row: { explorador: exploradorStr, empresa: empresaStr, selo: seloStr, premio }, user: userFound, badge: badgeFound, status, reason };
      });

      setImportPreviews(previews);
      setIsImportModalOpen(true);
    };
    reader.readAsBinaryString(file);
  };

  const finalizeImport = () => {
    const valid = importPreviews.filter(p => p.status === 'valid');
    if (valid.length === 0) return;

    valid.forEach(p => {
      upsertUserBadge(p.user!.id, p.badge!.id, 'bronze');
    });

    alert(`${valid.length} importacoes concluidas.`);
    setIsImportModalOpen(false);
  };

  // Filters
  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.full_name.toLowerCase().includes(userSearch.toLowerCase()) &&
      (selectedCompanyFilter === '' || u.company_id === selectedCompanyFilter) &&
      (selectedProductiveUnitFilter === '' || u.productive_unit_id === selectedProductiveUnitFilter)
    );
  }, [users, userSearch, selectedCompanyFilter, selectedProductiveUnitFilter]);

  const stats = useMemo(() => ({
    totalUsers: users.length,
    activeBadges: badges.length,
    pendingSubmissions: submissions.filter(s => s.status === 'pending').length,
    totalCompanies: companies.length,
    totalProductiveUnits: productiveUnits.length
  }), [users, badges, submissions, companies, productiveUnits]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Switcher */}
      {view === 'overview' && (
        <div className="flex justify-center mb-10">
          <div className="bg-slate-200/50 p-1.5 rounded-[24px] flex gap-1 shadow-inner">
            <button onClick={() => setActiveMode('management')} className={`px-8 py-3 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all ${activeMode === 'management' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>📊 Gestão Operacional</button>
            <button onClick={() => setActiveMode('personal')} className={`px-8 py-3 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all ${activeMode === 'personal' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>👤 Minha Jornada</button>
          </div>
        </div>
      )}

      {activeMode === 'management' ? (
        <div className="space-y-10 pb-20">
          {view === 'overview' && (
            <div className="space-y-10">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Centro de Comando</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Hierarquia e Performance Operacional</p>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                  { label: 'Exploradores', val: stats.totalUsers, icon: '👥' },
                  { label: 'Selos Ativos', val: stats.activeBadges, icon: '🛡️' },
                  { label: 'Pendências', val: stats.pendingSubmissions, icon: '📨', color: 'text-amber-600' },
                  { label: 'Empresas', val: stats.totalCompanies, icon: '🏢', color: 'text-emerald-600' },
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className={`text-3xl font-black leading-none ${kpi.color || 'text-slate-900'}`}>{kpi.val}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{kpi.label}</div>
                    </div>
                    <div className="absolute right-[-10px] bottom-[-10px] text-6xl opacity-[0.03] group-hover:rotate-12 transition-transform">{kpi.icon}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2"><span>🏢</span> Empresas no Ecossistema</h3>
                  <div className="space-y-4">
                    {companies.map(c => (
                  <div key={c.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-lg space-y-5 group hover:border-indigo-200 transition-all">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">🏢</div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm tracking-tight">{c.name}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{users.filter(u => u.company_id === c.id).length} colaboradores • {getUnitsByCompany(c.id).length} unidades</div>
                        </div>
                      </div>
                      <button onClick={() => { setEditingCompany(c); setIsCompanyModalOpen(true); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">✏️</button>
                    </div>
                    <div className="space-y-3">
                      {getUnitsByCompany(c.id).length > 0 ? getUnitsByCompany(c.id).map(unit => (
                        <div key={unit.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{unit.name}</div>
                            <div className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">{users.filter(user => user.productive_unit_id === unit.id).length} colaboradores</div>
                          </div>
                          <button onClick={() => { setEditingProductiveUnit(unit); setIsProductiveUnitModalOpen(true); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-cyan-600 hover:bg-white rounded-xl transition-all">✏️</button>
                        </div>
                      )) : <div className="p-4 bg-slate-50 rounded-2xl text-sm text-slate-400 font-bold">Nenhuma unidade produtiva cadastrada.</div>}
                    </div>
                  </div>
                ))}
                  </div>
                </div>
                <div className="bg-indigo-900 p-8 rounded-[40px] shadow-2xl text-white">
                  <h3 className="text-sm font-black text-indigo-200 uppercase tracking-widest mb-6">📡 Atividade de Rede</h3>
                  <div className="space-y-4">
                    {submissions.slice(0, 3).map(sub => (
                      <div key={sub.id} className="bg-white/10 p-4 rounded-xl border border-white/5 text-xs">
                        <span className="font-black text-indigo-300">{sub.user_name}</span> solicitou <span className="font-black text-white">{sub.badge_name}</span>
                      </div>
                    ))}
                    {submissions.length === 0 && <p className="text-xs text-indigo-300">Nenhuma atividade recente.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'submissions' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pedidos de Validação</h2>
              <div className="space-y-4">
                {submissions.filter(s => s.status === 'pending').map(sub => {
                  const user = users.find(u => u.id === sub.user_id);
                  const company = companies.find(c => c.id === user?.company_id);
                  return (
                    <div key={sub.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-lg flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{sub.badge_name}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {sub.user_name} • {company?.name || 'Independente'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl italic">"{sub.description}"</p>
                      </div>
                      <div className="flex md:flex-col gap-2 min-w-[140px]">
                        <button onClick={() => handleReviewSubmission(sub.id, 'approved')} className="bg-emerald-500 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all">Validar & Premiar</button>
                        <button onClick={() => handleReviewSubmission(sub.id, 'rejected')} className="bg-white text-rose-500 border border-rose-100 px-6 py-4 rounded-xl font-black text-[10px] uppercase hover:bg-rose-50 transition-all">Recusar</button>
                      </div>
                    </div>
                  );
                })}
                {submissions.filter(s => s.status === 'pending').length === 0 && (
                  <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                    <span className="text-5xl block mb-4">✅</span>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Fila de Solicitações Vazia</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Exploradores da Rede</h2>
                <div className="flex flex-wrap gap-2">
                  <select 
                    value={selectedCompanyFilter}
                    onChange={(e) => {
                      setSelectedCompanyFilter(e.target.value);
                      setSelectedProductiveUnitFilter('');
                    }}
                    className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-600 outline-none"
                  >
                    <option value="">Todas as Empresas</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select 
                    value={selectedProductiveUnitFilter}
                    onChange={(e) => setSelectedProductiveUnitFilter(e.target.value)}
                    className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-600 outline-none"
                  >
                    <option value="">Todas as Unidades</option>
                    {(selectedCompanyFilter ? getUnitsByCompany(selectedCompanyFilter) : productiveUnits).map(unit => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
                  </select>
                  <button onClick={() => setIsBulkInviteModalOpen(true)} className="bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2"><span>📨</span> Convites em Lote</button>
                  <button onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }} className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">+ Novo Explorador</button>
                </div>
              </div>
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-10 py-6">Nome / Empresa / Unidade</th>
                      <th className="px-10 py-6">NíResumo do M?s</th>
                      <th className="px-10 py-6 text-right">Opções</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map(u => {
                      const comp = companies.find(c => c.id === u.company_id);
                      const unit = productiveUnits.find(item => item.id === u.productive_unit_id);
                      const metrics = getUserMonthlyBadgeMetrics(u.id, userBadges);
                      return (
                        <tr key={u.id} className="group hover:bg-slate-50/50">
                          <td className="px-10 py-6">
                            <div className="font-bold text-slate-900 text-sm">{u.full_name}</div>
                            <div className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{comp?.name || 'Independente'}</div>
                            <div className="text-[10px] text-cyan-600 font-black uppercase tracking-widest">{unit?.name || 'Sem unidade produtiva'}</div>
                            <div className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{u.email}</div>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Saldo {metrics.monthlyScore}</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase">{metrics.positiveCount} selos</span>
                              <span className="text-[10px] font-black text-rose-500 uppercase">{metrics.lossCount} perdas</span>
                            </div>
                          </td>
                          <td className="px-10 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setViewingUserBadges(u)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl">ver conquistas</button>
                              <button onClick={() => { setEditingUser(u); setIsUserModalOpen(true); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">✏️</button>
                              <button onClick={() => { setUserToDelete(u); setIsDeleteUserModalOpen(true); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === 'award' && (
            <div className="space-y-8 animate-in fade-in">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Premiar Exploradores</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Recompense ações excepcionais em lote</p>
                </div>
                <div className="flex gap-2">
                  <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleExcelImport} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3"><span>📈</span> Importar Excel</button>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl flex flex-col min-h-[500px]">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">1. selecione exploradores</h3>
                    <div className="bg-slate-50 px-3 py-1 rounded-lg text-[10px] font-black text-indigo-600">{selectedUsers.length} selecionados</div>
                  </div>
                  <input type="text" placeholder="Buscar explorador..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm mb-6 outline-none focus:ring-2 focus:ring-indigo-600" />
                  <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {filteredUsers.map(u => (
                      <button key={u.id} onClick={() => toggleUserSelection(u.id)} className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedUsers.includes(u.id) ? 'bg-indigo-50 border-indigo-600 shadow-lg' : 'bg-white border-slate-50 hover:border-slate-200'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${selectedUsers.includes(u.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>👤</div>
                          <div className="text-left">
                            <div className="font-bold text-sm text-slate-900">{u.full_name}</div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nv {u.level} • {companies.find(c => c.id === u.company_id)?.name}</div>
                          </div>
                        </div>
                        {selectedUsers.includes(u.id) && <span className="text-xl">✅</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">2. Escolha a Recompensa</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {badges.map(badge => (
                        <button key={badge.id} onClick={() => setSelectedAwardBadge(badge.id)} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${selectedAwardBadge === badge.id ? 'bg-indigo-50 border-indigo-600 shadow-lg' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}>
                          <span className="text-3xl">{badge.icon_name}</span>
                          <div>
                            <div className="font-bold text-sm text-slate-900 leading-none mb-1">{badge.name}</div>
                            <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{badge.category}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">3. Escolha a marcacao do mes</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(['bronze', 'silver', 'gold', 'loss_1', 'loss_2'] as BadgeTone[]).map(tone => (
                        <button
                          key={tone}
                          onClick={() => setSelectedAwardTone(tone)}
                          className={`px-4 py-4 rounded-2xl border-2 text-left transition-all ${selectedAwardTone === tone ? 'border-indigo-600 bg-indigo-50 shadow-lg' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                        >
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{BADGE_TONE_LABELS[tone]}</div>
                          <div className="text-sm font-bold text-slate-900 mt-2">{badgeLegends[tone]}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 mb-4">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" checked={sendEmailOnAward} onChange={(e) => setSendEmailOnAward(e.target.checked)} className="h-4 w-4" />
                      Enviar notificação por e-mail aos colaboradores ao premiar
                    </label>
                  </div>
                  <div className="bg-indigo-900 p-10 rounded-[40px] shadow-2xl text-white text-center space-y-6">
                    <h3 className="text-sm font-black text-indigo-200 uppercase tracking-widest">3. Confirmar Premiação</h3>
                    <button onClick={handleAwardBadges} className="w-full py-6 bg-white text-indigo-900 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-50 transition-all disabled:opacity-50" disabled={selectedUsers.length === 0 || !selectedAwardBadge}>Conceder Selos Agora 🏆</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'badges' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center gap-4 flex-wrap">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Biblioteca de Selos</h2>
                <button onClick={() => { setEditingBadge(null); setIsBadgeModalOpen(true); }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">+ Novo Selo</button>
              </div>

              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setIsLegendCollapsed(prev => !prev)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Legenda das Cores</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">Bronze, prata, ouro e perdas em vermelho</div>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-600">{isLegendCollapsed ? 'Expandir' : 'Minimizar'}</span>
                </button>
                {!isLegendCollapsed && (
                  <div className="border-t border-slate-100 px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(['bronze', 'silver', 'gold', 'loss_1', 'loss_2'] as BadgeTone[]).map(tone => (
                      <label key={tone} className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{BADGE_TONE_LABELS[tone]}</span>
                        <input
                          value={badgeLegends[tone]}
                          onChange={(e) => handleLegendChange(tone, e.target.value)}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {badges.map(badge => (
                  <div key={badge.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">{badge.icon_name}</div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{badge.name}</div>
                        <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{badge.category}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingBadge(badge); setIsBadgeModalOpen(true); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">??</button>
                      <button onClick={() => { setBadgeToDelete(badge); setIsDeleteBadgeModalOpen(true); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">???</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'companies' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ecossistema Corporativo</h2>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingProductiveUnit(null); setIsProductiveUnitModalOpen(true); }} className="bg-cyan-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">+ Nova Unidade</button>
                  <button onClick={() => { setEditingCompany(null); setIsCompanyModalOpen(true); }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">+ Nova Empresa</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {companies.map(c => (
                  <div key={c.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-lg flex items-center justify-between group hover:border-indigo-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">🏢</div>
                      <div className="font-bold text-slate-900 text-sm tracking-tight">{c.name}</div>
                    </div>
                    <button onClick={() => { setEditingCompany(c); setIsCompanyModalOpen(true); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">✏️</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in duration-500">
          <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Olá, Comandante {adminProfile.full_name.split(' ')[0]}</h2>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Sua Própria Jornada de Qualidade</p>
            </div>
            <button onClick={onOpenSolicitation} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-xl flex items-center gap-3 transition-all active:scale-95">✨ Solicitar Meu Selo</button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-10">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl shadow-2xl shadow-indigo-200">🛡️</div>
                <div className="absolute -bottom-3 -right-3 bg-yellow-400 text-slate-900 min-w-[56px] h-12 px-3 rounded-2xl flex items-center justify-center font-black border-4 border-white text-sm">{adminMonthlyMetrics.monthlyScore}</div>
              </div>
              <div className="flex-1 w-full space-y-4">
                <div className="flex justify-between items-end">
                  <h3 className="text-2xl font-black text-slate-900">NíSaldo do m?s</h3>
                  <div className="text-sm font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">{adminMonthlyMetrics.positiveCount} selos / {adminMonthlyMetrics.lossCount} perdas</div>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-white"><div className="h-full bg-indigo-600" style={{ width: `${Math.min(100, Math.max(0, (adminMonthlyMetrics.positiveCount / 3) * 100))}%` }}></div></div>
              </div>
            </div>
            <div className="bg-indigo-600 p-10 rounded-[40px] shadow-xl shadow-indigo-200 text-white flex flex-col justify-center items-center text-center space-y-2">
              <div className="text-5xl font-black">{userBadges.filter(ub => ub.user_id === adminProfile.id).length}</div>
              <div className="font-black uppercase text-[10px] tracking-[0.3em] opacity-80">Selos Conquistados</div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Minha Galeria</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {badges.map(badge => {
                const badgeAward = userBadges.find(ub => ub.user_id === adminProfile.id && ub.badge_id === badge.id);
                return <BadgeCard key={badge.id} badge={badge} unlocked={Boolean(badgeAward)} tone={badgeAward?.tone} date={badgeAward?.awarded_at} />;
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Invite Modal */}
      {isBulkInviteModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Convites em Lote</h2>
            <form onSubmit={handleBulkInvite} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Empresa de Destino</label>
                <select 
                  value={bulkInviteCompanyId}
                  onChange={(e) => {
                    setBulkInviteCompanyId(e.target.value);
                    setBulkInviteProductiveUnitId('');
                  }}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-600 transition-all appearance-none"
                  required
                >
                  <option value="">Selecionar empresa...</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Unidade Produtiva</label>
                <select
                  value={bulkInviteProductiveUnitId}
                  onChange={(e) => setBulkInviteProductiveUnitId(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-600 transition-all appearance-none"
                >
                  <option value="">Selecionar unidade...</option>
                  {getUnitsByCompany(bulkInviteCompanyId).map(unit => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Lista de E-mails</label>
                <textarea 
                  value={bulkInviteEmails}
                  onChange={(e) => setBulkInviteEmails(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 min-h-[160px] outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  placeholder="Insira um e-mail por linha ou separados por vírgula..."
                  required
                ></textarea>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 px-1 tracking-widest">E-mails inválidos serão ignorados automaticamente.</p>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsBulkInviteModalOpen(false)} className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
                <button type="submit" className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-emerald-600 text-white rounded-2xl shadow-xl hover:bg-emerald-700 transition-all">Enviar Convites 📨</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">{editingUser ? 'Editar Explorador' : 'Novo Explorador'}</h2>
            <form onSubmit={handleSaveUser} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Completo</label>
                <input name="full_name" defaultValue={editingUser?.full_name} style={{ textTransform: 'none' }} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" placeholder="Ex: João Silva" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail Corporativo</label>
                <input name="email" type="email" defaultValue={editingUser?.email} style={{ textTransform: 'none' }} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" placeholder="Ex: joao@empresa.com" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Função</label>
                  <select name="role" defaultValue={editingUser?.role || 'user'} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900">
                    <option value="user">Explorador</option>
                    <option value="admin">Comandante</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Empresa</label>
                  <select name="company_id" defaultValue={editingUser?.company_id || ''} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900">
                    <option value="">Nenhuma (Independente)</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade Produtiva</label>
                  <select name="productive_unit_id" defaultValue={editingUser?.productive_unit_id || ''} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900">
                    <option value="">Nenhuma</option>
                    {productiveUnits.map(unit => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setIsUserModalOpen(false); setEditingUser(null); }} className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
                <button type="submit" className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">{editingUser ? 'Atualizar' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {isDeleteUserModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="text-5xl mb-6">⚠️</div>
            <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Excluir Explorador?</h2>
            <p className="text-slate-500 text-sm mb-8">Esta ação removerá <b>{userToDelete?.full_name}</b> e todo seu histórico de conquistas permanentemente.</p>
            <div className="flex gap-4">
              <button onClick={() => { setIsDeleteUserModalOpen(false); setUserToDelete(null); }} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
              <button onClick={handleDeleteUser} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-rose-600 text-white rounded-2xl shadow-xl hover:bg-rose-700 transition-all">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Badge Modal */}
      {isBadgeModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">{editingBadge ? 'Editar Selo' : 'Novo Selo'}</h2>
            <form onSubmit={handleSaveBadge} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome da Conquista</label>
                <input name="name" defaultValue={editingBadge?.name} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição da Missão</label>
                <textarea name="description" defaultValue={editingBadge?.description} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 min-h-[100px] text-slate-900" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legenda de apoio</label>
                  <input name="points" type="number" defaultValue={editingBadge?.points} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-center text-slate-900" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ícone (Emoji)</label>
                  <input name="icon_name" defaultValue={editingBadge?.icon_name} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-3xl text-center outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria Operacional</label>
                <select name="category" defaultValue={editingBadge?.category} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsBadgeModalOpen(false)} className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
                <button type="submit" className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">{editingBadge ? 'Atualizar' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Badge Confirmation Modal */}
      {isDeleteBadgeModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="text-5xl mb-6">⚠️</div>
            <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Excluir Selo?</h2>
            <p className="text-slate-500 text-sm mb-8">O selo <b>{badgeToDelete?.name}</b> será removido permanentemente da biblioteca.</p>
            <div className="flex gap-4">
              <button onClick={() => { setIsDeleteBadgeModalOpen(false); setBadgeToDelete(null); }} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
              <button onClick={handleDeleteBadge} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-rose-600 text-white rounded-2xl shadow-xl hover:bg-rose-700 transition-all">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Company Modal */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">{editingCompany ? 'editar empresa' : 'nova empresa'}</h2>
            <form onSubmit={handleSaveCompany} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">nome da organização</label>
                <input name="name" defaultValue={editingCompany?.name} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsCompanyModalOpen(false)} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">cancelar</button>
                <button type="submit" className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700">{editingCompany ? 'atualizar' : 'cadastrar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isProductiveUnitModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">{editingProductiveUnit ? 'editar unidade produtiva' : 'nova unidade produtiva'}</h2>
            <form onSubmit={handleSaveProductiveUnit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">empresa</label>
                <select name="company_id" defaultValue={editingProductiveUnit?.company_id || ''} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required>
                  <option value="">Selecionar empresa...</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">nome da unidade</label>
                <input name="name" defaultValue={editingProductiveUnit?.name} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setIsProductiveUnitModalOpen(false); setEditingProductiveUnit(null); }} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">cancelar</button>
                <button type="submit" className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-cyan-600 text-white rounded-2xl shadow-xl hover:bg-cyan-700">{editingProductiveUnit ? 'atualizar' : 'cadastrar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">pré-visualização da importação</h2>
            <div className="flex-1 overflow-y-auto pr-2 border border-slate-100 rounded-3xl">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <tr><th className="px-6 py-4">explorador</th><th className="px-6 py-4">empresa</th><th className="px-6 py-4">selo</th><th className="px-6 py-4">status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {importPreviews.map((p, idx) => (
                    <tr key={idx} className={`text-xs ${p.status === 'invalid' ? 'bg-rose-50/30' : ''}`}>
                      <td className="px-6 py-4"><div className="font-bold text-slate-900">{p.row.explorador}</div>{p.user && <div className="text-[9px] text-emerald-600 font-black uppercase">vincular: {p.user.full_name}</div>}</td>
                      <td className="px-6 py-4 text-slate-500 font-bold">{p.row.empresa}</td>
                      <td className="px-6 py-4"><div className="font-bold text-slate-900">{p.row.selo}</div>{p.badge && <div className="text-[9px] text-indigo-600 font-black uppercase">selo: {p.badge.name}</div>}</td>
                      <td className="px-6 py-4">{p.status === 'valid' ? <span className="text-emerald-700 font-black uppercase">válido</span> : <span className="text-rose-700 font-black uppercase">{p.reason}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pt-8 flex gap-4">
              <button onClick={() => setIsImportModalOpen(false)} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">cancelar</button>
              <button onClick={finalizeImport} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700">processar importações</button>
            </div>
          </div>
        </div>
      )}

      {/* User Badges Viewing Modal */}
      {viewingUserBadges && (() => {
        const companyName = companies.find(c => c.id === viewingUserBadges.company_id)?.name || 'Independente';
        const unitName = productiveUnits.find(unit => unit.id === viewingUserBadges.productive_unit_id)?.name || 'Sem unidade produtiva';
        const metrics = getUserMonthlyBadgeMetrics(viewingUserBadges.id, userBadges);

        return (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-6xl rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cartela de selos de {viewingUserBadges.full_name}</h2>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">
                    {companyName} - {unitName}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="bg-indigo-50 text-indigo-600 px-4 py-3 rounded-2xl text-center min-w-[120px]">
                    <div className="text-xl font-black">{metrics.monthlyScore}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest">saldo do mes</div>
                  </div>
                  <div className="bg-amber-50 text-amber-700 px-4 py-3 rounded-2xl text-center min-w-[120px]">
                    <div className="text-xl font-black">{metrics.positiveCount}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest">selos ativos</div>
                  </div>
                  <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-2xl text-center min-w-[120px]">
                    <div className="text-xl font-black">{metrics.lossCount}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest">perdas</div>
                  </div>
                </div>
              </div>
              <div className="overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {badges.map(badge => {
                  const badgeAward = userBadges.find(ub => ub.user_id === viewingUserBadges.id && ub.badge_id === badge.id);
                  const isAssigned = Boolean(badgeAward);

                  return (
                    <div key={badge.id} className="p-6 rounded-[32px] border border-slate-100 bg-slate-50/70">
                      <BadgeCard badge={badge} unlocked={isAssigned} tone={badgeAward?.tone} date={badgeAward?.awarded_at} />
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {(['bronze', 'silver', 'gold', 'loss_1', 'loss_2'] as BadgeTone[]).map(tone => (
                            <button
                              key={tone}
                              onClick={() => handleAssignBadgeToUser(viewingUserBadges.id, badge.id, tone)}
                              className={`px-3 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${badgeAward?.tone === tone ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                            >
                              {BADGE_TONE_LABELS[tone]}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {badgeLegends[badgeAward?.tone || 'bronze']}
                        </p>
                        {isAssigned && (
                          <button onClick={() => handleRemoveBadgeFromUser(viewingUserBadges.id, badge.id)} className="w-full py-3 rounded-2xl bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all">
                            limpar da cartela
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setViewingUserBadges(null)} className="mt-10 w-full py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">fechar</button>
            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default AdminPanel;
