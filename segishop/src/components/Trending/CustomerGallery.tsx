'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  Heart, 
  MessageCircle, 
  Share2, 
  Instagram,
  User,
  MapPin,
  Calendar,
  X
} from 'lucide-react';

interface CustomerPhoto {
  id: string;
  imageUrl: string;
  customerName: string;
  customerAvatar: string;
  caption: string;
  productName: string;
  location: string;
  uploadDate: string;
  likes: number;
  comments: number;
  platform: 'instagram' | 'facebook' | 'twitter' | 'website';
  hashtags: string[];
  isVerified: boolean;
}

export const CustomerGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<CustomerPhoto | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock customer photos data
  const customerPhotos: CustomerPhoto[] = [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&h=600&fit=crop',
      customerName: 'Sarah M.',
      customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      caption: 'Perfect hiking snack! Love the organic trail mix from @printoscar 🥾✨',
      productName: 'Organic Trail Mix Deluxe',
      location: 'Great Falls, VA',
      uploadDate: '2024-01-15',
      likes: 127,
      comments: 23,
      platform: 'instagram',
      hashtags: ['#PrintOscarSnacks', '#HikingLife', '#OrganicTreats'],
      isVerified: true
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
      customerName: 'Emily R.',
      customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      caption: 'My new favorite tote bag! The craftsmanship is incredible 👜💕',
      productName: 'Handmade Canvas Tote Bag',
      location: 'Washington, DC',
      uploadDate: '2024-01-12',
      likes: 89,
      comments: 15,
      platform: 'instagram',
      hashtags: ['#HandmadeWithLove', '#ToteBag', '#PrintOscarStyle'],
      isVerified: false
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=600&h=600&fit=crop',
      customerName: 'Mike C.',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      caption: 'Kids absolutely love these mango strips! Healthy and delicious 🥭',
      productName: 'Organic Dried Mango Strips',
      location: 'Arlington, VA',
      uploadDate: '2024-01-10',
      likes: 156,
      comments: 31,
      platform: 'facebook',
      hashtags: ['#HealthyKids', '#OrganicSnacks', '#PrintOscarTreats'],
      isVerified: true
    },
    {
      id: '4',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
      customerName: 'Jessica P.',
      customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      caption: 'Chocolate heaven! Perfect gift for my chocolate-loving friend 🍫',
      productName: 'Artisan Chocolate Collection',
      location: 'Bethesda, MD',
      uploadDate: '2024-01-08',
      likes: 203,
      comments: 42,
      platform: 'instagram',
      hashtags: ['#ChocolateLovers', '#ArtisanTreats', '#PrintOscarGifts'],
      isVerified: false
    },
    {
      id: '5',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop',
      customerName: 'David T.',
      customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      caption: 'Sustainable and stylish! This water bottle goes everywhere with me 💧',
      productName: 'Eco-Friendly Water Bottle',
      location: 'Alexandria, VA',
      uploadDate: '2024-01-05',
      likes: 178,
      comments: 28,
      platform: 'twitter',
      hashtags: ['#EcoFriendly', '#Sustainable', '#PrintOscarLife'],
      isVerified: true
    },
    {
      id: '6',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop',
      customerName: 'Lisa K.',
      customerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
      caption: 'Post-workout fuel! These granola bars are the perfect energy boost 💪',
      productName: 'Organic Granola Bars',
      location: 'Rockville, MD',
      uploadDate: '2024-01-03',
      likes: 134,
      comments: 19,
      platform: 'instagram',
      hashtags: ['#PostWorkout', '#HealthyFuel', '#PrintOscarEnergy'],
      isVerified: false
    },
    {
      id: '7',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
      customerName: 'Amanda W.',
      customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      caption: 'Family picnic essentials! Everyone loved the variety pack 🧺',
      productName: 'Family Snack Variety Pack',
      location: 'Silver Spring, MD',
      uploadDate: '2024-01-01',
      likes: 92,
      comments: 12,
      platform: 'facebook',
      hashtags: ['#FamilyTime', '#PicnicSnacks', '#PrintOscarFamily'],
      isVerified: false
    },
    {
      id: '8',
      imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop',
      customerName: 'Robert L.',
      customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      caption: 'Office snack game strong! Colleagues keep asking where I got these 🏢',
      productName: 'Premium Office Snack Box',
      location: 'Washington, DC',
      uploadDate: '2023-12-28',
      likes: 67,
      comments: 8,
      platform: 'website',
      hashtags: ['#OfficeSnacks', '#WorkFuel', '#PrintOscarOffice'],
      isVerified: true
    }
  ];

  const filters = [
    { key: 'all', label: 'All Photos' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'twitter', label: 'Twitter' },
    { key: 'website', label: 'Website' }
  ];

  const filteredPhotos = activeFilter === 'all' 
    ? customerPhotos 
    : customerPhotos.filter(photo => photo.platform === activeFilter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'facebook':
        return <div className="h-4 w-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">f</div>;
      case 'twitter':
        return <div className="h-4 w-4 bg-blue-400 rounded text-white text-xs flex items-center justify-center font-bold">T</div>;
      case 'website':
        return <Camera className="h-4 w-4 text-gray-600" />;
      default:
        return <Camera className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Camera className="h-8 w-8 text-orange-500 mr-3" />
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Customer Gallery
          </h2>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          See how our customers are enjoying their PrintOscar products! Share your photos with #PrintOscarSnacks to be featured.
        </p>
      </div>

      {/* Upload CTA */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 mb-8 text-white text-center">
        <Camera className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Share Your PrintOscar Moments!</h3>
        <p className="mb-4">Tag us @printoscar or use #PrintOscarSnacks to get featured in our customer gallery</p>
        <div className="flex flex-wrap justify-center gap-2">
          {['#PrintOscarSnacks', '#HandmadeWithLove', '#OrganicTreats', '#PrintOscarLife'].map((hashtag) => (
            <span key={hashtag} className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-black text-sm">
              {hashtag}
            </span>
          ))}
        </div>
      </div>

      {/* Platform Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter.key
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={photo.imageUrl}
              alt={`Customer photo by ${photo.customerName}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-colors flex items-end">
              <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={photo.customerAvatar}
                    alt={photo.customerName}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium">{photo.customerName}</span>
                  {photo.isVerified && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs">
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {photo.likes}
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      {photo.comments}
                    </div>
                  </div>
                  {getPlatformIcon(photo.platform)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
            aria-hidden="true"
          />
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto z-10">
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-2/3 relative">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={`Customer photo by ${selectedPhoto.customerName}`}
                  className="w-full aspect-square object-cover"
                />
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75 transition-colors text-xl"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* Details */}
              <div className="md:w-1/3 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={selectedPhoto.customerAvatar}
                    alt={selectedPhoto.customerName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{selectedPhoto.customerName}</h3>
                      {selectedPhoto.isVerified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {selectedPhoto.location}
                    </div>
                  </div>
                </div>

                <p className="text-gray-800 mb-4 leading-relaxed">{selectedPhoto.caption}</p>

                <div className="mb-4">
                  <span className="text-sm font-medium text-orange-600">{selectedPhoto.productName}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedPhoto.hashtags.map((hashtag) => (
                    <span
                      key={hashtag}
                      className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded"
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {selectedPhoto.likes} likes
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {selectedPhoto.comments} comments
                    </div>
                  </div>
                  {getPlatformIcon(selectedPhoto.platform)}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(selectedPhoto.uploadDate)}
                </div>

                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                    <Heart className="h-4 w-4 mr-2" />
                    Like
                  </button>
                  <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
