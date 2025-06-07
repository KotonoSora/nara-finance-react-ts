interface FAQ {
  question: string;
  answer: string;
  category: "pricing" | "security" | "features" | "getting-started";
  helpful?: number;
  relatedLinks?: {
    text: string;
    url: string;
  }[];
  updatedAt?: string;
}

const faqs: FAQ[] = [
  // Pricing
  {
    question: "Is {{APP_NAME}} free?",
    answer:
      "Yes, we offer a 14-day free trial with no credit card required! After that, you can choose the Basic (free) plan or upgrade to Pro (from $2/month) depending on your needs.",
    category: "pricing",
    helpful: 245,
    relatedLinks: [
      {
        text: "Compare plans",
        url: "/pricing",
      },
      {
        text: "Refund policy",
        url: "/refund-policy",
      },
    ],
    updatedAt: "2025-04-01",
  },
  {
    question: "Can I upgrade or cancel my plan at any time?",
    answer:
      "Absolutely! You can upgrade, downgrade, or cancel your plan anytime from your account settings. Changes take effect immediately, and you'll receive a prorated refund for any unused Pro time if you cancel.",
    category: "pricing",
    helpful: 180,
    relatedLinks: [
      {
        text: "Manage subscription",
        url: "/account/subscription",
      },
      {
        text: "Refund policy",
        url: "/refund-policy",
      },
    ],
    updatedAt: "2025-05-12",
  },

  // Security
  {
    question: "Is my data safe?",
    answer:
      "We use bank-grade encryption (AES-256), two-factor authentication, and comply with international security standards like ISO 27001 and PCI DSS. Your data is securely stored on servers located in Vietnam.",
    category: "security",
    helpful: 389,
    relatedLinks: [
      {
        text: "Privacy policy",
        url: "/privacy",
      },
      {
        text: "Security center",
        url: "/security",
      },
    ],
    updatedAt: "2025-04-15",
  },
  {
    question: "How do I enable two-factor authentication (2FA)?",
    answer:
      "You can enable 2FA in the security settings of your account. Just follow the instructions to link it with an authentication app (like Google Authenticator) or your phone number. This adds an extra layer of security to your account.",
    category: "security",
    helpful: 120,
    relatedLinks: [
      {
        text: "2FA setup guide",
        url: "/security/2fa-guide",
      },
      {
        text: "Security center",
        url: "/security",
      },
    ],
    updatedAt: "2025-05-10",
  },

  // Features
  {
    question: "Do I need to know finance?",
    answer:
      "Not at all, {{APP_NAME}} is designed to be simple for everyone. Our AI automatically analyzes and provides suggestions based on your level. You just need to monitor your transactions and follow the guidance.",
    category: "features",
    helpful: 156,
    relatedLinks: [
      {
        text: "User guide",
        url: "/guides",
      },
      {
        text: "Tutorial videos",
        url: "/tutorials",
      },
    ],
    updatedAt: "2025-03-28",
  },
  {
    question: "Does it support real tax finalization?",
    answer:
      "{{APP_NAME}} integrates directly with the General Department of Taxation's system. We automatically classify income and expenses according to personal income tax regulations, making it easy for you to declare and finalize your tax at the end of the year. The system is regularly updated according to the latest regulations.",
    category: "features",
    helpful: 234,
    relatedLinks: [
      {
        text: "Tax finalization guide",
        url: "/tax-guide",
      },
    ],
    updatedAt: "2025-05-10",
  },
  {
    question: "How does the budgeting feature work?",
    answer:
      "Our AI analyzes your spending habits and suggests a personalized budget based on your income, fixed expenses, and financial goals. You can adjust the budget at any time, and the system will alert you if you overspend.",
    category: "features",
    helpful: 190,
    relatedLinks: [
      {
        text: "Budgeting guide",
        url: "/budgeting-guide",
      },
      {
        text: "Features for beginners",
        url: "/features/beginners",
      },
    ],
    updatedAt: "2025-05-11",
  },

  // Getting Started
  {
    question: "How long does it take to get started?",
    answer:
      "Only 5 minutes to set up and start managing your finances! The simple process: (1) Sign up for an account, (2) Connect your bank or e-wallet (optional), (3) Set your financial goals. Our AI will automatically track and analyze your transactions.",
    category: "getting-started",
    helpful: 423,
    relatedLinks: [
      {
        text: "Supported banks",
        url: "/supported-banks",
      },
      {
        text: "Connection guide",
        url: "/connect",
      },
    ],
    updatedAt: "2025-04-10",
  },
  {
    question: "Do I need to connect my bank account?",
    answer:
      "Connecting your bank account is optional, but it helps automate expense tracking. We support secure connections with over 25 banks in Vietnam. You can also manually enter transactions or scan receipts.",
    category: "getting-started",
    helpful: 156,
    relatedLinks: [
      {
        text: "List of supported banks",
        url: "/supported-banks",
      },
      {
        text: "Bank connection guide",
        url: "/connect-bank",
      },
    ],
    updatedAt: "2025-05-01",
  },
  {
    question: "Do I need accounting skills to use the app?",
    answer:
      "No! {{APP_NAME}} is designed to be easy for everyone, with no accounting knowledge required. Our AI automatically handles and categorizes transactions. With an intuitive interface and detailed guidance, you can start managing your finances effectively right away.",
    category: "getting-started",
    helpful: 198,
    relatedLinks: [
      {
        text: "User tutorial videos",
        url: "/tutorials",
      },
      {
        text: "Features for beginners",
        url: "/features/beginners",
      },
    ],
    updatedAt: "2025-05-11",
  },
  {
    question: "Can I use {{APP_NAME}} on multiple devices?",
    answer:
      "Yes, {{APP_NAME}} supports data synchronization across multiple devices, including phones, tablets, and web browsers. Just log in with the same account to access your financial data anytime, anywhere.",
    category: "getting-started",
    helpful: 142,
    relatedLinks: [
      {
        text: "Download the app",
        url: "/download",
      },
      {
        text: "Sync guide",
        url: "/sync-guide",
      },
    ],
    updatedAt: "2025-05-12",
  },
];

export default faqs;
