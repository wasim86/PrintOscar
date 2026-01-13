export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
  decimalPlaces: number;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
}

export interface ExchangeRateResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface CurrencyContextType {
  currentCurrency: Currency;
  availableCurrencies: Currency[];
  exchangeRates: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  changeCurrency: (currencyCode: string) => void;
  convertPrice: (price: number, fromCurrency?: string) => number;
  formatPrice: (price: number, currency?: Currency) => string;
  refreshRates: () => Promise<void>;
}

// Supported currencies with their details
export const SUPPORTED_CURRENCIES: Currency[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    decimalPlaces: 2,
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    decimalPlaces: 2,
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    decimalPlaces: 2,
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    flag: '🇨🇦',
    decimalPlaces: 2,
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    flag: '🇦🇺',
    decimalPlaces: 2,
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    flag: '🇯🇵',
    decimalPlaces: 0,
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    flag: '🇨🇭',
    decimalPlaces: 2,
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    flag: '🇨🇳',
    decimalPlaces: 2,
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    flag: '🇮🇳',
    decimalPlaces: 2,
  },
  {
    code: 'KRW',
    name: 'South Korean Won',
    symbol: '₩',
    flag: '🇰🇷',
    decimalPlaces: 0,
  },
];

// Default currency (USD)
export const DEFAULT_CURRENCY = SUPPORTED_CURRENCIES[0];

// Base currency for API calls (all prices stored in USD)
export const BASE_CURRENCY = 'USD';

// Local storage keys
export const CURRENCY_STORAGE_KEY = 'segishop_selected_currency';
export const EXCHANGE_RATES_STORAGE_KEY = 'segishop_exchange_rates';
export const RATES_TIMESTAMP_STORAGE_KEY = 'segishop_rates_timestamp';

// Cache duration (24 hours)
export const CACHE_DURATION = 24 * 60 * 60 * 1000;
