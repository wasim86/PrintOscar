import { getAdminAuthToken } from '@/utils/auth';

import { API_BASE_URL } from './config';

// Configuration Type interfaces
export interface ConfigurationOption {
  id: number;
  configurationTypeId: number;
  name: string;
  value: string;
  priceModifier: number;
  priceType: 'fixed' | 'percentage' | 'multiplier' | 'replace';
  isDefault: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigurationType {
  id: number;
  name: string;
  type: 'dropdown' | 'radio' | 'checkbox' | 'number' | 'text';
  description?: string;
  isRequired: boolean;
  showPriceImpact: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  options: ConfigurationOption[];
  usedInCategories: string[];
}

export interface CreateConfigurationTypeDto {
  name: string;
  type: 'dropdown' | 'radio' | 'checkbox' | 'number' | 'text';
  description?: string;
  isRequired: boolean;
  showPriceImpact: boolean;
  isActive: boolean;
}

export interface UpdateConfigurationTypeDto {
  name: string;
  type: 'dropdown' | 'radio' | 'checkbox' | 'number' | 'text';
  description?: string;
  isRequired: boolean;
  showPriceImpact: boolean;
  isActive: boolean;
}

export interface CreateConfigurationOptionDto {
  configurationTypeId: number;
  name: string;
  value: string;
  priceModifier: number;
  priceType: 'fixed' | 'percentage' | 'multiplier' | 'replace';
  isDefault: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface UpdateConfigurationOptionDto {
  name: string;
  value: string;
  priceModifier: number;
  priceType: 'fixed' | 'percentage' | 'multiplier' | 'replace';
  isDefault: boolean;
  sortOrder: number;
  isActive: boolean;
}

// Category Configuration interfaces
export interface TemplateConfiguration {
  configurationTypeId: number;
  name: string;
  type: string;
  isRequired: boolean;
  showPriceImpact: boolean;
  sortOrder: number;
  isActive: boolean;
  options: ConfigurationOption[];
}

export interface CategoryTemplate {
  categoryId: number;
  categoryName: string;
  configurations: TemplateConfiguration[];
  isActive: boolean;
  inheritToSubcategories: boolean;
  productsCount: number;
}

export interface CreateCategoryConfigurationTemplateDto {
  categoryId: number;
  configurationTypeId: number;
  isRequired: boolean;
  inheritToSubcategories: boolean;
  isActive: boolean;
}

export interface UpdateCategoryConfigurationTemplateDto {
  isRequired: boolean;
  inheritToSubcategories: boolean;
  isActive: boolean;
}

export interface CategoryConfigurationTemplateDto {
  id: number;
  categoryId: number;
  categoryName: string;
  configurationTypeId: number;
  configurationTypeName: string;
  configurationType: string;
  isRequired: boolean;
  sortOrder: number;
  inheritToSubcategories: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Analytics interfaces
export interface ConfigurationPerformance {
  configurationTypeName: string;
  category: string;
  usageRate: number;
  revenueImpact: number;
  averagePriceIncrease: number;
}

export interface ConfigurationAnalytics {
  totalRevenueImpact: number;
  activeConfigurationsCount: number;
  completionRate: number;
  averageOrderValueIncrease: number;
  configurationPerformance: ConfigurationPerformance[];
}

// API Helper function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  // Handle 204 No Content responses (for DELETE and PUT operations)
  if (response.status === 204) {
    return null as T;
  }

