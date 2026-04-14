import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Ranking from './pages/Ranking';
import UserBadgesPage from './pages/UserBadgesPage';
import Overview from './pages/Overview';
import GlobalRanking from './pages/GlobalRanking';
import AwardBadges from './pages/AwardBadges';
import Requests from './pages/Requests';
import Explorers from './pages/Explorers';
import Library from './pages/Library';
import CompaniesPage from './pages/CompaniesPage';
import CompanyUnitsPage from './pages/CompanyUnitsPage';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import SolicitationModal from './components/SolicitationModal';
import './index.css';
import { Profile, Badge, Company, ProductiveUnit, BadgeLegendSettings, BadgeSubmission, UserBadge, ImportSourceConfig, ImportBindingSnapshot } from './types';
import { awardBadgesWithApi, bulkInviteUsersWithApi, createSubmissionWithApi, deleteBadgeWithApi, deleteCompanyWithApi, deleteUserWithApi, fetchBootstrapData, fetchCurrentUser, loginWithApi, logoutWithApi, persistImportRunWithApi, registerWithApi, removeUserBadgeWithApi, reviewSubmissionWithApi, saveBadgeWithApi, saveCompanyWithApi, saveImportSourceWithApi, saveProductiveUnitWithApi, saveUserWithApi } from './utils/api';

const INITIAL_BADGES: Badge[] = [
  { id: '1', name: 'Mestre de Processos', description: 'Documentou 10 processos sem erros', icon_name: '\u{1F4CB}', category: 'Qualidade', points: 50 },
  { id: '2', name: 'Segurança em Primeiro Lugar', description: 'Zero incidentes por 30 dias consecutivos', icon_name: '\u{1F9BA}', category: 'Segurança', points: 30 },
  { id: '3', name: 'Ninja da Eficiência', description: 'Reduziu desperdícios em 15% na produção', icon_name: '\u{1F977}', category: 'Eficiência', points: 40 },
  { id: '4', name: 'Herói do Cliente', description: 'Recebeu 5 feedbacks positivos de clientes', icon_name: '\u{1F9B8}', category: 'Serviço', points: 20 },
];

const INITIAL_COMPANIES: Company[] = [
  { id: 'c1', name: 'Acme Corp' },
  { id: 'c2', name: 'Builders Ltda' },
];

const INITIAL_PRODUCTIVE_UNITS: ProductiveUnit[] = [
  { id: 'pu1', name: 'Fábrica Campinas', company_id: 'c1' },
  { id: 'pu2', name: 'Centro de Distribuição SP', company_id: 'c1' },
  { id: 'pu3', name: 'Obra Matriz', company_id: 'c2' },
];

const INITIAL_USERS: Profile[] = [
  { id: 'admin-1', email: 'admin@test.com', full_name: 'Gestor Supremo', role: 'admin', level: 99, xp: 100000, created_at: new Date().toISOString(), email_verified: true },
  { id: 'dev-1', email: 'alo.de.castro@hotmail.com', full_name: 'Alo de Castro', role: 'developer', level: 99, xp: 100000, created_at: new Date().toISOString(), email_verified: true },
  { id: 'u1', email: 'joao@acme.com', full_name: 'João Silva', role: 'user', company_id: 'c1', productive_unit_id: 'pu1', level: 5, xp: 5200, created_at: '2023-01-01', email_verified: true },
];

const INITIAL_BADGE_LEGENDS: BadgeLegendSettings = {
  bronze: 'Bronze: 1 selo no mês',
  silver: 'Prata: 2 selos no mês',
  gold: 'Ouro: 3 selos ou mais no mês',
  loss_1: 'Vermelho: perda de 1 selo',
  loss_2: 'Vermelho intenso: perda de 2 selos',
};

const INITIAL_IMPORT_SOURCES: ImportSourceConfig[] = [
  {
    id: 'source-default',
    name: 'Planilha Operacional',
    description: 'Modelo base para importar empresa, unidade, colaborador e selo.',
    columns: {
      company: 'empresa',
      productive_unit: 'unidade_produtiva',
      user: 'colaborador',
      badge: 'selo',
      tone: 'marcacao',
      award: 'premio',
    },
  },
];

