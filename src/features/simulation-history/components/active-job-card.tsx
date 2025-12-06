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

// Mapping from API intermediate_steps keys to display names
const STEP_MAPPING: Record<string, string> = {
  world_creation: "World Creation",
  persona_deviation: "Persona Deviation",
  product_broadcast: "Product Broadcast", // Will be replaced with product name
  question_broadcast: "Question Broadcast",
  simulation_complete: "Simulation Complete",
  stats_extraction: "Stats Extraction",
  recommendation_generation: "Recommendation Generation",
  cbvs_qa_generation: "Report Generation",
  s3_upload_complete: "Upload Complete",
};

// Define the step order for market_fit_simulation
const MARKET_FIT_STEP_ORDER: string[] = [
  "world_creation",
  "persona_deviation",
  "product_broadcast",
  "question_broadcast",
  "simulation_complete",
  "stats_extraction",
  "recommendation_generation",
  "cbvs_qa_generation",
  "s3_upload_complete",
];

// Helper function to normalize step names for matching
const normalizeStepName = (name: string): string => {
  return name.toLowerCase().replace(/[_\s-]/g, "");
};

export const ActiveJobCard = ({
  job,
  variant = "default",
}: ActiveJobCardProps) => {
  const intermediateStepsMap = job.intermediate_steps || {};

  // Get product name if available (for market_fit_simulation)
  // Fetch product name from product array first, then fallback to meta_data
  const productName =
    (job.product && job.product.length > 0 && job.product[0].name
      ? job.product[0].name
      : null) || job.meta_data?.product_name || null;

  // Get persona names if available (for media_simulation)
  const personaNames =
    job.persona && job.persona.length > 0
      ? job.persona
          .map((p) => p.name)
          .filter((name): name is string => !!name)
      : [];

  // Get steps in the correct order for market_fit_simulation
  const filteredSteps =
    job.job_type === "market_fit_simulation"
      ? MARKET_FIT_STEP_ORDER
      : Object.keys(intermediateStepsMap);

  // Create ordered steps array with completion status
  const orderedSteps = filteredSteps.map((stepKey: string) => {
    const completed = intermediateStepsMap[stepKey] || false;
    let displayName = STEP_MAPPING[stepKey] || stepKey;

    // For product_broadcast, show product name if available
    if (stepKey === "product_broadcast" && productName) {
      displayName = productName;
    } else if (
      !STEP_MAPPING[stepKey] &&
      job.job_type !== "market_fit_simulation"
    ) {
      // For non-market-fit jobs, try to match with normalized names
      const normalizedKey = normalizeStepName(stepKey);
      const matchedDisplayName = Object.values(STEP_MAPPING).find(
        (display) => {
          const normalizedDisplay = normalizeStepName(display);
          return (
            normalizedKey === normalizedDisplay ||
            normalizedKey.includes(normalizedDisplay) ||
            normalizedDisplay.includes(normalizedKey)
          );
        }
      );
      displayName =
        matchedDisplayName ||
        stepKey
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
    }

    return {
      displayName,
      completed,
      stepKey,
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
              {productName && (
                <div>
                  <p className="text-muted-foreground text-xs">Product Name</p>
                  <p className="font-medium">{productName}</p>
                </div>
              )}
              {personaNames.length > 0 && (
                <div>
                  <p className="text-muted-foreground text-xs">Persona Name</p>
                  <p className="font-medium">
                    {personaNames.length === 1
                      ? personaNames[0]
                      : personaNames.join(", ")}
                  </p>
                </div>
              )}
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

