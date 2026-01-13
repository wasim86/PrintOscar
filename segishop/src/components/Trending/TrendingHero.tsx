'use client';

import React from 'react';
import { TrendingUp, Instagram, Youtube, Users, Heart } from 'lucide-react';

export const TrendingHero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          {/* Main Heading */}
          <div className="flex items-center justify-center mb-6">
            <TrendingUp className="h-12 w-12 mr-4 text-yellow-300" />
            <h1 className="text-4xl lg:text-6xl font-bold">
              What's <span className="text-yellow-300">Trending</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Discover the latest printing trends at Oscar Printing! From custom banners to professional business cards, 
            see what our clients are creating right now.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-300 mb-2">5K+</div>
              <div className="text-orange-100 text-sm lg:text-base">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-300 mb-2">10K+</div>
              <div className="text-orange-100 text-sm lg:text-base">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-300 mb-2">500+</div>
              <div className="text-orange-100 text-sm lg:text-base">Customer Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-300 mb-2">4.9★</div>
              <div className="text-orange-100 text-sm lg:text-base">Average Rating</div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="https://www.instagram.com/oscar.printingbanners/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-black font-semibold rounded-lg hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-30"
            >
              <Instagram className="h-5 w-5 mr-2" />
              Follow on Instagram
            </a>
            
            <a
              href="https://www.youtube.com/@OscarPrinting"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-black font-semibold rounded-lg hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-30"
            >
              <Youtube className="h-5 w-5 mr-2" />
              Subscribe on YouTube
            </a>
          </div>

          {/* Trending Hashtags */}
          <div className="mt-12">
            <p className="text-orange-200 text-sm mb-4">Trending Now:</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                '#OscarPrinting',
                '#CustomBanners',
                '#PrintShop',
                '#JerseyCity',
                '#BusinessCards',
                '#LargeFormat',
                '#DesignServices'
              ].map((hashtag) => (
                <span
                  key={hashtag}
                  className="inline-flex items-center px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm text-black text-sm font-medium rounded-full border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-200 cursor-pointer"
                >
                  {hashtag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-20">
        <Heart className="h-8 w-8 text-yellow-300 animate-pulse" />
      </div>
      <div className="absolute top-32 right-16 opacity-20">
        <Users className="h-6 w-6 text-yellow-300 animate-bounce" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-20">
        <Instagram className="h-10 w-10 text-yellow-300 animate-pulse" />
      </div>
      <div className="absolute bottom-32 right-12 opacity-20">
        <Youtube className="h-8 w-8 text-yellow-300 animate-bounce" />
      </div>
    </div>
  );
};
