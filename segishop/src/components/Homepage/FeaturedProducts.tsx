'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Heart, Loader2 } from 'lucide-react';
import { PriceDisplay } from '@/components/Currency/PriceDisplay';
import api from '@/services/api';
import { convertApiProductToFrontend, FrontendProduct } from '@/types/api';

// Helper function to determine product labels
const getProductLabels = (product: FrontendProduct & { badge?: string }) => {
  const labels = [];

  // Badge from API (Featured, Best Seller, New)
  if (product.badge) {
    let badgeColor = 'bg-orange-500 text-white'; // Default
    if (product.badge === 'Best Seller') badgeColor = 'bg-purple-500 text-white';
    if (product.badge === 'New') badgeColor = 'bg-green-500 text-white';

    labels.push({
      text: product.badge,
      className: badgeColor
    });
  }

  // Low Stock label (stock <= 10)
  const stock = product.stockCount || 0;
  if (stock > 0 && stock <= 10) {
    labels.push({
      text: 'Low Stock',
      className: 'bg-red-500 text-white'
    });
  }

  // New Product label (created within last 30 days) - only if not already marked as "New" by badge
  if (!product.badge?.includes('New') && product.createdAt) {
    const createdDate = new Date(product.createdAt);
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

interface FeaturedProductsProps {
  // No props needed currently
}

interface ProductsState {
  featured: (FrontendProduct & { badge?: string })[];
  bestSellers: (FrontendProduct & { badge?: string })[];
  newArrivals: (FrontendProduct & { badge?: string })[];
}

// Tab configuration
const productTabs = [
  { id: 'featured', label: 'Featured', description: 'Our handpicked selection of premium products' },
  { id: 'bestSellers', label: 'Best Sellers', description: 'Most popular items loved by our customers' },
  { id: 'newArrivals', label: 'New Arrivals', description: 'Latest additions to our collection' }
];

export const FeaturedProducts: React.FC<FeaturedProductsProps> = () => {
  const [activeTab, setActiveTab] = useState<keyof ProductsState>('featured');
  const [products, setProducts] = useState<ProductsState>({
    featured: [],
    bestSellers: [],
    newArrivals: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentProducts = products[activeTab];
  const currentTabInfo = productTabs.find(tab => tab.id === activeTab);

  // Fetch products from API
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
                try {
                    setLoading(true);
                    const limit = 8;
                    const [featuredResponse, bestSellersResponse, newArrivalsResponse] = await Promise.all([
          api.getFeaturedProducts(limit).catch(() => ({ success: false, products: [] })),
          api.searchProducts({ sortBy: 'popularity', sortOrder: 'desc', pageSize: 8 }).catch(() => ({ success: false, data: { products: [] } })),
          api.searchProducts({ sortBy: 'created', sortOrder: 'desc', pageSize: 8 }).catch(() => ({ success: false, data: { products: [] } }))
        ]);

        if (!isMounted) return;

        // Process featured products
        let featuredProducts: (FrontendProduct & { badge?: string })[] = [];
        if (featuredResponse.success && Array.isArray(featuredResponse.products) && featuredResponse.products.length > 0) {
          featuredProducts = featuredResponse.products.map((product: any) => {
            try {
              const converted = convertApiProductToFrontend(product);
              return { ...converted, badge: 'Featured' };
            } catch (error) {
              return null;
            }
          }).filter((p: any) => p !== null) as (FrontendProduct & { badge: string })[];
        }
        
        // Fallback: If no featured products found, use random products from search
        if (featuredProducts.length === 0) {
          try {
             const fallbackResponse = await api.searchProducts({ pageSize: 8 });
             if (fallbackResponse.success && fallbackResponse.data?.products && fallbackResponse.data.products.length > 0) {
               featuredProducts = fallbackResponse.data.products.map((product: any) => {
                 try {
                   const converted = convertApiProductToFrontend(product);
                   return { ...converted, badge: 'Featured' };
                 } catch (error) {
                    return null;
                 }
               }).filter((p: any) => p !== null);
             }
          } catch (err) {
             console.error("Failed to fetch fallback featured products", err);
          }
        }

        // Process best sellers
        let bestSellerProducts: (FrontendProduct & { badge?: string })[] = [];
        if (bestSellersResponse.success && bestSellersResponse.data?.products && bestSellersResponse.data.products.length > 0) {
          bestSellerProducts = bestSellersResponse.data.products.map((product: any) => {
            try {
              const converted = convertApiProductToFrontend(product);
              return { ...converted, badge: 'Best Seller' };
            } catch (error) {
              console.error('Error converting best seller product:', error);
              return null;
            }
          }).filter((product: any): product is FrontendProduct & { badge: string } => product !== null);
        }
        
        // Fallback for Best Sellers (use general search if empty)
        if (bestSellerProducts.length === 0) {
             // Reuse featured fallback or fetch again if needed, but likely we have data if featured has it.
             // If featured has data, we can just use that if best sellers is empty, or try another sort.
             // For now, let's leave it empty or try one more fetch if absolutely needed, but usually searchProducts works.
             // If searchProducts({sortBy: 'popularity'}) failed to return data, maybe the DB is empty or 'popularity' sort is broken.
             // We can fallback to 'name' sort.
             try {
                const fallbackBestSellers = await api.searchProducts({ sortBy: 'name', pageSize: 8 });
                 if (fallbackBestSellers.success && fallbackBestSellers.data?.products) {
                    bestSellerProducts = fallbackBestSellers.data.products.map((p: any) => ({...convertApiProductToFrontend(p), badge: 'Best Seller'}));
                 }
             } catch(e) {}
        }

        // Process new arrivals
        let newArrivalProducts: (FrontendProduct & { badge?: string })[] = [];
        if (newArrivalsResponse.success && newArrivalsResponse.data?.products && newArrivalsResponse.data.products.length > 0) {
          newArrivalProducts = newArrivalsResponse.data.products.map((product: any) => {
            try {
              const converted = convertApiProductToFrontend(product);
              return { ...converted, badge: 'New' };
            } catch (error) {
              console.error('Error converting new arrival product:', error);
              return null;
            }
          }).filter((product: any): product is FrontendProduct & { badge: string } => product !== null);
        }
        
        // Fallback for New Arrivals
        if (newArrivalProducts.length === 0) {
             try {
                const fallbackNew = await api.searchProducts({ sortBy: 'price', sortOrder: 'desc', pageSize: 8 });
                 if (fallbackNew.success && fallbackNew.data?.products) {
                    newArrivalProducts = fallbackNew.data.products.map((p: any) => ({...convertApiProductToFrontend(p), badge: 'New'}));
                 }
             } catch(e) {}
        }

        setProducts({
          featured: featuredProducts,
          bestSellers: bestSellerProducts,
          newArrivals: newArrivalProducts
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching homepage products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {currentTabInfo?.description || 'Discover our collection of organic snacks and handmade goods'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <div className="flex space-x-1">
              {productTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as keyof ProductsState)}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in duration-500">
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Product Labels */}
              {(() => {
                const labels = getProductLabels(product);
                if (labels.length === 0) return null;

                return (
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                    {labels.map((label, index) => (
                      <div
                        key={index}
                        className={`${label.className} px-2 py-1 rounded-full text-xs font-semibold shadow-sm`}
                      >
                        {label.text}
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Product Image - Clickable */}
              <Link href={`/products/${product.slug}`} prefetch={false} className="block">
                <div className="relative" style={{ width: '100%', height: '250px', backgroundColor: '#f3f4f6' }}>
                  <img
                    src={product.image || '/placeholder-product.svg'}
                    alt={product.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    className="group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.error('Image failed to load:', product.image);
                      const target = e.target as HTMLImageElement;

                      // Use category-based fallback SVG
                      const colorMap: {[key: string]: string} = {
                        'Snacks': '#ff6b35',
                        'Decor': '#333333',
                        'Fashion': '#ec4899',
                        'Bags': '#8b5cf6'
                      };

                      const category = product.category || 'default';
                      const color = colorMap[category] || '#6b7280';
                      const svg = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                          <rect width="100" height="100" fill="${color}" rx="8"/>
                          <text x="50" y="50" font-size="12" fill="#fff" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${category}</text>
                        </svg>
                      `;
                      target.src = 'data:image/svg+xml;base64,' + btoa(svg);

                      // Prevent infinite error loop
                      target.onerror = null;
                    }}
                    onLoad={() => {
                      // Image loaded successfully
                    }}
                  />
                </div>
              </Link>

              <div className="p-4">
                <div className="mb-2">
                  <Link href={`/products/${product.slug}`} prefetch={false}>
                    <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 hover:text-orange-500 transition-colors cursor-pointer">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.category}
                  </p>
                </div>

                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <PriceDisplay
                    price={product.price}
                    originalPrice={product.originalPrice}
                    size="lg"
                    className="flex items-center space-x-2"
                  />
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/products/${product.slug || product.id}`}
                    prefetch={false}
                    className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center text-sm"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 mb-4">No {currentTabInfo?.label.toLowerCase()} products available at the moment.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Refresh Products
                </button>
              </div>
            )}
          </div>
        )}

        {/* View All Button */}
        {!loading && !error && (
          <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            View All {currentTabInfo?.label || 'Products'}
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          </div>
        )}
      </div>
    </section>
  );
};
