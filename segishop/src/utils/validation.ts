// Validation utilities for payment methods and forms

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

// Card number validation
export const validateCardNumber = (cardNumber: string): FieldValidationResult => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (!cleaned) {
    return { isValid: false, error: 'Card number is required' };
  }
  
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, error: 'Card number must contain only digits' };
  }
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return { isValid: false, error: 'Card number must be between 13 and 19 digits' };
  }
  
  // Luhn algorithm validation
  if (!isValidLuhn(cleaned)) {
    return { isValid: false, error: 'Invalid card number' };
  }
  
  return { isValid: true };
};

// Last 4 digits validation
export const validateLast4Digits = (last4: string): FieldValidationResult => {
  if (!last4) {
    return { isValid: false, error: 'Last 4 digits are required' };
  }
  
  if (!/^\d{4}$/.test(last4)) {
    return { isValid: false, error: 'Last 4 digits must be exactly 4 numbers' };
  }
  
  return { isValid: true };
};

// Expiry date validation
export const validateExpiryDate = (month: string, year: string): FieldValidationResult => {
  if (!month || !year) {
    return { isValid: false, error: 'Expiry month and year are required' };
  }
  
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  if (monthNum < 1 || monthNum > 12) {
    return { isValid: false, error: 'Invalid expiry month' };
  }
  
  if (yearNum < new Date().getFullYear()) {
    return { isValid: false, error: 'Expiry year cannot be in the past' };
  }
  
  // Check if the expiry date is in the past
  const expiryDate = new Date(yearNum, monthNum - 1);
  const currentDate = new Date();
  currentDate.setDate(1); // Set to first day of current month for comparison
  
  if (expiryDate < currentDate) {
    return { isValid: false, error: 'Card expiry date cannot be in the past' };
  }
  
  return { isValid: true };
};

// CVV validation
export const validateCVV = (cvv: string, cardBrand?: string): FieldValidationResult => {
  if (!cvv) {
    return { isValid: false, error: 'CVV is required' };
  }
  
  if (!/^\d+$/.test(cvv)) {
    return { isValid: false, error: 'CVV must contain only digits' };
  }
  
  // American Express has 4-digit CVV, others have 3-digit
  const expectedLength = cardBrand === 'American Express' ? 4 : 3;
  
  if (cvv.length !== expectedLength) {
    return { 
      isValid: false, 
      error: `CVV must be ${expectedLength} digits for ${cardBrand || 'this card type'}` 
    };
  }
  
  return { isValid: true };
};

// Cardholder name validation
export const validateCardholderName = (name: string): FieldValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: 'Cardholder name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Cardholder name must be at least 2 characters' };
  }
  
  if (name.trim().length > 100) {
    return { isValid: false, error: 'Cardholder name must be 100 characters or less' };
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-'\.]+$/.test(name.trim())) {
    return { isValid: false, error: 'Cardholder name contains invalid characters' };
  }
  
  return { isValid: true };
};

// Display name validation
export const validateDisplayName = (name: string): FieldValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: 'Display name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Display name must be at least 2 characters' };
  }
  
  if (name.trim().length > 100) {
    return { isValid: false, error: 'Display name must be 100 characters or less' };
  }
  
  return { isValid: true };
};

// Address validation
export const validateAddress = (address: string): FieldValidationResult => {
  if (!address.trim()) {
    return { isValid: false, error: 'Address is required' };
  }
  
  if (address.trim().length < 5) {
    return { isValid: false, error: 'Address must be at least 5 characters' };
  }
  
  if (address.trim().length > 200) {
    return { isValid: false, error: 'Address must be 200 characters or less' };
  }
  
  return { isValid: true };
};

// City validation
export const validateCity = (city: string): FieldValidationResult => {
  if (!city.trim()) {
    return { isValid: false, error: 'City is required' };
  }
  
  if (city.trim().length < 2) {
    return { isValid: false, error: 'City must be at least 2 characters' };
  }
  
  if (city.trim().length > 100) {
    return { isValid: false, error: 'City must be 100 characters or less' };
  }
  
  return { isValid: true };
};

// ZIP code validation
export const validateZipCode = (zipCode: string, country: string = 'US'): FieldValidationResult => {
  if (!zipCode.trim()) {
    return { isValid: false, error: 'ZIP code is required' };
  }
  
  const cleaned = zipCode.trim();
  
  // US ZIP code validation
  if (country === 'US' || country === 'United States') {
    if (!/^\d{5}(-\d{4})?$/.test(cleaned)) {
      return { isValid: false, error: 'Invalid US ZIP code format (e.g., 12345 or 12345-6789)' };
    }
  }
  // Canadian postal code validation
  else if (country === 'CA' || country === 'Canada') {
    if (!/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(cleaned)) {
      return { isValid: false, error: 'Invalid Canadian postal code format (e.g., K1A 0A6)' };
    }
  }
  // UK postal code validation
  else if (country === 'GB' || country === 'United Kingdom') {
    if (!/^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/.test(cleaned)) {
      return { isValid: false, error: 'Invalid UK postal code format' };
    }
  }
  // Generic validation for other countries
  else {
    if (!/^[A-Za-z0-9\s\-]{3,20}$/.test(cleaned)) {
      return { isValid: false, error: 'Invalid postal code format' };
    }
  }
  
  return { isValid: true };
};

// Email validation
export const validateEmail = (email: string): FieldValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  return { isValid: true };
};

// Phone number validation
export const validatePhoneNumber = (phone: string): FieldValidationResult => {
  if (!phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Remove all non-digit characters for validation
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' };
  }
  
  if (cleaned.length > 15) {
    return { isValid: false, error: 'Phone number must be 15 digits or less' };
  }
  
  return { isValid: true };
};

// Luhn algorithm for card number validation
const isValidLuhn = (cardNumber: string): boolean => {
  let sum = 0;
  let isEven = false;
  
  // Loop through values starting from the rightmost side
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Get card brand from card number
export const getCardBrand = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleaned)) {
    return 'Visa';
  } else if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) {
    return 'Mastercard';
  } else if (/^3[47]/.test(cleaned)) {
    return 'American Express';
  } else if (/^6(?:011|5)/.test(cleaned)) {
    return 'Discover';
  } else if (/^35/.test(cleaned)) {
    return 'JCB';
  } else if (/^3[0689]/.test(cleaned)) {
    return 'Diners Club';
  } else if (/^62/.test(cleaned)) {
    return 'UnionPay';
  }
  
  return 'Unknown';
};

// Format card number with spaces
export const formatCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  const match = cleaned.match(/\d{1,4}/g);
  return match ? match.join(' ') : '';
};

// Format expiry date
export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};
