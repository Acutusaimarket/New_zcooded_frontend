import React, { useState } from "react";

import { AlertCircle, Globe, Plus, X, Zap } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TooltipWrapper } from "@/components/ui/tooltip";

interface MediaConfigurationStepProps {
  questions: string[];
  onQuestionsChange: (questions: string[]) => void;
  environments: string[];
  onEnvironmentsChange: (environments: string[]) => void;
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
  },]

export const MediaConfigurationStep: React.FC<MediaConfigurationStepProps> = ({
  questions,
  onQuestionsChange,
  environments,
  onEnvironmentsChange,
}) => {
  const [newQuestion, setNewQuestion] = useState("");

  const addQuestion = () => {
    if (newQuestion.trim() && !questions.includes(newQuestion.trim())) {
      onQuestionsChange([...questions, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  const removeQuestion = (index: number) => {
    onQuestionsChange(questions.filter((_, i) => i !== index));
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
      {/* <div className="space-y-2">
        <h3 className="text-lg font-semibold">Configuration</h3>
        <p className="text-muted-foreground text-sm">
          Configure analysis parameters and add custom questions
        </p>
      </div> */}

      {/* Custom Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Custom Questions (Optional)
          </CardTitle>
          <CardDescription>
            Add specific questions you want the simulation to answer about the
            media content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="e.g., How does this image make you feel about the product?"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addQuestion())
              }
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addQuestion}
              size="sm"
              disabled={!newQuestion.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {questions.length > 0 && (
            <div className="space-y-2">
              <Label>Questions ({questions.length})</Label>
              <div className="flex flex-wrap gap-2">
                {questions.map((question, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex max-w-md items-center gap-2 px-3 py-1"
                  >
                    <span className="truncate">{question}</span>
                    <X
                      className="hover:text-destructive h-3 w-3 flex-shrink-0 cursor-pointer"
                      onClick={() => removeQuestion(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Environments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Environments
          </CardTitle>
          <CardDescription>
            Select at least one environment to proceed. This is required for the
            simulation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge
              variant={environments.length > 0 ? "secondary" : "destructive"}
            >
              {environments.length} selected
            </Badge>
            {environments.length === 0 && (
              <span className="text-destructive text-sm font-medium">
                * Required
              </span>
            )}
          </div>

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
        </CardContent>
      </Card>

      {/* Fixed Configuration Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Analysis Configuration
          </CardTitle>
          <CardDescription>Pre-configured analysis settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Analysis Type</Label>
              <div className="bg-muted/50 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-medium">Detailed</span>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  Comprehensive analysis with in-depth insights
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>AI Model</Label>
              <div className="bg-muted/50 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-medium">Acu 1.0</span>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  Fast and efficient analysis
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
