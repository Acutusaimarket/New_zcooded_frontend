import React from "react";

import {
  Brain,
  Loader2Icon,
  Play,
  RotateCcw,
  Target,
  Users,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useRunSimulation } from "../api/mutation/use-run-simulation";
import type { MarketFitSimulationPayload, SimulationFormData } from "../types";
import { MarketFitSimulationResults } from "./MarketFitSimulationResults";

interface SimulationResultsProps {
  formData: SimulationFormData;
  onRestart: () => void;
}

export const SimulationResults: React.FC<SimulationResultsProps> = ({
  formData,
  onRestart,
}) => {
  const runSimulationMutation = useRunSimulation();

  const runSimulation = async () => {
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

  if (
    !runSimulationMutation.data &&
    !runSimulationMutation.isPending &&
    !runSimulationMutation.isError
  ) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-4">
          <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <Play className="text-primary h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Ready to Run Simulation</h3>
            <p className="text-muted-foreground">
              Your simulation is configured and ready to run. Click the button
              below to start.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="text-primary mx-auto mb-2 h-8 w-8" />
              <p className="font-medium">
                {formData.selectedPersonas.length} Personas
              </p>
              <p className="text-muted-foreground text-sm">
                Selected for simulation
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="text-primary mx-auto mb-2 h-8 w-8" />
              <p className="font-medium">{formData.simulationType}</p>
              <p className="text-muted-foreground text-sm">Simulation type</p>
            </CardContent>
          </Card>
        </div>

        <Button
          onClick={runSimulation}
          size="lg"
          className="flex w-full items-center space-x-2"
        >
          <Play className="h-4 w-4" />
          <span>Run Simulation</span>
        </Button>
      </div>
    );
  }

  if (runSimulationMutation.isPending) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-4">
          <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            {/* <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div> */}
            <Loader2Icon className="text-primary h-8 w-8 animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Running Simulation</h3>
            <p className="text-muted-foreground">
              Analyzing personas and generating insights...
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="text-primary mx-auto mb-2 h-8 w-8" />
              <p className="font-medium">Analyzing Personas</p>
              <p className="text-muted-foreground text-sm">
                Processing behavioral patterns
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="text-primary mx-auto mb-2 h-8 w-8" />
              <p className="font-medium">Evaluating Product</p>
              <p className="text-muted-foreground text-sm">
                Assessing product fit
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Brain className="text-primary mx-auto mb-2 h-8 w-8" />
              <p className="font-medium">Generating Insights</p>
              <p className="text-muted-foreground text-sm">
                Creating recommendations
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (runSimulationMutation.isError) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-red-600">
              Simulation Failed
            </h3>
            <p className="text-muted-foreground">
              There was an error running the simulation. Please try again.
            </p>
          </div>
        </div>

        <Button
          onClick={runSimulation}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
      </div>
    );
  }

  if (!runSimulationMutation.data) return null;

  // Note: This is a type mismatch - runSimulationMutation returns SimulationJob,
  // but MarketFitSimulationResults expects MarketFitSimulationPayload.
  // This should be refactored to fetch results separately when the job completes.
  return (
    <MarketFitSimulationResults
      data={runSimulationMutation.data.data as unknown as MarketFitSimulationPayload}
      onRestart={onRestart}
    />
  );
};
