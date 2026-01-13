'use client';

import React, { useState } from 'react';
import { Reviews } from './Reviews/Reviews';

interface ProductTabsProps {
  productId: number;
  description: string;
  specifications?: { [key: string]: string };
  isAuthenticated?: boolean;
  userEmail?: string;
  userName?: string;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({
  productId,
  description,
  specifications,
  isAuthenticated = false,
  userEmail,
  userName
}) => {
  const [activeTab, setActiveTab] = useState('reviews');

  const tabs = [
    { id: 'reviews', label: 'Reviews' },
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications', show: specifications && Object.keys(specifications).length > 0 }
  ].filter(tab => tab.show !== false);



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <Reviews
            productId={productId}
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            userName={userName}
          />
        )}

        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="prose prose-gray max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specifications' && specifications && (
          <div className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-900">{key}</span>
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
