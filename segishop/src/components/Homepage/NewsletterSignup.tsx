'use client';

import React, { useState } from 'react';
import { Mail, Gift, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '@/services/config';
import { useRecaptchaForm } from '@/hooks/useRecaptcha';
import { RECAPTCHA_ACTIONS } from '@/services/recaptcha';

export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // reCAPTCHA integration
  const recaptcha = useRecaptchaForm(RECAPTCHA_ACTIONS.NEWSLETTER_SUBSCRIPTION, {
    onError: (error) => {
      setError('Security verification failed. Please try again.');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');

    // Use reCAPTCHA verification
    const success = await recaptcha.verifyAndSubmit(async (recaptchaToken) => {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          recaptchaToken: recaptchaToken
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubscribed(true);
        setEmail('');
      } else {
        throw new Error(result.message || 'Failed to subscribe. Please try again.');
      }
    });

    if (!success) {
      setError('Failed to subscribe. Please try again.');
    }

    setIsLoading(false);
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <CheckCircle className="h-16 w-16 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to the PrintOscar Family!
            </h2>
            <p className="text-orange-100 text-lg">
              Thank you for subscribing! Check your email for your 10% discount code.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12">
          <div className="text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Mail className="h-8 w-8 text-white" />
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Stay in the Loop
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Get exclusive access to new products, special offers, and healthy living tips. 
              Plus, enjoy 10% off your first order!
            </p>

            {/* Benefits */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
              <div className="flex items-center text-orange-100">
                <Gift className="h-5 w-5 mr-2" />
                <span>10% Off First Order</span>
              </div>
              <div className="flex items-center text-orange-100">
                <Mail className="h-5 w-5 mr-2" />
                <span>Exclusive Offers</span>
              </div>
              <div className="flex items-center text-orange-100">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>New Product Alerts</span>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || recaptcha.isVerifying}
                  className="px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {recaptcha.isVerifying ? 'Verifying...' : isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* reCAPTCHA Notice */}
              <div className="mt-4 text-center">
                <p className="text-xs text-orange-100">
                  This site is protected by reCAPTCHA and the Google{' '}
                  <a href="https://policies.google.com/privacy" className="text-white hover:underline">Privacy Policy</a>{' '}
                  and{' '}
                  <a href="https://policies.google.com/terms" className="text-white hover:underline">Terms of Service</a>{' '}
                  apply.
                </p>
              </div>
            </form>

            {/* Privacy Note */}
            <p className="text-orange-200 text-sm mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
