'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { API_BASE_URL } from '@/services/config';

export default function ApiTestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testDirectFetch = async () => {
    setLoading(true);
    try {
      console.log('Testing direct fetch...');
      
      const response = await fetch(`${API_BASE_URL}/products/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Fetch error:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testApiService = async () => {
    setLoading(true);
    try {
      console.log('Testing API service...');
      
      // Import the API service dynamically
      const api = (await import('@/services/api')).default;

      const response = await api.getCategories();
      console.log('API service response:', response);
      
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('API service error:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testProductsSearch = async () => {
    setLoading(true);
    try {
      console.log('Testing products search...');
      
      // Import the API service dynamically
      const api = (await import('@/services/api')).default;
      
      const response = await api.searchProducts({
        page: 1,
        pageSize: 5
      });
      console.log('Products search response:', response);
      
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('Products search error:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Connection Test</h1>
          <p className="text-gray-600">
            Test different ways of calling the API to debug connection issues.
          </p>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Methods</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={testDirectFetch}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Test Direct Fetch
            </button>
            <button
              onClick={testApiService}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              Test API Service
            </button>
            <button
              onClick={testProductsSearch}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
            >
              Test Products Search
            </button>
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Environment Info</h2>
          <div className="space-y-2 text-sm">
            <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'https://api.printoscar.com/api'}</p>
            <p><strong>Node Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {loading ? 'Loading...' : 'Results'}
            </h2>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96 whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
