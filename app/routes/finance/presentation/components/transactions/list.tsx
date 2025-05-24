import clsx from "clsx";
import { format } from "date-fns";
import { CalendarIcon, FileDown, FileUp, Search } from "lucide-react";
import { lazy, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import type { DateRange } from "react-day-picker";
import type {
  FinancialSummary,
  TableSort,
  Transaction,
  TransactionCategory,
  TransactionFilters,
} from "../../types";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { showExportToastFromPromise } from "../../utils/notifications";
import FinancialInsights from "./financial-insights";
import ImportDialog from "./import-dialog";

const exportToCSV = () =>
  import("~/routes/finance/shared/utils/export").then((mod) => mod.exportToCSV);

const exportToPDF = () =>
  import("~/routes/finance/shared/utils/export-pdf").then(
    (mod) => mod.exportToPDF,
  );

interface ListProps {
  selectedDate: Date | null;
  transactions?: Transaction[];
  summary?: FinancialSummary;
  addTransactions: (transactions: Transaction[]) => void;
}

export default function List({
  selectedDate,
  transactions = [],
  summary,
  addTransactions,
}: ListProps) {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [sort, setSort] = useState<TableSort>({
    column: "date",
    direction: "desc",
  });
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Keyboard shortcuts
  useHotkeys("ctrl+i", (e) => {
    e.preventDefault();
    setIsImportOpen(true);
  });

  useHotkeys("ctrl+e", async (e) => {
    e.preventDefault();
    handleExportCSV();
  });

  useHotkeys("ctrl+shift+e", async (e) => {
    e.preventDefault();
    handleExportPDF();
  });

  const handleExportCSV = async () => {
    const filename = `transactions-${new Date().toISOString().split("T")[0]}`;
    const exportPromise = new Promise<ExportResult>(async (resolve, reject) => {
      const exportCSVFunc = await exportToCSV();
      try {
        await exportCSVFunc(transactions, filename);
        resolve({ filename: `${filename}.csv` });
      } catch (error) {
        reject(error);
      }
    });

    showExportToastFromPromise(exportPromise);
  };

  const handleExportPDF = async () => {
    if (!summary) {
      throw new Error("Summary is required for PDF export");
    }

    const filename = `transactions-${new Date().toISOString().split("T")[0]}`;
    const exportPromise = new Promise<ExportResult>(async (resolve, reject) => {
      try {
        const exportPDFFunc = await exportToPDF();
        await exportPDFFunc(transactions, summary, filename);
        resolve({ filename: `${filename}.pdf` });
      } catch (error) {
        reject(error);
      }
    });

    showExportToastFromPromise(exportPromise);
  };

  const handleImport = (importedTransactions: Transaction[]) => {
    addTransactions(importedTransactions);
  };

  const formattedDate = selectedDate
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(selectedDate)
    : null;

  const filteredTransactions = transactions.filter((transaction) => {
    if (filters.type && transaction.type !== filters.type) return false;
    if (filters.category && transaction.category !== filters.category)
      return false;
    if (
      filters.searchTerm &&
      !transaction.description
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-4 md:space-y-6 px-1">
      {summary && (
        <FinancialInsights
          summary={summary}
          dateRange={filters.dateRange}
          onCategorySelect={(category) =>
            setFilters((f) => ({ ...f, category }))
          }
        />
      )}

      <Card>
        <CardHeader className="space-y-6 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg md:text-xl font-semibold">Transactions</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" className="flex-1 sm:flex-initial">
                Clear Filters
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-initial">
                Export CSV
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8 w-full"
                onChange={(e) =>
                  setFilters((f) => ({ ...f, searchTerm: e.target.value }))
                }
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                          {format(filters.dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(filters.dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    selected={filters.dateRange}
                    onSelect={(range: DateRange | undefined) =>
                      setFilters((f) => ({
                        ...f,
                        dateRange:
                          range?.from && range?.to
                            ? { from: range.from, to: range.to }
                            : undefined,
                      }))
                    }
                  />
                </PopoverContent>
              </Popover>

              <Select
                onValueChange={(value: TransactionType) =>
                  setFilters((f) => ({ ...f, type: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value: TransactionCategory) =>
                  setFilters((f) => ({ ...f, category: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredTransactions.length > 0 ? (
            <div className="relative px-4 md:px-6">
              <Table>
                <TableHeader className="sticky top-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75 z-10">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <TableCell>
                        {format(transaction.date, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell
                        className={clsx("text-right font-medium", {
                          "text-chart-2": transaction.type === "income",
                          "text-destructive": transaction.type === "expense",
                          "text-chart-1": transaction.type === "investment",
                        })}
                      >
                        {transaction.type === "expense" ? "-" : "+"}$
                        {transaction.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No transactions found</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking your finances by adding transactions for this
                period.
              </p>
              <Button>Add Transaction</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setIsImportOpen(true)}
        >
          <FileUp className="h-4 w-4" />
          Import (Ctrl+I)
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleExportCSV}
        >
          <FileDown className="h-4 w-4" />
          Export CSV (Ctrl+E)
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleExportPDF}
        >
          <FileDown className="h-4 w-4" />
          Export PDF (Ctrl+Shift+E)
        </Button>
      </div>

      <ImportDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={handleImport}
      />
    </div>
  );
}
