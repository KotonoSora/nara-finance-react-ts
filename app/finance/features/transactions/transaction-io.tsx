import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { downloadCSV } from "~/finance/shared/utils/export";
import { parseCSVTransactions } from "~/finance/shared/utils/import";
import { showExportToast } from "~/finance/shared/utils/notifications";

const exportToPDF = () =>
  import("~/finance/shared/utils/export-pdf").then((mod) => mod.exportToPDF);

interface TransactionIOProps {
  transactions: Transaction[];
  onImport: (transactions: Omit<Transaction, "id">[]) => Promise<void>;
}

export function TransactionIO({ transactions, onImport }: TransactionIOProps) {
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedTransactions = await parseCSVTransactions(file);
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
        await downloadCSV(transactions, filename);
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
      categorySummary: {} as Record<TransactionCategory, number>,
      budgets: [],
      trends: [],
      forecastedExpenses: 0,
      forecastedSavings: 0,
    };

    const exportPromise = new Promise<ExportResult>(async (resolve, reject) => {
      try {
        const exportPDFFunc = await exportToPDF();
        await exportPDFFunc(transactions, summary, filename);
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
