import Papa from "papaparse";
import { z } from "zod";

import type { Transaction } from "~/routes/finance/domain/entities/transaction.entity";

import { validateTransactionData } from "~/routes/finance/domain/value-objects/validation";

export interface ImportResult {
  success: boolean;
  transactions?: Omit<Transaction, "id">[];
  error?: string;
  warnings?: string[];
}

export interface CSVTransaction {
  date: string;
  type: string;
  category_id: string;
  amount: string;
  description: string;
}

/**
 * Application Service for importing financial data from various formats
 */
export class ImportService {
  private readonly transactionSchema = z.object({
    date: z.string(),
    type: z.enum(["income", "expense", "investment"]),
    category_id: z.string(), // arbitrary category_id
    amount: z.string().transform(Number),
    description: z.string(),
  });

  /**
   * Import transactions from CSV file
   */
  async importFromCSV(file: File): Promise<ImportResult> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const warnings: string[] = [];
            const transactions: Omit<Transaction, "id">[] = [];

            for (const [index, row] of results.data.entries()) {
              try {
                const record = row as CSVTransaction;
                const parsed = this.transactionSchema.parse({
                  date: record.date,
                  type: record.type,
                  category_id: record.category_id,
                  amount: record.amount,
                  description: record.description,
                });

                // Use parsed.category_id directly
                const validatedData = validateTransactionData({
                  amount: parsed.amount,
                  description: parsed.description,
                  type: parsed.type,
                  date: parsed.date,
                  categoryId: parsed.category_id,
                });
                transactions.push({
                  date: validatedData.date,
                  type: validatedData.type,
                  amount: validatedData.amount,
                  description: validatedData.description,
                  category_id: parsed.category_id,
                });
              } catch (error) {
                warnings.push(
                  `Row ${index + 1}: ${error instanceof Error ? error.message : "Invalid data"}`,
                );
              }
            }

            resolve({
              success: true,
              transactions,
              warnings: warnings.length > 0 ? warnings : undefined,
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

  /**
   * Parse CSV transactions (legacy method)
   */
  async parseCSVTransactions(file: File): Promise<Omit<Transaction, "id">[]> {
    const result = await this.importFromCSV(file);
    if (!result.success || !result.transactions) {
      throw new Error(result.error || "Failed to parse CSV");
    }
    return result.transactions;
  }

  /**
   * Generate sample CSV for user reference
   */
  generateSampleCSV(): string {
    const headers = ["date", "description", "amount", "type", "category_id"];
    const sampleData = [
      ["2025-04-01", "Grocery shopping", "50.00", "expense", "1"],
      ["2025-04-02", "Monthly salary", "5000.00", "income", "2"],
      ["2025-04-03", "Bus fare", "2.50", "expense", "3"],
      ["2025-04-04", "Coffee shop", "4.75", "expense", "1"],
      ["2025-04-05", "Investment dividend", "25.00", "income", "4"],
    ];

    return Papa.unparse([headers, ...sampleData]);
  }

  /**
   * Validate CSV structure before processing
   */
  validateCSVStructure(
    file: File,
  ): Promise<{ valid: boolean; errors: string[] }> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        preview: 5, // Only check first 5 rows
        complete: (results) => {
          const errors: string[] = [];
          const requiredHeaders = [
            "date",
            "description",
            "amount",
            "type",
            "category_id",
          ];

          // Check if all required headers are present
          const headers = results.meta.fields || [];
          for (const required of requiredHeaders) {
            if (!headers.includes(required)) {
              errors.push(`Missing required column: ${required}`);
            }
          }

          // Check if there's any data
          if (results.data.length === 0) {
            errors.push("CSV file is empty");
          }

          resolve({
            valid: errors.length === 0,
            errors,
          });
        },
        error: (error) => {
          resolve({
            valid: false,
            errors: [error.message],
          });
        },
      });
    });
  }

  /**
   * Parse CSV file into transactions
   */
  async parseCSV(file: File): Promise<ImportResult> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const transactions = this.processCSVData(
              results.data as CSVTransaction[],
            );
            resolve({
              success: true,
              transactions,
            });
          } catch (error) {
            resolve({
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
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

  /**
   * Parse CSV text into transactions
   */
  parseCSVText(csvText: string): ImportResult {
    try {
      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      if (parsed.errors.length > 0) {
        return {
          success: false,
          error: parsed.errors[0].message,
        };
      }

      const transactions = this.processCSVData(parsed.data as CSVTransaction[]);
      return {
        success: true,
        transactions,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Process CSV data into validated transactions
   */
  private processCSVData(data: CSVTransaction[]): Omit<Transaction, "id">[] {
    return data.map((row) => {
      const parsed = this.transactionSchema.parse({
        date: row.date,
        type: row.type,
        category_id: row.category_id,
        amount: row.amount,
        description: row.description,
      });
      return {
        date: new Date(parsed.date),
        type: parsed.type,
        category_id: parsed.category_id,
        amount: parsed.amount,
        description: parsed.description,
      };
    });
  }
}

// Note: Use ImportService class instead of these legacy functions
