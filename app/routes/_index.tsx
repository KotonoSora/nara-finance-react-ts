import { useState } from "react";
import { Await } from "react-router";

import type { Currency } from "~/features/finance/components/CurrenciesList";
import type { Transaction } from "~/features/finance/components/TransactionsList";
import type { Route } from "./+types/_index";

import { ModeSwitcher } from "~/components/mode-switcher";
import CreateTransactionModal from "~/features/finance/components/CreateTransactionModal";
import CurrenciesList from "~/features/finance/components/CurrenciesList";
import EditTransactionModal from "~/features/finance/components/EditTransactionModal";
import TransactionsList from "~/features/finance/components/TransactionsList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to the home page" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const origin = url.origin;

  try {
    const currenciesRes = await fetch(`${origin}/api/currencies`);
    if (!currenciesRes.ok) {
      throw new Error(
        `Failed to fetch currencies: ${currenciesRes.statusText}`,
      );
    }
    const currencies: Currency[] = await currenciesRes.json();

    if (currencies.length === 0) {
      return { currencies: [], transactions: [] };
    }

    const transactionsRes = await fetch(`${origin}/api/transactions`);
    const transactions: Transaction[] = transactionsRes.ok
      ? await transactionsRes.json()
      : [];

    return { currencies, transactions };
  } catch (error) {
    return { currencies: [], transactions: [] };
  }
}

export default function Page({ loaderData }: Route.ComponentProps) {
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
        <Await
          errorElement={<div>Error loading data</div>}
          resolve={loaderData}
        >
          {({ currencies, transactions }) => (
            <>
              <CurrenciesList currencies={currencies} />
              <CreateTransactionModal currencies={currencies} />
              <TransactionsList
                transactions={transactions}
                onEdit={handleEdit}
              />
              <EditTransactionModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                transaction={selectedTx}
              />
            </>
          )}
        </Await>
      </div>
    </main>
  );
}
