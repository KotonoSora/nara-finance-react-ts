import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

import type { Category } from "~/routes/finance/types/finance";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";

interface HierarchicalCategorySelectorProps {
  categories: Category[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  transactionType?: "income" | "expense" | "investment";
}

interface CategoryOptionProps {
  category: Category;
  level?: number;
  selectedValue?: string;
  onSelect?: (value: string) => void;
}

function CategoryOption({
  category,
  level = 0,
  selectedValue,
  onSelect,
}: CategoryOptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedValue === category.id;

  return (
    <>
      <CommandItem
        key={category.id}
        value={category.id}
        onSelect={() => onSelect?.(category.id)}
        className="flex items-center gap-2 cursor-pointer"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center justify-center w-4 h-4 hover:bg-muted rounded-sm"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        {category.icon && (
          <span style={{ color: category.color || undefined }}>
            {category.icon}
          </span>
        )}

        <span className="flex-1">{category.name}</span>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground capitalize">
            {category.type}
          </span>
          {category.budget_limit && (
            <span className="text-xs bg-muted px-1 py-0.5 rounded">
              ${category.budget_limit}
            </span>
          )}
          {isSelected && <Check className="h-4 w-4" />}
        </div>
      </CommandItem>

      {hasChildren && isExpanded && (
        <>
          {category.children?.map((child) => (
            <CategoryOption
              key={child.id}
              category={child}
              level={level + 1}
              selectedValue={selectedValue}
              onSelect={onSelect}
            />
          ))}
        </>
      )}
    </>
  );
}

export default function HierarchicalCategorySelector({
  categories,
  value,
  onValueChange,
  placeholder = "Select category...",
  disabled = false,
  transactionType,
}: HierarchicalCategorySelectorProps) {
  const [open, setOpen] = useState(false);

  // Filter categories by transaction type if specified
  const filteredCategories = transactionType
    ? categories.filter((cat) => cat.type === transactionType)
    : categories;

  // Get only root categories for display
  const rootCategories = filteredCategories.filter((cat) => !cat.parent_id);

  const selectedCategory = categories.find((cat) => cat.id === value);

  const getCategoryPath = (category: Category): string => {
    if (!category.parent) return category.name;
    return `${getCategoryPath(category.parent)} > ${category.name}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedCategory ? (
            <div className="flex items-center gap-2">
              {selectedCategory.icon && (
                <span style={{ color: selectedCategory.color || undefined }}>
                  {selectedCategory.icon}
                </span>
              )}
              <span>{getCategoryPath(selectedCategory)}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <ScrollArea className="h-[300px]">
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                {rootCategories.map((category) => (
                  <CategoryOption
                    key={category.id}
                    category={category}
                    selectedValue={value}
                    onSelect={(categoryId) => {
                      onValueChange?.(categoryId);
                      setOpen(false);
                    }}
                  />
                ))}
              </CommandGroup>
            </CommandList>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
