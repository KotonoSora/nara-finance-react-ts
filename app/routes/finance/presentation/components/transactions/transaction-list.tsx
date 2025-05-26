import clsx from "clsx";
import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronDown,
  ChevronUp,
  Download,
  Edit2,
  MoreVertical,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";

import type {
  Category,
  ExportResult,
  FinancialSummary,
  TableSort,
  Transaction,
  TransactionFilters,
  TransactionType,
} from "~/routes/finance/presentation/types/ui.types";
import type { DateRange } from "react-day-picker";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
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
import FinancialInsights from "~/routes/finance/presentation/components/transactions//financial-insights";
import DeleteTransactionDialog from "~/routes/finance/presentation/components/transactions/delete-transaction-dialog";
import ImportDialog from "~/routes/finance/presentation/components/transactions/import-dialog";
import { useFinanceShortcuts } from "~/routes/finance/presentation/hooks/use-advanced-shortcuts";
import { showExportToastFromPromise } from "~/routes/finance/presentation/utils/notifications";

const exportToCSV = () =>
  import("~/routes/finance/application/services/export.service").then(
    (mod) => mod.exportToCSV,
  );

const exportToPDF = () =>
  import("~/routes/finance/application/services/pdf-export.service").then(
    (mod) => new mod.PDFExportService().exportToPDF,
  );

interface ListProps {
  selectedDate: Date | null;
  transactions?: Transaction[];
  summary: FinancialSummary;
  onAddTransaction?: (data: Omit<Transaction, "id">) => void;
  onEditTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (transactionId: string) => void;
  categories?: Category[];
}

