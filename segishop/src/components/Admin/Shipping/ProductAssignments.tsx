'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import {
  AdminShippingApi,
  ShippingClassProduct,
  ShippingClassProductsResponse
} from '@/services/admin-shipping-api';

interface ProductAssignmentsProps {
  classId: number;
  className: string;
  onProductCountChange?: (count: number) => void;
}

interface ProductAssignmentsState {
  assignedProducts: ShippingClassProduct[];
  unassignedProducts: ShippingClassProduct[];
  assignedLoading: boolean;
  unassignedLoading: boolean;
  assignedPage: number;
  unassignedPage: number;
  assignedTotalPages: number;
  unassignedTotalPages: number;
  assignedTotalCount: number;
  unassignedTotalCount: number;
  selectedProducts: Set<number>;
  searchTerm: string;
  error: string | null;
  success: string | null;
  processing: boolean;
}

export const ProductAssignments: React.FC<ProductAssignmentsProps> = ({
  classId,
  className,
  onProductCountChange
}) => {
  const [state, setState] = useState<ProductAssignmentsState>({
    assignedProducts: [],
    unassignedProducts: [],
    assignedLoading: false,
    unassignedLoading: false,
    assignedPage: 1,
    unassignedPage: 1,
    assignedTotalPages: 1,
    unassignedTotalPages: 1,
    assignedTotalCount: 0,
    unassignedTotalCount: 0,
    selectedProducts: new Set(),
    searchTerm: '',
    error: null,
    success: null,
    processing: false
  });

  const pageSize = 10;

  // Load assigned products
  const loadAssignedProducts = async (page: number = 1) => {
    setState(prev => ({ ...prev, assignedLoading: true, error: null }));
    
    try {
      const response = await AdminShippingApi.getClassProducts(classId, page, pageSize);
      setState(prev => ({
        ...prev,
        assignedProducts: response.products,
        assignedPage: response.page,
        assignedTotalPages: response.totalPages,
        assignedTotalCount: response.totalCount,
        assignedLoading: false
      }));
      
      if (onProductCountChange) {
        onProductCountChange(response.totalCount);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        assignedLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load assigned products'
      }));
    }
  };

  // Load unassigned products
  const loadUnassignedProducts = async (page: number = 1, search: string = '') => {
    setState(prev => ({ ...prev, unassignedLoading: true, error: null }));
    
    try {
      const response = await AdminShippingApi.getUnassignedProducts(page, pageSize, search || undefined);
      setState(prev => ({
        ...prev,
        unassignedProducts: response.products,
        unassignedPage: response.page,
        unassignedTotalPages: response.totalPages,
        unassignedTotalCount: response.totalCount,
        unassignedLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        unassignedLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load unassigned products'
      }));
    }
  };

  // Initial load
  useEffect(() => {
    loadAssignedProducts();
    loadUnassignedProducts();
  }, [classId]);

  // Search handler
  const handleSearch = (term: string) => {
    setState(prev => ({ ...prev, searchTerm: term, unassignedPage: 1 }));
    loadUnassignedProducts(1, term);
  };

  // Product selection
  const toggleProductSelection = (productId: number) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedProducts);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      return { ...prev, selectedProducts: newSelected };
    });
  };

  // Assign selected products
  const assignProducts = async () => {
    if (state.selectedProducts.size === 0) return;

    setState(prev => ({ ...prev, processing: true, error: null, success: null }));

    try {
      await AdminShippingApi.assignProductsToClass(classId, {
        productIds: Array.from(state.selectedProducts)
      });

      setState(prev => ({
        ...prev,
        processing: false,
        selectedProducts: new Set(),
        success: `Successfully assigned ${state.selectedProducts.size} products to ${className}`
      }));

      // Reload both lists
      loadAssignedProducts(state.assignedPage);
      loadUnassignedProducts(state.unassignedPage, state.searchTerm);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, success: null }));
      }, 3000);
    } catch (error) {
      setState(prev => ({
        ...prev,
        processing: false,
        error: error instanceof Error ? error.message : 'Failed to assign products'
      }));
    }
  };

  // Remove selected products
  const removeProducts = async () => {
    if (state.selectedProducts.size === 0) return;

    setState(prev => ({ ...prev, processing: true, error: null, success: null }));

    try {
      await AdminShippingApi.removeProductsFromClass(classId, {
        productIds: Array.from(state.selectedProducts)
      });

      setState(prev => ({
        ...prev,
        processing: false,
        selectedProducts: new Set(),
        success: `Successfully removed ${state.selectedProducts.size} products from ${className}`
      }));

      // Reload both lists
      loadAssignedProducts(state.assignedPage);
      loadUnassignedProducts(state.unassignedPage, state.searchTerm);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, success: null }));
      }, 3000);
    } catch (error) {
      setState(prev => ({
        ...prev,
        processing: false,
        error: error instanceof Error ? error.message : 'Failed to remove products'
      }));
    }
  };

  // Product card component
  const ProductCard: React.FC<{
    product: ShippingClassProduct;
    isSelected: boolean;
    onToggle: () => void;
  }> = ({ product, isSelected, onToggle }) => (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="w-4 h-4 text-blue-600"
          onClick={(e) => e.stopPropagation()}
        />
        
        <img
          src={product.imageUrl || '/placeholder-product.svg'}
          alt={product.name}
          className="w-12 h-12 object-cover rounded"
        />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
          <p className="text-sm text-gray-500">{product.categoryName}</p>
          <div className="flex items-center space-x-4 mt-1">
            {product.sku && (
              <span className="text-xs text-gray-400">SKU: {product.sku}</span>
            )}
            <span className="text-sm font-medium text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              product.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {product.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700">{state.error}</span>
          <button
            onClick={() => setState(prev => ({ ...prev, error: null }))}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {state.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-green-700">{state.success}</span>
          <button
            onClick={() => setState(prev => ({ ...prev, success: null }))}
            className="ml-auto text-green-600 hover:text-green-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Action Buttons */}
      {state.selectedProducts.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-700 font-medium">
              {state.selectedProducts.size} product(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={assignProducts}
                disabled={state.processing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {state.processing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Assign to {className}</span>
              </button>
              <button
                onClick={removeProducts}
                disabled={state.processing}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {state.processing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Minus className="w-4 h-4" />
                )}
                <span>Remove from {className}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Products */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Assigned Products ({state.assignedTotalCount})</span>
            </h3>
          </div>

          {state.assignedLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : state.assignedProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No products assigned to this shipping class</p>
            </div>
          ) : (
            <div className="space-y-3">
              {state.assignedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={state.selectedProducts.has(product.id)}
                  onToggle={() => toggleProductSelection(product.id)}
                />
              ))}
            </div>
          )}

          {/* Assigned Products Pagination */}
          {state.assignedTotalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                Page {state.assignedPage} of {state.assignedTotalPages}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => loadAssignedProducts(state.assignedPage - 1)}
                  disabled={state.assignedPage === 1 || state.assignedLoading}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => loadAssignedProducts(state.assignedPage + 1)}
                  disabled={state.assignedPage === state.assignedTotalPages || state.assignedLoading}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Unassigned Products */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Available Products ({state.unassignedTotalCount})</span>
            </h3>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={state.searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>

          {state.unassignedLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : state.unassignedProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>
                {state.searchTerm
                  ? `No products found matching "${state.searchTerm}"`
                  : 'All products are assigned to shipping classes'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {state.unassignedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={state.selectedProducts.has(product.id)}
                  onToggle={() => toggleProductSelection(product.id)}
                />
              ))}
            </div>
          )}

          {/* Unassigned Products Pagination */}
          {state.unassignedTotalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                Page {state.unassignedPage} of {state.unassignedTotalPages}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const newPage = state.unassignedPage - 1;
                    setState(prev => ({ ...prev, unassignedPage: newPage }));
                    loadUnassignedProducts(newPage, state.searchTerm);
                  }}
                  disabled={state.unassignedPage === 1 || state.unassignedLoading}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-black"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const newPage = state.unassignedPage + 1;
                    setState(prev => ({ ...prev, unassignedPage: newPage }));
                    loadUnassignedProducts(newPage, state.searchTerm);
                  }}
                  disabled={state.unassignedPage === state.unassignedTotalPages || state.unassignedLoading}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-black"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
