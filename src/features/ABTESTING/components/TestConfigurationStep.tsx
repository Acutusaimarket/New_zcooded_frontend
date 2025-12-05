import React from "react";

import { Globe } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface TestConfigurationStepProps {
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
  },
];

export const TestConfigurationStep: React.FC<TestConfigurationStepProps> = ({
  environments,
  onEnvironmentsChange,
}) => {
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
          Select one or more environments to simulate different user contexts
          and behaviors
        </p>
      </div> */}

      {/* Environments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Environments
          </CardTitle>
          <CardDescription>
          ⚠️ Select at least one environment to avoid simulation failure or inaccurate outputs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {environments.length} selected
            </Badge>
          </div>

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
    </div>
  );
};
