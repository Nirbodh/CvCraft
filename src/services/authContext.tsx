import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredToken } from './api.ts';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin' | 'superadmin';
  status?: 'active' | 'suspended';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  isGuest: boolean;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register';
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      api
        .getMe()
        .then((res) => {
          if (res.user) {
            setUser(res.user);
          }
        })
        .catch((err) => {
          console.warn('[Auth] Session validation failed:', err.message);
          api.logout();
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setUser(res.user);
    setAuthModalOpen(false);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.register(name, email, password);
    setUser(res.user);
    setAuthModalOpen(false);
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const userEmail = (user?.email || '').toLowerCase().trim();
  const isSuperAdmin =
    user?.role === 'superadmin' ||
    userEmail === 'nirbodh3@gmail.com' ||
    userEmail === 'admin@cvcraft.com';
  const isAdmin =
    isSuperAdmin ||
    user?.role === 'admin' ||
    userEmail.endsWith('@admin.cvcraft.com');

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isSuperAdmin,
        isLoading,
        isGuest: !user,
        authModalOpen,
        authModalTab,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
