'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { 
  Headphones, 
  Mail, 
  Phone, 
  MessageCircle, 
  Clock,
  HelpCircle,
  FileText,
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function SupportPage() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    topic: '',
    message: ''
  });

  const supportTopics = [
    'Order Status',
    'Shipping Question',
    'Return/Exchange',
    'Product Question',
    'Payment Issue',
    'Account Help',
    'Technical Issue',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Support request submitted:', formData);
    alert('Thank you! Your support request has been submitted. We\'ll get back to you within 24 hours.');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900">Customer Support</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <Headphones className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Support</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help! Get in touch with our friendly support team for any questions or concerns.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Mail className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Get detailed help via email</p>
            <p className="text-sm text-gray-500 mb-4">Response time: 2-4 hours</p>
            <a 
              href="mailto:sales@printoscar.xendekweb.com"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
            >
              sales@printoscar.com
              <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Phone className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">Speak directly with our team</p>
            <p className="text-sm text-gray-500 mb-4">Mon-Fri 9AM-6PM EST</p>
            <a 
              href="tel:+15712958929"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
            >
              +1 571-295-8929
              <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <MessageCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Instant help when you need it</p>
            <p className="text-sm text-gray-500 mb-4">Mon-Fri 9AM-6PM EST</p>
            <button className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium">
              Start Chat
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Support Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number (if applicable)
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., ORD-12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What can we help you with? *
                </label>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select a topic...</option>
                  {supportTopics.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder="Please describe your question or issue in detail..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Quick Help */}
          <div className="space-y-6">
            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-orange-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday:</span>
                  <span className="font-medium text-gray-900">9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday:</span>
                  <span className="font-medium text-gray-900">10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday:</span>
                  <span className="font-medium text-gray-900">Closed</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">We're currently online!</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Help</h3>
              <div className="space-y-3">
                <Link href="/faq" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                  <HelpCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">FAQ</div>
                    <div className="text-sm text-gray-600">Find answers to common questions</div>
                  </div>
                </Link>
                
                <Link href="/track-order" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                  <FileText className="h-5 w-5 text-orange-500 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Track Order</div>
                    <div className="text-sm text-gray-600">Check your order status</div>
                  </div>
                </Link>
                
                <Link href="/returns" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                  <Users className="h-5 w-5 text-orange-500 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Returns & Exchanges</div>
                    <div className="text-sm text-gray-600">Start a return or exchange</div>
                  </div>
                </Link>
                
                <Link href="/shipping" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                  <FileText className="h-5 w-5 text-orange-500 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Shipping Info</div>
                    <div className="text-sm text-gray-600">Learn about shipping options</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Response Times */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Times</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 text-orange-500 mr-2" />
                    <span className="text-sm text-gray-600">Live Chat</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Immediate</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-orange-500 mr-2" />
                    <span className="text-sm text-gray-600">Phone</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Immediate</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-orange-500 mr-2" />
                    <span className="text-sm text-gray-600">Email</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">2-4 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-orange-500 mr-2" />
                    <span className="text-sm text-gray-600">Support Form</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">4-24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Additional Resources</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <HelpCircle className="h-8 w-8 text-orange-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Help Center</h3>
              <p className="text-sm text-gray-600 mb-3">Browse our comprehensive help articles</p>
              <Link href="/faq" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                Visit Help Center →
              </Link>
            </div>
            
            <div className="text-center">
              <Users className="h-8 w-8 text-orange-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-sm text-gray-600 mb-3">Connect with other PrintOscar customers</p>
              <Link href="/shop-local" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                Join Community →
              </Link>
            </div>
            
            <div className="text-center">
              <FileText className="h-8 w-8 text-orange-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Order Status</h3>
              <p className="text-sm text-gray-600 mb-3">Track your orders and view history</p>
              <Link href="/track-order" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                Track Orders →
              </Link>
            </div>
            
            <div className="text-center">
              <Mail className="h-8 w-8 text-orange-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-3">Get updates and exclusive offers</p>
              <Link href="/#newsletter" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                Subscribe →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
