'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NavigationLink } from '@/components/Navigation';
import {
  ArrowRight,
  Trophy,
  Award,
  Medal,
  Gift,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const categories = [
  {
    id: 'trophies',
    name: 'Trophies',
    description: 'Premium sports & corporate trophies with custom engraving',
    image:
      'https://img.freepik.com/premium-photo/trophy-against-gray-background_1048944-23010536.jpg?semt=ais_hybrid&w=740&q=80',
    href: '/products?category=trophies',
    icon: <Trophy className="h-8 w-8" />,
    productCount: 120
  },
  {
    id: 'plaques',
    name: 'Awards & Plaques',
    description: 'Elegant awards for recognition & achievements',
    image:
      'https://www.shutterstock.com/image-vector/award-round-podium-glass-trophy-600nw-2607463369.jpg',
    href: '/products?category=plaques-executive-awards',
    icon: <Award className="h-8 w-8" />,
    productCount: 85
  },
  {
    id: 'medals',
    name: 'Medals',
    description: 'Gold, silver & bronze medals for champions',
    image:
      'https://t4.ftcdn.net/jpg/11/24/29/81/360_F_1124298122_18TrrxmHfTXvByuDsS2HrTc8tssgopYI.jpg',
    href: '/products?category=medals',
    icon: <Medal className="h-8 w-8" />,
    productCount: 150
  },
  {
    id: 'crystal-awards',
    name: 'Crystal Awards',
    description: 'Premium customized crystal awards & gifts',
    image:
      'https://cdn.shopify.com/s/files/1/0850/8348/8530/files/Website_Banner_Size_15_600x600.jpg?v=1733834912',
    href: '/products?category=crystal',
    icon: <Gift className="h-8 w-8" />,
    productCount: 60
  }
];

export const CategoryGrid = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const perSlide = 2;
  const totalSlides = Math.ceil(categories.length / perSlide);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % totalSlides);
    }, 4500);
    return () => clearInterval(timer);
  }, [totalSlides]);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Trophy & Awards Collection
          </h2>
          <p className="text-lg text-gray-600">
            Celebrate success with premium trophies, medals & awards
          </p>
        </div>

        <div className="relative">
          {/* Arrows */}
          <button
            onClick={() =>
              setCurrentSlide(
                (p) => (p - 1 + totalSlides) % totalSlides
              )
            }
            className="absolute -left-6 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-4 rounded-full shadow-lg z-10"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={() =>
              setCurrentSlide((p) => (p + 1) % totalSlides)
            }
            className="absolute -right-6 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-4 rounded-full shadow-lg z-10"
          >
            <ChevronRight />
          </button>

          {/* Slider */}
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, i) => {
                const items = categories.slice(
                  i * perSlide,
                  i * perSlide + perSlide
                );

                return (
                  <div key={i} className="w-full flex-shrink-0">
                    <div className="grid md:grid-cols-2 gap-8 px-2">
                      {items.map((cat) => (
                        <NavigationLink
                          key={cat.id}
                          href={cat.href}
                          className="group relative rounded-3xl overflow-hidden shadow-xl bg-black"
                        >
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-[420px] object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                          <div className="absolute bottom-0 p-8 text-white">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="bg-orange-500 p-3 rounded-full">
                                {cat.icon}
                              </div>
                              <h3 className="text-3xl font-bold">
                                {cat.name}
                              </h3>
                            </div>

                            <p className="mb-4 text-white/90">
                              {cat.description}
                            </p>

                            <div className="flex justify-between items-center">
                              <span className="text-sm">
                                {cat.productCount}+ Products
                              </span>
                              <span className="flex items-center gap-2 text-orange-400 font-semibold">
                                Explore
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                              </span>
                            </div>
                          </div>
                        </NavigationLink>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <span
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  i === currentSlide ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
