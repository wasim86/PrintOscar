'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Shield } from 'lucide-react';
import { SimplePriceDisplay } from '@/components/Currency/PriceDisplay';
import { useCurrency } from '@/contexts/CurrencyContext';
import PaymentApiService from '@/services/payment-api';
import { getPublicPaymentConfig } from '@/services/public-payment-config';

interface PayPalPaymentProps {
  amount: number;
  items?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  onSuccess: (details: any) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  amount,
  items = [],
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing
}) => {
  const { currentCurrency } = useCurrency();
  const [clientId, setClientId] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cfg = await getPublicPaymentConfig();
        if (!mounted) return;
        const id = cfg.paypalClientId || null;
        setClientId(id);
        setEnabled(!!cfg.paypalEnabled);
      } catch {
        const id = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || null;
        setClientId(id);
        setEnabled(!!id);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const paypalOptions = useMemo(() => ({
    clientId: clientId || '',
    currency: currentCurrency.code,
    intent: 'capture',
    'enable-funding': 'venmo',
    'disable-funding': 'credit,card'
  }), [clientId, currentCurrency.code]);

  const createOrder = async () => {
    try {
      setIsProcessing(true);
      
      const response = await PaymentApiService.createPayPalOrder({
        amount,
        currency: currentCurrency.code,
        items,
        metadata: {
          source: 'checkout',
          timestamp: new Date().toISOString()
        }
      });

      if (response.success && response.orderId) {
        return response.orderId;
      } else {
        throw new Error(response.error || 'Failed to create PayPal order');
      }
    } catch (error: any) {
      onError(error.message || 'Failed to create PayPal order');
      setIsProcessing(false);
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    try {
      setIsProcessing(true);

      // Capture the payment on the server
      const captureResponse = await fetch('/api/payments/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data.orderID
        }),
      });

      const captureResult = await captureResponse.json();

      if (!captureResult.success) {
        throw new Error(captureResult.error || 'Payment capture failed');
      }

      // Return the actual PayPal capture data
      onSuccess({
        id: captureResult.orderID,
        transactionID: captureResult.transactionID,
        status: captureResult.status,
        captureData: captureResult.captureData
      });
    } catch (error: any) {
      console.error('PayPal payment capture failed:', error);
      onError(error.message || 'PayPal payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const onCancel = () => {
    setIsProcessing(false);
    onError('Payment was cancelled');
  };

  const onErrorHandler = (error: any) => {
    setIsProcessing(false);
    onError(error.message || 'PayPal payment failed');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Shield className="h-4 w-4 mr-2" />
        <span>Secure payment powered by PayPal</span>
      </div>

      {!enabled || !clientId ? (
        <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-3">
          PayPal is not configured. Please add a PayPal Client ID in Admin → Payment Settings.
        </div>
      ) : (
        <PayPalScriptProvider options={paypalOptions}>
          <PayPalButtons
            style={{
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'paypal'
            }}
            createOrder={createOrder}
            onApprove={onApprove}
            onCancel={onCancel}
            onError={onErrorHandler}
            disabled={isProcessing}
          />
        </PayPalScriptProvider>
      )}

      <div className="text-center text-sm text-gray-500">
        Total: <SimplePriceDisplay
          price={amount}
          size="sm"
          className="font-semibold inline"
        />
      </div>
    </div>
  );
};

export default PayPalPayment;
