'use client';

import React, { useState } from 'react';
import { SocialMediaFeed } from './SocialMediaFeed';
import {
  Youtube,
  TrendingUp,
  Grid3X3,
  List,
  MoreHorizontal,
  Smartphone
} from 'lucide-react';

interface SocialMediaTabsProps {
  className?: string;
  defaultTab?: 'products' | 'youtube' | 'youtube-shorts';
  showProductsTab?: boolean;
  productsContent?: React.ReactNode;
}

export const SocialMediaTabs: React.FC<SocialMediaTabsProps> = ({
  className = '',
  defaultTab = 'products',
  showProductsTab = true,
  productsContent,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'youtube' | 'youtube-shorts'>(defaultTab);
  const [layout, setLayout] = useState<'grid' | 'masonry' | 'carousel'>('grid');

  const tabs = [
    ...(showProductsTab ? [{
      id: 'products' as const,
      label: 'Trending Products',
      icon: TrendingUp,
      color: 'text-orange-600 border-orange-500',
      bgColor: 'bg-orange-50',
    }] : []),
    {
      id: 'youtube' as const,
      label: 'YouTube Videos',
      icon: Youtube,
      color: 'text-red-600 border-red-500',
      bgColor: 'bg-red-50',
    },
    {
      id: 'youtube-shorts' as const,
      label: 'YouTube Shorts',
      icon: Smartphone,
      color: 'text-red-500 border-red-400',
      bgColor: 'bg-red-25',
    },
  ];

  const layoutOptions = [
    { id: 'grid' as const, icon: Grid3X3, label: 'Grid' },
    { id: 'masonry' as const, icon: MoreHorizontal, label: 'Masonry' },
    { id: 'carousel' as const, icon: List, label: 'Carousel' },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'products':
        return productsContent || (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Trending Products
            </h3>
            <p className="text-gray-600">
              Product content will be displayed here
            </p>
          </div>
        );

      case 'youtube':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Latest Videos from @TheSegiShop
              </h3>
              <p className="text-gray-600">
                Watch our latest product reviews, unboxings, and behind-the-scenes content
              </p>
            </div>
            <SocialMediaFeed
              platform="youtube"
              limit={12}
              layout={layout}
              feedOptions={{
                showTitle: true,
                showDescription: false,
                channelId: 'UCYourChannelIdHere', // Replace with actual channel ID
              }}
            />
          </div>
        );

      case 'youtube-shorts':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                YouTube Shorts from @TheSegiShop
              </h3>
              <p className="text-gray-600">
                Quick snack hacks, unboxings, and bite-sized content
              </p>
            </div>
            <div className="youtube-shorts-container">
              <SocialMediaFeed
                platform="youtube"
                limit={8}
                layout="carousel"
                feedOptions={{
                  showTitle: true,
                  showDescription: false,
                  channelId: 'UCYourChannelIdHere', // Replace with actual channel ID
                }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`social-media-tabs ${className}`}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          {/* Tabs */}
          <nav className="flex space-x-1 overflow-x-auto scrollbar-hide pb-2 sm:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0
                    ${isActive
                      ? `${tab.color} ${tab.bgColor} border-b-2`
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>

          {/* Layout Controls - Only show for social media tabs on desktop */}
          {activeTab !== 'products' && (
            <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              {layoutOptions.map((option) => {
                const Icon = option.icon;
                const isActive = layout === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => setLayout(option.id)}
                    className={`
                      p-2 rounded-md transition-all duration-200
                      ${isActive
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                      }
                    `}
                    title={option.label}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tab Indicators */}
        <div className="flex items-center justify-between text-xs text-gray-500 pb-4">
          <div className="flex items-center space-x-4">
            {activeTab === 'youtube' && (
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Latest videos from @TheSegiShop</span>
              </span>
            )}
            {activeTab === 'youtube-shorts' && (
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>YouTube Shorts from @TheSegiShop</span>
              </span>
            )}
            {activeTab === 'products' && (
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Popular products and collections</span>
              </span>
            )}
          </div>

          {activeTab !== 'products' && (
            <div className="flex items-center space-x-2">
              <span>Layout:</span>
              <span className="font-medium capitalize">{layout}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {getTabContent()}
      </div>

      {/* Mobile Tab Indicators */}
      <div className="md:hidden mt-8 flex justify-center">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-2 h-2 rounded-full transition-all duration-200
                ${activeTab === tab.id ? 'bg-orange-500 w-6' : 'bg-gray-300'}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
