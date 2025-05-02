import Papa from "papaparse";

/**
 * Generates a detailed financial report from transaction data
 * @param data - Object containing transactions and financial summary
 * @returns Formatted report data (HTML/PDF)
 * @example
 * ```ts
 * const report = generateFinancialReport({
 *   transactions: transactions,
 *   summary: financialSummary
 * })
 * ```
 */
export function generateFinancialReport(data: {
  transactions: Transaction[];
  summary: FinancialSummary;
}) {
  // Implementation for generating detailed financial reports
  // This would return formatted HTML or PDF data
}

export async function exportToCSV(
  transactions: Transaction[],
  filename = "transactions.csv",
): Promise<string> {
  const csvData = transactions.map((transaction) => ({
    date: transaction.date.toISOString().split("T")[0],
    type: transaction.type,
    category: transaction.category,
    amount: transaction.amount.toString(),
    description: transaction.description,
  }));

  const csvString = Papa.unparse(csvData);

  if (filename) {
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return Promise.resolve(csvString);
}

export async function downloadCSV(
  transactions: Transaction[],
  filename = "transactions.csv",
): Promise<void> {
  const csv = await exportToCSV(transactions);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
