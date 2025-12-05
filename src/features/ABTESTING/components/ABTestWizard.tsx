import React, { useMemo, useState } from "react";

import { ArrowLeft, ArrowRight, CheckCircle, Circle, Play } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ABTestHistoryDetails } from "@/features/ABTESTING-HISTORY";
import { cn } from "@/lib/utils";

import { useRunABTest } from "../api/ab-testing.api";
import type { ABTestFormData, ABTestStep } from "../types";
import { PersonaSelectionStep } from "./PersonaSelectionStep";
import { ProductSelectionStep } from "./ProductSelectionStep";
import { TestConfigurationStep } from "./TestConfigurationStep";

const steps: ABTestStep[] = [
  {
    id: "products",
    title: "Select Variants",
    description: "Choose product variants to compare",
    completed: false,
    current: true,
  },
  {
    id: "persona",
    title: "Select Persona",
    description: "Choose target persona for testing",
    completed: false,
    current: false,
  },
  {
    id: "config",
    title: "Configuration",
    description: "Select environments for testing",
    completed: false,
    current: false,
  },
  {
    id: "results",
    title: "A/B Test Results",
    description: "View A/B test results",
    completed: false,
    current: false,
  },
];

export const ABTestWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ABTestFormData>({
    selectedProducts: [],
    selectedPersona: "",
    environments: [],
  });

  const runABTestMutation = useRunABTest();

  const updateFormData = (updates: Partial<ABTestFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

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
        return formData.selectedProducts.length >= 2;
      case 1:
        return formData.selectedPersona !== "";
      case 2:
        return true; // Environments are optional, so step is always complete
      default:
        return false;
    }
  };

  const canProceed = (): boolean => {
    return isStepCompleted(currentStep);
  };

  const handleRunTest = () => {
    runABTestMutation.mutate(
      {
        product_ids: formData.selectedProducts,
        persona_id: formData.selectedPersona,
      },
      {
        onSuccess: () => {
          setCurrentStep(3);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setFormData({
      selectedProducts: [],
      selectedPersona: "",
      environments: [],
    });
  };

  const renderStepContent = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <ProductSelectionStep
            selectedProducts={formData.selectedProducts}
            onProductsChange={(products) =>
              updateFormData({ selectedProducts: products })
            }
          />
        );
      case 1:
        return (
          <PersonaSelectionStep
            selectedPersona={formData.selectedPersona}
            onPersonaChange={(persona) =>
              updateFormData({ selectedPersona: persona })
            }
          />
        );
      case 2:
        return (
          <TestConfigurationStep
            environments={formData.environments}
            onEnvironmentsChange={(environments) =>
              updateFormData({ environments })
            }
          />
        );
      case 3:
        return (
          <ABTestHistoryDetails
            onRestart={handleRestart}
            test={runABTestMutation.data!}
          />
        );
      default:
        return null;
    }
  }, [currentStep, formData, runABTestMutation.data]);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-2 text-start">
        <h1 className="text-3xl font-bold">Price Simulator</h1>
        <p className="text-muted-foreground">
          Compare product variants against different personas to optimize price
          fit
        </p>
      </div>

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
      <Card
        className={cn(
          currentStep === 3 && "border-none bg-transparent shadow-none"
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{steps[currentStep].title}</span>
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>{renderStepContent}</CardContent>
      </Card>

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
            onClick={currentStep === 2 ? handleRunTest : nextStep}
            disabled={!canProceed() || runABTestMutation.isPending}
            className="flex items-center space-x-2"
          >
            {runABTestMutation.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Running Test...</span>
              </>
            ) : currentStep === 2 ? (
              <>
                <Play className="h-4 w-4" />
                <span>Run A/B Test</span>
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
      {runABTestMutation.isError && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="text-destructive">
              <strong>Error:</strong>{" "}
              {runABTestMutation.error?.message || "Failed to run A/B test"}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
