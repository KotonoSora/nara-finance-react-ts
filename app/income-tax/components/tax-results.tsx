import { HelpCircle } from "lucide-react";
import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { ResidencyStatus, TaxBreakdown } from "../types/tax";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as UITooltip,
} from "~/components/ui/tooltip";

import { formatCurrency, formatPercent } from "../utils/currency-formatter";
import { NON_RESIDENT_TAX_RATES } from "../utils/tax-rules";
import { countryToLanguage, getTranslation } from "../utils/translations";
import { BracketNavigationAnnouncement } from "./accessibility-announcement";
import { AccessibleTaxInfo } from "./accessible-tax-info";
import { NonResidentTaxInfo } from "./non-resident-tax-info";
import { TaxRateInfo } from "./tax-rate-info";

interface TaxResultsProps {
  result: TaxBreakdown;
  country: string;
  residencyStatus: ResidencyStatus;
}

export function TaxResults({
  result,
  country,
  residencyStatus,
}: TaxResultsProps) {
  const language = countryToLanguage[country];

  const summaryItems = useMemo(
    () => [
      {
        label: getTranslation("Results.GrossIncome", language),
        value: formatCurrency(result.grossIncome, country),
        tooltip: getTranslation("Tooltip.GrossIncome", language),
      },
      {
        label: getTranslation("Results.TotalDeductions", language),
        value: formatCurrency(result.totalDeductions, country),
        tooltip:
          residencyStatus === "non_resident"
            ? getTranslation("Tooltip.NonResidentDeductions", language)
            : getTranslation("Tooltip.TotalDeductions", language),
      },
      {
        label: getTranslation("Results.TaxableIncome", language),
        value: formatCurrency(result.taxableIncome, country),
        tooltip: getTranslation("Tooltip.TaxableIncome", language),
      },
      {
        label: getTranslation("Results.TotalTax", language),
        value: formatCurrency(result.totalTax, country),
        tooltip:
          residencyStatus === "non_resident"
            ? getTranslation("Tooltip.TotalTaxNonResident", language).replace(
                "{rate}",
                NON_RESIDENT_TAX_RATES[country].toString(),
              )
            : getTranslation("Tooltip.TotalTaxResident", language),
      },
      {
        label: getTranslation("Results.EffectiveTaxRate", language),
        value: formatPercent(result.effectiveRate),
        tooltip: getTranslation("Tooltip.EffectiveTaxRate", language),
      },
    ],
    [result, country, residencyStatus, language],
  );

  const chartData = useMemo(() => {
    const data = [
      {
        name: getTranslation("Results.NetIncome", language),
        value: result.grossIncome - result.totalTax,
        color: "#3B82F6", // Blue
      },
      {
        name: getTranslation("Results.FederalTax", language),
        value: result.totalTax - (result.stateTax?.amount || 0),
        color: "#EF4444", // Red
      },
    ];

    if (result.stateTax?.amount) {
      data.push({
        name: `${result.stateTax.state} ${getTranslation(
          "Results.StateTax",
          language,
        )}`,
        value: result.stateTax.amount,
        color: "#F97316", // Orange
      });
    }

    return data;
  }, [result, language]);

  return (
    <div
      className="space-y-6"
      itemScope
      itemType="https://schema.org/FinancialProduct"
    >
      <Card>
        <CardHeader>
          <CardTitle itemProp="name">
            {getTranslation("Results.Summary", language)}
          </CardTitle>
          <CardDescription>
            <span itemProp="description">
              {getTranslation("Results.Year", language)}
              {residencyStatus === "non_resident" &&
                ` ${getTranslation("Results.NonResidentNote", language)}`}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="h-[300px] sm:h-[400px] lg:h-[300px]"
            role="img"
            aria-label={getTranslation("Results.ChartAriaLabel", language)}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  label={({ name, value }) =>
                    `${name}: ${formatCurrency(value, country)}`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                      strokeWidth={2}
                      className="transition-all duration-200 hover:opacity-80 hover:stroke-2"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-card p-3 shadow-lg">
                        <div className="font-semibold">{data.name}</div>
                        <div className="text-lg">
                          {formatCurrency(data.value, country)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatPercent(
                            (data.value / result.grossIncome) * 100,
                          )}{" "}
                          {getTranslation("Results.OfGrossIncome", language)}
                        </div>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {summaryItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  {item.tooltip && (
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger>
                          <HelpCircle
                            className="h-4 w-4 text-muted-foreground"
                            aria-label={getTranslation(
                              "Results.HelpAriaLabel",
                              language,
                            ).replace("{label}", item.label.toLowerCase())}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item.tooltip}</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  )}
                </div>
                <p
                  className="text-2xl font-bold"
                  itemProp={item.label.toLowerCase().replace(/\s+/g, "")}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {residencyStatus === "resident" ? (
        <>
          <Card
            aria-label={getTranslation("Results.BracketsAriaLabel", language)}
          >
            <CardHeader>
              <CardTitle>
                {getTranslation("Results.BracketsTitle", language)}
              </CardTitle>
              <CardDescription>
                {getTranslation("Results.BracketsDescription", language)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BracketNavigationAnnouncement language={language} />
              <Table>
                <TableCaption>
                  {getTranslation("Results.BracketsCaption", language)}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {getTranslation("Results.TaxRate", language)}
                    </TableHead>
                    <TableHead>
                      {getTranslation("Results.TaxableAmount", language)}
                    </TableHead>
                    <TableHead className="text-right">
                      {getTranslation("Results.Tax", language)}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.brackets.map((bracket, index) => {
                    const bracketInfo = {
                      min: index === 0 ? 0 : result.brackets[index - 1].income,
                      max: bracket.income,
                      rate: bracket.rate,
                    };
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <AccessibleTaxInfo
                            country={country}
                            language={language}
                            bracket={bracketInfo}
                            index={index}
                            totalBrackets={result.brackets.length}
                          >
                            {formatPercent(bracket.rate)}
                          </AccessibleTaxInfo>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(bracket.income, country)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(bracket.tax, country)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {(result.deductions.length > 0 || result.credits.length > 0) && (
            <Card
              aria-label={getTranslation(
                "Results.DeductionsCreditsAriaLabel",
                language,
              )}
            >
              <CardHeader>
                <CardTitle>
                  {getTranslation("Results.DeductionsCreditsTitle", language)}
                </CardTitle>
                <CardDescription>
                  {getTranslation(
                    "Results.DeductionsCreditsDescription",
                    language,
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {result.deductions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-4">
                      {getTranslation("Results.DeductionsTitle", language)}
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            {getTranslation("Results.Type", language)}
                          </TableHead>
                          <TableHead className="text-right">
                            {getTranslation("Results.Amount", language)}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.deductions.map((deduction, index) => (
                          <TableRow key={index}>
                            <TableCell className="capitalize">
                              {deduction.type.replace(/_/g, " ")}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(deduction.amount, country)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {result.credits.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-4">
                      {getTranslation("Results.CreditsTitle", language)}
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            {getTranslation("Results.Type", language)}
                          </TableHead>
                          <TableHead className="text-right">
                            {getTranslation("Results.Amount", language)}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.credits.map((credit, index) => (
                          <TableRow key={index}>
                            <TableCell className="capitalize">
                              {credit.type.replace(/_/g, " ")}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(credit.amount, country)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {result.insuranceDeductions && (
            <Card
              aria-label={getTranslation(
                "Results.InsuranceContributionsAriaLabel",
                language,
              )}
            >
              <CardHeader>
                <CardTitle>
                  {getTranslation(
                    "Results.InsuranceContributionsTitle",
                    language,
                  )}
                </CardTitle>
                <CardDescription>
                  {getTranslation(
                    "Results.InsuranceContributionsDescription",
                    language,
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {getTranslation("Results.Type", language)}
                      </TableHead>
                      <TableHead className="text-right">
                        {getTranslation("Results.Amount", language)}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(result.insuranceDeductions).map(
                      ([key, value]) =>
                        value > 0 && (
                          <TableRow key={key}>
                            <TableCell className="capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(value, country)}
                            </TableCell>
                          </TableRow>
                        ),
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {result.familyDeductions &&
            result.familyDeductions.dependentCount > 0 && (
              <Card
                aria-label={getTranslation(
                  "Results.FamilyDeductionsAriaLabel",
                  language,
                )}
              >
                <CardHeader>
                  <CardTitle>
                    {getTranslation("Results.FamilyDeductionsTitle", language)}
                  </CardTitle>
                  <CardDescription>
                    {getTranslation(
                      "Results.FamilyDeductionsDescription",
                      language,
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {getTranslation("Results.Type", language)}
                        </TableHead>
                        <TableHead>
                          {getTranslation("Results.Details", language)}
                        </TableHead>
                        <TableHead className="text-right">
                          {getTranslation("Results.Amount", language)}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.familyDeductions.personalDeduction > 0 && (
                        <TableRow>
                          <TableCell>
                            {getTranslation(
                              "Results.PersonalDeduction",
                              language,
                            )}
                          </TableCell>
                          <TableCell>
                            {getTranslation(
                              "Results.BasicPersonalAmount",
                              language,
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(
                              result.familyDeductions.personalDeduction,
                              country,
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell>
                          {getTranslation(
                            "Results.DependentDeduction",
                            language,
                          )}
                        </TableCell>
                        <TableCell>
                          {result.familyDeductions.dependentCount}{" "}
                          {getTranslation("Results.Dependents", language)} ×{" "}
                          {formatCurrency(
                            result.familyDeductions.dependentDeductionPerPerson,
                            country,
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(
                            result.familyDeductions.dependentCount *
                              result.familyDeductions
                                .dependentDeductionPerPerson,
                            country,
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

          {result.stateTax && (
            <Card
              aria-label={getTranslation("Results.StateTaxAriaLabel", language)}
            >
              <CardHeader>
                <CardTitle>
                  {result.stateTax.state}{" "}
                  {getTranslation("Results.StateTaxTitle", language)}
                </CardTitle>
                <CardDescription>
                  {getTranslation("Results.StateTaxDescription", language)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>
                    {getTranslation("Results.StateTaxCaption", language)}
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {getTranslation("Results.TaxRate", language)}
                      </TableHead>
                      <TableHead>
                        {getTranslation("Results.TaxableAmount", language)}
                      </TableHead>
                      <TableHead className="text-right">
                        {getTranslation("Results.Tax", language)}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.stateTax.brackets.map((bracket, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatPercent(bracket.rate)}</TableCell>
                        <TableCell>
                          {formatCurrency(bracket.income, country)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(bracket.tax, country)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card
          aria-label={getTranslation("Results.NonResidentAriaLabel", language)}
        >
          <CardHeader>
            <CardTitle>
              {getTranslation("Results.NonResidentTitle", language)}
            </CardTitle>
            <CardDescription>
              {getTranslation("Results.NonResidentDescription", language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BracketNavigationAnnouncement language={language} />
            <p className="text-sm text-muted-foreground mb-4">
              {getTranslation("Results.NonResidentFlatRate", language).replace(
                "{rate}",
                NON_RESIDENT_TAX_RATES[country].toString(),
              )}
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {getTranslation("Results.TaxRate", language)}
                  </TableHead>
                  <TableHead>
                    {getTranslation("Results.TaxableAmount", language)}
                  </TableHead>
                  <TableHead className="text-right">
                    {getTranslation("Results.Tax", language)}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <NonResidentTaxInfo country={country} language={language}>
                      {formatPercent(NON_RESIDENT_TAX_RATES[country])}
                    </NonResidentTaxInfo>
                  </TableCell>
                  <TableCell>
                    {formatCurrency(result.taxableIncome, country)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(result.totalTax, country)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
