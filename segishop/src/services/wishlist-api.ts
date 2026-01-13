import { API_BASE_URL } from './config';

// Helper function for API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Request types
export interface AddToWishlistRequest {
  productId: number;
}

export interface RemoveFromWishlistRequest {
  productId: number;
}

// Response types
export interface WishlistResponse {
  success: boolean;
  message: string;
  items: WishlistItem[];
  totalCount: number;
}

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  categoryName: string;
  inStock: boolean;
  stock: number;
  dateAdded: string;
  sku: string;
  description: string;
  isFeatured: boolean;
  rating?: number;
  reviewCount: number;
}

export interface WishlistActionResponse {
  success: boolean;
  message: string;
  wishlistCount: number;
  item?: WishlistItem;
}

export interface WishlistCountResponse {
  success: boolean;
  count: number;
}

// Wishlist API Service
export class WishlistApiService {
  // Get user's wishlist
  static async getWishlist(userId: number): Promise<WishlistResponse> {
    return apiRequest<WishlistResponse>(`/wishlist/${userId}`);
  }

  // Add product to wishlist
  static async addToWishlist(userId: number, request: AddToWishlistRequest): Promise<WishlistActionResponse> {
    return apiRequest<WishlistActionResponse>(`/wishlist/${userId}/add`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Remove product from wishlist
  static async removeFromWishlist(userId: number, request: RemoveFromWishlistRequest): Promise<WishlistActionResponse> {
    return apiRequest<WishlistActionResponse>(`/wishlist/${userId}/remove`, {
      method: 'DELETE',
      body: JSON.stringify(request),
    });
  }

  // Get wishlist count
  static async getWishlistCount(userId: number): Promise<WishlistCountResponse> {
    return apiRequest<WishlistCountResponse>(`/wishlist/${userId}/count`);
  }

  // Check if product is in wishlist
  static async isInWishlist(userId: number, productId: number): Promise<boolean> {
    return apiRequest<boolean>(`/wishlist/${userId}/check/${productId}`);
  }

  // Clear entire wishlist
  static async clearWishlist(userId: number): Promise<WishlistActionResponse> {
    return apiRequest<WishlistActionResponse>(`/wishlist/${userId}/clear`, {
      method: 'DELETE',
    });
  }
}

// Frontend conversion helpers
export function convertApiWishlistItemToFrontend(apiItem: WishlistItem) {
  return {
    id: apiItem.id.toString(),
    productId: apiItem.productId,
    name: apiItem.productName,
    slug: apiItem.productSlug,
    price: apiItem.price,
    originalPrice: apiItem.salePrice ? apiItem.price : undefined,
    salePrice: apiItem.salePrice,
    image: apiItem.imageUrl || '/placeholder-product.svg',
    category: apiItem.categoryName,
    inStock: apiItem.inStock,
    stock: apiItem.stock,
    dateAdded: apiItem.dateAdded,
    sku: apiItem.sku,
    description: apiItem.description,
    isFeatured: apiItem.isFeatured,
    rating: apiItem.rating || 0,
    reviewCount: apiItem.reviewCount
  };
}
