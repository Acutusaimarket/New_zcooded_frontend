import React, { useCallback, useMemo, useState } from "react";

import { ArrowLeft, ArrowRight, CheckCircle, Circle, Play } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MediaFile } from "@/types/media-simulation.type";

import { useMediaSimulationMutation } from "../api";
import { ImprovedMediaSimulationResults } from "./ImprovedMediaSimulationResults";
import { MediaConfigurationStep } from "./MediaConfigurationStep";
import { MediaPersonaSelectionStep } from "./MediaPersonaSelectionStep";
import { MediaUploadStep } from "./MediaUploadStep";

interface MediaSimulationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

const steps: MediaSimulationStep[] = [
  {
    id: "media",
    title: "Upload Media",
    description: "Upload images or videos to analyze",
    completed: false,
    current: true,
  },
  {
    id: "selection",
    title: "Select Personas & Product",
    description: "Choose target personas and product for analysis",
    completed: false,
    current: false,
  },
  {
    id: "config",
    title: "Configuration",
    description: "Set analysis parameters and questions",
    completed: false,
    current: false,
  },
  {
    id: "results",
    title: "Analysis Results",
    description: "View media simulation results",
    completed: false,
    current: false,
  },
];

interface MediaSimulationWizardFormData {
  mediaFiles: MediaFile[];
  selectedPersonaIds: string[];
  // selectedProductId: string;
  questions: string[];
  environments: string[];
}

