import { Clock } from "lucide-react";
import { useSearchParams } from "react-router";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useJobStatus } from "../hooks/use-job-status";
import type { SimulationJob } from "../types/job.types";
import { ActiveJobCard } from "./active-job-card";

export const ActiveJobsList = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const jobType = (searchParams.get("jobType") as "simulation" | "media_simulation") || "simulation";

  const { data, isLoading, error, isError } = useJobStatus({
    jobId,
    jobType,
    enabled: !!jobId,
  });

  if (!jobId) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Clock className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="text-muted-foreground mb-2 text-lg font-semibold">
            No active simulations
          </h3>
          <p className="text-muted-foreground text-sm">
            Active simulations will appear here
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-2 h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error?.message || "Failed to load job status. Please try again."}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h3 className="text-muted-foreground mb-2 text-lg font-semibold">
            Job not found
          </h3>
          <p className="text-muted-foreground text-sm">
            The requested job could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ActiveJobCard job={data as SimulationJob} />
    </div>
  );
};

