import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import type {
  Country,
  FilingStatus,
  ResidencyStatus,
  TaxBreakdown,
} from "../types/tax";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";

import {
  CURRENCY_CONFIG,
  formatCurrency,
  parseCurrencyInput,
} from "../utils/currency-formatter";
import { TaxCalculator } from "../utils/tax-calculator";
import { DynamicInputList } from "./dynamic-input-list";

const formSchema = z.object({
  country: z.enum(["US", "UK", "CA", "JP", "KR", "VN", "SG"]),
  residencyStatus: z.enum(["resident", "non_resident"]),
  state: z.enum(["CA", "NY"]).nullable(),
  filingStatus: z.enum(["single", "married", "head_of_household"]),
  annualIncome: z.string().min(1, "Annual income is required"),
  additionalIncome: z.string(),
  dependentCount: z.number().int().min(0).max(10),
  useItemizedDeductions: z.boolean(),
  itemizedDeductions: z.array(
    z.object({
      type: z.string().min(1, "Description is required"),
      amount: z.string().min(1, "Amount is required"),
    }),
  ),
  credits: z.array(
    z.object({
      type: z.string().min(1, "Description is required"),
      amount: z.string().min(1, "Amount is required"),
    }),
  ),
});

type FormData = z.infer<typeof formSchema>;

interface TaxFormProps {
  onCalculate: (
    result: TaxBreakdown,
    country: string,
    residencyStatus: ResidencyStatus,
  ) => void;
  onReset: () => void;
}

