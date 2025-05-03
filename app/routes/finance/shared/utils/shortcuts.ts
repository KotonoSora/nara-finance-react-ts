import { useCallback, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

type ShortcutAction = "add" | "delete" | "save" | "cancel";

type ShortcutHandlers = {
  [key in ShortcutAction]?: () => void;
};

const SHORTCUTS: Record<ShortcutAction, readonly string[]> = {
  add: ["n", "N"],
  delete: ["Delete", "Backspace"],
  save: ["Enter"],
  cancel: ["Escape"],
} as const;

interface FinanceShortcuts {
  add: () => void;
  cancel: () => void;
  import?: () => void;
  exportCSV?: () => void;
  exportPDF?: () => void;
}

export function useFinanceShortcuts({
  add,
  cancel,
  import: importFn,
  exportCSV,
  exportPDF,
}: FinanceShortcuts) {
  const handlers: ShortcutHandlers = {
    add,
    cancel,
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = event.key;
      const metaKey = event.metaKey || event.ctrlKey;

      Object.entries(SHORTCUTS).forEach(([action, keys]) => {
        if (keys.includes(key)) {
          const handler = handlers[action as ShortcutAction];
          if (handler) {
            event.preventDefault();
            handler();
          }
        }
      });
    },
    [handlers],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Import/Export shortcuts
  useHotkeys(
    "mod+i",
    (e) => {
      e.preventDefault();
      importFn?.();
    },
    [importFn],
  );

  useHotkeys(
    "mod+e",
    (e) => {
      e.preventDefault();
      exportCSV?.();
    },
    [exportCSV],
  );

  useHotkeys(
    "mod+shift+e",
    (e) => {
      e.preventDefault();
      exportPDF?.();
    },
    [exportPDF],
  );
}

export function getShortcutLabel(action: ShortcutAction): string {
  const keys = SHORTCUTS[action];
  if (!keys) return "";

  const key = keys[0];
  const isMac = navigator.platform.toLowerCase().includes("mac");
  const modifier = isMac ? "⌘" : "Ctrl";

  switch (action) {
    case "add":
      return `${key}`;
    case "save":
      return `${modifier}+${key}`;
    case "delete":
      return key;
    case "cancel":
      return "Esc";
    default:
      return key;
  }
}
