import {
  Lock as LockIcon,
  Mail as MailIcon,
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
  ShieldCheck,
  BadgeCheck as VerifiedIcon,
} from "lucide-react";

import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { useLandingContext } from "../context/landing-context";
import footerLinks from "../data/footer-links";
import socialLinks from "../data/social-links";

export default function FooterSection() {
  const { name, companyInformation, copyrightTime } = useLandingContext();

  return (
    <footer className="bg-background border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <img
              src="/assets/logo-light.svg"
              alt={`${name} logo`}
              className="h-8 w-auto dark:hidden"
            />
            <img
              src="/assets/logo-dark.svg"
              alt={`${name} logo`}
              className="h-8 w-auto hidden dark:block"
            />
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                <span>{companyInformation.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                <a
                  href={`tel:${companyInformation.phone}`}
                  className="hover:text-foreground transition-colors"
                >
                  {companyInformation.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MailIcon className="h-4 w-4" />
                <a
                  href={`mailto:${companyInformation.email}`}
                  className="hover:text-foreground transition-colors"
                >
                  {companyInformation.email}
                </a>
              </p>
              {companyInformation.taxId && (
                <p className="flex items-center gap-2">
                  <VerifiedIcon className="h-4 w-4" />
                  <span>MST: {companyInformation.taxId}</span>
                </p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          {(Object.keys(footerLinks) as Array<keyof typeof footerLinks>).map(
            (category) => (
              <div key={category}>
                <h3 className="font-semibold mb-4 text-foreground capitalize">
                  {category}
                </h3>
                <ul className="space-y-2">
                  {footerLinks[category].map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map(
                (link) =>
                  link.icon && (
                    <Tooltip key={link.name}>
                      <TooltipTrigger asChild>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={`Theo dõi chúng tôi trên ${link.name}`}
                        >
                          <img
                            src={link.icon}
                            alt={`${link.name} icon`}
                            className="h-5 w-5"
                          />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Theo dõi chúng tôi trên {link.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ),
              )}
            </div>
          </div>

          {/* Copyright & Security */}
          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <LockIcon className="h-4 w-4" />
              <span>Mã hóa SSL 256-bit</span>
            </div>
            <Separator orientation="vertical" className="h-4 hidden sm:block" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>DMCA Protected</span>
            </div>
            <Separator orientation="vertical" className="h-4 hidden sm:block" />
            <p>
              &copy; {copyrightTime} {name}. Mọi quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
