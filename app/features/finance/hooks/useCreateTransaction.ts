import { useState } from "react";

export function useCreateTransaction(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createTransaction(data: {
    type: "income" | "expense";
    amount: number;
    note?: string;
    date: string;
  }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create transaction");

      onSuccess?.();
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return { createTransaction, loading, error };
}
