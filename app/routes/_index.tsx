import { useState } from "react";

import type { Currency } from "~/features/finance/components/CurrenciesList";
import type { Transaction } from "~/features/finance/components/TransactionsList";
import type { Route } from "./+types/_index";

import { ModeSwitcher } from "~/components/mode-switcher";
import { CreateTransactionForm } from "~/features/finance/components/CreateTransactionForm";
import CurrenciesList from "~/features/finance/components/CurrenciesList";
import { EditTransactionModal } from "~/features/finance/components/EditTransactionModal";
import TransactionsList from "~/features/finance/components/TransactionsList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to the home page" },
  ];
}

export async function clientLoader({ request, context }: Route.LoaderArgs) {
  try {
    const response = await fetch("/api/currencies");
    const currencies = await response.json();

    const res = await fetch("/api/transactions");
    const transactions = await res.json();

    return {
      currencies: currencies as Currency[],
      transactions: transactions as Transaction[],
    };
  } catch (error) {
    console.error("Error loading currencies:", error);
    return { currencies: [] as Currency[], transactions: [] as Transaction[] };
  }
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { currencies, transactions } = loaderData;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const handleEdit = (tx: Transaction) => {
    setSelectedTx(tx);
    setEditModalOpen(true);
  };

  return (
    <main className="p-6 max-w-2xl mx-auto min-h-svh">
      <div className="fixed top-4 right-4 z-50">
        <ModeSwitcher />
      </div>
      <div className="space-y-8 p-4">
        <h1 className="text-xl font-bold">Giao dịch gần đây</h1>
        <CurrenciesList currencies={currencies} />
        <CreateTransactionForm currencies={currencies} />
        <TransactionsList transactions={transactions} onEdit={handleEdit} />
        <EditTransactionModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          transaction={selectedTx}
        />
      </div>
    </main>
  );
}
