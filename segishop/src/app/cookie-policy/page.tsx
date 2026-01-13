'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { 
  Cookie, 
  Shield, 
  Settings, 
  BarChart3,
  Globe,
  Clock,
  Info
} from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900">Cookie Policy</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <Cookie className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about how Print Oscar uses cookies to improve your experience on our website.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last Updated: January 2026</p>
        </div>

        {/* Cookie Policy Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
          
          {/* What Are Cookies */}
          <section>
            <div className="flex items-center mb-4">
              <Info className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">What Are Cookies?</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
                They help websites remember information about your visit, which can make it easier to visit the site again 
                and make the site more useful to you.
              </p>
            </div>
          </section>

          {/* How We Use Cookies */}
          <section>
            <div className="flex items-center mb-4">
              <Settings className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">How Print Oscar Uses Cookies</h2>
            </div>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Print Oscar uses cookies to ensure that we give you the best experience on our website. Here's how we use them:
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Essential Cookies</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Remember your login status and shopping cart contents</li>
                  <li>Maintain your session while browsing our site</li>
                  <li>Store your language and currency preferences</li>
                  <li>Enable secure checkout and payment processing</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">Analytics Cookies</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Help us understand how visitors use our website</li>
                  <li>Track which pages are most popular</li>
                  <li>Measure the effectiveness of our marketing campaigns</li>
                  <li>Improve our website's performance and user experience</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Types of Cookies */}
          <section>
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Types of Cookies We Use</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Session Cookies</h4>
                  <p className="text-gray-700 text-sm">
                    Temporary cookies that are deleted when you close your browser. 
                    These help maintain your session while shopping.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Persistent Cookies</h4>
                  <p className="text-gray-700 text-sm">
                    Remain on your device for a set period or until you delete them. 
                    These remember your preferences for future visits.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Managing Cookies */}
          <section>
            <div className="flex items-center mb-4">
              <Settings className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Managing Your Cookie Preferences</h2>
            </div>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You have control over cookies and can manage them through your browser settings:
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-yellow-800 mb-4">Browser Settings</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Block all cookies (may affect website functionality)</li>
                  <li>Delete existing cookies from your device</li>
                  <li>Set your browser to notify you when cookies are being sent</li>
                  <li>Choose to accept only first-party cookies</li>
                </ul>
              </div>

              <p className="text-gray-700 leading-relaxed">
                <strong>Please note:</strong> Disabling cookies may affect your ability to use certain features 
                of our website, including adding items to your cart and completing purchases.
              </p>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Third-Party Services</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                We may use third-party services that also set cookies on your device:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Payment Processors:</strong> Stripe and PayPal for secure payment processing</li>
                <li><strong>Analytics:</strong> Google Analytics to understand website usage</li>
                <li><strong>Social Media:</strong> Social media platforms for sharing functionality</li>
              </ul>
            </div>
          </section>

          {/* Cookie Retention */}
          <section>
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">How Long We Keep Cookies</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Different cookies have different retention periods:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Session Cookies</h4>
                  <p className="text-gray-700 text-sm">Until browser closes</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Preference Cookies</h4>
                  <p className="text-gray-700 text-sm">1 year</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h4>
                  <p className="text-gray-700 text-sm">2 years</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-orange-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Questions About Cookies?</h3>
            </div>
            <p className="text-gray-700 mb-4">
              If you have any questions about our use of cookies or this cookie policy, please contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Contact Us
              </Link>
              <Link 
                href="/privacy" 
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
