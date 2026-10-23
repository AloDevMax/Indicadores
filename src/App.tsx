import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/features/auth/pages/Login';
import Dashboard from '@/features/dashboard/pages/Dashboard';
import AdminPanel from '@/features/admin/pages/AdminPanel';
import Ranking from '@/features/ranking/pages/Ranking';
import UserBadgesPage from '@/features/badges/pages/UserBadgesPage';
import Settings from '@/features/settings/pages/Settings';
import Navbar from '@/shared/components/Navbar';
import Sidebar from '@/shared/components/Sidebar';
import BottomNav from '@/shared/components/BottomNav';
import SolicitationModal from '@/features/badges/components/SolicitationModal';
import ToastContainer from '@/shared/components/ToastContainer';
import '@/index.css';
import { useAuth } from '@/shared/contexts/AuthContext';


const App: React.FC = () => {
  const { user, setUser, isAuthLoading, login, logout } = useAuth();
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

  // Senha emitida pelo admin: até ser trocada, só a página Meu perfil fica disponível.
  const isPasswordChangeRequired = Boolean(user?.must_change_password);
  const hasFullAccess = Boolean(user) && !isPasswordChangeRequired;

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {user && <Navbar user={user} onLogout={handleLogout} onToggleSidebar={toggleSidebar} />}

        <div className="flex flex-1 overflow-hidden relative">
          {user && hasFullAccess && (
            <Sidebar
              user={user}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              adminViewMode={adminViewMode}
              setAdminViewMode={setAdminViewMode}
            />
          )}

          <main className={`flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300 ${hasFullAccess ? 'md:ml-64 pb-24 md:pb-8' : ''}`}>
            {user && isPasswordChangeRequired ? (
              <Routes>
                <Route path="/settings" element={<Settings user={user} setUser={setUser} />} />
                <Route path="*" element={<Navigate to="/settings" replace />} />
              </Routes>
            ) : (
            <Routes>
              <Route
                path="/"
                element={
                  user
                    ? (['admin', 'developer', 'supervisor'].includes(user.role) ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)
                    : <Navigate to="/login" />
                }
              />
              <Route
                path="/login"
                element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
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
            )}
          </main>

          {user && hasFullAccess && (
            <BottomNav
              user={user}
              adminViewMode={adminViewMode}
              onOpenSolicitation={() => setIsSolicitationOpen(true)}
            />
          )}

          {user && hasFullAccess && (
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
