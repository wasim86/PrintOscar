/**
 * Google reCAPTCHA v3 Service
 * Handles reCAPTCHA token generation and validation
 */

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export interface RecaptchaResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export class RecaptchaService {
  private static siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  private static isLoaded = false;
  private static loadPromise: Promise<void> | null = null;

  /**
   * Load reCAPTCHA script if not already loaded
   */
  static async loadRecaptcha(): Promise<void> {
    if (this.isLoaded) return;
    
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('reCAPTCHA can only be loaded in browser environment'));
        return;
      }

      if (!this.siteKey) {
        // Dev fallback: automatically allow bypass if key is missing
        console.warn('reCAPTCHA site key not configured, using dev bypass mode');
        this.isLoaded = true;
        resolve();
        return;
      }

      // Check if already loaded
      if (window.grecaptcha) {
        this.isLoaded = true;
        resolve();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };

      script.onerror = () => {
        // Instead of rejecting, we fallback to bypass mode on error to prevent blocking users
        console.warn('Failed to load reCAPTCHA script, using dev bypass mode');
        this.isLoaded = true;
        resolve();
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  /**
   * Execute reCAPTCHA and get token
   */
  static async executeRecaptcha(action: string): Promise<RecaptchaResponse> {
    try {
      if (!this.siteKey) {
        // Auto-bypass if key is missing
        return { success: true, token: `dev-token-${action}` };
      }

      // Ensure reCAPTCHA is loaded
      await this.loadRecaptcha();

      // If we are in bypass mode (siteKey exists but script failed or logic fell through)
      if (!window.grecaptcha) {
         return { success: true, token: `dev-token-${action}` };
      }

      // Execute reCAPTCHA
      return new Promise((resolve) => {
        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha.execute(this.siteKey!, {
              action: action
            });

            resolve({
              success: true,
              token: token
            });
          } catch (error) {
            console.error('reCAPTCHA execution failed, falling back to bypass:', error);
            // Fallback to success on execution failure to avoid blocking
            resolve({
              success: true,
              token: `fallback-token-${action}`
            });
          }
        });
      });
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      // Fail open
      return {
        success: true,
        token: `error-bypass-${action}`
      };
    }
  }

  /**
   * Validate reCAPTCHA token on backend
   */
  static async validateToken(token: string, action: string): Promise<boolean> {
    try {
      const response = await fetch('/api/recaptcha/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, action }),
      });

      const result = await response.json();
      return result.success && result.valid;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  /**
   * Get reCAPTCHA token for form submission
   */
  static async getTokenForAction(action: string): Promise<string | null> {
    const result = await this.executeRecaptcha(action);
    return result.success ? result.token || null : null;
  }
}

// Predefined actions for different forms
export const RECAPTCHA_ACTIONS = {
  CONTACT_FORM: 'contact_form',
  USER_REGISTRATION: 'user_registration',
  USER_LOGIN: 'user_login',
  GUEST_CHECKOUT: 'guest_checkout',
  NEWSLETTER_SUBSCRIPTION: 'newsletter_subscription',
  ADMIN_LOGIN: 'admin_login'
} as const;

export type RecaptchaAction = typeof RECAPTCHA_ACTIONS[keyof typeof RECAPTCHA_ACTIONS];
