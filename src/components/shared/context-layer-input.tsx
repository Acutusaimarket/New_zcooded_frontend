import React, { useCallback, useMemo } from "react";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { context_impact_library } from "@/constants/environmental_context";
import { cn } from "@/lib/utils";

import MultiSelectWithOther from "./multi-select-with-other";

export interface ContextLayerItem {
  category: string;
  variables: string[];
}

interface ContextLayerInputProps {
  value: string; // JSON string of ContextLayerItem[]
  onChange: (value: string) => void;
  disabled?: boolean;
  shouldShowLabel?: boolean;
  className?: string;
}

export const ContextLayerInput: React.FC<ContextLayerInputProps> = ({
  value,
  onChange,
  disabled = false,
  className,
  shouldShowLabel = false,
}) => {
  // Parse the JSON string to get the current context layer
  const contextLayer: ContextLayerItem[] = useMemo(() => {
    try {
      if (!value || value.trim() === "") return [];
      return JSON.parse(value) as ContextLayerItem[];
    } catch {
      return [];
    }
  }, [value]);

  // Get selected variables for a category
  const getSelectedVariables = useCallback(
    (category: string): string[] => {
      const item = contextLayer.find((item) => item.category === category);
      return item?.variables || [];
    },
    [contextLayer]
  );

  // Get variable options for a category
  const getVariableOptions = useCallback((category: string) => {
    const categoryData = context_impact_library.find(
      (cat) => cat.context_category === category
    );
    if (!categoryData) return [];

    return categoryData.values.map((variable) => ({
      label: variable.context_variable,
      value: variable.context_variable,
      description: variable.definition,
    }));
  }, []);

  // Handle variable selection for a category
  const handleVariableChange = useCallback(
    (category: string, selectedVariables: string[]) => {
      const newContextLayer = contextLayer.filter(
        (item) => item.category !== category
      );

      // Only add category if variables are selected
      if (selectedVariables.length > 0) {
        newContextLayer.push({ category, variables: selectedVariables });
      }

      onChange(JSON.stringify(newContextLayer));
    },
    [contextLayer, onChange]
  );

  return (
    <div className={cn("space-y-4", className)}>
      {shouldShowLabel && (
        <div className="space-y-2">
          <Label>Context Layer (Optional)</Label>
          <p className="text-muted-foreground text-sm">
            Select context variables by category to include in the analysis
          </p>
        </div>
      )}

      <div className="space-y-4">
        {context_impact_library.map((categoryData, index) => {
          const category = categoryData.context_category;
          const selectedVariables = getSelectedVariables(category);
          const variableOptions = getVariableOptions(category);

          return (
            <div key={category} className="space-y-2">
              {index > 0 && <Separator />}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{category}</Label>
                <MultiSelectWithOther
                  value={selectedVariables}
                  onChange={(vars) => handleVariableChange(category, vars)}
                  options={variableOptions}
                  placeholder={`Select ${category.toLowerCase()} variables...`}
                  disabled={disabled}
                  allowCustom={false}
                  className="w-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
