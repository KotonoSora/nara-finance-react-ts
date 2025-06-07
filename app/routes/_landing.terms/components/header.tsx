import { Link } from "react-router";

import { ModeSwitcher } from "~/components/mode-switcher";
import { Button } from "~/components/ui/button";

import { useLandingContext } from "../../_landing._index/context/landing-context";

interface HeaderProps {
  lastUpdated: string;
}

export default function Header({ lastUpdated }: HeaderProps) {
  const { name, slogan } = useLandingContext();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16 md:h-16">
      <div className="container mx-auto flex h-full items-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-between space-x-2">
          {/* Logo and Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground">
              <Link
                to="/"
                className="hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded"
              >
                {name}
              </Link>
            </h1>
            <p className="hidden text-sm text-muted-foreground sm:block truncate">
              {slogan}
            </p>
          </div>

          {/* Last Updated - Center on desktop, hidden on mobile */}
          <div className="hidden md:flex items-center text-sm text-muted-foreground">
            <span className="font-medium">Last updated:</span>
            <span className="ml-2">{lastUpdated}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ModeSwitcher />
            <Button asChild size="sm" className="h-8">
              <Link to="/app">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Last Updated - Mobile */}
      <div className="md:hidden border-t border-border/40 bg-muted/30 px-4 py-2">
        <p className="text-xs text-muted-foreground text-center">
          Last updated: {lastUpdated}
        </p>
      </div>
    </header>
  );
}
