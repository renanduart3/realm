import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { SystemUser } from '../model/types';
import { getUserByUsername } from '../services/userService';
import { appConfig } from '../config/app.config';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: SystemUser | null;
  organizationType: 'profit' | 'nonprofit';
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateOrganizationType: (type: 'profit' | 'nonprofit') => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<SystemUser | null>(null);
  const [organizationType, setOrganizationType] = useState<'profit' | 'nonprofit'>('profit');

  useEffect(() => {
    const storagedUser = localStorage.getItem('user');
    const storedOrgType = localStorage.getItem('organization_type');
    
    if (storagedUser) {
      const user = JSON.parse(storagedUser) as SystemUser;
      setUser(user);
      setIsAuthenticated(true);
    }
    
    if (storedOrgType) {
      setOrganizationType(storedOrgType as 'profit' | 'nonprofit');
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (appConfig.isDevelopment) {
      const devUser: SystemUser = {
        id: 'dev-user',
        username: 'Dev User',
        role: 'master',
        nature_type: 'profit',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setUser(devUser);
      localStorage.setItem('user', JSON.stringify(devUser));
      setIsAuthenticated(true);
      return true;
    }

    const user = await getUserByUsername(email);
    if (user && user.password === password) {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateOrganizationType = (type: 'profit' | 'nonprofit') => {
    setOrganizationType(type);
    localStorage.setItem('organization_type', type);
    window.location.reload(); // Força o recarregamento da aplicação
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      user, 
      organizationType,
      updateOrganizationType 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};