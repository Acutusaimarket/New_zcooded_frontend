import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useActiveJobs } from "../hooks/use-active-jobs";
import { useJobsByStatus } from "../hooks/use-jobs-by-status";
import type { SimulationJob } from "../types/job.types";
import { ActiveJobCard } from "./active-job-card";

interface JobsListByStatusProps {
  status: SimulationJob["status"] | "active";
  jobType?: string;
}

const getEmptyState = (status: SimulationJob["status"] | "active") => {
  switch (status) {
    case "active":
    case "in_progress":
    case "finalizing":
      return {
        icon: Clock,
        title: "No active simulations",
        description: "Active simulations will appear here while they run.",
      };
    case "completed":
      return {
        icon: CheckCircle2,
        title: "No completed simulations",
        description: "Completed simulations will appear here.",
      };
    case "failed":
      return {
        icon: AlertCircle,
        title: "No failed simulations",
        description: "Failed simulations will appear here.",
      };
    case "pending":
    case "interrupted":
      return {
        icon: Clock,
        title: "No pending simulations",
        description: "Pending simulations will appear here.",
      };
    default:
      return {
        icon: Clock,
        title: "No simulations",
        description: "Simulations will appear here.",
      };
  }
};

export const JobsListByStatus = ({
  status,
  jobType = "market_fit_simulation",
}: JobsListByStatusProps) => {
  const navigate = useNavigate();
  
  // Use useActiveJobs for "active" tab (shows both in_progress and finalizing)
  // Otherwise use the regular useJobsByStatus hook
  const activeJobsQuery = useActiveJobs(jobType);
  const regularJobsQuery = useJobsByStatus(
    status as SimulationJob["status"],
    jobType
  );

  const isActiveTab = status === "active";
  const { data, isLoading, isError, error } = isActiveTab
    ? activeJobsQuery
    : regularJobsQuery;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error?.message || "Failed to load simulations. Please try again."}
        </AlertDescription>
      </Alert>
    );
  }

  const jobs = data?.data ?? [];

  if (!jobs.length) {
    const empty = getEmptyState(status);
    const Icon = empty.icon;

    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Icon className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="text-muted-foreground mb-2 text-lg font-semibold">
            {empty.title}
          </h3>
          <p className="text-muted-foreground text-sm">{empty.description}</p>
        </div>
      </div>
    );
  }

  const handleViewSimulation = (job: SimulationJob) => {
    if (jobType === "media_simulation" || job.job_type === "media_simulation") {
      navigate(`/dashboard/media-simulation/history/result/${job._id}`);
    } else {
      navigate(`/dashboard/simulation/history/result/${job._id}`);
    }
  };

  return (
    <div
      className={
        status === "completed"
          ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          : "space-y-4"
      }
    >
      {jobs.map((job) => {
        const card = (
          <ActiveJobCard
            key={job._id}
            job={job}
          />
        );

        if (status !== "completed") {
          return card;
        }

        return (
          <div key={job._id} className="space-y-2">
            {card}
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleViewSimulation(job)}
              >
                View Simulation
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
