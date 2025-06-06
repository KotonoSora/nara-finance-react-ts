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
    APP_COMPANY_NAME: companyName,
    APP_COMPANY_ADDRESS: companyAddress,
    APP_COMPANY_PHONE: companyPhone,
    APP_COMPANY_EMAIL: companyEmail,
    APP_COMPANY_TAX_ID: companyTaxId,
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
    companyInformation: {
      name: companyName,
      address: companyAddress,
      phone: companyPhone,
      email: companyEmail,
      taxId: companyTaxId,
    },
  };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [];
  }

  const { name, description, slogan, domain, title, version, keywords } = data;
  const customTitle = `${name} | ${title} | ${slogan} | ${version}`;
  const baseUrl = `https://${domain}`;

  return [
    { title: customTitle },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    // Basic SEO
    { name: "robots", content: "index, follow" },
    { name: "author", content: name },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    // Open Graph tags
    { property: "og:title", content: customTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: baseUrl },
    { property: "og:image", content: `${baseUrl}/assets/og-image.jpg` },
    { property: "og:site_name", content: name },
    { property: "og:locale", content: "en_US" },
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: customTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: `${baseUrl}/assets/og-image.jpg` },
    // Theme colors
    {
      name: "theme-color",
      content: "hsl(0 0% 100%)",
      media: "(prefers-color-scheme: light)",
    },
    {
      name: "theme-color",
      content: "hsl(240 10% 3.9%)",
      media: "(prefers-color-scheme: dark)",
    },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    { name: "apple-mobile-web-app-title", content: name },
  ];
}

export default function LandingPage({ loaderData }: Route.ComponentProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen text-muted-foreground">
            Loading...
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
