export type FilingStatus = "single" | "married" | "head_of_household";

export type ResidencyStatus = "resident" | "non_resident";

export type Country = "US" | "UK" | "CA" | "JP" | "KR" | "VN" | "SG";

export type USState = "CA" | "NY" | null;

export interface TaxBreakdown {
  grossIncome: number;
  taxableIncome: number;
  totalTax: number;
  effectiveRate: number;
  brackets: Array<{
    rate: number;
    income: number;
    tax: number;
  }>;
  deductions: Array<{
    type: string;
    amount: number;
  }>;
  credits: Array<{
    type: string;
    amount: number;
  }>;
  insuranceDeductions?: {
    socialInsurance: number;
    healthInsurance: number;
    unemploymentInsurance: number;
  };
  familyDeductions?: {
    personalDeduction: number;
    dependentCount: number;
    dependentDeductionPerPerson: number;
  };
  totalDeductions: number;
  stateTax?: {
    state: USState;
    amount: number;
    brackets: Array<{
      rate: number;
      income: number;
      tax: number;
    }>;
  };
}

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export interface CountryTaxRules {
  year: number;
  standardDeduction: Record<FilingStatus, number>;
  brackets: TaxBracket[];
}

export interface CountrySpecificRules {
  maxSocialInsuranceSalary?: number;
  maxHealthInsuranceSalary?: number;
  maxUnemploymentInsuranceSalary?: number;
  socialInsuranceRate?: number;
  healthInsuranceRate?: number;
  unemploymentInsuranceRate?: number;
  personalDeduction?: number;
  dependentDeduction?: number;
}

export interface TaxCalculationInput {
  country: Country;
  filingStatus: FilingStatus;
  residencyStatus: ResidencyStatus;
  state?: USState;
  annualIncome: number;
  additionalIncome: number;
  deductions: Array<{
    type: string;
    amount: number;
  }>;
  credits: Array<{
    type: string;
    amount: number;
  }>;
  familyDeduction?: {
    personalDeduction?: number;
    dependentCount?: number;
    dependentDeductionPerPerson?: number;
  };
  insuranceDeduction?: {
    socialInsurance?: number;
    healthInsurance?: number;
    unemploymentInsurance?: number;
  };
}
