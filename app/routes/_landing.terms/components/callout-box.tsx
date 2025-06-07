import { AlertTriangle, Info, Lock, Shield } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

interface CalloutBoxProps {
  type: "info" | "warning" | "security" | "important";
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function CalloutBox({
  type,
  title,
  children,
  className = "",
}: CalloutBoxProps) {
  const getIcon = () => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      case "important":
        return <Lock className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case "warning":
      case "important":
        return "destructive";
      default:
        return "default";
    }
  };

  const getCustomStyles = () => {
    switch (type) {
      case "security":
        return "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800";
      case "info":
        return "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800";
      case "warning":
        return "border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800";
      case "important":
        return "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800";
      default:
        return "";
    }
  };

  return (
    <Alert
      variant={getVariant()}
      className={`my-6 p-6 ${getCustomStyles()} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <AlertTitle className="text-base font-semibold mb-2 leading-tight">
            {title}
          </AlertTitle>
          <AlertDescription className="text-sm leading-relaxed space-y-2">
            {children}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
