import { Info } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricInfoTooltipProps {
  title: string;
  description: string;
  className?: string;
}

const metricDescriptions: Record<string, string> = {
  "Overall Interest Level":
    "Measures how much attention and curiosity the product generates among target personas on a scale of 1-10. Higher scores indicate stronger initial appeal and likelihood of engagement.",
  "Overall Purchase Intent":
    "Indicates the likelihood that personas would actually buy the product on a scale of 1-10. This metric reflects conversion potential and buying motivation beyond just interest.",
  "Overall Price Perception":
    "Shows how personas perceive the product's pricing relative to its value. 'Just right' indicates optimal pricing, while 'too high' or 'too low' suggest pricing adjustments may be needed.",
  "PMF Index":
    "Product-Market Fit Index combines multiple factors to score how well the product aligns with market needs (0-10). Higher scores indicate stronger market fit and potential for success.",
  "Interest Level":
    "Individual persona's attention and curiosity toward the product on a scale of 1-10. Higher scores suggest the product resonates well with this persona type.",
  "Purchase Intent":
    "Individual persona's likelihood to buy the product on a scale of 1-10. This reflects actual buying motivation and conversion potential for this specific persona.",
  "Price Perception":
    "How this specific persona perceives the product's pricing. 'Just right' indicates price acceptance, while other values suggest price sensitivity concerns.",
  "PMF Index Individual":
    "This persona's individual Product-Market Fit score (0-10), showing how well the product meets their specific needs and preferences.",
};

export const MetricInfoTooltip = ({
  title,
  description,
  className = "",
}: MetricInfoTooltipProps) => {
  const tooltipDescription =
    description || metricDescriptions[title] || "No description available";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info
            className={`text-muted-foreground hover:text-foreground h-4 w-4 cursor-help transition-colors ${className}`}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-sm">{tooltipDescription}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
