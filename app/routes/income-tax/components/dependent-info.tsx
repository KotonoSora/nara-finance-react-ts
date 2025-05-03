import { HelpCircle } from "lucide-react";
import { useMemo } from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

import { getTranslation } from "../utils/translations";

interface DependentInfoProps {
  country: string;
  language: "en" | "vi" | "ja";
}

export function DependentInfo({ country, language }: DependentInfoProps) {
  const helpKey = useMemo(() => {
    switch (country) {
      case "US":
        return "Help.DependentsUS";
      case "VN":
        return "Help.DependentsVN";
      case "JP":
        return "Help.DependentsJP";
      default:
        return "";
    }
  }, [country]);

  if (!helpKey) return null;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
      </HoverCardTrigger>
      <HoverCardContent className="w-80 text-sm" side="right">
        <div className="space-y-2">
          <h4 className="font-medium">
            {getTranslation("Help.DependentRequirements", language)}
          </h4>
          <p className="text-muted-foreground">
            {getTranslation(helpKey, language)}
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            {getTranslation("Help.DependentIncome", language)}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
