'use client';

import React, { useState } from 'react';
import { Youtube, Play, Clock, Eye, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAt: string;
  videoUrl: string;
  category: 'tutorial' | 'behind-scenes' | 'product-feature' | 'customer-story';
}

export const YouTubePlaylist: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Mock YouTube videos data (In production, this would come from YouTube Data API)
  const youtubeVideos: YouTubeVideo[] = [
    {
      id: '1',
      title: 'How We Make Our Signature Trail Mix | Behind the Scenes',
      description: 'Take a peek behind the curtain and see how we carefully craft our most popular trail mix blend using premium organic ingredients.',
      thumbnail: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=480&h=270&fit=crop',
      duration: '5:42',
      views: '12.5K',
      publishedAt: '2024-01-15',
      videoUrl: 'https://youtube.com/watch?v=example1',
      category: 'behind-scenes'
    },
    {
      id: '2',
      title: 'Handmade Tote Bag Creation Process | Artisan Spotlight',
      description: 'Meet our talented artisans and discover the traditional techniques used to create our beautiful handmade tote bags.',
      thumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=480&h=270&fit=crop',
      duration: '8:15',
      views: '8.9K',
      publishedAt: '2024-01-12',
      videoUrl: 'https://youtube.com/watch?v=example2',
      category: 'behind-scenes'
    },
    {
      id: '3',
      title: 'Healthy Snacking Tips for Busy Professionals',
      description: 'Learn how to maintain healthy eating habits even with a busy schedule. Featuring our top organic snack recommendations.',
      thumbnail: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=480&h=270&fit=crop',
      duration: '6:33',
      views: '15.2K',
      publishedAt: '2024-01-10',
      videoUrl: 'https://youtube.com/watch?v=example3',
      category: 'tutorial'
    },
    {
      id: '4',
      title: 'Customer Story: Sarah\'s Healthy Lifestyle Journey',
      description: 'Hear from Sarah, a loyal customer, about how PrintOscar products have helped her maintain a healthier lifestyle.',
      thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=480&h=270&fit=crop',
      duration: '4:28',
      views: '6.7K',
      publishedAt: '2024-01-08',
      videoUrl: 'https://youtube.com/watch?v=example4',
      category: 'customer-story'
    },
    {
      id: '5',
      title: 'New Product Showcase: Organic Dried Fruit Collection',
      description: 'Introducing our latest collection of premium organic dried fruits. Taste the difference quality makes!',
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=480&h=270&fit=crop',
      duration: '3:55',
      views: '9.8K',
      publishedAt: '2024-01-05',
      videoUrl: 'https://youtube.com/watch?v=example5',
      category: 'product-feature'
    },
    {
      id: '6',
      title: 'Farm Visit: Meeting Our Organic Suppliers',
      description: 'Join us on a visit to our partner farms and meet the dedicated farmers who grow our organic ingredients.',
      thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=480&h=270&fit=crop',
      duration: '10:22',
      views: '11.3K',
      publishedAt: '2024-01-03',
      videoUrl: 'https://youtube.com/watch?v=example6',
      category: 'behind-scenes'
    }
  ];

  const categories = [
    { key: 'all', label: 'All Videos', count: youtubeVideos.length },
    { key: 'behind-scenes', label: 'Behind the Scenes', count: youtubeVideos.filter(v => v.category === 'behind-scenes').length },
    { key: 'tutorial', label: 'Tutorials', count: youtubeVideos.filter(v => v.category === 'tutorial').length },
    { key: 'product-feature', label: 'Product Features', count: youtubeVideos.filter(v => v.category === 'product-feature').length },
    { key: 'customer-story', label: 'Customer Stories', count: youtubeVideos.filter(v => v.category === 'customer-story').length }
  ];

  const filteredVideos = activeCategory === 'all' 
    ? youtubeVideos 
    : youtubeVideos.filter(video => video.category === activeCategory);

  const videosPerSlide = 3;
  const totalSlides = Math.ceil(filteredVideos.length / videosPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentVideos = () => {
    const startIndex = currentSlide * videosPerSlide;
    return filteredVideos.slice(startIndex, startIndex + videosPerSlide);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Youtube className="h-8 w-8 text-red-500 mr-3" />
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            YouTube Channel
          </h2>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Dive deeper into our world with exclusive videos, tutorials, and behind-the-scenes content from our YouTube channel.
        </p>
        <div className="mt-6">
          <a
            href="https://www.youtube.com/@segishop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Youtube className="h-5 w-5 mr-2" />
            Subscribe to Our Channel
            <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => {
              setActiveCategory(category.key);
              setCurrentSlide(0);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.key
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Video Carousel */}
      <div className="relative">
        {/* Navigation Buttons */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </>
        )}

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getCurrentVideos().map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-colors">
                  <Play className="h-12 w-12 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                <div className="absolute top-2 right-2">
                  <Youtube className="h-6 w-6 text-red-500" />
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                  {video.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {video.description}
                </p>
                
                <div className="flex items-center justify-between text-gray-500 text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{video.views} views</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDate(video.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-red-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* View More Button */}
      <div className="text-center mt-12">
        <a
          href="https://www.youtube.com/@segishop"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-8 py-3 bg-white border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          View All Videos on YouTube
          <ExternalLink className="h-4 w-4 ml-2" />
        </a>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative aspect-video bg-gray-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Youtube className="h-16 w-16 mx-auto mb-4 text-red-500" />
                  <p className="text-lg mb-4">Click to watch on YouTube</p>
                  <a
                    href={selectedVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Video
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </div>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75 transition-colors text-xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{selectedVideo.title}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">{selectedVideo.description}</p>
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    <span>{selectedVideo.views} views</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{selectedVideo.duration}</span>
                  </div>
                  <span>Published {formatDate(selectedVideo.publishedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
