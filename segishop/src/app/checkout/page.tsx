'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { CheckoutSteps } from '@/components/Checkout/CheckoutSteps';
import { ShippingForm } from '@/components/Checkout/ShippingForm';
import { PaymentForm } from '@/components/Checkout/PaymentForm';
import { OrderReview } from '@/components/Checkout/OrderReview';
import { OrderConfirmation } from '@/components/Checkout/OrderConfirmation';
import { OrderSummary } from '@/components/Cart/OrderSummary';
import { Truck, CreditCard, FileText, CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useShipping } from '@/contexts/ShippingContext';
import { ShippingOption } from '@/services/shipping-api';
import { OrderApiService, CreateOrderRequest } from '@/services/order-api';
import { API_BASE_URL } from '@/services/config';
import { CheckoutFreeShippingBanner } from '@/components/FreeShippingBanner';

// Types for checkout process
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createAccount?: boolean;
}

export interface PaymentMethod {
  type: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  billingAddress?: ShippingAddress;
  sameAsShipping?: boolean;
  payerEmail?: string;
}

export interface PaymentResult {
  status: 'success' | 'pending' | 'failed';
  transactionId?: string;
  paymentIntentId?: string; // For Stripe Payment Intent ID
  paymentMethod: PaymentMethod;
  amount: number;
  message?: string;
  error?: string;
}

export interface OrderData {
  orderId: string; // Order number (e.g., "ORD-20250901142039-2997")
  orderDbId: number; // Database order ID for API calls
  items: any[];
  shippingAddress: ShippingAddress;
  paymentResult: PaymentResult;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  estimatedDelivery: string;
  orderStatus: 'pending' | 'confirmed' | 'failed';
  accountCreated?: boolean;
}

