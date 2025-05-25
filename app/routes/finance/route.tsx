import { Plus } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";

import type { Category } from "~/routes/finance/domain/entities/category.entity";
import type {
  Budget,
  CategoryTrend,
  DateRange,
  FinancialSummary,
  Transaction,
  TransactionCategory,
} from "~/routes/finance/presentation/types";
import type { Route } from "./+types/route";

import { Button } from "~/components/ui/button";
import { Toaster } from "~/components/ui/sonner";
import CategoryManagement from "~/routes/finance/presentation/components/categories/category-management";
import EnhancedTransactionDialog from "~/routes/finance/presentation/components/transactions/enhanced-transaction-dialog";
import TabsView from "~/routes/finance/presentation/components/transactions/tabs-view";
import {
  analyzeTrends,
  AuditTrail,
  FinancialAmount,
  getDefaultBudget,
} from "~/routes/finance/presentation/utils/finance.utils";

// Type mapping functions to bridge domain and UI types
function mapDomainTrendToLocal(domainTrend: {
  category_id: string;
  values: number[];
  trend: "increasing" | "decreasing" | "stable";
  forecast: number;
  average: number;
}): CategoryTrend & { category: TransactionCategory } {
  return {
    ...domainTrend,
    category: "other" as TransactionCategory, // Default fallback
  };
}

// Inline utility functions
function prepareCalendarData() {
  const today = new Date();
  return {
    nowDate: today,
    currentYear: today.getFullYear(),
    currentMonth: today.getMonth(),
    currentDate: today.getDate(),
    daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysInMonth: new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    ).getDate(),
    firstDayOfWeek: new Date(today.getFullYear(), today.getMonth(), 1).getDay(),
    prevMonthDays: new Date(today.getFullYear(), today.getMonth(), 0).getDate(),
    prevMonth: today.getMonth() === 0 ? 11 : today.getMonth() - 1,
    nextMonth: today.getMonth() === 11 ? 0 : today.getMonth() + 1,
  };
}

function useFinanceShortcuts({
  add,
  cancel,
}: {
  add: () => void;
  cancel: () => void;
}) {
  // Simplified keyboard shortcuts implementation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        add();
      } else if (e.key === "Escape") {
        cancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [add, cancel]);
}

// Toast notification functions
function showBudgetWarningToast(category: string, remaining: number) {
  console.log(`Budget warning for ${category}: ${remaining} remaining`);
}

function showTransactionAddedToast(amount: number, type: string) {
  console.log(`Transaction added: ${type} of ${amount}`);
}

function showTransactionDeletedToast() {
  console.log("Transaction deleted");
}

function showTransactionUpdatedToast() {
  console.log("Transaction updated");
}

// Local budget update function
function updateLocalBudgets(
  budgets: Budget[],
  transactions: Transaction[],
): Budget[] {
  return budgets.map((budget) => ({
    ...budget,
    spent: transactions
      .filter((t) => t.type === "expense" && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0),
  }));
}

