import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from '@/features/auth/pages/Landing';
import Login from '@/features/auth/pages/Login';
import Register from '@/features/auth/pages/Register';
import Dashboard from '@/features/dashboard/pages/Dashboard';
import AdminPanel from '@/features/admin/pages/AdminPanel';
import Ranking from '@/features/ranking/pages/Ranking';
import UserBadgesPage from '@/features/badges/pages/UserBadgesPage';
import Overview from '@/features/dashboard/pages/Overview';
import GlobalRanking from '@/features/ranking/pages/GlobalRanking';
import AwardBadges from '@/features/admin/pages/AwardBadges';
import Requests from '@/features/admin/pages/Requests';
import Explorers from '@/features/admin/pages/Explorers';
import Library from '@/features/admin/pages/Library';
import Settings from '@/features/settings/pages/Settings';
import UnitsPage from '@/features/admin/pages/UnitsPage';
import Navbar from '@/shared/components/Navbar';
import Sidebar from '@/shared/components/Sidebar';
import BottomNav from '@/shared/components/BottomNav';
import SolicitationModal from '@/features/badges/components/SolicitationModal';
import ToastContainer from '@/shared/components/ToastContainer';
import '@/index.css';
import { useAuth } from '@/shared/contexts/AuthContext';


const App: React.FC = () => {
  const { user, setUser, isAuthLoading, login, register, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminViewMode, setAdminViewMode] = useState<'management' | 'personal'>('management');
  const [isSolicitationOpen, setIsSolicitationOpen] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      setAdminViewMode('management');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Não foi possível fazer login.',
      };
    }
  };

  const handleRegister = async (email: string, password: string, full_name: string) => {
    try {
      await register(email, password, full_name);
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
    await logout();
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-primary-light">
        <div className="text-brand-primary font-bold text-xl uppercase tracking-widest">Carregando...</div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {user && <Navbar user={user} onLogout={handleLogout} onToggleSidebar={toggleSidebar} />}

        <div className="flex flex-1 overflow-hidden relative">
          {user && (
            <Sidebar
              user={user}
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
                    ? (['admin', 'developer', 'supervisor'].includes(user.role) ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)
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
                      onOpenSolicitation={() => setIsSolicitationOpen(true)}
                    />
                  ) : <Navigate to="/login" />
                }
              />
              <Route
                path="/badges"
                element={
                  user ? (
                    <UserBadgesPage />
                  ) : <Navigate to="/login" />
                }
              />
              <Route
                path="/ranking"
                element={user ? <Ranking /> : <Navigate to="/login" />}
              />
              <Route path="/overview" element={user ? <Overview /> : <Navigate to="/login" />} />
              <Route path="/global-ranking" element={user ? <GlobalRanking /> : <Navigate to="/login" />} />
              <Route path="/award-badges" element={user ? <AwardBadges /> : <Navigate to="/login" />} />
              <Route path="/requests" element={user ? <Requests /> : <Navigate to="/login" />} />
              <Route path="/explorers" element={user ? <Explorers /> : <Navigate to="/login" />} />
              <Route path="/library" element={user ? <Library /> : <Navigate to="/login" />} />
              <Route path="/units" element={user ? <UnitsPage /> : <Navigate to="/login" />} />
              <Route path="/settings" element={user ? <Settings user={user} setUser={setUser} /> : <Navigate to="/login" />} />
              <Route
                path="/admin/*"
                element={
                  user?.role && ['admin', 'developer', 'supervisor'].includes(user.role) ? (
                    <AdminPanel
                      activeMode={adminViewMode}
                      setActiveMode={setAdminViewMode}
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
            />
          )}
        </div>
      </div>
      <ToastContainer />
    </HashRouter>
  );
};

export default App;
