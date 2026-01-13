'use client';

import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { adminFiltersApi, FilterOption, CreateFilterOptionDto, UpdateFilterOptionDto, FilterOptionValue } from '@/services/admin-filters-api';

interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  parentId?: number;
  isActive: boolean;
  sortOrder: number;
  slug?: string;
}

interface FilterFormProps {
  filter?: FilterOption | null;
  categories: Category[];
  onSubmit: () => void;
  onCancel: () => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ filter, categories, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    categoryId: 0,
    filterType: 'select',
    minValue: undefined as number | undefined,
    maxValue: undefined as number | undefined,
    sortOrder: 0,
    isActive: true
  });
  const [filterValues, setFilterValues] = useState<Partial<FilterOptionValue>[]>([]);

  const filterTypes = [
    { value: 'select', label: 'Select (Dropdown)' },
    { value: 'checkbox', label: 'Checkbox (Multiple)' },
    { value: 'radio', label: 'Radio (Single)' },
    { value: 'range', label: 'Range (Min/Max)' },
    { value: 'color', label: 'Color' },
    { value: 'size', label: 'Size' }
  ];

  useEffect(() => {
    if (filter) {
      setFormData({
        name: filter.name,
        displayName: filter.displayName,
        description: filter.description,
        categoryId: filter.categoryId,
        filterType: filter.filterType,
        minValue: filter.minValue,
        maxValue: filter.maxValue,
        sortOrder: filter.sortOrder,
        isActive: filter.isActive
      });
      setFilterValues(filter.filterOptionValues || []);
    }
  }, [filter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'number' ? (value ? parseFloat(value) : undefined) :
              value
    }));
  };

  const handleAddValue = () => {
    setFilterValues(prev => [...prev, {
      value: '',
      displayValue: '',
      description: '',
      colorCode: formData.filterType === 'color' ? '#000000' : undefined,
      sortOrder: prev.length,
      isActive: true
    }]);
  };

  const handleRemoveValue = (index: number) => {
    setFilterValues(prev => prev.filter((_, i) => i !== index));
  };

  const handleValueChange = (index: number, field: keyof FilterOptionValue, value: any) => {
    setFilterValues(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('Filter name is required');
      return false;
    }
    if (!formData.displayName.trim()) {
      alert('Display name is required');
      return false;
    }
    if (!formData.categoryId) {
      alert('Category is required');
      return false;
    }
    if (formData.filterType === 'range') {
      if (formData.minValue === undefined || formData.maxValue === undefined) {
        alert('Min and max values are required for range filters');
        return false;
      }
      if (formData.minValue >= formData.maxValue) {
        alert('Min value must be less than max value');
        return false;
      }
    } else {
      if (filterValues.length === 0) {
        alert('At least one filter value is required');
        return false;
      }
      for (let i = 0; i < filterValues.length; i++) {
        const value = filterValues[i];
        if (!value.value?.trim()) {
          alert(`Value is required for filter option ${i + 1}`);
          return false;
        }
        if (!value.displayValue?.trim()) {
          alert(`Display value is required for filter option ${i + 1}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (filter) {
        // Update existing filter
        const updateData: UpdateFilterOptionDto = {
          ...formData,
          filterOptionValues: filterValues as FilterOptionValue[]
        };
        const response = await adminFiltersApi.updateFilterOption(filter.id, updateData);
        if (response.success) {
          alert('Filter updated successfully');
          onSubmit();
        } else {
          alert(response.message || 'Failed to update filter');
        }
      } else {
        // Create new filter
        const createData: CreateFilterOptionDto = {
          ...formData,
          filterOptionValues: filterValues as FilterOptionValue[]
        };
        const response = await adminFiltersApi.createFilterOption(createData);
        if (response.success) {
          alert('Filter created successfully');
          onSubmit();
        } else {
          alert(response.message || 'Failed to create filter');
        }
      }
    } catch (error) {
      console.error('Error saving filter:', error);
      alert('Failed to save filter');
    } finally {
      setLoading(false);
    }
  };

  const isRangeFilter = formData.filterType === 'range';
  const isColorFilter = formData.filterType === 'color';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {filter ? 'Edit Filter' : 'Create Filter'}
          </h1>
          <p className="text-gray-600">
            {filter ? 'Update filter details and options' : 'Create a new filter for products'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                placeholder="e.g., color, size, brand"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name *
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                placeholder="e.g., Color, Size, Brand"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Type *
              </label>
              <select
                name="filterType"
                value={formData.filterType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                required
              >
                {filterTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                min="0"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
              placeholder="Describe this filter..."
            />
          </div>
        </div>

        {/* Range Values (for range filters) */}
        {isRangeFilter && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Range Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Value *
                </label>
                <input
                  type="number"
                  name="minValue"
                  value={formData.minValue || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Value *
                </label>
                <input
                  type="number"
                  name="maxValue"
                  value={formData.maxValue || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Filter Values (for non-range filters) */}
        {!isRangeFilter && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filter Options</h2>
              <button
                type="button"
                onClick={handleAddValue}
                className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </button>
            </div>

            {filterValues.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No filter options added yet.</p>
                <button
                  type="button"
                  onClick={handleAddValue}
                  className="mt-2 text-orange-600 hover:text-orange-700"
                >
                  Add your first option
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filterValues.map((value, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-sm font-medium text-gray-900">Option {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => handleRemoveValue(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Value *
                        </label>
                        <input
                          type="text"
                          value={value.value || ''}
                          onChange={(e) => handleValueChange(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black "
                          placeholder="e.g., red, large, nike"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Display Value *
                        </label>
                        <input
                          type="text"
                          value={value.displayValue || ''}
                          onChange={(e) => handleValueChange(index, 'displayValue', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                          placeholder="e.g., Red, Large, Nike"
                          required
                        />
                      </div>

                      {isColorFilter && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Color Code
                          </label>
                          <input
                            type="color"
                            value={value.colorCode || '#000000'}
                            onChange={(e) => handleValueChange(index, 'colorCode', e.target.value)}
                            className="w-full h-10 border border-gray-300 rounded-lg"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Sort Order
                        </label>
                        <input
                          type="number"
                          value={value.sortOrder || 0}
                          onChange={(e) => handleValueChange(index, 'sortOrder', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={value.description || ''}
                        onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                        placeholder="Optional description"
                      />
                    </div>

                    <div className="mt-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={value.isActive !== false}
                          onChange={(e) => handleValueChange(index, 'isActive', e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-xs font-medium text-gray-700">Active</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {filter ? 'Update Filter' : 'Create Filter'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterForm;
