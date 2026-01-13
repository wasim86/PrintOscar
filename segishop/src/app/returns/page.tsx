'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Mail,
  Phone,
  FileText,
  RefreshCw
} from 'lucide-react';

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState<'policy' | 'process' | 'form'>('policy');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900">Returns & Exchanges</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <Package className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Exchanges</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We want you to love your Segi Shop purchase! If you're not completely satisfied, 
            we're here to help with easy returns and exchanges.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('policy')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'policy'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Return Policy
              </button>
              <button
                onClick={() => setActiveTab('process')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'process'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Return Process
              </button>
              <button
                onClick={() => setActiveTab('form')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'form'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Start Return
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'policy' && (
              <div className="space-y-8">
                {/* Return Policy */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Return Policy</h2>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">30-Day Returns</h3>
                      <p className="text-sm text-gray-600">Return items within 30 days of delivery for a full refund</p>
                    </div>
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <RefreshCw className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">Free Exchanges</h3>
                      <p className="text-sm text-gray-600">Exchange for different size or color at no extra cost</p>
                    </div>
                    <div className="text-center p-6 bg-orange-50 rounded-lg">
                      <CheckCircle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
                      <p className="text-sm text-gray-600">All handmade items backed by our quality guarantee</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">What Can Be Returned?</h3>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            Unopened snack items in original packaging
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            Handmade bags, decor, and fashion items in original condition
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            Items with defects or quality issues
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            Wrong items received
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">What Cannot Be Returned?</h3>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                            Opened or consumed food items (unless defective)
                          </li>
                          <li className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                            Custom or personalized items
                          </li>
                          <li className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                            Items returned after 30 days
                          </li>
                          <li className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                            Items damaged by misuse
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'process' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Return Items</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Start Your Return</h3>
                      <p className="text-gray-600 mb-2">
                        Fill out our return form or contact customer service. You'll need your order number and reason for return.
                      </p>
                      <button
                        onClick={() => setActiveTab('form')}
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Start Return Form →
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Get Return Authorization</h3>
                      <p className="text-gray-600">
                        We'll email you a return authorization number and prepaid shipping label within 24 hours.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Package Your Items</h3>
                      <p className="text-gray-600">
                        Pack items securely in original packaging if possible. Include the return authorization number.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Ship Your Return</h3>
                      <p className="text-gray-600">
                        Attach the prepaid label and drop off at any USPS location. We'll email tracking information.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                      5
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Receive Your Refund</h3>
                      <p className="text-gray-600">
                        Once we receive and process your return, refunds are issued within 3-5 business days to your original payment method.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-gray-600 mb-4">
                    Our customer service team is here to help with any questions about returns or exchanges.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      sales@printoscar.com
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      +1 571-295-8929
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'form' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Start Your Return</h2>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Number *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., ORD-12345"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Items to Return *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Please list the items you'd like to return..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Return *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                      <option value="">Select a reason...</option>
                      <option value="defective">Item was defective</option>
                      <option value="wrong-item">Wrong item received</option>
                      <option value="not-as-described">Not as described</option>
                      <option value="changed-mind">Changed my mind</option>
                      <option value="size-issue">Size/fit issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Details
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Please provide any additional details about your return..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Resolution *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="radio" name="resolution" value="refund" className="text-orange-500 focus:ring-orange-500" />
                        <span className="ml-2 text-sm text-gray-700">Full refund to original payment method</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="resolution" value="exchange" className="text-orange-500 focus:ring-orange-500" />
                        <span className="ml-2 text-sm text-gray-700">Exchange for different item</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="resolution" value="store-credit" className="text-orange-500 focus:ring-orange-500" />
                        <span className="ml-2 text-sm text-gray-700">Store credit</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6">
                    <Link
                      href="/track-order"
                      className="inline-flex items-center text-gray-600 hover:text-gray-800"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Track Your Order
                    </Link>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Submit Return Request
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How long do refunds take?</h3>
              <p className="text-gray-600">
                Refunds are processed within 3-5 business days after we receive your returned item. 
                The time it takes to appear in your account depends on your payment method and bank.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do I have to pay for return shipping?</h3>
              <p className="text-gray-600">
                No! We provide prepaid return labels for all returns within the US. 
                For international returns, please contact customer service.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I return opened food items?</h3>
              <p className="text-gray-600">
                Generally, opened food items cannot be returned for health and safety reasons. 
                However, if the item was defective or not as described, we'll gladly accept the return.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What if my handmade item has a defect?</h3>
              <p className="text-gray-600">
                All our handmade items are backed by our quality guarantee. If you receive a defective item, 
                we'll provide a full refund or replacement at no cost to you.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
