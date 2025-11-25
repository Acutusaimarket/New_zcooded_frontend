import { ArrowLeft, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useABTestHistoryDetail } from "./api/use-ab-test-history-detail";
import { ABTestHistoryDetails } from "./components";

const ABTestHistoryDetailsPage = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useABTestHistoryDetail(id || "");

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        {/* Header Skeleton */}
        <div className="bg-card/50 border-b backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} />;
  }
  if (!data) {
    return <ErrorState error={error} />;
  }

  return <ABTestHistoryDetails test={data} />;
};

const ErrorState = ({ error }: { error?: Error | null }) => {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card/50 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/ab-testing/history">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to History
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Error Content */}
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription className="flex items-center justify-between">
            <span>
              {error?.message ||
                "Failed to load test details. Please try again."}
            </span>
            <Button variant="outline" size="sm" className="ml-4" asChild>
              <Link to="/dashboard/ab-testing/history">
                <RefreshCw className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default ABTestHistoryDetailsPage;
