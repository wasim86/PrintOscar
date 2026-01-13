import { API_BASE_URL } from './config';

export interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface AdminAuthResponse {
  success: boolean;
  message: string;
  user?: AdminUser;
  token?: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

class AdminAuthService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('printoscar_admin_token');
    }
  }

  // Admin login
  async login(data: AdminLoginRequest): Promise<AdminAuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        const errorMessage = result?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // Store token
      if (result.token) {
        this.token = result.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('printoscar_admin_token', result.token);
        }
      }

      return result;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }

  // Get admin profile
  async getProfile(): Promise<{ admin: AdminUser }> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(result.message || 'Failed to get profile');
      }

      return { admin: result.user };
    } catch (error) {
      console.error('Get admin profile error:', error);
      throw error;
    }
  }

  // Validate admin token
  async validateToken(): Promise<boolean> {
    if (!this.token) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/auth/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      return response.ok && result.success;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  // Logout
  logout(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('printoscar_admin_token');
    }
  }

  // Check if admin is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Get current token
  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('printoscar_admin_token');
    }
    return this.token;
  }

  // Set token (for external use)
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('printoscar_admin_token', token);
    }
  }

  // Clear authentication
  clearAuth(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('printoscar_admin_token');
    }
  }
}

export const adminAuthService = new AdminAuthService();
