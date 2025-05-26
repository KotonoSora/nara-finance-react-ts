/**
 * Infrastructure layer formatters for financial data presentation
 * Handles currency, number, and percentage formatting with internationalization
 */

export interface CurrencyFormatOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export interface NumberFormatOptions {
  locale?: string;
  style?: "decimal" | "currency" | "percent";
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Infrastructure service for formatting currency and financial amounts
 */
export class CurrencyFormatter {
  private static defaultCurrency = "USD";
  private static defaultLocale = "en-US";

  private static currencyFormatter = new Intl.NumberFormat(this.defaultLocale, {
    style: "currency",
    currency: this.defaultCurrency,
  });

  private static percentFormatter = new Intl.NumberFormat(this.defaultLocale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  /**
   * Format amount as currency
   */
  static formatCurrency(
    amount: number,
    options: CurrencyFormatOptions = {},
  ): string {
    const {
      currency = this.defaultCurrency,
      locale = this.defaultLocale,
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
    } = options;

    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    });

    return formatter.format(amount);
  }

  /**
   * Format percentage value
   */
  static formatPercent(value: number, locale?: string): string {
    const formatter = locale
      ? new Intl.NumberFormat(locale, {
          style: "percent",
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
      : this.percentFormatter;

    return formatter.format(value / 100);
  }

  /**
   * Format compact currency (e.g., $1.2K, $1.5M)
   */
  static formatCompactCurrency(
    amount: number,
    options: CurrencyFormatOptions = {},
  ): string {
    const { currency = this.defaultCurrency, locale = this.defaultLocale } =
      options;

    if (Math.abs(amount) >= 1000000) {
      const formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        notation: "compact",
        compactDisplay: "short",
      });
      return formatter.format(amount);
    }

    if (Math.abs(amount) >= 1000) {
      const simplified = amount / 1000;
      const formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
      return `${formatter.format(simplified)}K`;
    }

    return this.formatCurrency(amount, options);
  }

  /**
   * Get transaction amount label with appropriate sign
   */
  static getTransactionAmountLabel(
    amount: number,
    type: "income" | "expense" | "investment",
    options: CurrencyFormatOptions = {},
  ): string {
    const formattedAmount = this.formatCurrency(amount, options);
    const prefix = type === "expense" ? "-" : "+";

    // Remove currency symbol to add our own prefix
    const amountWithoutSymbol = formattedAmount.replace(/[$€£¥₹]/, "");
    const currencySymbol = formattedAmount.match(/[$€£¥₹]/)?.[0] || "$";

    return `${prefix}${currencySymbol}${amountWithoutSymbol}`;
  }

  /**
   * Get percentage change label
   */
  static getChangeLabel(current: number, previous: number): string {
    if (previous === 0) {
      return current > 0 ? "+∞%" : "0%";
    }

    const change = ((current - previous) / previous) * 100;
    const prefix = change > 0 ? "+" : "";
    return `${prefix}${change.toFixed(1)}%`;
  }

  /**
   * Format number with locale-specific separators
   */
  static formatNumber(
    value: number,
    options: NumberFormatOptions = {},
  ): string {
    const {
      locale = this.defaultLocale,
      style = "decimal",
      minimumFractionDigits = 0,
      maximumFractionDigits = 2,
    } = options;

    const formatter = new Intl.NumberFormat(locale, {
      style,
      minimumFractionDigits,
      maximumFractionDigits,
    });

    return formatter.format(value);
  }

  /**
   * Parse currency string back to number
   */
  static parseCurrency(currencyString: string): number {
    // Remove currency symbols, spaces, and common separators
    const cleaned = currencyString
      .replace(/[$€£¥₹,\s]/g, "")
      .replace(/[^\d.-]/g, "");

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Get currency symbol for a given currency code
   */
  static getCurrencySymbol(
    currencyCode: string,
    locale: string = this.defaultLocale,
  ): string {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    // Format 0 and extract the symbol
    const formatted = formatter.format(0);
    return formatted.replace(/\d/g, "").trim();
  }

  /**
   * Configure default currency and locale
   */
  static configure(currency: string, locale: string): void {
    this.defaultCurrency = currency;
    this.defaultLocale = locale;

    // Update default formatters
    this.currencyFormatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    });

    this.percentFormatter = new Intl.NumberFormat(locale, {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }
}

/**
 * Default currency formatter instance
 */
export const currencyFormatter = new CurrencyFormatter();

/**
 * Legacy function exports for backward compatibility
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  return CurrencyFormatter.formatCurrency(amount, { currency, locale });
}

export function formatPercent(value: number, locale: string = "en-US"): string {
  return CurrencyFormatter.formatPercent(value, locale);
}

export function formatCompactCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  return CurrencyFormatter.formatCompactCurrency(amount, { currency, locale });
}
