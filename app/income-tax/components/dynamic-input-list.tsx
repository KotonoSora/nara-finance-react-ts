import { X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { CreditInfo } from "./credit-info";

interface DynamicInputListProps {
  items: Array<{ type: string; amount: string }>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: "type" | "amount", value: string) => void;
  label: string;
  typeLabel?: string;
  amountLabel?: string;
  currencyUnit?: string;
  suggestedTypes?: Array<{ value: string; label: string }>;
  showCreditHelp?: boolean;
  language?: "en" | "vi" | "ja";
}

export function DynamicInputList({
  items,
  onAdd,
  onRemove,
  onChange,
  label,
  typeLabel = "Type",
  amountLabel = "Amount",
  currencyUnit = "$",
  suggestedTypes = [],
  showCreditHelp = false,
  language = "en",
}: DynamicInputListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{label}</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="text-sm"
        >
          Add {label}
        </Button>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={index} className="relative">
            <CardContent className="pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">
                      {typeLabel}
                    </label>
                    {showCreditHelp && (
                      <CreditInfo creditType={item.type} language={language} />
                    )}
                  </div>
                  {suggestedTypes.length > 0 ? (
                    <Select
                      value={item.type}
                      onValueChange={(value) => onChange(index, "type", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {suggestedTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder={typeLabel}
                      value={item.type}
                      onChange={(e) => onChange(index, "type", e.target.value)}
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">
                    {amountLabel}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {currencyUnit}
                    </span>
                    <Input
                      placeholder={amountLabel}
                      className="pl-12"
                      type="text"
                      inputMode="numeric"
                      value={item.amount.replace(/[^0-9.-]/g, "") || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.-]/g, "");
                        onChange(index, "amount", value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => onRemove(index)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove {label}</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
