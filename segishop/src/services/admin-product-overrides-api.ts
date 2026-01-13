import { getAdminAuthToken } from '@/utils/auth';

import { API_BASE_URL } from './config';

// Product Configuration Override interfaces
export interface ProductConfigurationOverride {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  configurationTypeId: number;
  configurationTypeName: string;
  configurationType: string; // dropdown, radio, etc.
  overrideType: string; // inherit, custom, disabled
  customOptions?: string; // JSON for custom options
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductConfigurationOverrideDto {
  productId: number;
  configurationTypeId: number;
  overrideType: string; // inherit, custom, disabled
  customOptions?: string; // JSON for custom options
  isActive: boolean;
}

export interface UpdateProductConfigurationOverrideDto {
  overrideType: string; // inherit, custom, disabled
  customOptions?: string; // JSON for custom options
  isActive: boolean;
}

// Product Override Summary interface
export interface ProductOverrideSummary {
  productId: number;
  productName: string;
  productSku: string;
  categoryName: string;
  categoryConfigurationsCount: number;
  productOverridesCount: number;
  overrides: ProductConfigurationOverride[];
  categoryConfigurations: ConfigurationType[];
}

// Merged Configuration interfaces
export interface MergedProductConfiguration {
  productId: number;
  productName: string;
  configurations: ProductConfigurationItem[];
}

export interface ProductConfigurationItem {
  configurationTypeId: number;
  name: string;
  type: string; // dropdown, radio, etc.
  source: string; // "category" or "override"
  overrideType: string; // inherit, custom, disabled (only for overrides)
  isRequired: boolean;
  showPriceImpact: boolean;
  sortOrder: number;
  isActive: boolean;
  options: ConfigurationOption[];
  customOptions?: string; // JSON for custom options (only for overrides)
}

// Import existing interfaces from admin-configuration-api
export interface ConfigurationType {
  id: number;
  name: string;
  type: string;
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

export interface ConfigurationOption {
  id: number;
  configurationTypeId: number;
  name: string;
  value: string;
  priceModifier: number;
  priceType: 'fixed' | 'percentage';
  isDefault: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product interface for product selection
export interface Product {
  id: number;
  name: string;
  sku?: string;
  categoryId: number;
  categoryName: string;
  isActive: boolean;
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

// Product Configuration Overrides API
export const productConfigurationOverridesApi = {
  // Get all product configuration overrides
  getAll: (): Promise<ProductConfigurationOverride[]> => 
    apiRequest<ProductConfigurationOverride[]>('/admin/product-configuration-overrides'),

  // Get overrides for a specific product
  getByProductId: (productId: number): Promise<ProductConfigurationOverride[]> => 
    apiRequest<ProductConfigurationOverride[]>(`/admin/product-configuration-overrides/product/${productId}`),

  // Get specific override by ID
  getById: (id: number): Promise<ProductConfigurationOverride> => 
    apiRequest<ProductConfigurationOverride>(`/admin/product-configuration-overrides/${id}`),

  // Create new product configuration override
  create: (data: CreateProductConfigurationOverrideDto): Promise<ProductConfigurationOverride> => 
    apiRequest<ProductConfigurationOverride>('/admin/product-configuration-overrides', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update product configuration override
  update: (id: number, data: UpdateProductConfigurationOverrideDto): Promise<void> => 
    apiRequest<void>(`/admin/product-configuration-overrides/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete product configuration override
  delete: (id: number): Promise<void> => 
    apiRequest<void>(`/admin/product-configuration-overrides/${id}`, {
      method: 'DELETE',
    }),

  // Get products with overrides summary
  getProductsWithOverrides: (): Promise<ProductOverrideSummary[]> => 
    apiRequest<ProductOverrideSummary[]>('/admin/product-configuration-overrides/products-with-overrides'),

  // Get merged configuration for a product (category + overrides)
  getMergedConfiguration: (productId: number): Promise<MergedProductConfiguration> => 
    apiRequest<MergedProductConfiguration>(`/admin/product-configuration-overrides/merged-configuration/${productId}`),
};

// Products API (for product selection in overrides)
export const productsApi = {
  // Get all products for selection
  getAll: (): Promise<Product[]> => 
    apiRequest<Product[]>('/admin/products'),

  // Search products by name or SKU
  search: (query: string): Promise<Product[]> => 
    apiRequest<Product[]>(`/admin/products/search?q=${encodeURIComponent(query)}`),

  // Get products by category
  getByCategory: (categoryId: number): Promise<Product[]> => 
    apiRequest<Product[]>(`/admin/products/category/${categoryId}`),
};

// Configuration Types API (re-export from existing API for convenience)
export const configurationTypesApi = {
  // Get all configuration types
  getAll: (): Promise<ConfigurationType[]> => 
    apiRequest<ConfigurationType[]>('/admin/configuration/types'),

  // Get configuration type by ID
  getById: (id: number): Promise<ConfigurationType> => 
    apiRequest<ConfigurationType>(`/admin/configuration/types/${id}`),
};

// Utility functions for working with overrides
export const overrideUtils = {
  // Check if a product has any overrides
  hasOverrides: (product: ProductOverrideSummary): boolean => {
    return product.productOverridesCount > 0;
  },

  // Get override for specific configuration type
  getOverrideForConfigurationType: (
    overrides: ProductConfigurationOverride[], 
    configurationTypeId: number
  ): ProductConfigurationOverride | undefined => {
    return overrides.find(override => override.configurationTypeId === configurationTypeId);
  },

  // Check if configuration is disabled for product
  isConfigurationDisabled: (
    overrides: ProductConfigurationOverride[], 
    configurationTypeId: number
  ): boolean => {
    const override = overrides.find(o => o.configurationTypeId === configurationTypeId);
    return override?.overrideType === 'disabled';
  },

  // Get effective configuration source (category or override)
  getConfigurationSource: (
    overrides: ProductConfigurationOverride[], 
    configurationTypeId: number
  ): 'category' | 'override' => {
    const override = overrides.find(o => o.configurationTypeId === configurationTypeId);
    return override ? 'override' : 'category';
  },

  // Format override type for display
  formatOverrideType: (overrideType: string): string => {
    switch (overrideType) {
      case 'inherit':
        return 'Inherit from Category';
      case 'custom':
        return 'Custom Configuration';
      case 'disabled':
        return 'Disabled';
      default:
        return overrideType;
    }
  },

  // Get override type color for UI
  getOverrideTypeColor: (overrideType: string): string => {
    switch (overrideType) {
      case 'inherit':
        return 'text-blue-600 bg-blue-50';
      case 'custom':
        return 'text-orange-600 bg-orange-50';
      case 'disabled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  },
};
