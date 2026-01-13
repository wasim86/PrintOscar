'use client';

import { useState } from 'react';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { HeroSection } from '@/components/Homepage/HeroSection';
import { FeaturedProducts } from '@/components/Homepage/FeaturedProducts';
import { UniquelyAuthentic } from '@/components/Homepage/UniquelyAuthentic';
import { CategoryGrid } from '@/components/Homepage/CategoryGrid';
import { EtsyReviewsSection } from '@/components/Homepage/EtsyReviewsSection';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useWishlist } from '@/contexts/WishlistContext';

export default function Home() {
  const { addToWishlist } = useWishlist();

  const handleAddToCart = (productId: string) => {
    console.log('Adding to cart:', productId);
    // Redirect to cart page or show success message
    window.location.href = '/cart';
  };

  const handleAddToWishlist = async (productId: string) => {
    const success = await addToWishlist(parseInt(productId));
    if (success) {
      // Optional: Show success message
      console.log('Added to wishlist successfully');
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        <Header />

        <main>
          {/* Hero Section */}
          <HeroSection />

          {/* Featured Products */}
          <FeaturedProducts />

          {/* Uniquely Authentic Section */}
          <UniquelyAuthentic />

          {/* Category Grid */}
          <CategoryGrid />

          {/* Etsy Reviews */}
          <EtsyReviewsSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
