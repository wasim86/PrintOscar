'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.segishop.com/api';

export default function TestSearchPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testSearchAPI = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('=== Testing Search API ===');
      
      // Test 1: Direct fetch
      console.log('1. Testing direct fetch...');
      const directResponse = await fetch(`${API_BASE_URL}/products/search?page=1&pageSize=5`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Direct response status:', directResponse.status);
      
      if (!directResponse.ok) {
        throw new Error(`Direct fetch failed: ${directResponse.status}`);
      }

      const directData = await directResponse.json();
      console.log('Direct response data:', directData);
      
      setResult(prev => prev + '=== DIRECT FETCH SUCCESS ===\n' + JSON.stringify(directData, null, 2) + '\n\n');

      // Test 2: Using API service
      console.log('2. Testing API service...');
      const api = (await import('@/services/api')).default;
      
      const apiResponse = await api.searchProducts({
        page: 1,
        pageSize: 5
      });
      
      console.log('API service response:', apiResponse);
      
      setResult(prev => prev + '=== API SERVICE SUCCESS ===\n' + JSON.stringify(apiResponse, null, 2) + '\n\n');

      // Test 3: Using useProducts hook logic
      console.log('3. Testing hook logic...');
      const { convertApiProductToFrontend } = await import('@/types/api');
      
      if (apiResponse && apiResponse.success && apiResponse.data) {
        const { data } = apiResponse;
        console.log('Hook processing data:', data);
        
        if (data.products && Array.isArray(data.products)) {
          const frontendProducts = data.products.map(convertApiProductToFrontend);
          console.log('Converted products:', frontendProducts);
          
          setResult(prev => prev + '=== HOOK LOGIC SUCCESS ===\n' + 
            `Total products: ${frontendProducts.length}\n` +
            `First product: ${JSON.stringify(frontendProducts[0], null, 2)}\n\n`);
        } else {
          throw new Error('No products array in response');
        }
      } else {
        throw new Error('Invalid API response format');
      }

    } catch (error) {
      console.error('Test failed:', error);
      setResult(prev => prev + '=== ERROR ===\n' + (error instanceof Error ? error.message : 'Unknown error') + '\n' + 
        (error instanceof Error ? error.stack : '') + '\n\n');
    } finally {
      setLoading(false);
    }
  };

  const testWithParams = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('=== Testing Search API with Parameters ===');
      
      const { productsApi } = await import('@/services/api');
      
      const params = {
        searchTerm: 'bag',
        categoryId: 2,
        page: 1,
        pageSize: 10,
        sortBy: 'name',
        sortOrder: 'asc'
      };
      
      console.log('Testing with params:', params);
      
      const response = await productsApi.searchProducts(params);
      
      console.log('Response:', response);
      
      setResult('=== SEARCH WITH PARAMS ===\n' + JSON.stringify(response, null, 2));

    } catch (error) {
      console.error('Parameterized test failed:', error);
      setResult('=== ERROR ===\n' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search API Test</h1>
          <p className="text-gray-600">
            Isolated test for the search products API to debug the issue.
          </p>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Actions</h2>
          <div className="flex space-x-4">
            <button
              onClick={testSearchAPI}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Basic Search'}
            </button>
            <button
              onClick={testWithParams}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Search with Params'}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96 whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Instructions</h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-1">
            <li>Open browser developer tools (F12)</li>
            <li>Go to Console tab</li>
            <li>Click "Test Basic Search" button</li>
            <li>Check console output and results below</li>
            <li>If basic test works, try "Test Search with Params"</li>
          </ol>
        </div>
      </main>

      <Footer />
    </div>
  );
}
