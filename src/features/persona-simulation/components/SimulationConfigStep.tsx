import React, { useState } from "react";

import { AlertCircle, Globe, Loader2, Plus, Trash2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TooltipWrapper } from "@/components/ui/tooltip";

interface SimulationConfigStepProps {
  questions: string[];
  onQuestionsChange: (questions: string[]) => void;
  environments: string[];
  onEnvironmentsChange: (environments: string[]) => void;
  onRunSimulation: () => void;
  isRunning?: boolean;
}

interface EnvironmentOption {
  id: string;
  label: string;
  description: string;
}

const environmentOptions: EnvironmentOption[] = [
  {
    id: "Social Feed Scroll",
    label: "Social Feed Scroll",
    description:
      "Simulates user behavior while scrolling through social media feeds, capturing impulsive purchase decisions and social influence patterns.",
  },
  {
    id: "Device & Tech Context",
    label: "Device & Tech Context",
    description:
      "Considers the device type, screen size, and technical capabilities that influence how users interact with and perceive the product.",
  },
  {
    id: "Marketplace Browse",
    label: "Marketplace Browse",
    description:
      "Represents browsing behavior in e-commerce marketplaces where users compare multiple options and make informed purchase decisions.",
  },
  {
    id: "Influencer Click",
    label: "Influencer Click",
    description:
      "Models user behavior when discovering products through influencer recommendations and sponsored content, focusing on trust and social proof.",
  },
  {
    id: "Urgent Need / Emergency",
    label: "Urgent Need / Emergency",
    description:
      "Captures decision-making patterns when users have immediate, time-sensitive needs, prioritizing speed and availability over price considerations.",
  },
  {
    id: "Budget Crunch",
    label: "Budget Crunch",
    description:
      "Simulates constrained financial situations where users prioritize value, discounts, and cost-effectiveness in their purchase decisions.",
  },
  {
    id: "Festival / Big Sale Event",
    label: "Festival / Big Sale Event",
    description:
      "Represents shopping behavior during major sales events and festivals, where users are more price-sensitive and deal-driven.",
  },
];

export const SimulationConfigStep: React.FC<SimulationConfigStepProps> = ({
  questions,
  onQuestionsChange,
  environments,
  onEnvironmentsChange,
  onRunSimulation,
  isRunning,
}) => {
  const [newQuestion, setNewQuestion] = useState("");
  const maxQuestionLength = 200;

  const handleAddQuestion = () => {
    if (newQuestion.trim() && newQuestion.length <= maxQuestionLength) {
      onQuestionsChange([...questions, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    onQuestionsChange(updatedQuestions);
  };

  const handleEnvironmentToggle = (environmentId: string) => {
    if (environments.includes(environmentId)) {
      onEnvironmentsChange(environments.filter((id) => id !== environmentId));
    } else {
      onEnvironmentsChange([...environments, environmentId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Questions Management */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold">Questions</h3>
            <p className="text-muted-foreground mt-1 text-xs">
              What would you like to know about this product?
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddQuestion}
            disabled={
              !newQuestion.trim() || newQuestion.length > maxQuestionLength
            }
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add question</span>
          </Button>
        </div>

        {/* Single inline question input like design */}
        <div className="space-y-1">
          <Input
            id="new-question"
            placeholder="eg., How does this product compare to competitors?"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddQuestion();
              }
            }}
            className="h-10 text-sm"
            maxLength={maxQuestionLength}
          />
          <div className="text-muted-foreground flex items-center justify-between text-[11px]">
            <span>
              {newQuestion.length > maxQuestionLength * 0.8 && (
                <span className="text-amber-600">
                  {maxQuestionLength - newQuestion.length} characters remaining
                </span>
              )}
            </span>
            <span>
              {newQuestion.length}/{maxQuestionLength}
            </span>
          </div>
        </div>

        {/* Compact questions list below input (keeps existing behaviour) */}
        {questions.length > 0 && (
          <div className="space-y-1 pt-1">
            {questions.map((question, index) => (
              <div
                key={index}
                className="border-muted bg-muted/40 flex items-center justify-between rounded-md border px-3 py-2 text-xs"
              >
                <span className="line-clamp-1">
                  <span className="text-muted-foreground font-medium">
                    Q{index + 1}:
                  </span>{" "}
                  {question}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:bg-destructive/10 ml-2"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Environments Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Globe className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold">Environments</h3>
          <Badge
            variant={environments.length > 0 ? "secondary" : "destructive"}
            className="ml-2"
          >
            {environments.length} selected
          </Badge>
          {environments.length === 0 && (
            <span className="text-destructive text-sm font-medium">
              * Required
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          Select at least one environment to proceed. This is required for the
          simulation.
        </p>

        {environments.length === 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please select at least one environment to proceed with the
              simulation.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {environmentOptions.map((option) => {
            const isSelected = environments.includes(option.id);
            return (
              <TooltipWrapper
                key={option.id}
                asChild
                content={
                  <div className="max-w-xs">
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-xs">{option.description}</p>
                  </div>
                }
                contentProps={{
                  className: "bg-popover text-popover-foreground max-w-xs",
                }}
              >
                <span className="block">
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? "ring-primary bg-primary/5 ring-2"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleEnvironmentToggle(option.id)}
                  >
                    <CardContent className="flex items-center space-x-3 p-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() =>
                          handleEnvironmentToggle(option.id)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Label
                        htmlFor={option.id}
                        className="flex-1 cursor-pointer text-sm font-medium"
                      >
                        {option.label}
                      </Label>
                    </CardContent>
                  </Card>
                </span>
              </TooltipWrapper>
            );
          })}
        </div>
      </div>

      {/* Run Simulation CTA */}
      <div className="flex items-center justify-end border-t pt-4">
        <Button
          size="lg"
          onClick={onRunSimulation}
          disabled={isRunning || environments.length === 0}
          className="flex items-center gap-2 bg-[#42bd00] hover:bg-[#329600]"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Running Simulation...</span>
            </>
          ) : (
            <span>Run Simulation</span>
          )}
        </Button>
      </div>
    </div>
  );
};