export function TaxForm({ onCalculate, onReset }: TaxFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "US",
      residencyStatus: "resident",
      state: null,
      filingStatus: "single",
      annualIncome: "0",
      additionalIncome: "0",
      dependentCount: 0,
      useItemizedDeductions: false,
      itemizedDeductions: [],
      credits: [],
    },
  });

  const onCountryChange = (newCountry: Country) => {
    // Reset all monetary values to 0 in the new currency format
    form.setValue("annualIncome", formatCurrency(0, newCountry));
    form.setValue("additionalIncome", formatCurrency(0, newCountry));

    // Reset all form arrays and flags
    form.setValue("itemizedDeductions", []);
    form.setValue("credits", []);
    form.setValue("useItemizedDeductions", false);
    form.setValue("dependentCount", 0);

    // Reset residency and state-specific fields
    form.setValue("residencyStatus", "resident");
    form.setValue("state", null);
    form.setValue("filingStatus", "single");

    // Reset calculation results
    onReset();
  };

  function getFilingStatusOptions(country: Country) {
    const commonOptions = [
      { value: "single", label: "Single" },
      { value: "married", label: "Married" },
    ];

    switch (country) {
      case "US":
        return [
          ...commonOptions,
          { value: "head_of_household", label: "Head of Household" },
        ];
      default:
        return commonOptions;
    }
  }

  function onSubmit(data: FormData) {
    const calculator = new TaxCalculator({
      country: data.country,
      residencyStatus: data.residencyStatus,
      state: data.state,
      filingStatus: data.filingStatus,
      annualIncome: parseCurrencyInput(data.annualIncome),
      additionalIncome: parseCurrencyInput(data.additionalIncome || "0"),
      deductions: data.itemizedDeductions.map((d) => ({
        type: d.type,
        amount: parseCurrencyInput(d.amount),
      })),
      credits: data.credits.map((c) => ({
        type: c.type,
        amount: parseCurrencyInput(c.amount),
      })),
      familyDeduction: {
        dependentCount: data.dependentCount,
      },
    });

    const result = calculator.calculate();
    onCalculate(result, data.country, data.residencyStatus);
  }

  const currentCountry = form.watch("country");
  const isNonResident = form.watch("residencyStatus") === "non_resident";
  const showStateSelection = currentCountry === "US" && !isNonResident;

  return (
    <Card role="form" aria-labelledby="tax-form-title">
      <CardHeader>
        <CardTitle id="tax-form-title" itemProp="serviceType">
          Personal Income Tax Calculator (2025)
        </CardTitle>
        <CardDescription itemProp="provider">
          <p itemProp="description">
            Calculate your estimated income tax for the US, UK, Canada, Japan,
            South Korea, Vietnam, and Singapore
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent itemProp="areaServed">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            aria-label="Tax calculation form"
            itemScope
            itemType="https://schema.org/Service"
            itemProp="calculation"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        onCountryChange(value as Country);
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="JP">Japan</SelectItem>
                        <SelectItem value="KR">South Korea</SelectItem>
                        <SelectItem value="VN">Vietnam</SelectItem>
                        <SelectItem value="SG">Singapore</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="residencyStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residency Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select residency status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="resident">Resident</SelectItem>
                        <SelectItem value="non_resident">
                          Non-Resident
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Non-residents may be subject to different tax rates and
                      limitations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showStateSelection && (
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select your state for state tax calculation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="filingStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filing Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isNonResident}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select filing status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getFilingStatusOptions(
                          form.watch("country") as Country,
                        ).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="annualIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Income</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={formatCurrency(0, form.watch("country"))}
                        onChange={(e) => {
                          const parsed = parseCurrencyInput(e.target.value);
                          field.onChange(
                            formatCurrency(parsed, form.watch("country")),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dependentCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Dependents</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="advanced"
                checked={showAdvanced}
                onCheckedChange={setShowAdvanced}
                disabled={isNonResident}
                aria-label="Toggle advanced options"
              />
              <label htmlFor="advanced" className="text-sm">
                Show Advanced Options{" "}
                {isNonResident && (
                  <span className="text-muted-foreground">
                    (Not available for non-residents)
                  </span>
                )}
              </label>
            </div>

            {showAdvanced && !isNonResident && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="additionalIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Income</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={formatCurrency(0, form.watch("country"))}
                          onChange={(e) => {
                            const parsed = parseCurrencyInput(e.target.value);
                            field.onChange(
                              formatCurrency(parsed, form.watch("country")),
                            );
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Include other income sources like dividends, rental
                        income, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="useItemizedDeductions"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Use Itemized Deductions</FormLabel>
                    </FormItem>
                  )}
                />

                {form.watch("useItemizedDeductions") && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="itemizedDeductions"
                      render={({ field }) => (
                        <FormItem>
                          <DynamicInputList
                            items={field.value}
                            label="Itemized Deduction"
                            typeLabel="Description"
                            amountLabel={`Amount (${CURRENCY_CONFIG[form.watch("country")]?.code || "USD"})`}
                            onAdd={() => {
                              const currentDeductions =
                                form.getValues("itemizedDeductions");
                              form.setValue("itemizedDeductions", [
                                ...currentDeductions,
                                {
                                  type: "",
                                  amount: formatCurrency(
                                    0,
                                    form.watch("country"),
                                  ),
                                },
                              ]);
                            }}
                            onRemove={(index) => {
                              const currentDeductions =
                                form.getValues("itemizedDeductions");
                              form.setValue(
                                "itemizedDeductions",
                                currentDeductions.filter((_, i) => i !== index),
                              );
                            }}
                            onChange={(index, fieldName, value) => {
                              const currentDeductions =
                                form.getValues("itemizedDeductions");
                              const updatedDeductions = [...currentDeductions];
                              if (fieldName === "amount") {
                                const parsed = parseCurrencyInput(value);
                                value = formatCurrency(
                                  parsed,
                                  form.watch("country"),
                                );
                              }
                              updatedDeductions[index] = {
                                ...updatedDeductions[index],
                                [fieldName]: value,
                              };
                              form.setValue(
                                "itemizedDeductions",
                                updatedDeductions,
                              );
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="credits"
                      render={({ field }) => (
                        <FormItem>
                          <DynamicInputList
                            items={field.value}
                            label="Tax Credit"
                            typeLabel="Description"
                            amountLabel={`Amount (${CURRENCY_CONFIG[form.watch("country")]?.code || "USD"})`}
                            onAdd={() => {
                              const currentCredits = form.getValues("credits");
                              form.setValue("credits", [
                                ...currentCredits,
                                {
                                  type: "",
                                  amount: formatCurrency(
                                    0,
                                    form.watch("country"),
                                  ),
                                },
                              ]);
                            }}
                            onRemove={(index) => {
                              const currentCredits = form.getValues("credits");
                              form.setValue(
                                "credits",
                                currentCredits.filter((_, i) => i !== index),
                              );
                            }}
                            onChange={(index, fieldName, value) => {
                              const currentCredits = form.getValues("credits");
                              const updatedCredits = [...currentCredits];
                              if (fieldName === "amount") {
                                const parsed = parseCurrencyInput(value);
                                value = formatCurrency(
                                  parsed,
                                  form.watch("country"),
                                );
                              }
                              updatedCredits[index] = {
                                ...updatedCredits[index],
                                [fieldName]: value,
                              };
                              form.setValue("credits", updatedCredits);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              aria-label="Calculate tax based on provided information"
            >
              Calculate Tax
            </Button>

            <p className="text-sm text-muted-foreground mt-4">
              * All calculations are estimates based on projected 2025 tax rates
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
