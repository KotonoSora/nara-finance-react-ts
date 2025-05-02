import type { CountrySpecificRules, CountryTaxRules } from "../types/tax";

export const TAX_RULES: Record<string, CountryTaxRules> = {
  US: {
    year: 2025,
    standardDeduction: {
      single: 14600,
      married: 29200,
      head_of_household: 21900,
    },
    brackets: [
      { min: 0, max: 11925, rate: 0.1 },
      { min: 11926, max: 48475, rate: 0.12 },
      { min: 48476, max: 103350, rate: 0.22 },
      { min: 103351, max: 197300, rate: 0.24 },
      { min: 197301, max: 250525, rate: 0.32 },
      { min: 250526, max: 626350, rate: 0.35 },
      { min: 626351, max: null, rate: 0.37 },
    ],
  },
  UK: {
    year: 2025,
    standardDeduction: {
      single: 12570,
      married: 12570,
      head_of_household: 12570,
    },
    brackets: [
      { min: 0, max: 12570, rate: 0 },
      { min: 12571, max: 50270, rate: 0.2 },
      { min: 50271, max: 125140, rate: 0.4 },
      { min: 125141, max: null, rate: 0.45 },
    ],
  },
  CA: {
    year: 2025,
    standardDeduction: {
      single: 15705,
      married: 15705,
      head_of_household: 15705,
    },
    brackets: [
      { min: 0, max: 55867, rate: 0.15 },
      { min: 55868, max: 111733, rate: 0.205 },
      { min: 111734, max: 173205, rate: 0.26 },
      { min: 173206, max: 246752, rate: 0.29 },
      { min: 246753, max: null, rate: 0.33 },
    ],
  },
  JP: {
    year: 2025,
    standardDeduction: {
      single: 480000,
      married: 480000,
      head_of_household: 480000,
    },
    brackets: [
      { min: 0, max: 1950000, rate: 0.05 },
      { min: 1950001, max: 3300000, rate: 0.1 },
      { min: 3300001, max: 6950000, rate: 0.2 },
      { min: 6950001, max: 9000000, rate: 0.23 },
      { min: 9000001, max: 18000000, rate: 0.33 },
      { min: 18000001, max: 40000000, rate: 0.4 },
      { min: 40000001, max: null, rate: 0.45 },
    ],
  },
  KR: {
    year: 2025,
    standardDeduction: {
      single: 1500000,
      married: 1500000,
      head_of_household: 1500000,
    },
    brackets: [
      { min: 0, max: 12000000, rate: 0.06 },
      { min: 12000001, max: 46000000, rate: 0.15 },
      { min: 46000001, max: 88000000, rate: 0.24 },
      { min: 88000001, max: 150000000, rate: 0.35 },
      { min: 150000001, max: 300000000, rate: 0.38 },
      { min: 300000001, max: 500000000, rate: 0.4 },
      { min: 500000001, max: null, rate: 0.45 },
    ],
  },
  VN: {
    year: 2025,
    standardDeduction: {
      single: 11000000,
      married: 11000000,
      head_of_household: 11000000,
    },
    brackets: [
      { min: 0, max: 60000000, rate: 0.05 },
      { min: 60000001, max: 120000000, rate: 0.1 },
      { min: 120000001, max: 216000000, rate: 0.15 },
      { min: 216000001, max: 384000000, rate: 0.2 },
      { min: 384000001, max: 624000000, rate: 0.25 },
      { min: 624000001, max: 960000000, rate: 0.3 },
      { min: 960000001, max: null, rate: 0.35 },
    ],
  },
  SG: {
    year: 2025,
    standardDeduction: {
      single: 20000,
      married: 20000,
      head_of_household: 20000,
    },
    brackets: [
      { min: 0, max: 20000, rate: 0 },
      { min: 20001, max: 30000, rate: 0.02 },
      { min: 30001, max: 40000, rate: 0.035 },
      { min: 40001, max: 80000, rate: 0.07 },
      { min: 80001, max: 120000, rate: 0.115 },
      { min: 120001, max: 160000, rate: 0.15 },
      { min: 160001, max: 200000, rate: 0.18 },
      { min: 200001, max: 240000, rate: 0.19 },
      { min: 240001, max: 280000, rate: 0.195 },
      { min: 280001, max: 320000, rate: 0.2 },
      { min: 320001, max: 500000, rate: 0.22 },
      { min: 500001, max: 1000000, rate: 0.23 },
      { min: 1000001, max: null, rate: 0.24 },
    ],
  },
};

