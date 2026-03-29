import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import SolicitationModal from './components/SolicitationModal';
import { Profile, Badge, Company, ProductiveUnit, BadgeLegendSettings, BadgeSubmission, UserBadge } from './types';

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
  { id: 'admin-1', email: 'admin@test.com', password: 'admin123', full_name: 'Comandante Supremo', role: 'admin', level: 99, xp: 100000, created_at: new Date().toISOString() },
  { id: 'u1', email: 'joao@acme.com', password: 'joao123', full_name: 'João Silva', role: 'user', company_id: 'c1', productive_unit_id: 'pu1', level: 5, xp: 5200, created_at: '2023-01-01' },
  { id: 'u2', email: 'ana@acme.com', password: 'ana123', full_name: 'Ana Costa', role: 'user', company_id: 'c1', productive_unit_id: 'pu2', level: 3, xp: 3100, created_at: '2023-02-15' },
  { id: 'u3', email: 'bob@builders.com', password: 'bob123', full_name: 'Bob Construtor', role: 'user', company_id: 'c2', productive_unit_id: 'pu3', level: 10, xp: 10500, created_at: '2022-11-20' },
];

const INITIAL_BADGE_LEGENDS: BadgeLegendSettings = {
  bronze: 'Bronze: 1 selo no mês',
  silver: 'Prata: 2 selos no mês',
  gold: 'Ouro: 3 selos ou mais no mês',
  loss_1: 'Vermelho: perda de 1 selo',
  loss_2: 'Vermelho intenso: perda de 2 selos',
};

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

  useEffect(() => {
    const savedUser = localStorage.getItem('quest_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      const updatedUser = users.find(u => u.id === parsed.id) || parsed;
      setUser(updatedUser);
    }
    setLoading(false);
  }, [users]);

  const handleLogin = (email: string, password: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!existingUser) {
      return { success: false, message: 'Usuário não encontrado. Faça cadastro primeiro.' };
    }

    if (existingUser.password !== password) {
      return { success: false, message: 'Senha incorreta para este email.' };
    }

    setUser(existingUser);
    localStorage.setItem('quest_user', JSON.stringify(existingUser));
    setAdminViewMode('management');
    return { success: true };
  };

  const handleRegister = (email: string, password: string, full_name: string) => {
    const normalizedEmail = email.toLowerCase().trim();

    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false, message: 'Email já cadastrado. Faça login.' };
    }

    const newUser: Profile = {
      id: Math.random().toString(36).substr(2, 9),
      email: normalizedEmail,
      password,
      full_name: full_name.trim() || normalizedEmail.split('@')[0],
      role: normalizedEmail.includes('admin') ? 'admin' : 'user',
      level: 1,
      xp: 0,
      created_at: new Date().toISOString(),
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem('quest_user', JSON.stringify(newUser));
    setAdminViewMode('management');

    return { success: true };
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('quest_user');
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleAddSubmission = (submission: BadgeSubmission) => {
    setSubmissions(prev => [submission, ...prev]);
  };

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
            />
          )}

          <main className={`flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300 ${user ? 'md:ml-64 pb-24 md:pb-8' : ''}`}>
            <Routes>
              <Route
                path="/"
                element={
                  user
                    ? (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)
                    : <Login onLogin={handleLogin} />
                }
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
                      onOpenSolicitation={() => setIsSolicitationOpen(true)}
                    />
                  ) : <Navigate to="/" />
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
                  ) : <Navigate to="/" />
                }
              />
              <Route
                path="/ranking"
                element={user ? <Ranking users={users} badges={badges} userBadges={userBadges} badgeLegends={badgeLegends} /> : <Navigate to="/" />}
              />
              <Route path="/overview" element={user ? <Overview /> : <Navigate to="/" />} />
              <Route path="/global-ranking" element={user ? <GlobalRanking /> : <Navigate to="/" />} />
              <Route path="/award-badges" element={user ? <AwardBadges /> : <Navigate to="/" />} />
              <Route path="/requests" element={user ? <Requests /> : <Navigate to="/" />} />
              <Route path="/explorers" element={user ? <Explorers /> : <Navigate to="/" />} />
              <Route path="/library" element={user ? <Library /> : <Navigate to="/" />} />
              <Route path="/companies" element={user ? <CompaniesPage /> : <Navigate to="/" />} />
              <Route path="/settings" element={user ? <Settings /> : <Navigate to="/" />} />
              <Route
                path="/admin/*"
                element={
                  user?.role === 'admin' ? (
                    <AdminPanel
                      activeMode={adminViewMode}
                      setActiveMode={setAdminViewMode}
                      badges={badges}
                      setBadges={setBadges}
                      companies={companies}
                      setCompanies={setCompanies}
                      productiveUnits={productiveUnits}
                      setProductiveUnits={setProductiveUnits}
                      badgeLegends={badgeLegends}
                      setBadgeLegends={setBadgeLegends}
                      users={users}
                      setUsers={setUsers}
                      userBadges={userBadges}
                      setUserBadges={setUserBadges}
                      submissions={submissions}
                      setSubmissions={setSubmissions}
                      onOpenSolicitation={() => setIsSolicitationOpen(true)}
                    />
                  ) : <Navigate to="/" />
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
