import {
  Calendar,
  Clock,
  FileText,
  LineChart,
  Lock,
  PieChart,
  TrendingUp,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

interface BenefitTerm {
  term: string;
  definition: string;
  relatedTerms?: string[];
  learnMoreUrl?: string;
}

interface BenefitStat {
  value: string;
  label: string;
  trend?: "up" | "down" | "neutral";
  change?: string;
  timeframe?: "daily" | "weekly" | "monthly" | "yearly" | "once";
  baselineValue?: string;
  sourceInfo?: string;
  highlight?: boolean;
}

interface BenefitFeature {
  name: string;
  description?: string;
  status: "available" | "beta" | "coming-soon";
  requiresPlan?: "free" | "pro" | "enterprise";
}

interface Benefit {
  Icon: LucideIcon;
  title: string;
  description: string;
  category: "automation" | "analytics" | "planning" | "security";
  subCategory:
    | "transactions"
    | "budgeting"
    | "taxes"
    | "investments"
    | "savings";
  highlight?: boolean;
  stats?: BenefitStat[];
  terms: BenefitTerm[];
  features: BenefitFeature[];
  comingSoon?: boolean;
  priority: number;
  demoUrl?: string;
  setupComplexity: "simple" | "moderate" | "advanced";
  integrations?: string[];
}

const benefits: Benefit[] = [
  {
    title: "Save Hours Every Month",
    description:
      "Save an average of 20 hours per month by automating your expense tracking and financial management.",
    Icon: Clock,
    category: "automation",
    subCategory: "transactions",
    setupComplexity: "simple",
    priority: 1,
    highlight: true,
    stats: [
      {
        value: "20h",
        label: "saved/month",
        timeframe: "monthly",
        sourceInfo: "Based on user survey Q1/2025",
        highlight: true,
      },
    ],
    features: [
      {
        name: "Automatic Categorization",
        status: "available",
        description: "Intelligently categorize every transaction instantly",
      },
      {
        name: "Bill Scanning",
        status: "available",
        description: "Scan and process bills automatically with AI",
      },
    ],
    terms: [
      {
        term: "automation",
        definition:
          "The system automatically processes and categorizes transactions without manual input.",
      },
    ],
  },
  {
    title: "Automated Income & Expense Tracking",
    description:
      "Connect directly to your bank to automatically update and categorize every transaction as it happens.",
    Icon: LineChart,
    category: "automation",
    subCategory: "transactions",
    setupComplexity: "moderate",
    priority: 2,
    features: [
      {
        name: "Bank Connections",
        status: "available",
        description: "Supports 25+ banks (global support coming soon)",
      },
      {
        name: "AI Categorization",
        status: "available",
        description: "Up to 98% accuracy",
      },
    ],
    stats: [
      {
        value: "98%",
        label: "accuracy",
        sourceInfo: "Based on real user data Q1/2025",
      },
    ],
    terms: [
      {
        term: "AI Categorization",
        definition:
          "AI automatically recognizes and categorizes transactions by type.",
      },
    ],
  },
  {
    title: "Smart Budget Recommendations",
    description:
      "AI analyzes your spending patterns and suggests budgets tailored to your habits and goals.",
    Icon: PieChart,
    category: "analytics",
    subCategory: "budgeting",
    setupComplexity: "simple",
    priority: 3,
    features: [
      {
        name: "Spending Forecast",
        status: "available",
        description: "Predicts recurring expenses",
      },
      {
        name: "Financial Goals",
        status: "beta",
        description:
          "Automatically adjusts budgets to help you reach your goals",
      },
    ],
    terms: [
      {
        term: "Spending Forecast",
        definition:
          "Uses AI to analyze spending patterns and predict future expenses.",
      },
    ],
  },
  {
    title: "Smart Bill Reminders",
    description:
      "Never miss a payment with automatic reminders and recurring bill tracking.",
    Icon: Calendar,
    category: "planning",
    subCategory: "budgeting",
    setupComplexity: "simple",
    priority: 4,
    features: [
      {
        name: "Automatic Reminders",
        status: "available",
        description: "Get notified before every payment is due",
      },
      {
        name: "Payment Calendar",
        status: "available",
        description: "View and manage all your bills in one calendar",
      },
    ],
    terms: [
      {
        term: "Automatic Reminders",
        definition:
          "The system sends notifications before payment deadlines so you never miss a bill.",
      },
    ],
  },
  {
    title: "Effortless Tax Filing Support",
    description:
      "Automatically organize and categorize your income and expenses for easy tax filing and compliance.",
    Icon: FileText,
    category: "automation",
    subCategory: "taxes",
    setupComplexity: "moderate",
    priority: 5,
    features: [
      {
        name: "Tax Reports",
        status: "available",
        description: "Automatically generate reports for tax filing",
      },
      {
        name: "AI Tax Advisor",
        status: "coming-soon",
        description: "Get personalized tax optimization tips (Pro only)",
        requiresPlan: "pro",
      },
    ],
    terms: [
      {
        term: "Tax Filing",
        definition:
          "The process of summarizing and reporting your personal income to tax authorities.",
      },
    ],
    integrations: ["IRS", "TurboTax"],
  },
  {
    title: "Bank-Level Financial Security",
    description:
      "Protect your financial data with bank-grade encryption, two-factor authentication, and global security standards.",
    Icon: Lock,
    category: "security",
    subCategory: "transactions",
    setupComplexity: "simple",
    priority: 6,
    features: [
      {
        name: "AES-256 Encryption",
        status: "available",
        description: "Bank-level encryption for all transaction data",
      },
      {
        name: "2FA Authentication",
        status: "available",
        description: "Secure your account with two-factor authentication",
      },
    ],
    stats: [
      {
        value: "100%",
        label: "PCI DSS compliant",
        sourceInfo: "Security certification Q1/2025",
      },
    ],
    terms: [
      {
        term: "AES-256 Encryption",
        definition:
          "Advanced encryption standard to protect your data from unauthorized access.",
      },
    ],
  },
  {
    title: "Intelligent Investment Analytics",
    description:
      "Track and optimize your investment portfolio with AI-powered analytics for smarter decisions.",
    Icon: TrendingUp,
    category: "analytics",
    subCategory: "investments",
    setupComplexity: "moderate",
    priority: 7,
    features: [
      {
        name: "Portfolio Analysis",
        status: "beta",
        description:
          "Real-time performance tracking for your investments (Pro only)",
        requiresPlan: "pro",
      },
      {
        name: "Investment Suggestions",
        status: "coming-soon",
        description:
          "Personalized investment ideas based on your risk profile (Enterprise only)",
        requiresPlan: "enterprise",
      },
    ],
    stats: [
      {
        value: "18%",
        label: "average growth",
        timeframe: "yearly",
        sourceInfo: "Based on user data Q1/2025",
      },
    ],
    terms: [
      {
        term: "Portfolio Analysis",
        definition:
          "AI tools evaluate the performance and risk of your investments.",
      },
    ],
    integrations: ["Vanguard", "Fidelity"],
  },
];

export default benefits;
