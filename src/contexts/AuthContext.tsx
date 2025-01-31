import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { SystemUser } from '../model/types';
import { getUserByUsername } from '../services/userService';
import { appConfig } from '../config/app.config';
import { systemConfigService } from '../services/systemConfigService';

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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth context...');
        
        // Initialize system config service
        await systemConfigService.initialize();
        console.log('SystemConfigService initialized');
        
        // Get stored user data
        const storagedUser = localStorage.getItem('user');
        const storedOrgType = localStorage.getItem('organization_type');
        
        if (storagedUser) {
          console.log('Found stored user');
          const user = JSON.parse(storagedUser) as SystemUser;
          setUser(user);
          setIsAuthenticated(true);
        } else {
          console.log('No stored user found');
        }
        
        if (storedOrgType) {
          console.log('Found stored organization type:', storedOrgType);
          setOrganizationType(storedOrgType as 'profit' | 'nonprofit');
        } else {
          console.log('No stored organization type found');
        }

        // Get system config
        const config = await systemConfigService.getConfig();
        if (config) {
          console.log('System config loaded:', config);
          setOrganizationType(config.organization_type);
        } else {
          console.log('No system config found');
        }

        setIsInitialized(true);
        console.log('Auth context initialized');
      } catch (error) {
        console.error('Error initializing auth context:', error);
        setIsInitialized(true); // Still set initialized to prevent infinite loading
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login...', { email, isDev: appConfig.isDevelopment });
      
      if (appConfig.isDevelopment) {
        console.log('Development mode - using mock user');
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
        console.log('Development login successful');
        return true;
      }

      const user = await getUserByUsername(email);
      console.log('User lookup result:', user);
      
      if (user && user.password === password) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuthenticated(true);
        console.log('Login successful');
        return true;
      }
      
      console.log('Login failed - invalid credentials');
      throw new Error('Invalid email or password');
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    console.log('Logout complete');
  };

  const updateOrganizationType = (type: 'profit' | 'nonprofit') => {
    console.log('Updating organization type:', type);
    setOrganizationType(type);
    localStorage.setItem('organization_type', type);
    window.location.reload();
  };

  if (!isInitialized) {
    return <div>Loading auth context...</div>;
  }

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
