import type { TaxBreakdown, TaxCalculationInput } from "../types/tax";

import { FinancialAmount } from "~/finance/shared/utils/financial-precision";

import {
  COUNTRY_SPECIFIC_RULES,
  NON_RESIDENT_TAX_RATES,
  TAX_RULES,
  US_STATE_TAX_RULES,
} from "./tax-rules";

export class TaxCalculator {
  private readonly input: TaxCalculationInput;
  private readonly countryRules = TAX_RULES;
  private readonly specificRules = COUNTRY_SPECIFIC_RULES;
  private readonly nonResidentRates = NON_RESIDENT_TAX_RATES;
  private readonly stateRules = US_STATE_TAX_RULES;

  constructor(input: TaxCalculationInput) {
    this.input = input;
  }

  public calculate(): TaxBreakdown {
    const rules = this.countryRules[this.input.country];
    const specificRules = this.specificRules[this.input.country];
    const totalIncome = new FinancialAmount(this.input.annualIncome)
      .add(new FinancialAmount(this.input.additionalIncome))
      .toNumber();

    // For non-residents, apply flat tax rate for certain countries
    if (this.input.residencyStatus === "non_resident") {
      const nonResidentRate = this.nonResidentRates[this.input.country];
      if (nonResidentRate) {
        // Non-residents often can't claim deductions/credits except specific ones
        const totalDeductions = 0;
        const taxableIncome = totalIncome;
        const totalTax = new FinancialAmount(taxableIncome)
          .multiply(new FinancialAmount(nonResidentRate / 100))
          .toNumber();

        return {
          grossIncome: totalIncome,
          taxableIncome,
          totalTax,
          effectiveRate: (totalTax / totalIncome) * 100,
          brackets: [
            {
              rate: nonResidentRate,
              income: taxableIncome,
              tax: totalTax,
            },
          ],
          deductions: [],
          credits: [],
          totalDeductions,
        };
      }
    }

    // Calculate insurance deductions
    const insuranceDeductions = this.calculateInsuranceDeductions(
      totalIncome,
      specificRules,
    );

    // Calculate family deductions
    const familyDeductions = this.calculateFamilyDeductions(specificRules);

    // Calculate total deductions
    const standardDeduction = rules.standardDeduction[this.input.filingStatus];
    const itemizedDeductions = this.input.deductions.reduce(
      (sum, d) => sum + d.amount,
      0,
    );
    const totalDeductions = new FinancialAmount(standardDeduction)
      .add(new FinancialAmount(itemizedDeductions))
      .add(new FinancialAmount(insuranceDeductions.total))
      .add(new FinancialAmount(familyDeductions.total))
      .toNumber();

    // Calculate taxable income
    const taxableIncome = Math.max(0, totalIncome - totalDeductions);

    // Calculate federal tax by brackets
    const bracketTax = this.calculateBracketTax(taxableIncome, rules.brackets);

    // Calculate state tax if applicable
    let stateTaxResult;
    if (
      this.input.country === "US" &&
      this.input.state &&
      this.input.residencyStatus === "resident"
    ) {
      const stateRules = this.stateRules[this.input.state];
      if (stateRules) {
        const stateTax = this.calculateBracketTax(
          taxableIncome,
          stateRules.brackets,
        );
        stateTaxResult = {
          state: this.input.state,
          amount: stateTax.total,
          brackets: stateTax.brackets,
        };
      }
    }

    // Apply credits
    const totalCredits = this.input.credits.reduce(
      (sum, c) => sum + c.amount,
      0,
    );
    const totalTax = new FinancialAmount(bracketTax.total)
      .add(new FinancialAmount(stateTaxResult?.amount || 0))
      .subtract(new FinancialAmount(totalCredits))
      .toNumber();

    return {
      grossIncome: totalIncome,
      taxableIncome,
      totalTax,
      effectiveRate: (totalTax / totalIncome) * 100,
      brackets: bracketTax.brackets,
      deductions: [
        { type: "standard", amount: standardDeduction },
        ...this.input.deductions,
        ...insuranceDeductions.details,
        ...familyDeductions.details,
      ],
      credits: this.input.credits,
      insuranceDeductions: insuranceDeductions.breakdown,
      familyDeductions: familyDeductions.breakdown,
      totalDeductions,
      stateTax: stateTaxResult,
    };
  }

