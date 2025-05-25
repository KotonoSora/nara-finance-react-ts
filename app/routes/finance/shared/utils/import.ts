import Papa from "papaparse";
import { z } from "zod";

export interface ImportResult {
  success: boolean;
  transactions?: Transaction[];
  error?: string;
}

export interface CSVTransaction {
  date: string;
  type: string;
  category: string;
  amount: string;
  description: string;
}

export function validateTransactionType(type: string): TransactionType {
  const validTypes: TransactionType[] = ["income", "expense", "investment"];
  const normalizedType = type.toLowerCase();

  if (!validTypes.includes(normalizedType as TransactionType)) {
    throw new Error(`Invalid transaction type: ${type}`);
  }

  return normalizedType as TransactionType;
}

export function validateTransactionCategory(category: string): {
  categoryId: string;
  legacyCategory: TransactionCategory;
} {
  // Map category names to category IDs and legacy categories
  const categoryMapping: Record<
    string,
    { categoryId: string; legacyCategory: TransactionCategory }
  > = {
    food: { categoryId: "1", legacyCategory: "food" },
    transport: { categoryId: "2", legacyCategory: "transport" },
    shopping: { categoryId: "3", legacyCategory: "shopping" },
    salary: { categoryId: "4", legacyCategory: "salary" },
    other: { categoryId: "5", legacyCategory: "other" },
  };

  const normalizedCategory = category.toLowerCase();
  const mapping = categoryMapping[normalizedCategory];

  if (!mapping) {
    // Return default "other" category if not found
    return { categoryId: "5", legacyCategory: "other" };
  }

  return mapping;
}

export function validateAmount(amount: string): number {
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new Error(`Invalid amount: ${amount}`);
  }
  return parsedAmount;
}

const transactionSchema = z.object({
  date: z.string(),
  type: z.enum(["income", "expense", "investment"]),
  category: z.enum(["food", "transport", "shopping", "salary", "other"]),
  amount: z.string().transform(Number),
  description: z.string(),
});

export const parseCSVTransactions = (
  file: File,
): Promise<Omit<Transaction, "id">[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const transactions = results.data.map((row) => {
            const record = row as CSVTransaction;
            const parsed = transactionSchema.parse({
              date: record.date,
              type: record.type,
              category: record.category,
              amount: record.amount,
              description: record.description,
            });

            const categoryMapping = validateTransactionCategory(
              parsed.category,
            );

            return {
              date: new Date(parsed.date),
              type: parsed.type,
              amount: parsed.amount,
              description: parsed.description,
              category: categoryMapping.legacyCategory,
              category_id: categoryMapping.categoryId,
            };
          });
          resolve(transactions);
        } catch (error) {
          reject(
            new Error("Invalid CSV format. Please check the file structure."),
          );
        }
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      },
    });
  });
};

export async function importFromCSV(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const transactions = results.data.map((row: any) => {
            const categoryMapping = validateTransactionCategory(row.category);
            return {
              id: crypto.randomUUID(),
              date: new Date(row.date),
              description: row.description,
              amount: parseFloat(row.amount),
              type: validateTransactionType(row.type),
              category: categoryMapping.legacyCategory,
              category_id: categoryMapping.categoryId,
            };
          });

          resolve({
            success: true,
            transactions,
          });
        } catch (error) {
          resolve({
            success: false,
            error:
              error instanceof Error ? error.message : "Invalid CSV format",
          });
        }
      },
      error: (error) => {
        resolve({
          success: false,
          error: error.message,
        });
      },
    });
  });
}

export function generateSampleCSV(): string {
  const headers = ["date", "description", "amount", "type", "category"];
  const sampleData = [
    ["2025-04-01", "Grocery shopping", "50.00", "expense", "food"],
    ["2025-04-02", "Monthly salary", "5000.00", "income", "salary"],
    ["2025-04-03", "Bus fare", "2.50", "expense", "transport"],
  ];

  return Papa.unparse([headers, ...sampleData]);
}

export async function parseCSV(file: File): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error("Failed to parse CSV file"));
          return;
        }

        const transactions = results.data.map((row: any) => {
          const categoryMapping = validateTransactionCategory(
            row.category || "other",
          );
          return {
            id: crypto.randomUUID(),
            date: new Date(row.date),
            description: row.description,
            amount: parseFloat(row.amount),
            category: categoryMapping.legacyCategory,
            category_id: categoryMapping.categoryId,
            type: validateTransactionType(row.type || "expense"),
          };
        });

        resolve(transactions);
      },
      error: (error) => reject(error),
    });
  });
}
