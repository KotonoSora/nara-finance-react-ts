import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Currency } from "~/features/finance/domain/types/DataContracts";

import { Button } from "~/components/ui/button";
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
import { useCreateTransaction } from "~/features/finance/application/hooks/useCreateTransaction";
import { useFinanceServices } from "~/features/finance/application/services/FinanceServices";

const createTransactionSchema = z.object({
  type: z.enum(["income", "expense"], {
    required_error: "Vui lòng chọn loại giao dịch",
  }),
  amount: z
    .number()
    .positive("Số tiền phải lớn hơn 0")
    .min(0.01, "Số tiền tối thiểu là 0.01"),
  note: z.string().optional().or(z.literal("")),
  date: z.string().min(1, "Ngày không được để trống"),
  currency_code: z.string().min(1, "Vui lòng chọn tiền tệ"),
  category: z.string().optional(),
});

type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;

interface CreateTransactionFormProps {
  currencies: Currency[];
  onSuccess: () => void;
  categories?: Array<{ id: string; name: string }>;
}

export default function CreateTransactionForm({
  currencies,
  onSuccess,
  categories = [],
}: CreateTransactionFormProps) {
  const { createTransactionUseCase } = useFinanceServices();

  const form = useForm<CreateTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: "expense",
      amount: 0,
      note: "",
      date: new Date().toISOString().split("T")[0],
      currency_code: "VND",
      category: "",
    },
  });

  const { createTransaction, loading } = useCreateTransaction(
    createTransactionUseCase,
    {
      onSuccess: () => {
        form.reset();
        onSuccess();
      },
    },
  );

  const onSubmit = (data: CreateTransactionFormData) => {
    createTransaction({
      type: data.type,
      amount: data.amount,
      currencyCode: data.currency_code,
      date: data.date,
      note: data.note,
      category: data.category,
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại giao dịch</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại giao dịch" />
                  </SelectTrigger>
                </FormControl>{" "}
                <SelectContent>
                  <SelectItem value="income">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Thu nhập
                    </span>
                  </SelectItem>
                  <SelectItem value="expense">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-destructive rounded-full"></span>
                      Chi tiêu
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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
                      const numericValue = value.replace(/[^0-9.,]/g, "");
                      const normalizedValue = numericValue.replace(/,/g, ".");
                      const parts = normalizedValue.split(".");
                      const finalValue =
                        parts.length > 2
                          ? parts[0] + "." + parts.slice(1).join("")
                          : normalizedValue;

                      e.target.value = finalValue;
                      field.onChange(parseFloat(finalValue) || 0);
                    }}
                    onKeyDown={(e) => {
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
                    {currencies?.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập mô tả cho giao dịch..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày giao dịch</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Đang lưu...
            </span>
          ) : (
            "Tạo giao dịch"
          )}
        </Button>
      </form>
    </Form>
  );
}
