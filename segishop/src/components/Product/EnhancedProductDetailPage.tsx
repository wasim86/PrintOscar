'use client';

import React, { useState, useEffect } from 'react';
import { Star, Heart, ShoppingCart, Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { PriceDisplay } from '@/components/Currency/PriceDisplay';
import { SimpleProduct } from '@/services/simple-products-api';
import { useWishlist } from '@/contexts/WishlistContext';
import { ProductFreeShippingBanner } from '@/components/FreeShippingBanner';
import { DynamicConfigurationSelector } from './DynamicConfigurationSelector';
import { customerUploadApi } from '@/services/customer-upload-api';
import skuMappingData from '@/data/sku-mapping.json';

const skuMapping = skuMappingData as Record<string, Record<string, string>>;

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
  const [selectedConfigurations, setSelectedConfigurations] = useState<{ [key: number]: number | null }>({});
  const [currentPrice, setCurrentPrice] = useState(product.price);
  const [customName, setCustomName] = useState(''); // For Medals ($3 extra)
  
  // Custom Uploads & Text (Non-Medal)
  const [logoUrl, setLogoUrl] = useState('');
  const [logoName, setLogoName] = useState('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  
  const [textFileUrl, setTextFileUrl] = useState('');
  const [textFileName, setTextFileName] = useState('');
  const [isUploadingTextFile, setIsUploadingTextFile] = useState(false);
  
  const [customText, setCustomText] = useState(''); // Generic custom text (textarea)

  /* ================= FILE UPLOAD HANDLERS ================= */
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingLogo(true);
      try {
        const result = await customerUploadApi.uploadFile(file);
        if (result.success) {
          setLogoUrl(result.url);
          setLogoName(file.name);
        }
      } catch (error) {
        console.error('Logo upload failed:', error);
        alert('Failed to upload logo. Please try again.');
      } finally {
        setIsUploadingLogo(false);
      }
    }
  };

  const handleTextFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingTextFile(true);
      try {
        const result = await customerUploadApi.uploadFile(file);
        if (result.success) {
          setTextFileUrl(result.url);
          setTextFileName(file.name);
        }
      } catch (error) {
        console.error('Text file upload failed:', error);
        alert('Failed to upload text file. Please try again.');
      } finally {
        setIsUploadingTextFile(false);
      }
    }
  };

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

    // Additional $3 for custom name on Medals
    const isMedal = (product.categoryName || '').toLowerCase().includes('medal') || 
                    (product.parentCategoryName || '').toLowerCase().includes('medal');
    if (isMedal && customName.trim().length > 0) {
      newPrice += 3;
    }

    setCurrentPrice(newPrice);
  }, [selectedConfigurations, product.dynamicConfigurations, product.price, customName, product.categoryName, product.parentCategoryName]);

  /* ================= IMAGE COUNT BASED ON SIZE OPTIONS ================= */
  const sizeConfig = product.dynamicConfigurations?.find(c => (c.name || '').toLowerCase().trim().includes('size'));
  const sizeOptionsFromConfig = sizeConfig
    ? sizeConfig.options.filter(o => o.isActive).sort((a, b) => a.sortOrder - b.sortOrder)
    : [];

  /* ================= MEDAL SPECIFIC LOGIC (COLOR) ================= */
  const { isMedalCategory, colorConfig, colorOptions } = React.useMemo(() => {
    const isMedal = (product.categoryName || '').toLowerCase().includes('medal') || 
                    (product.parentCategoryName || '').toLowerCase().includes('medal');

    let config = product.dynamicConfigurations?.find(c => (c.name || '').toLowerCase().trim() === 'color');
    let options = config
      ? config.options.filter(o => o.isActive).sort((a, b) => a.sortOrder - b.sortOrder)
      : [];

    // Fallback to Attributes if no dynamic config found for Medals
    if (isMedal && options.length === 0 && product.attributes) {
        const colorAttr = product.attributes.find(a => (a.name || '').toLowerCase() === 'color');
        if (colorAttr && colorAttr.value) {
            const values = colorAttr.value.split(',').map(v => v.trim()).filter(v => v);
            if (values.length > 0) {
                options = values.map((val, idx) => ({
                    id: -100 - idx,
                    configurationTypeId: -100,
                    name: val,
                    value: val,
                    priceModifier: 0,
                    priceType: 'fixed',
                    isDefault: idx === 0,
                    sortOrder: idx,
                    isActive: true,
                    createdAt: '',
                    updatedAt: ''
                }));
                if (!config) {
                    config = {
                        configurationTypeId: -100,
                        name: 'Color',
                        displayName: 'Color',
                        description: '',
                        inputType: 'buttons',
                        isRequired: true,
                        options: options,
                        sortOrder: 1,
                        isActive: true
                    } as any;
                }
            }
        }
    }
    return { isMedalCategory: isMedal, colorConfig: config, colorOptions: options };
  }, [product.categoryName, product.parentCategoryName, product.dynamicConfigurations, product.attributes]);

  const sizeAttributeValue =
    (product.attributes || [])
      .find(a => (a.name || '').toLowerCase().includes('size'))?.value || '';
  const sizeOptionsFallback = sizeOptionsFromConfig.length > 0
    ? []
    : (sizeAttributeValue ? [{ id: -1, configurationTypeId: sizeConfig?.configurationTypeId || -1, name: sizeAttributeValue, value: sizeAttributeValue, priceModifier: 0, priceType: 'fixed', isDefault: true, sortOrder: 1, isActive: true, createdAt: '', updatedAt: '' }] : []);
  const sizeOptions = [...sizeOptionsFromConfig, ...sizeOptionsFallback];
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
  const desiredImageCount = sizeOptions.length > 0 ? sizeOptions.length : 1;
  const productImages: ProductImage[] =
    baseImages.length >= desiredImageCount
      ? baseImages.slice(0, desiredImageCount)
      : Array.from({ length: desiredImageCount }, (_, i) => {
          const primary = baseImages[0];
          return {
            id: `${primary.id}-${i + 1}`,
            url: primary.url,
            alt: primary.alt
          };
        });

  /* ================= SYNC SIZE → IMAGE ================= */
  useEffect(() => {
    // Ensure a default selection for size if present
    if (sizeConfig && sizeOptions.length > 0) {
      const current = selectedConfigurations[sizeConfig.configurationTypeId];
      if (!current) {
        const first = sizeOptions[0];
        setSelectedConfigurations(prev => ({
          ...prev,
          [sizeConfig.configurationTypeId]: first.id
        }));
        setSelectedSizeIndex(0);
        setSelectedImageIndex(0);
      }
    }
    if (sizeConfig && sizeOptions.length > 0) {
      const selectedOptionId = selectedConfigurations[sizeConfig.configurationTypeId];
      const idx = sizeOptions.findIndex(o => o.id === selectedOptionId);
      if (idx >= 0) setSelectedImageIndex(idx);
    }
  }, [selectedConfigurations, sizeConfig, sizeOptions]);

  /* ================= SYNC COLOR (MEDALS) ================= */
  useEffect(() => {
    if (isMedalCategory && colorConfig && colorOptions.length > 0) {
      const current = selectedConfigurations[colorConfig.configurationTypeId];
      if (!current) {
        const first = colorOptions[0];
        setSelectedConfigurations(prev => ({
          ...prev,
          [colorConfig.configurationTypeId]: first.id
        }));
      }
    }
  }, [isMedalCategory, colorConfig, colorOptions, selectedConfigurations]);

  useEffect(() => {
    // Fallback default for attribute-based single size
    if (!sizeConfig && sizeOptions.length > 0) {
      setSelectedSizeIndex(0);
      setSelectedImageIndex(0);
    }
  }, [sizeConfig, sizeOptions.length]);

  /* 🔁 SIZE CLICK → IMAGE CHANGE + CONFIG UPDATE */
  const handleSizeClick = (index: number) => {
    setSelectedSizeIndex(index);
    setSelectedImageIndex(index);
    if (sizeConfig && sizeOptions[index]) {
      const option = sizeOptions[index];
      setSelectedConfigurations(prev => ({
        ...prev,
        [sizeConfig.configurationTypeId]: option.id
      }));
    }
  };

  const handleColorClick = (optionId: number) => {
    if (colorConfig) {
        setSelectedConfigurations(prev => ({
            ...prev,
            [colorConfig.configurationTypeId]: optionId
        }));
    }
  };

  /* ================= SKU LOGIC ================= */
  const getCurrentSku = () => {
    // 1. Try mapping from CSV data (Frontend override)
    if (sizeConfig && sizeOptions.length > 0) {
      const selectedOptionId = selectedConfigurations[sizeConfig.configurationTypeId];
      const option = sizeOptions.find(o => o.id === selectedOptionId);
      
      if (option) {
          const productMap = skuMapping[product.name];
          if (productMap) {
              // Try exact match
              if (productMap[option.name]) return productMap[option.name];
              // Try normalized match (trim spaces)
              const normalizedOptionName = option.name.trim();
              if (productMap[normalizedOptionName]) return productMap[normalizedOptionName];
          }
      }
    }

    // If we have explicit dynamic configuration for Size
    if (sizeConfig) {
       const selectedOptionId = selectedConfigurations[sizeConfig.configurationTypeId];
       const option = sizeOptionsFromConfig.find(o => o.id === selectedOptionId);
       
       // Priority 1: Option-specific SKU from CSV/Backend
       if (option && option.sku) return option.sku;
       
       // Priority 2: Option Value (only if it looks like a SKU, but usually it's "Small")
       // We skip using option.value as SKU unless we are sure.
       // The backend now populates 'sku', so we rely on that.
    }
    // Fallback to base product SKU
    return product.sku || 'N/A';
  };
  const currentSku = getCurrentSku();

  /* ================= ACTIONS ================= */
  const handleAddToCart = () => {
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

    const isMedal = (product.categoryName || '').toLowerCase().includes('medal') || 
                    (product.parentCategoryName || '').toLowerCase().includes('medal');

    // Get selected color for Medals
    let selectedColor = undefined;
    if (isMedal && colorConfig) {
        const colorId = selectedConfigurations[colorConfig.configurationTypeId];
        if (colorId) {
            selectedColor = colorOptions.find(o => o.id === colorId)?.name;
        }
    }

    onAddToCart(product.id.toString(), quantity, {
      size: sizeOptions[selectedSizeIndex]?.name || '',
      imageIndex: selectedImageIndex,
      selectedConfigurations: selectedConfigurations,
      selectedOptions,
      finalPrice: currentPrice,
      calculatedPrice: currentPrice,
      customName: isMedal ? customName : undefined,
      medalColor: isMedal ? selectedColor : undefined,
      // Generic uploads (only sent if not medal, or if UI allows it)
      logoUrl: !isMedal ? logoUrl : undefined,
      logoName: !isMedal ? logoName : undefined,
      textFileUrl: !isMedal ? textFileUrl : undefined,
      textFileName: !isMedal ? textFileName : undefined,
      customText: !isMedal ? customText : undefined
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

        {/* ========== LEFT IMAGE SECTION (CAROUSEL) ========== */}
        <div>
          <div className="aspect-square border bg-white rounded-xl overflow-hidden relative shadow-sm">
            <div 
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${selectedImageIndex * 100}%)` }}
            >
              {productImages.map((img, idx) => (
                <div key={`${img.id}-${idx}`} className="min-w-full h-full flex items-center justify-center p-4 bg-gray-50">
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="max-h-full max-w-full object-contain drop-shadow-sm"
                  />
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows Removed per user request */}
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-4 mt-6">
            {productImages.map((img, index) => (
              <button
                key={`${img.id}-${index}-thumb`}
                onClick={() => {
                  setSelectedImageIndex(index);
                  if (sizeConfig && sizeOptions.length > 0) {
                    const option = sizeOptions[index];
                    if (option) {
                      setSelectedConfigurations(prev => ({
                        ...prev,
                        [sizeConfig.configurationTypeId]: option.id
                      }));
                    }
                  }
                }}
                className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 transform ${
                  selectedImageIndex === index 
                    ? 'border-blue-600 scale-105 shadow-md ring-2 ring-blue-100' 
                    : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} className="w-full h-full object-cover" alt={`View ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* ========== RIGHT CONTENT ========== */}
        <div className="space-y-8">
          <div>
            <p className="text-sm font-medium text-sky-600 tracking-wide uppercase mb-2">{product.categoryName}</p>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-3 mt-4">
              <div className="flex text-yellow-400">
                {renderStars()}
              </div>
              <span className="text-sm font-medium text-gray-500">(50 confirmed reviews)</span>
            </div>
          </div>

          <div className="border-b pb-6">
             <PriceDisplay
              price={currentPrice}
              originalPrice={product.salePrice}
              size="xl"
            />
          </div>

          {/* SIZE SELECT (BOXES) + OTHER CONFIGS */}
          <div className="mt-6 border-t border-gray-100 pt-4">
            {sizeOptions.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium mr-2">Size :</span>
                  <span className="text-sm text-gray-700">
                    {sizeOptions[selectedSizeIndex]?.name || ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizeOptions.map((opt, index) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSizeClick(index)}
                      className={`px-4 py-3 border text-sm font-medium transition-colors ${
                        selectedSizeIndex === index
                          ? 'border-2 border-cyan-600 text-cyan-700 bg-cyan-50'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MEDAL COLOR SELECTION (Custom UI for Medals) */}
            {isMedalCategory && colorConfig && colorOptions.length > 0 && (
              <div className="mb-6">
                 <div className="flex items-center mb-2">
                  <span className="text-sm font-medium mr-2">Color :</span>
                  <span className="text-sm text-gray-700">
                    {colorOptions.find(o => o.id === selectedConfigurations[colorConfig.configurationTypeId])?.name || ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((opt) => {
                     const isSelected = selectedConfigurations[colorConfig.configurationTypeId] === opt.id;
                     return (
                      <button
                        key={opt.id}
                        onClick={() => handleColorClick(opt.id)}
                        className={`px-4 py-3 border text-sm font-medium transition-colors ${
                          isSelected
                            ? 'border-2 border-cyan-600 text-cyan-700 bg-cyan-50'
                            : 'border-gray-300 hover:border-gray-400 text-gray-700'
                        }`}
                      >
                        {opt.name}
                      </button>
                     );
                  })}
                </div>
              </div>
            )}

            {product.dynamicConfigurations && product.dynamicConfigurations.length > 0 && (
              <DynamicConfigurationSelector
                configurations={product.dynamicConfigurations.filter(c => 
                  c.configurationTypeId !== sizeConfig?.configurationTypeId &&
                  (!isMedalCategory || c.configurationTypeId !== colorConfig?.configurationTypeId)
                )}
                onConfigurationChange={(configurationId, selectedOptionId) => {
                  setSelectedConfigurations(prev => ({
                    ...prev,
                    [configurationId]: selectedOptionId
                  }));
                }}
                selectedConfigurations={selectedConfigurations}
              />
            )}
          </div>

          {/* SKU and Category Information */}
          <div className="mt-4 mb-6 space-y-1">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">SKU: </span>
              {currentSku}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Category: </span>
              <span className="text-cyan-600">{product.categoryName}</span>
            </div>
          </div>

          {/* UPLOAD SECTION */}
          <div className="space-y-4 border-t pt-6">
            {isMedalCategory ? (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900">
                  Upload Your Custom Name: Additional $3
                </label>
                <input 
                  type="text" 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full border p-2 rounded-md"
                  placeholder="Enter name..."
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Your Logo:
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={isUploadingLogo}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-cyan-50 file:text-cyan-700
                        hover:file:bg-cyan-100"
                    />
                    {isUploadingLogo && <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />}
                    {logoUrl && !isUploadingLogo && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                  {logoName && <p className="text-xs text-green-600 mt-1">Uploaded: {logoName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Upload Your Text File:
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      onChange={handleTextFileUpload}
                      disabled={isUploadingTextFile}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-cyan-50 file:text-cyan-700
                        hover:file:bg-cyan-100"
                    />
                    {isUploadingTextFile && <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />}
                    {textFileUrl && !isUploadingTextFile && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                  {textFileName && <p className="text-xs text-green-600 mt-1">Uploaded: {textFileName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Upload Your Custom Text:
                  </label>
                  <textarea
                    rows={4}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full border p-2 rounded-md focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Enter your custom text here"
                  />
                </div>
              </>
            )}
          </div>

          <ProductFreeShippingBanner />

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="w-full text-white py-3 rounded-lg font-medium transition"
            style={{ backgroundColor: '#ddc464' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c9b355')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ddc464')}
          >
            <ShoppingCart className="inline mr-2" />
            ADD TO CART
          </button>

          {/* WISHLIST */}
          <button
            onClick={handleWishlistToggle}
            className="w-full border py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Heart className={`${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>
        </div>
      </div>
    </div>
  );
};
