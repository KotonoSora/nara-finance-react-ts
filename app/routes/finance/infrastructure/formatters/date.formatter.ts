import {
  addMonths,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  endOfMonth,
  format,
  isSameMonth,
  isSameYear,
  isWithinInterval,
  startOfMonth,
  subMonths,
} from "date-fns";

export interface DateRange {
  from: Date;
  to: Date;
}

export interface DateFormatOptions {
  locale?: string;
  timeZone?: string;
  includeTime?: boolean;
}

/**
 * Infrastructure service for date formatting and manipulation
 */
export class DateFormatter {
  private static defaultLocale = "en-US";
  private static defaultTimeZone = "UTC";

  /**
   * Determines if a date falls within a specified range
   */
  static isDateInRange(date: Date, rangeStart: Date, rangeEnd: Date): boolean {
    // Ensure start is before end
    const start = rangeStart < rangeEnd ? rangeStart : rangeEnd;
    const end = rangeStart < rangeEnd ? rangeEnd : rangeStart;

    return isWithinInterval(date, { start, end });
  }

  /**
   * Get month range from a specific date
   */
  static getMonthRangeFromDate(date: Date): DateRange {
    return {
      from: startOfMonth(date),
      to: endOfMonth(date),
    };
  }

  /**
   * Get a human-readable label for a date range
   */
  static getDateRangeLabel(range: DateRange): string {
    if (isSameMonth(range.from, range.to)) {
      return format(range.from, "MMMM yyyy");
    }

    if (isSameYear(range.from, range.to)) {
      return `${format(range.from, "MMM")} - ${format(range.to, "MMM yyyy")}`;
    }

    return `${format(range.from, "MMM yyyy")} - ${format(range.to, "MMM yyyy")}`;
  }

  /**
   * Format date with various options
   */
  static formatDate(
    date: Date,
    formatString: string = "PP",
    options: DateFormatOptions = {},
  ): string {
    const { locale } = options;

    // Use date-fns format with optional locale
    return format(
      date,
      formatString,
      locale ? { locale: require(`date-fns/locale/${locale}`) } : undefined,
    );
  }

  /**
   * Format date for financial reports
   */
  static formatForFinancialReport(date: Date): string {
    return format(date, "MMM dd, yyyy");
  }

  /**
   * Format date for ISO string (API usage)
   */
  static formatISO(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  /**
   * Format date for display in transaction lists
   */
  static formatForTransaction(date: Date): string {
    const now = new Date();
    const daysDiff = differenceInDays(now, date);

    if (daysDiff === 0) {
      return "Today";
    } else if (daysDiff === 1) {
      return "Yesterday";
    } else if (daysDiff < 7) {
      return format(date, "EEEE"); // Day of week
    } else if (daysDiff < 365) {
      return format(date, "MMM dd"); // Month and day
    } else {
      return format(date, "MMM dd, yyyy"); // Full date
    }
  }

  /**
   * Get relative time description
   */
  static getRelativeTime(date: Date): string {
    const now = new Date();
    const daysDiff = differenceInDays(now, date);
    const monthsDiff = differenceInMonths(now, date);
    const yearsDiff = differenceInYears(now, date);

    if (daysDiff === 0) {
      return "Today";
    } else if (daysDiff === 1) {
      return "Yesterday";
    } else if (daysDiff < 7) {
      return `${daysDiff} days ago`;
    } else if (daysDiff < 30) {
      const weeks = Math.floor(daysDiff / 7);
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    } else if (monthsDiff < 12) {
      return monthsDiff === 1 ? "1 month ago" : `${monthsDiff} months ago`;
    } else {
      return yearsDiff === 1 ? "1 year ago" : `${yearsDiff} years ago`;
    }
  }

  /**
   * Parse various date formats to Date object
   */
  static parseDate(dateString: string): Date {
    // Handle common date formats
    const formats = [
      // ISO format
      /^\d{4}-\d{2}-\d{2}$/,
      // US format (MM/DD/YYYY)
      /^\d{1,2}\/\d{1,2}\/\d{4}$/,
      // European format (DD/MM/YYYY)
      /^\d{1,2}\/\d{1,2}\/\d{4}$/,
      // Dash format (MM-DD-YYYY)
      /^\d{1,2}-\d{1,2}-\d{4}$/,
    ];

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${dateString}`);
    }

    return date;
  }

  /**
   * Get start and end of current month
   */
  static getCurrentMonthRange(): DateRange {
    const now = new Date();
    return this.getMonthRangeFromDate(now);
  }

  /**
   * Get start and end of previous month
   */
  static getPreviousMonthRange(): DateRange {
    const now = new Date();
    const previousMonth = subMonths(now, 1);
    return this.getMonthRangeFromDate(previousMonth);
  }

  /**
   * Get start and end of current year
   */
  static getCurrentYearRange(): DateRange {
    const now = new Date();
    return {
      from: new Date(now.getFullYear(), 0, 1),
      to: new Date(now.getFullYear(), 11, 31),
    };
  }

  /**
   * Get date range for last N days
   */
  static getLastNDaysRange(days: number): DateRange {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - days);

    return {
      from: startDate,
      to: now,
    };
  }

  /**
   * Check if date is same month as another date
   */
  static isSameMonth(date1: Date, date2: Date): boolean {
    return isSameMonth(date1, date2);
  }

  /**
   * Check if date is same year as another date
   */
  static isSameYear(date1: Date, date2: Date): boolean {
    return isSameYear(date1, date2);
  }

  /**
   * Configure default locale and timezone
   */
  static configure(locale: string, timeZone: string): void {
    this.defaultLocale = locale;
    this.defaultTimeZone = timeZone;
  }

  /**
   * Validate date is not in the future (for transactions)
   */
  static validateTransactionDate(date: Date): boolean {
    return date <= new Date();
  }

  /**
   * Get fiscal year range (assuming April-March fiscal year)
   */
  static getFiscalYearRange(year?: number): DateRange {
    const currentYear = year || new Date().getFullYear();
    return {
      from: new Date(currentYear, 3, 1), // April 1st
      to: new Date(currentYear + 1, 2, 31), // March 31st
    };
  }
}

// Convenience exports for legacy compatibility
export const formatDate = (
  date: Date,
  formatString?: string,
  options?: DateFormatOptions,
) => DateFormatter.formatDate(date, formatString, options);

export const formatDateTime = (date: Date, options?: DateFormatOptions) =>
  DateFormatter.formatDate(date, "PPp", options);

export const formatForTransaction = (date: Date) =>
  DateFormatter.formatForTransaction(date);

export const formatForFinancialReport = (date: Date) =>
  DateFormatter.formatForFinancialReport(date);

export const formatISO = (date: Date) => DateFormatter.formatISO(date);
