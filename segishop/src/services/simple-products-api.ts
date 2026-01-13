// Simple Products API Service - Step by Step Integration
import { API_BASE_URL } from './config';

// Enhanced Product type with detail enhancements
export interface SimpleProduct {
  id: number;
  name: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
  price: number;
  salePrice?: number;
  sku?: string;
  stock: number;
  imageUrl?: string;
  categoryId: number;
  categoryName: string;
  parentCategoryName?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  slug?: string;
  images?: SimpleProductImage[];
  attributes?: SimpleProductAttribute[];
  // Product detail enhancements
  configuration?: ProductConfiguration;
  highlights?: ProductHighlight[];
  quantitySets?: ProductQuantitySet[];
  varietyBoxOptions?: ProductVarietyBoxOption[];
  dynamicConfigurations?: DynamicConfiguration[];
  // Product tabs data
  specifications?: { [key: string]: string };
  reviews?: ProductReview[];
  averageRating?: number;
  totalReviews?: number;
}

// Product review interface
export interface ProductReview {
  id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

// Helper to fix missing product data
function enhanceSimpleProduct(product: SimpleProduct): SimpleProduct {
  if (product.name === 'Peak Series Acrylic Award with Blue Accents' || product.name === 'Peak Series Acrylic Award with Blue Accents ') {
    return {
      ...product,
      price: product.price || 75.00,
      salePrice: product.salePrice,
      imageUrl: product.imageUrl || 'https://printoscar.com/wp-content/uploads/2025/12/36-2.webp',
      description: product.description || 'Premium Peak Series Acrylic Award with Blue Accents.',
    };
  }
  return product;
}

// Product detail enhancement types
export interface ProductConfiguration {
  id: number;
  configurationType: 'Regular' | 'VarietyBox' | 'SmallBulk';
  hasQuantitySets: boolean;
  hasVarietyBoxOptions: boolean;
  hasBulkQuantity: boolean;
  minBulkQuantity?: number;
  maxBulkQuantity?: number;
  defaultHighlight?: string;
}

export interface ProductHighlight {
  id: number;
  highlight: string;
  sortOrder: number;
}

export interface ProductQuantitySet {
  id: number;
  name: string;
  displayName: string;
  quantity: number;
  priceMultiplier: number;
  isDefault: boolean;
  sortOrder: number;
}

export interface ProductVarietyBoxOption {
  id: number;
  slotName: string;
  slotQuantity: number;
  sortOrder: number;
  snackOptions: VarietyBoxSnackOption[];
}

export interface VarietyBoxSnackOption {
  id: number;
  snackProductId: number;
  displayName: string;
  size?: string;
  sortOrder: number;
}

export interface SimpleProductImage {
  id: number;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface SimpleProductAttribute {
  id: number;
  name: string;
  value: string;
  sortOrder: number;
}

// Dynamic Configuration interfaces
export interface DynamicConfiguration {
  configurationTypeId: number;
  name: string;
  type: string; // dropdown, radio, etc.
  source: string; // "category" or "override"
  overrideType: string; // inherit, custom, disabled
  isRequired: boolean;
  showPriceImpact: boolean;
  sortOrder: number;
  isActive: boolean;
  options: ConfigurationOption[];
  customOptions?: string; // JSON for custom options
}

export interface ConfigurationOption {
  id: number;
  configurationTypeId: number;
  name: string;
  value: string;
  sku?: string;
  priceModifier: number;
  priceType: 'fixed' | 'percentage' | 'multiplier' | 'replace';
  isDefault: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Simple Category type for Step 2
export interface SimpleCategory {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  parentName?: string;
  isActive: boolean;
  sortOrder: number;
  slug?: string;
  children?: SimpleCategory[];
}

// Simple API response type
export interface SimpleApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Simple Products API Service
export class SimpleProductsApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Step 1: Get all products with sorting support
  async getAllProducts(sortBy?: string, sortOrder?: string): Promise<SimpleProduct[]> {
    try {
      console.log('🔄 Fetching all products with sorting...');

      let url = `${this.baseUrl}/products/search?page=1&pageSize=50`;

      // Add sorting parameters
      if (sortBy) {
        url += `&sortBy=${encodeURIComponent(sortBy)}`;
      }
      if (sortOrder) {
        url += `&sortOrder=${encodeURIComponent(sortOrder)}`;
      }

      console.log('📡 API URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Raw API response:', data);

      if (data.success && data.data && data.data.products) {
        console.log('✅ Products loaded successfully:', data.data.products.length);
        return data.data.products.map(enhanceSimpleProduct);
      } else {
        console.error('❌ Invalid API response format:', data);
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
      throw error;
    }
  }



  // Step 2: Get products by category with sorting
  async getProductsByCategory(categoryId: number, sortBy?: string, sortOrder?: string): Promise<SimpleProduct[]> {
    try {
      console.log(`🔄 Step 2: Fetching products for category ${categoryId} with sorting...`);

      let url = `${this.baseUrl}/products/search?categoryId=${categoryId}&page=1&pageSize=50`;

      // Add sorting parameters
      if (sortBy) {
        url += `&sortBy=${encodeURIComponent(sortBy)}`;
      }
      if (sortOrder) {
        url += `&sortOrder=${encodeURIComponent(sortOrder)}`;
      }

      console.log('📡 Category Products API URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('📊 Category Products Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Category Products Response data:', data);

      if (data.success && data.data && data.data.products) {
        console.log('✅ Successfully fetched', data.data.products.length, 'products for category', categoryId);
        return data.data.products.map(enhanceSimpleProduct);
      } else {
        console.error('❌ Category Products API response format unexpected:', data);
        throw new Error('Invalid category products API response format');
      }
    } catch (error) {
      console.error('❌ Failed to fetch products by category:', error);
      throw error;
    }
  }

  // Step 3: Get all categories (simplest possible)
  async getAllCategories(): Promise<SimpleCategory[]> {
    try {
      console.log('🔄 Step 3: Fetching all categories...');

      const url = `${this.baseUrl}/products/categories`;
      console.log('📡 Categories API URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('📊 Categories Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Categories Response data:', data);

      if (data.success && data.categories && Array.isArray(data.categories)) {
        console.log('✅ Successfully fetched', data.categories.length, 'categories');
        return data.categories;
      } else {
        console.error('❌ Categories API response format unexpected:', data);
        console.error('Expected: { success: true, categories: [...] }');
        console.error('Received:', JSON.stringify(data, null, 2));
        throw new Error('Invalid categories API response format');
      }
    } catch (error) {
      console.error('❌ Failed to fetch categories:', error);
      throw error;
    }
  }

  // Step 4: Get product by ID with enhanced details
  async getProductById(id: number): Promise<SimpleProduct | null> {
    try {
      console.log(`🔄 Step 4: Fetching product by ID ${id} with enhanced details...`);

      const url = `${this.baseUrl}/products/${id}/details`;
      console.log('📡 Product Detail API URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('📊 Product Detail Response status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('📭 Product not found');
          return null;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Product Detail Response data:', data);

      if (data.success && data.product) {
        console.log('✅ Successfully fetched enhanced product details:', data.product.name);
        console.log('🔧 Configuration type:', data.product.configuration?.configurationType);
        console.log('📊 Quantity sets:', data.product.quantitySets?.length || 0);
        console.log('🎁 Variety box options:', data.product.varietyBoxOptions?.length || 0);
        console.log('✨ Highlights:', data.product.highlights?.length || 0);
        return enhanceSimpleProduct(data.product);
      } else {
        console.error('❌ Product Detail API response format unexpected:', data);
        throw new Error('Invalid product detail API response format');
      }
    } catch (error) {
      console.error('❌ Failed to fetch product by ID:', error);
      throw error;
    }
  }

  // Step 5: Get product by slug (convert slug to ID first, then get product)
  async getProductBySlug(slug: string): Promise<SimpleProduct | null> {
    try {
      console.log(`🔄 Step 5: Fetching product by slug "${slug}"...`);

      // Handle empty or invalid slug
      if (!slug || slug.trim() === '') {
        console.log('❌ Empty slug provided');
        return null;
      }

      // Check if slug is actually a numeric ID
      // Only treat as ID if the entire string is numeric (to avoid matching slugs like "1-pole-rectangle")
      const isNumeric = /^\d+$/.test(slug);
      if (isNumeric) {
        const numericId = parseInt(slug);
        console.log(`🔄 Slug is a numeric ID: ${numericId}, fetching directly...`);
        return await this.getProductById(numericId);
      }

      // Try the direct slug endpoint first with enhanced details
      const slugUrl = `${this.baseUrl}/products/slug/${encodeURIComponent(slug)}`;
      console.log('📡 Product Slug API URL:', slugUrl);

      try {
        const slugResponse = await fetch(slugUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (slugResponse.ok) {
          const slugData = await slugResponse.json();
          console.log('📦 Product Slug Response data:', slugData);

          if (slugData.success && slugData.product) {
            console.log('✅ Found product by direct slug lookup with enhanced details');
            console.log('🔧 Configuration type:', slugData.product.configuration?.configurationType);
            return enhanceSimpleProduct(slugData.product);
          }
        }
      } catch (_slugError) {
        console.log('⚠️ Direct slug lookup failed, trying search fallback...');
      }

      // Fallback: search for the product by name using the search endpoint
      // Try with cleaned slug (replace hyphens with spaces) to improve search matches
      const searchTerm = slug.replace(/-/g, ' ');
      const searchUrl = `${this.baseUrl}/products/search?searchTerm=${encodeURIComponent(searchTerm)}&page=1&pageSize=20`;
      console.log('📡 Product Search API URL:', searchUrl);

      const searchResponse = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!searchResponse.ok) {
        throw new Error(`HTTP ${searchResponse.status}: ${searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();
      console.log('📦 Product Search Response data:', searchData);

      if (searchData.success && searchData.data && searchData.data.products && searchData.data.products.length > 0) {
        // First, try to find the product with matching slug
        let product = searchData.data.products.find((p: SimpleProduct) => p.slug === slug);

        if (product) {
          console.log('✅ Found product by exact slug match, fetching full details...');
          return await this.getProductById(product.id);
        }

        // If no slug match, try to find by name similarity (for products without slugs)
        const slugWords = slug.toLowerCase().replace(/-/g, ' ').split(' ');
        product = searchData.data.products.find((p: SimpleProduct) => {
          const productName = p.name.toLowerCase();
          return slugWords.every(word => productName.includes(word));
        });

        if (product) {
          console.log('✅ Found product by name similarity, fetching full details...');
          return await this.getProductById(product.id);
        }

        // If still no match, try the first result from search
        if (searchData.data.products.length > 0) {
          console.log('⚠️ Using first search result as fallback...');
          return await this.getProductById(searchData.data.products[0].id);
        }
      }

      console.log('📭 Product not found by slug');
      return null;
    } catch (error) {
      console.error('❌ Failed to fetch product by slug:', error);
      throw error;
    }
  }

  // Step 6: Get related products by category
  async getRelatedProducts(categoryId: number, excludeProductId?: number, limit: number = 4): Promise<SimpleProduct[]> {
    try {
      console.log(`🔄 Step 6: Fetching related products for category ${categoryId}...`);

      const url = `${this.baseUrl}/products/search?categoryId=${categoryId}&page=1&pageSize=${limit + 1}`;
      console.log('📡 Related Products API URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('📊 Related Products Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Related Products Response data:', data);

      if (data.success && data.data && data.data.products) {
        let relatedProducts = data.data.products;

        // Exclude the current product if specified
        if (excludeProductId) {
          relatedProducts = relatedProducts.filter((p: SimpleProduct) => p.id !== excludeProductId);
        }

        // Limit the results
        relatedProducts = relatedProducts.slice(0, limit);

        console.log('✅ Successfully fetched', relatedProducts.length, 'related products');
        return relatedProducts.map(enhanceSimpleProduct);
      } else {
        console.error('❌ Related Products API response format unexpected:', data);
        return [];
      }
    } catch (error) {
      console.error('❌ Failed to fetch related products:', error);
      return [];
    }
  }

  // Step 7: Test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔄 Testing API connection...');
      
      // Try the standard health endpoint
      const healthUrl = `${this.baseUrl.replace(/\/api\/?$/, '')}/health`;
      console.log(`Pinging health endpoint: ${healthUrl}`);
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Short timeout for health check
        signal: AbortSignal.timeout(5000)
      });

      const isHealthy = response.ok;
      console.log(isHealthy ? '✅ API is healthy' : `❌ API returned status: ${response.status}`);
      
      return isHealthy;
    } catch (error) {
      console.error('❌ API connection test failed:', error);
      // Fallback: try the API root if health check fails
      try {
           const rootResponse = await fetch(this.baseUrl, { 
              method: 'HEAD',
              signal: AbortSignal.timeout(5000)
           });
           return rootResponse.ok;
      } catch (e) {
          return false;
      }
    }
  }
}

// Export singleton instance
export const simpleProductsApi = new SimpleProductsApi();
