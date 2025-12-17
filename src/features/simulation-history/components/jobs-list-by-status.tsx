import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
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
        title: "No Active Simulations",
        description: "Active simulations will appear here while they run.",
      };
    case "completed":
      return {
        icon: CheckCircle2,
        title: "No Completed Simulations",
        description: "Completed simulations will appear here.",
      };
    case "failed":
      return {
        icon: AlertCircle,
        title: "No Failed Simulations",
        description: "Failed simulations will appear here.",
      };
    case "pending":
    case "interrupted":
      return {
        icon: Clock,
        title: "No Pending Simulations",
        description: "Pending simulations will appear here.",
      };
    default:
      return {
        icon: Clock,
        title: "No Simulations",
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
    jobType,
    status !== "active"
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
    const isActive = status === "active";

    return (
      <div className="flex min-h-[500px] items-center justify-center bg-white rounded-lg">
        <div className="text-center">
          <div className="bg-gray-200 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            {isActive ? (
              <Loader2 className="text-gray-600 h-10 w-10 animate-spin" />
            ) : (
              <Icon className="text-gray-600 h-10 w-10" />
            )}
          </div>
          <h3 className="text-gray-900 mb-2 text-xl font-bold">
            {empty.title}
          </h3>
          <p className="text-gray-600 text-base">{empty.description}</p>
        </div>
      </div>
    );
  }

  const handleViewSimulation = (job: SimulationJob) => {
    if (jobType === "media_simulation" || job.job_type === "media_simulation") {
      navigate(`/dashboard/media-simulation/history/result/${job._id}`);
    } else if (jobType === "persona_clustering" || job.job_type === "persona_clustering") {
      navigate("/dashboard/persona-studio/management");
    } else {
      navigate(`/dashboard/simulation/history/result/${job._id}`);
    }
  };

  // Check if any job is media_simulation or market_fit_simulation to determine layout
  const hasMediaSimulation = jobs.some(
    (job) => jobType === "media_simulation" || job.job_type === "media_simulation"
  );
  const hasMarketFitSimulation = jobs.some(
    (job) => jobType === "market_fit_simulation" || job.job_type === "market_fit_simulation"
  );

  return (
    <div
      className={
        status === "completed" || hasMediaSimulation || hasMarketFitSimulation
          ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          : "space-y-4"
      }
    >
      {jobs.map((job) => {
        // For all media_simulation, market_fit_simulation, and persona_clustering jobs, pass the handler to integrate button in card
        const isMediaSimulation =
          jobType === "media_simulation" || job.job_type === "media_simulation";
        const isMarketFitSimulation =
          jobType === "market_fit_simulation" || job.job_type === "market_fit_simulation";
        const isPersonaClustering =
          jobType === "persona_clustering" || job.job_type === "persona_clustering";

        const card = (
          <ActiveJobCard
            key={job._id}
            job={job}
            onViewSimulation={
              isMediaSimulation || isMarketFitSimulation || isPersonaClustering
                ? () => handleViewSimulation(job)
                : undefined
            }
          />
        );

        // For non-media_simulation, non-market_fit_simulation, and non-persona_clustering completed jobs, show button separately
        if (status === "completed" && !isMediaSimulation && !isMarketFitSimulation && !isPersonaClustering) {
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
        }

        return card;
      })}
    </div>
  );
};
