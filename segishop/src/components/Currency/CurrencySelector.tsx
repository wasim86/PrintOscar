'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Loader2 } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Currency } from '@/types/currency';

interface CurrencySelectorProps {
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  className = '',
  showLabel = false,
  compact = false
}) => {
  const {
    currentCurrency,
    availableCurrencies,
    changeCurrency,
    isLoading,
    error
  } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrencyChange = (currency: Currency) => {
    changeCurrency(currency.code);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (compact) {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-1 px-2 py-1 text-white hover:text-orange-400 transition-colors"
          aria-label="Select currency"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span className="text-sm">{currentCurrency.flag}</span>
              <span className="text-sm font-medium">{currentCurrency.code}</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="py-1">
              {availableCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencyChange(currency)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                    currentCurrency.code === currency.code ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                  }`}
                >
                  <span>{currency.flag}</span>
                  <span className="font-medium">{currency.code}</span>
                  <span className="text-gray-500">({currency.symbol})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Currency
        </label>
      )}
      
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
        aria-label="Select currency"
        disabled={isLoading}
      >
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <>
              <span className="text-lg">{currentCurrency.flag}</span>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">
                  {currentCurrency.code} ({currentCurrency.symbol})
                </div>
                <div className="text-xs text-gray-500">
                  {currentCurrency.name}
                </div>
              </div>
            </>
          )}
        </div>
        
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {error && (
        <div className="mt-1 text-xs text-red-600 flex items-center space-x-1">
          <Globe className="h-3 w-3" />
          <span>Using cached rates</span>
        </div>
      )}

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="py-1">
            {availableCurrencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency)}
                className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                  currentCurrency.code === currency.code 
                    ? 'bg-orange-50 text-orange-600' 
                    : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{currency.flag}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {currency.code} ({currency.symbol})
                  </div>
                  <div className="text-xs text-gray-500">
                    {currency.name}
                  </div>
                </div>
                {currentCurrency.code === currency.code && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
