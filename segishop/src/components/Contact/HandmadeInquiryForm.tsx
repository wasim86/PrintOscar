'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Upload, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  MapPin,
  Palette,
  Package,
  Heart,
  Star,
  Camera,
  CheckCircle
} from 'lucide-react';
import { API_BASE_URL } from '@/services/config';

interface FormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  preferredContact: 'text' | 'email' | 'call';

  itemType: 'bag' | 'dress' | 'robe' | 'tunic' | '';

  needByDate: string;
  shippingAddress: string;

  dressLength: string;
  dressColors: string;
  totalDresses: string;
  bagStyle: string;
  bagSize: string;
  bagQuantity: string;
  funKitFill: boolean;
  customLabels: boolean;
  detailedPreferences: string;
  inspirationImage: File | null;
  colorInspirationImage: File | null;
  productLink: string;
  referralSource: string;
}

export const HandmadeInquiryForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    countryCode: '+1',
    preferredContact: 'email',
    itemType: '',
    needByDate: '',
    shippingAddress: '',
    dressLength: '',
    dressColors: '',
    totalDresses: '',
    bagStyle: '',
    bagSize: '',
    bagQuantity: '',
    funKitFill: false,
    customLabels: false,
    detailedPreferences: '',
    inspirationImage: null,
    colorInspirationImage: null,
    productLink: '',
    referralSource: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/inquiry/handmade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setErrors({ submit: result.message || 'Submission failed. Please try again.' });
      }
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Contact PrintOscar – Custom Orders & Branding
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Looking for custom trophies, awards, printed bags, apparel, or event branding?
            Share your requirements and our team will assist you with a tailored solution.
          </p>
        </div>

        {/* VISUAL INTRO */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Star className="h-5 w-5 text-orange-500 mr-2" />
              Custom Trophies & Awards
            </h3>
            <p className="text-gray-600 mb-4">
              Premium trophies, plaques, medals, and awards designed for schools,
              corporate events, sports tournaments, and special occasions.
            </p>
            <Image src="https://images.prestogifts.com/upload/New-Product-Listing/NEW-TROPHY-SERIES/T-3023-B/369x369/673b3e0ee026b_T-3023-B-369-BG.webp" alt="Custom Trophies" width={500} height={300} className="rounded-lg" />
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Package className="h-5 w-5 text-orange-500 mr-2" />
              Custom Printed Products
            </h3>
            <p className="text-gray-600 mb-4">
              Branded bags, apparel, gifts, and promotional items with high-quality
              printing and finishing.
            </p>
            <Image src="https://image.made-in-china.com/202f0j00TYgbWERqBkpG/Custom-Acrylic-Crystal-Trophy-for-Sports-Events-and-Awards.webp" alt="Printed Bags" width={500} height={300} className="rounded-lg" />
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white p-8 rounded-lg border shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-16">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
              <p className="text-gray-600">
                Your request has been received. Our PrintOscar team will contact you
                within 24–48 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* CONTACT DETAILS */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <Mail className="h-5 w-5 text-orange-500 mr-2" />
                  Contact Information
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <input placeholder="Full Name *" required
                    className="input" value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)} />
                  <input placeholder="Email Address *" required
                    className="input" value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)} />
                </div>
              </div>

              {/* PROJECT DETAILS */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <Palette className="h-5 w-5 text-orange-500 mr-2" />
                  Project Details
                </h4>
                <textarea
                  rows={5}
                  required
                  placeholder="Please describe your requirement: product type, quantity, logo, text, colors, event name, deadline, etc."
                  className="w-full border rounded-lg p-4"
                  value={formData.detailedPreferences}
                  onChange={e => handleInputChange('detailedPreferences', e.target.value)}
                />
              </div>

              {/* NOTE */}
              <div className="bg-orange-50 border border-orange-200 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> All custom orders are produced using PrintOscar
                  approved materials and branding standards to ensure quality and durability.
                </p>
              </div>

              {/* ERROR */}
              {errors.submit && (
                <p className="text-red-600 text-sm">{errors.submit}</p>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Your Requirement'}
              </button>

              <p className="text-center text-sm text-gray-500 mt-2">
                PrintOscar • Custom Printing • Awards • Trophies • Branding Solutions
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
