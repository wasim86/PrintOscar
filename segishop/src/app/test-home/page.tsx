'use client';

import React from 'react';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';

export default function TestHome() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Test Home Page
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            This is a simple test page to check if the basic routing works without any API calls.
          </p>
          
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✅ React components are working
            </div>
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✅ Header and Footer components are loading
            </div>
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✅ Tailwind CSS is working
            </div>
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✅ Next.js routing is working
            </div>
          </div>

          <div className="mt-8">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Go to Real Home Page
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
