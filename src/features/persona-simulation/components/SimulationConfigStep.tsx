import React, { useState } from "react";

import {
  Check,
  HelpCircle,
  MessageSquare,
  Plus,
  Settings,
  Trash2,
  X,
  Zap,
} from "lucide-react";

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
// import {  SelectContent, SelectItem, } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface SimulationConfigStepProps {
  simulationType: "overview" | "detailed";
  onConfigChange: (config: {
    simulationType?: "overview" | "detailed";
  }) => void;
  questions: string[];
  onQuestionsChange: (questions: string[]) => void;
  noOfSimulations: number;
  onNoOfSimulationsChange: (noOfSimulations: number) => void;
  contextLayer: string;
  onContextLayerChange: (contextLayer: string) => void;
}

const simulationTypes = [
  {
    id: "overview",
    title: "Overview Simulation",
    description: "Quick analysis with high-level insights and recommendations",
    features: [
      "Basic interest level assessment",
      "Purchase intent scoring",
      "Price perception analysis",
      "Key concerns identification",
      "Overall recommendation",
    ],
    estimatedTime: "2-3 minutes",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: "detailed",
    title: "Detailed Simulation",
    description: "Comprehensive analysis with in-depth behavioral insights",
    features: [
      "Detailed behavioral analysis",
      "Decision timeline prediction",
      "Motivation drivers analysis",
      "Recommendation likelihood scoring",
      "Comprehensive summary reports",
      "Individual persona breakdowns",
    ],
    estimatedTime: "5-8 minutes",
    icon: <Zap className="h-5 w-5" />,
  },
];
export const SimulationConfigStep: React.FC<SimulationConfigStepProps> = ({
  simulationType,
  onConfigChange,
  questions,
  onQuestionsChange,
  noOfSimulations,
  onNoOfSimulationsChange,
  contextLayer,
  onContextLayerChange,
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

  const handleNoOfSimulationsChange = (noOfSimulations: number) => {
    onNoOfSimulationsChange(noOfSimulations);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Type Selection */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Settings className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold">Simulation Type</h3>
        </div>

        <div className="space-y-4">
          {simulationTypes.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                simulationType === type.id
                  ? "ring-primary bg-primary/5 ring-2"
                  : "hover:bg-muted/50"
              }`}
              onClick={() =>
                onConfigChange({
                  simulationType: type.id as "overview" | "detailed",
                })
              }
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                        simulationType === type.id
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {simulationType === type.id && (
                        <Check className="text-primary-foreground h-2.5 w-2.5" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 text-lg font-semibold">
                          {type.icon}
                          <span>{type.title}</span>
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {type.description}
                        </p>
                      </div>

                      <Badge variant="outline" className="ml-2">
                        {type.estimatedTime}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-muted-foreground mb-2 text-sm font-medium">
                        Features:
                      </p>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {type.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <div className="bg-primary h-1.5 w-1.5 rounded-full"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* No of Simulations */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold">No of Simulations</h3>
          </div>
        </div>
        <div className="space-y-2">
          <Input
            type="number"
            value={noOfSimulations}
            onChange={(e) =>
              handleNoOfSimulationsChange(Number(e.target.value))
            }
            min={1}
            max={10}
            step={1}
          />
          <p className="text-muted-foreground text-sm">
            Specify how many simulations you want to run.
          </p>
        </div>
      </div>

      <Separator />

      <CardTitle className="flex items-center gap-2">
        <Zap className="h-5 w-5" />
        Context Layer (Optional)
      </CardTitle>
      <CardDescription>
        Configure context variables that influence persona behavior and
        decision-making
      </CardDescription>
      <ContextLayerInput value={contextLayer} onChange={onContextLayerChange} />
      <Separator />

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
    </div>
  );
};
