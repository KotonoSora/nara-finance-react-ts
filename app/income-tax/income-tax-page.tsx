import { useState } from "react";

import type { ResidencyStatus, TaxBreakdown } from "./types/tax";

import { TaxForm } from "./components/tax-form";
import { TaxResults } from "./components/tax-results";

export default function IncomeTaxPage() {
  const [result, setResult] = useState<{
    data: TaxBreakdown;
    country: string;
    residencyStatus: ResidencyStatus;
  } | null>(null);

  return (
    <div className="container mx-auto py-6 space-y-8">
      <TaxForm
        onCalculate={(data, country, residencyStatus) =>
          setResult({ data, country, residencyStatus })
        }
      />
      {result && (
        <TaxResults
          result={result.data}
          country={result.country}
          residencyStatus={result.residencyStatus}
        />
      )}
    </div>
  );
}
