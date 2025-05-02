import { useEffect, useState } from "react";

import { getTranslation } from "../utils/translations";

interface AccessibilityAnnouncementProps {
  message: string;
  timeout?: number;
}

export function AccessibilityAnnouncement({
  message,
  timeout = 1000,
}: AccessibilityAnnouncementProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  if (!isVisible) return null;

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {message}
    </div>
  );
}

interface NavigationAnnouncementProps {
  language: "en" | "vi" | "ja";
}

export function BracketNavigationAnnouncement({
  language,
}: NavigationAnnouncementProps) {
  return (
    <AccessibilityAnnouncement
      message={getTranslation("TaxRate.NavigationInstructions", language)}
      timeout={5000}
    />
  );
}
