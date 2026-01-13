'use client';

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Upload, 
  Plus, 
  Minus, 
  AlertCircle,
  Loader2,
  Tag,
  DollarSign,
  Package,
  FileText,
  Settings
} from 'lucide-react';
import {
  AdminProductsApi,
  CreateProductRequest,
  UpdateProductRequest,
  CreateProductWithFilesRequest,
  UpdateProductWithFilesRequest,
  AdminProduct
} from '@/services/admin-products-api';
import { categoriesApi, filtersApi } from '@/services/api';
import { ImageUpload } from './ImageUpload';
import {
  configurationTypesApi,
  productConfigurationOverridesApi,
  type ConfigurationType,
  type ProductConfigurationOverride,
  type CreateProductConfigurationOverrideDto
} from '@/services/admin-product-overrides-api';

interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  parentId?: number;
  parentName?: string;
  isActive: boolean;
  sortOrder: number;
  slug?: string;
  children: Category[];
}

interface FilterOption {
  id: number;
  name: string;
  displayName: string;
  description: string;
  categoryId: number;
  filterType: string;
  minValue?: number;
  maxValue?: number;
  sortOrder: number;
  isActive: boolean;
  filterOptionValues: FilterOptionValue[];
}

interface FilterOptionValue {
  id: number;
  filterOptionId: number;
  value: string;
  displayValue: string;
  description: string;
  colorCode?: string;
  sortOrder: number;
  isActive: boolean;
}

interface ProductAttribute {
  name: string;
  value: string;
  sortOrder: number;
}

interface ProductFilterValue {
  filterOptionId: number;
  filterOptionValueId?: number;
  customValue?: string;
  numericValue?: number;
}

