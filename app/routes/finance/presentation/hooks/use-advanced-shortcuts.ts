/**
 * Finance Shortcuts Hook - Presentation Layer
 *
 * This hook provides keyboard shortcuts functionality for the finance module.
 * It handles global keyboard events and provides a consistent shortcut system.
 *
 * @layer Presentation
 * @category Hooks
 */

import { useCallback, useEffect, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";

/**
 * Available shortcut actions
 */
export type ShortcutAction =
  | "add"
  | "delete"
  | "save"
  | "cancel"
  | "import"
  | "exportCSV"
  | "exportPDF"
  | "search"
  | "filter"
  | "refresh";

/**
 * Shortcut handler function type
 */
export type ShortcutHandler = () => void;

/**
 * Shortcut handlers mapping
 */
export type ShortcutHandlers = Partial<Record<ShortcutAction, ShortcutHandler>>;

/**
 * Keyboard shortcut configuration
 */
export interface ShortcutConfig {
  /** Keyboard keys for the action */
  keys: readonly string[];
  /** Human-readable description */
  description: string;
  /** Whether it requires a modifier key (Ctrl/Cmd) */
  requiresModifier?: boolean;
  /** Whether it requires shift key */
  requiresShift?: boolean;
  /** Whether the shortcut is enabled */
  enabled?: boolean;
}

/**
 * Finance shortcuts configuration
 */
export const FINANCE_SHORTCUTS: Record<ShortcutAction, ShortcutConfig> = {
  add: {
    keys: ["n", "N"],
    description: "Add new transaction",
    enabled: true,
  },
  delete: {
    keys: ["Delete", "Backspace"],
    description: "Delete selected item",
    enabled: true,
  },
  save: {
    keys: ["Enter"],
    description: "Save changes",
    requiresModifier: true,
    enabled: true,
  },
  cancel: {
    keys: ["Escape"],
    description: "Cancel current action",
    enabled: true,
  },
  import: {
    keys: ["i"],
    description: "Import transactions",
    requiresModifier: true,
    enabled: true,
  },
  exportCSV: {
    keys: ["e"],
    description: "Export to CSV",
    requiresModifier: true,
    enabled: true,
  },
  exportPDF: {
    keys: ["e"],
    description: "Export to PDF",
    requiresModifier: true,
    requiresShift: true,
    enabled: true,
  },
  search: {
    keys: ["f"],
    description: "Search transactions",
    requiresModifier: true,
    enabled: true,
  },
  filter: {
    keys: ["l"],
    description: "Toggle filters",
    requiresModifier: true,
    enabled: true,
  },
  refresh: {
    keys: ["r"],
    description: "Refresh data",
    requiresModifier: true,
    enabled: true,
  },
} as const;

/**
 * Finance shortcuts hook options
 */
export interface UseFinanceShortcutsOptions {
  /** Shortcut handlers */
  handlers: ShortcutHandlers;
  /** Whether shortcuts are enabled globally */
  enabled?: boolean;
  /** Custom shortcut configurations */
  customShortcuts?: Partial<Record<ShortcutAction, ShortcutConfig>>;
  /** Callback when a shortcut is triggered */
  onShortcutTriggered?: (action: ShortcutAction) => void;
}

/**
 * Hook return type
 */
export interface UseFinanceShortcutsReturn {
  /** Get label for a shortcut action */
  getShortcutLabel: (action: ShortcutAction) => string;
  /** Get all available shortcuts */
  getAvailableShortcuts: () => Array<{
    action: ShortcutAction;
    label: string;
    description: string;
    enabled: boolean;
  }>;
  /** Check if shortcuts are currently enabled */
  isEnabled: boolean;
}

/**
 * Finance shortcuts hook
 *
 * Provides keyboard shortcuts for common finance operations.
 * Automatically handles modifier keys and prevents conflicts with form inputs.
 *
 * @param options - Hook configuration options
 * @returns Shortcut utilities and state
 *
 * @example
 * ```tsx
 * function FinanceComponent() {
 *   const { getShortcutLabel, getAvailableShortcuts } = useFinanceShortcuts({
 *     handlers: {
 *       add: () => setShowAddDialog(true),
 *       delete: () => handleDelete(),
 *       save: () => handleSave(),
 *       cancel: () => setShowAddDialog(false),
 *       import: () => handleImport(),
 *       exportCSV: () => handleExportCSV(),
 *       exportPDF: () => handleExportPDF(),
 *     },
 *     enabled: true,
 *     onShortcutTriggered: (action) => console.log(`Shortcut triggered: ${action}`),
 *   });
 *
 *   return (
 *     <div>
 *       <button title={`Add Transaction (${getShortcutLabel('add')})`}>
 *         Add Transaction
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAdvancedFinanceShortcuts(
  options: UseFinanceShortcutsOptions,
): UseFinanceShortcutsReturn {
  const {
    handlers,
    enabled = true,
    customShortcuts = {},
    onShortcutTriggered,
  } = options;

  // Merge default and custom shortcuts
  const shortcuts = useMemo(
    () => ({
      ...FINANCE_SHORTCUTS,
      ...customShortcuts,
    }),
    [customShortcuts],
  );

  /**
   * Checks if an element should prevent shortcuts
   */
  const shouldPreventShortcuts = useCallback(
    (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof Element)) return false;

      // Check if target is an input element
      const tagName = target.tagName.toLowerCase();
      if (["input", "textarea", "select"].includes(tagName)) {
        return true;
      }

      // Check if target has contenteditable
      if (target.getAttribute("contenteditable") === "true") {
        return true;
      }

      // Check if target is inside a contenteditable element
      const editableParent = target.closest('[contenteditable="true"]');
      if (editableParent) {
        return true;
      }

      return false;
    },
    [],
  );

  /**
   * Global keydown handler for basic shortcuts
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || shouldPreventShortcuts(event.target)) {
        return;
      }

      const key = event.key;
      const metaKey = event.metaKey || event.ctrlKey;
      const shiftKey = event.shiftKey;

      // Find matching shortcut
      for (const [action, config] of Object.entries(shortcuts)) {
        if (!config.enabled) continue;

        const matchesKey = config.keys.includes(key);
        const matchesModifier = config.requiresModifier ? metaKey : !metaKey;
        const matchesShift = config.requiresShift
          ? shiftKey
          : !config.requiresShift;

        if (matchesKey && matchesModifier && matchesShift) {
          const handler = handlers[action as ShortcutAction];
          if (handler) {
            event.preventDefault();
            event.stopPropagation();
            handler();
            onShortcutTriggered?.(action as ShortcutAction);
            break;
          }
        }
      }
    },
    [enabled, shortcuts, handlers, shouldPreventShortcuts, onShortcutTriggered],
  );

  // Register global keydown listener
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, enabled]);

  // Register specific hotkeys using react-hotkeys-hook
  useHotkeys(
    "mod+i",
    (event) => {
      if (enabled && handlers.import) {
        event.preventDefault();
        handlers.import();
        onShortcutTriggered?.("import");
      }
    },
    { enabled: enabled && shortcuts.import.enabled },
    [handlers.import, enabled, onShortcutTriggered],
  );

  useHotkeys(
    "mod+e",
    (event) => {
      if (enabled && handlers.exportCSV) {
        event.preventDefault();
        handlers.exportCSV();
        onShortcutTriggered?.("exportCSV");
      }
    },
    { enabled: enabled && shortcuts.exportCSV.enabled },
    [handlers.exportCSV, enabled, onShortcutTriggered],
  );

  useHotkeys(
    "mod+shift+e",
    (event) => {
      if (enabled && handlers.exportPDF) {
        event.preventDefault();
        handlers.exportPDF();
        onShortcutTriggered?.("exportPDF");
      }
    },
    { enabled: enabled && shortcuts.exportPDF.enabled },
    [handlers.exportPDF, enabled, onShortcutTriggered],
  );

  useHotkeys(
    "mod+f",
    (event) => {
      if (enabled && handlers.search) {
        event.preventDefault();
        handlers.search();
        onShortcutTriggered?.("search");
      }
    },
    { enabled: enabled && shortcuts.search.enabled },
    [handlers.search, enabled, onShortcutTriggered],
  );

  useHotkeys(
    "mod+l",
    (event) => {
      if (enabled && handlers.filter) {
        event.preventDefault();
        handlers.filter();
        onShortcutTriggered?.("filter");
      }
    },
    { enabled: enabled && shortcuts.filter.enabled },
    [handlers.filter, enabled, onShortcutTriggered],
  );

  useHotkeys(
    "mod+r",
    (event) => {
      if (enabled && handlers.refresh) {
        event.preventDefault();
        handlers.refresh();
        onShortcutTriggered?.("refresh");
      }
    },
    { enabled: enabled && shortcuts.refresh.enabled },
    [handlers.refresh, enabled, onShortcutTriggered],
  );

  /**
   * Gets the human-readable label for a shortcut
   */
  const getShortcutLabel = useCallback(
    (action: ShortcutAction): string => {
      const config = shortcuts[action];
      if (!config || !config.enabled) return "";

      const key = config.keys[0];
      const isMac =
        typeof navigator !== "undefined" &&
        navigator.platform.toLowerCase().includes("mac");
      const modifier = isMac ? "⌘" : "Ctrl";
      const shift = "Shift";

      let label = "";

      if (config.requiresModifier) {
        label += modifier + "+";
      }

      if (config.requiresShift) {
        label += shift + "+";
      }

      // Special key mappings
      const keyMap: Record<string, string> = {
        Escape: "Esc",
        Delete: "Del",
        Backspace: "⌫",
        Enter: "↵",
      };

      label += keyMap[key] || key.toUpperCase();

      return label;
    },
    [shortcuts],
  );

  /**
   * Gets all available shortcuts with their labels
   */
  const getAvailableShortcuts = useCallback(() => {
    return Object.entries(shortcuts)
      .map(([action, config]) => ({
        action: action as ShortcutAction,
        label: getShortcutLabel(action as ShortcutAction),
        description: config.description,
        enabled: config.enabled ?? true,
      }))
      .filter((shortcut) => shortcut.enabled);
  }, [shortcuts, getShortcutLabel]);

  return {
    getShortcutLabel,
    getAvailableShortcuts,
    isEnabled: enabled,
  };
}

// Legacy compatibility export
export { useAdvancedFinanceShortcuts as useFinanceShortcuts };