const steps = [
  { id: 1, name: 'Shipping', icon: Truck, description: 'Delivery information' },
  { id: 2, name: 'Review', icon: FileText, description: 'Order review' },
  { id: 3, name: 'Payment', icon: CreditCard, description: 'Payment & Processing' },
  { id: 4, name: 'Confirmation', icon: CheckCircle, description: 'Order confirmation' }
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedShippingOption, setSelectedShippingOption] = useState<ShippingOption | null>(null);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    description: string;
    discountAmount: number;
  } | null>(null);

  // Get authenticated user data
  const { customer, isAuthenticated } = useAuth();

  // Get real cart data (both authenticated and guest carts)
  const { cart, guestCart, isLoading } = useCart();

  // Shipping context
  const {
    shippingAddress: contextShippingAddress,
    setShippingAddress: setContextShippingAddress,
    shippingOptions,
    selectedShippingOption: contextSelectedShippingOption,
    setSelectedShippingOption: setContextSelectedShippingOption,
    orderTotals: contextOrderTotals,
    isCalculatingShipping,
    isCalculatingTotals,
    calculateShippingOptions,
    calculateOrderTotals: contextCalculateOrderTotals
  } = useShipping();

  // Dynamic totals state (can be updated by promo codes and shipping)
  const [orderTotals, setOrderTotals] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0
  });

  // Convert cart items to checkout format (handle both authenticated and guest carts)
  const cartItems = (() => {
    if (isAuthenticated && cart?.items) {
      // Authenticated user cart
      return cart.items.map(item => ({
        id: item?.id?.toString() || 'unknown',
        name: item?.productName || 'Unknown Product',
        price: item?.productPrice || 0,
        quantity: item?.quantity || 1,
        image: item?.productImage || 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=80&h=80&fit=crop',
        category: 'Product',
        productId: item?.productId || 0,
        productSlug: item?.productSlug || '',
        totalPrice: item?.totalPrice || 0,
        productAttributes: item?.productAttributes || ''
      }));
    } else if (!isAuthenticated && guestCart?.items) {
      // Guest user cart
      return guestCart.items.map(item => ({
        id: item?.id || 'unknown',
        name: item?.productName || 'Unknown Product',
        price: item?.unitPrice || 0,
        quantity: item?.quantity || 1,
        image: item?.productImage || 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=80&h=80&fit=crop',
        category: 'Product',
        productId: item?.productId || 0,
        productSlug: '', // Guest cart doesn't have slug
        totalPrice: item?.totalPrice || 0,
        productAttributes: item?.productAttributes || ''
      }));
    }
    return [];
  })();

  // Calculate initial totals (basic calculation without shipping address)
  useEffect(() => {
    const currentCart = isAuthenticated ? cart : guestCart;
    if (currentCart) {
      const subtotal = currentCart.subtotal;
      // Default shipping calculation (will be updated when address is provided)
      const shipping = subtotal >= 120 ? 0 : 8.99; // Free shipping over $120
      const tax = subtotal * 0.08; // 8% tax (will be updated with real calculation)
      const discount = 0; // Will be calculated based on coupons
      const total = subtotal + shipping + tax - discount;

      setOrderTotals({
        subtotal,
        shipping,
        tax,
        discount,
        total
      });
    }
  }, [cart, guestCart, isAuthenticated]);

  // Sync local orderTotals with context orderTotals when shipping/tax changes
  useEffect(() => {
    if (contextOrderTotals) {
      setOrderTotals(prev => ({
        subtotal: contextOrderTotals.subtotal,
        shipping: contextOrderTotals.shippingCost,
        tax: contextOrderTotals.taxAmount,
        discount: prev.discount, // Preserve coupon discount
        total: contextOrderTotals.subtotal + contextOrderTotals.shippingCost + contextOrderTotals.taxAmount - prev.discount
      }));
    }
  }, [contextOrderTotals]);

  // Update context shipping address when local address changes
  useEffect(() => {
    if (shippingAddress && shippingAddress.city && shippingAddress.state && shippingAddress.zipCode) {
      setContextShippingAddress(shippingAddress);
    }
  }, [shippingAddress, setContextShippingAddress]);

  // Removed handleTotalsUpdate - using external coupon management only

  // Handle shipping option selection
  const handleShippingOptionSelect = async (option: ShippingOption) => {
    setSelectedShippingOption(option);
    setContextSelectedShippingOption(option);

    // The ShippingContext will automatically recalculate totals via useEffect
    // We need to sync our local orderTotals with the context totals after recalculation
    // This will be handled by the useEffect below that watches contextOrderTotals
  };

  // Handle shipping address change (for real-time calculation)
  const handleShippingAddressChange = async (address: ShippingAddress) => {
    setShippingAddress(address);
    // Note: Shipping calculation will be triggered by the useEffect when shippingAddress changes
  };

  // Wrapper for OrderSummary address change (non-async)
  const handleOrderSummaryAddressChange = (address: any) => {
    // Convert the address format if needed and call the async function
    handleShippingAddressChange(address as ShippingAddress);
  };

  // Coupon handlers
  const handleCouponApplied = (coupon: { code: string; description: string; discountAmount: number }, orderTotals?: any) => {
    setAppliedCoupon(coupon);
    // Update order totals with complete data from API if available
    if (orderTotals) {
      setOrderTotals({
        subtotal: orderTotals.subtotal,
        shipping: orderTotals.shippingAmount,
        tax: orderTotals.taxAmount,
        discount: orderTotals.discountAmount,
        total: orderTotals.totalAmount
      });
    } else {
      // Fallback to simple discount calculation
      setOrderTotals(prev => ({
        ...prev,
        discount: coupon.discountAmount,
        total: prev.subtotal + prev.shipping + prev.tax - coupon.discountAmount
      }));
    }
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
    // Remove discount from order totals
    setOrderTotals(prev => ({
      ...prev,
      discount: 0,
      total: prev.subtotal + prev.shipping + prev.tax
    }));
  };

  const handleStepComplete = (step: number, data: any) => {
    switch (step) {
      case 1:
        setShippingAddress(data);
        setCurrentStep(2);
        break;
      case 2:
        // Review completed - move to payment
        setCurrentStep(3);
        break;
      case 3:
        // Payment completed - store payment result and process order
        setPaymentResult(data);
        processOrder(data); // Pass payment data directly
        break;
    }
  };

  const processOrder = async (paymentData?: PaymentResult) => {
    const result = paymentData || paymentResult;
    if (!result) {
      console.error('No payment result available');
      return;
    }

    if (!shippingAddress) {
      console.error('No shipping address available');
      return;
    }

    setIsProcessing(true);

    try {
      let accountCreated = false;
      // Create order request for both authenticated and guest users
      const createOrderRequest: CreateOrderRequest = {
        // For authenticated users
        ...(isAuthenticated && customer?.id ? { userId: customer.id } : {}),

        // For guest users - use shipping address information
        ...(!isAuthenticated || !customer?.id ? {
          guestEmail: shippingAddress.email || paymentResult?.paymentMethod?.payerEmail || '',
          guestFirstName: shippingAddress.firstName,
          guestLastName: shippingAddress.lastName,
          guestPhone: shippingAddress.phone,
        } : {}),
        shippingAddress: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          address: shippingAddress.address,
          apartment: shippingAddress.apartment,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
        },
        items: (() => {
          if (isAuthenticated && cart?.items) {
            return cart.items.map(item => ({
              productId: item.productId,
              productName: item.productName,
              productSKU: item.productSlug || undefined,
              unitPrice: item.productPrice,
              quantity: item.quantity,
              totalPrice: item.productPrice * item.quantity,
              productAttributes: item.productAttributes || undefined,
              configurations: undefined, // TODO: Add configurations when cart supports them
            }));
          } else if (!isAuthenticated && guestCart?.items) {
            return guestCart.items.map(item => ({
              productId: typeof item.productId === 'string' ? parseInt(item.productId, 10) : item.productId,
              productName: item.productName,
              productSKU: undefined, // Guest cart doesn't have SKU
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
              productAttributes: item.productAttributes || undefined,
              configurations: undefined,
            }));
          }
          return [];
        })(),
        paymentInfo: {
          paymentMethod: result.paymentMethod.type,
          paymentStatus: result.status,
          paymentTransactionId: result.transactionId,
          paymentIntentId: result.paymentIntentId, // Add Payment Intent ID for Stripe
          amount: result.amount,
          currency: 'USD',
          paymentMethodDetails: JSON.stringify(result.paymentMethod),
        },
        totals: {
          subTotal: orderTotals.subtotal,
          taxAmount: orderTotals.tax,
          shippingAmount: orderTotals.shipping,
          discountAmount: orderTotals.discount,
          totalAmount: orderTotals.total,
        },
        couponCode: appliedCoupon?.code,
        couponDiscountAmount: orderTotals.discount,
        shippingMethodTitle: selectedShippingOption?.title,
        notes: undefined,
      };

      console.log('Creating order with request:', createOrderRequest);
      console.log('Request JSON:', JSON.stringify(createOrderRequest, null, 2));

      // Call the order creation API
      const orderResponse = await OrderApiService.createOrder(createOrderRequest);

      if (!orderResponse.success) {
        console.error('Order creation failed:', orderResponse.message);
        // Handle order creation failure
        // You might want to show an error message to the user
        return;
      }

      // Determine order status based on payment status
      let orderStatus: 'pending' | 'confirmed' | 'failed';
      switch (result.status) {
        case 'success':
          orderStatus = 'confirmed';
          break;
        case 'pending':
          orderStatus = 'pending';
          break;
        case 'failed':
          orderStatus = 'failed';
          break;
        default:
          orderStatus = 'failed';
      }

      const newOrderData: OrderData = {
        orderId: orderResponse.order?.orderNumber || `ORD-${Date.now()}`,
        orderDbId: orderResponse.order?.id || 0,
        items: cartItems,
        shippingAddress: shippingAddress!,
        paymentResult: result,
        subtotal: orderTotals.subtotal,
        shipping: orderTotals.shipping,
        tax: orderTotals.tax,
        discount: orderTotals.discount,
        total: orderTotals.total,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        orderStatus,
        accountCreated
      };

      if (!isAuthenticated && shippingAddress?.createAccount && shippingAddress?.email) {
        try {
          const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
          const bytes = typeof crypto !== 'undefined' && crypto.getRandomValues ? crypto.getRandomValues(new Uint8Array(12)) : new Uint8Array(12);
          const pwd = Array.from(bytes).map((b) => alphabet[b % alphabet.length]).join('');

          const registerBody = {
            email: shippingAddress.email,
            firstName: shippingAddress.firstName || 'Customer',
            lastName: shippingAddress.lastName || 'Account',
            password: pwd
          };

          const resp = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerBody)
          });
          const json = await resp.json().catch(() => ({ success: false }));
          if (json && (json.success === true)) {
            accountCreated = true;
          }
        } catch (_) {
        }
      }

      setOrderData(newOrderData);
      // Move to step 4 to show OrderConfirmation
      setCurrentStep(4);
    } catch (error) {
      console.error('Order processing failed:', error);
      // Handle order processing error
      // You might want to show an error message to the user
    } finally {
      setIsProcessing(false);
    }
  };

  const goBackToStep = (step: number) => {
    setCurrentStep(step);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Empty cart state - check both authenticated and guest carts
  const hasCartItems = isAuthenticated ? (cart && cart.items && cart.items.length > 0) : (guestCart && guestCart.items && guestCart.items.length > 0);

  if (!hasCartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ShippingForm
            onComplete={(data) => handleStepComplete(1, data)}
            initialData={shippingAddress}
            shippingOptions={shippingOptions}
            selectedShippingOption={selectedShippingOption || contextSelectedShippingOption}
            onShippingOptionSelect={handleShippingOptionSelect}
            onAddressChange={handleShippingAddressChange}
            isCalculatingShipping={isCalculatingShipping}
          />
        );
      case 2:
        return (
          <OrderReview
            cartItems={cartItems}
            shippingAddress={shippingAddress!}
            paymentResult={null} // No payment result yet - this is review BEFORE payment
            subtotal={orderTotals.subtotal}
            shipping={orderTotals.shipping}
            tax={orderTotals.tax}
            discount={orderTotals.discount}
            total={orderTotals.total}
            onConfirm={() => handleStepComplete(2, null)}
            onBack={() => goBackToStep(1)}
            isProcessing={false}
            isPrePaymentReview={true} // New prop to indicate this is pre-payment review
            appliedCoupon={appliedCoupon}
          />
        );
      case 3:
        return (
          <PaymentForm
            onComplete={(data) => handleStepComplete(3, data)}
            onBack={() => goBackToStep(2)}
            initialData={paymentResult?.paymentMethod}
            orderTotal={orderTotals.total}
            cartItems={cartItems.map(item => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity
            }))}
          />
        );
      case 4:
        return orderData && paymentResult ? (
          <OrderConfirmation
            orderData={orderData}
            paymentResult={paymentResult}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order in just a few steps</p>

          {/* Guest/User Indicator */}
          {!isAuthenticated ? (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Guest Checkout:</strong> You're checking out as a guest. Your order details will be sent to the email address you provide.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    <strong>Signed in as:</strong> {customer?.firstName} {customer?.lastName} ({customer?.email})
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Free Shipping Banner */}
        <div className="mb-8">
          <CheckoutFreeShippingBanner
            dismissible={false}
            showProgress={true}
            persistent={true}
          />
        </div>

        {/* Checkout Steps */}
        <CheckoutSteps
          steps={steps} 
          currentStep={currentStep} 
          completedSteps={currentStep > 1 ? Array.from({length: currentStep - 1}, (_, i) => i + 1) : []}
        />

        {/* Main Checkout Content */}
        <div className={`mt-8 grid grid-cols-1 gap-8 ${(currentStep === 2 || currentStep === 4) ? 'lg:grid-cols-1' : 'lg:grid-cols-3'}`}>
          {/* Checkout Form */}
          <div className={(currentStep === 2 || currentStep === 4) ? 'col-span-1' : 'lg:col-span-2'}>
            {renderCurrentStep()}
          </div>

          {/* Order Summary - Hidden on Review Step and Confirmation Step */}
          {currentStep !== 2 && currentStep !== 4 && (
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <OrderSummary
                  showShippingOptions={false}
                  showCouponCode={currentStep <= 2}
                  onAddressChange={handleOrderSummaryAddressChange}
                  onProceedToPayment={() => setCurrentStep(2)}
                  showPaymentButton={currentStep === 1}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  appliedCoupon={appliedCoupon}
                  onCouponApplied={handleCouponApplied}
                  onCouponRemoved={handleCouponRemoved}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
