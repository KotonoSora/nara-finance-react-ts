import { useState } from "react";

import type { Currency } from "./CurrenciesList";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import CreateTransactionForm from "./CreateTransactionForm";

const CreateTransactionModal = ({ currencies }: { currencies: Currency[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>+ Giao dịch</Button>
      </DialogTrigger>
      <DialogTitle>Tạo giao dịch mới</DialogTitle>
      <DialogContent>
        <CreateTransactionForm
          currencies={currencies}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionModal;
