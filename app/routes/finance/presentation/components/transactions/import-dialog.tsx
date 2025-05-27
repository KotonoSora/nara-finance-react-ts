import { Upload, X } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import type { Transaction } from "~/routes/finance/presentation/types/ui.types";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ImportService } from "~/routes/finance/application/services/import.service";

// Use toast directly instead of notification helpers
const showImportCompletedToast = (count: number) =>
  toast.success(`Successfully imported ${count} transactions`);
const showImportErrorToast = (error: string) =>
  toast.error(`Import failed: ${error}`);

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (transactions: Transaction[]) => void;
}

export default function ImportDialog({
  open,
  onOpenChange,
  onImport,
}: ImportDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    multiple: false,
    disabled: isProcessing,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      try {
        setIsProcessing(true);
        const file = acceptedFiles[0];
        const importService = new ImportService();
        const result = await importService.parseCSVTransactions(file);

        onImport(result as Transaction[]);
        showImportCompletedToast((result as Transaction[]).length);
        onOpenChange(false);
      } catch (error) {
        showImportErrorToast(
          error instanceof Error ? error.message : "Failed to import file",
        );
      } finally {
        setIsProcessing(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center
            ${isDragActive ? "border-primary" : "border-muted"}
            ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {isDragActive
              ? "Drop the CSV file here"
              : "Drag and drop a CSV file here, or click to select"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Supported format: CSV with headers (date, description, amount,
            category)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
