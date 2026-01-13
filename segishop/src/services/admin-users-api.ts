import { API_BASE_URL } from './config';

// Admin User Types
export interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  totalOrders: number;
  totalSpent: number;
  fullName: string;
  daysSinceRegistration: number;
  daysSinceLastLogin: number;
}

export interface AdminUserDetail extends AdminUser {
  recentOrders: AdminUserOrder[];
  stats: AdminUserStats;
}

export interface AdminUserOrder {
  id: number;
  orderDate: string;
  total: number;
  status: string;
  itemCount: number;
}

export interface AdminUserStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  firstOrderDate?: string;
  lastOrderDate?: string;
  daysSinceFirstOrder: number;
  daysSinceLastOrder: number;
  customerSegment: string;
}

export interface AdminUsersSearchParams {
  searchTerm?: string;
  role?: string;
  isActive?: boolean;
  createdFrom?: string;
  createdTo?: string;
  lastLoginFrom?: string;
  lastLoginTo?: string;
  gender?: string;
  customerSegment?: string;
  minTotalSpent?: number;
  maxTotalSpent?: number;
  minOrders?: number;
  maxOrders?: number;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateAdminUser {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  role?: string;
  isActive?: boolean;
  password?: string;
}

export interface UpdateAdminUser {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  role?: string;
  isActive?: boolean;
}

export interface AdminUsersResponse {
  success: boolean;
  users: AdminUser[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  message?: string;
}

export interface AdminUserResponse {
  success: boolean;
  user?: AdminUserDetail;
  message?: string;
}

export interface AdminUserPasswordReset {
  newPassword: string;
}

export interface AdminUserBulkAction {
  userIds: number[];
  action: string;
  newRole?: string;
}

export interface AdminUserAnalytics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  newUsersLastMonth: number;
  totalRevenue: number;
  averageOrderValue: number;
  userSegments: AdminUserSegment[];
  registrationTrend: AdminUserRegistrationTrend[];
}

export interface AdminUserSegment {
  segment: string;
  count: number;
  percentage: number;
  totalSpent: number;
}

export interface AdminUserRegistrationTrend {
  date: string;
  count: number;
}

export class AdminUsersApi {
  private static getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('printoscar_admin_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  static async getUsers(params: AdminUsersSearchParams = {}): Promise<AdminUsersResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/admin/adminusers?${queryParams}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  static async getUser(id: number): Promise<AdminUserResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/adminusers/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  static async createUser(userData: CreateAdminUser): Promise<AdminUserResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/adminusers`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  static async updateUser(id: number, userData: UpdateAdminUser): Promise<AdminUserResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/adminusers/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  static async deleteUser(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/admin/adminusers/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  static async resetUserPassword(id: number, passwordData: AdminUserPasswordReset): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/admin/adminusers/${id}/reset-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  static async bulkAction(actionData: AdminUserBulkAction): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/admin/adminusers/bulk-action`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(actionData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  static async getAnalytics(): Promise<AdminUserAnalytics> {
    const response = await fetch(`${API_BASE_URL}/admin/adminusers/analytics`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Utility methods
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  static formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static getCustomerSegmentColor(segment: string): string {
    switch (segment.toLowerCase()) {
      case 'vip': return 'text-purple-600 bg-purple-100';
      case 'regular': return 'text-blue-600 bg-blue-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'new': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  static getRoleColor(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin': return 'text-red-600 bg-red-100';
      case 'manager': return 'text-purple-600 bg-purple-100';
      case 'customer': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }
}
