import { API_BASE_URL } from './config';

// Admin Category Types
export interface AdminCategory {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  parentId?: number;
  parentName?: string;
  isActive: boolean;
  sortOrder: number;
  slug?: string;
  configurationType: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  productCount: number;
  childrenCount: number;
  children: AdminCategory[];
}

export interface AdminCategoriesSearchParams {
  searchTerm?: string;
  isActive?: boolean;
  parentId?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  isActive: boolean;
  sortOrder: number;
  slug?: string;
  configurationType: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  isActive: boolean;
  sortOrder: number;
  slug?: string;
  configurationType: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface AdminCategoriesResponse {
  success: boolean;
  categories: AdminCategory[];
  totalCount: number;
  message?: string;
}

export interface AdminCategoryResponse {
  success: boolean;
  category?: AdminCategory;
  message?: string;
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

// Admin Categories API Service
export class AdminCategoriesApi {
  // Get all categories with filtering
  static async getCategories(params: AdminCategoriesSearchParams = {}): Promise<AdminCategoriesResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/admin/categories${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<AdminCategoriesResponse>(endpoint);
  }

  // Get single category by ID
  static async getCategory(id: number): Promise<AdminCategoryResponse> {
    return apiRequest<AdminCategoryResponse>(`/admin/categories/${id}`);
  }

  // Create new category
  static async createCategory(category: CreateCategoryRequest): Promise<AdminCategoryResponse> {
    return apiRequest<AdminCategoryResponse>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  // Update existing category
  static async updateCategory(id: number, category: UpdateCategoryRequest): Promise<AdminCategoryResponse> {
    return apiRequest<AdminCategoryResponse>(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  // Delete category
  static async deleteCategory(id: number): Promise<AdminCategoryResponse> {
    return apiRequest<AdminCategoryResponse>(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Get categories for dropdown (active only, hierarchical)
  static async getCategoriesForDropdown(): Promise<AdminCategory[]> {
    const response = await this.getCategories({ isActive: true, sortBy: 'sortOrder' });
    if (response.success) {
      return this.flattenCategoriesForDropdown(response.categories);
    }
    return [];
  }

  // Helper function to flatten categories for dropdown display
  private static flattenCategoriesForDropdown(categories: AdminCategory[], level: number = 0): AdminCategory[] {
    const flattened: AdminCategory[] = [];
    
    categories.forEach(category => {
      // Add prefix for visual hierarchy
      const prefix = '  '.repeat(level);
      const displayCategory = {
        ...category,
        name: `${prefix}${category.name}`
      };
      
      flattened.push(displayCategory);
      
      // Add children recursively
      if (category.children && category.children.length > 0) {
        flattened.push(...this.flattenCategoriesForDropdown(category.children, level + 1));
      }
    });
    
    return flattened;
  }

  // Get category tree (for tree view components)
  static async getCategoryTree(): Promise<AdminCategory[]> {
    const response = await this.getCategories({ sortBy: 'sortOrder' });
    if (response.success) {
      return this.buildCategoryTree(response.categories);
    }
    return [];
  }

  // Helper function to build category tree
  private static buildCategoryTree(categories: AdminCategory[]): AdminCategory[] {
    const categoryMap = new Map<number, AdminCategory>();
    const rootCategories: AdminCategory[] = [];

    // Create a map of all categories
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build the tree structure
    categories.forEach(category => {
      const categoryNode = categoryMap.get(category.id)!;
      
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(categoryNode);
        }
      } else {
        rootCategories.push(categoryNode);
      }
    });

    return rootCategories;
  }

  // Validate category data before submission
  static validateCategory(category: CreateCategoryRequest | UpdateCategoryRequest): string[] {
    const errors: string[] = [];

    if (!category.name || category.name.trim().length === 0) {
      errors.push('Category name is required');
    }

    if (category.name && category.name.length > 255) {
      errors.push('Category name must be less than 255 characters');
    }

    if (category.description && category.description.length > 500) {
      errors.push('Category description must be less than 500 characters');
    }

    if (category.sortOrder < 0) {
      errors.push('Sort order must be a positive number');
    }

    if (category.slug && category.slug.length > 255) {
      errors.push('Slug must be less than 255 characters');
    }

    if (category.metaTitle && category.metaTitle.length > 255) {
      errors.push('Meta title must be less than 255 characters');
    }

    if (category.metaDescription && category.metaDescription.length > 500) {
      errors.push('Meta description must be less than 500 characters');
    }

    return errors;
  }

  // Generate slug from category name
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
}

// Export default
export default AdminCategoriesApi;
