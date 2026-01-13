'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { UserAddressApiService } from '../../services/user-address-api';
import { useAuth } from '@/contexts/AuthContext';

interface PostalCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  country: string;
  state?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  onValidationChange?: (isValid: boolean, message?: string) => void;
}

interface ValidationState {
  isValid: boolean;
  isValidating: boolean;
  message?: string;
  suggestions: string[];
}

export const PostalCodeInput: React.FC<PostalCodeInputProps> = ({
  value,
  onChange,
  country,
  state,
  placeholder = "Postal Code",
  className = "",
  required = false,
  onValidationChange
}) => {
  const { isAuthenticated } = useAuth();
  const [validation, setValidation] = useState<ValidationState>({
    isValid: true,
    isValidating: false,
    message: undefined,
    suggestions: []
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced validation
  useEffect(() => {
    if (!value || !country) {
      setValidation({
        isValid: true,
        isValidating: false,
        message: undefined,
        suggestions: []
      });
      onValidationChange?.(true);
      return;
    }

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for validation
    debounceRef.current = setTimeout(async () => {
      await validatePostalCode(value, country, state);
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, country, state]);

  const validatePostalCode = async (code: string, countryCode: string, stateCode?: string) => {
    setValidation(prev => ({ ...prev, isValidating: true }));

    // For guest users, use client-side validation only
    if (!isAuthenticated) {
      const isValid = code.length >= getMinLength(countryCode);

      setValidation({
        isValid,
        isValidating: false,
        message: isValid ? undefined : getFormatMessage(countryCode),
        suggestions: []
      });

      onValidationChange?.(isValid, isValid ? undefined : getFormatMessage(countryCode));
      return;
    }

    // For authenticated users, use API-based validation with suggestions
    try {
      const result = await UserAddressApiService.getPostalCodeSuggestions(code, countryCode, stateCode);

      if (result.success) {
        const isValid = result.isValidFormat && code.length >= getMinLength(countryCode);

        setValidation({
          isValid,
          isValidating: false,
          message: isValid ? undefined : getFormatMessage(countryCode),
          suggestions: result.suggestions
        });

        onValidationChange?.(isValid, isValid ? undefined : getFormatMessage(countryCode));
      } else {
        setValidation({
          isValid: false,
          isValidating: false,
          message: result.message || 'Unable to validate postal code',
          suggestions: []
        });
        onValidationChange?.(false, result.message || 'Unable to validate postal code');
      }
    } catch (error) {
      console.error('Error validating postal code:', error);
      // Fallback to client-side validation if API fails
      const isValid = code.length >= getMinLength(countryCode);
      setValidation({
        isValid,
        isValidating: false,
        message: isValid ? undefined : getFormatMessage(countryCode),
        suggestions: []
      });
      onValidationChange?.(isValid, isValid ? undefined : getFormatMessage(countryCode));
    }
  };

  const getMinLength = (countryCode: string): number => {
    switch (countryCode.toUpperCase()) {
      case 'US':
      case 'UNITED STATES':
        return 5;
      case 'CA':
      case 'CANADA':
        return 6;
      case 'GB':
      case 'UK':
        return 5;
      case 'DE':
      case 'GERMANY':
      case 'FR':
      case 'FRANCE':
        return 5;
      default:
        return 3;
    }
  };

  const getFormatMessage = (countryCode: string): string => {
    switch (countryCode.toUpperCase()) {
      case 'US':
      case 'UNITED STATES':
        return 'Format: 12345 or 12345-6789';
      case 'CA':
      case 'CANADA':
        return 'Format: K1A 0A6';
      case 'GB':
      case 'UK':
        return 'Format: SW1A 1AA';
      case 'DE':
      case 'GERMANY':
        return 'Format: 12345';
      case 'FR':
      case 'FRANCE':
        return 'Format: 75001';
      default:
        return 'Please enter a valid postal code';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    onChange(newValue);
    setShowSuggestions(true);
    setFocusedSuggestion(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Extract actual postal code from suggestion (remove format text)
    if (suggestion.includes(':')) {
      return; // Skip format examples
    }
    
    onChange(suggestion);
    setShowSuggestions(false);
    setFocusedSuggestion(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || validation.suggestions.length === 0) return;

    const actualSuggestions = validation.suggestions.filter(s => !s.includes(':'));

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedSuggestion(prev => 
          prev < actualSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedSuggestion(prev => 
          prev > 0 ? prev - 1 : actualSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedSuggestion >= 0 && focusedSuggestion < actualSuggestions.length) {
          handleSuggestionClick(actualSuggestions[focusedSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedSuggestion(-1);
        break;
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      setShowSuggestions(false);
      setFocusedSuggestion(-1);
    }, 200);
  };

  const getInputClassName = () => {
    let baseClass = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${className}`;
    
    if (validation.isValidating) {
      baseClass += ' border-gray-300';
    } else if (value && !validation.isValid) {
      baseClass += ' border-red-300 bg-red-50';
    } else if (value && validation.isValid) {
      baseClass += ' border-green-300 bg-green-50';
    } else {
      baseClass += ' border-gray-300';
    }
    
    return baseClass;
  };

  const actualSuggestions = validation.suggestions.filter(s => !s.includes(':'));
  const formatExamples = validation.suggestions.filter(s => s.includes(':'));

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          required={required}
          className={getInputClassName()}
        />
        
        {/* Validation Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {validation.isValidating ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : value && validation.isValid ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : value && !validation.isValid ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : null}
        </div>
      </div>

      {/* Validation Message */}
      {validation.message && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {validation.message}
        </p>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && (actualSuggestions.length > 0 || formatExamples.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {/* Format Examples */}
          {formatExamples.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              {formatExamples.map((example, index) => (
                <div key={index} className="text-xs text-gray-600 mb-1">
                  {example}
                </div>
              ))}
            </div>
          )}
          
          {/* Actual Suggestions */}
          {actualSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                index === focusedSuggestion ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
