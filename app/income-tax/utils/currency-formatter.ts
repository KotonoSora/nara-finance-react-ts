export const CURRENCY_CONFIG: Record<string, { code: string; locale: string }> =
  {
    US: { code: "USD", locale: "en-US" },
    UK: { code: "GBP", locale: "en-GB" },
    CA: { code: "CAD", locale: "en-CA" },
    JP: { code: "JPY", locale: "ja-JP" },
    KR: { code: "KRW", locale: "ko-KR" },
    VN: { code: "VND", locale: "vi-VN" },
    SG: { code: "SGD", locale: "en-SG" },
  };

export function formatCurrency(amount: number, country: string): string {
  const config = CURRENCY_CONFIG[country];
  if (!config)
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCompactCurrency(amount: number, country: string): string {
  const config = CURRENCY_CONFIG[country];
  if (!config) return formatCompactNumber(amount, "USD");

  if (Math.abs(amount) >= 1000000) {
    return `${formatCurrency(amount / 1000000, country)}M`;
  }
  if (Math.abs(amount) >= 1000) {
    return `${formatCurrency(amount / 1000, country)}K`;
  }
  return formatCurrency(amount, country);
}

export function formatCompactNumber(
  amount: number,
  currencyCode: string,
): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    notation: "compact",
    maximumFractionDigits: 1,
  });
  return formatter.format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function parseCurrencyInput(input: string): number {
  // Remove currency symbols, spaces, and commas
  const cleaned = input.replace(/[^0-9.-]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
