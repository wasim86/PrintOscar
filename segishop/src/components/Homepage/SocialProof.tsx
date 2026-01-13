'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

// ETSY Reviews Data (In production, this would come from ETSY API)
const etsyReviews = [
  {
    id: 1,
    name: 'Jennifer M.',
    location: 'New York, NY',
    rating: 5,
    text: 'Absolutely love this handmade tote bag! The quality is exceptional and it arrived quickly. Perfect for my daily use.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
    platform: 'etsy',
    productName: 'Handmade Canvas Tote Bag',
    date: '2024-01-15',
    verified: true
  },
  {
    id: 2,
    name: 'David K.',
    location: 'California, CA',
    rating: 5,
    text: 'The organic trail mix is fantastic! Fresh ingredients and great packaging. Will definitely order again.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    platform: 'etsy',
    productName: 'Organic Trail Mix Deluxe',
    date: '2024-01-12',
    verified: true
  },
  {
    id: 3,
    name: 'Maria S.',
    location: 'Texas, TX',
    rating: 5,
    text: 'Beautiful ceramic bowl! The craftsmanship is amazing and it looks perfect in my kitchen. Highly recommend!',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    platform: 'etsy',
    productName: 'Handmade Ceramic Bowl',
    date: '2024-01-10',
    verified: true
  },
  {
    id: 4,
    name: 'Robert L.',
    location: 'Florida, FL',
    rating: 5,
    text: 'Excellent customer service and fast shipping. The dried mango strips are delicious and healthy. Perfect snack!',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    platform: 'etsy',
    productName: 'Organic Dried Mango Strips',
    date: '2024-01-08',
    verified: true
  },
  {
    id: 5,
    name: 'Lisa W.',
    location: 'Washington, DC',
    rating: 5,
    text: 'Love supporting local artisans! The handmade scarf is beautiful and the quality is outstanding. Thank you!',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
    platform: 'etsy',
    productName: 'Handwoven Wool Scarf',
    date: '2024-01-05',
    verified: true
  }
];

const localTestimonials = [
  {
    id: 6,
    name: 'Sarah Johnson',
    location: 'Arlington, VA',
    rating: 5,
    text: 'The organic trail mix is absolutely delicious! I love supporting a local business that cares about quality.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
    platform: 'local',
    date: '2024-01-03',
    verified: false
  },
  {
    id: 7,
    name: 'Michael Chen',
    location: 'Washington, DC',
    rating: 5,
    text: 'Fast delivery and amazing customer service. The dried mango strips are my new favorite snack.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    platform: 'local',
    date: '2024-01-01',
    verified: false
  }
];

// Combine all reviews
const allReviews = [...etsyReviews, ...localTestimonials];

export const SocialProof: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Show 3 reviews per slide
  const reviewsPerSlide = 3;
  const totalSlides = Math.ceil(allReviews.length / reviewsPerSlide);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Get reviews for current slide
  const getCurrentReviews = () => {
    const startIndex = currentSlide * reviewsPerSlide;
    return allReviews.slice(startIndex, startIndex + reviewsPerSlide);
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

  const getPlatformBadge = (platform: string, verified: boolean) => {
    if (platform === 'etsy') {
      return (
        <div className="flex items-center space-x-1 text-xs">
          <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
            ETSY
          </div>
          {verified && (
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
              Verified
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
        Local Customer
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Customer Reviews
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real reviews from our ETSY store and local customers who love our handmade products and organic snacks.
          </p>
        </div>

        {/* ETSY Reviews Slider */}
        <div className="relative mb-16">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-20"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-20"
            aria-label="Next reviews"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Slider Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                const slideReviews = allReviews.slice(
                  slideIndex * reviewsPerSlide,
                  slideIndex * reviewsPerSlide + reviewsPerSlide
                );

                return (
                  <div key={slideIndex} className="w-full flex-shrink-0 px-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {slideReviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-xl shadow-sm p-6 relative min-h-[320px] flex flex-col">
                          {/* Quote Icon */}
                          <div className="absolute -top-4 left-6 z-10">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                              <Quote className="h-4 w-4 text-white" />
                            </div>
                          </div>

                          {/* Platform Badge */}
                          <div className="flex justify-end mb-2 mt-2">
                            {getPlatformBadge(review.platform, review.verified)}
                          </div>

                          {/* Rating */}
                          <div className="flex mb-4">
                            {renderStars(review.rating)}
                          </div>

                          {/* Review Text */}
                          <p className="text-gray-700 mb-4 leading-relaxed flex-grow">
                            "{review.text}"
                          </p>

                          {/* Product Name (for ETSY reviews) */}
                          {(review as any).productName && (
                            <p className="text-sm text-orange-600 font-medium mb-4">
                              Product: {(review as any).productName}
                            </p>
                          )}

                          {/* Customer Info */}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center">
                              <img
                                src={review.image}
                                alt={review.name}
                                className="w-12 h-12 rounded-full object-cover mr-4 flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">
                                  {review.name}
                                </h4>
                                <p className="text-sm text-gray-500 truncate">
                                  {review.location}
                                </p>
                              </div>
                            </div>
                            {review.platform === 'etsy' && (
                              <ExternalLink className="h-4 w-4 text-orange-500 flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? 'bg-orange-500 scale-110 shadow-lg'
                      : 'bg-gray-300 hover:bg-orange-300 hover:scale-105'
                  }`}
                  aria-label={`Go to review slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section with ETSY Integration */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Trusted by Customers Everywhere
            </h3>
            <p className="text-gray-600">
              From our ETSY store to local DC Metro customers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-gray-600">ETSY Sales</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">4.9</div>
              <div className="text-gray-600">ETSY Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">200+</div>
              <div className="text-gray-600">Local Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">5</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>

          {/* ETSY Store Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://www.etsy.com/shop/SegiSnacks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              Visit Our ETSY Store
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>

            <a
              href="https://www.etsy.com/shop/SegiSnacks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-white border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition-colors duration-200"
            >
              <Star className="h-4 w-4 mr-2 fill-current" />
              Review us on ETSY
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </div>
        </div>

        {/* Review Call-to-Action Section */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Love Our Products? Share Your Experience!
            </h3>
            <p className="text-orange-100 mb-6 text-lg">
              Your reviews help other customers discover our handmade products and organic snacks.
              Share your experience on ETSY and help us grow our community!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://www.etsy.com/shop/SegiSnacks"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition-colors duration-200 shadow-lg"
              >
                <Star className="h-5 w-5 mr-2 fill-current" />
                Write a Review on ETSY
                <ExternalLink className="h-5 w-5 ml-2" />
              </a>

              <div className="flex items-center space-x-1 text-orange-100">
                <span className="text-sm">Takes less than 2 minutes</span>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-yellow-300" />
                  ))}
                </div>
              </div>
            </div>

            {/* Review Benefits */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold mb-2">📝</div>
                <h4 className="font-semibold mb-1">Easy Process</h4>
                <p className="text-sm text-orange-100">Quick and simple review form</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold mb-2">🎁</div>
                <h4 className="font-semibold mb-1">Help Others</h4>
                <p className="text-sm text-orange-100">Guide future customers</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold mb-2">⭐</div>
                <h4 className="font-semibold mb-1">Build Trust</h4>
                <p className="text-sm text-orange-100">Support small business</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
