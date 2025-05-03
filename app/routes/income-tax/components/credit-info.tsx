import { HelpCircle } from "lucide-react";
import { useMemo } from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

import { getTranslation } from "../utils/translations";

interface CreditInfoProps {
  creditType: string;
  language: "en" | "vi" | "ja";
}

export function CreditInfo({ creditType, language }: CreditInfoProps) {
  const helpKey = useMemo(() => {
    switch (creditType) {
      case "Tax.ChildTaxCredit":
        return "Help.ChildTaxCredit";
      case "Tax.RetirementSaving":
        return "Help.RetirementSaving";
      default:
        return "";
    }
  }, [creditType]);

  if (!helpKey) return null;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
      </HoverCardTrigger>
      <HoverCardContent className="w-80 text-sm" side="right">
        <div className="space-y-2">
          <p className="text-muted-foreground">
            {getTranslation(helpKey, language)}
          </p>
          <div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground">
            <p>{getTranslation("Help.CreditLimits", language)}</p>
            <p>{getTranslation("Help.NonRefundableCredit", language)}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
