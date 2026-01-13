'use client';

import React, { useState, useEffect } from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { PriceDisplay } from '@/components/Currency/PriceDisplay';
import { SimpleProduct } from '@/services/simple-products-api';
import { useWishlist } from '@/contexts/WishlistContext';
import { ProductFreeShippingBanner } from '@/components/FreeShippingBanner';
import { DynamicConfigurationSelector } from './DynamicConfigurationSelector';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

interface EnhancedProductDetailPageProps {
  product: SimpleProduct;
  onAddToCart: (productId: string, quantity: number, configuration: any) => void;
  onAddToWishlist: (productId: string) => void;
}

export const EnhancedProductDetailPage: React.FC<EnhancedProductDetailPageProps> = ({
  product,
  onAddToCart,
  onAddToWishlist
}) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  /* ================= STATES ================= */
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Dynamic Configuration State
  const [selectedConfigurations, setSelectedConfigurations] = useState<{ [key: number]: number | null }>({});
  const [currentPrice, setCurrentPrice] = useState(product.price);

  /* ================= WISHLIST ================= */
  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

  /* ================= PRICE CALCULATION ================= */
  useEffect(() => {
    let newPrice = product.price;

    if (product.dynamicConfigurations && product.dynamicConfigurations.length > 0) {
      product.dynamicConfigurations.forEach(config => {
        const selectedOptionId = selectedConfigurations[config.configurationTypeId];
        if (selectedOptionId) {
          const option = config.options.find(o => o.id === selectedOptionId);
          if (option) {
            if (option.priceType === 'replace') {
              newPrice = option.priceModifier;
            } else if (option.priceType === 'fixed') {
              newPrice += option.priceModifier;
            } else if (option.priceType === 'percentage') {
              newPrice += (product.price * option.priceModifier / 100);
            } else if (option.priceType === 'multiplier') {
              newPrice *= option.priceModifier;
            }
          }
        }
      });
    }
    
    setCurrentPrice(newPrice);
  }, [selectedConfigurations, product.dynamicConfigurations, product.price]);

  /* ================= SYNC SIZE → IMAGE ================= */
  useEffect(() => {
    const sizeConfig = product.dynamicConfigurations?.find(c => c.name?.toLowerCase() === 'size');
    if (sizeConfig) {
      const sortedOptions = sizeConfig.options
        .filter(o => o.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      const selectedOptionId = selectedConfigurations[sizeConfig.configurationTypeId];
      const idx = sortedOptions.findIndex(o => o.id === selectedOptionId);
      if (idx >= 0) {
        setSelectedImageIndex(idx);
      }
    }
  }, [selectedConfigurations, product.dynamicConfigurations]);

  /* ================= IMAGES ================= */
  // Respect actual count: if product has 2 sizes, show 2 images; if 3 sizes, show 3
  const sizeConfig = product.dynamicConfigurations?.find(c => c.name?.toLowerCase() === 'size');
  const sizeOptions = sizeConfig
    ? sizeConfig.options.filter(o => o.isActive).sort((a, b) => a.sortOrder - b.sortOrder)
    : [];
  const baseImages: ProductImage[] =
    (product.images && product.images.length > 0)
      ? product.images.map((img, idx) => ({
          id: (img.id?.toString() || (idx + 1).toString()),
          url: img.imageUrl || product.imageUrl || '/placeholder-product.svg',
          alt: product.name
        }))
      : (product.imageUrl
          ? [{ id: '1', url: product.imageUrl, alt: product.name }]
          : [{ id: '1', url: '/placeholder-product.svg', alt: product.name }]);
  const imageCount = sizeOptions.length > 0 ? sizeOptions.length : baseImages.length;
  const productImages: ProductImage[] = baseImages.slice(0, imageCount);

  /* ================= SIZES ================= */
  const sizes = [
    '6 1/4" x 7 3/8" x 3/8"',
    '7 1/8" x 8 1/4" x 3/8"',
    '8" x 9" x 3/8"',
  ];

  /* ================= HANDLERS ================= */

  // Sync size and image index when a size is clicked
  const handleSizeClick = (index: number) => {
    setSelectedSizeIndex(index);
    setSelectedImageIndex(index);
  };

  // Sync size and image index when a thumbnail is clicked
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
    setSelectedSizeIndex(index);
    if (sizeConfig && sizeOptions.length > 0) {
      const option = sizeOptions[index];
      if (option) {
        setSelectedConfigurations(prev => ({
          ...prev,
          [sizeConfig.configurationTypeId]: option.id
        }));
      }
    }
  };

  const handleConfigurationChange = (configurationId: number, selectedOptionId: number | null) => {
    setSelectedConfigurations(prev => ({
      ...prev,
      [configurationId]: selectedOptionId
    }));
  };

  /* ================= ACTIONS ================= */
  const handleAddToCart = () => {
    // Collect selected options details for cart
    const selectedOptions: any[] = [];
    if (product.dynamicConfigurations) {
        product.dynamicConfigurations.forEach(config => {
            const optionId = selectedConfigurations[config.configurationTypeId];
            if (optionId) {
                const option = config.options.find(o => o.id === optionId);
                if (option) {
                    selectedOptions.push({
                        configurationName: config.name,
                        optionName: option.name,
                        priceModifier: option.priceModifier
                    });
                }
            }
        });
    }

    onAddToCart(product.id.toString(), quantity, {
      size: sizes[selectedSizeIndex],
      imageIndex: selectedImageIndex,
      selectedConfigurations: selectedConfigurations,
      selectedOptions: selectedOptions,
      finalPrice: currentPrice
    });
  };

  const handleWishlistToggle = async () => {
    if (isWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
    onAddToWishlist(product.id.toString());
  };

  const renderStars = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
    ));

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ========== LEFT IMAGE SECTION ========== */}
        <div>
          {/* Main Image */}
          <div className="aspect-square border bg-white rounded-lg flex items-center justify-center overflow-hidden">
            <img
              key={selectedImageIndex} // Force visual update
              src={productImages[selectedImageIndex].url}
              alt={productImages[selectedImageIndex].alt}
              className="max-h-full max-w-full object-contain transition-opacity duration-300"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4">
            {productImages.map((img, index) => (
              <button
                key={img.id}
                onClick={() => handleThumbnailClick(index)}
                className={`w-20 h-20 border rounded-md overflow-hidden transition-all ${
                  selectedImageIndex === index ? 'border-black ring-1 ring-black' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ========== RIGHT CONTENT ========== */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          <div className="flex items-center gap-2">
            <div className="flex">{renderStars()}</div>
            <span className="text-sm text-blue-600">(50 reviews)</span>
          </div>

          <PriceDisplay
            price={currentPrice}
            originalPrice={product.salePrice}
            size="xl"
          />

          {/* DYNAMIC CONFIGURATION OR SIZE SELECT */}
          {product.dynamicConfigurations && product.dynamicConfigurations.length > 0 ? (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <DynamicConfigurationSelector
                configurations={product.dynamicConfigurations}
                onConfigurationChange={handleConfigurationChange}
                selectedConfigurations={selectedConfigurations}
              />
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-2">
                 <h3 className="text-sm font-medium">Size : <span className="font-normal text-gray-600">{sizes[selectedSizeIndex]}</span></h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size, index) => (
                  <button
                    key={size}
                    onClick={() => handleSizeClick(index)}
                    className={`px-4 py-3 border text-sm font-medium transition-colors ${
                      selectedSizeIndex === index
                        ? 'border-2 border-cyan-600 text-cyan-700 bg-cyan-50' // WooCommerce style highlight
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button className="text-xs text-gray-500 mt-2 uppercase tracking-wide hover:underline">Clear</button>
            </div>
          )}

          {/* SKU and Category Information */}
          <div className="mt-4 mb-6 space-y-1">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">SKU: </span>
              {product.sku || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Category: </span>
              <span className="text-cyan-600">{product.categoryName}</span>
            </div>
          </div>

          <div className="text-3xl font-bold text-gray-700 mt-4">
             {/* Dynamic price placeholder */}
          </div>

          {/* UPLOAD SECTION */}
          <div className="space-y-5 border-t border-gray-100 pt-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Upload Your Logo:
              </label>
              <input 
                type="file" 
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-none file:border file:border-gray-300
                  file:text-sm file:font-medium
                  file:bg-gray-50 file:text-gray-700
                  hover:file:bg-gray-100
                  cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Upload Your Text:
              </label>
              <input 
                type="file" 
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-none file:border file:border-gray-300
                  file:text-sm file:font-medium
                  file:bg-gray-50 file:text-gray-700
                  hover:file:bg-gray-100
                  cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Upload Your Custom Text:
              </label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 p-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                placeholder="Enter your custom text here"
              />
            </div>
          </div>

          <ProductFreeShippingBanner />

          {/* ADD TO CART */}
          <div className="flex items-center gap-4 pt-4">
             <div className="w-20">
                <input 
                  type="number" 
                  min="1" 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-300 p-3 text-center rounded-none"
                />
             </div>
             <button
                onClick={handleAddToCart}
                className="flex-1 text-white py-3 px-6 font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#17808f' }}
              >
                Add to cart
              </button>
          </div>
          

          {/* WISHLIST */}
          <button
            onClick={handleWishlistToggle}
            className="text-sm text-gray-500 flex items-center gap-2 hover:text-gray-700 mt-4"
          ></button>

          {/* WISHLIST */}
          <button
            onClick={handleWishlistToggle}
            className="text-sm text-gray-500 flex items-center gap-2 hover:text-gray-700 mt-4"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>
        </div>
      </div>
    </div>
  );
};
