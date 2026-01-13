'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminAuthService, AdminUser } from '@/services/adminAuthService';

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  apiAvailable: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);

  // Load admin profile on initialization
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        
        if (!adminAuthService.isAuthenticated()) {
          setAdmin(null);
          setIsLoading(false);
          return;
        }

        // Validate token first
        const isValid = await adminAuthService.validateToken();
        if (!isValid) {
          adminAuthService.clearAuth();
          setAdmin(null);
          setIsLoading(false);
          return;
        }

        // Get admin profile
        const { admin } = await adminAuthService.getProfile();
        setAdmin(admin);
        setApiAvailable(true);
      } catch (error) {
        console.error('Admin auth initialization error:', error);
        setApiAvailable(false);
        setAdmin(null);
        adminAuthService.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    // Add error boundary to prevent crashes
    loadProfile().catch((error) => {
      console.error('Admin auth initialization error:', error);
      setApiAvailable(false);
      setIsLoading(false);
      setAdmin(null);
    });
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await adminAuthService.login({ email, password });
      if (response.user) {
        setAdmin(response.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    adminAuthService.logout();
    setAdmin(null);
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      const { admin } = await adminAuthService.getProfile();
      setAdmin(admin);
    } catch (error) {
      console.error('Failed to refresh admin profile:', error);
      throw error;
    }
  };

  const value: AdminAuthContextType = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    apiAvailable,
    login,
    logout,
    refreshProfile,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