  // Only parse JSON if there's content
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return null as T;
}

// Configuration Types API
export const configurationTypesApi = {
  // Get all configuration types
  getAll: (): Promise<ConfigurationType[]> => 
    apiRequest<ConfigurationType[]>('/admin/configuration/types'),

  // Get configuration type by ID
  getById: (id: number): Promise<ConfigurationType> => 
    apiRequest<ConfigurationType>(`/admin/configuration/types/${id}`),

  // Create new configuration type
  create: (data: CreateConfigurationTypeDto): Promise<ConfigurationType> => 
    apiRequest<ConfigurationType>('/admin/configuration/types', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update configuration type
  update: (id: number, data: UpdateConfigurationTypeDto): Promise<void> => 
    apiRequest<void>(`/admin/configuration/types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete configuration type
  delete: (id: number): Promise<void> => 
    apiRequest<void>(`/admin/configuration/types/${id}`, {
      method: 'DELETE',
    }),
};

// Configuration Options API
export const configurationOptionsApi = {
  // Get options for a configuration type
  getByTypeId: (configurationTypeId: number): Promise<ConfigurationOption[]> => 
    apiRequest<ConfigurationOption[]>(`/admin/configuration/types/${configurationTypeId}/options`),

  // Create new configuration option
  create: (data: CreateConfigurationOptionDto): Promise<ConfigurationOption> => 
    apiRequest<ConfigurationOption>('/admin/configuration/options', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update configuration option
  update: (id: number, data: UpdateConfigurationOptionDto): Promise<void> => 
    apiRequest<void>(`/admin/configuration/options/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete configuration option
  delete: (id: number): Promise<void> => 
    apiRequest<void>(`/admin/configuration/options/${id}`, {
      method: 'DELETE',
    }),
};

// Category Configuration API
export const categoryConfigurationApi = {
  // Get all category templates (grouped by category)
  getAll: (): Promise<CategoryTemplate[]> =>
    apiRequest<CategoryTemplate[]>('/admin/categoryconfiguration/categories'),

  // Get all individual templates (flat list with IDs)
  getAllTemplates: (): Promise<CategoryConfigurationTemplateDto[]> =>
    apiRequest<CategoryConfigurationTemplateDto[]>('/admin/categoryconfiguration/templates'),

  // Get category template by ID
  getById: (categoryId: number): Promise<CategoryTemplate> =>
    apiRequest<CategoryTemplate>(`/admin/categoryconfiguration/categories/${categoryId}`),

  // Get available configuration types for a category
  getAvailableTypes: (categoryId: number): Promise<ConfigurationType[]> =>
    apiRequest<ConfigurationType[]>(`/admin/categoryconfiguration/available-types/${categoryId}`),

  // Create category configuration template
  createTemplate: (data: CreateCategoryConfigurationTemplateDto): Promise<void> =>
    apiRequest<void>('/admin/categoryconfiguration/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update category configuration template
  updateTemplate: (id: number, data: UpdateCategoryConfigurationTemplateDto): Promise<void> =>
    apiRequest<void>(`/admin/categoryconfiguration/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete category configuration template
  deleteTemplate: (id: number): Promise<void> =>
    apiRequest<void>(`/admin/categoryconfiguration/templates/${id}`, {
      method: 'DELETE',
    }),
};

// Analytics API (mock data for now)
export const configurationAnalyticsApi = {
  getAnalytics: (): Promise<ConfigurationAnalytics> => {
    // Mock data - replace with real API call when analytics endpoint is ready
    return Promise.resolve({
      totalRevenueImpact: 15420,
      activeConfigurationsCount: 47,
      completionRate: 84,
      averageOrderValueIncrease: 28.50,
      configurationPerformance: [
        {
          configurationTypeName: 'Quantity Set (Snacks)',
          category: 'Snacks',
          usageRate: 94,
          revenueImpact: 8450,
          averagePriceIncrease: 12.30
        },
        {
          configurationTypeName: 'Size (Decor)',
          category: 'Decor',
          usageRate: 89,
          revenueImpact: 3240,
          averagePriceIncrease: 8.50
        },
        {
          configurationTypeName: 'Pillow Options (Decor)',
          category: 'Decor',
          usageRate: 85,
          revenueImpact: 2890,
          averagePriceIncrease: 7.50
        },
        {
          configurationTypeName: 'Bulk Quantity (Small Bulk)',
          category: 'Small Bulk',
          usageRate: 72,
          revenueImpact: 1840,
          averagePriceIncrease: 15.20
        },
        {
          configurationTypeName: 'Variety Box Configs',
          category: 'Variety Boxes',
          usageRate: 68,
          revenueImpact: 0,
          averagePriceIncrease: 0
        }
      ]
    });
  }
};
