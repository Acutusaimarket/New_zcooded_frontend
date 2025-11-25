import React, { useState } from "react";

import { Plus, X, Zap } from "lucide-react";

import { ContextLayerInput } from "@/components/shared/context-layer-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MediaConfigurationStepProps {
  questions: string[];
  onQuestionsChange: (questions: string[]) => void;
  contextLayer: string;
  onContextLayerChange: (contextLayer: string) => void;
}

export const MediaConfigurationStep: React.FC<MediaConfigurationStepProps> = ({
  questions,
  onQuestionsChange,
  contextLayer,
  onContextLayerChange,
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Configuration</h3>
        <p className="text-muted-foreground text-sm">
          Configure analysis parameters and add custom questions
        </p>
      </div>

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

      {/* Context Layer Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Context Layer (Optional)
          </CardTitle>
          <CardDescription>
            Configure context variables that influence persona behavior and
            decision-making
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContextLayerInput
            value={contextLayer}
            onChange={onContextLayerChange}
          />
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
