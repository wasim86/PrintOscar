'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, X, ShoppingCart } from 'lucide-react';
import { SimplePriceDisplay } from '@/components/Currency/PriceDisplay';
import { useCart } from '@/contexts/CartContext';
import { CartFreeShippingBanner } from '@/components/FreeShippingBanner';
import './Cart.css';

export const Cart: React.FC = () => {
  const { cart, guestCart, isLoading, updateQuantity, removeFromCart, isCartOpen, closeCart, isGuestMode } = useCart();

  // Use guest cart if not authenticated, otherwise use user cart
  const currentCart = isGuestMode ? guestCart : cart;
  const cartItems = currentCart?.items || [];
  const totalItems = currentCart?.totalItems || 0;
  const subtotal = currentCart?.subtotal || 0;

  const getEachPrice = (item: any) => {
    const base = item.productPrice;
    if (typeof base === 'number') return base;
    const attr: string = item.productAttributes || '';
    const match = attr.match(/(\d+)\s*pack/i);
    const packQty = match ? parseInt(match[1]) : undefined;
    const effective = item.effectivePrice;
    if (packQty && typeof effective === 'number') return effective / packQty;
    if (packQty && typeof item.unitPrice === 'number') return item.unitPrice / packQty;
    return typeof item.unitPrice === 'number' ? item.unitPrice : (item.totalPrice / item.quantity);
  };

  const handleUpdateQuantity = async (cartItemId: number | string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(cartItemId);
    } else {
      await updateQuantity(cartItemId, newQuantity);
    }
  };

  const handleRemoveItem = async (cartItemId: number | string) => {
    await removeFromCart(cartItemId);
  };

  // Empty cart state
  if (!currentCart || cartItems.length === 0) {
    return (
      <div className={`fixed inset-0 z-50 ${isCartOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeCart}
          aria-hidden="true"
        />
        {/* Cart Panel */}
        <div className="cart-container absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
              <button onClick={closeCart} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Empty State */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some products to get started!</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 ${isCartOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden="true"
      />
      {/* Cart Panel */}
      <div className="cart-container absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-hidden">
        <div className="flex h-full flex-col max-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Cart ({totalItems})
            </h2>
            <button onClick={closeCart} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Free Shipping Banner */}
          <div className="px-6 py-3">
            <CartFreeShippingBanner
              dismissible={false}
              showProgress={true}
              persistent={true}
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                  {/* Product Image */}
                  <img
                      src={item.productImage || '/placeholder-product.svg'}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                    />

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.productName}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <SimplePriceDisplay
                        price={getEachPrice(item)}
                        size="sm"
                        className="inline"
                      /> each
                    </div>
                    {item.productAttributes && (
                      <div className="text-xs text-gray-500 mt-1">
                        {(() => {
                          try {
                            const config = JSON.parse(item.productAttributes);
                            return config.displayName || 'Custom configuration';
                          } catch {
                            return 'Standard';
                          }
                        })()}
                      </div>
                    )}

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
                        disabled={isLoading}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="flex flex-col items-end gap-2">
                    <SimplePriceDisplay
                      price={item.totalPrice}
                      size="sm"
                      className="font-semibold text-gray-900"
                    />
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="border-t px-6 py-4 bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <SimplePriceDisplay
                  price={subtotal}
                  size="sm"
                  className="font-medium"
                />
              </div>
            </div>

            {/* View Cart Button */}
            <Link
              href="/cart"
              onClick={closeCart}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 mb-3"
            >
              <ShoppingCart className="w-4 h-4" />
              View Cart
            </Link>

            {/* Continue Shopping Button */}
            <Link
              href="/products"
              onClick={closeCart}
              className="w-full bg-white text-orange-600 py-3 px-4 rounded-lg font-medium border border-orange-600 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