export const US_STATE_TAX_RULES = {
  CA: {
    // California
    brackets: [
      { min: 0, max: 10099, rate: 0.01 },
      { min: 10100, max: 23942, rate: 0.02 },
      { min: 23943, max: 37788, rate: 0.04 },
      { min: 37789, max: 52455, rate: 0.06 },
      { min: 52456, max: 66295, rate: 0.08 },
      { min: 66296, max: 338639, rate: 0.093 },
      { min: 338640, max: 406364, rate: 0.103 },
      { min: 406365, max: 677275, rate: 0.113 },
      { min: 677276, max: null, rate: 0.123 },
    ],
  },
  NY: {
    // New York
    brackets: [
      { min: 0, max: 8500, rate: 0.04 },
      { min: 8501, max: 11700, rate: 0.045 },
      { min: 11701, max: 13900, rate: 0.0525 },
      { min: 13901, max: 80650, rate: 0.055 },
      { min: 80651, max: 215400, rate: 0.06 },
      { min: 215401, max: 1077550, rate: 0.0685 },
      { min: 1077551, max: null, rate: 0.0965 },
    ],
  },
  // Add more states as needed
};

export const NON_RESIDENT_TAX_RATES: Record<string, number> = {
  VN: 20, // Vietnam flat rate for non-residents
  SG: 22, // Singapore non-resident rate
  US: 30, // US withholding rate for non-residents
  UK: 45, // UK non-resident rate
  CA: 25, // Canada non-resident withholding rate
  JP: 20.42, // Japan non-resident rate
  KR: 19, // Korea non-resident rate
};

export const COUNTRY_SPECIFIC_RULES: Record<string, CountrySpecificRules> = {
  US: {
    // FICA taxes
    socialInsuranceRate: 6.2, // Social Security
    maxSocialInsuranceSalary: 168600, // 2025 projection
    healthInsuranceRate: 1.45, // Medicare
  },
  UK: {
    // National Insurance Contributions (NICs)
    socialInsuranceRate: 8,
    maxSocialInsuranceSalary: 50270,
    healthInsuranceRate: 2,
  },
  CA: {
    // CPP and EI
    socialInsuranceRate: 5.95,
    maxSocialInsuranceSalary: 65400,
    healthInsuranceRate: 1.66,
    maxHealthInsuranceSalary: 63200,
  },
  JP: {
    socialInsuranceRate: 9.15,
    healthInsuranceRate: 5,
    maxSocialInsuranceSalary: 650000 * 12, // Monthly cap * 12
    maxHealthInsuranceSalary: 1390000 * 12,
    personalDeduction: 380000,
    dependentDeduction: 380000,
  },
  KR: {
    socialInsuranceRate: 4.5,
    healthInsuranceRate: 3.545,
    unemploymentInsuranceRate: 0.9,
    personalDeduction: 1500000,
    dependentDeduction: 1500000,
  },
  VN: {
    socialInsuranceRate: 8,
    healthInsuranceRate: 1.5,
    unemploymentInsuranceRate: 1,
    maxSocialInsuranceSalary: 46800000,
    personalDeduction: 11000000, // Updated 2025 personal deduction
    dependentDeduction: 4400000, // Updated 2025 dependent deduction
  },
  SG: {
    // CPF contributions
    socialInsuranceRate: 20,
    maxSocialInsuranceSalary: 6000 * 12, // Monthly cap * 12
    personalDeduction: 8000,
    dependentDeduction: 4000,
  },
};
