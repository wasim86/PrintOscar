'use client';

import React, { useState } from 'react';
import {
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Globe,
  Clock
} from 'lucide-react';
import { NavigationLink } from '@/components/Navigation';
import { API_BASE_URL } from '@/services/config';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubscribed(true);
        setEmail('');
        setTimeout(() => setIsSubscribed(false), 3000);
      } else {
        setError(result.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-x-6">

          {/* Company Info & Newsletter */}
          <div className="lg:col-span-1">
            <div className="flex justify-center lg:justify-start mb-6">
              <NavigationLink href="/" className="inline-block">
                <img
                  src="/uploads/logo/logo.png"
                  alt="SegiShop"
                  className="h-32 w-auto object-contain filter brightness-110"
                />
              </NavigationLink>
            </div>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed text-center lg:text-left">
              Premium snacks and handmade goods delivered with care.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-white text-sm">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-gray-800 border border-gray-700 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder-gray-400"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 text-white py-1.5 px-3 rounded hover:bg-orange-600 transition-colors duration-200 font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>

              {/* Error Display */}
              {error && (
                <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-xs">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              {isSubscribed && (
                <p className="text-green-400 text-xs mt-1">✓ Successfully subscribed!</p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><NavigationLink href="/" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">Home</NavigationLink></li>
              <li><NavigationLink href="/shop" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">Shop</NavigationLink></li>
              <li><NavigationLink href="/about" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">About Us</NavigationLink></li>
              <li><NavigationLink href="/contact" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">Contact Us</NavigationLink></li>
            </ul>
          </div>

          {/* Shop by Category */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Shop by Category</h4>
            <ul className="space-y-2 text-sm">
              <li><NavigationLink href="/products?category=trophies" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">Trophy</NavigationLink></li>
              <li><NavigationLink href="/products?category=medals" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">Medals</NavigationLink></li>
              <li><NavigationLink href="/products?category=art-glass" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">Gift</NavigationLink></li>
              <li><NavigationLink href="/products?category=achiever-and-star-awards" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">Awards</NavigationLink></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><NavigationLink href="/track-order" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">Track Your Order</NavigationLink></li>
              <li><NavigationLink href="/terms-of-sale" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">Terms & Conditions</NavigationLink></li>
              <li><NavigationLink href="/privacy" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">Privacy Policy</NavigationLink></li>
              <li><NavigationLink href="/after-sales-services" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">After Sales Services</NavigationLink></li>
              <li><NavigationLink href="/cookie-policy" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">Cookie Policy</NavigationLink></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Get in Touch</h4>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-orange-500" />
                <span className="text-gray-300">+1 201-659-1588</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-orange-500" />
                <span className="text-gray-300">contact@printoscar.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span className="text-gray-300">549 Newark Ave, Jersey City, NJ 07306, United States</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-orange-500" />
                <a
                  href="https://printoscar.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-orange-500 transition-colors duration-200"
                >
                  printoscar.com
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mb-6">
              <h5 className="font-medium mb-2 text-orange-500">Business Hours</h5>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-gray-300 text-sm">Mon - Fri: 9:00 PM - 6:00 PM   Saturday: 12:00 PM - 3:00 PM</span>
                
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h5 className="font-medium mb-3 text-white">Follow Us</h5>
              <div className="flex flex-wrap gap-3">
                <a href="https://www.facebook.com/Oscar.printingbanners/" className="text-gray-300 hover:text-orange-500 transition-colors duration-200" title="Facebook">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://in.pinterest.com/06g1qmdzxmtpdi1h83f8cfoirrpr11/" className="text-gray-300 hover:text-orange-500 transition-colors duration-200" title="Pinterest">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.137 3.348 9.505 7.994 11.047-.11-.949-.21-2.405.044-3.44.229-.93 1.475-6.252 1.475-6.252s-.377-.754-.377-1.87c0-1.751 1.016-3.057 2.281-3.057 1.075 0 1.594.808 1.594 1.776 0 1.081-.69 2.697-1.045 4.196-.297 1.26.632 2.288 1.874 2.288 2.249 0 3.982-2.37 3.982-5.795 0-3.031-2.178-5.155-5.286-5.155-3.601 0-5.719 2.7-5.719 5.48 0 1.085.417 2.251.937 2.884.103.125.117.234.087.36-.094.4-.302 1.235-.343 1.408-.054.22-.177.267-.408.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988 0-6.621-5.366-11.987-11.99-11.987z"/>
           </svg>
           </a>
           
                <a href="https://www.instagram.com/oscar_printingg/" className="text-gray-300 hover:text-orange-500 transition-colors duration-200" title="Instagram">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              <a href="https://x.com/oscar_printing" className="text-gray-300 hover:text-orange-500 transition-colors duration-200" title="X (Twitter)">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
           
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

            {/* Payment Icons */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm mr-2">We Accept:</span>
              <div className="flex space-x-1">
                <div className="bg-white rounded px-2 py-1">
                  <CreditCard className="h-4 w-4 text-gray-600" />
                </div>
                <div className="bg-blue-600 rounded px-2 py-1">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div className="bg-red-600 rounded px-2 py-1">
                  <span className="text-white text-xs font-bold">MC</span>
                </div>
                <div className="bg-blue-500 rounded px-2 py-1">
                  <span className="text-white text-xs font-bold">AMEX</span>
                </div>
                <div className="bg-indigo-600 rounded px-2 py-1">
                  <span className="text-white text-xs font-bold">PayPal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} All rights reserved. | Made with ❤️ in Falls Church, Virginia
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-200 z-40"
        aria-label="Back to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </footer>
  );
};