  private calculateBracketTax(
    income: number,
    brackets: (typeof TAX_RULES)[keyof typeof TAX_RULES]["brackets"],
  ) {
    let remainingIncome = income;
    let total = 0;
    const bracketResults = [];

    for (const bracket of brackets) {
      const bracketSize =
        bracket.max === null
          ? remainingIncome
          : Math.min(bracket.max - bracket.min + 1, remainingIncome);

      if (bracketSize <= 0) break;

      const tax = new FinancialAmount(bracketSize)
        .multiply(new FinancialAmount(bracket.rate))
        .toNumber();

      bracketResults.push({
        rate: bracket.rate * 100,
        income: bracketSize,
        tax,
      });

      total += tax;
      remainingIncome -= bracketSize;

      if (remainingIncome <= 0) break;
    }

    return { total, brackets: bracketResults };
  }

  private calculateInsuranceDeductions(
    income: number,
    rules: (typeof COUNTRY_SPECIFIC_RULES)[keyof typeof COUNTRY_SPECIFIC_RULES],
  ) {
    const details = [];
    const breakdown = {
      socialInsurance: 0,
      healthInsurance: 0,
      unemploymentInsurance: 0,
    };
    let total = 0;

    if (rules.socialInsuranceRate) {
      const base = rules.maxSocialInsuranceSalary
        ? Math.min(income, rules.maxSocialInsuranceSalary)
        : income;
      const amount = new FinancialAmount(base)
        .multiply(new FinancialAmount(rules.socialInsuranceRate / 100))
        .toNumber();
      details.push({ type: "social_insurance", amount });
      breakdown.socialInsurance = amount;
      total += amount;
    }

    if (rules.healthInsuranceRate) {
      const base = rules.maxHealthInsuranceSalary
        ? Math.min(income, rules.maxHealthInsuranceSalary)
        : income;
      const amount = new FinancialAmount(base)
        .multiply(new FinancialAmount(rules.healthInsuranceRate / 100))
        .toNumber();
      details.push({ type: "health_insurance", amount });
      breakdown.healthInsurance = amount;
      total += amount;
    }

    if (rules.unemploymentInsuranceRate) {
      const base = rules.maxUnemploymentInsuranceSalary
        ? Math.min(income, rules.maxUnemploymentInsuranceSalary)
        : income;
      const amount = new FinancialAmount(base)
        .multiply(new FinancialAmount(rules.unemploymentInsuranceRate / 100))
        .toNumber();
      details.push({ type: "unemployment_insurance", amount });
      breakdown.unemploymentInsurance = amount;
      total += amount;
    }

    return { total, details, breakdown };
  }

  private calculateFamilyDeductions(
    rules: (typeof COUNTRY_SPECIFIC_RULES)[keyof typeof COUNTRY_SPECIFIC_RULES],
  ) {
    const details = [];
    let total = 0;

    // Personal deduction
    const personalDeduction =
      this.input.familyDeduction?.personalDeduction ??
      rules.personalDeduction ??
      0;
    if (personalDeduction > 0) {
      details.push({ type: "personal_deduction", amount: personalDeduction });
      total += personalDeduction;
    }

    // Dependent deductions
    const dependentCount = this.input.familyDeduction?.dependentCount ?? 0;
    const dependentDeductionPerPerson =
      this.input.familyDeduction?.dependentDeductionPerPerson ??
      rules.dependentDeduction ??
      0;
    if (dependentCount > 0 && dependentDeductionPerPerson > 0) {
      const amount = dependentCount * dependentDeductionPerPerson;
      details.push({ type: "dependent_deduction", amount });
      total += amount;
    }

    return {
      total,
      details,
      breakdown: {
        personalDeduction,
        dependentCount,
        dependentDeductionPerPerson,
      },
    };
  }
}
