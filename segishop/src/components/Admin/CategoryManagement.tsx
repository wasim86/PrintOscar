'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Edit,
  Trash2,
  Folder,
  FolderOpen,
  Package,
  Eye,
  EyeOff,
  Save,
  X,
  Loader2,
  AlertCircle,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { categoriesApi } from '@/services/api';

interface Category {
  id: number;
  name: string;
  description: string;
  parentId?: number;
  parentName?: string;
  isActive: boolean;
  sortOrder: number;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  productCount: number;
  childrenCount: number;
  children: Category[];
}

interface CategoryFormData {
  name: string;
  description: string;
  parentId?: number;
  isActive: boolean;
  sortOrder: number;
  slug: string;
  metaTitle: string;
  metaDescription: string;
}

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    parentId: undefined,
    isActive: true,
    sortOrder: 0,
    slug: '',
    metaTitle: '',
    metaDescription: ''
  });
  const [saving, setSaving] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  // Reload categories when showInactive changes
  useEffect(() => {
    loadCategories();
  }, [showInactive]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      // Load categories based on showInactive state
      // When showInactive is true, don't pass isActive parameter to get all categories
      // When showInactive is false, pass isActive: true to get only active categories
      const params = showInactive ? {} : { isActive: true };
      const response = await categoriesApi.admin.getCategories(params);
      if (response.success) {
        setCategories(response.categories || []);
      } else {
        setError('Failed to load categories');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      parentId: undefined,
      isActive: true,
      sortOrder: 0,
      slug: '',
      metaTitle: '',
      metaDescription: ''
    });
    setIsSlugManuallyEdited(false);
    setShowForm(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      parentId: category.parentId,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      slug: category.slug || '',
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || ''
    });
    setIsSlugManuallyEdited(!!category.slug); // If category has a slug, consider it manually edited
    setShowForm(true);
  };

  const handleDelete = async (category: Category) => {
    // Check if category can be deleted
    if (category.productCount > 0) {
      alert(`Cannot delete "${category.name}" because it contains ${category.productCount} products. Please move or remove products first.`);
      return;
    }

    if (category.childrenCount > 0) {
      alert(`Cannot delete "${category.name}" because it has ${category.childrenCount} subcategories. Please delete subcategories first.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await categoriesApi.admin.deleteCategory(category.id);
      if (response.success) {
        await loadCategories();
        alert(`Category "${category.name}" deleted successfully!`);
      } else {
        setError(response.message || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Delete category error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);

      if (editingCategory) {
        // Update existing category
        const response = await categoriesApi.admin.updateCategory(editingCategory.id, formData);
        if (response.success) {
          setShowForm(false);
          await loadCategories();
        } else {
          setError(response.message || 'Failed to update category');
        }
      } else {
        // Create new category
        const response = await categoriesApi.admin.createCategory(formData);
        if (response.success) {
          setShowForm(false);
          await loadCategories();
        } else {
          setError(response.message || 'Failed to create category');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleReactivate = async (category: Category) => {
    if (!confirm(`Are you sure you want to reactivate "${category.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await categoriesApi.admin.reactivateCategory(category.id);
      if (response.success) {
        await loadCategories();
        alert(`Category "${category.name}" reactivated successfully!`);
      } else {
        setError(response.message || 'Failed to reactivate category');
      }
    } catch (err) {
      console.error('Reactivate category error:', err);
      setError(err instanceof Error ? err.message : 'Failed to reactivate category');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      // Only auto-generate slug if it hasn't been manually edited
      slug: isSlugManuallyEdited ? prev.slug : generateSlug(name),
      metaTitle: prev.metaTitle || name
    }));
  };

  const handleSlugChange = (slug: string) => {
    setFormData(prev => ({
      ...prev,
      slug
    }));
    // Mark slug as manually edited if user types anything
    setIsSlugManuallyEdited(true);
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div key={category.id}>
        <div
          className={`flex items-center justify-between p-3 border rounded-lg mb-2 transition-colors ${
            category.isActive
              ? 'border-gray-200 hover:bg-gray-50'
              : 'border-red-200 bg-red-50 opacity-75'
          }`}
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="flex items-center space-x-3">
            {hasChildren ? (
              <button
                onClick={() => toggleExpanded(category.id)}
                className="p-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 hover:bg-gray-200 transition-colors"
                aria-label={isExpanded ? 'Collapse subcategories' : 'Expand subcategories'}
              >
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-orange-600" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-orange-600" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            
            {hasChildren ? (
              isExpanded ? <FolderOpen className="h-5 w-5 text-blue-600" /> : <Folder className="h-5 w-5 text-blue-600" />
            ) : (
              <Package className="h-5 w-5 text-gray-600" />
            )}
            
            <div>
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${category.isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                  {category.name}
                </span>
                {!category.isActive && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Inactive
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {category.productCount} products • {category.childrenCount} subcategories
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {category.isActive ? (
              <>
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Category"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className={`p-2 rounded-lg transition-colors ${
                    category.productCount > 0 || category.childrenCount > 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                  title={
                    category.productCount > 0
                      ? `Cannot delete: ${category.productCount} products`
                      : category.childrenCount > 0
                      ? `Cannot delete: ${category.childrenCount} subcategories`
                      : 'Delete Category'
                  }
                  disabled={category.productCount > 0 || category.childrenCount > 0}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleReactivate(category)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Reactivate Category"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const flattenCategories = (categories: Category[]): Category[] => {
    const flattened: Category[] = [];

    const flatten = (cats: Category[], level: number = 0) => {
      cats.forEach(cat => {
        // Use proper indentation with dashes and non-breaking spaces for better visibility
        const prefix = level === 0 ? '' : '\u00A0\u00A0'.repeat(level) + '├─ ';
        flattened.push({ ...cat, name: `${prefix}${cat.name}` });
        if (cat.children && cat.children.length > 0) {
          flatten(cat.children, level + 1);
        }
      });
    };

    flatten(categories);
    return flattened;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        <span className="ml-2 text-gray-600">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
          <p className="text-gray-600 mt-1">Manage product categories and subcategories</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Show Inactive Toggle */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">Show inactive categories</span>
          </label>

          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-700">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first category.</p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </button>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {categories.map(category => renderCategory(category))}
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
            aria-hidden="true"
          />
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden z-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Category
                  </label>
                  <select
                    value={formData.parentId || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value ? parseInt(e.target.value) : undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  >
                    <option value="">No Parent (Root Category)</option>
                    {flattenCategories(categories)
                      .filter(cat => !editingCategory || cat.id !== editingCategory.id)
                      .map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>



              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                      placeholder="URL-friendly version of the name"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  />
                </div>
              </div>



              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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
                      <span>{editingCategory ? 'Update' : 'Create'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