interface ProductFormProps {
  product?: AdminProduct;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  mode: 'create' | 'edit';
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
  mode
}) => {
  // Form state
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    description: '',
    longDescription: '',
    price: 0,
    salePrice: undefined,
    stock: 0,
    imageUrl: '',
    categoryId: 0,
    isActive: true,
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    slug: '',
    imageGallery: [],
    attributes: [],
    filterValues: []
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('basic');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Configuration state
  const [configurationTypes, setConfigurationTypes] = useState<ConfigurationType[]>([]);
  const [productOverrides, setProductOverrides] = useState<ProductConfigurationOverride[]>([]);
  const [loadingConfigurations, setLoadingConfigurations] = useState(false);

  // Load categories and configurations on mount
  useEffect(() => {
    loadCategories();
    loadConfigurationTypes();
  }, []);

  // Load filters when category changes
  useEffect(() => {
    if (formData.categoryId > 0) {
      loadFiltersForCategory(formData.categoryId);
    } else {
      setFilterOptions([]);
    }
  }, [formData.categoryId]);

  // Initialize form data when product changes
  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name,
        description: product.description,
        longDescription: product.longDescription || '',
        price: product.price,
        salePrice: product.salePrice,
        stock: product.stock,
        imageUrl: product.imageUrl || '',
        categoryId: product.categoryId,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
        slug: product.slug || '',
        imageGallery: product.images.map(img => img.imageUrl),
        attributes: product.attributes.map(attr => ({
          name: attr.name,
          value: attr.value,
          sortOrder: attr.sortOrder
        })),
        filterValues: product.filterValues.map(fv => ({
          filterOptionId: fv.filterOptionId,
          filterOptionValueId: fv.filterOptionValueId,
          customValue: fv.customValue,
          numericValue: fv.numericValue
        }))
      });
      setIsSlugManuallyEdited(!!product.slug); // If product has a slug, consider it manually edited
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        name: '',
        description: '',
        longDescription: '',
        price: 0,
        salePrice: undefined,
        stock: 0,
        imageUrl: '',
        categoryId: 0,
        isActive: true,
        isFeatured: false,
        metaTitle: '',
        metaDescription: '',
        slug: '',
        imageGallery: [],
        attributes: [],
        filterValues: []
      });
      setIsSlugManuallyEdited(false);
    }
  }, [product, mode]);

  // Load product overrides when editing a product
  useEffect(() => {
    if (product && mode === 'edit') {
      loadProductOverrides(product.id);
    } else {
      setProductOverrides([]);
    }
  }, [product, mode]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoriesApi.admin.getCategories({ isActive: true });
      if (response.success) {
        setCategories(response.categories || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadFiltersForCategory = async (categoryId: number) => {
    try {
      setLoadingFilters(true);
      const response = await filtersApi.getFiltersByCategory(categoryId);
      if (response.success) {
        setFilterOptions(response.filters || []);
      }
    } catch (error) {
      console.error('Error loading filters:', error);
      setFilterOptions([]);
    } finally {
      setLoadingFilters(false);
    }
  };

  const loadConfigurationTypes = async () => {
    try {
      setLoadingConfigurations(true);
      const types = await configurationTypesApi.getAll();
      setConfigurationTypes(types);
    } catch (error) {
      console.error('Error loading configuration types:', error);
    } finally {
      setLoadingConfigurations(false);
    }
  };

  const loadProductOverrides = async (productId: number) => {
    try {
      const overrides = await productConfigurationOverridesApi.getByProductId(productId);
      setProductOverrides(overrides);
    } catch (error) {
      console.error('Error loading product overrides:', error);
      setProductOverrides([]);
    }
  };

  // Helper function to render categories recursively
  const renderCategoryOptions = (categories: Category[], level = 0): React.ReactElement[] => {
    const options: React.ReactElement[] = [];

    categories.forEach(category => {
      const prefix = level === 0 ? '' : '├─ '.repeat(level);
      options.push(
        <option key={category.id} value={category.id}>
          {prefix}{category.name}
        </option>
      );

      if (category.children && category.children.length > 0) {
        options.push(...renderCategoryOptions(category.children, level + 1));
      }
    });

    return options;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.salePrice && formData.salePrice >= formData.price) {
      newErrors.salePrice = 'Sale price must be less than regular price';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (formData.categoryId <= 0) {
      newErrors.categoryId = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      // Check if we have any files to upload (blob URLs indicate files)
      const hasMainImageFile = formData.imageUrl && formData.imageUrl.startsWith('blob:');
      const hasGalleryFiles = formData.imageGallery && formData.imageGallery.some(url => url.startsWith('blob:'));
      const shouldUseFileAPI = hasMainImageFile || hasGalleryFiles;

      if (shouldUseFileAPI) {
        // Use file-based API endpoints
        await handleFileBasedSubmission();
      } else {
        // Use traditional URL-based API endpoints
        await handleUrlBasedSubmission();
      }
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileBasedSubmission = async () => {
    // Convert blob URLs to files and prepare file-based request
    const fileRequest: any = { ...formData };

    // Handle main image file
    if (formData.imageUrl && formData.imageUrl.startsWith('blob:')) {
      try {
        const response = await fetch(formData.imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'main-image.jpg', { type: blob.type });
        fileRequest.mainImage = file;
        fileRequest.imageUrl = undefined; // Remove blob URL
      } catch (error) {
        throw new Error('Failed to process main image file');
      }
    }

    // Handle gallery files
    const galleryFiles: File[] = [];
    const galleryUrls: string[] = [];

    if (formData.imageGallery && formData.imageGallery.length > 0) {
      for (let i = 0; i < formData.imageGallery.length; i++) {
        const url = formData.imageGallery[i];
        if (url.startsWith('blob:')) {
          try {
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], `gallery-image-${i + 1}.jpg`, { type: blob.type });
            galleryFiles.push(file);
          } catch (error) {
            console.warn(`Failed to process gallery image ${i + 1}:`, error);
          }
        } else {
          galleryUrls.push(url);
        }
      }
    }

    fileRequest.imageGallery = galleryFiles.length > 0 ? galleryFiles : undefined;
    fileRequest.imageUrls = galleryUrls.length > 0 ? galleryUrls : undefined;

    if (mode === 'create') {
      const response = await AdminProductsApi.createProductWithFiles(fileRequest);
      if (response.success) {
        onSave();
        onClose();
      } else {
        setErrors({ submit: response.message || 'Failed to create product' });
      }
    } else if (mode === 'edit' && product) {
      const response = await AdminProductsApi.updateProductWithFiles(product.id, fileRequest);
      if (response.success) {
        onSave();
        onClose();
      } else {
        setErrors({ submit: response.message || 'Failed to update product' });
      }
    }
  };

  const handleUrlBasedSubmission = async () => {
    // Use traditional URL-based submission (existing logic)
    let processedFormData = { ...formData };

    // Handle main image URL
    if (processedFormData.imageUrl && processedFormData.imageUrl.startsWith('blob:')) {
      try {
        const { ImageUploadApi } = await import('../../services/image-upload-api');
        const uploadResponse = await ImageUploadApi.uploadBlobUrl(processedFormData.imageUrl);
        if (uploadResponse.success && uploadResponse.imageUrl) {
          processedFormData.imageUrl = uploadResponse.imageUrl;
        } else {
          throw new Error('Failed to upload main image');
        }
      } catch (uploadError) {
        setErrors({ submit: `Image upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}` });
        return;
      }
    }

    // Handle image gallery
    if (processedFormData.imageGallery && processedFormData.imageGallery.length > 0) {
      const blobUrls = processedFormData.imageGallery.filter(url => url.startsWith('blob:'));
      if (blobUrls.length > 0) {
        try {
          const { ImageUploadApi } = await import('../../services/image-upload-api');
          const uploadResults = await ImageUploadApi.uploadMultipleBlobUrls(blobUrls);

          // Replace blob URLs with uploaded URLs
          processedFormData.imageGallery = processedFormData.imageGallery.map(url => {
            if (url.startsWith('blob:')) {
              const result = uploadResults.find(r => r.success);
              return result?.imageUrl || url; // Keep original if upload failed
            }
            return url;
          }).filter(url => !url.startsWith('blob:')); // Remove any remaining blob URLs
        } catch (uploadError) {
          setErrors({ submit: `Gallery upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}` });
          return;
        }
      }
    }

    if (mode === 'create') {
      const response = await AdminProductsApi.createProduct(processedFormData);
      if (response.success) {
        onSave();
        onClose();
      } else {
        setErrors({ submit: response.message || 'Failed to create product' });
      }
    } else if (mode === 'edit' && product) {
      const updateData: UpdateProductRequest = { ...processedFormData };
      const response = await AdminProductsApi.updateProduct(product.id, updateData);
      if (response.success) {
        onSave();
        onClose();
      } else {
        setErrors({ submit: response.message || 'Failed to update product' });
      }
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (field: keyof CreateProductRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-generate slug from name only if it hasn't been manually edited
    if (field === 'name' && !isSlugManuallyEdited) {
      const slug = generateSlug(value);
      setFormData(prev => ({ ...prev, slug }));
    }

    // Mark slug as manually edited when user changes it
    if (field === 'slug') {
      setIsSlugManuallyEdited(true);
    }
  };

  const addConfigurationOverride = async (configurationTypeId: number) => {
    if (!product && mode === 'create') {
      alert('Please save the product first before adding configurations');
      return;
    }

    const productId = product?.id;
    if (!productId) return;

    try {
      const overrideData: CreateProductConfigurationOverrideDto = {
        productId,
        configurationTypeId,
        overrideType: 'inherit',
        isActive: true
      };

      await productConfigurationOverridesApi.create(overrideData);
      await loadProductOverrides(productId);
    } catch (error) {
      console.error('Error adding configuration override:', error);
      alert('Failed to add configuration');
    }
  };

  const removeConfigurationOverride = async (overrideId: number) => {
    try {
      await productConfigurationOverridesApi.delete(overrideId);
      if (product) {
        await loadProductOverrides(product.id);
      }
    } catch (error) {
      console.error('Error removing configuration override:', error);
      alert('Failed to remove configuration');
    }
  };

  const updateConfigurationOverride = async (overrideId: number, overrideType: string) => {
    try {
      await productConfigurationOverridesApi.update(overrideId, {
        overrideType,
        isActive: true
      });
      if (product) {
        await loadProductOverrides(product.id);
      }
    } catch (error) {
      console.error('Error updating configuration override:', error);
      alert('Failed to update configuration');
    }
  };

  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...(prev.attributes || []), { name: '', value: '', sortOrder: (prev.attributes?.length || 0) + 1 }]
    }));
  };

  const removeAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes?.filter((_, i) => i !== index) || []
    }));
  };

  const updateAttribute = (index: number, field: keyof ProductAttribute, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes?.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      ) || []
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Create New Product' : 'Edit Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 flex-shrink-0">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'basic', label: 'Basic Info', icon: FileText },
              { id: 'pricing', label: 'Pricing & Stock', icon: DollarSign },
              { id: 'images', label: 'Images', icon: Upload },
              { id: 'attributes', label: 'Attributes', icon: Tag },
              { id: 'filters', label: 'Filters', icon: Settings },
              { id: 'configurations', label: 'Configurations', icon: Settings },
              { id: 'seo', label: 'SEO', icon: Package }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Error Display */}
            {errors.submit && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-700">{errors.submit}</span>
              </div>
            )}

            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter product name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    {loadingCategories ? (
                      <div className="flex items-center space-x-2 py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-500">Loading categories...</span>
                      </div>
                    ) : (
                      <select
                        value={formData.categoryId}
                        onChange={(e) => handleInputChange('categoryId', parseInt(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black ${
                          errors.categoryId ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value={0}>Select a category</option>
                        {renderCategoryOptions(categories)}
                      </select>
                    )}
                    {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter a brief product description"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Long Description
                  </label>
                  <textarea
                    value={formData.longDescription || ''}
                    onChange={(e) => handleInputChange('longDescription', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                    placeholder="Enter detailed product description"
                  />
                </div>

                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.slug || ''}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                        placeholder="product-url-slug"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newSlug = generateSlug(formData.name);
                          setFormData(prev => ({ ...prev, slug: newSlug }));
                          setIsSlugManuallyEdited(false);
                        }}
                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Generate slug from name"
                      >
                        Auto
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured</span>
                  </label>
                </div>
              </div>
            )}

            {/* Pricing & Stock Tab */}
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Regular Price *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500  text-black ${
                          errors.price ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Price
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.salePrice || ''}
                        onChange={(e) => handleInputChange('salePrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500  text-black ${
                          errors.salePrice ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.salePrice && <p className="mt-1 text-sm text-red-600">{errors.salePrice}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500  text-black ${
                        errors.stock ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                  </div>
                  {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                </div>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Product Images
                  </label>
                  <ImageUpload
                    images={formData.imageGallery || []}
                    onChange={(images) => {
                      // Update both imageGallery and imageUrl in a single state update
                      setFormData(prev => ({
                        ...prev,
                        imageGallery: images,
                        imageUrl: images.length > 0 ? images[0] : ''
                      }));

                      // Clear errors for both fields
                      if (errors.imageGallery || errors.imageUrl) {
                        setErrors(prev => ({
                          ...prev,
                          imageGallery: '',
                          imageUrl: ''
                        }));
                      }
                    }}
                    maxImages={10}
                    maxFileSize={5}
                    acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Image Guidelines</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Use high-quality images (at least 800x800 pixels)</li>
                    <li>• The first image will be used as the primary product image</li>
                    <li>• Supported formats: JPEG, PNG, WebP</li>
                    <li>• Maximum file size: 5MB per image</li>
                    <li>• You can upload up to 10 images per product</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Attributes Tab */}
            {activeTab === 'attributes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Product Attributes</h3>
                  <button
                    type="button"
                    onClick={addAttribute}
                    className="flex items-center space-x-2 px-3 py-2 text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Attribute</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.attributes?.map((attribute, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Attribute Name
                        </label>
                        <input
                          type="text"
                          value={attribute.name}
                          onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500  text-black"
                          placeholder="e.g., Material, Size, Color"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Value
                        </label>
                        <input
                          type="text"
                          value={attribute.value}
                          onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500  text-black"
                          placeholder="e.g., Cotton, Large, Red"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeAttribute(index)}
                          className="w-full p-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Minus className="h-4 w-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {(!formData.attributes || formData.attributes.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <Tag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No attributes added yet</p>
                      <p className="text-sm">Click "Add Attribute" to get started</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Filters Tab */}
            {activeTab === 'filters' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Product Filters</h3>
                  {loadingFilters && (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-500">Loading filters...</span>
                    </div>
                  )}
                </div>

                {formData.categoryId === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Please select a category first</p>
                    <p className="text-sm">Filters are specific to each category</p>
                  </div>
                ) : filterOptions.length === 0 && !loadingFilters ? (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No filters available for this category</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filterOptions.filter(filter => filter.name.toLowerCase() !== 'price').map(filter => (
                      <div key={filter.id} className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">{filter.displayName}</h4>

                        {(filter.filterType.toLowerCase() === 'checkbox' || filter.filterType.toLowerCase() === 'select' || filter.filterType.toLowerCase() === 'radio') ? (
                          <div className="space-y-3">
                            {filter.filterOptionValues.map(value => (
                              <label key={value.id} className="flex items-center group cursor-pointer">
                                <div className="relative">
                                  <input
                                    type={filter.filterType.toLowerCase() === 'radio' ? 'radio' : 'checkbox'}
                                    name={`filter-${filter.id}`}
                                    checked={formData.filterValues?.some(fv =>
                                      fv.filterOptionId === filter.id && fv.filterOptionValueId === value.id
                                    )}
                                    onChange={(e) => {
                                      const currentFilters = formData.filterValues || [];
                                      if (e.target.checked) {
                                        // Add filter value
                                        const newFilterValues = filter.filterType.toLowerCase() === 'radio'
                                          ? currentFilters.filter(fv => fv.filterOptionId !== filter.id)
                                          : currentFilters;
                                        newFilterValues.push({
                                          filterOptionId: filter.id,
                                          filterOptionValueId: value.id
                                        });
                                        handleInputChange('filterValues', newFilterValues);
                                      } else {
                                        // Remove filter value
                                        const newFilterValues = currentFilters.filter(fv =>
                                          !(fv.filterOptionId === filter.id && fv.filterOptionValueId === value.id)
                                        );
                                        handleInputChange('filterValues', newFilterValues);
                                      }
                                    }}
                                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                                  />
                                </div>
                                <div className="ml-3 flex items-center space-x-2">
                                  {value.colorCode && (
                                    <div
                                      className="w-4 h-4 rounded border border-gray-300 shadow-sm"
                                      style={{ backgroundColor: value.colorCode }}
                                      title={`Color: ${value.colorCode}`}
                                    />
                                  )}
                                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                                    {value.displayValue}
                                  </span>
                                  {value.description && (
                                    <span className="text-xs text-gray-500">({value.description})</span>
                                  )}
                                </div>
                              </label>
                            ))}
                          </div>
                        ) : filter.filterType.toLowerCase() === 'range' ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Min Value</label>
                                <input
                                  type="number"
                                  min={filter.minValue}
                                  max={filter.maxValue}
                                  placeholder={`Min (${filter.minValue || 0})`}
                                  value={formData.filterValues?.find(fv =>
                                    fv.filterOptionId === filter.id
                                  )?.numericValue || ''}
                                  onChange={(e) => {
                                    const currentFilters = formData.filterValues || [];
                                    const existingIndex = currentFilters.findIndex(fv => fv.filterOptionId === filter.id);
                                    const newFilterValues = [...currentFilters];

                                    if (existingIndex >= 0) {
                                      newFilterValues[existingIndex] = {
                                        ...newFilterValues[existingIndex],
                                        numericValue: Number(e.target.value)
                                      };
                                    } else {
                                      newFilterValues.push({
                                        filterOptionId: filter.id,
                                        numericValue: Number(e.target.value)
                                      });
                                    }
                                    handleInputChange('filterValues', newFilterValues);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Max Value</label>
                                <input
                                  type="number"
                                  min={filter.minValue}
                                  max={filter.maxValue}
                                  placeholder={`Max (${filter.maxValue || 1000})`}
                                  value={formData.filterValues?.find(fv =>
                                    fv.filterOptionId === filter.id
                                  )?.customValue || ''}
                                  onChange={(e) => {
                                    const currentFilters = formData.filterValues || [];
                                    const existingIndex = currentFilters.findIndex(fv => fv.filterOptionId === filter.id);
                                    const newFilterValues = [...currentFilters];

                                    if (existingIndex >= 0) {
                                      newFilterValues[existingIndex] = {
                                        ...newFilterValues[existingIndex],
                                        customValue: e.target.value
                                      };
                                    } else {
                                      newFilterValues.push({
                                        filterOptionId: filter.id,
                                        customValue: e.target.value
                                      });
                                    }
                                    handleInputChange('filterValues', newFilterValues);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                                />
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">
                              Range: {filter.minValue || 0} - {filter.maxValue || 1000}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-700">Custom Value</label>
                            <input
                              type="text"
                              placeholder="Enter custom value"
                              value={formData.filterValues?.find(fv =>
                                fv.filterOptionId === filter.id
                              )?.customValue || ''}
                              onChange={(e) => {
                                const currentFilters = formData.filterValues || [];
                                const existingIndex = currentFilters.findIndex(fv => fv.filterOptionId === filter.id);
                                const newFilterValues = [...currentFilters];

                                if (existingIndex >= 0) {
                                  newFilterValues[existingIndex] = {
                                    ...newFilterValues[existingIndex],
                                    customValue: e.target.value
                                  };
                                } else {
                                  newFilterValues.push({
                                    filterOptionId: filter.id,
                                    customValue: e.target.value
                                  });
                                }
                                handleInputChange('filterValues', newFilterValues);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Configurations Tab */}
            {activeTab === 'configurations' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Configuration Assignment</h4>
                  <p className="text-sm text-blue-700">
                    Assign specific configurations to this product. These will override or supplement the category-level configurations.
                  </p>
                </div>

                {/* Available Configuration Types */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Available Configuration Types</h4>
                    {loadingConfigurations && (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    )}
                  </div>

                  <div className="space-y-3">
                    {configurationTypes.map(configType => {
                      const hasOverride = productOverrides.some(override => override.configurationTypeId === configType.id);

                      return (
                        <div key={configType.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{configType.name}</h5>
                            <p className="text-sm text-gray-500">Type: {configType.type}</p>
                            {configType.description && (
                              <p className="text-sm text-gray-600 mt-1">{configType.description}</p>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            {hasOverride ? (
                              <>
                                <span className="px-3 py-1 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                                  Inherit from Category
                                </span>
                                <button
                                  onClick={() => {
                                    const override = productOverrides.find(o => o.configurationTypeId === configType.id);
                                    if (override) {
                                      removeConfigurationOverride(override.id);
                                    }
                                  }}
                                  className="p-1 text-red-600 hover:text-red-800"
                                  title="Remove Configuration"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => addConfigurationOverride(configType.id)}
                                disabled={mode === 'create'}
                                className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                                title={mode === 'create' ? 'Save product first to add configurations' : 'Add Configuration'}
                              >
                                <Plus className="h-3 w-3" />
                                <span>Add</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {configurationTypes.length === 0 && !loadingConfigurations && (
                    <div className="text-center py-8 text-gray-500">
                      <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No configuration types available.</p>
                      <p className="text-sm">Create configuration types first in the Configuration Management section.</p>
                    </div>
                  )}
                </div>

                {/* Current Product Overrides */}
                {productOverrides.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Current Product Configurations</h4>
                    <div className="space-y-2">
                      {productOverrides.map(override => (
                        <div key={override.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div>
                            <span className="font-medium text-green-900">{override.configurationTypeName}</span>
                            <span className="text-green-600 text-sm ml-2">({override.configurationType})</span>
                            <div className="text-sm text-green-700 mt-1">
                              Override Type: <span className="font-medium">{override.overrideType}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle || ''}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                    placeholder="SEO title for search engines"
                    maxLength={60}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {(formData.metaTitle || '').length}/60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription || ''}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                    placeholder="SEO description for search engines"
                    maxLength={160}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {(formData.metaDescription || '').length}/160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug
                  </label>
                  <div className="flex gap-2">
                    <div className="flex flex-1">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        /products/
                      </span>
                      <input
                        type="text"
                        value={formData.slug || ''}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                        placeholder="product-url-slug"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newSlug = generateSlug(formData.name);
                        setFormData(prev => ({ ...prev, slug: newSlug }));
                        setIsSlugManuallyEdited(false);
                      }}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Generate slug from name"
                    >
                      Auto
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{mode === 'create' ? 'Create Product' : 'Update Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
