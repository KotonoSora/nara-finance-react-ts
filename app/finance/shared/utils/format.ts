const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function formatPercent(value: number): string {
  return percentFormatter.format(value / 100);
}

export function formatCompactCurrency(amount: number): string {
  if (Math.abs(amount) >= 1000000) {
    return `${currencyFormatter.format(amount / 1000000)}M`;
  }
  if (Math.abs(amount) >= 1000) {
    return `${currencyFormatter.format(amount / 1000)}K`;
  }
  return currencyFormatter.format(amount);
}

export function getTransactionAmountLabel(
  amount: number,
  type: TransactionType,
): string {
  const prefix = type === "expense" ? "-" : "+";
  return `${prefix}${formatCurrency(amount)}`;
}

export function getChangeLabel(current: number, previous: number): string {
  const change = ((current - previous) / previous) * 100;
  const prefix = change > 0 ? "+" : "";
  return `${prefix}${change.toFixed(1)}%`;
}
