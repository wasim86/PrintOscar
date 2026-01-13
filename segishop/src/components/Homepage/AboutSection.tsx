'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Leaf, Users, Award, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <Leaf className="h-8 w-8" />,
    title: 'Organic & Natural',
    description: 'All our snacks are certified organic, non-GMO, and made with the finest natural ingredients.'
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: 'Handcrafted Quality',
    description: 'Every handmade item is carefully crafted by local artisans with attention to detail and quality.'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Community Focused',
    description: 'We support local farmers, artisans, and the DC Metro community through our partnerships.'
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: 'Premium Standards',
    description: 'We maintain the highest quality standards and only offer products we would use ourselves.'
  }
];

const stats = [
  { number: '500+', label: 'Happy Customers' },
  { number: '50+', label: 'Organic Products' },
  { number: '5', label: 'Years Experience' },
  { number: '4.9', label: 'Average Rating' }
];

export const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
              <Heart className="h-4 w-4 mr-2 fill-current" />
              Our Story
            </div>

            {/* Main Content */}
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Bringing Quality & 
              <span className="text-orange-600"> Community</span> Together
            </h2>
            
            <p className="text-lg text-gray-600 mb-6">
              Founded in Falls Church, Virginia, PrintOscar began with a simple mission: to provide the DC Metro area 
              with premium organic snacks and unique handmade goods that bring joy to everyday life.
            </p>
            
            <p className="text-gray-600 mb-8">
              We believe in the power of quality ingredients and skilled craftsmanship. Every product in our collection 
              is carefully selected for its exceptional quality, sustainable sourcing, and the story behind its creation. 
              From organic trail mixes to handcrafted ceramics, we're passionate about connecting our community with 
              products that make a difference.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors duration-200"
            >
              Learn More About Us
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>

          {/* Right Content - Images */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
                alt="Segi Shop team preparing organic products"
                className="w-full h-80 object-cover rounded-2xl shadow-lg"
              />
            </div>

            {/* Overlapping Image */}
            <div className="absolute -bottom-8 -left-8 z-20">
              <img
                src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=200&fit=crop"
                alt="Handmade products in our workshop"
                className="w-48 h-32 object-cover rounded-xl shadow-lg border-4 border-white"
              />
            </div>

            {/* Stats Card */}
            <div className="absolute -top-8 -right-8 bg-white rounded-xl shadow-lg p-6 z-20">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {stat.number}
                    </div>
                    <div className="text-xs text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute top-4 right-4 w-32 h-32 bg-orange-200 rounded-full opacity-20 -z-10"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-orange-300 rounded-full opacity-20 -z-10"></div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-20 pt-16 border-t border-gray-200">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do, from product selection to customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Sustainability</h4>
              <p className="text-gray-600">
                We prioritize eco-friendly packaging and partner with suppliers who share our commitment to environmental responsibility.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Community</h4>
              <p className="text-gray-600">
                Supporting local artisans and farmers while building meaningful connections within the DC Metro community.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h4>
              <p className="text-gray-600">
                Every product meets our rigorous quality standards, ensuring you receive only the best organic and handmade items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
