'use client';

import React, { useState } from 'react';
import { Instagram, Heart, MessageCircle, ExternalLink, Play } from 'lucide-react';

interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  postUrl: string;
  isVideo: boolean;
  hashtags: string[];
}

export const InstagramFeed: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);

  // Mock Instagram posts data (In production, this would come from Instagram Basic Display API)
  const instagramPosts: InstagramPost[] = [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=400&fit=crop',
      caption: 'Fresh batch of our signature trail mix! 🥜✨ Made with love and the finest organic ingredients. What\'s your favorite snack combo?',
      likes: 127,
      comments: 23,
      timestamp: '2024-01-15T10:30:00Z',
      postUrl: 'https://instagram.com/p/example1',
      isVideo: false,
      hashtags: ['#PrintOscarSnacks', '#OrganicTreats', '#HealthySnacking']
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
      caption: 'Behind the scenes at PrintOscar Studio! Watch our artisans craft beautiful handmade bags with traditional techniques. 🎨👜',
      likes: 89,
      comments: 15,
      timestamp: '2024-01-14T15:45:00Z',
      postUrl: 'https://instagram.com/p/example2',
      isVideo: true,
      hashtags: ['#HandmadeWithLove', '#ArtisanCrafts', '#PrintOscarStudio']
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=400&h=400&fit=crop',
      caption: 'Customer love! 💕 Thank you @sarah_m for sharing your beautiful photo with our organic mango strips. Tag us for a chance to be featured!',
      likes: 156,
      comments: 31,
      timestamp: '2024-01-13T12:20:00Z',
      postUrl: 'https://instagram.com/p/example3',
      isVideo: false,
      hashtags: ['#CustomerLove', '#OrganicMango', '#PrintOscarSnacks']
    },
    {
      id: '4',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      caption: 'Farm to table freshness! 🌱 Visit our partner farms and see where the magic begins. Sustainability is at the heart of everything we do.',
      likes: 203,
      comments: 42,
      timestamp: '2024-01-12T09:15:00Z',
      postUrl: 'https://instagram.com/p/example4',
      isVideo: false,
      hashtags: ['#SustainableFarming', '#FarmToTable', '#OrganicLife']
    },
    {
      id: '5',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      caption: 'New product alert! 🚨 Introducing our limited edition holiday gift boxes. Perfect for spreading joy and delicious treats! 🎁',
      likes: 178,
      comments: 28,
      timestamp: '2024-01-11T16:30:00Z',
      postUrl: 'https://instagram.com/p/example5',
      isVideo: false,
      hashtags: ['#NewProduct', '#GiftBoxes', '#HolidayTreats']
    },
    {
      id: '6',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
      caption: 'Community event success! 🎉 Thank you to everyone who joined us at the DC Metro Farmers Market. See you next weekend!',
      likes: 134,
      comments: 19,
      timestamp: '2024-01-10T18:45:00Z',
      postUrl: 'https://instagram.com/p/example6',
      isVideo: true,
      hashtags: ['#CommunityEvent', '#DCMetro', '#FarmersMarket']
    }
  ];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const truncateCaption = (caption: string, maxLength: number = 100) => {
    if (caption.length <= maxLength) return caption;
    return caption.substring(0, maxLength) + '...';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Instagram className="h-8 w-8 text-pink-500 mr-3" />
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Follow Our Journey
          </h2>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get the latest updates, behind-the-scenes content, and customer stories directly from our Instagram feed.
        </p>
        <div className="mt-6">
          <a
            href="https://www.instagram.com/segishop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Instagram className="h-5 w-5 mr-2" />
            @SegiShop
            <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </div>
      </div>

      {/* Instagram Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {instagramPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            {/* Post Image */}
            <div className="relative aspect-square bg-gray-100">
              <img
                src={post.imageUrl}
                alt="Instagram post"
                className="w-full h-full object-cover"
              />
              {post.isVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <Play className="h-12 w-12 text-white" />
                </div>
              )}
              <div className="absolute top-3 right-3">
                <Instagram className="h-6 w-6 text-white drop-shadow-lg" />
              </div>
            </div>

            {/* Post Content */}
            <div className="p-4">
              <p className="text-gray-800 text-sm mb-3 leading-relaxed">
                {truncateCaption(post.caption)}
              </p>
              
              {/* Hashtags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {post.hashtags.slice(0, 2).map((hashtag) => (
                  <span
                    key={hashtag}
                    className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded"
                  >
                    {hashtag}
                  </span>
                ))}
                {post.hashtags.length > 2 && (
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                    +{post.hashtags.length - 2}
                  </span>
                )}
              </div>

              {/* Post Stats */}
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span>{post.comments}</span>
                  </div>
                </div>
                <span>{formatTimeAgo(post.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <div className="text-center mt-12">
        <a
          href="https://www.instagram.com/segishop"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-8 py-3 bg-white border-2 border-pink-500 text-pink-500 font-semibold rounded-lg hover:bg-pink-500 hover:text-white transition-all duration-200"
        >
          View More on Instagram
          <ExternalLink className="h-4 w-4 ml-2" />
        </a>
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
            aria-hidden="true"
          />
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10">
            <div className="relative">
              <img
                src={selectedPost.imageUrl}
                alt="Instagram post"
                className="w-full aspect-square object-cover"
              />
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75 transition-colors text-xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-800 mb-4 leading-relaxed">{selectedPost.caption}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedPost.hashtags.map((hashtag) => (
                  <span
                    key={hashtag}
                    className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    <span>{selectedPost.likes} likes</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    <span>{selectedPost.comments} comments</span>
                  </div>
                </div>
                <a
                  href={selectedPost.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
                >
                  View on Instagram
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