export const MediaSimulationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<MediaSimulationWizardFormData>({
    mediaFiles: [],
    selectedPersonaIds: [],
    // selectedProductId: "",
    questions: [],
    environments: [],
  });

  const navigate = useNavigate();

  const mediaSimulationMutation = useMediaSimulationMutation({
    onSuccess: () => {
      toast.success(
        "Media simulation job created. Redirecting to history..."
      );
      navigate("/dashboard/media-simulation/history");
    },
    onError: (error) => {
      console.error("Media simulation failed:", error);

      // Provide more specific error messages based on the error
      let errorMessage = "Media simulation failed. Please try again.";

      // Check for 422 errors (Unprocessable Entity) - typically validation errors
      if (error.message.includes("422") || error.message.includes("External simulation service error")) {
        errorMessage =
          "The simulation service could not process your request. Please check that all required fields are filled correctly, your files are in supported formats, and try again.";
      } else if (error.message.includes("image file")) {
        errorMessage =
          "There was an issue processing your image files. Please ensure they are in supported formats (JPEG, PNG, GIF, WebP) and try again.";
      } else if (error.message.includes("File too large")) {
        errorMessage =
          "One or more files are too large. Please reduce file sizes and try again.";
      } else if (error.message.includes("Unsupported file format")) {
        errorMessage =
          "One or more files are in an unsupported format. Please use supported image or video formats.";
      } else if (error.message.includes("Invalid request") || error.message.includes("Validation failed")) {
        errorMessage =
          "Invalid request. Please check your file formats and try again.";
      }

      toast.error(errorMessage);
    },
  });

  const updateFormData = useCallback(
    (updates: Partial<MediaSimulationWizardFormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepCompleted = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        return formData.mediaFiles.length > 0;
      case 1:
        return (
          formData.selectedPersonaIds.length > 0
          // formData.selectedProductId !== ""
        );
      case 2:
        return formData.environments.length > 0; // At least one environment is required
      default:
        return false;
    }
  };

  const canProceed = (): boolean => {
    return isStepCompleted(currentStep);
  };

  const handleRunSimulation = () => {
    // Validate that at least one environment is selected
    if (formData.environments.length === 0) {
      toast.error("Please select at least one environment to proceed");
      return;
    }

    const simulationData = {
      persona_ids: formData.selectedPersonaIds,
      // product_id: formData.selectedProductId,
      questions: formData.questions,
      environment_names: formData.environments,
      simulation_type: "detailed" as const,
      model: "gemini-2.0-flash",
      media_files: formData.mediaFiles.map((f) => f.file),
    };

    mediaSimulationMutation.mutate(simulationData);
  };

  const handlePersonaToggle = useCallback(
    (personaId: string) => {
      const currentIds = formData.selectedPersonaIds;
      const newIds = currentIds.includes(personaId)
        ? currentIds.filter((id) => id !== personaId)
        : [...currentIds, personaId];
      updateFormData({ selectedPersonaIds: newIds });
    },
    [formData.selectedPersonaIds, updateFormData]
  );

  const renderStepContent = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <MediaUploadStep
            mediaFiles={formData.mediaFiles}
            onFilesChange={(files) => updateFormData({ mediaFiles: files })}
          />
        );
      case 1:
        return (
          <div className="space-y-6">
            <MediaPersonaSelectionStep
              selectedPersonaIds={formData.selectedPersonaIds}
              onPersonaToggle={handlePersonaToggle}
            />
            {/* <MediaProductSelectionStep
              selectedProductId={formData.selectedProductId}
              onProductSelect={(productId) =>
                updateFormData({ selectedProductId: productId })
              }
            /> */}
          </div>
        );
      case 2:
        return (
          <MediaConfigurationStep
            questions={formData.questions}
            onQuestionsChange={(questions) => updateFormData({ questions })}
            environments={formData.environments}
            onEnvironmentsChange={(environments) => updateFormData({ environments })}
          />
        );
      case 3:
        return (
          <ImprovedMediaSimulationResults
            results={mediaSimulationMutation.data!}
            onDownloadReport={async () => {
              if (mediaSimulationMutation.data) {
                try {
                  // Dynamic import to ensure the module is loaded
                  const { generateMediaSimulationPDF } = await import(
                    "../utils/generatePDF"
                  );
                  generateMediaSimulationPDF(mediaSimulationMutation.data);
                  toast.success("PDF report downloaded successfully!");
                } catch (error) {
                  console.error("Error generating PDF:", error);
                  toast.error("Failed to generate PDF report");
                }
              }
            }}
            onShareResults={() => {
              if (mediaSimulationMutation.data && navigator.share) {
                navigator
                  .share({
                    title: "Media Simulation Results",
                    text: `Check out these media simulation results: ${mediaSimulationMutation.data.kpi_summary?.length || 0} KPI metrics analyzed.`,
                    url: window.location.href,
                  })
                  .then(() => {
                    toast.success("Results shared successfully!");
                  })
                  .catch((error) => {
                    console.error("Error sharing:", error);
                    // Fallback to clipboard
                    navigator.clipboard
                      .writeText(window.location.href)
                      .then(() => {
                        toast.success("Link copied to clipboard!");
                      });
                  });
              } else {
                // Fallback to clipboard
                navigator.clipboard.writeText(window.location.href).then(() => {
                  toast.success("Link copied to clipboard!");
                });
              }
            }}
          />
        );
      default:
        return null;
    }
  }, [
    currentStep,
    formData,
    mediaSimulationMutation.data,
    handlePersonaToggle,
    updateFormData,
  ]);

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      {
                        "bg-primary text-primary-foreground border-primary":
                          index === currentStep,
                        "border-green-500 bg-green-500 text-white":
                          isStepCompleted(index) && index !== currentStep,
                        "bg-muted text-muted-foreground border-muted":
                          !isStepCompleted(index) && index !== currentStep,
                      }
                    )}
                  >
                    {isStepCompleted(index) && index !== currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="bg-muted mx-4 h-0.5 flex-1" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 3 ? (
        renderStepContent
      ) : currentStep < steps.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{steps[currentStep]?.title || "Step"}</span>
              <Badge variant="outline">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>{renderStepContent}</CardContent>
        </Card>
      ) : (
        <div>Invalid step</div>
      )}

      {/* Navigation */}
      {currentStep < 3 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <Button
            onClick={currentStep === 2 ? handleRunSimulation : nextStep}
            disabled={!canProceed() || mediaSimulationMutation.isPending}
            className="flex items-center space-x-2"
          >
            {mediaSimulationMutation.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Analyzing...</span>
              </>
            ) : currentStep === 2 ? (
              <>
                <Play className="h-4 w-4" />
                <span>Run Analysis</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Error Display */}
      {mediaSimulationMutation.isError && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="text-destructive">
              <strong>Error:</strong>{" "}
              {mediaSimulationMutation.error?.message ||
                "Failed to run media simulation"}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing State */}
      {mediaSimulationMutation.isPending && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Processing Media Simulation...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                <p className="text-muted-foreground text-sm">
                  Analyzing media files with AI personas. This may take a few
                  minutes...
                </p>
              </div>
              <div className="text-muted-foreground space-y-1 text-xs">
                <p>• Uploading and processing media files</p>
                <p>• Running persona-based analysis</p>
                <p>• Generating insights and comparisons</p>
                <p>• Preparing comprehensive report</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
