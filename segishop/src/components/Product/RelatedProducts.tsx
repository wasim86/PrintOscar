'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { PriceDisplay } from '@/components/Currency/PriceDisplay';
import { DEFAULT_PRODUCT_IMAGE } from '@/services/config';

interface RelatedProduct {
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
  stock?: number;
  stockCount?: number;
  isFeatured?: boolean;
  createdAt?: string;
  dateCreated?: string;
}

// Helper function to determine product labels
const getProductLabels = (product: RelatedProduct) => {
  const labels = [];

  // Featured label
  if (product.isFeatured) {
    labels.push({
      text: 'Featured',
      className: 'bg-orange-500 text-white'
    });
  }

  // Low Stock label (stock <= 10)
  const stock = product.stock || product.stockCount || 0;
  if (stock > 0 && stock <= 10) {
    labels.push({
      text: 'Low Stock',
      className: 'bg-red-500 text-white'
    });
  }

  // New Product label (created within last 30 days)
  if (product.createdAt || product.dateCreated) {
    const createdDate = new Date(product.createdAt || product.dateCreated || '');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (createdDate > thirtyDaysAgo) {
      labels.push({
        text: 'New',
        className: 'bg-green-500 text-white'
      });
    }
  }

  return labels;
};

interface RelatedProductsProps {
  products: RelatedProduct[];
  title?: string;
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  title = "Related Products",
  onAddToCart,
  onAddToWishlist
}) => {
  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // Calculate discount percentage
  const getDiscountPercentage = (price: number, originalPrice?: number) => {
    if (!originalPrice) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">Discover more products you might like</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const discountPercentage = getDiscountPercentage(product.price, product.originalPrice);
          
          return (
            <div key={product.id} className="group relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                <Link href={`/products/${product.slug || product.id}`} prefetch={false}>
                  <img
                    src={product.image || DEFAULT_PRODUCT_IMAGE}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                
                {/* Product Labels */}
                {(() => {
                  const labels = getProductLabels(product);
                  if (labels.length === 0 && discountPercentage === 0) return null;

                  return (
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {/* Discount Badge */}
                      {discountPercentage > 0 && (
                        <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{discountPercentage}%
                        </div>
                      )}
                      {/* Other Labels */}
                      {labels.map((label, index) => (
                        <div
                          key={index}
                          className={`${label.className} px-2 py-1 rounded text-xs font-bold`}
                        >
                          {label.text}
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Stock Status */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-medium">Out of Stock</span>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => onAddToWishlist(product.id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="Add to Wishlist"
                  >
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                  {product.inStock && (
                    <button
                      onClick={() => onAddToCart(product.id)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                      title="Quick Add to Cart"
                    >
                      <ShoppingCart className="h-4 w-4 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                {/* Category */}
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  {product.category}
                </div>

                {/* Title */}
                <Link href={`/products/${product.slug || product.id}`} prefetch={false}>
                  <h3 className="font-medium text-gray-900 hover:text-orange-600 transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.reviewCount})
                  </span>
                </div>

                {/* Price */}
                <PriceDisplay
                  price={product.price}
                  originalPrice={product.originalPrice}
                  size="lg"
                  className="flex items-center space-x-2"
                />

                {/* Add to Cart Button */}
                <button
                  onClick={() => onAddToCart(product.id)}
                  disabled={!product.inStock}
                  className="w-full text-white py-2 px-4 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                  style={{
                    backgroundColor: !product.inStock ? undefined : '#ddc464'
                  }}
                  onMouseEnter={(e) => {
                    if (product.inStock) {
                      e.currentTarget.style.backgroundColor = '#c9b355';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (product.inStock) {
                      e.currentTarget.style.backgroundColor = '#ddc464';
                    }
                  }}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View More Button */}
      <div className="text-center mt-8">
        <Link
          href="/products"
          className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
};