export default function List({
  selectedDate,
  transactions = [],
  summary,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  categories = [],
}: ListProps) {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isDeletingTransaction, setIsDeletingTransaction] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [sort, setSort] = useState<TableSort>({
    column: "date",
    direction: "desc",
  });
  const [isImportingTransactions, setIsImportingTransactions] = useState(false);
  const [localTransactions, setLocalTransactions] = useState(transactions);
  const [localSummary, setLocalSummary] = useState(summary);

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
    if (filters.category && transaction.category_id !== filters.category)
      return false;
    if (
      filters.searchTerm &&
      !transaction.description
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase())
    )
      return false;
    if (filters.dateRange) {
      const date = new Date(transaction.date);
      if (date < filters.dateRange.from || date > filters.dateRange.to)
        return false;
    }
    return true;
  });

  const sortedTransactions = filteredTransactions.sort((a, b) => {
    const direction = sort.direction === "asc" ? 1 : -1;
    switch (sort.column) {
      case "date":
        return (
          (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction
        );
      case "amount":
        return (a.amount - b.amount) * direction;
      case "description":
      case "type":
        return a[sort.column].localeCompare(b[sort.column]) * direction;
      case "category_id":
        // For category sorting, we need to get category names
        const aCategoryName =
          categories.find((c) => c.id === a.category_id)?.name || "";
        const bCategoryName =
          categories.find((c) => c.id === b.category_id)?.name || "";
        return aCategoryName.localeCompare(bCategoryName) * direction;
      default:
        return 0;
    }
  });

  const toggleSort = (column: keyof Transaction) => {
    setSort((prev) => ({
      column,
      direction:
        prev.column === column
          ? prev.direction === "asc"
            ? "desc"
            : "asc"
          : "asc",
    }));
  };

  const SortIcon = ({ column }: { column: keyof Transaction }) => {
    if (sort.column !== column) return null;
    return sort.direction === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const handleExport = async (format: "csv" | "pdf") => {
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `transactions-${timestamp}`;

    const exportPromise = new Promise<ExportResult>(async (resolve, reject) => {
      try {
        if (format === "csv") {
          const exportCSVFunc = await exportToCSV();
          await exportCSVFunc(filteredTransactions, filename);
        } else if (localSummary) {
          const exportPDFFunc = await exportToPDF();
          const reportData = {
            metadata: {
              title: "Transaction Report",
              generatedAt: new Date(),
            },
            summary: {
              ...localSummary,
              budgets: localSummary.budgets.map((budget) => ({
                ...budget,
                category_id: "general", // Default category_id for domain budgets
              })),
              trends: localSummary.trends || [],
              forecastedExpenses: localSummary.forecastedExpenses || 0,
              forecastedSavings: localSummary.forecastedSavings || 0,
            },
            transactions,
          };
          await exportPDFFunc(reportData, { filename });
        }
        resolve({ filename: `${filename}.${format}` });
      } catch (error) {
        reject(error);
      }
    });

    showExportToastFromPromise(exportPromise);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleEdit = (transaction: Transaction) => {
    onEditTransaction?.(transaction);
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeletingTransaction(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      onDeleteTransaction?.(transactionToDelete.id);
      setIsDeletingTransaction(false);
      setTransactionToDelete(null);
    }
  };

  const handleImportTransactions = (newTransactions: Transaction[]) => {
    // Add all imported transactions
    setLocalTransactions((prev) => [...prev, ...newTransactions]);

    // Update summary to reflect imported transactions
    if (localSummary) {
      setLocalSummary((prev) => {
        if (!prev) return prev;

        const newSummary: FinancialSummary = {
          totalIncome: prev.totalIncome || 0,
          totalExpenses: prev.totalExpenses || 0,
          savings: prev.savings || 0,
          categorySummary: { ...(prev.categorySummary || {}) },
          budgets: [...(prev.budgets || [])],
          trends: [...(prev.trends || [])],
          forecastedExpenses: prev.forecastedExpenses || 0,
          forecastedSavings: prev.forecastedSavings || 0,
        };

        newTransactions.forEach((transaction) => {
          if (transaction.type === "expense") {
            newSummary.totalExpenses += transaction.amount;
            if (!newSummary.categorySummary[transaction.category_id]) {
              newSummary.categorySummary[transaction.category_id] = 0;
            }
            newSummary.categorySummary[transaction.category_id] +=
              transaction.amount;
          } else if (transaction.type === "income") {
            newSummary.totalIncome += transaction.amount;
          }
        });

        newSummary.savings = newSummary.totalIncome - newSummary.totalExpenses;

        return newSummary;
      });
    }
  };

  // Setup keyboard shortcuts
  useFinanceShortcuts({
    handlers: {
      add: () =>
        onAddTransaction?.({
          date: selectedDate || new Date(),
          type: "expense",
          category_id: categories[0]?.id || "",
          amount: 0,
          description: "",
        }),
      cancel: handleClearFilters,
      import: () => setIsImportingTransactions(true),
      exportCSV: () => handleExport("csv"),
      exportPDF: () => handleExport("pdf"),
    },
  });

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 px-1 sm:px-2">
      {summary && (
        <FinancialInsights
          summary={summary}
          dateRange={filters.dateRange}
          onCategorySelect={(categoryId: string) =>
            setFilters((f) => ({ ...f, category: categoryId }))
          }
        />
      )}

      <Card>
        <CardHeader className="space-y-4 sm:space-y-5 md:space-y-6 p-3 sm:p-4 md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold">
              Transactions
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="flex-1 min-w-0 sm:flex-initial text-xs sm:text-sm px-3 py-2"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 min-w-0 sm:flex-initial text-xs sm:text-sm px-3 py-2"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("csv")}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("pdf")}>
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                className="flex-1 min-w-0 sm:flex-initial text-xs sm:text-sm px-3 py-2"
                onClick={() => setIsImportingTransactions(true)}
              >
                <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Import
              </Button>
            </div>
          </div>

          <div className="grid gap-2 sm:gap-3 md:gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-7 sm:pl-8 w-full text-sm"
                value={filters.searchTerm || ""}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, searchTerm: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal text-xs sm:text-sm px-2 sm:px-3 py-2"
                  >
                    <CalendarIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
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
                value={filters.type}
                onValueChange={(value: TransactionType) =>
                  setFilters((f) => ({ ...f, type: value }))
                }
              >
                <SelectTrigger className="w-full text-xs sm:text-sm">
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.category}
                onValueChange={(value: string) =>
                  setFilters((f) => ({ ...f, category: value }))
                }
              >
                <SelectTrigger className="w-full text-xs sm:text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {sortedTransactions.length > 0 ? (
            <div className="relative px-2 sm:px-4 md:px-6">
              <Table>
                <TableHeader className="sticky top-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75 z-10">
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => toggleSort("date")}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        <SortIcon column="date" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => toggleSort("description")}
                    >
                      <div className="flex items-center gap-2">
                        Description
                        <SortIcon column="description" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => toggleSort("category_id")}
                    >
                      <div className="flex items-center gap-2">
                        Category
                        <SortIcon column="category_id" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => toggleSort("type")}
                    >
                      <div className="flex items-center gap-2">
                        Type
                        <SortIcon column="type" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-right cursor-pointer hover:text-primary transition-colors"
                      onClick={() => toggleSort("amount")}
                    >
                      <div className="flex items-center justify-end gap-2">
                        Amount
                        <SortIcon column="amount" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="group hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <TableCell>
                        {format(transaction.date, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {
                            categories.find(
                              (c) => c.id === transaction.category_id,
                            )?.name
                          }
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {transaction.type}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={clsx("font-medium", {
                              "text-chart-2": transaction.type === "income",
                              "text-destructive":
                                transaction.type === "expense",
                              "text-chart-1": transaction.type === "investment",
                            })}
                          >
                            {transaction.type === "expense" ? "-" : "+"}$
                            {transaction.amount.toFixed(2)}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEdit(transaction)}
                              >
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(transaction)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-2 sm:p-3 mb-3 sm:mb-4">
                <Search className="h-4 w-4 sm:h-6 sm:w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                No transactions found
              </h3>
              <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm">
                {filters.type || filters.category || filters.searchTerm
                  ? "Try adjusting your filters"
                  : "Start tracking your finances by adding transactions for this period"}
              </p>
              <Button
                className="text-xs sm:text-sm px-3 sm:px-4 py-2"
                onClick={() =>
                  onAddTransaction &&
                  onAddTransaction({
                    date: selectedDate || new Date(),
                    type: "expense",
                    category_id: categories[0]?.id || "",
                    amount: 0,
                    description: "",
                  })
                }
              >
                Add Transaction
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteTransactionDialog
        open={isDeletingTransaction}
        onOpenChange={setIsDeletingTransaction}
        onConfirm={handleConfirmDelete}
        transaction={transactionToDelete || undefined}
      />

      <ImportDialog
        open={isImportingTransactions}
        onOpenChange={setIsImportingTransactions}
        onImport={handleImportTransactions}
      />
    </div>
  );
}
