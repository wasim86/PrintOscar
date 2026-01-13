'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Instagram, 
  Facebook, 
  Twitter,
  Quote,
  ExternalLink
} from 'lucide-react';

interface SocialReview {
  id: string;
  customerName: string;
  customerAvatar: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'google' | 'yelp';
  rating: number;
  reviewText: string;
  productName?: string;
  reviewDate: string;
  reviewUrl: string;
  isVerified: boolean;
  location?: string;
}

export const SocialReviewsCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Mock social reviews data (In production, this would come from various social media APIs)
  const socialReviews: SocialReview[] = [
    {
      id: '1',
      customerName: 'Sarah Mitchell',
      customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      platform: 'instagram',
      rating: 5,
      reviewText: 'Absolutely love the organic trail mix! Perfect for my morning hikes. The quality is outstanding and you can really taste the difference. Will definitely be ordering more! 🥾✨',
      productName: 'Organic Trail Mix Deluxe',
      reviewDate: '2024-01-15',
      reviewUrl: 'https://instagram.com/p/review1',
      isVerified: true,
      location: 'Washington, DC'
    },
    {
      id: '2',
      customerName: 'Michael Chen',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      platform: 'facebook',
      rating: 5,
      reviewText: 'The handmade tote bags are incredible! My wife loves hers and uses it every day. The craftsmanship is top-notch and it\'s clear these are made with care and attention to detail.',
      productName: 'Handmade Canvas Tote Bag',
      reviewDate: '2024-01-12',
      reviewUrl: 'https://facebook.com/review2',
      isVerified: true,
      location: 'Arlington, VA'
    },
    {
      id: '3',
      customerName: 'Emily Rodriguez',
      customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      platform: 'google',
      rating: 5,
      reviewText: 'Best snack shop in the DC area! Everything is fresh, organic, and delicious. The customer service is exceptional too. Highly recommend to anyone looking for healthy, quality snacks.',
      reviewDate: '2024-01-10',
      reviewUrl: 'https://google.com/review3',
      isVerified: true,
      location: 'Bethesda, MD'
    },
    {
      id: '4',
      customerName: 'David Thompson',
      customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      platform: 'yelp',
      rating: 5,
      reviewText: 'Discovered PrintOscar at the farmers market and I\'m so glad I did! The dried fruit selection is amazing and everything tastes so fresh. Great prices too!',
      productName: 'Organic Dried Fruit Collection',
      reviewDate: '2024-01-08',
      reviewUrl: 'https://yelp.com/review4',
      isVerified: true,
      location: 'Alexandria, VA'
    },
    {
      id: '5',
      customerName: 'Jessica Park',
      customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      platform: 'twitter',
      rating: 5,
      reviewText: 'Just received my order and WOW! The packaging is beautiful and everything arrived perfectly fresh. You can tell this company really cares about their customers. 💕',
      reviewDate: '2024-01-05',
      reviewUrl: 'https://twitter.com/review5',
      isVerified: true,
      location: 'Rockville, MD'
    },
    {
      id: '6',
      customerName: 'Robert Kim',
      customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      platform: 'instagram',
      rating: 5,
      reviewText: 'The granola bars are my new obsession! Perfect for post-workout snacks. Love that they\'re made with all natural ingredients and no artificial preservatives.',
      productName: 'Organic Granola Bars',
      reviewDate: '2024-01-03',
      reviewUrl: 'https://instagram.com/p/review6',
      isVerified: true,
      location: 'Silver Spring, MD'
    }
  ];

  const reviewsPerSlide = 3;
  const totalSlides = Math.ceil(socialReviews.length / reviewsPerSlide);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentReviews = () => {
    const startIndex = currentSlide * reviewsPerSlide;
    return socialReviews.slice(startIndex, startIndex + reviewsPerSlide);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'twitter':
        return <Twitter className="h-5 w-5 text-blue-400" />;
      case 'google':
        return <div className="h-5 w-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">G</div>;
      case 'yelp':
        return <div className="h-5 w-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">Y</div>;
      default:
        return <Star className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return 'Instagram';
      case 'facebook':
        return 'Facebook';
      case 'twitter':
        return 'Twitter';
      case 'google':
        return 'Google Reviews';
      case 'yelp':
        return 'Yelp';
      default:
        return 'Review';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
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
          <Quote className="h-8 w-8 text-orange-500 mr-3" />
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Real reviews from real customers across all our social media platforms. See why people love Segi Shop!
        </p>
      </div>

      {/* Reviews Carousel */}
      <div 
        className="relative"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getCurrentReviews().map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={review.customerAvatar}
                    alt={review.customerName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                      {review.isVerified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {review.location && (
                      <p className="text-sm text-gray-500">{review.location}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getPlatformIcon(review.platform)}
                  <a
                    href={review.reviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex items-center mr-2">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  on {getPlatformName(review.platform)}
                </span>
              </div>

              {/* Review Text */}
              <blockquote className="text-gray-700 mb-4 leading-relaxed">
                "{review.reviewText}"
              </blockquote>

              {/* Product Name & Date */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                {review.productName && (
                  <span className="font-medium text-orange-600">{review.productName}</span>
                )}
                <span>{formatDate(review.reviewDate)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Platform Stats */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Across Platforms</h3>
          <p className="text-gray-600">See what customers are saying about us everywhere</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { platform: 'Google', rating: '4.9', reviews: '150+', icon: 'google' },
            { platform: 'Yelp', rating: '4.8', reviews: '89+', icon: 'yelp' },
            { platform: 'Facebook', rating: '4.9', reviews: '200+', icon: 'facebook' },
            { platform: 'Instagram', rating: '4.8', reviews: '300+', icon: 'instagram' },
            { platform: 'Twitter', rating: '4.7', reviews: '75+', icon: 'twitter' }
          ].map((stat) => (
            <div key={stat.platform} className="text-center">
              <div className="flex justify-center mb-2">
                {getPlatformIcon(stat.icon)}
              </div>
              <div className="font-semibold text-gray-900">{stat.platform}</div>
              <div className="text-sm text-gray-600">{stat.rating} ★ ({stat.reviews})</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
