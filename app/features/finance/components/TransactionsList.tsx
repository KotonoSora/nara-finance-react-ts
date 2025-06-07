import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string | null;
  note: string | null;
  date: string;
};

export default function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data as Transaction[]);
    } catch (err) {
      console.error("Lỗi khi lấy giao dịch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xoá giao dịch này không?")) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Xoá không thành công");

      alert("Xoá giao dịch thành công");
      fetchTransactions();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert("Lỗi khi xoá: " + errorMessage);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (transactions.length === 0) return <p>Chưa có giao dịch nào.</p>;

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="p-4 rounded-xl shadow border flex justify-between items-center"
        >
          <div>
            <p className="font-semibold text-lg">
              {tx.note || "Không ghi chú"}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(tx.date).toLocaleDateString()}
            </p>
          </div>
          <div
            className={`text-right ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}
          >
            <p className="text-lg font-bold">{tx.amount.toLocaleString()}₫</p>
            <p className="text-sm capitalize">{tx.type}</p>
          </div>
          <Button variant="destructive" onClick={() => handleDelete(tx.id)}>
            Xoá
          </Button>
        </div>
      ))}
    </div>
  );
}
