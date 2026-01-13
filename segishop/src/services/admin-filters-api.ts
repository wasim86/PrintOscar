import { API_BASE_URL } from './config';

// Types for Filter Management
export interface FilterOptionValue {
  id: number;
  filterOptionId: number;
  value: string;
  displayValue: string;
  description: string;
  colorCode?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface FilterOption {
  id: number;
  name: string;
  displayName: string;
  description: string;
  categoryId: number;
  categoryName: string;
  filterType: string;
  minValue?: number;
  maxValue?: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  productCount: number;
  canDelete: boolean;
  filterOptionValues: FilterOptionValue[];
}

export interface CreateFilterOptionDto {
  name: string;
  displayName: string;
  description: string;
  categoryId: number;
  filterType: string;
  minValue?: number;
  maxValue?: number;
  sortOrder: number;
  isActive: boolean;
  filterOptionValues: FilterOptionValue[];
}

export interface UpdateFilterOptionDto {
  name: string;
  displayName: string;
  description: string;
  categoryId: number;
  filterType: string;
  minValue?: number;
  maxValue?: number;
  sortOrder: number;
  isActive: boolean;
  filterOptionValues: FilterOptionValue[];
}

export interface FilterOptionsResponse {
  success: boolean;
  filterOptions: FilterOption[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  message?: string;
}

export interface FilterOptionResponse {
  success: boolean;
  filterOption?: FilterOption;
  message?: string;
}

export interface FilterOptionsParams {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  isActive?: boolean;
}

// API Helper Functions
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get JWT token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('printoscar_admin_token') : null;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    credentials: 'include',
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

class AdminFiltersApiService {
  private readonly baseUrl = '/admin/filters';

  /**
   * Get all filter options with pagination and filtering
   */
  async getFilterOptions(params: FilterOptionsParams = {}): Promise<FilterOptionsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params.categoryId) searchParams.append('categoryId', params.categoryId.toString());
    if (params.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());

    const url = `${this.baseUrl}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return await apiRequest<FilterOptionsResponse>(url);
  }

  /**
   * Get filter options by category
   */
  async getFilterOptionsByCategory(categoryId: number): Promise<FilterOptionsResponse> {
    return await apiRequest<FilterOptionsResponse>(`${this.baseUrl}/category/${categoryId}`);
  }

  /**
   * Get filter option by ID
   */
  async getFilterOption(id: number): Promise<FilterOptionResponse> {
    return await apiRequest<FilterOptionResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new filter option
   */
  async createFilterOption(request: CreateFilterOptionDto): Promise<FilterOptionResponse> {
    return await apiRequest<FilterOptionResponse>(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Update an existing filter option
   */
  async updateFilterOption(id: number, request: UpdateFilterOptionDto): Promise<FilterOptionResponse> {
    return await apiRequest<FilterOptionResponse>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  /**
   * Delete a filter option
   */
  async deleteFilterOption(id: number): Promise<FilterOptionResponse> {
    return await apiRequest<FilterOptionResponse>(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Toggle filter option active status
   */
  async toggleFilterOptionStatus(id: number): Promise<FilterOptionResponse> {
    return await apiRequest<FilterOptionResponse>(`${this.baseUrl}/${id}/toggle-status`, {
      method: 'PATCH',
    });
  }
}

export const adminFiltersApi = new AdminFiltersApiService();
