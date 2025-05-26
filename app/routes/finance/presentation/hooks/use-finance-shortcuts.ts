import { useEffect } from "react";

/**
 * Custom hook for finance-related keyboard shortcuts
 */
export function useFinanceShortcuts({
  add,
  cancel,
}: {
  add: () => void;
  cancel: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        add();
      } else if (e.key === "Escape") {
        cancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [add, cancel]);
}
