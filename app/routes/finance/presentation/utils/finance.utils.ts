import type {
  Budget,
  Category,
  Transaction,
} from "~/routes/finance/presentation/types/ui.types";

// Simple audit trail utility for development
export const AuditTrail = {
  addRecord: (message: string) => {
    if (process.env.NODE_ENV === "development") {
      console.log("AuditTrail:", message);
    }
  },
};
