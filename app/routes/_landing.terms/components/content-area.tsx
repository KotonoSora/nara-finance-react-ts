import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Separator } from "~/components/ui/separator";

import { useLandingContext } from "../../_landing._index/context/landing-context";
import CalloutBox from "./callout-box";

export default function ContentArea() {
  const { name, companyInformation } = useLandingContext();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    overview: true,
    // Other sections start collapsed on mobile for better UX
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Introduction Section */}
      <section id="overview" className="mb-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to {name}. These Terms of Service govern your use of our
            personal finance management platform. By accessing or using our
            services, you agree to be bound by these terms.
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-base leading-relaxed text-foreground mb-6">
            <strong>Effective Date:</strong> June 7, 2025
          </p>

          <p className="text-base leading-relaxed text-muted-foreground mb-6">
            These terms apply to all users of {name}, including visitors,
            registered users, and premium subscribers. Please read these terms
            carefully before using our services.
          </p>

          <CalloutBox type="info" title="Quick Overview">
            <p>
              {name} is a personal finance management platform that helps you
              track expenses, manage budgets, and calculate taxes. We prioritize
              your financial data security and privacy.
            </p>
          </CalloutBox>
        </div>
      </section>
      <Separator className="my-8" /> {/* Account Terms Section */}
      <section id="account-terms" className="mb-12">
        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                1. Account Terms
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection("account-terms")}
                className="md:hidden"
              >
                {expandedSections["account-terms"] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          <Collapsible
            open={expandedSections["account-terms"] ?? true}
            onOpenChange={() => toggleSection("account-terms")}
          >
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div id="user-accounts" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    User Accounts
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      To access certain features of {name}, you must create an
                      account. You are responsible for maintaining the
                      confidentiality of your account credentials and for all
                      activities that occur under your account.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        You must provide accurate and complete information when
                        creating your account
                      </li>
                      <li>
                        You must be at least 18 years old to create an account
                      </li>
                      <li>
                        You are responsible for keeping your login credentials
                        secure
                      </li>{" "}
                      <li>
                        You must notify us immediately of any unauthorized
                        access to your account
                      </li>
                      <li>One person or legal entity per account</li>
                      <li>
                        We reserve the right to refuse service or terminate
                        accounts that violate these terms
                      </li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div id="account-security" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Account Security
                  </h3>
                  <CalloutBox type="security" title="Security Requirements">
                    <p>
                      Your account security is critical when handling financial
                      data. We require:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>
                        Strong passwords (minimum 8 characters with mixed case,
                        numbers, and symbols)
                      </li>
                      <li>Two-factor authentication for premium accounts</li>
                      <li>Regular security reviews of connected accounts</li>
                      <li>
                        Immediate notification of suspected unauthorized access
                      </li>
                    </ul>
                  </CalloutBox>
                </div>

                <Separator />

                <div id="account-termination" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Account Termination
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      You may terminate your account at any time through your
                      account settings. Upon termination:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Your account access will be immediately revoked</li>
                      <li>Your data will be securely deleted within 30 days</li>
                      <li>Any outstanding billing obligations remain due</li>
                      <li>
                        We may retain certain information as required by law
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </section>
      {/* Financial Data Handling Section */}
      <section id="financial-data" className="mb-12">
        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                2. Financial Data Handling
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection("financial-data")}
                className="md:hidden"
              >
                {expandedSections["financial-data"] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          <Collapsible
            open={expandedSections["financial-data"] ?? false}
            onOpenChange={() => toggleSection("financial-data")}
          >
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div id="data-collection" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Data Collection
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      We collect financial data that you voluntarily provide to
                      deliver our services. This includes transaction data,
                      account balances, and budgeting information.
                    </p>
                    <p>
                      We do not sell your financial data to third parties. Your
                      data is used solely to provide and improve our services.
                    </p>
                  </div>
                </div>

                <Separator />

                <div id="data-protection" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Data Protection
                  </h3>
                  <CalloutBox
                    type="important"
                    title="Data Protection Commitment"
                  >
                    <p>
                      Your financial data is protected using industry-standard
                      encryption and security measures. We comply with financial
                      data protection regulations and undergo regular security
                      audits.
                    </p>
                  </CalloutBox>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </section>
      {/* Privacy & Security Section */}
      <section id="privacy-security" className="mb-12">
        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                3. Privacy & Security
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection("privacy-security")}
                className="md:hidden"
              >
                {expandedSections["privacy-security"] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          <Collapsible
            open={expandedSections["privacy-security"] ?? false}
            onOpenChange={() => toggleSection("privacy-security")}
          >
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div id="encryption" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Encryption Standards
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      All data transmission is encrypted using TLS 1.3. Data at
                      rest is encrypted using AES-256 encryption. We use secure
                      key management practices and regular security assessments.
                    </p>
                  </div>
                </div>

                <Separator />

                <div id="access-controls" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Access Controls
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      Access to your data is strictly controlled and limited to
                      authorized personnel for legitimate business purposes
                      only. We maintain detailed access logs and conduct regular
                      access reviews.
                    </p>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </section>{" "}
      {/* Service Usage & Conduct Section */}
      <section id="service-usage" className="mb-12">
        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                4. Service Usage & Conduct
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection("service-usage")}
                className="md:hidden"
              >
                {expandedSections["service-usage"] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          <Collapsible
            open={expandedSections["service-usage"] ?? false}
            onOpenChange={() => toggleSection("service-usage")}
          >
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div id="acceptable-use" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Acceptable Use
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      You agree to use {name} only for lawful purposes and in
                      accordance with these terms. You may not:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Use the service for any unlawful or fraudulent activity
                      </li>
                      <li>
                        Attempt to gain unauthorized access to our systems or
                        other users' accounts
                      </li>
                      <li>
                        Upload or transmit viruses, malware, or other harmful
                        code
                      </li>
                      <li>Interfere with or disrupt the service or servers</li>
                      <li>
                        Reverse engineer, decompile, or disassemble the software
                      </li>
                      <li>
                        Use automated tools to access the service without
                        permission
                      </li>
                      <li>Share your account credentials with others</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div id="prohibited-content" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Prohibited Content
                  </h3>
                  <CalloutBox type="warning" title="Content Restrictions">
                    <p>You may not upload, store, or transmit content that:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Violates any law or regulation</li>
                      <li>Infringes on intellectual property rights</li>
                      <li>Contains harmful or malicious code</li>
                      <li>Is defamatory, abusive, or harassing</li>
                      <li>
                        Contains false or misleading financial information
                      </li>
                    </ul>
                  </CalloutBox>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </section>
      {/* Billing & Payment Section */}
      <section id="billing-payment" className="mb-12">
        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                5. Billing & Payment
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection("billing-payment")}
                className="md:hidden"
              >
                {expandedSections["billing-payment"] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          <Collapsible
            open={expandedSections["billing-payment"] ?? false}
            onOpenChange={() => toggleSection("billing-payment")}
          >
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div id="subscription-plans" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Subscription Plans
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      {name} offers both free and premium subscription plans.
                      Premium features include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Advanced budgeting tools and analytics</li>
                      <li>Multi-country tax calculation support</li>
                      <li>Priority customer support</li>
                      <li>Data export and backup features</li>
                      <li>Enhanced security features</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div id="payment-terms" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Payment Terms
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>For premium subscriptions:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Billing occurs monthly or annually based on your
                        selected plan
                      </li>
                      <li>
                        Payments are processed securely through our payment
                        processor
                      </li>
                      <li>
                        All fees are non-refundable except as required by law
                      </li>
                      <li>You can cancel your subscription at any time</li>
                      <li>
                        Price changes will be communicated 30 days in advance
                      </li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div id="refund-policy" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Refund Policy
                  </h3>
                  <CalloutBox type="info" title="Refund Eligibility">
                    <p>
                      We offer a 14-day money-back guarantee for new premium
                      subscriptions. Refunds are processed to the original
                      payment method within 5-10 business days.
                    </p>
                  </CalloutBox>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </section>
      {/* Intellectual Property Section */}
      <section id="intellectual-property" className="mb-12">
        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                6. Intellectual Property
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection("intellectual-property")}
                className="md:hidden"
              >
                {expandedSections["intellectual-property"] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          <Collapsible
            open={expandedSections["intellectual-property"] ?? false}
            onOpenChange={() => toggleSection("intellectual-property")}
          >
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div id="our-rights" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Our Rights
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      The {name} service, including its software, design,
                      content, and trademarks, is protected by intellectual
                      property laws. We retain all rights, title, and interest
                      in:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>The {name} software and platform</li>
                      <li>Our algorithms and calculation methods</li>
                      <li>Our trademarks, logos, and branding</li>
                      <li>Our documentation and user guides</li>
                      <li>Any improvements or modifications we make</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div id="your-rights" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Your Rights
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      You retain ownership of your financial data and content.
                      By using our service, you grant us a limited license to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Process and store your data to provide our services
                      </li>
                      <li>
                        Use aggregated, anonymized data for service improvement
                      </li>
                      <li>
                        Backup your data for security and disaster recovery
                      </li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div id="dmca-policy" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    DMCA Policy
                  </h3>
                  <CalloutBox type="info" title="Copyright Infringement">
                    <p>
                      We respect intellectual property rights. If you believe
                      content on our platform infringes your copyright, please
                      contact us with:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Description of the copyrighted work</li>
                      <li>Location of the infringing material</li>
                      <li>Your contact information</li>
                      <li>Statement of good faith belief</li>
                    </ul>
                  </CalloutBox>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </section>
      {/* Service Availability Section */}
      <section id="service-availability" className="mb-12">
        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                7. Service Availability
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection("service-availability")}
                className="md:hidden"
              >
                {expandedSections["service-availability"] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          <Collapsible
            open={expandedSections["service-availability"] ?? false}
            onOpenChange={() => toggleSection("service-availability")}
          >
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div id="uptime-commitment" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Uptime Commitment
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      We strive to maintain high service availability but cannot
                      guarantee 100% uptime. Our target uptime is 99.9% monthly,
                      excluding:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Scheduled maintenance (announced in advance)</li>
                      <li>Emergency security updates</li>
                      <li>Third-party service outages beyond our control</li>
                      <li>Force majeure events</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div id="maintenance" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Maintenance
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      We perform regular maintenance to ensure service quality
                      and security. Scheduled maintenance will be announced at
                      least 24 hours in advance through our status page.
                    </p>
                  </div>
                </div>

                <Separator />

                <div id="service-modifications" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Service Modifications
                  </h3>
                  <CalloutBox type="warning" title="Service Changes">
                    <p>
                      We may modify, suspend, or discontinue any part of our
                      service with reasonable notice. Material changes affecting
                      core functionality will have at least 30 days notice.
                    </p>
                  </CalloutBox>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </section>
      {/* Limitation of Liability Section */}
      <section id="liability" className="mb-12">
        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                8. Limitation of Liability
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection("liability")}
                className="md:hidden"
              >
                {expandedSections["liability"] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          <Collapsible
            open={expandedSections["liability"] ?? false}
            onOpenChange={() => toggleSection("liability")}
          >
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div id="disclaimer" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Service Disclaimer
                  </h3>
                  <CalloutBox type="important" title="Important Notice">
                    <p>
                      {name} is provided "as is" without warranties of any kind.
                      We do not guarantee that our service will meet your
                      specific requirements or be error-free, secure, or
                      continuously available.
                    </p>
                  </CalloutBox>
                </div>

                <Separator />

                <div id="liability-limits" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Liability Limits
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      To the maximum extent permitted by law, our total
                      liability for any claims related to {name} shall not
                      exceed:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        The amount you paid us in the 12 months preceding the
                        claim
                      </li>
                      <li>$100 USD for free account users</li>
                    </ul>
                    <p>
                      We shall not be liable for indirect, incidental, special,
                      consequential, or punitive damages, including lost profits
                      or data.
                    </p>
                  </div>
                </div>

                <Separator />

                <div id="financial-advice" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Financial Advice Disclaimer
                  </h3>
                  <CalloutBox type="warning" title="Not Financial Advice">
                    <p>
                      {name} provides tools and calculators but does not provide
                      financial, tax, or investment advice. Consult qualified
                      professionals for personalized financial guidance.
                    </p>
                  </CalloutBox>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </section>
      {/* Dispute Resolution Section */}
      <section id="dispute-resolution" className="mb-12">
        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                9. Dispute Resolution
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection("dispute-resolution")}
                className="md:hidden"
              >
                {expandedSections["dispute-resolution"] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          <Collapsible
            open={expandedSections["dispute-resolution"] ?? false}
            onOpenChange={() => toggleSection("dispute-resolution")}
          >
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div id="informal-resolution" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Informal Resolution
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      Before filing any formal dispute, please contact our
                      support team to resolve the issue informally. Most
                      disputes can be resolved quickly through direct
                      communication.
                    </p>
                  </div>
                </div>

                <Separator />

                <div id="arbitration" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Arbitration Agreement
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      Any disputes that cannot be resolved informally shall be
                      settled through binding arbitration in accordance with the
                      rules of the American Arbitration Association. You agree
                      to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Resolve disputes individually, not as part of a class
                        action
                      </li>
                      <li>
                        Arbitrate in the jurisdiction where our company is
                        located
                      </li>
                      <li>Follow the AAA's Consumer Arbitration Rules</li>
                      <li>Share arbitration costs according to AAA rules</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div id="governing-law" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Governing Law
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      These terms are governed by the laws of the state where
                      our company is incorporated, without regard to conflict of
                      law principles.
                    </p>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>{" "}
      </section>
      {/* Termination Section */}
      <section id="termination" className="mb-12">
        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                10. Termination
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection("termination")}
                className="md:hidden"
              >
                {expandedSections["termination"] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          <Collapsible
            open={expandedSections["termination"] ?? false}
            onOpenChange={() => toggleSection("termination")}
          >
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div id="user-termination" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Termination by You
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      You may terminate your account and these terms at any time
                      by:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Deleting your account through your account settings
                      </li>
                      <li>
                        Contacting our support team with a termination request
                      </li>
                      <li>Ceasing to use our services</li>
                    </ul>
                    <p>
                      Upon voluntary termination, your access will end
                      immediately, but data deletion may take up to 30 days as
                      outlined in our Privacy Policy.
                    </p>
                  </div>
                </div>

                <Separator />

                <div id="company-termination" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Termination by Us
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      We may terminate or suspend your account immediately,
                      without prior notice, if you:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Violate any provision of these Terms of Service</li>
                      <li>Engage in fraudulent or illegal activities</li>
                      <li>
                        Compromise the security or integrity of our service
                      </li>
                      <li>Fail to pay applicable fees for premium services</li>
                      <li>
                        Use the service in a manner that harms other users
                      </li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div id="effects-termination" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Effects of Termination
                  </h3>
                  <CalloutBox type="important" title="Post-Termination Effects">
                    <p>Upon termination of your account or these terms:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Your right to use the service immediately ends</li>
                      <li>You lose access to all account data and features</li>
                      <li>Outstanding payment obligations remain in effect</li>
                      <li>
                        Sections regarding liability, indemnification, and
                        dispute resolution survive termination
                      </li>
                      <li>
                        We may retain certain information as required by law or
                        for legitimate business purposes
                      </li>
                    </ul>
                  </CalloutBox>
                </div>

                <Separator />

                <div id="data-portability" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Data Export and Portability
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      Before terminating your account, you may export your data
                      using our data export tools. We provide standard export
                      formats for:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Transaction history (CSV, JSON formats)</li>
                      <li>Category definitions and customizations</li>
                      <li>Budget and goal configurations</li>
                      <li>Generated reports and tax calculations</li>
                    </ul>
                    <p>
                      Data export functionality is available for 30 days after
                      account termination, after which data may be permanently
                      deleted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </section>
      {/* Legal Compliance Section */}
      <section id="legal-compliance" className="mb-12">
        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                11. Legal Compliance
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection("legal-compliance")}
                className="md:hidden"
              >
                {expandedSections["legal-compliance"] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          <Collapsible
            open={expandedSections["legal-compliance"] ?? false}
            onOpenChange={() => toggleSection("legal-compliance")}
          >
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div id="regulatory-compliance" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Regulatory Compliance
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      We comply with applicable financial services regulations,
                      including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Data protection laws (GDPR, CCPA, etc.)</li>
                      <li>Financial privacy regulations</li>
                      <li>Consumer protection laws</li>
                      <li>
                        Anti-money laundering requirements where applicable
                      </li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div id="international-users" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    International Users
                  </h3>
                  <CalloutBox type="info" title="Cross-Border Services">
                    <p>
                      {name} may be accessed from various countries. Users are
                      responsible for compliance with their local laws and
                      regulations regarding financial data and online services.
                    </p>
                  </CalloutBox>
                </div>

                <Separator />

                <div id="changes-to-terms" className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Changes to Terms
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                    <p>
                      We may update these terms to reflect changes in our
                      services or legal requirements. Material changes will be
                      communicated through:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Email notification to registered users</li>
                      <li>Prominent notice on our website</li>
                      <li>In-app notifications</li>
                    </ul>
                    <p>
                      Continued use of our service after changes constitute
                      acceptance of the updated terms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </section>
      {/* Contact & Support Section */}
      <section id="contact-support" className="mb-12">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">
              Contact & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
              <p>
                If you have questions about these Terms of Service, need
                support, or want to report a violation, please contact us:
              </p>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p>
                  <strong>Email:</strong> {companyInformation.email}
                </p>
                <p>
                  <strong>Phone:</strong> {companyInformation.phone}
                </p>
                <p>
                  <strong>Address:</strong> {companyInformation.address}
                </p>
                <p>
                  <strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM
                  EST
                </p>
              </div>

              <CalloutBox type="info" title="Updates to Terms">
                <p>
                  We may update these Terms of Service from time to time. We
                  will notify you of any material changes by posting the new
                  terms on this page and updating the "Last Updated" date. For
                  significant changes, we will also send email notifications to
                  registered users.
                </p>
              </CalloutBox>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Last Updated:</strong> June 7, 2025
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Effective Date:</strong> June 7, 2025
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  These Terms of Service are effective immediately upon posting.
                  Your continued use of {name} constitutes acceptance of these
                  terms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
