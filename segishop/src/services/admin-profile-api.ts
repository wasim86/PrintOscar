import { API_BASE_URL } from './config';

// Profile Types
export interface AdminProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export interface UpdateProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  profile?: AdminProfile;
  errors?: string[];
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

// API Request Helper
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('printoscar_admin_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Admin Profile API Service
export class AdminProfileApi {
  // Get current admin profile
  static async getProfile(): Promise<ProfileResponse> {
    return apiRequest<ProfileResponse>('/admin/profile');
  }

  // Update admin profile
  static async updateProfile(data: UpdateProfile): Promise<ProfileResponse> {
    return apiRequest<ProfileResponse>('/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Change password
  static async changePassword(data: ChangePassword): Promise<PasswordChangeResponse> {
    return apiRequest<PasswordChangeResponse>('/admin/profile/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Format date for display
  static formatDate(dateString?: string): string {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  }

  // Format date for input field
  static formatDateForInput(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  }

  // Get full name
  static getFullName(profile: AdminProfile): string {
    return `${profile.firstName} ${profile.lastName}`.trim();
  }

  // Get initials for avatar
  static getInitials(profile: AdminProfile): string {
    const firstInitial = profile.firstName.charAt(0).toUpperCase();
    const lastInitial = profile.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }
}

export default AdminProfileApi;
