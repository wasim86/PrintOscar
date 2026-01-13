'use client';

import React, { useState } from 'react';
import { QuickViewModal } from '@/components/Product/QuickViewModal';

// Mock product data for testing
const mockProduct = {
  id: '1',
  title: 'Test Product',
  name: 'Test Product',
  description: 'This is a test product for Quick View functionality testing.',
  longDescription: 'This is a longer description of the test product that provides more detailed information about the product features and benefits.',
  price: 29.99,
  salePrice: 24.99,
  originalPrice: 29.99,
  stock: 15,
  stockCount: 15,
  image: '/placeholder-product.svg',
  images: [
    { imageUrl: '/placeholder-product.svg' },
    { imageUrl: '/placeholder-product.svg' }
  ],
  imageGallery: JSON.stringify([
    '/placeholder-product.svg',
    '/placeholder-product.svg'
  ]),
  isFeatured: true,
  category: 'Test Category',
  categoryConfigurationType: 'Regular',
  hasActiveConfigurations: false,
  slug: 'test-product',
  attributes: [
    { name: 'Weight', value: '1.5 lbs' },
    { name: 'Dimensions', value: '10 x 8 x 2 inches' },
    { name: 'Material', value: 'Premium Quality' }
  ]
};

export default function TestQuickViewPage() {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleOpenQuickView = () => {
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Quick View Modal Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Test the Quick View Functionality
          </h2>
          
          <p className="text-gray-600 mb-6">
            Click the button below to test the Quick View modal with mock product data.
          </p>
          
          <button
            onClick={handleOpenQuickView}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Open Quick View Modal
          </button>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Features to Test:</h3>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Modal opens and closes smoothly</li>
              <li>• <strong>Image Magnifier:</strong> Hover over image to see magnified view</li>
              <li>• <strong>Zoom Controls:</strong> Use zoom in/out buttons to adjust magnification</li>
              <li>• Image gallery navigation (if multiple images)</li>
              <li>• Add to Cart functionality</li>
              <li>• Add to Wishlist functionality</li>
              <li>• <strong>Product Comparison:</strong> Add/remove products from comparison</li>
              <li>• Quantity selector</li>
              <li>• Responsive design on different screen sizes</li>
              <li>• Keyboard navigation (ESC to close, arrow keys for images)</li>
              <li>• Click outside to close</li>
            </ul>
          </div>
        </div>
        
        {/* Quick View Modal */}
        <QuickViewModal
          product={mockProduct}
          isOpen={isQuickViewOpen}
          onClose={handleCloseQuickView}
        />
      </div>
    </div>
  );
}
