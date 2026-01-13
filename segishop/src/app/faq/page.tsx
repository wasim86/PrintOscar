'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search,
  Package,
  CreditCard,
  Truck,
  RefreshCw,
  Users,
  Mail
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const faqData: FAQItem[] = [
    // Orders & Payment
    {
      id: '1',
      question: 'How do I place an order?',
      answer: 'You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. You\'ll need to provide shipping information and payment details to complete your order.',
      category: 'orders'
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, and Google Pay. All payments are processed securely through our encrypted checkout system.',
      category: 'orders'
    },
    {
      id: '3',
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 2 hours of placing it by contacting our customer service team. After this time, your order may have already been processed and shipped.',
      category: 'orders'
    },
    {
      id: '4',
      question: 'Do you offer bulk or wholesale pricing?',
      answer: 'Yes! We offer special pricing for bulk orders and wholesale customers. Contact us at sales@printoscar.xendekweb.com with your requirements for a custom quote.',
      category: 'orders'
    },

    // Shipping
    {
      id: '5',
      question: 'How much does shipping cost?',
      answer: 'Standard shipping is FREE on orders over $75. For orders under $75, standard shipping is $8.99. Express shipping is $15 and Next Day Air is $25. International shipping rates vary by destination.',
      category: 'shipping'
    },
    {
      id: '6',
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days, Express shipping takes 2-3 business days, and Next Day Air arrives in 1 business day. International shipping takes 7-35 business days depending on the destination.',
      category: 'shipping'
    },
    {
      id: '7',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship worldwide! International shipping costs vary by destination. Please note that customs duties and taxes may apply and are the responsibility of the recipient.',
      category: 'shipping'
    },
    {
      id: '8',
      question: 'Can I track my order?',
      answer: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email. You can also track your order on our Track Order page using your order number.',
      category: 'shipping'
    },

    // Products
    {
      id: '9',
      question: 'Are your snacks organic?',
      answer: 'Many of our snacks are organic, and we clearly label which products are certified organic. Look for the "Organic" badge on product pages or filter by "Organic" in our shop.',
      category: 'products'
    },
    {
      id: '10',
      question: 'Are your handmade items really handmade?',
      answer: 'Yes! All items in our handmade collection are crafted by skilled artisans. Each piece is unique and made with care, which is why slight variations in appearance are normal and part of their charm.',
      category: 'products'
    },
    {
      id: '11',
      question: 'Do you have allergen information?',
      answer: 'Yes, we provide detailed allergen information for all food products. Check the product description or contact us if you have specific allergen concerns.',
      category: 'products'
    },
    {
      id: '12',
      question: 'How long do your snacks stay fresh?',
      answer: 'All our snacks have expiration dates clearly marked. Most packaged snacks stay fresh for 6-12 months when stored properly. We recommend consuming perishable items within the timeframe indicated on the packaging.',
      category: 'products'
    },

    // Returns
    {
      id: '13',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Items must be in original condition and packaging. Food items can only be returned if defective. See our Returns & Exchanges page for full details.',
      category: 'returns'
    },
    {
      id: '14',
      question: 'How do I return an item?',
      answer: 'Start by filling out our return form or contacting customer service. We\'ll provide a return authorization number and prepaid shipping label. Pack the item securely and ship it back to us.',
      category: 'returns'
    },
    {
      id: '15',
      question: 'How long do refunds take?',
      answer: 'Refunds are processed within 3-5 business days after we receive your returned item. The time it takes to appear in your account depends on your payment method and bank.',
      category: 'returns'
    },

    // Account
    {
      id: '16',
      question: 'Do I need an account to place an order?',
      answer: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save your wishlist, view order history, and checkout faster on future orders.',
      category: 'account'
    },
    {
      id: '17',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page and enter your email address. We\'ll send you a link to reset your password. If you don\'t receive the email, check your spam folder.',
      category: 'account'
    },
    {
      id: '18',
      question: 'Can I change my shipping address after ordering?',
      answer: 'You can change your shipping address within 2 hours of placing your order by contacting customer service. After this time, we may not be able to modify the address if the order has already been processed.',
      category: 'account'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'orders', name: 'Orders & Payment', icon: CreditCard },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'returns', name: 'Returns', icon: RefreshCw },
    { id: 'account', name: 'Account', icon: Users }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900">FAQ</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about ordering, shipping, returns, and more.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <category.icon className="h-4 w-4 mr-3" />
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {filteredFAQs.length === 0 ? (
                <div className="p-12 text-center">
                  <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search or browse different categories.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="p-6">
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        {openItems.includes(faq.id) ? (
                          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {openItems.includes(faq.id) && (
                        <div className="mt-4 pr-8">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Mail className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our customer service team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/support"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Link href="/shipping" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <Truck className="h-8 w-8 text-orange-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Shipping Information</h3>
            <p className="text-sm text-gray-600">Learn about our shipping options and delivery times</p>
          </Link>
          
          <Link href="/returns" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <RefreshCw className="h-8 w-8 text-orange-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Returns & Exchanges</h3>
            <p className="text-sm text-gray-600">Easy returns and exchanges within 30 days</p>
          </Link>
          
          <Link href="/track-order" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <Package className="h-8 w-8 text-orange-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Track Your Order</h3>
            <p className="text-sm text-gray-600">Check the status of your order anytime</p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
