/**
 * Finance Shortcuts Hook - Presentation Layer
 *
 * Provides keyboard shortcuts for finance operations
 */

import { useHotkeys } from "react-hotkeys-hook";

export interface FinanceShortcutsConfig {
  add: () => void;
  cancel: () => void;
  import?: () => void;
  exportCSV?: () => void;
  exportPDF?: () => void;
  save?: () => void;
  delete?: () => void;
  search?: () => void;
  filter?: () => void;
  refresh?: () => void;
}

export function useFinanceShortcuts({
  add,
  cancel,
  import: importFn,
  exportCSV,
  exportPDF,
  save,
  delete: deleteFn,
  search,
  filter,
  refresh,
}: FinanceShortcutsConfig) {
  // Core shortcuts
  useHotkeys(
    "mod+n",
    (e) => {
      e.preventDefault();
      add();
    },
    { description: "Add new transaction" },
  );

  useHotkeys(
    "escape",
    () => {
      cancel();
    },
    { description: "Cancel current action" },
  );

  // Import/Export shortcuts
  if (importFn) {
    useHotkeys(
      "mod+i",
      (e) => {
        e.preventDefault();
        importFn();
      },
      { description: "Import transactions" },
    );
  }

  if (exportCSV) {
    useHotkeys(
      "mod+e",
      (e) => {
        e.preventDefault();
        exportCSV();
      },
      { description: "Export to CSV" },
    );
  }

  if (exportPDF) {
    useHotkeys(
      "mod+shift+e",
      (e) => {
        e.preventDefault();
        exportPDF();
      },
      { description: "Export to PDF" },
    );
  }

  // Additional shortcuts
  if (save) {
    useHotkeys(
      "mod+s",
      (e) => {
        e.preventDefault();
        save();
      },
      { description: "Save changes" },
    );
  }

  if (deleteFn) {
    useHotkeys(
      "delete",
      () => {
        deleteFn();
      },
      { description: "Delete selected item" },
    );
  }

  if (search) {
    useHotkeys(
      "mod+f",
      (e) => {
        e.preventDefault();
        search();
      },
      { description: "Search transactions" },
    );
  }

  if (filter) {
    useHotkeys(
      "mod+l",
      (e) => {
        e.preventDefault();
        filter();
      },
      { description: "Toggle filters" },
    );
  }

  if (refresh) {
    useHotkeys(
      "mod+r",
      (e) => {
        e.preventDefault();
        refresh();
      },
      { description: "Refresh data" },
    );
  }
}
