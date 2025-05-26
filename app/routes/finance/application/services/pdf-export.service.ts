/**
 * PDF Export Service - Application Layer
 *
 * This service handles PDF export functionality for financial reports.
 * It combines domain data with infrastructure concerns to create formatted PDF documents.
 *
 * @layer Application
 * @category Services
 */

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import type { FinancialSummary } from "~/routes/finance/domain/types/analytics.types";
import type {
  Budget,
  Transaction,
} from "~/routes/finance/domain/types/entity.types";
import type { TransactionType } from "~/routes/finance/domain/value-objects/finance-constants";

import { transactionService } from "~/routes/finance/domain/services/transaction.service";
import { formatCurrency } from "~/routes/finance/infrastructure/formatters/currency.formatter";
import { formatDate } from "~/routes/finance/infrastructure/formatters/date.formatter";

/**
 * PDF export options
 */
export interface PDFExportOptions {
  /** Custom filename (without extension) */
  filename?: string;
  /** Include transaction details */
  includeTransactions?: boolean;
  /** Include budget overview */
  includeBudgets?: boolean;
  /** Include charts/graphs */
  includeCharts?: boolean;
  /** Currency code for formatting */
  currency?: string;
  /** Locale for formatting */
  locale?: string;
  /** Custom company/user name */
  companyName?: string;
  /** Custom report title */
  title?: string;
  /** Date range for the report */
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * PDF report data structure
 */
export interface PDFReportData {
  /** Report metadata */
  metadata: {
    title: string;
    generatedAt: Date;
    dateRange?: {
      start: Date;
      end: Date;
    };
    companyName?: string;
  };
  /** Financial summary */
  summary: FinancialSummary;
  /** Transactions to include */
  transactions: Transaction[];
  /** Budget data */
  budgets?: Budget[];
}

/**
 * PDF Export Service Class
 *
 * Provides comprehensive PDF export functionality for financial reports.
 * Supports customizable layouts, multiple currencies, and various report types.
 */
export class PDFExportService {
  private readonly defaultOptions: Required<PDFExportOptions> = {
    filename: "financial-report",
    includeTransactions: true,
    includeBudgets: true,
    includeCharts: false,
    currency: "USD",
    locale: "en-US",
    companyName: "Personal Finance",
    title: "Financial Report",
    dateRange: {
      start: new Date(new Date().getFullYear(), 0, 1),
      end: new Date(),
    },
  };

