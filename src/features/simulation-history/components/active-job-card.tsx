import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import type { SimulationJob } from "../types/job.types";

interface ActiveJobCardProps {
  job: SimulationJob;
  variant?: "default" | "compact";
}

export const ActiveJobCard = ({ job, variant = "default" }: ActiveJobCardProps) => {
  const intermediateSteps = Object.entries(job.intermediate_steps || {});
  const completedSteps = intermediateSteps.filter(([, completed]) => completed)
    .length;
  const totalSteps = intermediateSteps.length;
  const progressPercentage =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const formatStepName = (stepName: string): string => {
    return stepName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusBadge = () => {
    switch (job.status) {
      case "pending":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="default" className="gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Running
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="gap-1">
            Failed
          </Badge>
        );
      case "interrupted":
        return (
          <Badge variant="secondary" className="gap-1">
            Interrupted
          </Badge>
        );
      default:
        return null;
    }
  };

  const isCompact = variant === "compact";

  return (
    <Card className={isCompact ? "w-full border-border/60" : "w-full"}>
      <CardHeader className={isCompact ? "px-4 py-3" : undefined}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className={isCompact ? "text-base" : "text-lg"}>
              {job.job_type === "media_simulation"
                ? "Media Simulation"
                : "Simulation"}
            </CardTitle>
            <p className={isCompact ? "text-muted-foreground text-xs" : "text-muted-foreground text-sm"}>
              Started {format(new Date(job.created_at), "PPp")}
            </p>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className={isCompact ? "space-y-4 px-4 pb-4 pt-0" : "space-y-6"}>
        {/* Progress Section */}
        <div className={isCompact ? "space-y-1" : "space-y-2"}>
          <div className="flex items-center justify-between text-sm">
            <span className={isCompact ? "text-muted-foreground text-xs font-medium" : "text-muted-foreground font-medium"}>
              Progress
            </span>
            <span className={isCompact ? "text-xs font-semibold" : "font-semibold"}>
              {completedSteps} / {totalSteps} steps completed
            </span>
          </div>
          <Progress value={progressPercentage} className={isCompact ? "h-1.5" : "h-2"} />
        </div>

        <Separator />

        {/* Intermediate Steps */}
        <div className={isCompact ? "space-y-2" : "space-y-3"}>
          {!isCompact && (
            <h4 className="text-sm font-semibold">Intermediate Steps</h4>
          )}
          <div className={isCompact ? "grid gap-2" : "grid gap-3 sm:grid-cols-2"}>
            {intermediateSteps.map(([stepName, completed]) => (
              <div
                key={stepName}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    completed
                      ? "bg-green-100 text-green-600"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      completed ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {formatStepName(stepName)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {completed ? "Completed" : "Pending"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metadata */}
        {job.meta_data && (
          <>
            <Separator />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-xs">Simulations</p>
                <p className="font-medium">
                  {job.meta_data.no_of_simulations}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Personas</p>
                <p className="font-medium">{job.meta_data.num_personas}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Media Files</p>
                <p className="font-medium">{job.meta_data.num_media_files}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">User</p>
                <p className="font-medium truncate">
                  {job.meta_data.user_email}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Failed Reasons */}
        {job.failed_reasons && (
          <>
            <Separator />
            <div className="rounded-lg bg-destructive/10 p-3">
              <p className="text-destructive text-sm font-medium">
                Failed Reason:
              </p>
              <p className="text-destructive/80 text-sm">
                {job.failed_reasons}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

