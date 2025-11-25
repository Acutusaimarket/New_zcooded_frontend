import React, { useMemo, useState } from "react";

import { ArrowLeft, ArrowRight, CheckCircle, Circle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { SimulationFormData, SimulationStep } from "../types";
import { PersonaSelectionStep } from "./PersonaSelectionStep";
import { ProductSelectionStep } from "./ProductSelectionStep";
import { SimulationConfigStep } from "./SimulationConfigStep";
import { SimulationResults } from "./SimulationResults";

const steps: SimulationStep[] = [
  {
    id: "personas",
    title: "Select Personas",
    description: "Choose the personas to include in the simulation",
    completed: false,
    current: true,
  },
  {
    id: "product",
    title: "Select Product",
    description: "Choose the product to simulate",
    completed: false,
    current: false,
  },
  {
    id: "config",
    title: "Configuration",
    description: "Set simulation type and model",
    completed: false,
    current: false,
  },
  {
    id: "results",
    title: "Results",
    description: "View simulation results",
    completed: false,
    current: false,
  },
];

export const SimulationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SimulationFormData>({
    selectedPersonas: [],
    selectedProduct: "",
    simulationType: "detailed",
    model: "gpt-5",
    questions: [],
    noOfSimulations: 1000,
    contextLayer: "[]",
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
        return formData.selectedPersonas.length > 0;
      case 1:
        return formData.selectedProduct !== "";
      case 2:
        return Boolean(formData.simulationType);
      default:
        return false;
    }
  };

  const canProceed = (): boolean => {
    return isStepCompleted(currentStep);
  };

  const renderStepContent = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <PersonaSelectionStep
            selectedPersonas={formData.selectedPersonas}
            onPersonasChange={(personas) =>
              updateFormData({ selectedPersonas: personas })
            }
          />
        );
      case 1:
        return (
          <ProductSelectionStep
            selectedProduct={formData.selectedProduct}
            onProductChange={(product) =>
              updateFormData({ selectedProduct: product })
            }
          />
        );
      case 2:
        return (
          <SimulationConfigStep
            simulationType={formData.simulationType}
            onConfigChange={(config) => updateFormData(config)}
            questions={formData.questions}
            onQuestionsChange={(questions) => updateFormData({ questions })}
            noOfSimulations={formData.noOfSimulations}
            onNoOfSimulationsChange={(noOfSimulations) =>
              updateFormData({ noOfSimulations })
            }
            contextLayer={formData.contextLayer}
            onContextLayerChange={(contextLayer) =>
              updateFormData({ contextLayer })
            }
          />
        );
      case 3:
        return (
          <SimulationResults
            formData={formData}
            onRestart={() => setCurrentStep(0)}
          />
        );
      default:
        return null;
    }
  }, [currentStep, formData]);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-2 text-start">
        <h1 className="text-3xl font-bold">Persona Simulation</h1>
        <p className="text-muted-foreground">
          Configure and run simulations to understand how different personas
          interact with your products
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
      <Card>
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
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center space-x-2"
          >
            <span>
              {currentStep === steps.length - 2 ? "Run Simulation" : "Next"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
