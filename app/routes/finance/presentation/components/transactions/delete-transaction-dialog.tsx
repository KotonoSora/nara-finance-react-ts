import type { Transaction } from "~/routes/finance/presentation/types/ui.types";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

interface DeleteTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  transaction?: Transaction;
}

export default function DeleteTransactionDialog({
  open,
  onOpenChange,
  onConfirm,
  transaction,
}: DeleteTransactionDialogProps) {
  if (!transaction) return null;

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(transaction.amount);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this transaction?
            <div className="mt-4 p-4 rounded-lg bg-muted">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Description:</span>
                <span className="font-medium">{transaction.description}</span>
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">{formattedAmount}</span>
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium capitalize">
                  {transaction.category_id}
                </span>
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium capitalize">
                  {transaction.type}
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
