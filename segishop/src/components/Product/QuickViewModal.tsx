'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingCart, Heart, Settings, ChevronLeft, ChevronRight, Star, Scale } from 'lucide-react';
import { PriceDisplay } from '@/components/Currency/PriceDisplay';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useComparison } from '@/contexts/ComparisonContext';
import { ImageMagnifier } from './ImageMagnifier';
import { DEFAULT_PRODUCT_IMAGE } from '@/services/config';

interface QuickViewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

// Configuration type detection (same as in products page)
const getConfigurationType = (product: any): 'Regular' | 'SmallBulk' | 'VarietyBox' => {
  if (!product) return 'Regular';

  if (product.categoryConfigurationType) {
    return product.categoryConfigurationType;
  }

  const categoryLower = product.category?.toLowerCase() || '';
  if (categoryLower.includes('variety') || categoryLower.includes('box')) {
    return 'VarietyBox';
  } else if (categoryLower.includes('bulk')) {
    return 'SmallBulk';
  } else {
    return 'Regular';
  }
};

// Check if product has configurations
const hasProductConfigurations = (product: any): boolean => {
  if (!product) return false;

  if (product.hasActiveConfigurations !== undefined) {
    return product.hasActiveConfigurations;
  }

  const configurationType = getConfigurationType(product);
  return configurationType !== 'Regular';
};

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToComparison, removeFromComparison, isInComparison, canAddToComparison } = useComparison();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(2);

  // Calculate values safely with null checks
  const isInStock = product ? (product.stock || product.stockCount || 0) > 0 : false;
  const productIdNum = product ? parseInt(product.id || '0') : 0;
  const isWishlisted = product ? isInWishlist(productIdNum) : false;
  const isCompared = product ? isInComparison(product.id) : false;
  const configurationType = getConfigurationType(product);

  // Get product images
  const productImages = React.useMemo(() => {
    const images: string[] = [];

    // Add main image
    if (product?.image) {
      images.push(product.image);
    }

    // Add gallery images if available
    if (product?.images && Array.isArray(product.images)) {
      product.images.forEach((img: any) => {
        if (img?.imageUrl && typeof img.imageUrl === 'string' && img.imageUrl !== product.image) {
          images.push(img.imageUrl);
        }
      });
    }

    // Add gallery from imageGallery field if available
    if (product?.imageGallery && typeof product.imageGallery === 'string') {
      try {
        const galleryImages = JSON.parse(product.imageGallery);
        if (Array.isArray(galleryImages)) {
          galleryImages.forEach((imgUrl: any) => {
            if (typeof imgUrl === 'string' && imgUrl && !images.includes(imgUrl)) {
              images.push(imgUrl);
            }
          });
        }
      } catch (e) {
        // Ignore JSON parse errors
        console.warn('Failed to parse imageGallery JSON:', e);
      }
    }

    return images.length > 0 ? images : [DEFAULT_PRODUCT_IMAGE];
  }, [product]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setQuantity(1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePrevImage = React.useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  }, [productImages.length]);

  const handleNextImage = React.useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  }, [productImages.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrevImage, handleNextImage]);

  const handleAddToCart = async () => {
    if (!isInStock || !product) return;

    setIsLoading(true);
    try {
      const productAttributes = configurationType === 'SmallBulk'
        ? JSON.stringify({
            configurationType: 'SmallBulk',
            bulkQuantity: 24
          })
        : undefined;

      const success = await addToCart({
        productId: product.id,
        quantity,
        productAttributes
      });

      if (success) {
        // Cart panel will open automatically
        onClose();
      } else {
        alert('Failed to add item to cart. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      return;
    }

    setIsLoading(true);
    try {
      if (isWishlisted) {
        const success = await removeFromWishlist(productIdNum);
        if (!success) {
          alert('Failed to remove item from wishlist. Please try again.');
        }
      } else {
        const success = await addToWishlist(productIdNum);
        if (!success) {
          alert('Failed to add item to wishlist. Please try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToComparison = () => {
    if (!product) return;

    if (isCompared) {
      const success = removeFromComparison(product.id);
      if (success) {
        // Show success feedback
        console.log('Removed from comparison successfully');
      } else {
        alert('Failed to remove item from comparison. Please try again.');
      }
    } else {
      if (!canAddToComparison) {
        alert('You can compare up to 4 products at a time. Please remove a product from comparison first.');
        return;
      }

      const success = addToComparison(product);
      if (success) {
        // Show success feedback
        console.log('Added to comparison successfully');
      } else {
        alert('Failed to add item to comparison. Please try again.');
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Don't render if modal is closed or no product
  if (!isOpen || !product) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Close quick view"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <div className="flex flex-col lg:flex-row max-h-[90vh]">
          {/* Image Section */}
          <div className="lg:w-1/2 relative bg-gray-50">
            <div className="relative aspect-square">
              <ImageMagnifier
                src={productImages[currentImageIndex]}
                alt={product.title || product.name}
                className="w-full h-full"
                magnifierSize={150}
                zoomLevel={zoomLevel}
                onZoomLevelChange={setZoomLevel}
              />

              {/* Image Navigation */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </>
              )}

              {/* Featured Badge */}
              {product.isFeatured && (
                <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                  Featured
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-orange-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title || product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <h2 id="quick-view-title" className="text-2xl font-bold text-gray-900 mb-2">
                  {product.title || product.name}
                </h2>
                
                {/* Mock rating - replace with actual rating when available */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(24 reviews)</span>
                </div>
              </div>

              {/* Price */}
              <PriceDisplay
                price={product.salePrice || product.price || 0}
                originalPrice={product.salePrice && product.price > product.salePrice ? product.price : undefined}
                size="xl"
                className="mb-4"
              />

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isInStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isInStock ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
                {isInStock && (
                  <span className="text-sm text-gray-600">
                    {product.stock || product.stockCount} available
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || product.longDescription || 'No description available.'}
                </p>
              </div>

              {/* Specifications */}
              {product.attributes && Array.isArray(product.attributes) && product.attributes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Specifications</h3>
                  <div className="space-y-1">
                    {product.attributes.slice(0, 3).map((attr: any, index: number) => (
                      attr && attr.name && attr.value ? (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{attr.name}:</span>
                          <span className="text-gray-900">{attr.value}</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Actions */}
              <div className="space-y-4">
                {isInStock && !hasProductConfigurations(product) && (
                  <div className="flex items-center space-x-3">
                    <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                      Quantity:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-50 transition-colors text-black"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        max={product.stock || product.stockCount || 99}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center border-0 focus:ring-0 text-black"
                      />
                      <button
                        onClick={() => setQuantity(Math.min((product.stock || product.stockCount || 99), quantity + 1))}
                        className="p-2 hover:bg-gray-50 transition-colors text-black"
                        disabled={quantity >= (product.stock || product.stockCount || 99)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {isInStock ? (
                    <>
                      {hasProductConfigurations(product) ? (
                        <Link
                          href={`/products/${product.slug || product.id}`}
                          prefetch={false}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors text-center font-medium inline-flex items-center justify-center"
                          onClick={onClose}
                        >
                          <Settings className="h-5 w-5 mr-2" />
                          Choose Options
                        </Link>
                      ) : (
                        <button
                          onClick={handleAddToCart}
                          disabled={isLoading}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-3 rounded-lg transition-colors font-medium inline-flex items-center justify-center"
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          {isLoading ? 'Adding...' : 'Add to Cart'}
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      disabled
                      className="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed font-medium inline-flex items-center justify-center"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Out of Stock
                    </button>
                  )}

                  <button
                    onClick={handleAddToWishlist}
                    disabled={isLoading}
                    className={`p-3 border rounded-lg transition-colors ${
                      isWishlisted
                        ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                        : 'border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-red-500'
                    }`}
                    title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={handleAddToComparison}
                    disabled={!canAddToComparison && !isCompared}
                    className={`p-3 border rounded-lg transition-colors ${
                      isCompared
                        ? 'border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100'
                        : 'border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                    title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
                  >
                    <Scale className={`h-5 w-5 ${isCompared ? 'fill-current' : ''}`} />
                  </button>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
