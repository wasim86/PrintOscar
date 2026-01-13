// API Configuration
import { API_BASE_URL } from './config';

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Handle API response format
    if (result.success === false) {
      throw new Error(result.message || 'API request failed');
    }

    // Return the whole result so we can access success flag and data
    return result;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// GET request
export async function apiGet<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET', ...options });
}

// POST request
export async function apiPost<T>(endpoint: string, data?: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// PUT request
export async function apiPut<T>(endpoint: string, data?: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// DELETE request
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

// Error handling utility
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Retry utility for failed requests
export async function apiRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;

      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError!;
}

// Products API Service Functions
export const api = {
  // Get all categories
  getCategories: async () => {
    return apiGet<any>('/products/categories');
  },

  // Get category by ID
  getCategory: async (id: number) => {
    return apiGet<any>(`/products/categories/${id}`);
  },

  // Search products with basic filters
  searchProducts: async (params: {
    searchTerm?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    isFeatured?: boolean;
    inStock?: boolean;
    filters?: Record<string, string[]>;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    pageSize?: number;
    includeFilters?: boolean;
  } = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Handle basic parameters
      Object.entries(params).forEach(([key, value]) => {
        if (key !== 'filters' && value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      // Handle filters parameter - convert to query string format
      if (params.filters) {
        Object.entries(params.filters).forEach(([filterName, filterValues]) => {
          if (filterValues && filterValues.length > 0) {
            filterValues.forEach(value => {
              queryParams.append(`filters[${filterName}]`, value);
            });
          }
        });
      }

      const queryString = queryParams.toString();
      const url = `/products/search${queryString ? `?${queryString}` : ''}`;

      return await apiGet<any>(url);
    } catch (error) {
      console.error('Search products API error:', error);
      throw error;
    }
  },

  // Advanced search with filters
  searchProductsWithFilters: async (request: {
    searchTerm?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    isFeatured?: boolean;
    inStock?: boolean;
    filters?: Record<string, string[]>;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    pageSize?: number;
  }) => {
    return apiPost<any>('/products/search-with-filters', request);
  },

  // Get product by ID
  getProduct: async (id: number) => {
    return apiGet<any>(`/products/${id}`);
  },

  // Get featured products
  getFeaturedProducts: async (limit: number = 10) => {
    return apiGet<any>(`/products/featured?limit=${limit}`);
  },

  // Review endpoints
  getProductReviews: async (productId: number, page: number = 1, pageSize: number = 10) => {
    try {
      // Use direct fetch to handle 500 errors gracefully without triggering the global error logger
      const url = `${API_BASE_URL}/products/${productId}/reviews?page=${page}&pageSize=${pageSize}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Product reviews API unavailable (${response.status}) - returning empty reviews`);
        // Return empty structure instead of error
        return {
          success: true,
          data: {
            reviews: [],
            stats: {
              averageRating: 0,
              totalReviews: 0,
              ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            },
            page: page,
            pageSize: pageSize,
            totalPages: 0,
            totalCount: 0,
            hasNextPage: false,
            hasPreviousPage: false
          }
        };
      }

      const result = await response.json();
      
      // The reviews endpoint returns data directly, so we need to wrap it in the expected format
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.warn('Error fetching product reviews (using fallback):', error);
      // Return empty structure instead of error
      return {
        success: true,
        data: {
          reviews: [],
          stats: {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
          },
          page: page,
          pageSize: pageSize,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    }
  },

  createProductReview: async (productId: number, review: any) => {
    try {
      const result = await apiPost<any>(`/products/${productId}/reviews`, review);
      // Wrap the response in the expected format
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error creating product review:', error);
      return {
        success: false,
        message: 'Failed to submit review'
      };
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId: number, page: number = 1, pageSize: number = 20) => {
    return apiGet<any>(`/products/category/${categoryId}?page=${page}&pageSize=${pageSize}`);
  }
};

// Categories API
export const categoriesApi = {
  // Get all categories (public endpoint)
  getCategories: async () => {
    return apiGet<any>('/products/categories');
  },

  // Get category by ID (public endpoint)
  getCategory: async (id: number) => {
    return apiGet<any>(`/products/categories/${id}`);
  },

  // Create new category (public endpoint - for backward compatibility)
  createCategory: async (categoryData: {
    name: string;
    description?: string;
    imageUrl?: string;
    parentId?: number;
    sortOrder?: number;
    slug?: string;
  }) => {
    return apiPost<any>('/products/categories', categoryData);
  },

  // Delete category (public endpoint - for backward compatibility)
  deleteCategory: async (id: number) => {
    return apiDelete<any>(`/products/categories/${id}`);
  },

  // Admin Categories API
  admin: {
    // Get all categories for admin
    getCategories: async (params?: {
      searchTerm?: string;
      isActive?: boolean;
      parentId?: number;
      sortBy?: string;
      sortOrder?: string;
    }) => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString());
          }
        });
      }
      const queryString = searchParams.toString();
      return apiGet<any>(`/admin/categories${queryString ? `?${queryString}` : ''}`);
    },

    // Get category by ID for admin
    getCategory: async (id: number) => {
      return apiGet<any>(`/admin/categories/${id}`);
    },

    // Create new category (admin)
    createCategory: async (categoryData: {
      name: string;
      description?: string;
      imageUrl?: string;
      parentId?: number;
      isActive: boolean;
      sortOrder: number;
      slug?: string;
      metaTitle?: string;
      metaDescription?: string;
    }) => {
      return apiPost<any>('/admin/categories', categoryData);
    },

    // Update category (admin)
    updateCategory: async (id: number, categoryData: {
      name: string;
      description?: string;
      imageUrl?: string;
      parentId?: number;
      isActive: boolean;
      sortOrder: number;
      slug?: string;
      metaTitle?: string;
      metaDescription?: string;
    }) => {
      return apiPut<any>(`/admin/categories/${id}`, categoryData);
    },

    // Delete category (admin)
    deleteCategory: async (id: number) => {
      return apiDelete<any>(`/admin/categories/${id}`);
    },

    // Reactivate category (admin)
    reactivateCategory: async (id: number) => {
      return apiPut<any>(`/admin/categories/${id}/reactivate`, {});
    }
  }
};

// Filters API
export const filtersApi = {
  // Get filters for a specific category (public endpoint)
  getFiltersByCategory: async (categoryId: number) => {
    return apiGet<any>(`/products/categories/${categoryId}/filters`);
  },

  // Get all filters (public endpoint)
  getAllFilters: async () => {
    return apiGet<any>('/products/filters');
  },

  // Get filter counts for a specific category with current filters applied
  getFilterCounts: async (categoryId: number, appliedFilters: Record<string, string[]> = {}) => {
    const params = new URLSearchParams();
    params.append('categoryId', categoryId.toString());

    // Add applied filters as query parameters
    Object.entries(appliedFilters).forEach(([filterName, values]) => {
      values.forEach(value => {
        params.append(`filters[${filterName}]`, value);
      });
    });

    return apiGet<any>(`/products/filter-counts?${params.toString()}`);
  }
};

export default api;
