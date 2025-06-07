import { Suspense } from "react";

import type { Route } from "./+types/route";

import FooterSection from "../_landing._index/components/footer";
import { LandingContextProvider } from "../_landing._index/context/landing-context";
import BreadcrumbNavigation from "./components/breadcrumb-navigation";
import ContentArea from "./components/content-area";
import Header from "./components/header";
import MobileNavigation from "./components/mobile-navigation";
import ScrollToTop from "./components/scroll-to-top";
import TermsNavigation from "./components/terms-navigation";

export function loader({ context }: Route.LoaderArgs) {
  // Reuse the same environment variables as the landing page
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
    lastUpdated: "June 7, 2025", // Current date
  };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [];
  }

  const { name, description, domain } = data;
  const title = `Terms of Service | ${name}`;
  const metaDescription = `Read the Terms of Service for ${name}. Understand your rights and responsibilities when using our personal finance management platform.`;
  const baseUrl = `https://${domain}`;

  return [
    { title },
    { name: "description", content: metaDescription },
    {
      name: "keywords",
      content:
        "terms of service, legal, privacy, finance, personal finance management",
    },
    // Basic SEO
    { name: "robots", content: "index, follow" },
    { name: "author", content: name },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    // Open Graph tags
    { property: "og:title", content: title },
    { property: "og:description", content: metaDescription },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${baseUrl}/terms` },
    { property: "og:image", content: `${baseUrl}/assets/og-image.jpg` },
    { property: "og:site_name", content: name },
    { property: "og:locale", content: "en_US" },
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: metaDescription },
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
  ];
}

export default function TermsOfService({ loaderData }: Route.ComponentProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen text-muted-foreground">
            Loading Terms of Service...
          </div>
        }
      >
        <LandingContextProvider value={loaderData}>
          <Header lastUpdated={loaderData.lastUpdated} />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <BreadcrumbNavigation />

            <div className="flex flex-col lg:flex-row gap-8 mt-6">
              {/* Desktop Sidebar TOC */}
              <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0">
                <TermsNavigation />
              </aside>

              {/* Mobile Navigation */}
              <div className="lg:hidden">
                <MobileNavigation />
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <ContentArea />
              </div>
            </div>
          </div>

          <ScrollToTop />
          <FooterSection />
        </LandingContextProvider>
      </Suspense>
    </main>
  );
}
