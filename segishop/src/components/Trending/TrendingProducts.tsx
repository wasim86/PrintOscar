'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Heart, 
  ShoppingCart, 
  Star, 
  Eye,
  Flame,
  ArrowRight
} from 'lucide-react';
import { DEFAULT_PRODUCT_IMAGE } from '@/services/config';

interface TrendingProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  trendingRank: number;
  viewsToday: number;
  salesIncrease: number;
  category: string;
  isNew: boolean;
  inStock: boolean;
}

interface TrendingProductsProps {
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
}

export const TrendingProducts: React.FC<TrendingProductsProps> = ({
  onAddToCart,
  onAddToWishlist
}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock trending products data
  const trendingProducts: TrendingProduct[] = [
    {
      id: '1',
      name: 'Organic Trail Mix Deluxe',
      price: 24.99,
      originalPrice: 29.99,
      image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=400&fit=crop',
      rating: 4.8,
      reviewCount: 124,
      trendingRank: 1,
      viewsToday: 1250,
      salesIncrease: 45,
      category: 'Snacks',
      isNew: false,
      inStock: true
    },
    {
      id: '2',
      name: 'Handmade Canvas Tote Bag',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
      rating: 4.6,
      reviewCount: 89,
      trendingRank: 2,
      viewsToday: 980,
      salesIncrease: 32,
      category: 'Handmades',
      isNew: true,
      inStock: true
    },
    {
      id: '3',
      name: 'Organic Dried Mango Strips',
      price: 18.50,
      originalPrice: 22.00,
      image: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=400&h=400&fit=crop',
      rating: 4.9,
      reviewCount: 156,
      trendingRank: 3,
      viewsToday: 875,
      salesIncrease: 28,
      category: 'Snacks',
      isNew: false,
      inStock: true
    },
    {
      id: '4',
      name: 'Artisan Chocolate Collection',
      price: 32.99,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      rating: 4.7,
      reviewCount: 203,
      trendingRank: 4,
      viewsToday: 720,
      salesIncrease: 25,
      category: 'Snacks',
      isNew: false,
      inStock: true
    },
    {
      id: '5',
      name: 'Eco-Friendly Water Bottle',
      price: 28.99,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      rating: 4.5,
      reviewCount: 67,
      trendingRank: 5,
      viewsToday: 650,
      salesIncrease: 22,
      category: 'Handmades',
      isNew: true,
      inStock: true
    },
    {
      id: '6',
      name: 'Organic Granola Bars (12-pack)',
      price: 21.99,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
      rating: 4.4,
      reviewCount: 91,
      trendingRank: 6,
      viewsToday: 580,
      salesIncrease: 18,
      category: 'Snacks',
      isNew: false,
      inStock: false
    }
  ];

  const categories = ['all', 'Snacks', 'Handmades'];

  const filteredProducts = activeFilter === 'all' 
    ? trendingProducts 
    : trendingProducts.filter(product => product.category === activeFilter);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getTrendingBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
    if (rank <= 3) return 'bg-gradient-to-r from-orange-400 to-red-500 text-white';
    return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <TrendingUp className="h-8 w-8 text-orange-500 mr-3" />
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Trending Products
          </h2>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover what's hot right now! These are the products our customers can't stop talking about.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === category
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">1.2K+</div>
          <div className="text-sm text-gray-600">Views Today</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">+35%</div>
          <div className="text-sm text-gray-600">Sales Increase</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">4.7★</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">89%</div>
          <div className="text-sm text-gray-600">Satisfaction</div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
          >
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100">
              <img
                src={product.image || DEFAULT_PRODUCT_IMAGE}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col space-y-2">
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${getTrendingBadgeColor(product.trendingRank)}`}>
                  <div className="flex items-center">
                    <Flame className="h-3 w-3 mr-1" />
                    #{product.trendingRank}
                  </div>
                </div>
                {product.isNew && (
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    NEW
                  </span>
                )}
                {product.originalPrice && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    SALE
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => onAddToWishlist(product.id)}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
              >
                <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
              </button>

              {/* Quick View */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-colors flex items-center justify-center">
                <button className="px-4 py-2 bg-white text-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100">
                  <Eye className="h-4 w-4 inline mr-2" />
                  Quick View
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
              
              {/* Rating */}
              <div className="flex items-center mb-2">
                <div className="flex items-center mr-2">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-500">({product.reviewCount})</span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs text-green-600 font-medium">+{product.salesIncrease}% sales</div>
                  <div className="text-xs text-gray-500">{product.viewsToday} views today</div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => onAddToCart(product.id)}
                disabled={!product.inStock}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  product.inStock
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Products Button */}
      <div className="text-center mt-12">
        <a
          href="/products"
          className="inline-flex items-center px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
        >
          View All Products
          <ArrowRight className="h-4 w-4 ml-2" />
        </a>
      </div>
    </div>
  );
};
