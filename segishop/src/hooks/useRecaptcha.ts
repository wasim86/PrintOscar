/**
 * React Hook for Google reCAPTCHA v3
 * Provides easy integration with forms and components
 */

import { useState, useEffect, useCallback } from 'react';
import { RecaptchaService, RecaptchaResponse, RecaptchaAction } from '@/services/recaptcha';

interface UseRecaptchaOptions {
  autoLoad?: boolean;
  onError?: (error: string) => void;
}

interface UseRecaptchaReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  executeRecaptcha: (action: RecaptchaAction) => Promise<string | null>;
  validateToken: (token: string, action: RecaptchaAction) => Promise<boolean>;
  loadRecaptcha: () => Promise<void>;
}

export const useRecaptcha = (options: UseRecaptchaOptions = {}): UseRecaptchaReturn => {
  const { autoLoad = true, onError } = options;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load reCAPTCHA script
  const loadRecaptcha = useCallback(async () => {
    if (isLoaded || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await RecaptchaService.loadRecaptcha();
      setIsLoaded(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load reCAPTCHA';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, isLoading, onError]);

  // Execute reCAPTCHA and get token
  const executeRecaptcha = useCallback(async (action: RecaptchaAction): Promise<string | null> => {
    if (!isLoaded) {
      await loadRecaptcha();
    }

    try {
      const result: RecaptchaResponse = await RecaptchaService.executeRecaptcha(action);
      
      if (!result.success) {
        const errorMessage = result.error || 'Failed to execute reCAPTCHA';
        setError(errorMessage);
        onError?.(errorMessage);
        return null;
      }

      setError(null);
      return result.token || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'reCAPTCHA execution failed';
      setError(errorMessage);
      onError?.(errorMessage);
      return null;
    }
  }, [isLoaded, loadRecaptcha, onError]);

  // Validate token on backend
  const validateToken = useCallback(async (token: string, action: RecaptchaAction): Promise<boolean> => {
    try {
      const isValid = await RecaptchaService.validateToken(token, action);
      return isValid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Token validation failed';
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    }
  }, [onError]);

  // Auto-load reCAPTCHA on mount
  useEffect(() => {
    if (autoLoad && !isLoaded && !isLoading) {
      loadRecaptcha();
    }
  }, [autoLoad, isLoaded, isLoading, loadRecaptcha]);

  return {
    isLoaded,
    isLoading,
    error,
    executeRecaptcha,
    validateToken,
    loadRecaptcha
  };
};

// Specialized hook for form submissions
export const useRecaptchaForm = (action: RecaptchaAction, options: UseRecaptchaOptions = {}) => {
  const recaptcha = useRecaptcha(options);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyAndSubmit = useCallback(async (
    submitFunction: (token: string) => Promise<void>
  ): Promise<boolean> => {
    setIsVerifying(true);
    
    try {
      // Get reCAPTCHA token
      const token = await recaptcha.executeRecaptcha(action);
      
      if (!token) {
        return false;
      }

      // Submit form with token
      await submitFunction(token);
      return true;
    } catch (error) {
      console.error('Form submission with reCAPTCHA failed:', error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [recaptcha, action]);

  return {
    ...recaptcha,
    isVerifying,
    verifyAndSubmit
  };
};
