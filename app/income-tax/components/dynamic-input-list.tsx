import { X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface DynamicInputListProps {
  items: Array<{ type: string; amount: string }>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: "type" | "amount", value: string) => void;
  label: string;
  typeLabel?: string;
  amountLabel?: string;
}

export function DynamicInputList({
  items,
  onAdd,
  onRemove,
  onChange,
  label,
  typeLabel = "Type",
  amountLabel = "Amount",
}: DynamicInputListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{label}</h4>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          Add {label}
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder={typeLabel}
              value={item.type}
              onChange={(e) => onChange(index, "type", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Input
              placeholder={amountLabel}
              value={item.amount}
              onChange={(e) => onChange(index, "amount", e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
