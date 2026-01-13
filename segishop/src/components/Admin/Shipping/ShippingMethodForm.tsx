'use client';

import React, { useState, useEffect } from 'react';
import { X, Truck, Settings, AlertCircle, Loader2 } from 'lucide-react';
import { AdminShippingMethod, CreateShippingMethod, UpdateShippingMethod } from '@/services/admin-shipping-api';

interface ShippingMethodFormProps {
  method?: AdminShippingMethod;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface FormData {
  name: string;
  methodType: string;
  description: string;
  isEnabled: boolean;
  isTaxable: boolean;
}

const methodTypes = [
  { value: 'FlatRate', label: 'Flat Rate', description: 'Fixed shipping cost' },
  { value: 'FreeShipping', label: 'Free Shipping', description: 'No shipping cost' },
  { value: 'LocalPickup', label: 'Local Pickup', description: 'Customer pickup' },
  { value: 'Express', label: 'Express Shipping', description: 'Fast delivery' },
  { value: 'Standard', label: 'Standard Shipping', description: 'Regular delivery' }
];

export function ShippingMethodForm({ method, isOpen, onClose, onSave }: ShippingMethodFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    methodType: 'FlatRate',
    description: '',
    isEnabled: true,
    isTaxable: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (method) {
      setFormData({
        name: method.name,
        methodType: method.methodType,
        description: method.description || '',
        isEnabled: method.isEnabled,
        isTaxable: method.isTaxable
      });
    } else {
      setFormData({
        name: '',
        methodType: 'FlatRate',
        description: '',
        isEnabled: true,
        isTaxable: true
      });
    }
    setError(null);
  }, [method, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { AdminShippingApi } = await import('@/services/admin-shipping-api');
      
      if (method) {
        // Update existing method
        const updateData: UpdateShippingMethod = {
          name: formData.name,
          methodType: formData.methodType,
          description: formData.description,
          isEnabled: formData.isEnabled,
          isTaxable: formData.isTaxable
        };
        
        const response = await AdminShippingApi.updateMethod(method.id, updateData);
        if (response.success) {
          onSave();
          onClose();
        } else {
          setError(response.message || 'Failed to update shipping method');
        }
      } else {
        // Create new method
        const createData: CreateShippingMethod = {
          name: formData.name,
          methodType: formData.methodType,
          description: formData.description,
          isEnabled: formData.isEnabled,
          isTaxable: formData.isTaxable
        };
        
        const response = await AdminShippingApi.createMethod(createData);
        if (response.success) {
          onSave();
          onClose();
        } else {
          setError(response.message || 'Failed to create shipping method');
        }
      }
    } catch (error) {
      console.error('Error saving shipping method:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
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
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden mx-auto z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Truck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {method ? 'Edit Shipping Method' : 'Add Shipping Method'}
              </h2>
              <p className="text-sm text-gray-500">
                {method ? 'Update shipping method details' : 'Create a new shipping method'}
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
            {/* Method Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Method Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                placeholder="e.g., Standard Shipping"
                required
              />
            </div>

            {/* Method Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Method Type *
              </label>
              <select
                value={formData.methodType}
                onChange={(e) => setFormData({ ...formData, methodType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                required
              >
                {methodTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black resize-none"
                placeholder="Describe this shipping method"
              />
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isEnabled"
                  checked={formData.isEnabled}
                  onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isEnabled" className="ml-2 block text-sm text-gray-700">
                  Enable this method
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isTaxable"
                  checked={formData.isTaxable}
                  onChange={(e) => setFormData({ ...formData, isTaxable: e.target.checked })}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isTaxable" className="ml-2 block text-sm text-gray-700">
                  Apply tax to shipping
                </label>
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
            disabled={loading || !formData.name.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {method ? 'Update Method' : 'Create Method'}
          </button>
        </div>
      </div>
    </div>
  );
}
