import React, { useState } from "react";

import { Globe, HelpCircle, Loader2, MessageSquare, Plus, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
]

export const SimulationConfigStep: React.FC<SimulationConfigStepProps> = ({
  questions,
  onQuestionsChange,
  environments,
  onEnvironmentsChange,
  onRunSimulation,
  isRunning,
}) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const maxQuestionLength = 200;

  const handleAddQuestion = () => {
    if (newQuestion.trim() && newQuestion.length <= maxQuestionLength) {
      setIsAddingQuestion(true);
      // Simulate a brief loading state for better UX
      onQuestionsChange([...questions, newQuestion.trim()]);
      setNewQuestion("");
      setIsAddingQuestion(false);
    }
  };

  const handleCancelAdd = () => {
    setNewQuestion("");
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    onQuestionsChange(updatedQuestions);
  };

  const handleEnvironmentToggle = (environmentId: string) => {
    if (environments.includes(environmentId)) {
      onEnvironmentsChange(
        environments.filter((id) => id !== environmentId)
      );
    } else {
      onEnvironmentsChange([...environments, environmentId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Questions Management */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold">Questions</h3>
            <Badge variant="secondary" className="ml-2">
              {questions.length}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingQuestion(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </Button>
        </div>

        {/* Add Question Form */}
        {isAddingQuestion && (
          <Card className="shadow-md transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <HelpCircle className="h-4 w-4" />
                  <span>Add New Question</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelAdd}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-question" className="text-sm font-medium">
                  What would you like to know about this product?
                </Label>
                <div className="space-y-2">
                  <Input
                    id="new-question"
                    placeholder="e.g., How does this product compare to competitors?"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddQuestion();
                      }
                    }}
                    className="min-h-[44px] text-base"
                    maxLength={maxQuestionLength}
                  />
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span>
                      {newQuestion.length > maxQuestionLength * 0.8 && (
                        <span className="text-amber-600">
                          {maxQuestionLength - newQuestion.length} characters
                          remaining
                        </span>
                      )}
                    </span>
                    <span>
                      {newQuestion.length}/{maxQuestionLength}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleAddQuestion}
                  disabled={
                    !newQuestion.trim() ||
                    newQuestion.length > maxQuestionLength
                  }
                  className="flex items-center space-x-2"
                  size="sm"
                >
                  <span>Add Question</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelAdd}
                  disabled={isAddingQuestion}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Questions List */}
        {questions.length > 0 ? (
          <div className="space-y-3">
            {questions.map((question, index) => (
              <Card
                key={index}
                className="group bg-card transition-all duration-200 hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center">
                        <span className="text-muted-foreground text-sm">
                          Question {index + 1}
                        </span>
                      </div>
                      <p className="leading-relaxed font-medium">{question}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveQuestion(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-muted rounded-full p-3">
                  <MessageSquare className="text-muted-foreground h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground font-medium">
                    No questions added yet
                  </p>
                  <p className="text-muted-foreground max-w-sm text-sm">
                    Add questions to get more detailed insights about how
                    personas might respond to your product.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingQuestion(true)}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Question
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      {/* Environments Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Globe className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold">Environments</h3>
          <Badge variant="secondary" className="ml-2">
            {environments.length} selected
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Select one or more environments to simulate different user contexts
          and behaviors. Hover over options to see descriptions.
        </p>

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
                        className="cursor-pointer flex-1 font-medium text-sm"
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
          disabled={isRunning}
          className="flex items-center gap-2"
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
