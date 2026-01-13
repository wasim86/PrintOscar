'use client';

import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,
  Filter,
  Grid,
  List,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import { PriceDisplay } from '@/components/Currency/PriceDisplay';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { WishlistItem as WishlistItemType } from '@/services/wishlist-api';

export const Wishlist: React.FC = () => {
  const { wishlistItems, isLoading, error, removeFromWishlist, clearError } = useWishlist();
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterCategory, setFilterCategory] = useState('all');

  // Get unique categories from wishlist items
  const categories = ['all', ...Array.from(new Set(wishlistItems.map(item => item.categoryName)))];

  const handleRemoveFromWishlist = async (productId: number) => {
    await removeFromWishlist(productId);
  };

  const handleAddToCart = async (item: WishlistItemType) => {
    try {
      const success = await addToCart({
        productId: item.productId,
        quantity: 1,
        productAttributes: ''
      });

      if (success) {
        // Optionally remove from wishlist after adding to cart
        // await removeFromWishlist(item.productId);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Filter and sort items
  const filteredAndSortedItems = wishlistItems
    .filter(item => filterCategory === 'all' || item.categoryName === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.productName.localeCompare(b.productName);
        case 'price':
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'dateAdded':
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const WishlistItemCard = ({ item }: { item: WishlistItemType }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={item.imageUrl || '/placeholder-product.svg'}
          alt={item.productName}
          className="w-full h-48 object-cover"
        />
        {!item.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium">Out of Stock</span>
          </div>
        )}
        <button
          onClick={() => handleRemoveFromWishlist(item.productId)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
        >
          <Heart className="h-4 w-4 text-red-500 fill-current" />
        </button>
      </div>
      
      <div className="p-4">
        <a
          href={`/products/${item.productSlug || item.productId}`}
          className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 transition-colors cursor-pointer block"
        >
          {item.productName}
        </a>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {renderStars(item.rating || 0)}
          </div>
          <span className="ml-2 text-sm text-gray-500">({item.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <PriceDisplay
            price={item.salePrice || item.price}
            originalPrice={item.salePrice ? item.price : undefined}
            size="lg"
            className="flex items-center space-x-2"
          />
          <span className="text-xs text-gray-500">
            Added {new Date(item.dateAdded).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex space-x-2">
          {item.inStock && (
            <button
              onClick={() => handleAddToCart(item)}
              className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-orange-600 text-white hover:bg-orange-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </button>
          )}
          <a
            href={`/products/${item.productSlug || item.productId}`}
            className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            title="View Product"
          >
            View Product
          </a>
        </div>
      </div>
    </div>
  );

  const WishlistItemRow = ({ item }: { item: WishlistItemType }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center space-x-4">
      <div className="relative">
        <img
          src={item.imageUrl || '/placeholder-product.svg'}
          alt={item.productName}
          className="w-20 h-20 object-cover rounded-lg"
        />
        {!item.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-medium">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <a
          href={`/products/${item.productSlug || item.productId}`}
          className="font-semibold text-gray-900 mb-1 hover:text-orange-600 transition-colors cursor-pointer block"
        >
          {item.productName}
        </a>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {renderStars(item.rating || 0)}
          </div>
          <span className="ml-2 text-sm text-gray-500">({item.reviewCount})</span>
        </div>
        <div className="flex items-center space-x-4">
          <PriceDisplay
            price={item.salePrice || item.price}
            originalPrice={item.salePrice ? item.price : undefined}
            size="lg"
            className="flex items-center space-x-2"
          />
          <span className="text-sm text-gray-500">
            Added {new Date(item.dateAdded).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {item.inStock && (
          <button
            onClick={() => handleAddToCart(item)}
            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-orange-600 text-white hover:bg-orange-700"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </button>
        )}
        <a
          href={`/products/${item.productSlug || item.productId}`}
          className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
          title="View Product"
        >
          View Product
        </a>
        <button
          onClick={() => handleRemoveFromWishlist(item.productId)}
          className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 transition-colors"
          title="Remove from Wishlist"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>
    </div>
  );

  // Clear error when component unmounts or user interacts
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <div className="space-y-6">
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={clearError}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      )}

      {/* Header */}
      {!isLoading && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
          <p className="text-gray-600 mt-1">{wishlistItems.length} items saved</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Wishlist Items */}
      {filteredAndSortedItems.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {filteredAndSortedItems.map((item) => (
            viewMode === 'grid'
              ? <WishlistItemCard key={item.id} item={item} />
              : <WishlistItemRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-4">Save items you love to your wishlist.</p>
          <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};
