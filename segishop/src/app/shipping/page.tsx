'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { usePriceUtils } from '@/utils/priceUtils';
import { 
  Truck, 
  Clock, 
  MapPin, 
  Package, 
  Shield,
  Globe,
  Calculator,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function ShippingPage() {
  const { convertAndFormatPrice } = usePriceUtils();
  const [zipCode, setZipCode] = useState('');
  const [estimatedDays, setEstimatedDays] = useState<string | null>(null);

  const calculateShipping = () => {
    // Simple zip code validation and estimation
    if (zipCode.length === 5) {
      // Mock calculation based on zip code
      const firstDigit = parseInt(zipCode[0]);
      if (firstDigit <= 2) {
        setEstimatedDays('2-3 business days');
      } else if (firstDigit <= 6) {
        setEstimatedDays('3-4 business days');
      } else {
        setEstimatedDays('4-5 business days');
      }
    }
  };

  const shippingOptions = [
    {
      name: 'Standard Shipping',
      price: `FREE on orders ${convertAndFormatPrice(75)}+`,
      time: '5-7 business days',
      description: 'Our most popular shipping option',
      icon: Package
    },
    {
      name: 'Express Shipping',
      price: convertAndFormatPrice(15.00),
      time: '2-3 business days',
      description: 'Faster delivery for urgent orders',
      icon: Truck
    },
    {
      name: 'Next Day Air',
      price: convertAndFormatPrice(25.00),
      time: '1 business day',
      description: 'Get your order tomorrow',
      icon: Clock
    }
  ];

  const internationalRates = [
    { region: 'Canada', price: convertAndFormatPrice(12.99), time: '7-14 business days' },
    { region: 'Europe', price: convertAndFormatPrice(19.99), time: '10-21 business days' },
    { region: 'Asia Pacific', price: convertAndFormatPrice(24.99), time: '14-28 business days' },
    { region: 'Rest of World', price: convertAndFormatPrice(29.99), time: '14-35 business days' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900">Shipping Information</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <Truck className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fast, reliable shipping to get your favorite snacks and handmade items delivered safely to your door.
          </p>
        </div>

        {/* Free Shipping Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 mb-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">🚚 FREE SHIPPING on orders $75+</h2>
          <p className="text-orange-100">
            Enjoy complimentary standard shipping on all orders over $75 within the continental US
          </p>
        </div>

        {/* Shipping Calculator */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center mb-6">
            <Calculator className="h-6 w-6 text-orange-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Shipping Calculator</h2>
          </div>
          
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your ZIP code to estimate delivery time:
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="12345"
                maxLength={5}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <button
                onClick={calculateShipping}
                className="px-6 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Calculate
              </button>
            </div>
            {estimatedDays && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    Estimated delivery: {estimatedDays}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Domestic Shipping Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">US Domestic Shipping</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {shippingOptions.map((option, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                <div className="flex items-center mb-4">
                  <option.icon className="h-8 w-8 text-orange-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">{option.name}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="font-medium text-gray-900">{option.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Delivery:</span>
                    <span className="font-medium text-gray-900">{option.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{option.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Shipping Protection</h4>
                <p className="text-sm text-blue-800">
                  All shipments are insured and tracked. We'll handle any shipping issues that arise.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* International Shipping */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center mb-6">
            <Globe className="h-6 w-6 text-orange-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">International Shipping</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            We ship worldwide! International shipping rates and delivery times vary by destination.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Region</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Shipping Cost</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Delivery Time</th>
                </tr>
              </thead>
              <tbody>
                {internationalRates.map((rate, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">{rate.region}</td>
                    <td className="py-3 px-4 text-gray-900">{rate.price}</td>
                    <td className="py-3 px-4 text-gray-600">{rate.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 mb-1">International Shipping Notes</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Customs duties and taxes may apply and are the responsibility of the recipient</li>
                  <li>• Some food items may be restricted in certain countries</li>
                  <li>• Delivery times may vary due to customs processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Policies */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Policies</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Time</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Most orders ship within 1-2 business days</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Handmade items may require 2-3 business days</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Custom orders may take 5-7 business days</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Orders placed after 2 PM EST ship next business day</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Packaging</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Eco-friendly packaging materials</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Fragile items receive extra protection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Food items are temperature-controlled when needed</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Handmade items wrapped with care</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Shipping Restrictions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Restrictions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Areas We Don't Ship To</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• PO Boxes (for perishable items only)</li>
                  <li>• APO/FPO addresses (contact us for special arrangements)</li>
                  <li>• Some remote locations may have additional fees</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Handling Items</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Chocolate items may require expedited shipping in summer</li>
                  <li>• Large handmade items may require freight shipping</li>
                  <li>• Fragile decor items include insurance automatically</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions About Shipping?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Our Shipping Team</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-600">Falls Church, Virginia USA</span>
                </div>
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-600">sales@printoscar.xendekweb.com</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-600">Mon-Fri 9AM-6PM EST</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/track-order" className="block text-orange-600 hover:text-orange-700">
                  Track Your Order →
                </Link>
                <Link href="/returns" className="block text-orange-600 hover:text-orange-700">
                  Returns & Exchanges →
                </Link>
                <Link href="/contact" className="block text-orange-600 hover:text-orange-700">
                  Contact Customer Service →
                </Link>
                <Link href="/faq" className="block text-orange-600 hover:text-orange-700">
                  Shipping FAQ →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
