import { toast } from "sonner";

import type {
  ExportResult,
  FinancialSummary,
  Transaction,
} from "~/routes/finance/types/finance";

import { Button } from "~/components/ui/button";
import { exportToCSV } from "~/routes/finance/application/services/export.service";
import { ImportService } from "~/routes/finance/application/services/import.service";

const exportToPDF = () =>
  import("~/routes/finance/application/services/pdf-export.service").then(
    (mod) => new mod.PDFExportService().exportToPDF,
  );

// Use UI helpers for notifications
const showExportToast = (promise: Promise<any>) => {
  toast.promise(promise, {
    loading: "Exporting...",
    success: "Export completed successfully!",
    error: "Export failed. Please try again.",
  });
};

interface TransactionIOProps {
  transactions: Transaction[];
  onImport: (transactions: Omit<Transaction, "id">[]) => Promise<void>;
}

export function TransactionIO({ transactions, onImport }: TransactionIOProps) {
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importService = new ImportService();
      const importedTransactions =
        await importService.parseCSVTransactions(file);
      await onImport(importedTransactions);
      toast.success("Import successful", {
        description: `Imported ${importedTransactions.length} transactions`,
      });
    } catch (error) {
      toast.error("Import failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // Reset the input
    event.target.value = "";
  };

  const handleExportCSV = async () => {
    const filename = `transactions-${new Date().toISOString().split("T")[0]}`;
    const exportPromise = new Promise<ExportResult>(async (resolve, reject) => {
      try {
        await exportToCSV(transactions, filename);
        resolve({ filename: `${filename}.csv` });
      } catch (error) {
        reject(error);
      }
    });

    showExportToast(exportPromise);
  };

  const handleExportPDF = async () => {
    const filename = `transactions-${new Date().toISOString().split("T")[0]}`;
    const summary: FinancialSummary = {
      totalIncome: 0,
      totalExpenses: 0,
      savings: 0,
      categorySummary: {} as Record<string, number>,
      budgets: [],
      trends: [],
      forecastedExpenses: 0,
      forecastedSavings: 0,
    };

    const exportPromise = new Promise<ExportResult>(async (resolve, reject) => {
      try {
        const exportPDFFunc = await exportToPDF();
        const reportData = {
          metadata: {
            title: "Transaction Report",
            generatedAt: new Date(),
          },
          summary,
          transactions,
        };
        await exportPDFFunc(reportData, { filename });
        resolve({ filename: `${filename}.pdf` });
      } catch (error) {
        reject(error);
      }
    });

    showExportToast(exportPromise);
  };

  return (
    <div className="flex gap-2">
      <input
        type="file"
        accept=".csv"
        onChange={handleImport}
        className="hidden"
        id="csv-import"
      />
      <label htmlFor="csv-import">
        <Button variant="outline" asChild>
          <span>Import CSV</span>
        </Button>
      </label>
      <Button variant="outline" onClick={handleExportCSV}>
        Export CSV
      </Button>
      <Button variant="outline" onClick={handleExportPDF}>
        Export PDF
      </Button>
    </div>
  );
}
