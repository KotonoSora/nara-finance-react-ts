import Papa from "papaparse";

import type { Transaction } from "~/routes/finance/domain/entities/transaction.entity";

export interface ExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  dateFormat?: "iso" | "locale";
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
  period: {
    start: Date;
    end: Date;
  };
}

/**
 * Application Service for exporting financial data to various formats
 */
export class ExportService {
  /**
   * Export transactions to CSV format
   */
  async exportToCSV(
    transactions: Transaction[],
    options: ExportOptions = {},
  ): Promise<string> {
    const {
      filename = "transactions.csv",
      includeHeaders = true,
      dateFormat = "iso",
    } = options;

    const csvData = transactions.map((transaction) => ({
      date:
        dateFormat === "iso"
          ? transaction.date.toISOString().split("T")[0]
          : transaction.date.toLocaleDateString(),
      type: transaction.type,
      category: transaction.category_id,
      amount: transaction.amount.toString(),
      description: transaction.description,
    }));

    const csvString = Papa.unparse(csvData, {
      header: includeHeaders,
    });

    return csvString;
  }

  /**
   * Download CSV file to user's device
   */
  async downloadCSV(
    transactions: Transaction[],
    options: ExportOptions = {},
  ): Promise<void> {
    const { filename = "transactions.csv" } = options;
    const csvString = await this.exportToCSV(transactions, options);

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL
    URL.revokeObjectURL(link.href);
  }

  /**
   * Generate financial summary data
   */
  generateFinancialSummary(
    transactions: Transaction[],
    period?: { start: Date; end: Date },
  ): FinancialSummary {
    const filteredTransactions = period
      ? transactions.filter(
          (t) => t.date >= period.start && t.date <= period.end,
        )
      : transactions;

    const totalIncome = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netAmount: totalIncome - totalExpenses,
      transactionCount: filteredTransactions.length,
      period: period || {
        start: new Date(Math.min(...transactions.map((t) => t.date.getTime()))),
        end: new Date(Math.max(...transactions.map((t) => t.date.getTime()))),
      },
    };
  }

  /**
   * Generate detailed financial report data
   */
  generateFinancialReport(data: {
    transactions: Transaction[];
    summary: FinancialSummary;
  }): {
    html: string;
    metadata: {
      generatedAt: Date;
      transactionCount: number;
      period: string;
    };
  } {
    const { transactions, summary } = data;

    // Group transactions by category
    const byCategory = transactions.reduce(
      (acc, transaction) => {
        const category = transaction.category_id;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(transaction);
        return acc;
      },
      {} as Record<string, Transaction[]>,
    );

    // Generate HTML report (simplified version)
    const html = `
      <div class="financial-report">
        <h1>Financial Report</h1>
        <div class="summary">
          <h2>Summary</h2>
          <p>Total Income: $${summary.totalIncome.toFixed(2)}</p>
          <p>Total Expenses: $${summary.totalExpenses.toFixed(2)}</p>
          <p>Net Amount: $${summary.netAmount.toFixed(2)}</p>
          <p>Transaction Count: ${summary.transactionCount}</p>
        </div>
        <div class="by-category">
          <h2>By Category</h2>
          ${Object.entries(byCategory)
            .map(
              ([category, categoryTransactions]) => `
                <div class="category-section">
                  <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                  <p>Transactions: ${categoryTransactions.length}</p>
                  <p>Total: $${categoryTransactions
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}</p>
                </div>
              `,
            )
            .join("")}
        </div>
      </div>
    `;

    return {
      html,
      metadata: {
        generatedAt: new Date(),
        transactionCount: transactions.length,
        period: `${summary.period.start.toDateString()} - ${summary.period.end.toDateString()}`,
      },
    };
  }

  /**
   * Export transactions in JSON format
   */
  async exportToJSON(
    transactions: Transaction[],
    options: { pretty?: boolean } = {},
  ): Promise<string> {
    const { pretty = false } = options;

    const exportData = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      transactions: transactions.map((t) => ({
        ...t,
        date: t.date.toISOString(),
      })),
    };

    return JSON.stringify(exportData, null, pretty ? 2 : 0);
  }
}

// Legacy compatibility functions
export const exportToCSV = (transactions: Transaction[], filename?: string) =>
  new ExportService().exportToCSV(transactions, { filename });
export const downloadCSV = (transactions: Transaction[], filename?: string) =>
  new ExportService().downloadCSV(transactions, { filename });
export const generateFinancialReport = (data: {
  transactions: Transaction[];
  summary: FinancialSummary;
}) => new ExportService().generateFinancialReport(data);
export const exportToJSON = (transactions: Transaction[], pretty?: boolean) =>
  new ExportService().exportToJSON(transactions, { pretty });
