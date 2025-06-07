import { ChevronDown, ChevronRight, Menu, Search } from "lucide-react";
import { useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";

interface TermsSection {
  id: string;
  title: string;
  level: number;
}

const termsSections: TermsSection[] = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "account-terms", title: "1. Account Terms", level: 1 },
  { id: "user-accounts", title: "User Accounts", level: 2 },
  { id: "account-security", title: "Account Security", level: 2 },
  { id: "account-termination", title: "Account Termination", level: 2 },
  { id: "financial-data", title: "2. Financial Data Handling", level: 1 },
  { id: "data-collection", title: "Data Collection", level: 2 },
  { id: "data-protection", title: "Data Protection", level: 2 },
  { id: "privacy-security", title: "3. Privacy & Security", level: 1 },
  { id: "encryption", title: "Encryption Standards", level: 2 },
  { id: "access-controls", title: "Access Controls", level: 2 },
  { id: "service-usage", title: "4. Service Usage & Conduct", level: 1 },
  { id: "acceptable-use", title: "Acceptable Use", level: 2 },
  { id: "prohibited-content", title: "Prohibited Content", level: 2 },
  { id: "billing-payment", title: "5. Billing & Payment", level: 1 },
  { id: "subscription-plans", title: "Subscription Plans", level: 2 },
  { id: "payment-terms", title: "Payment Terms", level: 2 },
  { id: "refund-policy", title: "Refund Policy", level: 2 },
  { id: "intellectual-property", title: "6. Intellectual Property", level: 1 },
  { id: "our-rights", title: "Our Rights", level: 2 },
  { id: "your-rights", title: "Your Rights", level: 2 },
  { id: "dmca-policy", title: "DMCA Policy", level: 2 },
  { id: "service-availability", title: "7. Service Availability", level: 1 },
  { id: "uptime-commitment", title: "Uptime Commitment", level: 2 },
  { id: "maintenance", title: "Maintenance", level: 2 },
  { id: "service-modifications", title: "Service Modifications", level: 2 },
  { id: "liability", title: "8. Limitation of Liability", level: 1 },
  { id: "disclaimer", title: "Service Disclaimer", level: 2 },
  { id: "liability-limits", title: "Liability Limits", level: 2 },
  { id: "financial-advice", title: "Financial Advice Disclaimer", level: 2 },
  { id: "dispute-resolution", title: "9. Dispute Resolution", level: 1 },
  { id: "informal-resolution", title: "Informal Resolution", level: 2 },
  { id: "arbitration", title: "Arbitration Agreement", level: 2 },
  { id: "governing-law", title: "Governing Law", level: 2 },
  { id: "termination", title: "10. Termination", level: 1 },
  { id: "user-termination", title: "Termination by You", level: 2 },
  { id: "company-termination", title: "Termination by Us", level: 2 },
  { id: "effects-termination", title: "Effects of Termination", level: 2 },
  { id: "data-portability", title: "Data Export and Portability", level: 2 },
  { id: "legal-compliance", title: "11. Legal Compliance", level: 1 },
  { id: "regulatory-compliance", title: "Regulatory Compliance", level: 2 },
  { id: "international-users", title: "International Users", level: 2 },
  { id: "changes-to-terms", title: "Changes to Terms", level: 2 },
  { id: "contact-support", title: "Contact & Support", level: 1 },
];

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSections = termsSections.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="lg:hidden mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-12 text-left"
          >
            <div className="flex items-center gap-2">
              <Menu className="h-4 w-4" />
              <span className="font-medium">Table of Contents</span>
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  {filteredSections.length}
                </Badge>
              )}
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-2">
          <div className="border border-border rounded-lg bg-card p-4 shadow-sm">
            {/* Search Box */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            {/* Navigation Links */}
            <ScrollArea className="max-h-80">
              <div className="space-y-1">
                {filteredSections.map((section) => (
                  <Button
                    key={section.id}
                    variant="ghost"
                    className={`w-full justify-start text-left h-auto py-3 px-3 ${
                      section.level === 2 ? "pl-6" : ""
                    } text-sm hover:bg-muted/50 hover:text-foreground min-h-[44px]`}
                    onClick={() => scrollToSection(section.id)}
                  >
                    <span className="leading-relaxed">{section.title}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-border flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex-1"
              >
                ↑ Back to Top
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="flex-1"
              >
                Print
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
