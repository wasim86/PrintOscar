import { 
  ExchangeRateResponse, 
  EXCHANGE_RATES_STORAGE_KEY, 
  RATES_TIMESTAMP_STORAGE_KEY,
  CACHE_DURATION,
  BASE_CURRENCY 
} from '@/types/currency';

class CurrencyService {
  private readonly API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
  private readonly API_URL = 'https://api.exchangerate-api.com/v4/latest';
  private readonly FALLBACK_API_URL = 'https://api.fixer.io/latest';

  /**
   * Fetch exchange rates from API
   */
  async fetchExchangeRates(): Promise<Record<string, number>> {
    try {
      // Try primary API first
      const response = await fetch(`${this.API_URL}/${BASE_CURRENCY}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ExchangeRateResponse = await response.json();
      
      if (!data.success && !data.rates) {
        throw new Error('Invalid API response');
      }

      return data.rates;
    } catch (error) {
      console.warn('Primary exchange rate API failed, trying fallback:', error);
      return this.fetchFallbackRates();
    }
  }

  /**
   * Fetch rates from fallback API
   */
  private async fetchFallbackRates(): Promise<Record<string, number>> {
    try {
      const url = this.API_KEY 
        ? `${this.FALLBACK_API_URL}?access_key=${this.API_KEY}&base=${BASE_CURRENCY}`
        : `${this.FALLBACK_API_URL}?base=${BASE_CURRENCY}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Fallback API error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.rates || this.getDefaultRates();
    } catch (error) {
      console.warn('Fallback API also failed, using default rates:', error);
      return this.getDefaultRates();
    }
  }

  /**
   * Get default exchange rates as fallback
   */
  private getDefaultRates(): Record<string, number> {
    return {
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
    };
  }

  /**
   * Get cached exchange rates from localStorage
   */
  getCachedRates(): { rates: Record<string, number> | null; isExpired: boolean } {
    if (typeof window === 'undefined') {
      return { rates: null, isExpired: true };
    }

    try {
      const cachedRates = localStorage.getItem(EXCHANGE_RATES_STORAGE_KEY);
      const timestamp = localStorage.getItem(RATES_TIMESTAMP_STORAGE_KEY);

      if (!cachedRates || !timestamp) {
        return { rates: null, isExpired: true };
      }

      const isExpired = Date.now() - parseInt(timestamp) > CACHE_DURATION;
      const rates = JSON.parse(cachedRates);

      return { rates, isExpired };
    } catch (error) {
      console.error('Error reading cached rates:', error);
      return { rates: null, isExpired: true };
    }
  }

  /**
   * Cache exchange rates in localStorage
   */
  cacheRates(rates: Record<string, number>): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(EXCHANGE_RATES_STORAGE_KEY, JSON.stringify(rates));
      localStorage.setItem(RATES_TIMESTAMP_STORAGE_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error caching rates:', error);
    }
  }

  /**
   * Get exchange rates with caching
   */
  async getExchangeRates(): Promise<Record<string, number>> {
    const { rates: cachedRates, isExpired } = this.getCachedRates();

    // Return cached rates if they're still valid
    if (cachedRates && !isExpired) {
      return cachedRates;
    }

    try {
      // Fetch fresh rates
      const freshRates = await this.fetchExchangeRates();
      this.cacheRates(freshRates);
      return freshRates;
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      
      // Return cached rates even if expired, or default rates
      return cachedRates || this.getDefaultRates();
    }
  }

  /**
   * Convert price from one currency to another
   */
  convertPrice(
    amount: number, 
    fromCurrency: string, 
    toCurrency: string, 
    rates: Record<string, number>
  ): number {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    // Convert to USD first if not already
    let usdAmount = amount;
    if (fromCurrency !== BASE_CURRENCY) {
      const fromRate = rates[fromCurrency];
      if (!fromRate) {
        console.warn(`Exchange rate not found for ${fromCurrency}`);
        return amount;
      }
      usdAmount = amount / fromRate;
    }

    // Convert from USD to target currency
    if (toCurrency === BASE_CURRENCY) {
      return usdAmount;
    }

    const toRate = rates[toCurrency];
    if (!toRate) {
      console.warn(`Exchange rate not found for ${toCurrency}`);
      return amount;
    }

    return usdAmount * toRate;
  }

  /**
   * Format price with currency symbol and proper decimal places
   */
  formatPrice(amount: number, currencyCode: string, symbol: string, decimalPlaces: number): string {
    const roundedAmount = Number(amount.toFixed(decimalPlaces));
    
    // Format with proper thousand separators and decimal places
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(roundedAmount);

    // Handle different currency symbol positions
    switch (currencyCode) {
      case 'EUR':
        return `${formattedNumber}${symbol}`;
      case 'JPY':
      case 'KRW':
      case 'CNY':
        return `${symbol}${formattedNumber}`;
      default:
        return `${symbol}${formattedNumber}`;
    }
  }
}

export const currencyService = new CurrencyService();
