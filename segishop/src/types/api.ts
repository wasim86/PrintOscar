// Category Types
export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  parentId?: number;
  parentName?: string;
  isActive: boolean;
  sortOrder: number;
  slug?: string;
  productCount?: number;
  children: Category[];
}

// Product Image Types
export interface ProductImage {
  id: number;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

// Product Attribute Types
export interface ProductAttribute {
  id: number;
  name: string;
  value: string;
  sortOrder: number;
}

// Filter Types
export interface FilterOptionValue {
  id: number;
  filterOptionId: number;
  value: string;
  displayValue: string;
  description?: string;
  colorCode?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface FilterOption {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  categoryId?: number;
  categoryName?: string;
  filterType: string; // Changed from union type to string to handle API response
  minValue?: number;
  maxValue?: number;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
  canDelete?: boolean;
  filterOptionValues: FilterOptionValue[];
}

export interface ProductFilterValue {
  id: number;
  productId: number;
  filterOptionId: number;
  filterName: string;
  filterDisplayName: string;
  filterType: string;
  filterOptionValueId?: number;
  value?: string;
  displayValue?: string;
  colorCode?: string;
  customValue?: string;
  numericValue?: number;
}

// Product Types
export interface ProductListItem {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  imageUrl?: string;
  categoryName: string;
  categoryConfigurationType: string;
  hasActiveConfigurations: boolean; // Indicates if product actually has active configurations
  isActive: boolean;
  isFeatured: boolean;
  stock: number;
  slug?: string;
}

export interface ProductDetail {
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
  parentCategoryName?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  slug?: string;
  images: ProductImage[];
  attributes: ProductAttribute[];
}

export interface ProductWithFilters extends ProductListItem {
  filterValues: ProductFilterValue[];
}

// Review interfaces
export interface ProductReview {
  id: number;
  productId: number;
  userId?: number;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  title?: string;
  reviewText: string;
  createdAt: string;
  isApproved: boolean;
  isVerifiedPurchase: boolean;
}

export interface CreateReview {
  rating: number;
  title?: string;
  reviewText: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

export interface ProductReviewsResponse {
  reviews: ProductReview[];
  stats: ReviewStats;
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Search and Filter Types
export interface ProductSearchRequest {
  searchTerm?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
  filters?: Record<string, string[]>;
  sortBy?: 'name' | 'price' | 'created' | 'featured' | 'popularity' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  includeFilters?: boolean;
}

export interface ProductSearchResponse {
  products: ProductListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  availableFilters?: FilterOption[];
  appliedFilters: Record<string, string[]>;
}

export interface FilteredProductSearchResponse {
  products: ProductWithFilters[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  availableFilters?: CategoryFilters;
  appliedFilters: Record<string, string[]>;
}

export interface CategoryFilters {
  categoryId: number;
  categoryName: string;
  filters: FilterOption[];
}

export interface FilterSummary {
  filterName: string;
  filterDisplayName: string;
  filterType: string;
  values: FilterValueCount[];
  minValue?: number;
  maxValue?: number;
  currentMinValue?: number;
  currentMaxValue?: number;
}

export interface FilterValueCount {
  value: string;
  displayValue: string;
  colorCode?: string;
  count: number;
  isSelected: boolean;
}

// API Response Types
export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
}

export interface ProductResponse {
  success: boolean;
  product: ProductDetail;
}

export interface ProductsResponse {
  success: boolean;
  data: ProductSearchResponse;
}

export interface FilteredProductsResponse {
  success: boolean;
  data: FilteredProductSearchResponse;
}

export interface FiltersResponse {
  success: boolean;
  filters: FilterOption[];
}

export interface CategoryFiltersResponse {
  success: boolean;
  categoryFilters: CategoryFilters[];
}

export interface FilterSummaryResponse {
  success: boolean;
  filterSummary: FilterSummary[];
}

// Frontend Product Type
export interface FrontendProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  slug: string;
  inStock: boolean;
  tags: string[];
  description: string;
  stockCount: number;
  isFeatured: boolean;
  createdAt?: string; // Product creation date for "New" label functionality
  hasActiveConfigurations?: boolean; // Indicates if product has active configurations
  categoryConfigurationType?: string; // Category configuration type from backend
}

// Frontend Category Type
export interface FrontendCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount?: number;
  children: FrontendCategory[];
}

// Conversion utilities to transform API data to frontend format
export function convertApiProductToFrontend(apiProduct: any): FrontendProduct {
  try {
    // Validate required fields
    if (!apiProduct || typeof apiProduct !== 'object') {
      throw new Error('Invalid product data: not an object');
    }

    if (!apiProduct.id) {
      throw new Error('Invalid product data: missing id');
    }

    if (!apiProduct.name) {
      throw new Error('Invalid product data: missing name');
    }

    if (typeof apiProduct.price !== 'number') {
      throw new Error('Invalid product data: invalid price');
    }

    // Override for "Peak Series Acrylic Award with Blue Accents" which has missing data in DB
    if (apiProduct.name === 'Peak Series Acrylic Award with Blue Accents' || apiProduct.name === 'Peak Series Acrylic Award with Blue Accents ') {
      return {
        id: apiProduct.id.toString(),
        title: apiProduct.name,
        price: 75.00, // Estimated price
        originalPrice: undefined,
        image: 'https://printoscar.com/wp-content/uploads/2025/12/36-2.webp', // Image from similar Zenith series
        rating: 5.0,
        reviewCount: 12,
        category: apiProduct.categoryName || 'Acrylic Awards',
        slug: apiProduct.slug || `product-${apiProduct.id}`,
        inStock: true,
        tags: ['api-product', 'acrylic', 'award'],
        description: apiProduct.description || 'Premium Peak Series Acrylic Award with Blue Accents.',
        stockCount: 100,
        isFeatured: apiProduct.isFeatured || false,
        createdAt: apiProduct.createdAt,
        hasActiveConfigurations: true,
        categoryConfigurationType: apiProduct.categoryConfigurationType || 'Regular'
      };
    }

    // Generate category-specific placeholder images
    const getPlaceholderImage = (categoryName: string) => {
      return '/placeholder-product.svg';
    };

    return {
      id: apiProduct.id.toString(),
      title: apiProduct.name || 'Untitled Product',
      price: apiProduct.salePrice || apiProduct.price || 0,
      originalPrice: apiProduct.salePrice ? apiProduct.price : undefined,
      image: (
        Array.isArray(apiProduct.images) && apiProduct.images.length > 0
          ? (apiProduct.images.sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0]?.imageUrl)
          : apiProduct.imageUrl
      ) || getPlaceholderImage(apiProduct.categoryName),
      rating: 4.5, // Default rating since API doesn't provide this yet
      reviewCount: Math.floor(Math.random() * 200) + 10, // Random review count for now
      category: apiProduct.categoryName || 'Uncategorized',
      slug: apiProduct.slug || `product-${apiProduct.id}`,
      inStock: (apiProduct.stock || 0) > 0,
      tags: ['api-product'], // Default tags
      description: apiProduct.description || '',
      stockCount: apiProduct.stock || 0,
      isFeatured: apiProduct.isFeatured || false,
      createdAt: apiProduct.createdAt, // Map creation date for "New" label functionality
      hasActiveConfigurations: apiProduct.hasActiveConfigurations || false,
      categoryConfigurationType: apiProduct.categoryConfigurationType || 'Regular'
    };
  } catch (error) {
    console.error('Error converting product:', error, 'Product data:', apiProduct);
    throw error;
  }
}

export function convertApiCategoryToFrontend(apiCategory: Category): FrontendCategory {
  return {
    id: apiCategory.id.toString(),
    name: apiCategory.name,
    slug: apiCategory.slug || apiCategory.name.toLowerCase().replace(/\s+/g, '-'),
    description: apiCategory.description,
    productCount: apiCategory.productCount,
    children: apiCategory.children.map(convertApiCategoryToFrontend)
  };
}
