'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Truck, Shield, CreditCard, Award } from 'lucide-react';

const features = [
  {
    icon: <Award className="h-9 w-9" />,
    title: 'PREMIUM TROPHIES & AWARDS',
    description: 'High-quality trophies, plaques, medals and awards with a premium finish.'
  },
  {
    icon: <Shield className="h-9 w-9" />,
    title: 'TRUSTED QUALITY',
    description: 'Reliable craftsmanship trusted by schools, corporates and sports clubs.'
  },
  {
    icon: <Truck className="h-9 w-9" />,
    title: 'FAST DELIVERY',
    description: 'On-time delivery with secure packaging and tracking support.'
  },
  {
    icon: <CreditCard className="h-9 w-9" />,
    title: 'SECURE PAYMENTS',
    description: '100% safe and secure payment processing.'
  }
];

export const UniquelyAuthentic: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Why Choose <span className="text-orange-600">PrintOscar</span>
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We specialize in premium trophies, awards, plaques and customized recognition
            products. Our focus is on quality, reliability and customer satisfaction.
          </p>
        </div>

        {/* Rating */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="h-7 w-7 fill-orange-500 text-orange-500"
              />
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-8 text-center hover:shadow-xl transition"
            >
              <div className="flex justify-center mb-5 text-orange-600">
                {feature.icon}
              </div>

              <h3 className="text-sm font-bold text-gray-900 mb-3 tracking-wide">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 bg-orange-600 rounded-2xl px-10 py-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Celebrate Achievements with Confidence
          </h3>

          <p className="text-lg text-orange-100 mb-6">
            Perfect for schools, sports events, corporate awards and special occasions.
          </p>

          <Link
            href="/products"
            className="inline-block bg-white text-orange-600 font-semibold px-8 py-3 rounded-full hover:bg-orange-100 transition"
          >
            View Our Products
          </Link>
        </div>

      </div>
    </section>
  );
};
