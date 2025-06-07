interface TrustedEntity {
  name: string;
  logo?: string;
  type: "press" | "platform" | "certificate";
  rating?: {
    score: number;
    total: number;
    count: number;
  };
  link?: string;
  description?: string;
}

const trustedBy: TrustedEntity[] = [
  // Press Coverage
  {
    name: "TechInAsia",
    logo: undefined,
    type: "press",
    link: "https://techinasia.com",
    description: "Best Fintech Apps 2025",
  },
  {
    name: "ProductHunt",
    logo: undefined,
    type: "press",
    link: "https://producthunt.com",
    rating: {
      score: 4.8,
      total: 5,
      count: 258,
    },
  },
  {
    name: "CafeF",
    logo: undefined,
    type: "press",
    link: "https://cafef.vn",
    description: "Top 10 Personal Finance Apps 2025",
  },
  {
    name: "Vietcetera",
    logo: undefined,
    type: "press",
    link: "https://vietcetera.com",
    description: "Top Vietnamese Startups to Watch 2025",
  },

  // App Platforms
  {
    name: "App Store",
    logo: undefined,
    type: "platform",
    rating: {
      score: 4.9,
      total: 5,
      count: 2145,
    },
    link: "https://apps.apple.com/app/{{APP_NAME}}",
  },
  {
    name: "Google Play",
    logo: undefined,
    type: "platform",
    rating: {
      score: 4.8,
      total: 5,
      count: 3267,
    },
    link: "https://play.google.com/store/apps/details?id={{APP_NAME}}",
  },

  // Certificates
  {
    name: "ISO 27001",
    logo: undefined,
    type: "certificate",
    description: "Certified Information Security Management",
  },
  {
    name: "PCI DSS",
    logo: undefined,
    type: "certificate",
    description: "Payment Security Standard Compliant",
  },
  {
    name: "DMCA",
    logo: undefined,
    type: "certificate",
    link: "https://www.dmca.com/r/verified",
  },
  {
    name: "SSL Secure",
    logo: undefined,
    type: "certificate",
    description: "256-bit Encryption Enabled",
  },
];

export default trustedBy;