// Lazy-loaded Presentation widgets
const BudgetSection = lazy(
  () => import("./presentation/components/analysis/budget-section"),
);
const EnhancedBudgetSection = lazy(
  () => import("./presentation/components/categories/enhanced-budget-section"),
);
const IncomeExpenseChart = lazy(
  () => import("./presentation/components/analysis/income-expense-chart"),
);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Finance" },
    { name: "description", content: "Finance Page Demo!" },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const calendarData = prepareCalendarData();

  // Import database utilities
  const { eq, sql, and, isNull, desc } = await import("drizzle-orm");
  const { categories: categoriesTable, transactions: transactionsTable } =
    await import("~/database/schema");

  // Fetch categories with tree structure
  const allCategories = await context.db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.is_archived, 0))
    .orderBy(categoriesTable.name);

  // Build tree structure
  const categoryMap = new Map<number, any>();
  const rootCategories: any[] = [];

  // Create map entries
  allCategories.forEach((cat) => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // Build parent-child relationships
  allCategories.forEach((cat) => {
    if (cat.parent_id == null) {
      rootCategories.push(categoryMap.get(cat.id));
    } else {
      const parent = categoryMap.get(cat.parent_id);
      if (parent) {
        parent.children.push(categoryMap.get(cat.id));
      }
    }
  });

  function mapCat(c: any): Category {
    return {
      id: c.id.toString(),
      name: c.name,
      type: c.type,
      parent_id: c.parent_id?.toString() || null,
      budget_limit: c.budget_limit,
      budget_period: c.budget_period,
      is_archived: Boolean(c.is_archived),
      icon: c.icon,
      color: c.color,
      created_at: c.created_at,
      updated_at: c.updated_at,
      children: (c.children || []).map(mapCat),
    };
  }
  const categories = rootCategories.map(mapCat);

  // Fetch category analytics
  const analyticsQuery = await context.db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      type: categoriesTable.type,
      parent_id: categoriesTable.parent_id,
      budget_limit: categoriesTable.budget_limit,
      budget_period: categoriesTable.budget_period,
      is_archived: categoriesTable.is_archived,
      icon: categoriesTable.icon,
      color: categoriesTable.color,
      created_at: categoriesTable.created_at,
      updated_at: categoriesTable.updated_at,
      spent: sql<number>`COALESCE(SUM(${transactionsTable.amount}), 0)`,
      transaction_count: sql<number>`COUNT(${transactionsTable.id})`,
      last_transaction_date: sql<string>`MAX(${transactionsTable.date})`,
    })
    .from(categoriesTable)
    .leftJoin(
      transactionsTable,
      eq(categoriesTable.id, transactionsTable.category_id),
    )
    .where(eq(categoriesTable.is_archived, 0))
    .groupBy(categoriesTable.id)
    .orderBy(categoriesTable.name);

  const categoriesWithAnalytics: CategoryWithAnalytics[] = analyticsQuery.map(
    (c: any) => ({
      id: c.id.toString(),
      name: c.name,
      type: c.type,
      parent_id: c.parent_id?.toString() || null,
      budget_limit: c.budget_limit,
      budget_period: c.budget_period,
      is_archived: Boolean(c.is_archived),
      icon: c.icon,
      color: c.color,
      created_at: c.created_at,
      updated_at: c.updated_at,
      spent: c.spent || 0,
      transaction_count: c.transaction_count || 0,
      last_transaction_date: c.last_transaction_date,
      spending_trend: "stable" as const, // We'll calculate this client-side for now
    }),
  );

  // Fetch transactions with category info
  const transactionsQuery = await context.db
    .select({
      id: transactionsTable.id,
      amount: transactionsTable.amount,
      description: transactionsTable.description,
      type: transactionsTable.type,
      date: transactionsTable.date,
      category_id: transactionsTable.category_id,
      category_name: categoriesTable.name,
    })
    .from(transactionsTable)
    .leftJoin(
      categoriesTable,
      eq(transactionsTable.category_id, categoriesTable.id),
    )
    .orderBy(desc(transactionsTable.date));

  const transactions: Transaction[] = transactionsQuery.map((t: any) => ({
    id: t.id.toString(),
    date: new Date(t.date),
    amount: t.amount,
    type: t.type,
    category: t.category_name as TransactionCategory,
    category_id: t.category_id ? t.category_id.toString() : "1", // Ensure category_id is always present
    description: t.description,
  }));
  // Compute summary
  const totalIncome = transactions.reduce(
    (sum, t) => (t.type === "income" ? sum + t.amount : sum),
    0,
  );
  const totalExpenses = transactions.reduce(
    (sum, t) => (t.type === "expense" ? sum + t.amount : sum),
    0,
  );
  const categorySummary = transactions.reduce(
    (acc: Record<TransactionCategory, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    },
    {} as Record<TransactionCategory, number>,
  );

  // Create budgets with proper period property
  const budgets: Budget[] = categoriesWithAnalytics
    .filter((c) => c.budget_limit && c.budget_limit > 0)
    .map((c) => ({
      category: c.name as TransactionCategory,
      category_id: c.id,
      limit: c.budget_limit || 0,
      spent: c.spent || 0,
      period: c.budget_period,
    }));

  // Generate trends with proper values array and map to local format
  const domainTrends = analyzeTrends(transactions as any[]);
  const trends: CategoryTrend[] = domainTrends.map(mapDomainTrendToLocal);

  const forecastedExpenses = trends.reduce((sum, t) => sum + t.forecast, 0);
  const forecastedSavings = totalIncome - forecastedExpenses;
  const summary: FinancialSummary = {
    totalIncome,
    totalExpenses,
    savings: totalIncome - totalExpenses,
    categorySummary,
    budgets,
    trends,
    forecastedExpenses,
    forecastedSavings,
  };
  return {
    ...calendarData,
    categories,
    categoriesWithAnalytics,
    transactions,
    summary,
  };
}

