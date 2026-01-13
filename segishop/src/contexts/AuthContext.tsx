'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, Customer } from '@/services/authService';

interface AuthContextType {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  apiAvailable: boolean;
  login: (email: string, password: string, recaptchaToken?: string) => Promise<void>;
  register: (email: string, firstName: string, lastName: string, password: string, recaptchaToken?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  logout: () => void;
  updateProfile: (data: { firstName?: string; lastName?: string; phone?: string }) => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const loadProfile = async () => {
      if (authService.isAuthenticated()) {
        try {
          const { customer } = await authService.getProfile();
          setCustomer(customer);
        } catch (error) {
          console.error('Failed to load profile:', error);
          // Check if it's a network error (API down)
          if (error instanceof Error && error.message.includes('API server is not available')) {
            console.warn('API server is not available, running in offline mode');
            setApiAvailable(false);
          } else {
            // Token might be invalid, clear it but don't crash
            authService.logout();
          }
          setCustomer(null);
        }
      }
      setIsLoading(false);
    };

    // Add error boundary to prevent crashes
    loadProfile().catch((error) => {
      console.error('Auth initialization error:', error);
      setApiAvailable(false);
      setIsLoading(false);
      setCustomer(null);
    });
  }, []);

  const login = async (email: string, password: string, recaptchaToken?: string): Promise<void> => {
    try {
      const response = await authService.login({ email, password, recaptchaToken });
      setCustomer(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, firstName: string, lastName: string, password: string, recaptchaToken?: string): Promise<void> => {
    try {
      const response = await authService.register({ email, firstName, lastName, password, recaptchaToken });
      setCustomer(response.user);
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email: string): Promise<{ message: string }> => {
    try {
      const response = await authService.forgotPassword({ email });
      return {
        message: response.message
      };
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    setCustomer(null);
  };

  const updateProfile = async (data: { firstName?: string; lastName?: string; phone?: string }): Promise<void> => {
    try {
      const response = await authService.updateProfile(data);
      setCustomer(response.customer);
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async (): Promise<void> => {
    try {
      await authService.deleteAccount();
      setCustomer(null);
    } catch (error) {
      throw error;
    }
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      const { customer } = await authService.getProfile();
      setCustomer(customer);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    customer,
    isAuthenticated: !!customer,
    isLoading,
    apiAvailable,
    login,
    register,
    forgotPassword,
    logout,
    updateProfile,
    deleteAccount,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
