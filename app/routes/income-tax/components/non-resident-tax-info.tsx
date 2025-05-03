import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { cn } from "~/lib/utils";

import { useTooltipTransition } from "../hooks/use-tooltip-transition";
import { NON_RESIDENT_TAX_RATES } from "../utils/tax-rules";
import { getTranslation } from "../utils/translations";

interface NonResidentTaxInfoProps {
  country: string;
  language: "en" | "vi" | "ja";
  children: React.ReactNode;
}

export function NonResidentTaxInfo({
  country,
  language,
  children,
}: NonResidentTaxInfoProps) {
  const rate = NON_RESIDENT_TAX_RATES[country];
  const transition = useTooltipTransition({ showDelay: 150 });

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          className="hover:underline cursor-help"
          onMouseEnter={transition.show}
          onMouseLeave={transition.hide}
          onFocus={transition.show}
          onBlur={transition.hide}
          aria-label={getTranslation(
            "NonResident.TaxRateButtonAriaLabel",
            language,
          ).replace("{rate}", rate.toString())}
        >
          {children}
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        className={cn(
          "w-80 text-sm transition-all duration-200",
          transition.isVisible ? "opacity-100" : "opacity-0",
          transition.isLoaded ? "translate-y-0" : "translate-y-2",
        )}
        side="right"
      >
        <div className="space-y-2">
          <h4 className="font-medium">
            {getTranslation("NonResident.TaxRateTitle", language)}
          </h4>
          <p className="text-muted-foreground">
            {getTranslation("NonResident.TaxRateDescription", language)
              .replace("{rate}", rate.toString())
              .replace("{country}", country)}
          </p>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <p>{getTranslation("NonResident.LimitationsNote", language)}</p>
            <p>{getTranslation("NonResident.TreatyNote", language)}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
