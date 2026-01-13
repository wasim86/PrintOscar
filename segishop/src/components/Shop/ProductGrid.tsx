'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/app/shop/page';
import { Star, ShoppingCart, Heart, Eye, Settings } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

// Helper function to determine product labels
const getProductLabels = (product: Product) => {
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

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {
  // Configuration type detection based on category configuration
  const getConfigurationType = (product: any): 'Regular' | 'SmallBulk' | 'VarietyBox' => {
    // If product has category configuration type, use it
    if (product.categoryConfigurationType) {
      return product.categoryConfigurationType;
    }

    // Fallback to category name-based detection for backward compatibility
    const categoryLower = product.category?.toLowerCase() || '';

    if (categoryLower.includes('variety') || categoryLower.includes('box')) {
      return 'VarietyBox';
    } else if (categoryLower.includes('bulk')) {
      return 'SmallBulk';
    } else {
      // Default to Regular for snacks and other categories
      return 'Regular';
    }
  };

  const configurationType = getConfigurationType(product);

  // Use the new hasActiveConfigurations field from API, with fallback to old logic
  const hasConfigurations = product.hasActiveConfigurations !== undefined
    ? product.hasActiveConfigurations
    : configurationType !== 'Regular';

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

  // useCart hook is not available in this scope; cart functionality will be handled elsewhere
  const addToCart = async (item: { productId: string | number; quantity: number; productAttributes?: string }) => {
    // Placeholder implementation to prevent runtime error
    console.warn('addToCart called but useCart is not available', item);
    return false;
  };

  const getCategoryFallback = (categoryName?: string) => {
    return '/placeholder-product.svg';
  };
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock) {
       alert('This product is out of stock');
       return;
    }

    // Determine configuration type for attributes (copied from products/page.tsx logic)
    const productAttributes = configurationType === 'SmallBulk'
      ? JSON.stringify({
          configurationType: 'SmallBulk',
          bulkQuantity: 24 // Default minimum bulk quantity
        })
      : undefined;

    const success = await addToCart({
      productId: product.id,
      quantity: 1,
      productAttributes
    });
    
    if (!success) {
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Add to wishlist functionality
    console.log('Add to wishlist:', product.id);
  };

  if (viewMode === 'list') {
    return (
      <Link href={`/products/${product.slug || product.id}`} prefetch={false} className="block">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <img
                src={product.image || getCategoryFallback(product.category)}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = getCategoryFallback(product.category);
                  target.onerror = null;
                }}
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Out of Stock</span>
                </div>
              )}

              {/* Product Labels */}
              {(() => {
                const labels = getProductLabels(product);
                if (labels.length === 0) return null;

                return (
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {labels.map((label, index) => (
                      <div
                        key={index}
                        className={`${label.className} px-2 py-1 rounded-full text-xs font-medium shadow-sm`}
                      >
                        {label.text}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                    <span className="font-bold text-lg text-gray-900">
                      ${product.price}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.reviewCount})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddToWishlist}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                  </button>

                  {product.inStock ? (
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex items-center px-3 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view
  return (
    <Link href={`/products/${product.slug || product.id}`} prefetch={false} className="block group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Product Image */}
        <div className="relative aspect-square">
          <img
            src={product.image || getCategoryFallback(product.category)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = getCategoryFallback(product.category);
              target.onerror = null;
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <button
                onClick={handleAddToWishlist}
                className="p-2 bg-white rounded-full text-gray-600 hover:text-red-500 transition-colors"
              >
                <Heart className="h-4 w-4" />
              </button>
              <button className="p-2 bg-white rounded-full text-gray-600 hover:text-orange-600 transition-colors">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Badges */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}

          {/* Product Labels */}
          {(() => {
            const labels = getProductLabels(product);
            if (labels.length === 0) return null;

            return (
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {labels.map((label, index) => (
                  <div
                    key={index}
                    className={`${label.className} px-2 py-1 rounded-full text-xs font-medium shadow-sm`}
                  >
                    {label.text}
                  </div>
                ))}
              </div>
            );
          })()}

          {product.originalPrice && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Sale
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.category}</p>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-600">({product.reviewCount})</span>
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
              <span className="font-bold text-lg text-gray-900">
                ${product.price}
              </span>
            </div>

            {product.inStock ? (
              <button
                onClick={handleAddToCart}
                className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </button>
            ) : (
              <button
                disabled
                className="flex items-center px-3 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Out of Stock
              </button>
            )}
          </div>

          {/* Stock Status */}
          {product.inStock && product.stockCount <= 5 && (
            <p className="text-xs text-orange-600 mt-2">
              Only {product.stockCount} left in stock
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export const ProductGrid: React.FC<ProductGridProps> = ({ products, viewMode }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <ShoppingCart className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className={
      viewMode === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        : 'space-y-4'
    }>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};
