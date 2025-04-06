import { Plus } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";

import type { Route } from "./+types/finance";

import { Button } from "~/components/ui/button";
import { Toaster } from "~/components/ui/sonner";
import TransactionDialog from "~/finance/features/transactions/transaction-dialog";
import { getDefaultBudget, updateBudgets } from "~/finance/shared/utils/budget";
import { prepareCalendarData } from "~/finance/shared/utils/calendar";
import { MOCK_DATA } from "~/finance/shared/utils/mock";
import {
  showBudgetWarningToast,
  showTransactionAddedToast,
  showTransactionDeletedToast,
  showTransactionUpdatedToast,
} from "~/finance/shared/utils/notifications";
import { useFinanceShortcuts } from "~/finance/shared/utils/shortcuts";
import {
  getStoredSummary,
  getStoredTransactions,
  saveSummary,
  saveTransactions,
} from "~/finance/shared/utils/storage";
import { analyzeTrends } from "~/finance/shared/utils/trends";

import TabsView from "./features/transactions/tabs-view";
import AuditTrail from "./shared/utils/audit";
import { FinancialAmount } from "./shared/utils/financial-precision";

const BudgetSection = lazy(
  () => import("~/finance/features/analysis/budget-section"),
);
const IncomeExpenseChart = lazy(
  () => import("~/finance/features/analysis/income-expense-chart"),
);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Finance" },
    { name: "description", content: "Finance Page Demo!" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const calendarData = prepareCalendarData();
  // We'll merge stored data with mock data on first load
  const storedTransactions = getStoredTransactions();
  const storedSummary = getStoredSummary();

  return {
    ...calendarData,
    transactions:
      storedTransactions.length > 0
        ? storedTransactions
        : MOCK_DATA.transactions,
    summary: storedSummary || MOCK_DATA.summary,
  };
}

