import { useCallback, useRef } from "react";

import { getTranslation } from "../utils/translations";
import { TaxRateInfo } from "./tax-rate-info";

interface AccessibleTaxInfoProps {
  country: string;
  language: "en" | "vi" | "ja";
  bracket: {
    min: number;
    max: number | null;
    rate: number;
  };
  children: React.ReactNode;
  index: number;
  totalBrackets: number;
}

export function AccessibleTaxInfo({
  country,
  language,
  bracket,
  children,
  index,
  totalBrackets,
}: AccessibleTaxInfoProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          const nextTrigger = document.querySelector(
            `[data-bracket-index="${index + 1}"]`,
          ) as HTMLElement;
          if (nextTrigger) nextTrigger.focus();
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          const prevTrigger = document.querySelector(
            `[data-bracket-index="${index - 1}"]`,
          ) as HTMLElement;
          if (prevTrigger) prevTrigger.focus();
          break;
        case "Home":
          e.preventDefault();
          const firstTrigger = document.querySelector(
            '[data-bracket-index="0"]',
          ) as HTMLElement;
          if (firstTrigger) firstTrigger.focus();
          break;
        case "End":
          e.preventDefault();
          const lastTrigger = document.querySelector(
            `[data-bracket-index="${totalBrackets - 1}"]`,
          ) as HTMLElement;
          if (lastTrigger) lastTrigger.focus();
          break;
      }
    },
    [index, totalBrackets],
  );

  return (
    <div
      role="gridcell"
      aria-label={getTranslation("TaxRate.BracketAriaLabel", language)
        .replace("{index}", (index + 1).toString())
        .replace("{total}", totalBrackets.toString())}
    >
      <TaxRateInfo country={country} language={language} bracket={bracket}>
        <button
          ref={triggerRef}
          data-bracket-index={index}
          onKeyDown={handleKeyDown}
          className="hover:underline cursor-help focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded px-1"
          aria-label={getTranslation(
            "TaxRate.BracketButtonAriaLabel",
            language,
          ).replace("{rate}", (bracket.rate * 100).toString())}
        >
          {children}
        </button>
      </TaxRateInfo>
    </div>
  );
}
