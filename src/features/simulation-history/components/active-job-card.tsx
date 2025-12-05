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

// Define the step names in the order they should appear
const STEP_ORDER = [
  "Persona Deviation",
  "Persona Generation",
  "World Creation",
  "Media Loading",
  "Visual Analysis",
  "Upload Visuals",
  "Question Broadcast",
  "Simulation Complete",
  "Stats Extraction",
  "Recommendation Generation",
  "Upload Complete",
  "Report Generation",
] as const;

// Helper function to normalize step names for matching
const normalizeStepName = (name: string): string => {
  return name.toLowerCase().replace(/[_\s-]/g, "");
};

export const ActiveJobCard = ({ job, variant = "default" }: ActiveJobCardProps) => {
  const intermediateStepsMap = job.intermediate_steps || {};
  
  // Create ordered steps array with completion status
  const orderedSteps = STEP_ORDER.map((displayName) => {
    // Find matching backend key by normalizing both names
    const normalizedDisplayName = normalizeStepName(displayName);
    const backendKey = Object.keys(intermediateStepsMap).find((key) => {
      const normalizedKey = normalizeStepName(key);
      return (
        normalizedKey === normalizedDisplayName ||
        normalizedKey.includes(normalizedDisplayName) ||
        normalizedDisplayName.includes(normalizedKey)
      );
    });

    const completed = backendKey ? intermediateStepsMap[backendKey] : false;

    return {
      displayName,
      completed,
    };
  });

  const completedSteps = orderedSteps.filter((step) => step.completed).length;
  const totalSteps = orderedSteps.length;
  const progressPercentage =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

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
      case "finalizing":
        return (
          <Badge variant="default" className="gap-1 bg-blue-500">
            <Loader2 className="h-3 w-3 animate-spin" />
            Finalizing
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

        {/* Processing Steps */}
        <div className={isCompact ? "space-y-2" : "space-y-3"}>
          {!isCompact && (
            <h4 className="text-sm font-semibold">Processing Steps</h4>
          )}
          <div className="space-y-2">
            {orderedSteps.map((step) => (
              <div
                key={step.displayName}
                className="flex items-center gap-3"
              >
                {step.completed ? (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-500">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                ) : (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300" />
                )}
                <p
                  className={`text-sm ${
                    step.completed ? "font-medium text-green-600" : "text-gray-700"
                  }`}
                >
                  {step.displayName}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Metadata */}
        {job.meta_data && (
          <>
            <Separator />
            <div className="grid gap-3 sm:grid-cols-2">
              {/* <div>
                <p className="text-muted-foreground text-xs">Simulations</p>
                <p className="font-medium">
                  {job.meta_data.no_of_simulations}
                </p>
              </div> */}
              <div>
                <p className="text-muted-foreground text-xs">Personas</p>
                <p className="font-medium">{job.meta_data.num_personas}</p>
              </div>
              {/* <div>
                <p className="text-muted-foreground text-xs">Media Files</p>
                <p className="font-medium">{job.meta_data.num_media_files}</p>
              </div> */}
              {/* <div>
                <p className="text-muted-foreground text-xs">User</p>
                <p className="font-medium truncate">
                  {job.meta_data.user_email}
                </p>
              </div> */}
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

