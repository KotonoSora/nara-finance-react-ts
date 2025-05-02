import { AlertCircle } from "lucide-react";
import { Component } from "react";

import type { ErrorInfo, ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";

import { getTranslation } from "../utils/translations";

interface Props {
  children: ReactNode;
  language: "en" | "vi" | "ja";
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Tax calculator error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {getTranslation("Error.CalculationTitle", this.props.language)}
          </AlertTitle>
          <AlertDescription className="space-y-4">
            <p>
              {getTranslation(
                "Error.CalculationDescription",
                this.props.language,
              )}
            </p>
            {this.state.error && (
              <p className="text-sm font-mono bg-muted/50 p-2 rounded">
                {this.state.error.message}
              </p>
            )}
            <Button
              variant="secondary"
              onClick={this.handleRetry}
              className="mt-2"
            >
              {getTranslation("Error.RetryButton", this.props.language)}
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
