import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { formatCurrency } from "./format";

export async function exportToPDF(
  transactions: Transaction[],
  summary: FinancialSummary,
  filename: string,
): Promise<void> {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text("Financial Report", 14, 20);

  // Add summary section
  doc.setFontSize(14);
  doc.text("Summary", 14, 35);
  doc.setFontSize(10);
  doc.text(`Total Income: ${formatCurrency(summary.totalIncome)}`, 14, 45);
  doc.text(`Total Expenses: ${formatCurrency(summary.totalExpenses)}`, 14, 52);
  doc.text(`Net Savings: ${formatCurrency(summary.savings)}`, 14, 59);

  // Add budget summary
  doc.setFontSize(14);
  doc.text("Budget Overview", 14, 75);
  const budgetData = summary.budgets
    .filter((b) => b.category !== "salary")
    .map((budget) => [
      budget.category,
      formatCurrency(budget.spent),
      formatCurrency(budget.limit),
      `${Math.round((budget.spent / budget.limit) * 100)}%`,
    ]);

  autoTable(doc, {
    startY: 80,
    head: [["Category", "Spent", "Limit", "Usage"]],
    body: budgetData,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Add transactions
  doc.addPage();
  doc.setFontSize(14);
  doc.text("Transaction Details", 14, 20);

  const transactionData = transactions.map((t) => [
    formatDate(t.date),
    t.type,
    t.category,
    t.description,
    formatCurrency(t.amount),
  ]);

  autoTable(doc, {
    startY: 25,
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
  });

  // Add footer with date
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      14,
      doc.internal.pageSize.height - 10,
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 25,
      doc.internal.pageSize.height - 10,
    );
  }

  doc.save(`${filename}.pdf`);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}
