import { API_BASE_URL } from './config';

export interface Customer {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: Customer;
  token: string;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  recaptchaToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  recaptchaToken?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('printoscar_token');
    }
  }

  // Register with complete details
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    // Store token
    this.token = result.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('printoscar_token', result.token);
    }

    return result;
  }

  // Login with email and password
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }

    // Store token
    this.token = result.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('printoscar_token', result.token);
    }

    return result;
  }

  // Forgot password - generates new password
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Forgot password request failed');
    }

    return result;
  }

  // Get current customer profile
  async getProfile(): Promise<{ customer: Customer }> {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.token = null;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('segishop_token');
          }
        }
        throw new Error(result.message || 'Failed to get profile');
      }

      return { customer: result };
    } catch (error) {
      // Handle network errors gracefully - fallback to JWT decoding
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn('API server is not available, using JWT fallback for profile');
        return this.getProfileFromToken();
      }
      throw error;
    }
  }

  // Fallback method to extract customer data from JWT token
  private getProfileFromToken(): { customer: Customer } {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      // Decode JWT payload
      const payload = JSON.parse(atob(this.token.split('.')[1]));

      const customer: Customer = {
        id: parseInt(payload.nameid),
        email: payload.email,
        firstName: 'User',
        lastName: 'Account',
        role: payload.role || 'Customer',
        createdAt: new Date().toISOString()
      };

      console.log('🔄 Using JWT fallback for customer profile:', customer);
      return { customer };
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      this.logout();
      throw new Error('Invalid token');
    }
  }

  // Update customer profile
  async updateProfile(data: UpdateProfileRequest): Promise<{ message: string; customer: Customer }> {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        this.logout(); // Clear invalid token
      }
      throw new Error(result.message || 'Failed to update profile');
    }

    return { message: result.message, customer: result.user };
  }

  // Delete customer account
  async deleteAccount(): Promise<{ message: string }> {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/auth/account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        this.logout(); // Clear invalid token
      }
      throw new Error(result.message || 'Failed to delete account');
    }

    // Clear token after successful deletion
    this.logout();

    return result;
  }

  // Logout - clear token
  logout(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('segishop_token');
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Get current token
  getToken(): string | null {
    return this.token;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return result;
  }
}

// Export singleton instance
export const authService = new AuthService();
