'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { Cart } from '@/components/Cart/Cart';
import { EnhancedProductDetailPage } from '@/components/Product/EnhancedProductDetailPage';
import { ProductTabs } from '@/components/Product/ProductTabs';
import { RelatedProducts } from '@/components/Product/RelatedProducts';
import { useProductDetail } from '@/hooks/useProductDetail';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

// Utility function to format category names for URLs and display
const formatCategoryForUrl = (categoryName: string): string => {
  return categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

const formatCategoryForDisplay = (categoryName: string): string => {
  // Handle special cases for better display
  const specialCases: { [key: string]: string } = {
    'variety-boxes': 'Variety Boxes',
    'small-bulk': 'Small Bulk',
    'wholesale': 'Wholesale',
    'event-snacks': 'Event Snacks',
    'womens-tops': "Women's Tops",
    'mens-clothing': "Men's Clothing",
    'kids-clothing': "Kids' Clothing"
  };

  const formatted = formatCategoryForUrl(categoryName);
  return specialCases[formatted] || categoryName.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};





export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);
  const { addToCart, openCart, cart, isLoading: cartLoading } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  // Resolve params for Next.js 15 compatibility
  React.useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Use API integration for product detail
  const {
    product,
    relatedProducts,
    loading,
    error,
    apiHealthy,
    refetch
  } = useProductDetail(resolvedParams?.slug || '');

  // Convert related products to RelatedProduct format
  const relatedProductsList = relatedProducts.map(p => ({
    id: p.id.toString(),
    title: p.name,
    price: p.salePrice || p.price,
    originalPrice: p.salePrice ? p.price : undefined,
    image: p.imageUrl || '',
    rating: 4.5, // Default rating since API doesn't provide this yet
    reviewCount: 0, // Default review count since API doesn't provide this yet
    category: p.categoryName,
    slug: p.slug || p.id.toString(),
    inStock: p.stock > 0
  }));

  const handleAddToCart = async (productId: string, quantity: number, configuration: any) => {
    try {
      // Prepare product attributes as JSON string if configuration exists
      const productAttributes = configuration ? JSON.stringify(configuration) : undefined;

      const success = await addToCart({
        productId: parseInt(productId),
        quantity,
        productAttributes,
        calculatedPrice: configuration?.calculatedPrice // Pass the calculated price
      });

      if (success) {
        openCart(); // Open cart panel to show the added item
      } else {
        alert('Failed to add item to cart. Please try again.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      return;
    }

    const productIdNum = parseInt(productId);

    // If already wishlisted, remove from wishlist instead
    if (isInWishlist(productIdNum)) {
      const success = await removeFromWishlist(productIdNum);
      if (success) {
        console.log('Removed from wishlist successfully');
      } else {
        alert('Failed to remove item from wishlist. Please try again.');
      }
      return;
    }

    const success = await addToWishlist(productIdNum);
    if (success) {
      console.log('Added to wishlist successfully');
    } else {
      alert('Failed to add item to wishlist. Please try again.');
    }
  };

  const handleQuickAddToCart = async (productId: string) => {
    try {
      const success = await addToCart({
        productId: parseInt(productId),
        quantity: 1,
        productAttributes: undefined // Default options for quick add
      });

      if (success) {
        openCart(); // Open cart panel to show the added item
      } else {
        alert('Failed to add item to cart. Please try again.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  // Loading state for params resolution
  if (!resolvedParams) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
              <p className="text-gray-600">Preparing product page...</p>
            </div>
          </div>
          <Footer />
        </div>
      </ErrorBoundary>
    );
  }

  // Loading state for product data
  if (loading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Product</h2>
              <p className="text-gray-600">Fetching product details...</p>
            </div>
          </div>
          <Footer />
        </div>
      </ErrorBoundary>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Product</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  API Status: {apiHealthy ? '✅ Connected' : '❌ Disconnected'}
                </p>
                <button
                  onClick={refetch}
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </ErrorBoundary>
    );
  }

  // Product not found
  if (!product) {
    notFound();
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header />

          <main>
            {/* Enhanced Breadcrumb Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <nav className="flex items-center text-sm text-gray-500" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 flex-wrap">
                  {/* Home */}
                  <li>
                    <a
                      href="/"
                      className="hover:text-orange-600 transition-colors duration-200 font-medium"
                    >
                      Home
                    </a>
                  </li>

                  {/* Products */}
                  <li className="flex items-center">
                    <span className="mx-2 text-gray-400 select-none">/</span>
                    <a
                      href="/products"
                      className="hover:text-orange-600 transition-colors duration-200 font-medium"
                    >
                      Products
                    </a>
                  </li>

                  {/* Parent Category (if exists) */}
                  {product.parentCategoryName && (
                    <li className="flex items-center">
                      <span className="mx-2 text-gray-400 select-none">/</span>
                      <a
                        href={`/products?category=${formatCategoryForUrl(product.parentCategoryName)}`}
                        className="hover:text-orange-600 transition-colors duration-200 font-medium"
                        title={`Browse all ${formatCategoryForDisplay(product.parentCategoryName)} products`}
                      >
                        {formatCategoryForDisplay(product.parentCategoryName)}
                      </a>
                    </li>
                  )}

                  {/* Current Category */}
                  <li className="flex items-center">
                    <span className="mx-2 text-gray-400 select-none">/</span>
                    <a
                      href={`/products?category=${formatCategoryForUrl(product.categoryName)}`}
                      className="hover:text-orange-600 transition-colors duration-200 font-medium"
                      title={`Browse all ${formatCategoryForDisplay(product.categoryName)} products`}
                    >
                      {formatCategoryForDisplay(product.categoryName)}
                    </a>
                  </li>

                  {/* Current Product */}
                  <li className="flex items-center">
                    <span className="mx-2 text-gray-400 select-none">/</span>
                    <span
                      className="text-gray-900 font-semibold truncate max-w-xs sm:max-w-sm md:max-w-md"
                      title={product.name}
                    >
                      {product.name}
                    </span>
                  </li>
                </ol>
              </nav>
            </div>

            {/* Enhanced Product Detail */}
            <EnhancedProductDetailPage
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />

            {/* Product Tabs */}
            <ProductTabs
              productId={product.id}
              description={product.longDescription || product.description || 'No description available.'}
              specifications={product.attributes?.reduce((acc, attr) => {
                acc[attr.name] = attr.value;
                return acc;
              }, {} as { [key: string]: string }) || {}}
              isAuthenticated={isAuthenticated}
              userEmail={isAuthenticated ? 'user@example.com' : undefined} // TODO: Get from user context
              userName={isAuthenticated ? 'User Name' : undefined} // TODO: Get from user context
            />

            {/* Related Products */}
            {relatedProductsList.length > 0 && (
              <RelatedProducts
                products={relatedProductsList}
                onAddToCart={handleQuickAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            )}
          </main>

          <Footer />
          <Cart />
        </div>
      </ErrorBoundary>
    );
}
