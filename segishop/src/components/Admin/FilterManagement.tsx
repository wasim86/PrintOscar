'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, ToggleLeft, ToggleRight, Lock, AlertCircle } from 'lucide-react';
import { adminFiltersApi, FilterOption, FilterOptionsParams } from '@/services/admin-filters-api';
import { categoriesApi } from '@/services/api';

import FilterForm from './FilterForm';

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

const FilterManagement: React.FC = () => {
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFilter, setEditingFilter] = useState<FilterOption | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    loadCategories();
    loadFilters();
  }, [currentPage, selectedCategory, showActiveOnly]);

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getCategories();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      alert('Failed to load categories');
    }
  };

  const loadFilters = async () => {
    try {
      setLoading(true);
      const params: FilterOptionsParams = {
        page: currentPage,
        pageSize,
        isActive: showActiveOnly ? true : undefined,
        categoryId: selectedCategory || undefined
      };

      const response = await adminFiltersApi.getFilterOptions(params);
      if (response.success) {
        setFilters(response.filterOptions);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
      } else {
        alert(response.message || 'Failed to load filters');
      }
    } catch (error) {
      console.error('Error loading filters:', error);
      alert('Failed to load filters');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFilter = () => {
    setEditingFilter(null);
    setShowForm(true);
  };

  const handleEditFilter = (filter: FilterOption) => {
    setEditingFilter(filter);
    setShowForm(true);
  };

  const handleDeleteFilter = async (filter: FilterOption) => {
    // Check if filter can be deleted
    if (!filter.canDelete) {
      alert(`Cannot delete this filter because it is currently being used by ${filter.productCount} product${filter.productCount === 1 ? '' : 's'}. Please remove the filter from all products first.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete the filter "${filter.displayName}"?`)) {
      return;
    }

    try {
      const response = await adminFiltersApi.deleteFilterOption(filter.id);
      if (response.success) {
        alert('Filter deleted successfully');
        loadFilters();
      } else {
        alert(response.message || 'Failed to delete filter');
      }
    } catch (error) {
      console.error('Error deleting filter:', error);
      alert('Failed to delete filter');
    }
  };

  const handleToggleStatus = async (filter: FilterOption) => {
    try {
      const response = await adminFiltersApi.toggleFilterOptionStatus(filter.id);
      if (response.success) {
        alert(response.message || 'Filter status updated');
        loadFilters();
      } else {
        alert(response.message || 'Failed to update filter status');
      }
    } catch (error) {
      console.error('Error toggling filter status:', error);
      alert('Failed to update filter status');
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingFilter(null);
    loadFilters();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingFilter(null);
  };

  const filteredFilters = filters.filter(filter =>
    filter.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filter.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  if (showForm) {
    return (
      <FilterForm
        filter={editingFilter}
        categories={categories}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Filter Management</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">Manage product filters and filter options</p>
        </div>
        <button
          onClick={handleCreateFilter}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Filter
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search filters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
            />
          </div>

          {/* Category Filter */}
          <div className="md:w-48">
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Active only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Showing {filteredFilters.length} of {totalCount} filters
          {selectedCategory && ` in ${getCategoryName(selectedCategory)}`}
        </span>
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Filters Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading filters...</p>
          </div>
        ) : filteredFilters.length === 0 ? (
          <div className="p-8 text-center">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No filters found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory
                ? 'No filters match your current filters.'
                : 'Get started by creating your first filter.'}
            </p>
            <button
              onClick={handleCreateFilter}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Create Filter
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Filter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Values
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFilters.map((filter) => (
                  <tr key={filter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {filter.displayName}
                        </div>
                        <div className="text-sm text-gray-500">{filter.name}</div>
                        {filter.description && (
                          <div className="text-xs text-gray-400 mt-1">
                            {filter.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{filter.categoryName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {filter.filterType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {filter.filterOptionValues.length} values
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {filter.productCount > 0 && (
                          <div title="Filter is in use - cannot be deleted">
                            <Lock className="w-3 h-3 text-amber-500 mr-1" />
                          </div>
                        )}
                        <span className={`text-sm font-medium ${
                          filter.productCount > 0 ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {filter.productCount}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          {filter.productCount === 1 ? 'product' : 'products'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(filter)}
                        className={`inline-flex items-center ${
                          filter.isActive ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {filter.isActive ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                        <span className="ml-1 text-sm">
                          {filter.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditFilter(filter)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Edit filter"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFilter(filter)}
                          disabled={!filter.canDelete}
                          className={`${
                            filter.canDelete
                              ? 'text-red-600 hover:text-red-900'
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                          title={
                            filter.canDelete
                              ? 'Delete filter'
                              : `Cannot delete - filter is used by ${filter.productCount} product${filter.productCount === 1 ? '' : 's'}`
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-black"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm border rounded-lg ${
                  currentPage === page
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'border-gray-300 hover:bg-gray-50 text-black'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-black"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterManagement;
