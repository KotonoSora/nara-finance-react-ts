import { ModeSwitcher } from "~/components/mode-switcher";
import { Button } from "~/components/ui/button";

import { useLandingContext } from "../context/landing-context";

export default function Header() {
  const { name, slogan } = useLandingContext();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex px-4 sm:px-6 lg:px-8 h-14 items-center">
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{name}</h1>
            <p className="hidden text-sm text-muted-foreground sm:block">
              {slogan}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ModeSwitcher />
            <Button asChild size="sm" className="h-8">
              <a href="#email-form">Dùng thử miễn phí</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
