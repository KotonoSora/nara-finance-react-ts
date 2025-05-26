import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import type { Category } from "~/routes/finance/domain/entities/category.entity";
import type { Transaction } from "~/routes/finance/domain/entities/transaction.entity";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import HierarchicalCategorySelector from "~/routes/finance/presentation/components/categories/hierarchical-category-selector";

// Enhanced schema: require only category_id
const transactionSchema = z
  .object({
    date: z.date({
      required_error: "Please select a date",
    }),
    type: z.enum(["income", "expense", "investment"], {
      required_error: "Please select a transaction type",
    }),
    category_id: z.string({ required_error: "Please select a category" }),
    amount: z.coerce
      .number({
        required_error: "Please enter an amount",
        invalid_type_error: "Amount must be a number",
      })
      .positive("Amount must be greater than 0"),
    description: z
      .string()
      .min(3, "Description must be at least 3 characters")
      .max(100, "Description must not exceed 100 characters"),
  })
  .required();

type FormData = z.infer<typeof transactionSchema>;

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Transaction, "id">) => void;
  initialDate?: Date;
  selectedCategoryId?: string | null;
  transaction?: Transaction;
  categories?: Category[];
}

export default function EnhancedTransactionDialog({
  open,
  onOpenChange,
  onSubmit,
  initialDate,
  selectedCategoryId,
  transaction,
  categories = [],
}: TransactionDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction || {
      date: initialDate || new Date(),
      type: "expense",
      category_id: selectedCategoryId || undefined,
      amount: undefined,
      description: "",
    },
  });

  // Reset form when transaction changes
  useEffect(() => {
    if (transaction) {
      form.reset({
        date: transaction.date,
        type: transaction.type,
        category_id: transaction.category_id,
        amount: transaction.amount,
        description: transaction.description,
      });
    }
  }, [transaction, form]);

  const handleSubmit = (data: FormData) => {
    // Convert form data to transaction format
    const transactionData: Omit<Transaction, "id"> = {
      date: data.date,
      type: data.type,
      amount: data.amount,
      description: data.description,
      category_id: data.category_id,
    };

    onSubmit(transactionData);
    onOpenChange(false);
    form.reset();
  };

  const transactionType = form.watch("type");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={clsx(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category selection */}
            {categories.length > 0 && (
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <HierarchicalCategorySelector
                        categories={categories}
                        value={field.value}
                        onValueChange={field.onChange}
                        transactionType={transactionType}
                        placeholder="Select category..."
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a category that matches your transaction type
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Transaction description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {transaction ? "Save Changes" : "Add Transaction"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
