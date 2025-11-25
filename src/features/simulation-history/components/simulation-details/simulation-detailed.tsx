import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useSimulationTabs } from "../../hooks/use-simulation-tabs";
import type { SimulationDetailsResponse } from "../../types/simulation.types";
import {
  formatDate,
  getSimulationTypeVariant,
} from "../../utils/simulation.utils";
import { PersonaResults } from "./persona-results";
import { ProductDetails } from "./product-details";
import { SimulationOverview } from "./simulation-overview";

interface SimulationDetailsProps {
  data: SimulationDetailsResponse["data"];
  onRestart?: () => void;
}

export const SimulationDetails: React.FC<SimulationDetailsProps> = ({
  data,
  onRestart,
}) => {
  const { activeTab, setActiveTab, tabs } = useSimulationTabs();

  const exportSimulationResults = () => {
    if (!data) return;

    const simulation = data;

    // Create export data structure
    const exportData = {
      export_info: {
        exported_at: new Date().toISOString(),
        simulation_id: simulation._id,
        product_name: simulation.product_name,
        simulation_type: simulation.simulation_type,
        created_at: simulation.created_at,
        total_personas: simulation.personas.length,
      },
      overall_summary: {
        overall_interest_level: simulation.summary.overall_interest_level,
        overall_purchase_intent: simulation.summary.overall_purchase_intent,
        overall_price_perception: simulation.summary.overall_price_perception,
        price_perception_score: simulation.summary.price_perception_score,
        overall_pmf_index: simulation.summary.overall_pmf_index,
        overall_recommendation: simulation.summary.overall_recommendation,
        reason_to_reject: simulation.summary.reason_to_reject,
        overall_summary: simulation.summary.overall_summary,
        key_concerns: simulation.summary.key_concerns,
        best_fit_personas: simulation.summary.best_fit_personas,
        overall_pmf_score: simulation.summary.overall_pmf_score,
        overall_trial_to_adoption_score:
          simulation.summary.overall_trial_to_adoption_score,
        overall_value_proposition_clarity_score:
          simulation.summary.overall_value_proposition_clarity_score,
        overall_problem_solution_fit_score:
          simulation.summary.overall_problem_solution_fit_score,
        overall_affinity_cluster_match_score:
          simulation.summary.overall_affinity_cluster_match_score,
        overall_usability_score: simulation.summary.overall_usability_score,
        overall_satisfaction_score:
          simulation.summary.overall_satisfaction_score,
        overall_adoption_rate: simulation.summary.overall_adoption_rate,
        overall_churn_probability: simulation.summary.overall_churn_probability,
        overall_retention_intent: simulation.summary.overall_retention_intent,
      },
      persona_results: simulation.persona_results.map((result) => ({
        persona_id: result.persona_id,
        interest_level: result.result.interest_level,
        purchase_intent: result.result.purchase_intent,
        price_perception: result.result.price_perception,
        price_perception_score: result.result.price_perception_score,
        pmf_index: result.result.pmf_index,
        decision_timeline: result.result.decision_timeline,
        key_concerns: result.result.key_concerns,
        motivation_drivers: result.result.motivation_drivers,
        recommendation_likelihood: result.result.recommendation_likelihood,
        summary: result.result.summary,
        very_disappointed_responses: result.result.very_disappointed_responses,
        intending_to_stay: result.result.intending_to_stay,
        predicted_drop: result.result.predicted_drop,
        users_likely_to_adopt: result.result.users_likely_to_adopt,
        satisfaction: result.result.satisfaction,
        ease_of_use: result.result.ease_of_use,
        personas_alligning_well: result.result.personas_alligning_well,
        users_agreeing_problem_solution_fit:
          result.result.users_agreeing_problem_solution_fit,
        users_clearly_understanding_value:
          result.result.users_clearly_understanding_value,
        users_converting_from_trial: result.result.users_converting_from_trial,
        total_users_simulated: result.result.total_users_simulated,
        net_promoter_score: result.result.net_promoter_score,
        pmf_score: result.result.pmf_score,
        retention_intent: result.result.retention_intent,
        churn_probability: result.result.churn_probability,
        adoption_rate: result.result.adoption_rate,
        satisfaction_score: result.result.satisfaction_score,
        usability_score: result.result.usability_score,
        affinity_cluster_match_score:
          result.result.affinity_cluster_match_score,
        problem_solution_fit_score: result.result.problem_solution_fit_score,
        value_proposition_clarity_score:
          result.result.value_proposition_clarity_score,
        trial_to_adoption_score: result.result.trial_to_adoption_score,
      })),
      personas: simulation.personas.map((persona) => ({
        id: persona._id,
        name: persona.name,
        category: persona.persona_category,
        description: persona.description,
        demographics: persona.demographic,
        traits: persona.traits,
      })),
    };

    // Create and download JSON file
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `simulation-results-${simulation.product_name.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const simulation = data;

  return (
    <div className="bg-background min-h-screen">
      {/* Header Section */}
      <div className="bg-card/50 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            {/* Navigation */}
            <div className="flex items-center justify-between">
              {onRestart ? (
                <Button variant="outline" size="sm" onClick={onRestart}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restart Simulation
                </Button>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard/simulation">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Link>
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={exportSimulationResults}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Results</span>
              </Button>
            </div>

            {/* Title and Basic Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  {simulation.product_name}
                </h1>
                <Badge
                  variant={getSimulationTypeVariant(simulation.simulation_type)}
                >
                  {simulation.simulation_type}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Simulation created on {formatDate(simulation.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(
              value as "overview" | "persona-results" | "product-details"
            )
          }
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SimulationOverview simulation={simulation} />
          </TabsContent>

          <TabsContent value="persona-results" className="space-y-6">
            <PersonaResults simulation={simulation} />
          </TabsContent>

          <TabsContent value="product-details" className="space-y-6">
            <ProductDetails simulation={simulation} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
