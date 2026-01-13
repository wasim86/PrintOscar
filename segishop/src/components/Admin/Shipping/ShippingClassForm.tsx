'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, Settings, AlertCircle, Loader2 } from 'lucide-react';
import { AdminShippingClass, CreateShippingClass, UpdateShippingClass } from '@/services/admin-shipping-api';

interface ShippingClassFormProps {
  shippingClass?: AdminShippingClass;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
}

export function ShippingClassForm({ shippingClass, isOpen, onClose, onSave }: ShippingClassFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shippingClass) {
      setFormData({
        name: shippingClass.name,
        slug: shippingClass.slug,
        description: shippingClass.description || ''
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: ''
      });
    }
    setError(null);
  }, [shippingClass, isOpen]);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name)
    }));
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { AdminShippingApi } = await import('@/services/admin-shipping-api');
      
      if (shippingClass) {
        // Update existing class
        const updateData: UpdateShippingClass = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description
        };
        
        const response = await AdminShippingApi.updateClass(shippingClass.id, updateData);
        if (response.success) {
          onSave();
          onClose();
        } else {
          setError(response.message || 'Failed to update shipping class');
        }
      } else {
        // Create new class
        const createData: CreateShippingClass = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description
        };
        
        const response = await AdminShippingApi.createClass(createData);
        if (response.success) {
          onSave();
          onClose();
        } else {
          setError(response.message || 'Failed to create shipping class');
        }
      }
    } catch (error) {
      console.error('Error saving shipping class:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {shippingClass ? 'Edit Shipping Class' : 'Add Shipping Class'}
              </h2>
              <p className="text-sm text-gray-500">
                {shippingClass ? 'Update shipping class details' : 'Create a new shipping class for products'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Class Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                placeholder="e.g., Heavy Items"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                A descriptive name for this shipping class
              </p>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                placeholder="e.g., heavy-items"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                URL-friendly identifier (auto-generated from name)
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black resize-none"
                placeholder="Describe what types of products belong to this shipping class and any special shipping considerations..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional description to help identify when to use this class
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Settings className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">About Shipping Classes</h4>
                  <p className="text-sm text-blue-700">
                    Shipping classes allow you to group products with similar shipping requirements. 
                    You can then set different shipping costs for each class in different zones.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.name.trim() || !formData.slug.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {shippingClass ? 'Update Class' : 'Create Class'}
          </button>
        </div>
      </div>
    </div>
  );
}
