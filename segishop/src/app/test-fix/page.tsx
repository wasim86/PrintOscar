'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { useProducts } from '@/hooks/useProducts';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function TestFixPage() {
  const {
    products,
    categories,
    loading,
    error,
    totalCount,
    searchProducts,
    clearError,
  } = useProducts();

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const runTest = async () => {
    setTestStatus('testing');
    setTestMessage('Testing search products API...');

    try {
      clearError();

      await searchProducts({
        page: 1,
        pageSize: 5
      });
    } catch (err) {
      setTestStatus('error');
      setTestMessage(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Auto-run test on mount
  useEffect(() => {
    runTest();
  }, []);

  useEffect(() => {
    if (testStatus !== 'testing') return;
    if (loading) return;

    if (error) {
      setTestStatus('error');
      setTestMessage(`❌ Error: ${error}`);
      return;
    }

    if (products.length > 0) {
      setTestStatus('success');
      setTestMessage(`✅ Success! Loaded ${products.length} products`);
    } else {
      setTestStatus('error');
      setTestMessage('❌ No products loaded');
    }
  }, [products, error, loading, testStatus]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search API Fix Test</h1>
          <p className="text-gray-600">
            Testing the fixed search products API to verify it's working correctly.
          </p>
        </div>

        {/* Test Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Status</h2>
          
          <div className="flex items-center space-x-3 mb-4">
            {testStatus === 'testing' && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
            {testStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {testStatus === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
            
            <span className={`font-medium ${
              testStatus === 'testing' ? 'text-blue-600' :
              testStatus === 'success' ? 'text-green-600' :
              testStatus === 'error' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {testMessage}
            </span>
          </div>

          <button
            onClick={runTest}
            disabled={testStatus === 'testing'}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {testStatus === 'testing' ? 'Testing...' : 'Run Test Again'}
          </button>
        </div>

        {/* Hook State */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hook State</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Loading:</span>
              <span className={`ml-2 ${loading ? 'text-blue-600' : 'text-gray-600'}`}>
                {loading ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Error:</span>
              <span className={`ml-2 ${error ? 'text-red-600' : 'text-green-600'}`}>
                {error || 'None'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Products:</span>
              <span className="ml-2 text-gray-600">{products.length}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Total:</span>
              <span className="ml-2 text-gray-600">{totalCount}</span>
            </div>
          </div>
        </div>

        {/* Error Details */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-red-900 mb-4">Error Details</h2>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Products Preview */}
        {products.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Products Preview ({products.length} loaded)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {products.length > 6 && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                Showing first 6 of {products.length} products
              </p>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">What This Test Does</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Tests the useProducts hook with error handling</li>
            <li>Calls searchProducts() with basic parameters</li>
            <li>Verifies the API response is processed correctly</li>
            <li>Shows product conversion and display</li>
            <li>Displays any errors that occur during the process</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
