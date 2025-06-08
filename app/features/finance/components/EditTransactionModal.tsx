import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { Transaction } from "./TransactionsList";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { currencies } from "~/database/schema";

type Props = {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
};

export function EditTransactionModal({ open, onClose, transaction }: Props) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      note: transaction?.note || "",
      amount: transaction?.amount || 0,
      date: transaction?.date || "",
      type: transaction?.type || "expense",
      currency_code: transaction?.currency_code || "VND",
    },
  });

  useEffect(() => {
    if (transaction) {
      reset({
        note: transaction.note || "",
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type || "expense",
        currency_code: transaction.currency_code || "VND",
      });
    }
  }, [transaction, reset]);

  const onSubmit = async (data: any) => {
    if (!transaction) return;
    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");

      onClose();
    } catch (err) {
      alert("Lỗi cập nhật: " + (err as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sửa giao dịch</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="note">Ghi chú</Label>
            <Input id="note" {...register("note")} />
          </div>

          <div>
            <Label htmlFor="amount">Số tiền</Label>
            <Input
              id="amount"
              type="number"
              {...register("amount", { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label htmlFor="date">Ngày</Label>
            <Input id="date" type="date" {...register("date")} />
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={onClose}>
                Huỷ
              </Button>
            </DialogClose>
            <Button type="submit">Lưu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
