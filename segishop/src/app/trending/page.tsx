'use client';

import React from 'react';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { YouTubeShowcase } from '@/components/SocialMedia/YouTubeShowcase';
import { InstagramShowcase } from '@/components/SocialMedia/InstagramShowcase';
import { TikTokShowcase } from '@/components/SocialMedia/TikTokShowcase';
import { TrendingHero } from '@/components/Trending/TrendingHero';
import {
  Play,
  Sparkles
} from 'lucide-react';

export default function TrendingPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <TrendingHero />

        {/* Enhanced Social Media Integration */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-3 mb-4">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mx-auto sm:mx-0" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">What's Trending</h1>
              </div>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
                Discover the latest trends across our printing services and social media channels.
                From eye-catching banners to professional business cards, see what's capturing everyone's attention.
              </p>
            </div>

            {/* YouTube Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 text-center">
                <Play className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mx-auto mb-2 sm:mb-3" />
                <div className="text-lg sm:text-2xl font-bold text-gray-900">@OscarPrinting</div>
                <div className="text-xs sm:text-sm text-gray-600">YouTube Channel</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 text-center">
                <Play className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mx-auto mb-2 sm:mb-3" />
                <div className="text-lg sm:text-2xl font-bold text-gray-900">5K+</div>
                <div className="text-xs sm:text-sm text-gray-600">Subscribers</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 text-center">
                <Play className="h-6 w-6 sm:h-8 sm:w-8 text-red-700 mx-auto mb-2 sm:mb-3" />
                <div className="text-lg sm:text-2xl font-bold text-gray-900">150+</div>
                <div className="text-xs sm:text-sm text-gray-600">Videos Published</div>
              </div>
            </div>

            {/* YouTube Showcase */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <YouTubeShowcase />
            </div>

            {/* Instagram Showcase */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <InstagramShowcase />
            </div>

            {/* TikTok Showcase */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
              <TikTokShowcase />
            </div>


          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
