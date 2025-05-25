import { useHotkeys } from "react-hotkeys-hook";

interface FinanceShortcuts {
  add: () => void;
  cancel: () => void;
}

export function useFinanceShortcuts({ add, cancel }: FinanceShortcuts) {
  useHotkeys("ctrl+n, cmd+n", (e) => {
    e.preventDefault();
    add();
  });

  useHotkeys("esc", () => {
    cancel();
  });
}
