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
import { LandingContextProvider } from "./context/landing-context";

export function loader({ context }: Route.LoaderArgs) {
  const {
    APP_NAME: name,
    APP_DESCRIPTION: description,
    APP_SLOGAN: slogan,
    APP_DOMAIN: domain,
    APP_TITLE: title,
    APP_VERSION: version,
    APP_KEYWORDS: keywords,
    APP_COPYRIGHT_TIME: copyrightTime,
    APP_COMPANY_INFORMATION: companyInformation,
  } = context.cloudflare.env;

  return {
    name,
    description,
    slogan,
    domain,
    title,
    version,
    keywords,
    copyrightTime,
    companyInformation,
  };
}

export function meta({ data }: Route.MetaArgs) {
  const { name, description, slogan, domain, title, version, keywords } = data;
  const customTitle = `${name} | ${title} | ${slogan} | ${version}`;
  const baseUrl = `https://${domain}`;

  return [
    { title: customTitle },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    // Open Graph tags
    { property: "og:title", content: customTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    {
      property: "og:image",
      content: `${baseUrl}/assets/og-image.jpg`,
    },
    { property: "og:url", content: baseUrl },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: customTitle },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: `${baseUrl}/assets/twitter-card.jpg`,
    },
  ];
}

export default function LandingPage({ loaderData }: Route.ComponentProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Suspense
        fallback={
          <div className="flex justify-center py-16 text-muted-foreground">
            Đang tải...
          </div>
        }
      >
        <LandingContextProvider value={loaderData}>
          <Header />
          <HeroSection />
          <BenefitsSection />
          <SocialProofSection />
          <TrustSection />
          <CTASection />
          <FAQSection />
          <FooterSection />
        </LandingContextProvider>
      </Suspense>
    </main>
  );
}
