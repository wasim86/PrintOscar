'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  DollarSign,
  BarChart3,
  Image,
  MoreHorizontal,
  Loader2,
  Upload,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AdminProductsApi, AdminProduct, AdminProductsSearchParams, AdminProductStats } from '@/services/admin-products-api';
import { ProductForm } from './ProductForm';
import { ProductImportExport } from './ProductImportExport';
import { CategoryManagement } from './CategoryManagement';
import { DEFAULT_PRODUCT_IMAGE } from '@/services/config';

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | undefined>(undefined);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [showImportExport, setShowImportExport] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [stats, setStats] = useState<AdminProductStats | null>(null);
  const pageSize = 20;
  const [imageIndexes, setImageIndexes] = useState<Record<number, number>>({});

  // Load product statistics
  const loadStats = async () => {
    try {
      const statsResponse = await AdminProductsApi.getProductStats();
      setStats(statsResponse);
    } catch (err) {
      console.error('Error loading product stats:', err);
    }
  };

  // Load products from API
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: AdminProductsSearchParams = {
        searchTerm: searchTerm || undefined,
        status: categoryFilter !== 'all' ? categoryFilter : undefined,
        sortBy,
        sortOrder,
        page: currentPage,
        pageSize
      };

      const response = await AdminProductsApi.getProducts(params);

      if (response.success) {
        setProducts(response.products);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount and when filters change
  useEffect(() => {
    loadProducts();
  }, [searchTerm, categoryFilter, statusFilter, sortBy, sortOrder, currentPage]);

  // Load stats on component mount
  useEffect(() => {
    loadStats();
  }, []);

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'text-green-600 bg-green-50 border-green-200'
      : 'text-gray-600 bg-gray-50 border-gray-200';
  };

  // Filter products based on stock status
  const getFilteredProducts = () => {
    if (statusFilter === 'all') {
      return products;
    }

    return products.filter(product => {
      switch (statusFilter) {
        case 'in-stock':
          return product.stock > 10; // Consider > 10 as in stock
        case 'low-stock':
          return product.stock > 0 && product.stock <= 10; // 1-10 as low stock
        case 'out-of-stock':
          return product.stock === 0; // 0 as out of stock
        default:
          return true;
      }
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'text-red-600', label: 'Out of Stock' };
    if (stock < 10) return { color: 'text-yellow-600', label: 'Low Stock' };
    return { color: 'text-green-600', label: 'In Stock' };
  };

  const handleProductSelect = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    const filteredProducts = getFilteredProducts();
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await AdminProductsApi.deleteProduct(productId);
      if (response.success) {
        await loadProducts(); // Reload products
        await loadStats(); // Reload stats after deletion
      } else {
        alert(response.message || 'Failed to delete product');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handleBulkStatusUpdate = async (isActive: boolean) => {
    if (selectedProducts.length === 0) return;

    try {
      const response = await AdminProductsApi.bulkUpdateStatus({
        productIds: selectedProducts,
        isActive
      });

      if (response.success) {
        setSelectedProducts([]);
        await loadProducts(); // Reload products
        await loadStats(); // Reload stats after bulk update
      } else {
        alert('Failed to update products');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update products');
    }
  };

  const handleCreateProduct = () => {
    setFormMode('create');
    setEditingProduct(undefined);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: AdminProduct) => {
    setFormMode('edit');
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(undefined);
  };

  const handleFormSave = async () => {
    await loadProducts(); // Reload products after save
    await loadStats(); // Reload stats after save
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your product catalog and inventory</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setShowCategoryManagement(true)}
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Package className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Manage Categories</span>
            <span className="sm:hidden">Categories</span>
          </button>
          <button
            onClick={() => setShowImportExport(true)}
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Import/Export</span>
            <span className="sm:hidden">Import</span>
          </button>
          <button
            onClick={handleCreateProduct}
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.activeProducts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.lowStockProducts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.outOfStockProducts || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 placeholder-gray-500 text-sm sm:text-base"
            />
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 bg-white text-sm sm:text-base"
            >
              <option value="all" className="text-gray-900">Stock Status</option>
              <option value="in-stock" className="text-gray-900">In Stock</option>
              <option value="out-of-stock" className="text-gray-900">Out of Stock</option>
              <option value="low-stock" className="text-gray-900">Low Stock</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 bg-white text-sm sm:text-base"
            >
              <option value="all" className="text-gray-900">All Status</option>
              <option value="active" className="text-gray-900">Active</option>
              <option value="inactive" className="text-gray-900">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadProducts}
            className="mt-2 text-red-600 hover:text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {getFilteredProducts().map((product: AdminProduct) => {
            const stockStatus = getStockStatus(product.stock);
            const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
            const images = product.images || [];
            const defaultIndex = Math.max(images.findIndex(i => i.isPrimary), 0);
            const currentIndex = imageIndexes[product.id] ?? defaultIndex;
            const displayImageUrl = images.length > 0 ? (images[Math.min(Math.max(currentIndex, 0), images.length - 1)]?.imageUrl || product.imageUrl) : (product.imageUrl || DEFAULT_PRODUCT_IMAGE);

            return (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative bg-white">
                  <img
                    src={displayImageUrl}
                    alt={product.name}
                    className="w-full h-48 object-contain"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setImageIndexes(prev => ({ ...prev, [product.id]: ((currentIndex - 1 + images.length) % images.length) }))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-white/80 border border-gray-300 rounded-full hover:bg-white transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() => setImageIndexes(prev => ({ ...prev, [product.id]: ((currentIndex + 1) % images.length) }))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/80 border border-gray-300 rounded-full hover:bg-white transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                    </>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(product.isActive)}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleProductSelect(product.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">{product.categoryName}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-1 sm:space-y-0">
                    <div>
                      <span className="text-base sm:text-lg font-bold text-gray-900">${product.price}</span>
                      {product.salePrice && (
                        <span className="ml-2 text-xs sm:text-sm text-orange-600">${product.salePrice}</span>
                      )}
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${stockStatus.color}`}>
                      {product.stock} in stock
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 mb-4 space-y-1 sm:space-y-0">
                    <span>SKU: {product.sku || 'N/A'}</span>
                    <span className="hidden sm:inline">{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                        title="View Product"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} products
            </div>
            <div className="flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(window.innerWidth < 640 ? 3 : 5, totalPages) }, (_, i) => {
                  let pageNum;
                  const maxPages = window.innerWidth < 640 ? 3 : 5;
                  if (totalPages <= maxPages) {
                    pageNum = i + 1;
                  } else if (currentPage <= Math.floor(maxPages / 2) + 1) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - Math.floor(maxPages / 2)) {
                    pageNum = totalPages - maxPages + 1 + i;
                  } else {
                    pageNum = currentPage - Math.floor(maxPages / 2) + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md ${
                        currentPage === pageNum
                          ? 'bg-orange-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 sm:p-4 max-w-[calc(100vw-2rem)] sm:max-w-none">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => handleBulkStatusUpdate(true)}
                className="px-2 sm:px-3 py-1 bg-green-600 text-white rounded text-xs sm:text-sm hover:bg-green-700 transition-colors"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkStatusUpdate(false)}
                className="px-2 sm:px-3 py-1 bg-gray-600 text-white rounded text-xs sm:text-sm hover:bg-gray-700 transition-colors"
              >
                Deactivate
              </button>
              <button
                onClick={() => setSelectedProducts([])}
                className="px-2 sm:px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs sm:text-sm hover:bg-gray-400 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductForm
        product={editingProduct}
        isOpen={showProductForm}
        onClose={handleCloseForm}
        onSave={handleFormSave}
        mode={formMode}
      />

      {/* Import/Export Modal */}
      <ProductImportExport
        isOpen={showImportExport}
        onClose={() => setShowImportExport(false)}
        onSuccess={() => {
          loadProducts();
        }}
      />

      {/* Category Management Modal */}
      {showCategoryManagement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCategoryManagement(false)}
            aria-hidden="true"
          />
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col z-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">Category Management</h2>
              <button
                onClick={() => setShowCategoryManagement(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <CategoryManagement />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
