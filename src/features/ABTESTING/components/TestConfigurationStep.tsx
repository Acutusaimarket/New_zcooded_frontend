import React from "react";

import { Zap } from "lucide-react";

import { ContextLayerInput } from "@/components/shared/context-layer-input";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface TestConfigurationStepProps {
  sampleSize: number;
  onSampleSizeChange: (size: number) => void;
  contextLayer: string;
  onContextLayerChange: (contextLayer: string) => void;
}

export const TestConfigurationStep: React.FC<TestConfigurationStepProps> = ({
  sampleSize,
  onSampleSizeChange,
  contextLayer,
  onContextLayerChange,
}) => {
  const handleSliderChange = (value: number[]) => {
    onSampleSizeChange(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 100 && value <= 10000) {
      onSampleSizeChange(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Test Configuration</h3>
        <p className="text-muted-foreground text-sm">
          Configure the sample size for your A/B test to ensure statistical
          significance
        </p>
      </div>

      {/* Sample Size Configuration */}
      {/* <CardTitle className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        Sample Size
      </CardTitle> */}
      <div className="space-y-2">
        <Label htmlFor="sample-size">Number of simulated users</Label>
        <div className="space-y-3">
          <Slider
            value={[sampleSize]}
            onValueChange={handleSliderChange}
            max={10000}
            min={100}
            step={100}
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <Input
              id="sample-size"
              type="number"
              value={sampleSize}
              onChange={handleInputChange}
              min={100}
              max={10000}
              step={100}
              className="w-24"
            />
            <span className="text-muted-foreground text-sm">users</span>
          </div>
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
    </div>
  );
};
