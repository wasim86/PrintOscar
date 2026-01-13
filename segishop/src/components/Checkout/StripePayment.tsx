'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Lock, CreditCard } from 'lucide-react';
import { SimplePriceDisplay } from '@/components/Currency/PriceDisplay';
import { useCurrency } from '@/contexts/CurrencyContext';
import PaymentApiService from '@/services/payment-api';

import { getPublicPaymentConfig } from '@/services/public-payment-config';

// Dynamic initialization from backend config
let initialStripePromise: Promise<any> | null = null;

interface StripePaymentFormProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onPending: (paymentIntent: any) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  onSuccess,
  onPending,
  onError,
  isProcessing,
  setIsProcessing
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { currentCurrency } = useCurrency();
  const [clientSecret, setClientSecret] = useState<string>('');

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await PaymentApiService.createStripePaymentIntent({
          amount,
          currency: currentCurrency.code.toLowerCase(),
          metadata: {
            source: 'checkout',
            timestamp: new Date().toISOString()
          }
        });

        if (response.success && response.clientSecret) {
          setClientSecret(response.clientSecret);
        } else {
          onError(response.error || 'Failed to initialize payment');
        }
      } catch (error: any) {
        onError(error.message || 'Failed to initialize payment');
      }
    };

    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      onError('Payment system not ready');
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent) {
        // Handle different payment intent statuses
        switch (paymentIntent.status) {
          case 'succeeded':
            onSuccess(paymentIntent);
            break;
          case 'processing':
          case 'requires_action':
            onPending(paymentIntent);
            break;
          case 'requires_payment_method':
          case 'canceled':
            onError('Payment was declined. Please try a different payment method.');
            break;
          default:
            onError(`Payment status: ${paymentIntent.status}. Please contact support.`);
        }
      }
    } catch (error: any) {
      onError(error.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-lg">
        <div className="flex items-center mb-3">
          <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">Card Information</span>
        </div>
        <CardElement options={cardElementOptions} />
      </div>

      <div className="flex items-center text-sm text-gray-600">
        <Lock className="h-4 w-4 mr-2" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        className="w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? 'Processing...' : (
          <>
            Pay <SimplePriceDisplay
              price={amount}
              size="sm"
              className="inline"
            />
          </>
        )}
      </button>
    </form>
  );
};

interface StripePaymentProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onPending: (paymentIntent: any) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const StripePayment: React.FC<StripePaymentProps> = (props) => {
  const [stripe, setStripe] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cfg = await getPublicPaymentConfig();
        const key = cfg.stripePublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
        if (!key) {
          if (mounted) setLoading(false);
          return;
        }
        initialStripePromise = loadStripe(key);
        const s = await initialStripePromise;
        if (mounted) {
          setStripe(s);
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">Loading payment...</div>;
  }

  if (!stripe) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Stripe payment is not configured. Please contact support.</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripe}>
      <StripePaymentForm {...props} />
    </Elements>
  );
};

export default StripePayment;
