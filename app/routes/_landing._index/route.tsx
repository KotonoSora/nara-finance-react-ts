import { Suspense } from "react";

import type { Route } from "./+types/route";

import BenefitsSection from "./components/benefits";
import CTASection from "./components/cta";
import FAQSection from "./components/faq";
import FooterSection from "./components/footer";
import Header from "./components/header";
import HeroSection from "./components/hero";
import SocialProofSection from "./components/social-proof";
import TrustSection from "./components/trust";
import faqs from "./data/faqs";

export function meta({}: Route.MetaArgs) {
  const title = "MoneyFlow - Quản lý tài chính cá nhân thông minh với AI";
  const description =
    "Quản lý dòng tiền dễ dàng với công cụ AI: theo dõi giao dịch tự động, lập ngân sách thông minh, tối ưu tiết kiệm 20%, và quyết toán thuế chính xác. Dùng thử miễn phí ngay hôm nay!";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return [
    { title },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "tài chính cá nhân, quản lý dòng tiền, lập ngân sách, tiết kiệm, AI tài chính, quản lý chi tiêu",
    },
    // Open Graph tags
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    {
      property: "og:image",
      content: "https://moneyflow.app/assets/og-image.jpg",
    },
    { property: "og:url", content: "https://moneyflow.app" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: "https://moneyflow.app/assets/twitter-card.jpg",
    },
    // Schema.org JSON-LD
    {
      tagName: "script",
      type: "application/ld+json",
      children: JSON.stringify(jsonLd),
    },
  ];
}

export default function LandingPage({}: Route.ComponentProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Suspense
        fallback={
          <div className="flex justify-center py-16 text-muted-foreground">
            Đang tải...
          </div>
        }
      >
        <Header />
        <HeroSection />
        <BenefitsSection />
        <SocialProofSection />
        <TrustSection />
        <CTASection />
        <FAQSection />
        <FooterSection />
      </Suspense>
    </main>
  );
}
