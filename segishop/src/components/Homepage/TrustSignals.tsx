'use client';

import React from 'react';
import { Shield, Truck, RotateCcw, Award, Clock, CreditCard } from 'lucide-react';

const trustFeatures = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Secure Payments',
    description: 'SSL encrypted checkout with multiple payment options',
    highlight: '256-bit SSL'
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: 'Free Shipping',
    description: 'Free delivery on orders over $75 within DC Metro',
    highlight: '$75+ Orders'
  },
  {
    icon: <RotateCcw className="h-8 w-8" />,
    title: 'Easy Returns',
    description: 'Hassle-free returns within 30 days of purchase',
    highlight: '30-Day Policy'
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: 'Quality Guarantee',
    description: '100% satisfaction guarantee on all products',
    highlight: '100% Guaranteed'
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: 'Fast Processing',
    description: 'Orders processed within 24 hours on business days',
    highlight: '24hr Processing'
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: 'Multiple Payments',
    description: 'Visa, MasterCard, Amex, Discover, PayPal, Maestro',
    highlight: '6+ Methods'
  }
];

const certifications = [
  {
    name: 'USDA Organic',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop',
    description: 'Certified organic products'
  },
  {
    name: 'Non-GMO',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop',
    description: 'Non-GMO verified ingredients'
  },
  {
    name: 'Local Business',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop',
    description: 'Proudly serving DC Metro'
  },
  {
    name: 'Handmade Quality',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop',
    description: 'Artisan crafted goods'
  }
];

export const TrustSignals: React.FC = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Shop with Confidence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with a secure, reliable, and satisfying shopping experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-2">
                  {feature.description}
                </p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {feature.highlight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Secure Payment Methods
            </h3>
            <p className="text-gray-600">
              Your payment information is always secure and encrypted
            </p>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center items-center gap-4 bg-gray-50 rounded-lg p-6">
              <div className="bg-blue-600 rounded px-3 py-2">
                <span className="text-white text-sm font-bold">VISA</span>
              </div>
              <div className="bg-red-600 rounded px-3 py-2">
                <span className="text-white text-sm font-bold">MC</span>
              </div>
              <div className="bg-blue-500 rounded px-3 py-2">
                <span className="text-white text-sm font-bold">AMEX</span>
              </div>
              <div className="bg-orange-600 rounded px-3 py-2">
                <span className="text-white text-sm font-bold">DISC</span>
              </div>
              <div className="bg-red-700 rounded px-3 py-2">
                <span className="text-white text-sm font-bold">MAESTRO</span>
              </div>
              <div className="bg-blue-700 rounded px-3 py-2">
                <span className="text-white text-sm font-bold">PayPal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div>
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Our Certifications & Standards
            </h3>
            <p className="text-gray-600">
              Trusted certifications that guarantee quality and authenticity
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-sm">
                  <Award className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {cert.name}
                </h4>
                <p className="text-xs text-gray-600">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Need Help?
          </h3>
          <p className="text-gray-600 mb-4">
            Our customer support team is here to help you with any questions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2 text-orange-600" />
              <span className="text-sm">Mon - Fri: 5:00 PM - 11:00 PM</span>
            </div>
            <div className="flex items-center text-gray-700">
              <CreditCard className="h-5 w-5 mr-2 text-orange-600" />
              <span className="text-sm">sales@printoscar.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
