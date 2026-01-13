'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  X,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  CreateCustomerPaymentMethod,
  UpdateCustomerPaymentMethod,
  CustomerPaymentMethod
} from '@/services/customerPaymentMethodService';

const MONTHS = [
  { value: '01', label: '01 - January' },
  { value: '02', label: '02 - February' },
  { value: '03', label: '03 - March' },
  { value: '04', label: '04 - April' },
  { value: '05', label: '05 - May' },
  { value: '06', label: '06 - June' },
  { value: '07', label: '07 - July' },
  { value: '08', label: '08 - August' },
  { value: '09', label: '09 - September' },
  { value: '10', label: '10 - October' },
  { value: '11', label: '11 - November' },
  { value: '12', label: '12 - December' }
];

const YEARS = Array.from({ length: 20 }, (_, i) => {
  const year = new Date().getFullYear() + i;
  return { value: year.toString(), label: year.toString() };
});

// Utility function to detect card brand
const getCardBrand = (cardNumber: string): string => {
  const number = cardNumber.replace(/\s/g, '');
  if (/^4/.test(number)) return 'Visa';
  if (/^5[1-5]/.test(number)) return 'Mastercard';
  if (/^3[47]/.test(number)) return 'American Express';
  if (/^6/.test(number)) return 'Discover';
  return 'Unknown';
};

// Utility function to format card number
const formatCardNumber = (value: string): string => {
  const number = value.replace(/\s/g, '');
  const match = number.match(/.{1,4}/g);
  return match ? match.join(' ') : number;
};

interface PaymentMethodFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCustomerPaymentMethod | UpdateCustomerPaymentMethod) => Promise<void>;
  editingMethod?: CustomerPaymentMethod | null;
  isLoading?: boolean;
}

interface FormData {
  type: string;
  displayName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  cardholderName: string;
  zipCode: string;
  isDefault: boolean;
}

interface FormErrors {
  [key: string]: string;
}



export const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingMethod,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<FormData>({
    type: 'card',
    displayName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    cardholderName: '',
    zipCode: '',
    isDefault: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (editingMethod) {
      setFormData({
        type: editingMethod.type,
        displayName: editingMethod.displayName,
        cardNumber: editingMethod.last4Digits ? `************${editingMethod.last4Digits}` : '',
        expiryMonth: editingMethod.expiryMonth || '',
        expiryYear: editingMethod.expiryYear || '',
        cvc: '',
        cardholderName: '',
        zipCode: '',
        isDefault: editingMethod.isDefault
      });
    } else {
      // Reset form for new payment method
      setFormData({
        type: 'card',
        displayName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvc: '',
        cardholderName: '',
        zipCode: '',
        isDefault: false
      });
    }
    setErrors({});
  }, [editingMethod, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }

    // For editing, only validate display name (card details are already stored)
    if (!editingMethod) {
      // Card number validation (only for new payment methods)
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^[0-9\s]{13,19}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number format';
      }

      // Expiry month validation
      if (!formData.expiryMonth) {
        newErrors.expiryMonth = 'Expiry month is required';
      }

      // Expiry year validation
      if (!formData.expiryYear) {
        newErrors.expiryYear = 'Expiry year is required';
      }

      // Expiry date validation (not in past)
      if (formData.expiryMonth && formData.expiryYear) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const expiryYear = parseInt(formData.expiryYear);
        const expiryMonth = parseInt(formData.expiryMonth);

        if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
          newErrors.expiryDate = 'Card has expired';
        }
      }

      // CVC validation
      if (!formData.cvc.trim()) {
        newErrors.cvc = 'CVC is required';
      } else if (!/^[0-9]{3,4}$/.test(formData.cvc)) {
        newErrors.cvc = 'CVC must be 3-4 digits';
      }

      // Cardholder name validation
      if (!formData.cardholderName.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      } else if (formData.cardholderName.length < 2) {
        newErrors.cardholderName = 'Cardholder name must be at least 2 characters';
      }

      // ZIP code validation
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = 'ZIP code is required';
      } else if (!/^[0-9]{5}(-[0-9]{4})?$/.test(formData.zipCode)) {
        newErrors.zipCode = 'Invalid ZIP code format (e.g., 12345 or 12345-6789)';
      }
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
    try {
      const submitData = editingMethod
        ? {
            displayName: formData.displayName,
            isDefault: formData.isDefault
          } as UpdateCustomerPaymentMethod
        : {
            type: formData.type,
            displayName: formData.displayName,
            last4Digits: formData.cardNumber.slice(-4),
            cardBrand: getCardBrand(formData.cardNumber),
            expiryMonth: formData.expiryMonth,
            expiryYear: formData.expiryYear,
            cardholderName: formData.cardholderName,
            zipCode: formData.zipCode,
            isDefault: formData.isDefault
          } as CreateCustomerPaymentMethod;

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting payment method:', error);
      // Error handling will be done by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Payment Type */}
          {!editingMethod && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                disabled={isSubmitting}
              >
                <option value="card">Credit/Debit Card</option>
              </select>
            </div>
          )}

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name *
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              placeholder="e.g., My Visa Card, Work Card"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black ${
                errors.displayName ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.displayName && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.displayName}
              </p>
            )}
          </div>

          {/* Card Number - Only show for new payment methods */}
          {!editingMethod && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value.replace(/\D/g, ''));
                  if (formatted.replace(/\s/g, '').length <= 16) {
                    handleInputChange('cardNumber', formatted);
                  }
                }}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.cardNumber}
                </p>
              )}
            </div>
          )}

          {/* Expiry and CVC - Only show for new payment methods */}
          {!editingMethod && (
            <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Expiry Month */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Month *
              </label>
              <select
                value={formData.expiryMonth}
                onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black ${
                  errors.expiryMonth ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting || !!editingMethod}
              >
                <option value="">Month</option>
                {MONTHS.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
              {errors.expiryMonth && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.expiryMonth}
                </p>
              )}
            </div>

            {/* Expiry Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Year *
              </label>
              <select
                value={formData.expiryYear}
                onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black ${
                  errors.expiryYear ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting || !!editingMethod}
              >
                <option value="">Year</option>
                {YEARS.map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </select>
              {errors.expiryYear && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.expiryYear}
                </p>
              )}
            </div>

            {/* CVC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVC *
              </label>
              <input
                type="text"
                value={formData.cvc}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 4) {
                    handleInputChange('cvc', value);
                  }
                }}
                placeholder="123"
                maxLength={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black ${
                  errors.cvc ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.cvc && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.cvc}
                </p>
              )}
            </div>
          </div>

          {/* Expiry Date Error */}
          {errors.expiryDate && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.expiryDate}
            </p>
          )}
          </>
          )}

          {/* Cardholder Name - Only show for new payment methods */}
          {!editingMethod && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                placeholder="John Doe"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black ${
                  errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.cardholderName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.cardholderName}
                </p>
              )}
            </div>
          )}

          {/* ZIP Code - Only show for new payment methods */}
          {!editingMethod && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="12345"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black ${
                  errors.zipCode ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.zipCode}
                </p>
              )}
            </div>
          )}





          {/* Set as Default */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => handleInputChange('isDefault', e.target.checked)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              disabled={isSubmitting}
            />
            <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
              Set as default payment method
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingMethod ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {editingMethod ? 'Update Payment Method' : 'Add Payment Method'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isLoading}
              className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
