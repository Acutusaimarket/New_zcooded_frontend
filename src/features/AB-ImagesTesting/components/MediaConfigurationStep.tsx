import React, { useState } from "react";

import { AlertCircle, Plus, X } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    label: "Social feed scroll",
    description:
      "Simulates user behavior while scrolling through social media feeds, capturing impulsive purchase decisions and social influence patterns.",
  },
  {
    id: "Device & Tech Context",
    label: "Device & tech context",
    description:
      "Considers the device type, screen size, and technical capabilities that influence how users interact with and perceive the product.",
  },
  {
    id: "Marketplace Browse",
    label: "Marketplace browse",
    description:
      "Represents browsing behavior in e-commerce marketplaces where users compare multiple options and make informed purchase decisions.",
  },
  {
    id: "Influencer Click",
    label: "Influencer click",
    description:
      "Models user behavior when discovering products through influencer recommendations and sponsored content, focusing on trust and social proof.",
  },
  {
    id: "Urgent Need / Emergency",
    label: "Urgent need / Emergency",
    description:
      "Captures decision-making patterns when users have immediate, time-sensitive needs, prioritizing speed and availability over price considerations.",
  },
  {
    id: "Budget Crunch",
    label: "Budget crunch",
    description:
      "Simulates constrained financial situations where users prioritize value, discounts, and cost-effectiveness in their purchase decisions.",
  },
  {
    id: "Festival / Big Sale Event",
    label: "Festival / Big sale event",
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
    <div className="space-y-8">
      {/* Questions Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">Questions</h3>
            <p className="text-gray-600 text-sm">
              What would you like to know about this product?
            </p>
          </div>
          <Button
            type="button"
            onClick={addQuestion}
            disabled={!newQuestion.trim()}
            variant="outline"
            className="bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add questions
          </Button>
        </div>
        <Input
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="eg, How does this product compare to competitors?"
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addQuestion())
          }
          className="w-full"
        />

        {questions.length > 0 && (
          <div className="space-y-2 pt-2">
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
      </div>

      {/* Environments Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-gray-900">Environments</h3>
          <p className="text-gray-600 text-sm">
            Add specific question you want the simulation to answer about the media content
          </p>
        </div>

        {environments.length === 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please select at least one environment to proceed with the simulation.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {environmentOptions.map((option) => {
            const isSelected = environments.includes(option.id);
            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all hover:shadow-sm bg-gray-50 border-gray-200 ${
                  isSelected
                    ? "ring-2 ring-[#42bd00] bg-[#42bd00]/5"
                    : ""
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
                    className="cursor-pointer flex-1 font-medium text-sm text-gray-900"
                  >
                    {option.label}
                  </Label>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
