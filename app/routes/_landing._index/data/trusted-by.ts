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
    description: "Top 10 Ứng dụng Tài chính Cá nhân 2025",
  },
  {
    name: "Vietcetera",
    logo: undefined,
    type: "press",
    link: "https://vietcetera.com",
    description: "Startup Việt Triển Vọng 2025",
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
    description: "Chứng nhận Bảo mật Thông tin",
  },
  {
    name: "PCI DSS",
    logo: undefined,
    type: "certificate",
    description: "Tiêu chuẩn Bảo mật Thanh toán",
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
    description: "Mã hóa 256-bit",
  },
];

export default trustedBy;