export default function FinanceDemo({ loaderData }: Route.ComponentProps) {
  const {
    transactions: initialTransactions,
    summary: initialSummary,
    nowDate,
  } = loaderData;
  const [transactions, setTransactions] = useState(initialTransactions);
  const [summary, setSummary] = useState(initialSummary);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentViewDate, setCurrentViewDate] = useState<Date>(nowDate);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<TransactionCategory | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // Setup keyboard shortcuts
  useFinanceShortcuts({
    add: () => setIsAddingTransaction(true),
    cancel: () => {
      setIsAddingTransaction(false);
      setEditingTransaction(null);
    },
  });

  // Update budgets and check for warnings
  useEffect(() => {
    setSummary((prev) => {
      const existingCategories = new Set(prev.budgets.map((b) => b.category));
      const allCategories: TransactionCategory[] = [
        "food",
        "transport",
        "shopping",
        "salary",
        "other",
      ];
      const newBudgets = [...prev.budgets];

      for (const category of allCategories) {
        if (!existingCategories.has(category)) {
          newBudgets.push(getDefaultBudget(category));
        }
      }

      const updatedBudgets = updateBudgets(newBudgets, transactions);

      // Check for budget warnings
      updatedBudgets.forEach((budget) => {
        if (budget.category === "salary") return; // Skip income categories
        const spentPercentage = (budget.spent / budget.limit) * 100;
        if (spentPercentage >= 80 && spentPercentage < 100) {
          const remaining = budget.limit - budget.spent;
          showBudgetWarningToast(budget.category, remaining);
        }
      });

      return {
        ...prev,
        budgets: updatedBudgets,
        trends: analyzeTrends(transactions),
      };
    });
  }, [transactions]);

  // Save to local storage whenever transactions or summary changes
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveSummary(summary);
  }, [summary]);

  const handleDateRangeSelect = (range: DateRange) => {
    setSelectedDateRange(range);
    setSelectedDate(null); // Clear single date selection when using range
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedDateRange(undefined); // Clear range selection when selecting single date
    setIsAddingTransaction(true);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentViewDate(date);
  };

  const handleAddTransaction = (data: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };

    // Add audit trail
    AuditTrail.addRecord(
      "ADD_TRANSACTION",
      newTransaction.id,
      null,
      newTransaction,
    );

    setTransactions((prev) => [...prev, newTransaction]);

    // Update summary with precise calculations
    setSummary((prev) => {
      const amount = new FinancialAmount(data.amount);
      const newCategorySummary = { ...prev.categorySummary };

      if (data.type === "expense") {
        newCategorySummary[data.category] = new FinancialAmount(
          newCategorySummary[data.category] || 0,
        )
          .add(amount)
          .toNumber();
      }

      const newTotalIncome =
        data.type === "income"
          ? new FinancialAmount(prev.totalIncome).add(amount).toNumber()
          : prev.totalIncome;

      const newTotalExpenses =
        data.type === "expense"
          ? new FinancialAmount(prev.totalExpenses).add(amount).toNumber()
          : prev.totalExpenses;

      return {
        ...prev,
        totalIncome: newTotalIncome,
        totalExpenses: newTotalExpenses,
        savings: new FinancialAmount(newTotalIncome)
          .subtract(new FinancialAmount(newTotalExpenses))
          .toNumber(),
        categorySummary: newCategorySummary,
      };
    });

    setIsAddingTransaction(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsAddingTransaction(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    const transaction = transactions.find((t) => t.id === transactionId);
    if (!transaction) return;

    setTransactions((prev) => prev.filter((t) => t.id !== transactionId));

    // Update summary
    setSummary((prev) => {
      const newCategorySummary = { ...prev.categorySummary };
      if (transaction.type === "expense") {
        newCategorySummary[transaction.category] = Math.max(
          0,
          (newCategorySummary[transaction.category] || 0) - transaction.amount,
        );
      }

      return {
        ...prev,
        totalIncome:
          prev.totalIncome -
          (transaction.type === "income" ? transaction.amount : 0),
        totalExpenses:
          prev.totalExpenses -
          (transaction.type === "expense" ? transaction.amount : 0),
        savings:
          prev.savings -
          (transaction.type === "income"
            ? transaction.amount
            : -transaction.amount),
        categorySummary: newCategorySummary,
      };
    });

    showTransactionDeletedToast();
  };

  const handleSubmitTransaction = (data: Omit<Transaction, "id">) => {
    if (editingTransaction) {
      // Handle editing existing transaction
      const updatedTransaction = {
        ...editingTransaction,
        ...data,
      };

      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingTransaction.id ? updatedTransaction : t,
        ),
      );

      // Update summary to reflect changes
      setSummary((prev) => {
        const oldAmount =
          editingTransaction.type === "expense" ? editingTransaction.amount : 0;
        const newAmount = data.type === "expense" ? data.amount : 0;
        const amountDiff = newAmount - oldAmount;

        const newCategorySummary = { ...prev.categorySummary };
        if (editingTransaction.category !== data.category) {
          // Category changed - update both categories
          newCategorySummary[editingTransaction.category] = Math.max(
            0,
            (newCategorySummary[editingTransaction.category] || 0) - oldAmount,
          );
          newCategorySummary[data.category] =
            (newCategorySummary[data.category] || 0) + newAmount;
        } else {
          // Same category - just update the amount
          newCategorySummary[data.category] =
            (newCategorySummary[data.category] || 0) + amountDiff;
        }

        return {
          ...prev,
          totalIncome:
            prev.totalIncome +
            (data.type === "income" ? data.amount : 0) -
            (editingTransaction.type === "income"
              ? editingTransaction.amount
              : 0),
          totalExpenses:
            prev.totalExpenses +
            (data.type === "expense" ? data.amount : 0) -
            (editingTransaction.type === "expense"
              ? editingTransaction.amount
              : 0),
          savings:
            prev.savings +
            (data.type === "income" ? data.amount : -data.amount) -
            (editingTransaction.type === "income"
              ? editingTransaction.amount
              : -editingTransaction.amount),
          categorySummary: newCategorySummary,
        };
      });

      showTransactionUpdatedToast();
      setEditingTransaction(null);
    } else {
      // Handle adding new transaction
      handleAddTransaction(data);
      showTransactionAddedToast(data.amount, data.type);
    }

    setIsAddingTransaction(false);
  };

  const handleCategorySelect = (category: TransactionCategory) => {
    setSelectedCategory(category);
  };

  const handleBudgetClick = (category: TransactionCategory) => {
    setSelectedCategory(category);
    setIsAddingTransaction(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1440px] mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Finance
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your transactions and track your spending
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setIsAddingTransaction(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-4 md:gap-6">
          <aside className="space-y-4 md:space-y-6">
            <Suspense
              fallback={
                <div className="h-[200px] animate-pulse bg-muted rounded-lg" />
              }
            >
              <BudgetSection
                budgets={summary.budgets}
                trends={summary.trends}
                onBudgetClick={handleBudgetClick}
              />
            </Suspense>
            <Suspense
              fallback={
                <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
              }
            >
              <IncomeExpenseChart summary={summary} />
            </Suspense>
          </aside>

          <main>
            <TabsView
              selectedDate={selectedDate}
              transactions={transactions}
              summary={summary}
              dateRange={selectedDateRange}
              selectedCategory={selectedCategory}
              onDateSelect={handleDateSelect}
              onMonthChange={handleMonthChange}
              onDateRangeSelect={handleDateRangeSelect}
              onAddTransaction={handleSubmitTransaction}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onCategorySelect={handleCategorySelect}
              calendarDetail={loaderData}
            />
          </main>
        </div>
      </div>

      <TransactionDialog
        open={isAddingTransaction}
        onOpenChange={(open) => {
          setIsAddingTransaction(open);
          if (!open) setEditingTransaction(null);
        }}
        onSubmit={handleSubmitTransaction}
        initialDate={selectedDate || undefined}
        selectedCategory={selectedCategory}
        mode={editingTransaction ? "edit" : "add"}
        transaction={editingTransaction || undefined}
      />
      <Toaster />
    </div>
  );
}
