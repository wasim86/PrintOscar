'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Maximize2 } from 'lucide-react';

interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
  alt: string;
  title: string;
  description: string;
  category: string;
  duration?: string; // for videos
}

interface AboutGalleryProps {
  items: GalleryItem[];
  title: string;
  subtitle: string;
  theme: 'farm' | 'studio';
}

export const AboutGallery: React.FC<AboutGalleryProps> = ({
  items,
  title,
  subtitle,
  theme
}) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const themeColors = {
    farm: {
      primary: 'green',
      gradient: 'from-green-50 to-green-100',
      button: 'bg-green-600 hover:bg-green-700',
      accent: 'text-green-600'
    },
    studio: {
      primary: 'orange',
      gradient: 'from-orange-50 to-orange-100',
      button: 'bg-orange-600 hover:bg-orange-700',
      accent: 'text-orange-600'
    }
  };

  const colors = themeColors[theme];

  const openLightbox = (item: GalleryItem, index: number) => {
    setSelectedItem(item);
    setCurrentIndex(index);
    if (item.type === 'video') {
      setIsPlaying(false);
    }
  };

  const closeLightbox = () => {
    setSelectedItem(null);
    setIsPlaying(false);
  };

  const nextItem = () => {
    const nextIndex = (currentIndex + 1) % items.length;
    setCurrentIndex(nextIndex);
    setSelectedItem(items[nextIndex]);
    setIsPlaying(false);
  };

  const prevItem = () => {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    setCurrentIndex(prevIndex);
    setSelectedItem(items[prevIndex]);
    setIsPlaying(false);
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'seeds': '🌱',
      'farming': '🚜',
      'harvest': '🌾',
      'water': '💧',
      'team': '🧑‍🌾',
      'produce': '🍅',
      'design': '✂️',
      'crafting': '🧵',
      'materials': '🎨',
      'tools': '🔧',
      'artisans': '👥',
      'quality': '✨'
    };
    return icons[category] || '📸';
  };

  return (
    <section className={`py-16 bg-gradient-to-br ${colors.gradient}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => openLightbox(item, index)}
            >
              {/* Item Preview */}
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Play className="h-8 w-8 text-gray-700 ml-1" />
                      </div>
                      <p className="font-semibold">{item.title}</p>
                      {item.duration && <p className="text-sm">{item.duration}</p>}
                    </div>
                  </div>
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${
                    theme === 'farm' 
                      ? `from-${colors.primary}-200 to-${colors.primary}-300` 
                      : `from-${colors.primary}-200 to-${colors.primary}-300`
                  } flex items-center justify-center`}>
                    <div className={`text-center text-${colors.primary}-700`}>
                      <div className={`w-16 h-16 bg-${colors.primary}-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                      </div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm capitalize">{item.category}</p>
                    </div>
                  </div>
                )}

                {/* Video Play Button Overlay */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center group-hover:bg-opacity-70 transition-colors">
                      <Play className="h-10 w-10 text-white ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
                <div className="p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm opacity-90">{item.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-75 capitalize">{item.category}</span>
                    {item.type === 'video' && item.duration && (
                      <span className="text-xs opacity-75">{item.duration}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery Stats */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {theme === 'farm' ? (
              <>
                <div>
                  <div className={`text-3xl font-bold ${colors.accent} mb-2`}>500+</div>
                  <div className="text-gray-600">Acres Farmed</div>
                </div>
                <div>
                  <div className={`text-3xl font-bold ${colors.accent} mb-2`}>15</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div>
                  <div className={`text-3xl font-bold ${colors.accent} mb-2`}>100%</div>
                  <div className="text-gray-600">Organic Certified</div>
                </div>
                <div>
                  <div className={`text-3xl font-bold ${colors.accent} mb-2`}>25+</div>
                  <div className="text-gray-600">Crop Varieties</div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className={`text-3xl font-bold ${colors.accent} mb-2`}>50+</div>
                  <div className="text-gray-600">Handmade Products</div>
                </div>
                <div>
                  <div className={`text-3xl font-bold ${colors.accent} mb-2`}>12</div>
                  <div className="text-gray-600">Master Artisans</div>
                </div>
                <div>
                  <div className={`text-3xl font-bold ${colors.accent} mb-2`}>1000+</div>
                  <div className="text-gray-600">Hours of Crafting</div>
                </div>
                <div>
                  <div className={`text-3xl font-bold ${colors.accent} mb-2`}>100%</div>
                  <div className="text-gray-600">Handmade Quality</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl max-h-full w-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            {items.length > 1 && (
              <>
                <button
                  onClick={prevItem}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextItem}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Content */}
            <div className="bg-white rounded-lg overflow-hidden">
              {selectedItem.type === 'video' ? (
                <div className="relative">
                  <div className="aspect-video bg-gray-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        {isPlaying ? (
                          <Pause className="h-10 w-10" />
                        ) : (
                          <Play className="h-10 w-10 ml-1" />
                        )}
                      </div>
                      <p className="text-lg font-semibold">{selectedItem.title}</p>
                      {selectedItem.duration && <p className="text-sm opacity-75">{selectedItem.duration}</p>}
                    </div>
                  </div>
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 text-white transition-colors"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 text-white transition-colors">
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className={`w-24 h-24 bg-${colors.primary}-500 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-4xl">{getCategoryIcon(selectedItem.category)}</span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{selectedItem.title}</p>
                    <p className="text-gray-600 capitalize">{selectedItem.category}</p>
                  </div>
                </div>
              )}

              {/* Item Details */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.title}</h3>
                <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 bg-${colors.primary}-100 text-${colors.primary}-800 rounded-full text-sm font-medium capitalize`}>
                    {selectedItem.category}
                  </span>
                  <div className="text-sm text-gray-500">
                    {currentIndex + 1} of {items.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
