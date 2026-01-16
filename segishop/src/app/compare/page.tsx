'use client';

import React from 'react';
import Link from 'next/link';
import { X, ShoppingCart, Heart, ArrowLeft, Trash2, Star } from 'lucide-react';
import { useComparison } from '@/contexts/ComparisonContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { PriceDisplay } from '@/components/Currency/PriceDisplay';
import { DEFAULT_PRODUCT_IMAGE } from '@/services/config';

export default function ComparePage() {
  const { comparedProducts, removeFromComparison, clearComparison } = useComparison();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = async (product: any) => {
    const success = await addToCart({
      productId: product.id,
      quantity: 1,
    });

    if (success) {
      console.log('Added to cart successfully');
    } else {
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const handleAddToWishlist = async (product: any) => {
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      return;
    }

    const productIdNum = parseInt(product.id);
    const success = await addToWishlist(productIdNum);
    if (success) {
      console.log('Added to wishlist successfully');
    } else {
      alert('Failed to add item to wishlist. Please try again.');
    }
  };

  const getComparisonRows = () => {
    const rows = [
      { label: 'Product', key: 'product' },
      { label: 'Price', key: 'price' },
      { label: 'Rating', key: 'rating' },
      { label: 'Stock Status', key: 'stock' },
      { label: 'Category', key: 'category' },
      { label: 'Description', key: 'description' },
      { label: 'Actions', key: 'actions' },
    ];

    // Add dynamic attributes if any products have them
    const allAttributes = new Set<string>();
    comparedProducts.forEach(product => {
      if (product.attributes && Array.isArray(product.attributes)) {
        product.attributes.forEach((attr: any) => {
          if (attr.name) allAttributes.add(attr.name);
        });
      }
    });

    // Add attribute rows
    allAttributes.forEach(attrName => {
      rows.splice(-1, 0, { label: attrName, key: `attr_${attrName}` });
    });

    return rows;
  };

  const getAttributeValue = (product: any, attributeName: string) => {
    if (!product.attributes || !Array.isArray(product.attributes)) return '-';
    const attr = product.attributes.find((a: any) => a.name === attributeName);
    return attr ? attr.value : '-';
  };

  if (comparedProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Products to Compare</h1>
            <p className="text-lg text-gray-600 mb-8">
              You haven't added any products to comparison yet. Start by browsing our products and clicking the comparison button.
            </p>
            <Link
              href="/products"
              prefetch={false}
              className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const comparisonRows = getComparisonRows();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Comparison</h1>
            <p className="text-gray-600 mt-2">
              Compare {comparedProducts.length} product{comparedProducts.length !== 1 ? 's' : ''} side by side
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={clearComparison}
              className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </button>
            <Link
              href="/products"
              prefetch={false}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-medium text-gray-900 bg-gray-50 w-48">
                    Features
                  </th>
                  {comparedProducts.map((product, index) => (
                    <th key={product.id} className="text-center py-4 px-6 bg-gray-50 min-w-64">
                      <button
                        onClick={() => removeFromComparison(product.id)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, rowIndex) => (
                  <tr key={row.key} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 px-6 font-medium text-gray-900 border-r border-gray-200">
                      {row.label}
                    </td>
                    {comparedProducts.map((product) => (
                      <td key={product.id} className="py-4 px-6 text-center border-r border-gray-200 last:border-r-0">
                        {row.key === 'product' && (
                          <div className="space-y-3">
                            <div className="relative">
                              <img
                                src={product.image || DEFAULT_PRODUCT_IMAGE}
                                alt={product.title || product.name}
                                className="w-32 h-32 object-cover rounded-lg mx-auto"
                              />
                              {product.isFeatured && (
                                <span className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm">
                                {product.title || product.name}
                              </h3>
                              <Link
                                href={`/products/${product.slug || product.id}`}
                                prefetch={false}
                                className="text-orange-600 hover:text-orange-700 text-sm"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        )}
                        
                        {row.key === 'price' && (
                          <PriceDisplay
                            price={product.salePrice || product.price || 0}
                            originalPrice={product.salePrice && product.price && product.price > product.salePrice ? product.price : undefined}
                            size="lg"
                          />
                        )}
                        
                        {row.key === 'rating' && (
                          <div className="flex items-center justify-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-2">(4.0)</span>
                          </div>
                        )}
                        
                        {row.key === 'stock' && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            (product.stock || product.stockCount || 0) > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {(product.stock || product.stockCount || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        )}
                        
                        {row.key === 'category' && (
                          <span className="text-sm text-gray-600">
                            {product.category || '-'}
                          </span>
                        )}
                        
                        {row.key === 'description' && (
                          <div className="text-sm text-gray-600 max-w-xs">
                            {product.description ? 
                              (product.description.length > 100 ? 
                                `${product.description.substring(0, 100)}...` : 
                                product.description
                              ) : '-'
                            }
                          </div>
                        )}
                        
                        {row.key.startsWith('attr_') && (
                          <span className="text-sm text-gray-600">
                            {getAttributeValue(product, row.label)}
                          </span>
                        )}
                        
                        {row.key === 'actions' && (
                          <div className="space-y-2">
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={(product.stock || product.stockCount || 0) <= 0}
                              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
                            >
                              <ShoppingCart className="h-4 w-4 inline mr-1" />
                              Add to Cart
                            </button>
                            <button
                              onClick={() => removeFromComparison(product.id)}
                              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              <X className="h-4 w-4 inline mr-1" />
                              Remove
                            </button>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            You can compare up to 4 products at a time
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="/products"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Add More Products
            </Link>
            <button
              onClick={clearComparison}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Clear Comparison
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
