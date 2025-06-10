import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type {
  Currency,
  TransactionApiData,
} from "~/features/finance/domain/types/DataContracts";

import { Button } from "~/components/ui/button";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";

// Validation schema
const editTransactionSchema = z.object({
  note: z.string().min(1, "Ghi chú không được để trống"),
  amount: z.number().min(0.01, "Số tiền phải lớn hơn 0"),
  date: z.string().min(1, "Ngày không được để trống"),
  type: z.enum(["income", "expense"], {
    required_error: "Vui lòng chọn loại giao dịch",
  }),
  category: z.string().optional(),
  currency_code: z.string().min(1, "Mã tiền tệ không được để trống"),
});

type EditTransactionFormData = z.infer<typeof editTransactionSchema>;

interface EditTransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction: TransactionApiData | null;
  categories?: Array<{ id: string; name: string }>;
  currencies: Currency[];
}

export default function EditTransactionModal({
  open,
  onClose,
  transaction,
  categories = [],
  currencies,
}: EditTransactionModalProps) {
  const form = useForm<EditTransactionFormData>({
    resolver: zodResolver(editTransactionSchema),
    defaultValues: {
      note: "",
      amount: 0,
      date: "",
      type: "expense",
      category: "",
      currency_code: "VND",
    },
  });

  useEffect(() => {
    if (transaction) {
      form.reset({
        note: transaction.note || "",
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type,
        category: transaction.category || "",
        currency_code: transaction.currency_code,
      });
    }
  }, [transaction, form]);

  const onSubmit = async (data: EditTransactionFormData) => {
    if (!transaction) return;

    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");

      form.reset();
      onClose();
    } catch (err) {
      console.error("Error updating transaction:", err);
      // You might want to use a toast notification instead of alert
      alert("Lỗi cập nhật: " + (err as Error).message);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sửa giao dịch</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập ghi chú cho giao dịch..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {" "}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Chỉ cho phép số, dấu chấm và dấu phẩy
                          const numericValue = value.replace(/[^0-9.,]/g, "");
                          // Chuyển dấu phẩy thành dấu chấm
                          const normalizedValue = numericValue.replace(
                            /,/g,
                            ".",
                          );
                          // Đảm bảo chỉ có một dấu chấm
                          const parts = normalizedValue.split(".");
                          const finalValue =
                            parts.length > 2
                              ? parts[0] + "." + parts.slice(1).join("")
                              : normalizedValue;

                          e.target.value = finalValue;
                          field.onChange(parseFloat(finalValue) || 0);
                        }}
                        onKeyDown={(e) => {
                          // Ngăn nhập các ký tự không mong muốn
                          const invalidKeys = ["e", "E", "+", "-"];
                          if (invalidKeys.includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiền tệ</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tiền tệ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại giao dịch</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">Thu nhập</SelectItem>
                        <SelectItem value="expense">Chi tiêu</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {categories.length > 0 && (
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Không phân loại</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                Huỷ
              </Button>
              <Button type="submit">Lưu thay đổi</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
