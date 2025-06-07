import { zodResolver } from "@hookform/resolvers/zod";
import { Palette, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type {
  Category,
  CategoryFormData,
  TransactionType,
} from "~/routes/finance/presentation/types/ui.types";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Switch } from "~/components/ui/switch";

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must not exceed 50 characters"),
  type: z.enum(["income", "expense", "investment"], {
    required_error: "Please select a transaction type",
  }),
  parent_id: z.string().optional().nullable(),
  budget_limit: z.coerce
    .number()
    .min(0, "Budget must be positive")
    .optional()
    .nullable(),
  budget_period: z.enum(["weekly", "monthly", "yearly"]).optional().nullable(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

type CategoryFormSchema = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryFormData) => void;
  allCategories: Category[];
  category?: Category;
  parentCategory?: Category; // Added parentCategory prop
  mode?: "create" | "edit";
}

const PREDEFINED_ICONS = [
  "🍔",
  "🚗",
  "🛒",
  "💰",
  "🏠",
  "⚡",
  "📱",
  "🎬",
  "✈️",
  "🏥",
  "📚",
  "🎯",
  "💳",
  "🍕",
  "☕",
  "🎮",
  "🧘",
  "💼",
  "🎨",
  "🎵",
];

const PREDEFINED_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#64748b", // slate
  "#78716c", // stone
];

export default function CategoryFormDialog({
  open,
  onOpenChange,
  onSubmit,
  category,
  mode = "create",
  allCategories,
  parentCategory, // Added parentCategory to destructuring
}: CategoryFormDialogProps) {
  const [enableBudget, setEnableBudget] = useState(false);

  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "expense",
      parent_id: null,
      budget_limit: null,
      budget_period: "monthly",
      icon: null,
      color: null,
    },
  });

  // Reset form when category or parent changes
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        type: category.type,
        parent_id: category.parent_id || null,
        budget_limit: category.budget_limit,
        budget_period: category.budget_period,
        icon: category.icon,
        color: category.color,
      });
      setEnableBudget(!!category.budget_limit);
    } else if (parentCategory) {
      form.reset({
        name: "",
        type: parentCategory.type, // Default to parent's type
        parent_id: parentCategory.id,
        budget_limit: null,
        budget_period: "monthly",
        icon: null,
        color: null,
      });
      setEnableBudget(false);
    } else {
      form.reset({
        name: "",
        type: "expense",
        parent_id: null,
        budget_limit: null,
        budget_period: "monthly",
        icon: null,
        color: null,
      });
      setEnableBudget(false);
    }
  }, [category, parentCategory, form]);

  const handleSubmit = (data: CategoryFormSchema) => {
    // If budget is disabled, set budget_limit to null
    const submitData: CategoryFormData = {
      ...data,
      budget_limit: enableBudget ? data.budget_limit : null,
      budget_period: enableBudget
        ? data.budget_period || "monthly" // Default to "monthly" if null/undefined and budget is enabled
        : undefined, // Set to undefined if budget is not enabled
    };
    onSubmit(submitData);
    onOpenChange(false);
    if (mode === "create") {
      form.reset();
      setEnableBudget(false);
    }
  };

  // Helper function to check if a category is a descendant of another
  const isDescendant = (
    potentialParent: Category,
    targetCategory: Category,
    allCategories: Category[],
  ): boolean => {
    if (potentialParent.parent_id === targetCategory.id) return true;
    if (!potentialParent.parent_id) return false;

    const parent = allCategories.find(
      (c) => c.id === potentialParent.parent_id,
    );
    return parent ? isDescendant(parent, targetCategory, allCategories) : false;
  };

  // Filter categories for parent selection (exclude self and children)
  const availableParents = allCategories.filter((cat: Category) => {
    if (category) {
      // Exclude self and descendants
      return (
        cat.id !== category.id && !isDescendant(cat, category, allCategories)
      );
    }
    return cat.type === form.watch("type");
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
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

            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    onValueChange={(val) =>
                      field.onChange(val === "none" ? null : val)
                    }
                    defaultValue={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="No parent (root category)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">
                        No parent (root category)
                      </SelectItem>
                      {availableParents.map((cat: Category) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.icon && `${cat.icon} `}
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a parent category to create a subcategory
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            {field.value ? (
                              <span className="mr-2">{field.value}</span>
                            ) : (
                              <Smile className="h-4 w-4 mr-2" />
                            )}
                            {field.value ? "Change icon" : "Select icon"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid grid-cols-8 gap-2">
                          {PREDEFINED_ICONS.map((icon) => (
                            <Button
                              key={icon}
                              type="button"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => field.onChange(icon)}
                            >
                              {icon}
                            </Button>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full mt-2"
                          onClick={() => field.onChange(null)}
                        >
                          Remove icon
                        </Button>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            {field.value ? (
                              <div
                                className="w-4 h-4 rounded mr-2"
                                style={{ backgroundColor: field.value }}
                              />
                            ) : (
                              <Palette className="h-4 w-4 mr-2" />
                            )}
                            {field.value ? "Change color" : "Select color"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid grid-cols-5 gap-2">
                          {PREDEFINED_COLORS.map((color) => (
                            <Button
                              key={color}
                              type="button"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              style={{ backgroundColor: color }}
                              onClick={() => field.onChange(color)}
                            />
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full mt-2"
                          onClick={() => field.onChange(null)}
                        >
                          Remove color
                        </Button>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-budget"
                  checked={enableBudget}
                  onCheckedChange={setEnableBudget}
                />
                <label
                  htmlFor="enable-budget"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Enable budget tracking
                </label>
              </div>

              {enableBudget && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budget_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Limit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget_period"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Period</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ?? undefined} // Ensure null becomes undefined for Select
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="submit">
                {mode === "create" ? "Create Category" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