  /**
   * Exports financial data to PDF
   *
   * @param data - Report data to export
   * @param options - Export configuration options
   * @returns Promise that resolves when PDF is generated and downloaded
   *
   * @example
   * ```ts
   * const service = new PDFExportService();
   * await service.exportToPDF({
   *   metadata: { title: "Q1 Report", generatedAt: new Date() },
   *   summary: financialSummary,
   *   transactions: transactionList,
   * }, {
   *   filename: "q1-report",
   *   currency: "USD",
   *   locale: "en-US"
   * });
   * ```
   */
  async exportToPDF(
    data: PDFReportData,
    options: Partial<PDFExportOptions> = {},
  ): Promise<void> {
    const config = { ...this.defaultOptions, ...options };

    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Add header
      yPosition = this.addHeader(doc, data.metadata, config, yPosition);

      // Add summary section
      yPosition = this.addSummarySection(doc, data.summary, config, yPosition);

      // Add budget overview if enabled
      if (config.includeBudgets && data.budgets) {
        yPosition = this.addBudgetSection(doc, data.budgets, config, yPosition);
      }

      // Add transaction details if enabled
      if (config.includeTransactions && data.transactions.length > 0) {
        this.addTransactionSection(doc, data.transactions, config);
      }

      // Add footer to all pages
      this.addFooter(doc, data.metadata.generatedAt, config);

      // Download the PDF
      doc.save(`${config.filename}.pdf`);
    } catch (error) {
      throw new Error(
        `Failed to export PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Exports transactions only to PDF
   *
   * @param transactions - Transactions to export
   * @param options - Export options
   */
  async exportTransactionsToPDF(
    transactions: Transaction[],
    options: Partial<PDFExportOptions> = {},
  ): Promise<void> {
    const analysis = transactionService.analyzeTransactions(transactions);

    const reportData: PDFReportData = {
      metadata: {
        title: options.title || "Transaction Report",
        generatedAt: new Date(),
        dateRange: options.dateRange,
        companyName: options.companyName,
      },
      summary: {
        totalIncome: analysis.totalIncome.toNumber(),
        totalExpenses: analysis.totalExpenses.toNumber(),
        savings: analysis.netAmount.toNumber(),
        categorySummary: {},
        budgets: [],
        trends: [],
        forecastedExpenses: 0,
        forecastedSavings: 0,
      },
      transactions,
    };

    await this.exportToPDF(reportData, options);
  }

  /**
   * Adds header section to PDF
   */
  private addHeader(
    doc: jsPDF,
    metadata: PDFReportData["metadata"],
    config: Required<PDFExportOptions>,
    yPosition: number,
  ): number {
    // Company name
    if (metadata.companyName) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(metadata.companyName, 14, yPosition);
      yPosition += 8;
    }

    // Report title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(metadata.title, 14, yPosition);
    yPosition += 15;

    // Date range
    if (metadata.dateRange) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const dateText = `Period: ${formatDate(metadata.dateRange.start, config.locale)} - ${formatDate(metadata.dateRange.end, config.locale)}`;
      doc.text(dateText, 14, yPosition);
      yPosition += 8;
    }

    // Generation date
    doc.setFontSize(8);
    const generatedText = `Generated: ${formatDate(
      metadata.generatedAt,
      "PPPpp",
      { locale: config.locale },
    )}`;
    doc.setFont("helvetica", "normal");
    doc.text(generatedText, 14, yPosition);
    yPosition += 15;

    return yPosition;
  }

  /**
   * Adds financial summary section to PDF
   */
  private addSummarySection(
    doc: jsPDF,
    summary: FinancialSummary,
    config: Required<PDFExportOptions>,
    yPosition: number,
  ): number {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Financial Summary", 14, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Summary data
    const summaryItems = [
      [
        `Total Income:`,
        formatCurrency(summary.totalIncome, config.currency, config.locale),
      ],
      [
        `Total Expenses:`,
        formatCurrency(summary.totalExpenses, config.currency, config.locale),
      ],
      [
        `Net Savings:`,
        formatCurrency(summary.savings, config.currency, config.locale),
      ],
    ];

    summaryItems.forEach(([label, value]) => {
      doc.text(label, 14, yPosition);
      doc.text(value, 80, yPosition);
      yPosition += 7;
    });

    return yPosition + 10;
  }

  /**
   * Adds budget overview section to PDF
   */
  private addBudgetSection(
    doc: jsPDF,
    budgets: Budget[],
    config: Required<PDFExportOptions>,
    yPosition: number,
  ): number {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Budget Overview", 14, yPosition);
    yPosition += 5;

    const budgetData = budgets
      .filter((b) => b.category_id !== "salary")
      .map((budget) => [
        budget.category_id,
        formatCurrency(budget.spent, config.currency, config.locale),
        formatCurrency(budget.limit, config.currency, config.locale),
        `${Math.round((budget.spent / budget.limit) * 100)}%`,
        budget.spent > budget.limit ? "Over Budget" : "On Track",
      ]);

    if (budgetData.length > 0) {
      autoTable(doc, {
        startY: yPosition,
        head: [["Category", "Spent", "Limit", "Usage", "Status"]],
        body: budgetData,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
        columnStyles: {
          1: { halign: "right" },
          2: { halign: "right" },
          3: { halign: "center" },
          4: { halign: "center" },
        },
        didParseCell: (data) => {
          // Highlight over-budget items
          if (data.column.index === 4 && data.cell.text[0] === "Over Budget") {
            data.cell.styles.textColor = [220, 38, 127];
            data.cell.styles.fontStyle = "bold";
          }
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }

    return yPosition;
  }

  /**
   * Adds transaction details section to PDF
   */
  private addTransactionSection(
    doc: jsPDF,
    transactions: Transaction[],
    config: Required<PDFExportOptions>,
  ): void {
    doc.addPage();

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Transaction Details", 14, 20);

    const transactionData = transactions.map((t) => [
      formatDate(t.date, "PPP", { locale: config.locale }),
      this.capitalizeFirst(t.type),
      this.capitalizeFirst(t.category_id),
      t.description || "-",
      formatCurrency(t.amount, config.currency, config.locale),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Date", "Type", "Category", "Description", "Amount"]],
      body: transactionData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 20 },
        2: { cellWidth: 25 },
        3: { cellWidth: "auto" },
        4: { cellWidth: 25, halign: "right" },
      },
      didParseCell: (data) => {
        // Color-code transaction types
        if (data.column.index === 1) {
          if (data.cell.text[0] === "Income") {
            data.cell.styles.textColor = [34, 197, 94];
          } else if (data.cell.text[0] === "Expense") {
            data.cell.styles.textColor = [239, 68, 68];
          }
        }
      },
    });
  }

  /**
   * Adds footer to all pages
   */
  private addFooter(
    doc: jsPDF,
    generatedAt: Date,
    config: Required<PDFExportOptions>,
  ): void {
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");

      // Generation date
      doc.text(
        `Generated on ${formatDate(generatedAt, "PPP", { locale: config.locale })}`,
        14,
        doc.internal.pageSize.height - 10,
      );

      // Page number
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 25,
        doc.internal.pageSize.height - 10,
      );
    }
  }

  /**
   * Utility to capitalize first letter
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

/**
 * Singleton instance for convenience
 */
export const pdfExportService = new PDFExportService();

/**
 * Legacy function for backward compatibility
 * @deprecated Use PDFExportService.exportToPDF instead
 */
export async function exportToPDF(
  transactions: Transaction[],
  summary: FinancialSummary,
  filename: string,
): Promise<void> {
  const reportData: PDFReportData = {
    metadata: {
      title: "Financial Report",
      generatedAt: new Date(),
    },
    summary,
    transactions,
  };

  await pdfExportService.exportToPDF(reportData, { filename });
}
