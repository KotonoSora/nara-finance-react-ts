/**
 * Infrastructure service for locale and internationalization
 */

export const DEFAULT_LOCALE = "en-US";

export interface LocaleConfig {
  daysOfWeek: string[];
  months: string[];
  dateFormat: {
    month: "long" | "short" | "numeric";
    year: "numeric" | "2-digit";
  };
  currency: string;
  timeZone: string;
}

export const CALENDAR_LOCALE: Record<string, LocaleConfig> = {
  "en-US": {
    daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    dateFormat: {
      month: "long",
      year: "numeric",
    },
    currency: "USD",
    timeZone: "America/New_York",
  },
  "en-GB": {
    daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    dateFormat: {
      month: "long",
      year: "numeric",
    },
    currency: "GBP",
    timeZone: "Europe/London",
  },
} as const;

/**
 * Infrastructure service for locale-specific formatting and configuration
 */
export class LocaleFormatter {
  private static currentLocale = DEFAULT_LOCALE;

  /**
   * Get localized days of week
   */
  static getLocalizedDaysOfWeek(
    locale = this.currentLocale,
    startFromMonday = true,
  ): string[] {
    const config = CALENDAR_LOCALE[locale] || CALENDAR_LOCALE[DEFAULT_LOCALE];
    const days = config.daysOfWeek;

    if (startFromMonday) {
      return [...days.slice(1), days[0]];
    }
    return [...days];
  }

  /**
   * Format date according to locale
   */
  static formatDate(date: Date, locale = this.currentLocale): string {
    const config = CALENDAR_LOCALE[locale] || CALENDAR_LOCALE[DEFAULT_LOCALE];

    return new Intl.DateTimeFormat(locale, config.dateFormat).format(date);
  }

  /**
   * Get localized month names
   */
  static getLocalizedMonths(locale = this.currentLocale): string[] {
    const config = CALENDAR_LOCALE[locale] || CALENDAR_LOCALE[DEFAULT_LOCALE];
    return [...config.months];
  }

  /**
   * Get short month names
   */
  static getShortMonths(locale = this.currentLocale): string[] {
    const formatter = new Intl.DateTimeFormat(locale, { month: "short" });
    return Array.from({ length: 12 }, (_, i) =>
      formatter.format(new Date(2024, i, 1)),
    );
  }

  /**
   * Get short day names
   */
  static getShortDays(
    locale = this.currentLocale,
    startFromMonday = true,
  ): string[] {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const days = Array.from(
      { length: 7 },
      (_, i) => formatter.format(new Date(2024, 0, i + 1)), // Jan 1, 2024 was a Monday
    );

    if (startFromMonday) {
      return [...days.slice(1), days[0]];
    }
    return days;
  }

  /**
   * Get currency for locale
   */
  static getCurrencyForLocale(locale = this.currentLocale): string {
    const config = CALENDAR_LOCALE[locale] || CALENDAR_LOCALE[DEFAULT_LOCALE];
    return config.currency;
  }

  /**
   * Get timezone for locale
   */
  static getTimezoneForLocale(locale = this.currentLocale): string {
    const config = CALENDAR_LOCALE[locale] || CALENDAR_LOCALE[DEFAULT_LOCALE];
    return config.timeZone;
  }

  /**
   * Format number according to locale
   */
  static formatNumber(
    value: number,
    locale = this.currentLocale,
    options: Intl.NumberFormatOptions = {},
  ): string {
    return new Intl.NumberFormat(locale, options).format(value);
  }

  /**
   * Format relative time
   */
  static formatRelativeTime(
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    locale = this.currentLocale,
  ): string {
    const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    return formatter.format(value, unit);
  }

  /**
   * Get supported locales
   */
  static getSupportedLocales(): string[] {
    return Object.keys(CALENDAR_LOCALE);
  }

  /**
   * Check if locale is supported
   */
  static isLocaleSupported(locale: string): boolean {
    return locale in CALENDAR_LOCALE;
  }

  /**
   * Set current locale
   */
  static setLocale(locale: string): void {
    if (this.isLocaleSupported(locale)) {
      this.currentLocale = locale;
    } else {
      console.warn(
        `Locale ${locale} is not supported, using ${DEFAULT_LOCALE}`,
      );
      this.currentLocale = DEFAULT_LOCALE;
    }
  }

  /**
   * Get current locale
   */
  static getCurrentLocale(): string {
    return this.currentLocale;
  }

  /**
   * Detect browser locale
   */
  static detectBrowserLocale(): string {
    const browserLocale =
      navigator.language || navigator.languages?.[0] || DEFAULT_LOCALE;
    return this.isLocaleSupported(browserLocale)
      ? browserLocale
      : DEFAULT_LOCALE;
  }

  /**
   * Get locale configuration
   */
  static getLocaleConfig(locale = this.currentLocale): LocaleConfig {
    return CALENDAR_LOCALE[locale] || CALENDAR_LOCALE[DEFAULT_LOCALE];
  }
}
