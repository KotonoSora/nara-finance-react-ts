const STORAGE_KEYS = {
  TRANSACTIONS: "nara-finance:transactions",
  SUMMARY: "nara-finance:summary",
} as const;

// Check if localStorage is available
const isStorageAvailable = () => {
  try {
    if (typeof window === "undefined") return false;
    if (typeof localStorage === "undefined") return false;
    return true;
  } catch {
    return false;
  }
};

export function saveTransactions(transactions: Transaction[]) {
  if (!isStorageAvailable()) return;
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

export function getStoredTransactions(): Transaction[] {
  if (!isStorageAvailable()) return [];

  const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    return parsed.map((t: any) => ({
      ...t,
      date: new Date(t.date),
    }));
  } catch {
    return [];
  }
}

export function saveSummary(summary: FinancialSummary) {
  if (!isStorageAvailable()) return;
  localStorage.setItem(STORAGE_KEYS.SUMMARY, JSON.stringify(summary));
}

export function getStoredSummary(): FinancialSummary | null {
  if (!isStorageAvailable()) return null;

  const stored = localStorage.getItem(STORAGE_KEYS.SUMMARY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
