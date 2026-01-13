'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { PaymentMethod, PaymentResult } from '@/app/checkout/page';
import { CreditCard, Smartphone, ArrowLeft, Lock, Shield } from 'lucide-react';
import StripePayment from './StripePayment';
import PayPalPayment from './PayPalPayment';
import { getPublicPaymentConfig } from '@/services/public-payment-config';

interface PaymentFormProps {
  onComplete: (data: PaymentResult) => void;
  onBack: () => void;
  initialData?: PaymentMethod | null;
  orderTotal: number;
  cartItems?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  onComplete,
  onBack,
  initialData,
  orderTotal,
  cartItems = []
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod['type']>(
    initialData?.type || 'credit_card'
  );
  
  const [formData, setFormData] = useState({
    cardNumber: initialData?.cardNumber || '',
    expiryDate: initialData?.expiryDate || '',
    cvv: initialData?.cvv || '',
    cardholderName: initialData?.cardholderName || '',
    sameAsShipping: initialData?.sameAsShipping ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string>('');

  const [paymentConfig, setPaymentConfig] = useState<{ stripeEnabled: boolean; paypalEnabled: boolean } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cfg = await getPublicPaymentConfig();
        if (!mounted) return;
        setPaymentConfig({ stripeEnabled: !!cfg.stripeEnabled, paypalEnabled: !!cfg.paypalEnabled });
        const available = [
          cfg.stripeEnabled ? 'credit_card' : null,
          cfg.paypalEnabled ? 'paypal' : null,
        ].filter(Boolean) as PaymentMethod['type'][];
        if (!available.includes(selectedMethod) && available.length > 0) {
          setSelectedMethod(available[0]);
        }
      } catch {
        // Fallback: assume both available when config fails
        setPaymentConfig({ stripeEnabled: true, paypalEnabled: true });
      }
    })();
    return () => { mounted = false; };
  }, []);

  const paymentMethods = useMemo(() => {
    const stripeOn = paymentConfig?.stripeEnabled ?? true;
    const paypalOn = paymentConfig?.paypalEnabled ?? true;
    const list: Array<{ id: PaymentMethod['type']; name: string; description: string; icon: any; popular: boolean }> = [];
    if (stripeOn) {
      list.push({ id: 'credit_card', name: 'Credit or Debit Card', description: 'Visa, Mastercard, American Express', icon: CreditCard, popular: true });
    }
    if (paypalOn) {
      list.push({ id: 'paypal', name: 'PayPal', description: 'Pay with your PayPal account', icon: Smartphone, popular: false });
    }
    return list;
  }, [paymentConfig]);

  // Payment success handler
  const handlePaymentSuccess = (paymentData: any) => {
    setIsSubmitting(false);
    setPaymentError('');

    const paymentMethod: PaymentMethod = {
      type: selectedMethod,
      ...(selectedMethod === 'credit_card' && {
        cardNumber: '**** **** **** ****', // Masked for security
        cardholderName: 'Card Holder'
      }),
      ...(selectedMethod === 'paypal' && {
        payerEmail: paymentData?.captureData?.payer?.email_address || undefined
      })
    };

    // For Stripe payments, extract Payment Intent ID
    const transactionId = selectedMethod === 'credit_card'
      ? paymentData?.id || `txn_${Date.now()}` // Stripe Payment Intent ID
      : paymentData?.transactionID || paymentData?.id || paymentData?.orderID || `txn_${Date.now()}`;

    const paymentResult: PaymentResult = {
      status: 'success',
      transactionId,
      paymentIntentId: selectedMethod === 'credit_card' ? paymentData?.id : undefined, // Store Payment Intent ID separately for Stripe
      paymentMethod,
      amount: orderTotal,
      message: 'Payment processed successfully'
    };

    onComplete(paymentResult);
  };

  // Payment pending handler
  const handlePaymentPending = (paymentData: any) => {
    setIsSubmitting(false);
    setPaymentError('');

    const paymentMethod: PaymentMethod = {
      type: selectedMethod,
      ...(selectedMethod === 'credit_card' && {
        cardNumber: '**** **** **** ****',
        cardholderName: 'Card Holder'
      }),
      ...(selectedMethod === 'paypal' && {
        payerEmail: paymentData?.captureData?.payer?.email_address || undefined
      })
    };

    // For Stripe payments, extract Payment Intent ID
    const transactionId = selectedMethod === 'credit_card'
      ? paymentData?.id || `txn_${Date.now()}` // Stripe Payment Intent ID
      : paymentData?.transactionID || paymentData?.id || paymentData?.orderID || `txn_${Date.now()}`;

    const paymentResult: PaymentResult = {
      status: 'pending',
      transactionId,
      paymentIntentId: selectedMethod === 'credit_card' ? paymentData?.id : undefined, // Store Payment Intent ID separately for Stripe
      paymentMethod,
      amount: orderTotal,
      message: 'Payment is being processed'
    };

    onComplete(paymentResult);
  };

  // Payment error handler
  const handlePaymentError = (error: string) => {
    setIsSubmitting(false);
    setPaymentError(error);

    // Check if this is a validation error (incomplete fields) vs actual payment processing error
    const validationErrors = [
      'incomplete',
      'invalid_number',
      'invalid_expiry_month',
      'invalid_expiry_year',
      'invalid_cvc',
      'incomplete_number',
      'incomplete_expiry',
      'incomplete_cvc',
      'incomplete_zip',
      'Your card number is incomplete',
      'Your card\'s expiry date is incomplete',
      'Your card\'s security code is incomplete',
      'Your postal code is incomplete'
    ];

    const isValidationError = validationErrors.some(validationError =>
      error.toLowerCase().includes(validationError.toLowerCase())
    );

    // If it's a validation error, don't proceed to next step - just show the error
    if (isValidationError) {
      return;
    }

    // Only proceed to Step 4 for actual payment processing errors (declined cards, etc.)
    const paymentMethod: PaymentMethod = {
      type: selectedMethod,
      ...(selectedMethod === 'credit_card' && {
        cardNumber: '**** **** **** ****',
        cardholderName: 'Card Holder'
      })
    };

    const paymentResult: PaymentResult = {
      status: 'failed',
      paymentMethod,
      amount: orderTotal,
      error: error,
      message: 'Payment processing failed'
    };

    // Complete the step with failed status for actual processing errors
    onComplete(paymentResult);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (selectedMethod === 'credit_card') {
      if (!formData.cardNumber.replace(/\s/g, '')) {
        newErrors.cardNumber = 'Card number is required';
      } else if (formData.cardNumber.replace(/\s/g, '').length < 13) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }

      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }

      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (formData.cvv.length < 3) {
        newErrors.cvv = 'Please enter a valid CVV';
      }

      if (!formData.cardholderName.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const renderCreditCardForm = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Card Number *
        </label>
        <input
          type="text"
          id="cardNumber"
          value={formData.cardNumber}
          onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors placeholder-gray-400 text-gray-900 bg-white ${
            errors.cardNumber ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
        />
        {errors.cardNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date *
          </label>
          <input
            type="text"
            id="expiryDate"
            value={formData.expiryDate}
            onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors placeholder-gray-400 text-gray-900 bg-white ${
              errors.expiryDate ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="MM/YY"
            maxLength={5}
          />
          {errors.expiryDate && (
            <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
          )}
        </div>

        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
            CVV *
          </label>
          <input
            type="text"
            id="cvv"
            value={formData.cvv}
            onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors placeholder-gray-400 text-gray-900 bg-white ${
              errors.cvv ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="123"
            maxLength={4}
          />
          {errors.cvv && (
            <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
          Cardholder Name *
        </label>
        <input
          type="text"
          id="cardholderName"
          value={formData.cardholderName}
          onChange={(e) => handleInputChange('cardholderName', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors placeholder-gray-400 text-gray-900 bg-white ${
            errors.cardholderName ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="John Doe"
        />
        {errors.cardholderName && (
          <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="sameAsShipping"
          checked={formData.sameAsShipping}
          onChange={(e) => handleInputChange('sameAsShipping', e.target.checked.toString())}
          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
        />
        <label htmlFor="sameAsShipping" className="ml-2 text-sm text-gray-700">
          Billing address same as shipping address
        </label>
      </div>
    </div>
  );

  const renderPaymentMethod = () => {
    if (selectedMethod === 'credit_card') {
      return (
        <StripePayment
          amount={orderTotal}
          onSuccess={handlePaymentSuccess}
          onPending={handlePaymentPending}
          onError={handlePaymentError}
          isProcessing={isSubmitting}
          setIsProcessing={setIsSubmitting}
        />
      );
    } else if (selectedMethod === 'paypal') {
      return (
        <PayPalPayment
          amount={orderTotal}
          items={cartItems}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          isProcessing={isSubmitting}
          setIsProcessing={setIsSubmitting}
        />
      );
    }

    return (
      <div className="text-center py-8">
        <div className="text-gray-600 mb-4">
          This payment method is not yet implemented.
        </div>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold">${orderTotal.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mr-4">
            <CreditCard className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
            <p className="text-sm text-gray-600">Choose how you'd like to pay</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Payment Method</h3>
            {paymentMethods.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                No payment methods are enabled. Please enable Stripe or PayPal in Admin → Payment Settings.
              </div>
            ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <label
                    key={method.id}
                    className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMethod === method.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod['type'])}
                      className="sr-only"
                    />
                    <Icon className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{method.name}</span>
                        {method.popular && (
                          <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    <div
                      className={`w-4 h-4 border-2 rounded-full ${
                        selectedMethod === method.id
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedMethod === method.id && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
            )}
          </div>

          {/* Payment Form */}
          <div>
            {paymentMethods.length > 0 ? renderPaymentMethod() : null}
          </div>

          {/* Payment Error Display */}
          {paymentError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{paymentError}</p>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="h-4 w-4 mr-2 text-green-600" />
              <Lock className="h-4 w-4 mr-2 text-green-600" />
              Your payment information is encrypted and secure
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center px-6 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shipping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
