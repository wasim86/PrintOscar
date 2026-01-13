'use client';

import React, { useState } from 'react';


interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  location: string;
  date: string;
  category: 'market' | 'event' | 'team' | 'products' | 'community';
  likes: number;
}

interface CommunityGalleryProps {
  images: GalleryImage[];
  title?: string;
  subtitle?: string;
}

export const CommunityGallery: React.FC<CommunityGalleryProps> = ({
  images,
  title = "HOPE TO SEE YOU AROUND!",
  subtitle = "Join our vibrant community at local markets, events, and gatherings throughout the DC Metro area."
}) => {
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Photos', count: images.length },
    { id: 'market', label: 'Markets', count: images.filter(img => img.category === 'market').length },
    { id: 'event', label: 'Events', count: images.filter(img => img.category === 'event').length },
    { id: 'team', label: 'Team', count: images.filter(img => img.category === 'team').length },
    { id: 'products', label: 'Products', count: images.filter(img => img.category === 'products').length },
    { id: 'community', label: 'Community', count: images.filter(img => img.category === 'community').length }
  ];

  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.category === filter);



  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'market':
        return 'bg-green-100 text-green-800';
      case 'event':
        return 'bg-blue-100 text-blue-800';
      case 'team':
        return 'bg-purple-100 text-purple-800';
      case 'products':
        return 'bg-orange-100 text-orange-800';
      case 'community':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {subtitle}
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === category.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className = 'absolute inset-0 flex flex-col items-center justify-center text-center text-gray-500 bg-gradient-to-br from-orange-100 to-orange-200';
                    fallbackDiv.innerHTML = `
                      <div class="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span class="text-2xl">📸</span>
                      </div>
                      <p class="font-semibold text-gray-700 px-2">Image</p>
                    `;
                    target.parentElement!.appendChild(fallbackDiv);
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community!</h3>
            <p className="text-gray-600 mb-6">
              Follow us on social media to stay updated on upcoming events, new market locations, 
              and behind-the-scenes moments from the PrintOscar family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold">
                📧 Get Event Updates
              </button>
              <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
                📱 Follow on Social
              </button>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};
