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
  const summaryItems = useMemo(
    () => [
      {
        label: "Gross Income",
        value: formatCurrency(result.grossIncome, country),
        tooltip: "Total income before any deductions or taxes",
      },
      {
        label: "Total Deductions",
        value: formatCurrency(result.totalDeductions, country),
        tooltip:
          residencyStatus === "non_resident"
            ? "Non-residents generally cannot claim deductions"
            : "Sum of all deductions including standard deduction, itemized deductions, and family deductions",
      },
      {
        label: "Taxable Income",
        value: formatCurrency(result.taxableIncome, country),
        tooltip: "Income subject to tax after all deductions",
      },
      {
        label: "Total Tax",
        value: formatCurrency(result.totalTax, country),
        tooltip:
          residencyStatus === "non_resident"
            ? `Flat rate of ${NON_RESIDENT_TAX_RATES[country]}% applied to gross income`
            : "Total tax calculated based on tax brackets and credits",
      },
      {
        label: "Effective Tax Rate",
        value: formatPercent(result.effectiveRate),
        tooltip: "Total tax as a percentage of gross income",
      },
    ],
    [result, country, residencyStatus],
  );

  const chartData = useMemo(() => {
    const data = [
      {
        name: "Net Income",
        value: result.grossIncome - result.totalTax,
        color: "#3B82F6", // Blue
      },
      {
        name: "Federal Tax",
        value: result.totalTax - (result.stateTax?.amount || 0),
        color: "#EF4444", // Red
      },
    ];

    if (result.stateTax?.amount) {
      data.push({
        name: `${result.stateTax.state} State Tax`,
        value: result.stateTax.amount,
        color: "#F97316", // Orange
      });
    }

    return data;
  }, [result]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tax Calculation Summary</CardTitle>
          <CardDescription>
            Estimated tax breakdown for tax year 2025
            {residencyStatus === "non_resident" &&
              " (Non-Resident Rate Applied)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-[300px]">
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
                  label={({ name, value }) =>
                    `${name}: ${formatCurrency(value, country)}`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-card p-2 shadow-sm">
                        <div className="font-medium">{data.name}</div>
                        <div>{formatCurrency(data.value, country)}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatPercent(
                            (data.value / result.grossIncome) * 100,
                          )}{" "}
                          of gross income
                        </div>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {summaryItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  {item.tooltip && (
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item.tooltip}</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  )}
                </div>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {residencyStatus === "resident" ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Tax Brackets Breakdown</CardTitle>
              <CardDescription>
                How your income is taxed at different rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Tax calculation by income brackets</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax Rate</TableHead>
                    <TableHead>Taxable Amount</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.brackets.map((bracket, index) => (
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

          {(result.deductions.length > 0 || result.credits.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Deductions and Credits</CardTitle>
                <CardDescription>
                  Applied deductions and tax credits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {result.deductions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-4">Deductions</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
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
                    <h4 className="text-sm font-medium mb-4">Tax Credits</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
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
            <Card>
              <CardHeader>
                <CardTitle>Insurance Contributions</CardTitle>
                <CardDescription>
                  Mandatory social security and insurance contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
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
              <Card>
                <CardHeader>
                  <CardTitle>Family Deductions</CardTitle>
                  <CardDescription>
                    Personal and dependent deductions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.familyDeductions.personalDeduction > 0 && (
                        <TableRow>
                          <TableCell>Personal Deduction</TableCell>
                          <TableCell>Basic personal amount</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(
                              result.familyDeductions.personalDeduction,
                              country,
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell>Dependent Deduction</TableCell>
                        <TableCell>
                          {result.familyDeductions.dependentCount} dependents ×{" "}
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
            <Card>
              <CardHeader>
                <CardTitle>
                  {result.stateTax.state} State Tax Breakdown
                </CardTitle>
                <CardDescription>
                  State tax calculation by income brackets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>
                    State tax calculation by income brackets
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tax Rate</TableHead>
                      <TableHead>Taxable Amount</TableHead>
                      <TableHead className="text-right">Tax</TableHead>
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
        <Card>
          <CardHeader>
            <CardTitle>Non-Resident Tax Information</CardTitle>
            <CardDescription>
              Special tax rules apply for non-residents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              As a non-resident, a flat tax rate of{" "}
              {NON_RESIDENT_TAX_RATES[country]}% is applied to your income. Most
              deductions and credits are not available for non-residents.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tax Rate</TableHead>
                  <TableHead>Taxable Amount</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {formatPercent(NON_RESIDENT_TAX_RATES[country])}
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
