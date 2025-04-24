import { useState } from "react";

import type { Route } from "./+types/income-tax-page";
import type { ResidencyStatus, TaxBreakdown } from "./types/tax";

import { TaxCalculatorSkeleton } from "./components/loading-skeleton";
import { TaxForm } from "./components/tax-form";
import { TaxResults } from "./components/tax-results";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Income Tax Calculator 2025 | Multi-Country Tax Estimation Tool" },
    {
      name: "description",
      content:
        "Calculate your 2025 income tax for US, UK, Canada, Japan, South Korea, Vietnam and Singapore. Supports resident and non-resident tax calculations with detailed breakdowns.",
    },
    {
      name: "keywords",
      content:
        "income tax calculator, tax estimation, international tax, 2025 tax calculator, US tax, UK tax, Canada tax, Japan tax, Korea tax, Vietnam tax, Singapore tax",
    },
    { property: "og:title", content: "Income Tax Calculator 2025" },
    {
      property: "og:description",
      content:
        "Calculate your 2025 income tax across multiple countries with our comprehensive tax estimation tool.",
    },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Income Tax Calculator 2025" },
    {
      name: "twitter:description",
      content: "Multi-country income tax calculator for 2025 tax estimation",
    },
  ];
}

export default function IncomeTaxPage({}: Route.ComponentProps) {
  const [result, setResult] = useState<{
    data: TaxBreakdown;
    country: string;
    residencyStatus: ResidencyStatus;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async (
    data: TaxBreakdown,
    country: string,
    residencyStatus: ResidencyStatus,
  ) => {
    setIsCalculating(true);
    // Simulate calculation time for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));
    setResult({ data, country, residencyStatus });
    setIsCalculating(false);
  };

  return (
    <main className="container mx-auto py-6 space-y-8">
      <article itemScope itemType="https://schema.org/WebApplication">
        <header>
          <h1 className="text-3xl font-bold mb-4" itemProp="name">
            Income Tax Calculator 2025
          </h1>
          <p className="text-muted-foreground mb-6" itemProp="description">
            Calculate your estimated income tax for multiple countries including
            the United States, United Kingdom, Canada, Japan, South Korea,
            Vietnam, and Singapore.
          </p>
        </header>

        <section aria-label="Tax Calculator Form">
          <TaxForm onCalculate={handleCalculate} />
        </section>

        {isCalculating ? (
          <section aria-label="Loading tax calculation results">
            <TaxCalculatorSkeleton />
          </section>
        ) : (
          result && (
            <section aria-label="Tax Calculation Results">
              <TaxResults
                result={result.data}
                country={result.country}
                residencyStatus={result.residencyStatus}
              />
            </section>
          )
        )}

        <footer className="mt-8 border-t pt-8">
          <div className="text-sm text-muted-foreground space-y-4">
            <p>
              * This calculator provides estimates based on projected 2025 tax
              rates and may not reflect actual tax liability.
            </p>
            <p>
              Please consult with a qualified tax professional for accurate tax
              advice specific to your situation.
            </p>
          </div>
        </footer>
      </article>
    </main>
  );
}
