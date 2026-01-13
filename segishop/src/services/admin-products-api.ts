import { API_BASE_URL } from './config';

// Admin Product Types
export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  salePrice?: number;
  sku?: string;
  stock: number;
  imageUrl?: string;
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  images: ProductImage[];
  attributes: ProductAttribute[];
  filterValues: ProductFilterValue[];
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductAttribute {
  id: number;
  name: string;
  value: string;
  sortOrder: number;
}

export interface ProductFilterValue {
  id: number;
  filterOptionId: number;
  filterName: string;
  filterDisplayName: string;
  filterType: string;
  filterOptionValueId?: number;
  value?: string;
  displayValue?: string;
  customValue?: string;
  numericValue?: number;
}

export interface AdminProductsResponse {
  success: boolean;
  products: AdminProduct[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AdminProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  inStockProducts: number;
  totalInventoryValue: number;
  featuredProducts: number;
}

export interface AdminProductResponse {
  success: boolean;
  product?: AdminProduct;
  message?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  salePrice?: number;
  stock: number;
  imageUrl?: string;
  categoryId: number;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  imageGallery?: string[];
  attributes?: CreateProductAttribute[];
  filterValues?: CreateProductFilterValue[];
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  salePrice?: number;
  stock: number;
  imageUrl?: string;
  categoryId: number;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  imageGallery?: string[];
  attributes?: CreateProductAttribute[];
  filterValues?: CreateProductFilterValue[];
}

export interface CreateProductAttribute {
  name: string;
  value: string;
  sortOrder: number;
}

export interface CreateProductFilterValue {
  filterOptionId: number;
  filterOptionValueId?: number;
  customValue?: string;
  numericValue?: number;
}

export interface BulkUpdateStatusRequest {
  productIds: number[];
  isActive: boolean;
}

// File-based product creation/update interfaces
export interface CreateProductWithFilesRequest {
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  salePrice?: number;
  stock: number;
  categoryId: number;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  mainImage?: File;
  imageGallery?: File[];
  imageUrl?: string;
  imageUrls?: string[];
  attributes?: CreateProductAttribute[];
  filterValues?: CreateProductFilterValue[];
}

export interface UpdateProductWithFilesRequest {
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  salePrice?: number;
  stock: number;
  categoryId: number;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  mainImage?: File;
  imageGallery?: File[];
  imageUrl?: string;
  imageUrls?: string[];
  imagesToDelete?: string[];
  attributes?: CreateProductAttribute[];
  filterValues?: CreateProductFilterValue[];
}

export interface BulkDeleteRequest {
  productIds: number[];
}

export interface AdminProductsSearchParams {
  searchTerm?: string;
  categoryId?: number;
  status?: string;
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
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

// Admin Products API Service
export class AdminProductsApi {
  // Get product statistics
  static async getProductStats(): Promise<AdminProductStats> {
    return apiRequest<AdminProductStats>('/admin/products/stats');
  }

