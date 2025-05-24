import { Plus } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";

import type { Route } from "./+types/route";

import { Button } from "~/components/ui/button";
import { Toaster } from "~/components/ui/sonner";

import CategoryManagement from "./features/categories/category-management";
import EnhancedTransactionDialog from "./features/transactions/enhanced-transaction-dialog";
import TabsView from "./features/transactions/tabs-view";
import AuditTrail from "./shared/utils/audit";
import { getDefaultBudget, updateBudgets } from "./shared/utils/budget";
import { prepareCalendarData } from "./shared/utils/calendar";
import { FinancialAmount } from "./shared/utils/financial-precision";
import { MOCK_DATA } from "./shared/utils/mock";
import {
  showBudgetWarningToast,
  showTransactionAddedToast,
  showTransactionDeletedToast,
  showTransactionUpdatedToast,
} from "./shared/utils/notifications";
import { useFinanceShortcuts } from "./shared/utils/shortcuts";
import {
  getStoredSummary,
  getStoredTransactions,
  saveSummary,
  saveTransactions,
} from "./shared/utils/storage";
import { analyzeTrends } from "./shared/utils/trends";

// Define DateRange locally to avoid conflicts
interface DateRange {
  from: Date;
  to: Date;
}

// Type definitions for the finance module
type TransactionType = "income" | "expense" | "investment";
type TransactionCategory =
  | "food"
  | "transport"
  | "shopping"
  | "salary"
  | "other";

interface Category {
  id: string;
  name: string;
  type: TransactionType;
  parent_id?: string | null;
  budget_limit?: number | null;
  budget_period: "monthly" | "weekly" | "yearly";
  is_archived: boolean;
  icon?: string | null;
  color?: string | null;
  created_at: string;
  updated_at: string;
  children?: Category[];
  parent?: Category | null;
}

interface CategoryWithAnalytics extends Category {
  spent: number;
  transaction_count: number;
  last_transaction_date?: string;
  spending_trend: "increasing" | "decreasing" | "stable";
}

interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  category_id?: string;
  description: string;
}

const BudgetSection = lazy(() => import("./features/analysis/budget-section"));
const EnhancedBudgetSection = lazy(
  () => import("./features/categories/enhanced-budget-section"),
);
const IncomeExpenseChart = lazy(
  () => import("./features/analysis/income-expense-chart"),
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
  const [currentView, setCurrentView] = useState<"transactions" | "categories">(
    "transactions",
  );

  // Mock categories data for now - will be replaced with API calls
  const [categories] = useState<Category[]>([
    {
      id: "1",
      name: "Food & Dining",
      icon: "🍽️",
      color: "#22C55E",
      type: "expense",
      budget_limit: 800,
      budget_period: "monthly",
      parent_id: null,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Restaurants",
      icon: "🍕",
      color: "#16A34A",
      type: "expense",
      budget_limit: 500,
      budget_period: "monthly",
      parent_id: "1",
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Transportation",
      icon: "🚗",
      color: "#3B82F6",
      type: "expense",
      budget_limit: 400,
      budget_period: "monthly",
      parent_id: null,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Salary",
      icon: "💰",
      color: "#10B981",
      type: "income",
      budget_limit: null,
      budget_period: "monthly",
      parent_id: null,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const [categoriesWithAnalytics] = useState<CategoryWithAnalytics[]>(
    categories.map((cat) => ({
      ...cat,
      spent: Math.random() * (cat.budget_limit || 1000),
      transaction_count: Math.floor(Math.random() * 50) + 1,
      last_transaction_date: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      spending_trend: (["increasing", "decreasing", "stable"] as const)[
        Math.floor(Math.random() * 3)
      ],
    })),
  );

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Finance Dashboard
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your transactions and track your spending with detailed
              insights
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={currentView === "transactions" ? "default" : "secondary"}
              onClick={() => setCurrentView("transactions")}
              className="transition-all duration-200"
            >
              Transactions
            </Button>
            <Button
              variant={currentView === "categories" ? "default" : "secondary"}
              onClick={() => setCurrentView("categories")}
              className="transition-all duration-200"
            >
              Categories
            </Button>
            <Button
              variant="default"
              className="ml-2 shadow-sm hover:shadow-md transition-all duration-200"
              onClick={() => setIsAddingTransaction(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6 md:gap-8">
          <aside className="space-y-6">
            <Suspense
              fallback={
                <div className="h-[240px] animate-pulse bg-muted/50 rounded-lg border" />
              }
            >
              {currentView === "categories" ? (
                <EnhancedBudgetSection
                  categoriesWithAnalytics={categoriesWithAnalytics}
                  allCategories={categories}
                  onCategoryClick={(categoryId) => {
                    // TODO: Handle category selection in new system
                    console.log("Category clicked:", categoryId);
                  }}
                  onCreateCategory={(data) => {
                    // TODO: Implement category creation
                    console.log("Create category:", data);
                  }}
                  onUpdateCategory={(id, data) => {
                    // TODO: Implement category update
                    console.log("Update category:", id, data);
                  }}
                />
              ) : (
                <BudgetSection
                  budgets={summary.budgets}
                  trends={summary.trends}
                  onBudgetClick={handleBudgetClick}
                />
              )}
            </Suspense>
            <Suspense
              fallback={
                <div className="h-[340px] animate-pulse bg-muted/50 rounded-lg border" />
              }
            >
              <IncomeExpenseChart summary={summary} />
            </Suspense>
          </aside>

          <main>
            {currentView === "transactions" ? (
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
                categories={categories}
                useLegacyCategories={true}
              />
            ) : (
              <CategoryManagement
                categories={categories}
                categoriesWithAnalytics={categoriesWithAnalytics}
                onCreateCategory={(data) => {
                  // TODO: Implement category creation API call
                  console.log("Create category:", data);
                }}
                onUpdateCategory={(id, data) => {
                  // TODO: Implement category update API call
                  console.log("Update category:", id, data);
                }}
                onDeleteCategory={(id) => {
                  // TODO: Implement category deletion API call
                  console.log("Delete category:", id);
                }}
                onArchiveCategory={(id) => {
                  // TODO: Implement category archiving API call
                  console.log("Archive category:", id);
                }}
                onMergeCategories={(sourceId, targetId) => {
                  // TODO: Implement category merging API call
                  console.log("Merge categories:", sourceId, "->", targetId);
                }}
              />
            )}
          </main>
        </div>
      </div>

      <EnhancedTransactionDialog
        open={isAddingTransaction}
        onOpenChange={(open: boolean) => {
          setIsAddingTransaction(open);
          if (!open) setEditingTransaction(null);
        }}
        onSubmit={handleSubmitTransaction}
        initialDate={selectedDate || undefined}
        selectedCategory={selectedCategory}
        mode={editingTransaction ? "edit" : "add"}
        transaction={editingTransaction || undefined}
        categories={[]} // For now, empty array - will be populated from API
        useLegacyCategories={true} // Use legacy categories for now
      />
      <Toaster />
    </div>
  );
}
