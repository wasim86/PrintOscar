'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/hero-animations.css';
import { IMAGE_BASE_URL } from '@/services/config';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  secondaryImage?: string;
  ctaText: string;
  ctaLink: string;
  badge: string;
  category: string;
}

interface HeroSectionProps {
  onShopNow?: () => void;
}

const joinBase = (path: string) => {
  let rawBase = (IMAGE_BASE_URL || '').replace(/\/$/, '');

  // Sanitize localhost URLs - ensure we never point to localhost
  if (rawBase.includes('localhost:5001')) {
     rawBase = rawBase.replace('http://localhost:5001', 'https://printoscar.com');
  }

  const p = path.startsWith('/') ? path : `/${path}`;
  
  if (/^https?:\/\//.test(path)) {
    if (path.includes('localhost:5001')) {
      return path.replace('http://localhost:5001', 'https://printoscar.com');
    }
    if (path.startsWith('https://printoscar.com')) {
      return path.replace('https://printoscar.com', rawBase);
    }
    return path;
  }

  if (!rawBase) return `https://printoscar.com${p}`;

  // If base already includes uploads path and path also includes it, avoid duplication
  if (rawBase.endsWith('/uploads/images') && p.startsWith('/uploads/images')) {
    return `${rawBase}${p.replace(/^\/uploads\/images/, '')}`;
  }

  return `${rawBase}${p}`;
};

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Trophies",
    subtitle: "Premium Custom Trophies & Awards",
    description:
      "At Oscar Printing Shop, we craft premium-quality trophies and awards to celebrate achievements. Ideal for corporate events, schools, and sports tournaments.",
    image: joinBase("/uploads/images/Oscer/banner1.jpg"),
    secondaryImage: joinBase("/uploads/images/Oscer/banner2.webp"),
    ctaText: "SHOP TROPHIES",
    ctaLink: "/products?category=trophies",
    badge: "Premium Quality • Custom Engraving",
    category: "TROPHIES"
  },
  {
    id: 2,
    title: "Medals",
    subtitle: "Victory Medals for Champions",
    description:
      "Discover high-quality medals designed for sports events, school competitions, and achievement ceremonies.",
    image: joinBase("/uploads/images/Oscer/banner3.jpg"),
    secondaryImage: joinBase("/uploads/images/Oscer/banner4.png"),
    ctaText: "SHOP MEDALS",
    ctaLink: "/products?category=medals",
    badge: "Gold • Silver • Bronze",
    category: "MEDALS"
  },
  {
    id: 3,
    title: "Plaques",
    subtitle: "Elegant Plaques & Mementos",
    description:
      "Honor excellence with beautifully crafted plaques and mementos, perfect for corporate recognition and milestones.",
    image: joinBase("/uploads/images/Oscer/requal1.jpg"),
    secondaryImage: joinBase("/uploads/images/Oscer/banner6.jpg"),
    ctaText: "SHOP PLAQUES",
    ctaLink: "/products?category=walnut-plaques",
    badge: "Elegant • Premium Finish",
    category: "PLAQUES"
  },
  {
    id: 4,
    title: "Awards",
    subtitle: "Corporate & Sports Awards",
    description:
      "Celebrate success with our exclusive range of corporate and sports awards, designed to inspire pride and motivation.",
    image: joinBase("/uploads/images/Oscer/award1.jpeg"),
    secondaryImage: joinBase("/uploads/images/Oscer/banner5.jpg"),
    ctaText: "VIEW AWARDS",
    ctaLink: "/products?category=football-awards",
    badge: "Professional • Premium Look",
    category: "AWARDS"
  },
  {
    id: 5,
    title: "Momento",
    subtitle: "Custom Momentos for Every Occasion",
    description:
      "Our custom momentos are perfect for honoring achievements, anniversaries, and special occasions.",
    image: joinBase("/uploads/images/Oscer/Momento1.webp"),
    secondaryImage: joinBase("/uploads/images/Oscer/Momento2.png"),
    ctaText: "SHOP MOMENTOS",
    ctaLink: "/products?category=paperweights",
    badge: "Personalized • Long Lasting",
    category: "MOMENTO"
  },
  {
    id: 6,
    title: "Sports",
    subtitle: "Sports Trophies & Awards",
    description:
      "Celebrate sporting excellence with our durable and stylish sports trophies, designed for winners.",
    image: joinBase("/uploads/images/Oscer/sport1.jpg"),
    secondaryImage: joinBase("/uploads/images/Oscer/sport2.jpg"),
    ctaText: "SHOP SPORTS",
    ctaLink: "/products?category=basketball-awards",
    badge: "Durable • Champion Choice",
    category: "SPORTS"
  },
  {
    id: 7,
    title: "Gifts",
    subtitle: "Premium Corporate Gifts",
    description:
      "Ideal for corporate recognition and client appreciation.",
     
    image: joinBase("/uploads/images/Oscer/gift1.webp"),
    secondaryImage: joinBase("/uploads/images/Oscer/gift.jpg"),
    ctaText: "SHOP GIFTS",
    ctaLink: "/products?category=art-glass",
    badge: "Elegant • Corporate Choice",
    category: "GIFTS"
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopNow }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;


    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = heroSlides[currentSlide];



  return (
    <section className="relative h-screen overflow-hidden bg-white">
      {/* Main Container */}
      <div className="relative h-full flex">

        {/* Magazine-style Layout with smooth transitions */}
        <div className="relative w-full h-full transition-all duration-500 ease-in-out">

          {/* Left Image - Larger, positioned top-left */}
          <div className="absolute left-0 top-0 w-full h-[45%] md:left-6 md:top-8 md:w-2/5 md:h-3/4 z-10 transition-all duration-500 ease-in-out">
            <div className="relative w-full h-full overflow-hidden image-hover-zoom rounded-lg shadow-lg">
              <Image
                src={currentSlideData.image}
                alt={currentSlideData.subtitle}
                fill
                className="object-contain transition-all duration-500 ease-in-out"
                priority
              />
            </div>
          </div>

          {/* Right Image - Even Larger, positioned top-right */}
          {currentSlideData.secondaryImage && (
            <div className="absolute right-0 bottom-0 w-full h-[45%] md:right-4 md:top-8 md:w-1/2 md:h-4/5 md:bottom-auto z-10 transition-all duration-500 ease-in-out">
              <div className="relative w-full h-full overflow-hidden image-hover-zoom rounded-lg shadow-lg">
                <Image
                  src={currentSlideData.secondaryImage}
                  alt={`${currentSlideData.subtitle} - Secondary`}
                  fill
                  className="object-contain transition-all duration-500 ease-in-out"
                />
              </div>
            </div>
          )}

          {/* White Content Box - Centered, Even Larger & Vertical */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-6 md:p-12 shadow-2xl z-30 w-[90%] md:w-[520px] h-auto md:h-[650px] rounded-lg flex flex-col justify-center">

            {/* Navigation Arrows inside content box - Centered */}
            <div className="absolute top-2 md:top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-8">
              <button
                onClick={prevSlide}
                className="text-black hover:text-gray-600 transition-all duration-200 hover:scale-110"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="text-black hover:text-gray-600 transition-all duration-200 hover:scale-110"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Main Content */}
            <div className="space-y-2 md:space-y-4 text-center flex flex-col justify-center pt-8 md:pt-12">
              <h1 className="text-3xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-none tracking-tight">
                {currentSlideData.title}
              </h1>

              <h3 className="text-lg md:text-2xl lg:text-3xl font-medium text-gray-700 leading-relaxed mt-2 md:mt-3">
                {currentSlideData.subtitle}
              </h3>

              <p className="text-gray-600 leading-relaxed text-sm md:text-lg font-light px-2 md:px-4 mt-2 md:mt-4 max-w-sm mx-auto">
                {currentSlideData.description}
              </p>

              {/* CTA Button */}
              <div>
                <Link
                  href={currentSlideData.ctaLink}
                  className="inline-block px-4 py-2 md:px-6 md:py-3 bg-orange-500 text-white font-medium text-xs md:text-sm uppercase tracking-wider hover:bg-orange-600 transition-colors duration-200 rounded mt-2 md:mt-4"
                >
                  {currentSlideData.ctaText}
                </Link>
              </div>
            </div>

            {/* Vertical Category Text - Positioned outside the box */}
            <div className="hidden md:block absolute -right-16 top-1/2 transform -translate-y-1/2 -rotate-90 origin-center">
              <h2 className="text-3xl font-bold text-gray-300 tracking-[0.2em] uppercase">
                {currentSlideData.category}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 md:bottom-8 left-8 right-8 flex items-center justify-center md:justify-between z-30">
        {/* Navigation Arrows */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={prevSlide}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 hover:scale-105 border border-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 hover:scale-105 border border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex items-center space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-orange-500 scale-125 shadow-lg shadow-orange-500/50'
                  : 'bg-white/40 hover:bg-white/60 border border-white/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Clean Styles */}
      <style jsx>{`
        h1, h3, p {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        h1 {
          font-weight: 700;
          letter-spacing: -0.025em;
        }

        h3 {
          font-weight: 400;
          letter-spacing: -0.01em;
        }

        p {
          font-weight: 400;
          line-height: 1.6;
        }
      `}</style>
    </section>
  );
};
