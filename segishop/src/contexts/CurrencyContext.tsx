'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Currency, 
  CurrencyContextType, 
  SUPPORTED_CURRENCIES, 
  DEFAULT_CURRENCY,
  CURRENCY_STORAGE_KEY,
  BASE_CURRENCY 
} from '@/types/currency';
import { currencyService } from '@/services/currencyService';

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: React.ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved currency from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedCurrencyCode = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (savedCurrencyCode) {
        const savedCurrency = SUPPORTED_CURRENCIES.find(c => c.code === savedCurrencyCode);
        if (savedCurrency) {
          setCurrentCurrency(savedCurrency);
        }
      }
    } catch (error) {
      console.error('Error loading saved currency:', error);
    }
  }, []);

  // Load exchange rates on mount
  useEffect(() => {
    loadExchangeRates();
  }, []);

  const loadExchangeRates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const rates = await currencyService.getExchangeRates();
      setExchangeRates(rates);
    } catch (error) {
      console.error('Failed to load exchange rates:', error);
      setError('Failed to load exchange rates');
      // Set default rates as fallback
      setExchangeRates({
        USD: 1.0,
        EUR: 0.85,
        GBP: 0.73,
        CAD: 1.25,
        AUD: 1.35,
        JPY: 110.0,
        CHF: 0.92,
        CNY: 6.45,
        INR: 74.5,
        KRW: 1180.0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const changeCurrency = useCallback((currencyCode: string) => {
    const newCurrency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
    if (!newCurrency) {
      console.error(`Currency ${currencyCode} not supported`);
      return;
    }

    setCurrentCurrency(newCurrency);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CURRENCY_STORAGE_KEY, currencyCode);
      } catch (error) {
        console.error('Error saving currency preference:', error);
      }
    }
  }, []);

  const convertPrice = useCallback((
    price: number, 
    fromCurrency: string = BASE_CURRENCY
  ): number => {
    if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
      return price;
    }

    return currencyService.convertPrice(
      price,
      fromCurrency,
      currentCurrency.code,
      exchangeRates
    );
  }, [currentCurrency.code, exchangeRates]);

  const formatPrice = useCallback((
    price: number, 
    currency: Currency = currentCurrency
  ): string => {
    return currencyService.formatPrice(
      price,
      currency.code,
      currency.symbol,
      currency.decimalPlaces
    );
  }, [currentCurrency]);

  const refreshRates = useCallback(async () => {
    await loadExchangeRates();
  }, []);

  const value: CurrencyContextType = {
    currentCurrency,
    availableCurrencies: SUPPORTED_CURRENCIES,
    exchangeRates,
    isLoading,
    error,
    changeCurrency,
    convertPrice,
    formatPrice,
    refreshRates,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
