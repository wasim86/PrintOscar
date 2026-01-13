'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin
} from 'lucide-react';
import { API_BASE_URL } from '@/services/config';
import { HandmadeInquiryForm } from '@/components/Contact/HandmadeInquiryForm';
import { useRecaptchaForm } from '@/hooks/useRecaptcha';
import { RECAPTCHA_ACTIONS } from '@/services/recaptcha';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    hearAbout: 'Instagram'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // reCAPTCHA integration
  const recaptcha = useRecaptchaForm(RECAPTCHA_ACTIONS.CONTACT_FORM, {
    onError: (error) => {
      setErrors(prev => ({ ...prev, recaptcha: error }));
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    // Use reCAPTCHA verification
    const success = await recaptcha.verifyAndSubmit(async (recaptchaToken) => {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          hearAbout: formData.hearAbout,
          recaptchaToken: recaptchaToken
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
            hearAbout: 'Instagram'
          });
        }, 3000);
      } else {
        // Handle API error
        throw new Error(result.message || 'Failed to send message. Please try again.');
      }
    });

    if (!success) {
      setErrors({
        submit: 'Failed to send message. Please try again.'
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us A Message</h2>
                <p className="text-gray-600 mb-8">Contact us to get any support or help.</p>

                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">Thank you for contacting us. We'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Your name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 text-black'
                        }`}
                        required
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Your email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                          errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 text-black'
                        }`}
                        required
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                          errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300 text-black'
                        }`}
                        required
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="hearAbout" className="block text-sm font-medium text-gray-700 mb-2">
                        Where did you hear about us?
                      </label>
                      <select
                        id="hearAbout"
                        value={formData.hearAbout}
                        onChange={(e) => handleInputChange('hearAbout', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-black"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Google">Google</option>
                        <option value="Friend">Friend/Family</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Your message
                      </label>
                      <textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors resize-none text-black ${
                          errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                      )}
                    </div>

                    {errors.submit && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{errors.submit}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting || recaptcha.isVerifying}
                      className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {recaptcha.isVerifying ? 'VERIFYING...' : isSubmitting ? 'SENDING...' : 'SUBMIT'}
                    </button>

                    {/* reCAPTCHA Status */}
                    {recaptcha.error && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">Security verification failed. Please try again.</p>
                      </div>
                    )}

                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500">
                        This site is protected by reCAPTCHA and the Google{' '}
                        <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>{' '}
                        and{' '}
                        <a href="https://policies.google.com/terms" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                        apply.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <div className="space-y-8">
                {/* Get In Touch */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                  <p className="text-gray-600 mb-8">
                    Feel free to reach us if you need any assistance.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 text-orange-500 mr-3" />
                      <span>Monday - Friday 5pm to 11pm EST</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 text-orange-500 mr-3" />
                      <span>Saturday - Sunday 8am to 2pm EST</span>
                    </div>
                  </div>
                </div>

                {/* Customer Support */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Support</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                        <Phone className="h-5 w-5 text-orange-600" />
                      </div>
                      <span className="text-gray-900 font-medium">+1 201-659-1588</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                        <Mail className="h-5 w-5 text-orange-600" />
                      </div>
                      <span className="text-gray-900 font-medium">contact@printoscar.com</span>
                    </div>
                  </div>
                </div>

                {/* Our US HQ */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Our US HQ</h3>
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">549 Newark Ave, Jersey City, NJ 07306, United States</p>
                      <a href="/shop-local" className="mt-2 inline-block px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        SHOP LOCAL
                      </a>
                    </div>
                  </div>
                </div>

                {/* Our Nigeria HQ */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Nigeria HQ</h3>
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <p className="text-gray-900 font-medium">549 Newark Ave, Jersey City, NJ 07306, United States</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Handmade to Order Inquiry Section */}
        <HandmadeInquiryForm />
      </main>

      <Footer />
    </div>
  );
}