  // Get all products with filtering and pagination
  static async getProducts(params: AdminProductsSearchParams = {}): Promise<AdminProductsResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/admin/products${queryString ? `?${queryString}` : ''}`;

    return apiRequest<AdminProductsResponse>(endpoint);
  }

  // Get single product by ID
  static async getProduct(id: number): Promise<AdminProductResponse> {
    return apiRequest<AdminProductResponse>(`/admin/products/${id}`);
  }

  // Create new product
  static async createProduct(product: CreateProductRequest): Promise<AdminProductResponse> {
    return apiRequest<AdminProductResponse>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  // Update existing product
  static async updateProduct(id: number, product: UpdateProductRequest): Promise<AdminProductResponse> {
    return apiRequest<AdminProductResponse>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  // Delete product
  static async deleteProduct(id: number): Promise<AdminProductResponse> {
    return apiRequest<AdminProductResponse>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Bulk update product status
  static async bulkUpdateStatus(request: BulkUpdateStatusRequest): Promise<{ success: boolean; message: string; updatedCount: number }> {
    return apiRequest(`/admin/products/bulk-status`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
  }

  // Bulk delete products
  static async bulkDeleteProducts(request: BulkDeleteRequest): Promise<{ success: boolean; message: string; deletedCount: number }> {
    return apiRequest(`/admin/products/bulk`, {
      method: 'DELETE',
      body: JSON.stringify(request),
    });
  }

  // Create product with file uploads
  static async createProductWithFiles(product: CreateProductWithFilesRequest): Promise<AdminProductResponse> {
    const formData = new FormData();

    // Add text fields
    formData.append('name', product.name);
    formData.append('description', product.description);
    if (product.longDescription) formData.append('longDescription', product.longDescription);
    formData.append('price', product.price.toString());
    if (product.salePrice) formData.append('salePrice', product.salePrice.toString());
    formData.append('stock', product.stock.toString());
    formData.append('categoryId', product.categoryId.toString());
    formData.append('isActive', product.isActive.toString());
    formData.append('isFeatured', product.isFeatured.toString());
    if (product.metaTitle) formData.append('metaTitle', product.metaTitle);
    if (product.metaDescription) formData.append('metaDescription', product.metaDescription);
    if (product.slug) formData.append('slug', product.slug);
    if (product.imageUrl) formData.append('imageUrl', product.imageUrl);

    // Add main image file
    if (product.mainImage) {
      formData.append('mainImage', product.mainImage);
    }

    // Add gallery files
    if (product.imageGallery && product.imageGallery.length > 0) {
      product.imageGallery.forEach(file => {
        formData.append('imageGallery', file);
      });
    }

    // Add image URLs
    if (product.imageUrls && product.imageUrls.length > 0) {
      product.imageUrls.forEach(url => {
        formData.append('imageUrls', url);
      });
    }

    // Add attributes
    if (product.attributes && product.attributes.length > 0) {
      product.attributes.forEach((attr, index) => {
        formData.append(`attributes[${index}].name`, attr.name);
        formData.append(`attributes[${index}].value`, attr.value);
        formData.append(`attributes[${index}].sortOrder`, attr.sortOrder.toString());
      });
    }

    // Add filter values
    if (product.filterValues && product.filterValues.length > 0) {
      product.filterValues.forEach((fv, index) => {
        formData.append(`filterValues[${index}].filterOptionId`, fv.filterOptionId.toString());
        if (fv.filterOptionValueId) formData.append(`filterValues[${index}].filterOptionValueId`, fv.filterOptionValueId.toString());
        if (fv.customValue) formData.append(`filterValues[${index}].customValue`, fv.customValue);
        if (fv.numericValue) formData.append(`filterValues[${index}].numericValue`, fv.numericValue.toString());
      });
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('printoscar_admin_token') : null;

    const response = await fetch(`${API_BASE_URL}/admin/products/with-files`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    return result;
  }

  // Update product with file uploads
  static async updateProductWithFiles(id: number, product: UpdateProductWithFilesRequest): Promise<AdminProductResponse> {
    const formData = new FormData();

    // Add text fields
    formData.append('name', product.name);
    formData.append('description', product.description);
    if (product.longDescription) formData.append('longDescription', product.longDescription);
    formData.append('price', product.price.toString());
    if (product.salePrice) formData.append('salePrice', product.salePrice.toString());
    formData.append('stock', product.stock.toString());
    formData.append('categoryId', product.categoryId.toString());
    formData.append('isActive', product.isActive.toString());
    formData.append('isFeatured', product.isFeatured.toString());
    if (product.metaTitle) formData.append('metaTitle', product.metaTitle);
    if (product.metaDescription) formData.append('metaDescription', product.metaDescription);
    if (product.slug) formData.append('slug', product.slug);
    if (product.imageUrl) formData.append('imageUrl', product.imageUrl);

    // Add main image file
    if (product.mainImage) {
      formData.append('mainImage', product.mainImage);
    }

    // Add gallery files
    if (product.imageGallery && product.imageGallery.length > 0) {
      product.imageGallery.forEach(file => {
        formData.append('imageGallery', file);
      });
    }

    // Add image URLs
    if (product.imageUrls && product.imageUrls.length > 0) {
      product.imageUrls.forEach(url => {
        formData.append('imageUrls', url);
      });
    }

    // Add images to delete
    if (product.imagesToDelete && product.imagesToDelete.length > 0) {
      product.imagesToDelete.forEach(fileName => {
        formData.append('imagesToDelete', fileName);
      });
    }

    // Add attributes
    if (product.attributes && product.attributes.length > 0) {
      product.attributes.forEach((attr, index) => {
        formData.append(`attributes[${index}].name`, attr.name);
        formData.append(`attributes[${index}].value`, attr.value);
        formData.append(`attributes[${index}].sortOrder`, attr.sortOrder.toString());
      });
    }

    // Add filter values
    if (product.filterValues && product.filterValues.length > 0) {
      product.filterValues.forEach((fv, index) => {
        formData.append(`filterValues[${index}].filterOptionId`, fv.filterOptionId.toString());
        if (fv.filterOptionValueId) formData.append(`filterValues[${index}].filterOptionValueId`, fv.filterOptionValueId.toString());
        if (fv.customValue) formData.append(`filterValues[${index}].customValue`, fv.customValue);
        if (fv.numericValue) formData.append(`filterValues[${index}].numericValue`, fv.numericValue.toString());
      });
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('printoscar_admin_token') : null;

    const response = await fetch(`${API_BASE_URL}/admin/products/${id}/with-files`, {
      method: 'PUT',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    return result;
  }
}

// Export default
export default AdminProductsApi;
