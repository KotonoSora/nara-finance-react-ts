import { Card } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

import { useTooltipTransition } from "../hooks/use-tooltip-transition";
import { formatCurrency, formatPercent } from "../utils/currency-formatter";
import { getTranslation } from "../utils/translations";

interface TaxBracketInfo {
  min: number;
  max: number | null;
  rate: number;
}

interface TaxRateInfoProps {
  country: string;
  language: "en" | "vi" | "ja";
  bracket: TaxBracketInfo;
  children: React.ReactNode;
}

export function TaxRateInfo({
  country,
  language,
  bracket,
  children,
}: TaxRateInfoProps) {
  const transition = useTooltipTransition({ showDelay: 200 });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="hover:underline cursor-help"
          onMouseEnter={transition.show}
          onMouseLeave={transition.hide}
          onFocus={transition.show}
          onBlur={transition.hide}
        >
          {children}
        </button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "transition-opacity duration-200",
          transition.isVisible ? "opacity-100" : "opacity-0",
          transition.isLoaded ? "translate-y-0" : "translate-y-2",
        )}
      >
        <DialogHeader>
          <DialogTitle>
            {getTranslation("TaxRate.Title", language)}:{" "}
            {formatPercent(bracket.rate)}
          </DialogTitle>
          <DialogDescription>
            {getTranslation("TaxRate.Description", language)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {getTranslation("TaxRate.From", language)}
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(bracket.min, country)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {getTranslation("TaxRate.To", language)}
                </p>
                <p className="text-lg font-semibold">
                  {bracket.max === null
                    ? getTranslation("TaxRate.NoLimit", language)
                    : formatCurrency(bracket.max, country)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">
                  {getTranslation("TaxRate.MaxTax", language)}
                </p>
                <p className="text-lg font-semibold">
                  {bracket.max === null
                    ? getTranslation("TaxRate.Unlimited", language)
                    : formatCurrency(
                        (bracket.max - bracket.min) * bracket.rate,
                        country,
                      )}
                </p>
              </div>
            </div>
          </Card>
          <p className="text-sm text-muted-foreground">
            {getTranslation("TaxRate.MarginalNote", language)}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
