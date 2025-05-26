import { useHotkeys } from "react-hotkeys-hook";

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
  useHotkeys("ctrl+n, cmd+n", (e) => {
    e.preventDefault();
    add();
  });

  useHotkeys("esc", () => {
    cancel();
  });

  if (importFn) {
    useHotkeys("ctrl+i, cmd+i", (e) => {
      e.preventDefault();
      importFn();
    });
  }

  if (exportCSV) {
    useHotkeys("ctrl+shift+e, cmd+shift+e", (e) => {
      e.preventDefault();
      exportCSV();
    });
  }

  if (exportPDF) {
    useHotkeys("ctrl+shift+p, cmd+shift+p", (e) => {
      e.preventDefault();
      exportPDF();
    });
  }
}
