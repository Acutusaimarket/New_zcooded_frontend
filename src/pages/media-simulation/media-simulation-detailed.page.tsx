import { Component, useEffect, type ReactNode } from "react";
import { useParams } from "react-router";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { MediaSimulationDashboard } from "@/features/media-simulation/containers/MediaSimulationDashboard";

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode; simulationId: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; simulationId: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <Alert className="max-w-2xl border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <h2 className="font-semibold mb-2">Error rendering simulation</h2>
              <p className="text-sm mb-2">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Simulation ID: {this.props.simulationId}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
              >
                Reload Page
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function MediaSimulationDetailsPage() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    console.log("=== MediaSimulationDetailsPage MOUNTED ===");
    console.log("Page rendered with id:", id);
    console.log("Current URL:", window.location.href);
    console.log("All params:", { id });
  }, [id]);

  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Invalid Simulation ID
          </h1>
          <p className="mt-2 text-gray-600">
            Please provide a valid simulation ID in the URL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary simulationId={id}>
      <div className="bg-background min-h-screen">
        <MediaSimulationDashboard simulationId={id} />
      </div>
    </ErrorBoundary>
  );
}
