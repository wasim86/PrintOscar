'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { LoginModal } from '@/components/Auth/LoginModal';
import { SignupModal } from '@/components/Auth/SignupModal';
import { SimplePriceDisplay } from '@/components/Currency/PriceDisplay';
import { usePriceUtils } from '@/utils/priceUtils';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';


// Free shipping threshold
const FREE_SHIPPING_THRESHOLD = 120;

export default function CartPage() {
  // Use real cart data from context
  const { cart, guestCart, isLoading, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { convertAndFormatPrice } = usePriceUtils();

  // Modal states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  // Use guest cart if not authenticated, otherwise use user cart
  const currentCart = isAuthenticated ? cart : guestCart;
  const cartItems = currentCart?.items || [];
  const totalItems = currentCart?.totalItems || 0;



  // Calculate totals
  const subtotal = currentCart?.subtotal || 0;
  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  // Handle quantity updates
  const handleUpdateQuantity = async (cartItemId: number | string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(cartItemId);
    } else {
      await updateQuantity(cartItemId, newQuantity);
    }
  };

  // Handle item removal
  const handleRemoveItem = async (cartItemId: number | string) => {
    await removeFromCart(cartItemId);
  };




  // Helper function to parse configuration display name
  const getConfigurationDisplayName = (productAttributes?: string): string => {
    if (!productAttributes) return '';
    
    try {
      const config = JSON.parse(productAttributes);
      return config.displayName || '';
    } catch {
      return '';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Empty cart state
  if (!currentCart || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Shopping Cart</span>
          </nav>

          {/* Empty Cart State */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Discover our amazing snacks and handmade products to get started!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900">Shopping Cart</span>
        </nav>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart ({totalItems} items)
          </h1>
          <Link
            href="/products"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
        </div>

        {/* Free Shipping Progress */}
        {remainingForFreeShipping > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-800">
                Add {convertAndFormatPrice(remainingForFreeShipping)} more for FREE shipping!
              </span>
              <span className="text-sm text-orange-600">
                {freeShippingProgress.toFixed(0)}% to free shipping
              </span>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Cart Header */}
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <img
                        src={item.productImage || 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=150&h=150&fit=crop'}
                        alt={item.productName}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {item.productName}
                        </h3>
                        <div className="text-orange-600 font-semibold mb-2">
                          <SimplePriceDisplay
                            price={getEachPrice(item)}
                            size="sm"
                            className="inline"
                          /> each
                        </div>
                        
                        {/* Configuration Display */}
                        {item.productAttributes && getConfigurationDisplayName(item.productAttributes) && (
                          <p className="text-sm text-gray-600 mb-3">
                            {getConfigurationDisplayName(item.productAttributes)}
                          </p>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 text-gray-900"
                            disabled={isLoading}
                          >
                            <Minus className="h-4 w-4 text-gray-900" />
                          </button>
                          <span className="text-lg font-medium w-8 text-center text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 text-gray-900"
                            disabled={isLoading}
                          >
                            <Plus className="h-4 w-4 text-gray-900" />
                          </button>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="text-right">
                        <SimplePriceDisplay
                          price={item.totalPrice}
                          size="lg"
                          className="font-bold text-gray-900 mb-2"
                        />
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Summary</h2>

              {/* Free Shipping Progress */}
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Free shipping progress</span>
                    <span>{Math.round(freeShippingProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${freeShippingProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Add <span className="font-semibold text-orange-600">{convertAndFormatPrice(remainingForFreeShipping)}</span> more for free shipping!
                  </p>
                </div>
              )}

              {subtotal >= FREE_SHIPPING_THRESHOLD && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">
                    🎉 You qualify for free shipping!
                  </p>
                </div>
              )}

              {/* Subtotal */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Subtotal ({cartItems.length || 0} items)</span>
                  <SimplePriceDisplay
                    price={subtotal}
                    size="md"
                    className="font-semibold text-gray-900"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Shipping, taxes, and discounts calculated at checkout
                </p>
              </div>

              {/* Checkout Actions - Now supports both authenticated and guest users */}
              <div className="space-y-3">
                {/* Primary Checkout Button - Available for all users */}
                <Link
                  href="/checkout"
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                >
                  Proceed to Checkout
                </Link>

                {/* Guest Checkout Information */}
                {!isAuthenticated && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-800 font-medium mb-1">
                          Guest Checkout Available
                        </p>
                        <p className="text-xs text-blue-600">
                          You can checkout without creating an account. We'll just need your email and shipping information.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Optional Login/Signup for Guest Users */}
                {!isAuthenticated && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3 text-center">
                      Or sign in for a faster checkout experience
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setIsLoginModalOpen(true)}
                        className="bg-white text-gray-700 py-2 px-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors text-sm"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => setIsSignupModalOpen(true)}
                        className="bg-white text-gray-700 py-2 px-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors text-sm"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="w-full mt-3 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />
    </div>
  );
}
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