const App: React.FC = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminViewMode, setAdminViewMode] = useState<'management' | 'personal'>('management');
  const [isSolicitationOpen, setIsSolicitationOpen] = useState(false);

  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [productiveUnits, setProductiveUnits] = useState<ProductiveUnit[]>(INITIAL_PRODUCTIVE_UNITS);
  const [users, setUsers] = useState<Profile[]>(INITIAL_USERS);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [badgeLegends, setBadgeLegends] = useState<BadgeLegendSettings>(INITIAL_BADGE_LEGENDS);
  const [submissions, setSubmissions] = useState<BadgeSubmission[]>([]);
  const [importSources, setImportSources] = useState<ImportSourceConfig[]>(INITIAL_IMPORT_SOURCES);
  const [importBindingSnapshot, setImportBindingSnapshot] = useState<ImportBindingSnapshot | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const initializeBootstrap = async () => {
      try {
        const [bootstrap, currentUser] = await Promise.all([
          fetchBootstrapData(),
          fetchCurrentUser(),
        ]);
        if (!isMounted) return;

        if (bootstrap) {
          setBadges(bootstrap.badges || INITIAL_BADGES);
          setCompanies(bootstrap.companies || INITIAL_COMPANIES);
          setProductiveUnits(bootstrap.productiveUnits || INITIAL_PRODUCTIVE_UNITS);
          setBadgeLegends(bootstrap.badgeLegends || INITIAL_BADGE_LEGENDS);
          setImportSources(bootstrap.importSources || INITIAL_IMPORT_SOURCES);
          setUsers(bootstrap.users || INITIAL_USERS);
          setUserBadges(bootstrap.userBadges || []);
          setSubmissions(bootstrap.submissions || []);
        }

        if (currentUser) {
          setUser(currentUser);
          setUsers(prev =>
            prev.some(existingUser => existingUser.id === currentUser.id)
              ? prev.map(existingUser => (existingUser.id === currentUser.id ? { ...existingUser, ...currentUser } : existingUser))
              : [...prev, currentUser],
          );
        }
      } catch (error) {
        console.warn('Falha ao carregar dados iniciais da API. Mantendo fallback local.', error);
        // Garantir que o estado tenha valores padrão em caso de erro
        setBadges(INITIAL_BADGES);
        setCompanies(INITIAL_COMPANIES);
        setProductiveUnits(INITIAL_PRODUCTIVE_UNITS);
        setBadgeLegends(INITIAL_BADGE_LEGENDS);
        setImportSources(INITIAL_IMPORT_SOURCES);
        setUser(INITIAL_USERS.find(u => u.role === 'developer') || null);
        setUserBadges([]);
        setSubmissions([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeBootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async (email: string, password: string) => {
  try {
    const authenticatedUser = await loginWithApi(email, password);

    console.log('LOGIN RESULT:', authenticatedUser); // 👈 AQUI

    setUser(authenticatedUser);

    setUsers(prev =>
      prev.some(existingUser => existingUser.id === authenticatedUser.id)
        ? prev.map(existingUser =>
            existingUser.id === authenticatedUser.id
              ? { ...existingUser, ...authenticatedUser }
              : existingUser
          )
        : [...prev, authenticatedUser],
    );

    setAdminViewMode('management');

    return { success: true };
  } catch (error) {
    console.error('LOGIN ERROR:', error); // 👈 adiciona isso também

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Não foi possível fazer login.',
    };
  }
};

  const handleRegister = async (email: string, password: string, full_name: string) => {
    try {
      const registeredUser = await registerWithApi(email, password, full_name);
      setUser(registeredUser);
      setUsers(prev =>
        prev.some(existingUser => existingUser.id === registeredUser.id)
          ? prev.map(existingUser => (existingUser.id === registeredUser.id ? { ...existingUser, ...registeredUser } : existingUser))
          : [...prev, registeredUser],
      );
      setAdminViewMode('management');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Falha no cadastro.',
      };
    }
  };

  const handleLogout = async () => {
    await logoutWithApi();
    setUser(null);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleAddSubmission = async (badgeId: string, description: string) => {
    const submission = await createSubmissionWithApi(badgeId, description);
    setSubmissions(prev => [submission, ...prev]);
  };

  const handleReviewSubmission = async (submissionId: string, status: 'approved' | 'rejected') => {
    const result = await reviewSubmissionWithApi(submissionId, status);
    setSubmissions(prev => prev.map(submission => (
      submission.id === submissionId ? { ...submission, ...result.submission } : submission
    )));

    if (result.awardedBadge) {
      setUserBadges(prev => { 
        const filtered = prev.filter(
          badge => !(result.awardedBadge && badge.user_id === result.awardedBadge.user_id && badge.badge_id === result.awardedBadge.badge_id),
        );
        return [...filtered, result.awardedBadge as UserBadge];
      });
    }
  };

  const handleSaveBadge = async (badge: Badge) => saveBadgeWithApi(badge);

  const handleDeleteBadge = async (badgeId: string) => {
    await deleteBadgeWithApi(badgeId);
  };

  const handleDeleteCompany = async (companyId: string) => {
    await deleteCompanyWithApi(companyId);
  };

  const handleSaveCompany = async (company: Company) => saveCompanyWithApi(company);

  const handleSaveProductiveUnit = async (productiveUnit: ProductiveUnit) =>
    saveProductiveUnitWithApi(productiveUnit);

  const handleSaveUser = async (profile: Profile, password?: string) => saveUserWithApi(profile, password);

  const handleBulkInviteUsers = async (emails: string[], companyId?: string, productiveUnitId?: string) =>
    bulkInviteUsersWithApi(emails, companyId, productiveUnitId);

  const handleDeleteUser = async (userId: string) => {
    await deleteUserWithApi(userId);
  };

  const handleSaveImportSource = async (importSource: ImportSourceConfig) => saveImportSourceWithApi(importSource);

  const handleAwardBadges = async (userIds: string[], badgeId: string, tone: 'bronze' | 'silver' | 'gold' | 'loss_1' | 'loss_2') => {
    const awardedBadges = await awardBadgesWithApi(userIds, badgeId, tone);
    setUserBadges(prev => {
      const filtered = prev.filter(existing =>
        !awardedBadges.some(awarded => awarded.user_id === existing.user_id && awarded.badge_id === existing.badge_id),
      );
      return [...filtered, ...awardedBadges];
    });
  };

  const handleRemoveUserBadge = async (userId: string, badgeId: string) => {
    await removeUserBadgeWithApi(userId, badgeId);
    setUserBadges(prev => prev.filter(badge => !(badge.user_id === userId && badge.badge_id === badgeId)));
  };

  const handlePersistImport = async (
    sourceId: string,
    sourceName: string,
    matchedColumns: Partial<Record<string, string>>,
    rows: Array<{ row: Record<string, string>; user_id?: string; badge_id?: string; tone: 'bronze' | 'silver' | 'gold' | 'loss_1' | 'loss_2'; status: 'valid' | 'invalid'; reason?: string }>,
  ) => {
    const result = await persistImportRunWithApi(sourceId, sourceName, matchedColumns, rows);
    setUserBadges(prev => {
      const filtered = prev.filter(existing =>
        !result.awardedBadges.some(awarded => awarded.user_id === existing.user_id && awarded.badge_id === existing.badge_id),
      );
      return [...filtered, ...result.awardedBadges];
    });
    setImportBindingSnapshot(result.bindingSnapshot);
    return result.summary.valid;
  };

  const visibleCompanies = useMemo(() => {
  if (!user) return [];

  if (user.role === 'developer') {
    return companies;
  }

  if (user.role === 'admin' || user.role === 'user') {
    return companies.filter((company) => company.id === user.company_id);
  }

  return [];
}, [companies, user]);

  const visibleProductiveUnits = useMemo(() => {
  if (!user) return [];

  if (user.role === 'developer') {
    return productiveUnits;
  }

  return productiveUnits.filter(
    (unit) => unit.company_id === user.company_id
  );
}, [productiveUnits, user]);

  const visibleUsers = useMemo(() => {
  if (!user) return [];

  if (user.role === 'developer') {
    return users;
  }

  return users.filter(
    (profile) => profile.company_id === user.company_id
  );
}, [users, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <div className="animate-bounce text-indigo-600 font-bold text-xl uppercase tracking-widest">Carregando jornada...</div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {user && <Navbar user={user} userBadges={userBadges} onLogout={handleLogout} onToggleSidebar={toggleSidebar} />}

        <div className="flex flex-1 overflow-hidden relative">
          {user && (
            <Sidebar
              user={user}
              userBadges={userBadges}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              adminViewMode={adminViewMode}
              setAdminViewMode={setAdminViewMode}
              companies={visibleCompanies}
              productiveUnits={visibleProductiveUnits}
            />
          )}

          <main className={`flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300 ${user ? 'md:ml-64 pb-24 md:pb-8' : ''}`}>
            <Routes>
              <Route
                path="/"
                element={
                  user
                    ? (user.role === 'admin' || user.role === 'developer' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)
                    : <Landing />
                }
              />
              <Route
                path="/login"
                element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
              />
              <Route
                path="/register"
                element={user ? <Navigate to="/" /> : <Register onRegister={handleRegister} />}
              />
              <Route
                path="/dashboard"
                element={
                  user ? (
                    <Dashboard
                      user={user}
                      allBadges={badges}
                      userBadges={userBadges}
                      badgeLegends={badgeLegends}
                      submissions={submissions}
                      users={visibleUsers}
                      companies={visibleCompanies}
                      productiveUnits={visibleProductiveUnits}
                      importSources={importSources}
                      importBindingSnapshot={importBindingSnapshot}
                      onOpenSolicitation={() => setIsSolicitationOpen(true)}
                    />
                  ) : <Navigate to="/login" />
                }
              />
              <Route
                path="/badges"
                element={
                  user ? (
                    <UserBadgesPage
                      user={user}
                      allBadges={badges}
                      userBadges={userBadges}
                      badgeLegends={badgeLegends}
                      submissions={submissions}
                    />
                  ) : <Navigate to="/login" />
                }
              />
              <Route
                path="/ranking"
                element={user ? <Ranking users={visibleUsers} badges={badges} userBadges={userBadges} badgeLegends={badgeLegends} /> : <Navigate to="/login" />}
              />
              <Route path="/overview" element={user ? <Overview /> : <Navigate to="/login" />} />
              <Route path="/global-ranking" element={user ? <GlobalRanking /> : <Navigate to="/login" />} />
              <Route path="/award-badges" element={user ? <AwardBadges /> : <Navigate to="/login" />} />
              <Route path="/requests" element={user ? <Requests /> : <Navigate to="/login" />} />
              <Route path="/explorers" element={user ? <Explorers /> : <Navigate to="/login" />} />
              <Route path="/library" element={user ? <Library /> : <Navigate to="/login" />} />
              <Route path="/companies" element={user ? <CompaniesPage companies={visibleCompanies} /> : <Navigate to="/login" />} />
              <Route path="/empresas" element={user ? <CompaniesPage companies={visibleCompanies} /> : <Navigate to="/login" />} />
              <Route path="/empresas/:companyId" element={user ? <CompanyUnitsPage companies={visibleCompanies} users={visibleUsers} currentUser={user} /> : <Navigate to="/login" />} />
              <Route path="/settings" element={user ? <Settings user={user} setUser={setUser} /> : <Navigate to="/login" />} />
              <Route
                path="/admin/*"
                element={
                  user?.role === 'admin' || user?.role === 'developer' ? (
                    <AdminPanel
                      activeMode={adminViewMode}
                      setActiveMode={setAdminViewMode}
                      badges={badges}
                      setBadges={setBadges}
                      currentUser={user}
                      companies={visibleCompanies}
                      setCompanies={setCompanies}
                      productiveUnits={visibleProductiveUnits}
                      setProductiveUnits={setProductiveUnits}
                      badgeLegends={badgeLegends}
                      setBadgeLegends={setBadgeLegends}
                      importSources={importSources}
                      setImportSources={setImportSources}
                      setImportBindingSnapshot={setImportBindingSnapshot}
                      users={visibleUsers}
                      setUsers={setUsers}
                      userBadges={userBadges}
                      setUserBadges={setUserBadges}
                      submissions={submissions}
                      setSubmissions={setSubmissions}
                      onSaveBadge={handleSaveBadge}
                      onDeleteBadge={handleDeleteBadge}
                      onSaveCompany={handleSaveCompany}
                      onDeleteCompany={handleDeleteCompany}
                      onSaveProductiveUnit={handleSaveProductiveUnit}
                      onSaveUser={handleSaveUser}
                      onBulkInviteUsers={handleBulkInviteUsers}
                      onDeleteUser={handleDeleteUser}
                      onSaveImportSource={handleSaveImportSource}
                      onAwardBadges={handleAwardBadges}
                      onRemoveUserBadge={handleRemoveUserBadge}
                      onPersistImport={handlePersistImport}
                      onReviewSubmission={handleReviewSubmission}
                      onOpenSolicitation={() => setIsSolicitationOpen(true)}
                    />
                  ) : <Navigate to="/login" />
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          {user && (
            <BottomNav
              user={user}
              adminViewMode={adminViewMode}
              onOpenSolicitation={() => setIsSolicitationOpen(true)}
            />
          )}

          {user && (
            <SolicitationModal
              isOpen={isSolicitationOpen}
              onClose={() => setIsSolicitationOpen(false)}
              user={user}
              allBadges={badges}
              userBadges={userBadges}
              onAddSubmission={handleAddSubmission}
            />
          )}
        </div>
      </div>
    </HashRouter>
  );
};

export default App;

