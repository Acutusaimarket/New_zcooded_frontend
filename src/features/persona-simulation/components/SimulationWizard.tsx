import React, { useMemo, useState } from "react";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { useRunSimulation } from "../api/mutation/use-run-simulation";
import type { SimulationFormData, SimulationStep } from "../types";
import { PersonaSelectionStep } from "./PersonaSelectionStep";
import { ProductSelectionStep } from "./ProductSelectionStep";
import { SimulationConfigStep } from "./SimulationConfigStep";

const steps: SimulationStep[] = [
  {
    id: "product",
    title: "Select Product",
    description: "Choose the product to simulate",
    completed: false,
    current: true,
  },
  {
    id: "personas",
    title: "Select Personas",
    description: "Choose the personas to include in the simulation",
    completed: false,
    current: false,
  },
  {
    id: "config",
    title: "Configure Simulation",
    description: "Fine-tune your simulation questions",
    completed: false,
    current: false,
  },
];

export const SimulationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const runSimulationMutation = useRunSimulation();
  const [formData, setFormData] = useState<SimulationFormData>({
    selectedPersonas: [],
    selectedProduct: "",
    simulationType: "detailed",
    model: "gpt-5",
    questions: [],
    noOfSimulations: 1000,
    environments: [],
  });

  const updateFormData = (updates: Partial<SimulationFormData>) => {
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
        return formData.selectedProduct !== "";
      case 1:
        return formData.selectedPersonas.length > 0;
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

    runSimulationMutation.mutate({
      persona_ids: formData.selectedPersonas,
      product_id: formData.selectedProduct,
      simulation_type: formData.simulationType,
      model: formData.model,
      questions: formData?.questions || [],
      environment_names: formData.environments || [],
      no_of_simulations: formData.noOfSimulations,
    });
  };

  const renderStepContent = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <ProductSelectionStep
            selectedProduct={formData.selectedProduct}
            onProductChange={(product) =>
              updateFormData({ selectedProduct: product })
            }
          />
        );
      case 1:
        return (
          <PersonaSelectionStep
            selectedPersonas={formData.selectedPersonas}
            onPersonasChange={(personas) =>
              updateFormData({ selectedPersonas: personas })
            }
          />
        );
      case 2:
        return (
          <SimulationConfigStep
            questions={formData.questions}
            onQuestionsChange={(questions) => updateFormData({ questions })}
            environments={formData.environments}
            onEnvironmentsChange={(environments) =>
              updateFormData({ environments })
            }
            onRunSimulation={handleRunSimulation}
            isRunning={runSimulationMutation.isPending}
          />
        );
      default:
        return null;
    }
  }, [currentStep, formData, runSimulationMutation.isPending]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          Market Fit Simulation
        </h1>
        <p className="text-muted-foreground text-sm">
          Configure and run simulations to understand how different personas
          interact with your products
        </p>
      </div>

      {/* Progress Steps */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
            {steps.map((step, index) => {
              const isCompleted = isStepCompleted(index);
              const isActive = index === currentStep;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                        {
                          "bg-[#42bd00] text-white": isCompleted || isActive,
                          "bg-muted text-muted-foreground":
                            !isCompleted && !isActive,
                        }
                      )}
                    >
                      {isCompleted && index !== currentStep ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-semibold">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={cn("text-sm font-medium", {
                          "text-[#42bd00]": isCompleted || isActive,
                          "text-muted-foreground": !isCompleted && !isActive,
                        })}
                      >
                        {step.title}
                      </span>
                      <span className="text-muted-foreground hidden text-xs sm:block">
                        {step.description}
                      </span>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="bg-border hidden h-0.5 flex-1 sm:block" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xl">{steps[currentStep].title}</span>
            <Badge variant="outline" className="w-fit">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">{renderStepContent}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Previous</span>
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="w-full bg-[#42bd00] hover:bg-[#329600] sm:w-auto"
          >
            <span>Next</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
};
