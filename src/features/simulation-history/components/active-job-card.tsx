import { useState } from "react";
import { CheckCircle2, Clock, Loader2, User, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import type { SimulationJob } from "../types/job.types";

interface ActiveJobCardProps {
  job: SimulationJob;
  variant?: "default" | "compact";
  onViewSimulation?: () => void;
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
  s3_upload_complete: "S3 Upload Complete",
  persona_generation: "Persona Generation",
  media_loading: "Media Loading",
  visual_analysis: "Visual Analysis",
  s3_upload_visuals: "S3 Upload Visuals",
  data_loaded: "Data Loaded",
  clustering_completed: "Clustering Completed",
  personas_generated: "Personas Generated",
  personas_saved: "Personas Saved",
  credits_tracked: "Credits Tracked",
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

const PERSONA_STEP_ORDER: string[] = [
  "data_loaded",
  "clustering_completed",
  "personas_generated",
  "personas_saved",
  "credits_tracked",
];

// Helper function to normalize step names for matching
const normalizeStepName = (name: string): string => {
  return name.toLowerCase().replace(/[_\s-]/g, "");
};

export const ActiveJobCard = ({
  job,
  variant = "default",
  onViewSimulation,
}: ActiveJobCardProps) => {
  const intermediateStepsMap = job.intermediate_steps || {};
  const isMediaSimulation = job.job_type === "media_simulation";
  const isPersonaClustering = job.job_type === "persona_clustering";
  const firstMediaFile = job.media_files && job.media_files.length > 0 ? job.media_files[0] : null;
  const isImage = firstMediaFile?.filetype?.startsWith("image/");
  const isVideo = firstMediaFile?.filetype?.startsWith("video/");

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
  const personas = Array.isArray(job.persona) ? job.persona : [];

  // Get steps in the correct order for market_fit_simulation
  const filteredSteps =
    job.job_type === "market_fit_simulation"
      ? MARKET_FIT_STEP_ORDER
      : job.job_type === "persona_clustering"
        ? PERSONA_STEP_ORDER
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
  const isMarketFitSimulation = job.job_type === "market_fit_simulation";
  const hideStartTime = isPersonaClustering && job.status === "completed";
  const hidePersonaMetaData = isPersonaClustering && job.status === "completed";
  // Active jobs (in_progress, finalizing) should be expanded by default
  const isActiveJob = job.status === "in_progress" || job.status === "finalizing";
  const [isExpanded, setIsExpanded] = useState(
    isActiveJob || (isMarketFitSimulation && isActiveJob)
  );

  // Specialized polished layout for completed persona clustering
  if (isPersonaClustering && job.status === "completed") {
    const personaCount = personas.length || job.meta_data?.num_personas;

    return (
      <Card className="w-full border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-lg">Generated Personas</CardTitle>
              {personaCount ? (
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">
                    {personaCount} persona{personaCount === 1 ? "" : "s"}
                  </Badge>
                </div>
              ) : null}
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {orderedSteps.length > 0 && (
            <div className="rounded-lg bg-muted/50 p-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Processing Steps
              </h4>
              <div className="mt-2 space-y-1.5">
                {orderedSteps.map((step) => (
                  <div key={step.stepKey} className="flex items-center gap-2">
                    {step.completed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <p
                      className={`text-xs ${
                        step.completed ? "font-medium text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.displayName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {personas.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Personas</h4>
              <div className="space-y-3">
                {personas.map((persona) => {
                  const name =
                    typeof persona.name === "string" && persona.name.trim().length > 0
                      ? persona.name
                      : "Persona";
                  const description =
                    typeof persona.description === "string" && persona.description.trim().length > 0
                      ? persona.description
                      : undefined;

                  return (
                    <div
                      key={persona._id ?? name}
                      className="border-border/60 rounded-lg border bg-card/40 p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">{name}</p>
                        <Badge variant="secondary" className="text-[10px]">
                          Generated
                        </Badge>
                      </div>
                      {description && (
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                          {description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>

        {onViewSimulation && (
          <CardFooter className="pt-0">
            <Button className="w-full" onClick={onViewSimulation}>
              View Personas
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  }

  // Special layout for market_fit_simulation jobs (all tabs)
  if (isMarketFitSimulation) {
    // Collapsed view - only product name
    if (!isExpanded) {
      return (
        <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg">
          <CardContent className="p-4">
            {/* Product Name */}
            {productName && (
              <div className="mb-3">
                <p className="text-base font-semibold text-foreground">
                  {productName}
                </p>
              </div>
            )}

            {/* View Details Button */}
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setIsExpanded(true)}
            >
              View Details
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      );
    }

    // Expanded view - full card with all details
    return (
      <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">
                {format(new Date(job.created_at), "dd MMMM yyyy")}
              </p>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Product Name */}
          {productName && (
            <div>
              <p className="text-base font-semibold text-foreground">
                {productName}
              </p>
            </div>
          )}

          {/* Intermediate Steps */}
          {orderedSteps.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Processing Steps
              </h4>
              <div className="space-y-1.5">
                {orderedSteps.map((step) => (
                  <div key={step.stepKey} className="flex items-center gap-2">
                    {step.completed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
                    ) : (
                      <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <p
                      className={`text-xs ${
                        step.completed
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.displayName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Persona Info */}
          {job.meta_data?.num_personas && (
            <div className="flex items-center gap-2 pt-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {job.meta_data.num_personas}{" "}
                  {job.meta_data.num_personas === 1 ? "Persona" : "Personas"}
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-4">
          {/* Collapse Button */}
          <Button
            className="w-full"
            variant="outline"
            onClick={() => setIsExpanded(false)}
          >
            Collapse
            <ChevronUp className="ml-2 h-4 w-4" />
          </Button>

          {/* View Simulation Button */}
          {onViewSimulation && (
            <Button
              className="w-full"
              variant="default"
              onClick={onViewSimulation}
              disabled={job.status !== "completed"}
            >
              View Simulation
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  // Special layout for all media_simulation jobs (all tabs)
  if (isMediaSimulation) {
    // Collapsed view - only image and filename
    if (!isExpanded) {
      return (
        <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg">
          {/* Media Preview */}
          {firstMediaFile?.url && (
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              {isImage ? (
                <img
                  src={firstMediaFile.url}
                  alt={firstMediaFile.filename || "Media preview"}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : isVideo ? (
                <video
                  src={firstMediaFile.url}
                  className="h-full w-full object-cover"
                  controls={false}
                  muted
                  playsInline
                  onError={(e) => {
                    const target = e.target as HTMLVideoElement;
                    target.style.display = "none";
                  }}
                />
              ) : null}
            </div>
          )}

          <CardContent className="p-4">
            {/* Filename */}
            {firstMediaFile?.filename && (
              <div className="mb-3">
                <p className="text-sm font-semibold text-foreground">
                  {firstMediaFile.filename}
                </p>
              </div>
            )}

            {/* View Full Card Button */}
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setIsExpanded(true)}
            >
              View Details
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      );
    }

    // Expanded view - full card with all details
    return (
      <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg">
        {/* Media Preview */}
        {firstMediaFile?.url && (
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {isImage ? (
              <img
                src={firstMediaFile.url}
                alt={firstMediaFile.filename || "Media preview"}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            ) : isVideo ? (
              <video
                src={firstMediaFile.url}
                className="h-full w-full object-cover"
                controls={false}
                muted
                playsInline
                onError={(e) => {
                  const target = e.target as HTMLVideoElement;
                  target.style.display = "none";
                }}
              />
            ) : null}
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">
                {format(new Date(job.created_at), "dd MMMM yyyy")}
              </p>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filename */}
          {firstMediaFile?.filename && (
            <div>
              <p className="text-sm font-semibold text-foreground">
                {firstMediaFile.filename}
              </p>
            </div>
          )}

          {/* Intermediate Steps */}
          {orderedSteps.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Processing Steps
              </h4>
              <div className="space-y-1.5">
                {orderedSteps.map((step) => (
                  <div key={step.stepKey} className="flex items-center gap-2">
                    {step.completed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
                    ) : (
                      <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <p
                      className={`text-xs ${
                        step.completed
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.displayName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Persona Info */}
          {personaNames.length > 0 && (
            <div className="flex items-center gap-2 pt-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {job.meta_data?.num_personas || personaNames.length}{" "}
                  {personaNames.length === 1 ? "Persona" : "Personas"}:{" "}
                  {personaNames.length === 1
                    ? personaNames[0]
                    : personaNames.slice(0, 2).join(", ") +
                      (personaNames.length > 2
                        ? ` +${personaNames.length - 2} more`
                        : "")}
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-4">
          {/* Collapse Button */}
          <Button
            className="w-full"
            variant="outline"
            onClick={() => setIsExpanded(false)}
          >
            Collapse
            <ChevronUp className="ml-2 h-4 w-4" />
          </Button>

          {/* View Simulation Button */}
          {onViewSimulation && (
            <Button
              className="w-full"
              variant="default"
              onClick={onViewSimulation}
              disabled={job.status !== "completed"}
            >
              View Result
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  // Default layout for other job types or non-completed media_simulation
  return (
    <Card className={isCompact ? "w-full border-border/60" : "w-full"}>
      <CardHeader className={isCompact ? "px-4 py-3" : undefined}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className={isCompact ? "text-base" : "text-lg"}>
              {isPersonaClustering
                ? "Persona Clustering"
                : job.job_type === "media_simulation"
                  ? "Media Simulation"
                  : "Simulation"}
            </CardTitle>
            {!hideStartTime && (
              <p className={isCompact ? "text-muted-foreground text-xs" : "text-muted-foreground text-sm"}>
                Started {format(new Date(job.created_at), "PPp")}
              </p>
            )}
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

        {isPersonaClustering && personas.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Personas</h4>
              {personas.map((persona) => {
                const name =
                  typeof persona.name === "string" && persona.name.trim().length > 0
                    ? persona.name
                    : "Persona";
                const description =
                  typeof persona.description === "string" && persona.description.trim().length > 0
                    ? persona.description
                    : undefined;

                return (
                  <div key={persona._id ?? name} className="rounded-lg border border-border/60 p-3">
                    <p className="text-sm font-semibold text-foreground">{name}</p>
                    {description && (
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Metadata */}
        {job.meta_data && (
          <>
            <Separator />
            <div className="grid gap-3 sm:grid-cols-2">
              {!hidePersonaMetaData && (
                <div>
                  <p className="text-muted-foreground text-xs">Personas</p>
                  <p className="font-medium">{job.meta_data.num_personas}</p>
                </div>
              )}
              {productName && (
                <div>
                  <p className="text-muted-foreground text-xs">Product Name</p>
                  <p className="font-medium">{productName}</p>
                </div>
              )}
              {personaNames.length > 0 && !hidePersonaMetaData && (
                <div>
                  <p className="text-muted-foreground text-xs">Persona Name</p>
                  <p className="font-medium">
                    {personaNames.length === 1
                      ? personaNames[0]
                      : personaNames.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* View Personas CTA inside card for persona clustering */}
        {onViewSimulation &&
          isPersonaClustering &&
          job.status === "completed" && (
            <>
              <Separator />
              <Button className="w-full" onClick={onViewSimulation}>
                View Personas
              </Button>
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

