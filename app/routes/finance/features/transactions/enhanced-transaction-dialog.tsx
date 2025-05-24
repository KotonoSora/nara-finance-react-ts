import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

import HierarchicalCategorySelector from "../categories/hierarchical-category-selector";

// Enhanced schema to support both legacy and new category system
const transactionSchema = z
  .object({
    date: z.date({
      required_error: "Please select a date",
    }),
    type: z.enum(["income", "expense", "investment"], {
      required_error: "Please select a transaction type",
    }),
    // Support both legacy category enum and new category_id
    category: z
      .enum(["food", "transport", "shopping", "salary", "other"])
      .optional(),
    category_id: z.string().optional(),
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
  .refine((data) => data.category || data.category_id, {
    message: "Please select a category",
    path: ["category_id"],
  });

type FormData = z.infer<typeof transactionSchema>;

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Transaction, "id">) => void;
  initialDate?: Date;
  selectedCategory?: TransactionCategory | null;
  selectedCategoryId?: string | null;
  mode?: "add" | "edit";
  transaction?: Transaction;
  categories?: Category[]; // New category system
  useLegacyCategories?: boolean; // Fallback to legacy system
}

export default function EnhancedTransactionDialog({
  open,
  onOpenChange,
  onSubmit,
  initialDate,
  selectedCategory,
  selectedCategoryId,
  mode = "add",
  transaction,
  categories = [],
  useLegacyCategories = false,
}: TransactionDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction || {
      date: initialDate || new Date(),
      type: "expense",
      category: selectedCategory || undefined,
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
        category: transaction.category,
        category_id: transaction.category_id,
        amount: transaction.amount,
        description: transaction.description,
      });
    }
  }, [transaction, form]);

  // Update form when selectedCategory or selectedCategoryId changes in add mode
  useEffect(() => {
    if (mode === "add") {
      if (selectedCategory && useLegacyCategories) {
        form.setValue("category", selectedCategory);
      } else if (selectedCategoryId && !useLegacyCategories) {
        form.setValue("category_id", selectedCategoryId);
      }
    }
  }, [selectedCategory, selectedCategoryId, form, mode, useLegacyCategories]);

  const handleSubmit = (data: FormData) => {
    // Convert form data to transaction format
    const transactionData: Omit<Transaction, "id"> = {
      date: data.date,
      type: data.type,
      amount: data.amount,
      description: data.description,
      // Handle both legacy and new category systems
      category: data.category || "other", // Fallback for legacy support
      category_id: data.category_id,
    };

    onSubmit(transactionData);
    onOpenChange(false);
    if (mode === "add") {
      form.reset();
    }
  };

  const transactionType = form.watch("type");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Transaction" : "Edit Transaction"}
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

            {/* Category selection - use new hierarchical selector if categories are available */}
            {!useLegacyCategories && categories.length > 0 ? (
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
            ) : (
              // Fallback to legacy category selector
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="salary">Salary</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
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
                {mode === "add" ? "Add Transaction" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
