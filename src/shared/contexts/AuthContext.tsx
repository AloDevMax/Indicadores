import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile } from '@/shared/types';
import { loginWithApi, logoutWithApi, fetchCurrentUser } from '@/shared/api';

interface AuthContextType {
  user: Profile | null;
  setUser: React.Dispatch<React.SetStateAction<Profile | null>>;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<Profile>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Load current user on mount
  useEffect(() => {
    fetchCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsAuthLoading(false);
      });
  }, []);

  const login = async (email: string, password: string): Promise<Profile> => {
    const loggedInUser = await loginWithApi(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async (): Promise<void> => {
    await logoutWithApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