export default function FinanceDemo({ loaderData }: Route.ComponentProps) {
  const {
    transactions: initialTransactions,
    summary: initialSummary,
    categories: initialCategories,
    categoriesWithAnalytics: initialCategoriesWithAnalytics,
    nowDate,
  } = loaderData;

  // Helper function for authenticated API calls
  const authenticatedFetch = (url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  };
  const [transactions, setTransactions] = useState(initialTransactions);
  const [summary, setSummary] = useState(initialSummary);
  const [categories, setCategories] = useState(initialCategories);
  const [categoriesWithAnalytics, setCategoriesWithAnalytics] = useState(
    initialCategoriesWithAnalytics,
  );
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
    setSummary((prev: FinancialSummary) => {
      const existingCategories = new Set(
        prev.budgets.map((b: Budget) => b.category),
      );
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
          // Create a Category object to pass to getDefaultBudget
          const categoryObj: Category = {
            id: category,
            name: category,
            type: "expense" as const,
            parent_id: null,
            budget_limit: null,
            budget_period: "monthly" as const,
            is_archived: false,
            icon: null,
            color: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          const domainBudget = getDefaultBudget(categoryObj);
          const localBudget: Budget = {
            category: category,
            category_id: categoryObj.id,
            limit: (domainBudget as any).limit || 0,
            spent: (domainBudget as any).spent || 0,
            period: (domainBudget as any).period || "monthly",
          };
          newBudgets.push(localBudget);
        }
      }

      const updatedBudgets = updateLocalBudgets(newBudgets, transactions);

      // Check for budget warnings
      updatedBudgets.forEach((budget: Budget) => {
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
        trends: analyzeTrends(transactions as any[]).map(mapDomainTrendToLocal),
      };
    });
  }, [transactions]);

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
    AuditTrail.addRecord(`ADD_TRANSACTION: ${newTransaction.id}`);

    setTransactions((prev: Transaction[]) => [...prev, newTransaction]);

    // Update summary with precise calculations
    setSummary((prev: FinancialSummary) => {
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

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      const res = await authenticatedFetch(
        `/api/transactions/${transactionId}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Failed to delete");
      // Remove from state
      setTransactions((prev: Transaction[]) =>
        prev.filter((t: Transaction) => t.id !== transactionId),
      );
      // Adjust summary
      setSummary((prev: FinancialSummary) => {
        const removed = prev.categorySummary;
        // recalc total and category summary
        const newSummary = transactions
          .filter((t: Transaction) => t.id !== transactionId)
          .reduce(
            (
              acc: {
                totalIncome: number;
                totalExpenses: number;
                categorySummary: Record<TransactionCategory, number>;
              },
              t: Transaction,
            ) => {
              if (t.type === "income") acc.totalIncome += t.amount;
              if (t.type === "expense") acc.totalExpenses += t.amount;
              acc.categorySummary[t.category] =
                (acc.categorySummary[t.category] || 0) + t.amount;
              return acc;
            },
            {
              totalIncome: 0,
              totalExpenses: 0,
              categorySummary: {} as Record<TransactionCategory, number>,
            },
          );
        return {
          ...prev,
          totalIncome: newSummary.totalIncome,
          totalExpenses: newSummary.totalExpenses,
          savings: newSummary.totalIncome - newSummary.totalExpenses,
          categorySummary: newSummary.categorySummary,
        };
      });
      showTransactionDeletedToast();
    } catch (error) {
      console.error(error);
      // Optionally show error toast
    }
  };

  const handleSubmitTransaction = async (data: Omit<Transaction, "id">) => {
    try {
      if (editingTransaction) {
        // Update via API
        const res = await authenticatedFetch(
          `/api/transactions/${editingTransaction.id}`,
          {
            method: "PUT",
            body: JSON.stringify(data),
          },
        );
        const updateJson = (await res.json()) as { transaction: any };
        const updated = updateJson.transaction;
        // Update state
        setTransactions((prev: Transaction[]) =>
          prev.map((t: Transaction) =>
            t.id === updated.id.toString()
              ? {
                  id: updated.id.toString(),
                  date: new Date(updated.date),
                  amount: updated.amount,
                  type: updated.type,
                  category: updated.category.name as TransactionCategory,
                  category_id: updated.category.id.toString(),
                  description: updated.description,
                }
              : t,
          ),
        );
        showTransactionUpdatedToast();
        setEditingTransaction(null);
      } else {
        // Create via API
        const res = await authenticatedFetch("/api/transactions", {
          method: "POST",
          body: JSON.stringify(data),
        });
        const createJson = (await res.json()) as { transaction: any };
        const created = createJson.transaction;
        const newT: Transaction = {
          id: created.id.toString(),
          date: new Date(created.date),
          amount: created.amount,
          type: created.type,
          category: created.category.name as TransactionCategory,
          category_id: created.category.id.toString(),
          description: created.description,
        };
        setTransactions((prev: Transaction[]) => [...prev, newT]);
        showTransactionAddedToast(data.amount, data.type);
      }
    } catch (error) {
      console.error(error);
      // Optionally show error toast
    } finally {
      setIsAddingTransaction(false);
    }
  };

  const handleCategorySelect = (category: TransactionCategory) => {
    setSelectedCategory(category);
  };

  // Category management handlers
  const handleCreateCategory = async (data: CategoryFormData) => {
    try {
      const res = await authenticatedFetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const createJson = (await res.json()) as { category: any };
      const created = createJson.category;
      const newCategory: Category = {
        id: created.id.toString(),
        name: created.name,
        type: created.type,
        parent_id: created.parent_id?.toString() || null,
        budget_limit: created.budget_limit,
        budget_period: created.budget_period,
        is_archived: Boolean(created.is_archived),
        icon: created.icon,
        color: created.color,
        created_at: created.created_at,
        updated_at: created.updated_at,
        children: [],
      };
      setCategories((prev: Category[]) => [...prev, newCategory]);
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleUpdateCategory = async (
    id: string,
    data: Partial<CategoryFormData>,
  ) => {
    try {
      const res = await authenticatedFetch(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const updateJson = (await res.json()) as { category: any };
      const updated = updateJson.category;
      setCategories((prev: Category[]) =>
        prev.map((cat: Category) =>
          cat.id === id
            ? {
                ...cat,
                name: updated.name,
                type: updated.type,
                parent_id: updated.parent_id?.toString() || null,
                budget_limit: updated.budget_limit,
                budget_period: updated.budget_period,
                icon: updated.icon,
                color: updated.color,
                updated_at: updated.updated_at,
              }
            : cat,
        ),
      );
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleArchiveCategory = async (id: string) => {
    try {
      const res = await authenticatedFetch(`/api/categories/${id}/archive`, {
        method: "PATCH",
      });
      if (res.ok) {
        setCategories((prev: Category[]) =>
          prev.filter((cat: Category) => cat.id !== id),
        );
      }
    } catch (error) {
      console.error("Failed to archive category:", error);
    }
  };

  const handleMergeCategories = async (
    sourceIds: string[],
    targetId: string,
  ) => {
    try {
      const res = await authenticatedFetch("/api/categories/merge", {
        method: "POST",
        body: JSON.stringify({
          source_category_ids: sourceIds.map((id) => parseInt(id)),
          target_category_id: parseInt(targetId),
        }),
      });
      if (res.ok) {
        // Remove merged categories and refresh data
        setCategories((prev: Category[]) =>
          prev.filter((cat: Category) => !sourceIds.includes(cat.id)),
        );
        // Optionally refresh analytics
      }
    } catch (error) {
      console.error("Failed to merge categories:", error);
    }
  };

  const handleBudgetClick = (category: TransactionCategory) => {
    setSelectedCategory(category);
    setIsAddingTransaction(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 md:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Finance Dashboard
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground">
              Manage your transactions and track your spending with detailed
              insights
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              variant={currentView === "transactions" ? "default" : "secondary"}
              onClick={() => setCurrentView("transactions")}
              className="transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              Transactions
            </Button>
            <Button
              variant={currentView === "categories" ? "default" : "secondary"}
              onClick={() => setCurrentView("categories")}
              className="transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              Categories
            </Button>
            <Button
              variant="default"
              className="shadow-sm hover:shadow-md transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 py-2"
              onClick={() => setIsAddingTransaction(true)}
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          <aside className="space-y-3 sm:space-y-4 md:space-y-6">
            <Suspense
              fallback={
                <div className="h-[180px] sm:h-[200px] md:h-[240px] animate-pulse bg-muted/50 rounded-lg border" />
              }
            >
              {currentView === "categories" ? (
                <EnhancedBudgetSection
                  categoriesWithAnalytics={categoriesWithAnalytics}
                  allCategories={categories}
                  onCategoryClick={(categoryId) => {
                    // Handle category selection
                    const category = categories.find(
                      (c: Category) => c.id === categoryId,
                    );
                    if (category) {
                      setSelectedCategory(category.name as TransactionCategory);
                    }
                  }}
                  onCreateCategory={handleCreateCategory}
                  onUpdateCategory={handleUpdateCategory}
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
                useLegacyCategories={false}
              />
            ) : (
              <CategoryManagement
                categories={categories}
                categoriesWithAnalytics={categoriesWithAnalytics}
                onCreateCategory={handleCreateCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleArchiveCategory}
                onArchiveCategory={handleArchiveCategory}
                onMergeCategories={(sourceIds, targetId) =>
                  handleMergeCategories(
                    Array.isArray(sourceIds) ? sourceIds : [sourceIds],
                    targetId,
                  )
                }
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
        categories={categories}
        useLegacyCategories={false}
      />
      <Toaster />
    </div>
  );
}
