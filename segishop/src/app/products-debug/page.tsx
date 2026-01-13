'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { productsApi } from '@/services/api';
import { Loader2, AlertCircle } from 'lucide-react';

export default function ProductsDebugPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);

  const testBasicAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Testing basic products API...');
      
      // Test basic search
      const response = await productsApi.searchProducts({
        page: 1,
        pageSize: 10
      });
      
      console.log('API Response:', response);
      setApiResponse(response);
      
      if (response.success && response.data) {
        setProducts(response.data.products || []);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testCategoriesAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Testing categories API...');
      
      const response = await productsApi.getCategories();
      
      console.log('Categories Response:', response);
      
      if (response.success && response.categories) {
        setCategories(response.categories);
      } else {
        throw new Error('Categories API returned unsuccessful response');
      }
    } catch (err) {
      console.error('Categories API Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testBasicAPI();
    testCategoriesAPI();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products API Debug</h1>
          <p className="text-gray-600">
            Debug page to test the products API connection and response.
          </p>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Status</h2>
          
          {loading && (
            <div className="flex items-center text-blue-600">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span>Testing API...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>Error: {error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="text-green-600">
              ✅ API connection successful
            </div>
          )}

          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p><strong>Products loaded:</strong> {products.length}</p>
            <p><strong>Categories loaded:</strong> {categories.length}</p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Actions</h2>
          <div className="flex space-x-4">
            <button
              onClick={testBasicAPI}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Test Products API
            </button>
            <button
              onClick={testCategoriesAPI}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              Test Categories API
            </button>
          </div>
        </div>

        {/* Raw API Response */}
        {apiResponse && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Raw API Response</h2>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}

        {/* Categories Display */}
        {categories.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories ({categories.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">ID: {category.id}</p>
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  )}
                  {category.children && category.children.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Subcategories:</p>
                      <ul className="text-xs text-gray-600 ml-4">
                        {category.children.map((child: any) => (
                          <li key={child.id}>• {child.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Display */}
        {products.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Products ({products.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">ID: {product.id}</p>
                  <p className="text-sm text-gray-600">Price: ${product.price}</p>
                  <p className="text-sm text-gray-600">Category: {product.categoryName}</p>
                  <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                  {product.description && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{product.description}</p>
                  )}
                </div>
              ))}
            </div>
            {products.length > 6 && (
              <p className="text-sm text-gray-500 mt-4">
                Showing first 6 of {products.length} products
              </p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
