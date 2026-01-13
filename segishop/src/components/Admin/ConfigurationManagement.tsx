'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Settings,
  BarChart3,
  Package,
  Tag,
  ChevronDown,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Users,
  Activity,
  X,
  Save,
  AlertCircle
} from 'lucide-react';
import {
  configurationTypesApi,
  configurationOptionsApi,
  categoryConfigurationApi,
  configurationAnalyticsApi,
  type ConfigurationType,
  type ConfigurationOption,
  type CategoryTemplate,
  type CategoryConfigurationTemplateDto,
  type ConfigurationAnalytics,
  type CreateConfigurationTypeDto,
  type UpdateConfigurationTypeDto,
  type CreateConfigurationOptionDto,
  type UpdateConfigurationOptionDto
} from '@/services/admin-configuration-api';
import {
  productConfigurationOverridesApi,
  productsApi,
  type ProductOverrideSummary,
  type ProductConfigurationOverride,
  overrideUtils
} from '@/services/admin-product-overrides-api';
import { AdminCategoriesApi } from '@/services/admin-categories-api';

interface ConfigurationManagementProps {
  onClose?: () => void;
}

type TabType = 'types' | 'categories' | 'analytics';

const ConfigurationManagement: React.FC<ConfigurationManagementProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('types');
  const [configurationTypes, setConfigurationTypes] = useState<ConfigurationType[]>([]);
  const [categoryTemplates, setCategoryTemplates] = useState<CategoryTemplate[]>([]);
  const [categoryTemplatesData, setCategoryTemplatesData] = useState<CategoryConfigurationTemplateDto[]>([]);
  const [analytics, setAnalytics] = useState<ConfigurationAnalytics | null>(null);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTypes, setExpandedTypes] = useState<Set<number>>(new Set());
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());

  // Modal states
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);

  const [showCategoryTemplateModal, setShowCategoryTemplateModal] = useState(false);
  const [editingType, setEditingType] = useState<ConfigurationType | null>(null);
  const [editingOption, setEditingOption] = useState<ConfigurationOption | null>(null);

  const [editingCategoryTemplate, setEditingCategoryTemplate] = useState<any | null>(null);
  const [selectedTypeForOption, setSelectedTypeForOption] = useState<number | null>(null);

  const [selectedCategoryForTemplate, setSelectedCategoryForTemplate] = useState<number | null>(null);

  // Form states
  const [typeForm, setTypeForm] = useState<CreateConfigurationTypeDto>({
    name: '',
    type: 'dropdown',
    description: '',
    isRequired: false,
    showPriceImpact: false,
    isActive: true
  });

  const [optionForm, setOptionForm] = useState<CreateConfigurationOptionDto>({
    configurationTypeId: 0,
    name: '',
    value: '',
    priceModifier: 0,
    priceType: 'fixed',
    isDefault: false,
    sortOrder: 0,
    isActive: true
  });



  const [categoryTemplateForm, setCategoryTemplateForm] = useState({
    categoryId: 0,
    configurationTypeId: 0,
    isRequired: false,
    isActive: true
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data based on active tab
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      switch (activeTab) {
        case 'types':
          const types = await configurationTypesApi.getAll();
          setConfigurationTypes(types);
          break;
        case 'categories':
          const templates = await categoryConfigurationApi.getAll();
          setCategoryTemplates(templates);
          // Load individual templates for delete functionality
          const individualTemplates = await categoryConfigurationApi.getAllTemplates();
          setCategoryTemplatesData(individualTemplates);
          // Also load categories for the UI
          if (!availableCategories || availableCategories.length === 0) {
            await loadProductsAndCategories();
          }
          break;
        case 'analytics':
          const analyticsData = await configurationAnalyticsApi.getAnalytics();
          setAnalytics(analyticsData);
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const toggleTypeExpansion = (typeId: number) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(typeId)) {
      newExpanded.delete(typeId);
    } else {
      newExpanded.add(typeId);
    }
    setExpandedTypes(newExpanded);
  };

  const toggleProductExpansion = (productId: number) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const handleDeleteType = async (id: number) => {
    if (!confirm('Are you sure you want to delete this configuration type?')) return;
    
    try {
      await configurationTypesApi.delete(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete configuration type');
    }
  };

  const handleDeleteOption = async (id: number) => {
    if (!confirm('Are you sure you want to delete this configuration option?')) return;

    try {
      await configurationOptionsApi.delete(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete configuration option');
    }
  };

  // Modal handlers
  const openAddTypeModal = () => {
    setEditingType(null);
    setTypeForm({
      name: '',
      type: 'dropdown',
      description: '',
      isRequired: false,
      showPriceImpact: false,
      isActive: true
    });
    setFormErrors({});
    setShowTypeModal(true);
  };

  const openEditTypeModal = (type: ConfigurationType) => {
    setEditingType(type);
    setTypeForm({
      name: type.name,
      type: type.type,
      description: type.description || '',
      isRequired: type.isRequired,
      showPriceImpact: type.showPriceImpact,
      isActive: type.isActive
    });
    setFormErrors({});
    setShowTypeModal(true);
  };

  const openAddOptionModal = (typeId: number) => {
    setEditingOption(null);
    setSelectedTypeForOption(typeId);
    const type = configurationTypes.find(t => t.id === typeId);
    setOptionForm({
      configurationTypeId: typeId,
      name: '',
      value: '',
      priceModifier: 0,
      priceType: 'fixed',
      isDefault: false,
      sortOrder: type?.options.length || 0,
      isActive: true
    });
    setFormErrors({});
    setShowOptionModal(true);
  };

  const openEditOptionModal = (option: ConfigurationOption) => {
    setEditingOption(option);
    setSelectedTypeForOption(option.configurationTypeId);
    setOptionForm({
      configurationTypeId: option.configurationTypeId,
      name: option.name,
      value: option.value,
      priceModifier: option.priceModifier,
      priceType: option.priceType,
      isDefault: option.isDefault,
      sortOrder: option.sortOrder,
      isActive: option.isActive
    });
    setFormErrors({});
    setShowOptionModal(true);
  };

  const closeModals = () => {
    setShowTypeModal(false);
    setShowOptionModal(false);
    setShowCategoryTemplateModal(false);
    setEditingType(null);
    setEditingOption(null);
    setEditingCategoryTemplate(null);
    setSelectedTypeForOption(null);
    setSelectedCategoryForTemplate(null);
    setFormErrors({});
    setIsSubmitting(false);
  };

  // Load products and categories for modal
  const loadProductsAndCategories = async () => {
    try {
      const [products, categoriesResponse] = await Promise.all([
        productsApi.getAll(),
        AdminCategoriesApi.getCategories({ isActive: true }) // Only load active categories
      ]);
      setAvailableProducts(products);
      setAvailableCategories(categoriesResponse.categories);
    } catch (err) {
      console.error('Failed to load products and categories:', err);
    }
  };

  // Helper function to render categories with subcategories hierarchically
  const renderCategoryOptions = (categories: any[], level = 0): React.ReactElement[] => {
    const options: React.ReactElement[] = [];

    categories.forEach(category => {
      const prefix = level === 0 ? '' : '├─ '.repeat(level);
      options.push(
        <option key={category.id} value={category.id}>
          {prefix}{category.name} ({category.productCount || 0} products)
        </option>
      );

      if (category.children && category.children.length > 0) {
        options.push(...renderCategoryOptions(category.children, level + 1));
      }
    });

    return options;
  };

  // Helper function to flatten categories for display (including subcategories)
  const flattenCategories = (categories: any[], level = 0): any[] => {
    const flattened: any[] = [];

    categories.forEach(category => {
      // Only include active categories
      if (category.isActive) {
        flattened.push({
          ...category,
          level,
          displayName: level === 0 ? category.name : `${'├─ '.repeat(level)}${category.name}`
        });

        if (category.children && category.children.length > 0) {
          flattened.push(...flattenCategories(category.children, level + 1));
        }
      }
    });

    return flattened;
  };

  // Helper function to get categories for display (active categories + categories with configurations)
  const getCategoriesForDisplay = (): any[] => {
    if (!availableCategories) {
      return [];
    }

    // Since we're loading only active categories, and the categoryTemplates
    // endpoint also only returns active categories with configurations,
    // we can simply use the active categories we have
    return flattenCategories(availableCategories);
  };



  // Category Template Modal Handlers
  const openAddCategoryTemplateModal = (categoryId?: number) => {
    setEditingCategoryTemplate(null);
    setSelectedCategoryForTemplate(categoryId || null);
    setCategoryTemplateForm({
      categoryId: categoryId || 0,
      configurationTypeId: 0,
      isRequired: false,
      isActive: true
    });
    setFormErrors({});
    setShowCategoryTemplateModal(true);
  };

  const openEditCategoryTemplateModal = (template: any) => {
    setEditingCategoryTemplate(template);
    setSelectedCategoryForTemplate(template.categoryId);
    setCategoryTemplateForm({
      categoryId: template.categoryId,
      configurationTypeId: template.configurationTypeId,
      isRequired: template.isRequired,
      isActive: template.isActive
    });
    setFormErrors({});
    setShowCategoryTemplateModal(true);
  };

  const handleDeleteCategoryTemplate = async (templateId: number) => {
    if (!confirm('Are you sure you want to remove this configuration from the category?')) return;

    try {
      await categoryConfigurationApi.deleteTemplate(templateId);
      await loadData(); // Reload the category templates data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category configuration template');
    }
  };

  // Form validation
  const validateTypeForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!typeForm.name.trim()) {
      errors.name = 'Name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateOptionForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!optionForm.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!optionForm.value.trim()) {
      errors.value = 'Value is required';
    }

    if (optionForm.sortOrder < 0) {
      errors.sortOrder = 'Sort order must be 0 or greater';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };



  const validateCategoryTemplateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (categoryTemplateForm.categoryId === 0) {
      errors.categoryId = 'Category is required';
    }

    if (categoryTemplateForm.configurationTypeId === 0) {
      errors.configurationTypeId = 'Configuration type is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submission handlers
  const handleTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateTypeForm()) return;

    setIsSubmitting(true);

    try {
      if (editingType) {
        await configurationTypesApi.update(editingType.id, typeForm);
      } else {
        await configurationTypesApi.create(typeForm);
      }

      await loadData();
      closeModals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration type');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateOptionForm()) return;

    setIsSubmitting(true);

    try {
      if (editingOption) {
        await configurationOptionsApi.update(editingOption.id, optionForm);
      } else {
        await configurationOptionsApi.create(optionForm);
      }

      await loadData();
      closeModals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration option');
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleCategoryTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCategoryTemplateForm()) return;

    setIsSubmitting(true);

    try {
      if (editingCategoryTemplate) {
        // Update existing template
        await categoryConfigurationApi.updateTemplate(editingCategoryTemplate.id, {
          isRequired: categoryTemplateForm.isRequired,
          inheritToSubcategories: false, // Default to false since we removed the option
          isActive: categoryTemplateForm.isActive
        });
      } else {
        // Create new template
        await categoryConfigurationApi.createTemplate({
          categoryId: categoryTemplateForm.categoryId,
          configurationTypeId: categoryTemplateForm.configurationTypeId,
          isRequired: categoryTemplateForm.isRequired,
          inheritToSubcategories: false, // Default to false since we removed the option
          isActive: categoryTemplateForm.isActive
        });
      }

      closeModals();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category configuration template');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderConfigurationTypes = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Configuration Types</h3>
          <p className="text-sm text-gray-600 mt-1">Manage product configuration types and their options</p>
        </div>
        <button
          onClick={openAddTypeModal}
          className="bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2 text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Configuration Type</span>
          <span className="sm:hidden">Add Type</span>
        </button>
      </div>

      {/* Configuration Types List */}
      <div className="space-y-4">
        {configurationTypes.map((type) => (
          <div key={type.id} className="bg-white border border-gray-200 rounded-lg">
            {/* Type Header */}
            <div className="p-3 sm:p-4 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTypeExpansion(type.id)}
                    className="text-gray-400 hover:text-gray-600 mt-1 sm:mt-0 flex-shrink-0"
                  >
                    {expandedTypes.has(type.id) ? (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{type.name}</h4>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {type.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {type.options.length} options
                      </span>
                      {type.showPriceImpact && (
                        <span className="flex items-center gap-1 text-green-600">
                          <DollarSign className="w-3 h-3" />
                          <span className="hidden sm:inline">Price Impact</span>
                          <span className="sm:hidden">Price</span>
                        </span>
                      )}
                      {type.isRequired && (
                        <span className="text-red-600 text-xs font-medium">Required</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-xs text-gray-500 truncate">
                    <span className="hidden sm:inline">Used in: </span>{type.usedInCategories.join(', ') || 'None'}
                  </span>
                  <button
                    onClick={() => openEditTypeModal(type)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteType(type.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Type Options (Expanded) */}
            {expandedTypes.has(type.id) && (
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium text-gray-700">Configuration Options</h5>
                  <button
                    onClick={() => openAddOptionModal(type.id)}
                    className="text-orange-500 hover:text-orange-600 text-sm flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Option
                  </button>
                </div>
                <div className="space-y-2">
                  {type.options.map((option) => (
                    <div key={option.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="font-medium text-gray-900">{option.name}</span>
                          <span className="text-gray-500 ml-2">({option.value})</span>
                          {option.isDefault && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {option.priceModifier !== 0 && (
                          <span className={`text-sm ${
                            option.priceType === 'replace'
                              ? 'text-blue-600'
                              : option.priceType === 'multiplier'
                                ? 'text-blue-600'
                                : option.priceModifier > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {option.priceType === 'replace'
                              ? `$${option.priceModifier}`
                              : option.priceType === 'percentage'
                                ? `${option.priceModifier > 0 ? '+' : ''}${option.priceModifier}%`
                                : option.priceType === 'multiplier'
                                  ? `× ${option.priceModifier}`
                                  : `${option.priceModifier > 0 ? '+' : ''}$${option.priceModifier}`
                            }
                          </span>
                        )}
                        <button
                          onClick={() => openEditOptionModal(option)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => handleDeleteOption(option.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {type.options.length === 0 && (
                    <p className="text-gray-500 text-sm italic">No options configured</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );



  const renderCategoryTemplates = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Category Configuration Templates</h3>
          <p className="text-sm text-gray-600 mt-1">Assign configuration types to categories. Products inherit these configurations by default.</p>
        </div>
        <button
          onClick={() => openAddCategoryTemplateModal()}
          className="bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2 text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Assign Configuration to Category</span>
          <span className="sm:hidden">Assign Config</span>
        </button>
      </div>

      {/* Category Templates List */}
      <div className="space-y-4">
        {!availableCategories || availableCategories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Found</h3>
            <p className="text-gray-500 mb-4">Create categories first to assign configurations.</p>
          </div>
        ) : (
          getCategoriesForDisplay().map((category) => (
            <div key={category.id} className={`bg-white border border-gray-200 rounded-lg ${category.level > 0 ? 'ml-6 border-l-4 border-l-blue-200' : ''}`}>
              {/* Category Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className={`font-medium text-gray-900 ${category.level > 0 ? 'ml-4' : ''}`}>
                        {category.displayName}
                      </h4>
                      <div className={`flex items-center gap-4 text-sm text-gray-500 ${category.level > 0 ? 'ml-4' : ''}`}>
                        <span>ID: {category.id}</span>
                        <span>Products: {category.productCount || 0}</span>
                        {category.level > 0 && <span className="text-blue-600 font-medium">Subcategory</span>}
                        <span className={`px-2 py-1 rounded-full text-xs ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAddCategoryTemplateModal(category.id)}
                      className="text-orange-500 hover:text-orange-600 text-sm flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Configuration
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Configurations */}
              <div className="p-4">
                <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Assigned Configurations
                </h5>

                <div className="space-y-2">
                  {(() => {
                    const categoryConfigs = categoryTemplatesData.filter(template => template.categoryId === category.id);

                    if (categoryConfigs.length === 0) {
                      return (
                        <div>
                          <div className="text-gray-500 text-sm italic mb-2">
                            No configurations assigned to this category yet.
                          </div>
                          <button
                            onClick={() => openAddCategoryTemplateModal(category.id)}
                            className="text-orange-500 hover:text-orange-600 text-sm"
                          >
                            Assign Configuration Type
                          </button>
                        </div>
                      );
                    }

                    return categoryConfigs.map((template) => (
                      <div key={template.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <span className="font-medium text-green-900">{template.configurationTypeName}</span>
                          <span className="text-green-600 text-sm ml-2">({template.configurationType})</span>
                          <div className="flex items-center gap-2 mt-1">
                            {template.isRequired && (
                              <span key={`required-${template.id}`} className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Required</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditCategoryTemplateModal(template)}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategoryTemplate(template.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Configuration Management</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">Manage dynamic product configurations and category templates</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row border-b border-gray-200">
            <button
              onClick={() => setActiveTab('types')}
              className={`py-3 px-4 sm:px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'types'
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              <span className="hidden sm:inline">Configuration Types</span>
              <span className="sm:hidden">Types</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-3 px-4 sm:px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              <span className="hidden sm:inline">Category Templates</span>
              <span className="sm:hidden">Categories</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-3 px-4 sm:px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={loadData}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'types' && renderConfigurationTypes()}
            {activeTab === 'categories' && renderCategoryTemplates()}
            {activeTab === 'analytics' && <div>Analytics - Coming Soon</div>}
          </>
        )}
      </div>

      {/* Configuration Type Modal */}
      {showTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModals}
            aria-hidden="true"
          />
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingType ? 'Edit Configuration Type' : 'Add Configuration Type'}
              </h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTypeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={typeForm.name}
                  onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter configuration type name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={typeForm.type}
                  onChange={(e) => setTypeForm({ ...typeForm, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                >
                  <option value="dropdown">Dropdown</option>
                  <option value="radio">Radio Buttons</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="number">Number Input</option>
                  <option value="text">Text Input</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={typeForm.description}
                  onChange={(e) => setTypeForm({ ...typeForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  rows={3}
                  placeholder="Optional description"
                />
              </div>



              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={typeForm.isRequired}
                    onChange={(e) => setTypeForm({ ...typeForm, isRequired: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Required field</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={typeForm.showPriceImpact}
                    onChange={(e) => setTypeForm({ ...typeForm, showPriceImpact: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show price impact</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={typeForm.isActive}
                    onChange={(e) => setTypeForm({ ...typeForm, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingType ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Configuration Option Modal */}
      {showOptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModals}
            aria-hidden="true"
          />
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingOption ? 'Edit Configuration Option' : 'Add Configuration Option'}
              </h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOptionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={optionForm.name}
                  onChange={(e) => setOptionForm({ ...optionForm, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500  text-black ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter option name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value *
                </label>
                <input
                  type="text"
                  value={optionForm.value}
                  onChange={(e) => setOptionForm({ ...optionForm, value: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black ${
                    formErrors.value ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter option value"
                />
                {formErrors.value && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.value}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {optionForm.priceType === 'replace'
                      ? 'Manual Price'
                      : optionForm.priceType === 'percentage'
                        ? 'Percentage Modifier'
                        : optionForm.priceType === 'multiplier'
                          ? 'Multiplier'
                          : 'Price Modifier'
                    }
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={optionForm.priceModifier}
                    onChange={(e) => setOptionForm({ ...optionForm, priceModifier: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                    placeholder={
                      optionForm.priceType === 'replace'
                        ? '25.99'
                        : optionForm.priceType === 'percentage'
                          ? '10'
                          : optionForm.priceType === 'multiplier'
                            ? '12'
                            : '5.00'
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {optionForm.priceType === 'replace'
                      ? 'Set the exact price for this option (e.g., $25.99)'
                      : optionForm.priceType === 'percentage'
                        ? 'Percentage to add/subtract from base price (e.g., 10 for +10%)'
                        : optionForm.priceType === 'multiplier'
                          ? 'Multiply base price by this value (e.g., 12 for 12-pack)'
                          : 'Fixed amount to add/subtract from base price (e.g., $5.00)'
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Type
                  </label>
                  <select
                    value={optionForm.priceType}
                    onChange={(e) => setOptionForm({ ...optionForm, priceType: e.target.value as 'fixed' | 'percentage' | 'multiplier' | 'replace' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  >
                    <option value="fixed">Fixed ($)</option>
                    <option value="percentage">Percentage (%)</option>
                    <option value="multiplier">Multiplier (×)</option>
                    <option value="replace">Manual Price ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={optionForm.sortOrder}
                  onChange={(e) => setOptionForm({ ...optionForm, sortOrder: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black ${
                    formErrors.sortOrder ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="0"
                />
                {formErrors.sortOrder && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.sortOrder}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={optionForm.isDefault}
                    onChange={(e) => setOptionForm({ ...optionForm, isDefault: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Default option</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={optionForm.isActive}
                    onChange={(e) => setOptionForm({ ...optionForm, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingOption ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}




      {/* Category Configuration Template Modal */}
      {showCategoryTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModals}
            aria-hidden="true"
          />
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategoryTemplate ? 'Edit Category Configuration' : 'Assign Configuration to Category'}
              </h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCategoryTemplateSubmit} className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={categoryTemplateForm.categoryId}
                  onChange={(e) => setCategoryTemplateForm(prev => ({ ...prev, categoryId: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  disabled={!!selectedCategoryForTemplate || !!editingCategoryTemplate}
                >
                  <option value={0}>Select a category...</option>
                  {availableCategories && availableCategories.length > 0 ? (
                    renderCategoryOptions(availableCategories)
                  ) : (
                    <option disabled>Loading categories...</option>
                  )}
                </select>
                {formErrors.categoryId && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.categoryId}</p>
                )}
              </div>

              {/* Configuration Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Configuration Type *
                </label>
                <select
                  value={categoryTemplateForm.configurationTypeId}
                  onChange={(e) => setCategoryTemplateForm(prev => ({ ...prev, configurationTypeId: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  disabled={!!editingCategoryTemplate}
                >
                  <option value={0}>Select a configuration type...</option>
                  {configurationTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.type})
                    </option>
                  ))}
                </select>
                {formErrors.configurationTypeId && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.configurationTypeId}</p>
                )}
              </div>

              {/* Configuration Settings */}
              <div>
                {/* Required */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isRequired"
                    checked={categoryTemplateForm.isRequired}
                    onChange={(e) => setCategoryTemplateForm(prev => ({ ...prev, isRequired: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isRequired" className="text-sm font-medium text-gray-700">
                    Required Configuration
                  </label>
                </div>
              </div>



              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={categoryTemplateForm.isActive}
                  onChange={(e) => setCategoryTemplateForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (editingCategoryTemplate ? 'Update Assignment' : 'Assign Configuration')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationManagement;
