import { API_BASE_URL } from './config';

// Types for Cart API
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  productPrice: number;
  productImage?: string;
  productAttributes?: string;
  quantity: number;
  totalPrice: number;
  isInStock: boolean;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  uniqueItemsCount: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
  productAttributes?: string;
  calculatedPrice?: number; // Add calculated price from product detail page
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  cart?: CartSummary;
  message?: string;
}

export interface CartItemResponse {
  success: boolean;
  cartItem?: CartItem;
  message?: string;
}

class CartApiService {
  private readonly baseUrl = `${API_BASE_URL}/Cart`;

  /**
   * Get cart items for a user
   */
  async getCart(userId: number): Promise<CartResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting cart:', error);
      return {
        success: false,
        message: 'Failed to get cart items'
      };
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(userId: number, request: AddToCartRequest): Promise<CartItemResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding to cart:', error);
      return {
        success: false,
        message: 'Failed to add item to cart'
      };
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(userId: number, cartItemId: number, request: UpdateCartItemRequest): Promise<CartItemResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/items/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating cart item:', error);
      return {
        success: false,
        message: 'Failed to update cart item'
      };
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(userId: number, cartItemId: number): Promise<CartResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/items/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error removing from cart:', error);
      return {
        success: false,
        message: 'Failed to remove item from cart'
      };
    }
  }

  /**
   * Clear all items from cart
   */
  async clearCart(userId: number): Promise<CartResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error clearing cart:', error);
      return {
        success: false,
        message: 'Failed to clear cart'
      };
    }
  }
}

export const cartApi = new CartApiService();
