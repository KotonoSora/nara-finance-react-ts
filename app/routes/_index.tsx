import { useState } from "react";

import type { Transaction } from "~/features/finance/components/TransactionsList";
import type { Route } from "./+types/_index";

import { ModeSwitcher } from "~/components/mode-switcher";
import { CreateTransactionForm } from "~/features/finance/components/CreateTransactionForm";
import { EditTransactionModal } from "~/features/finance/components/EditTransactionModal";
import TransactionsList from "~/features/finance/components/TransactionsList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to the home page" },
  ];
}

export default function Page({}: Route.ComponentProps) {
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
        <CreateTransactionForm onSuccess={() => window.location.reload()} />
        <TransactionsList onEdit={handleEdit} />
        <EditTransactionModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          transaction={selectedTx}
          onUpdated={() => window.location.reload()}
        />
      </div>
    </main>
  );
}
