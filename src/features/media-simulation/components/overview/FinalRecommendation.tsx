import { Crown } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { MediaSimulationData } from "../../types/media-simulation.types";
import { replaceUUIDs } from "../../utils/data-formatters";

interface FinalRecommendationProps {
  data: MediaSimulationData;
  className?: string;
}

export const FinalRecommendation = ({
  data,
  className,
}: FinalRecommendationProps) => {
  // Don't render if there's no final recommendation
  if (!data.comparison_analysis?.final_recommendation) {
    return null;
  }

  return (
    <Card className={`border-primary/20 bg-primary/5 ${className || ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="text-primary h-5 w-5" />
          Final Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm text-muted-foreground bg-muted prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-blockquote:border-muted-foreground prose-blockquote:text-muted-foreground max-w-none rounded-md">
          <ReactMarkdown>
            {replaceUUIDs(
              data.comparison_analysis.final_recommendation.rationale,
              data
            )}
          </ReactMarkdown>
        </div>

        <div>
          <h4 className="mb-2 font-semibold">Expected Outcomes</h4>
          <ul className="text-muted-foreground ml-4 list-disc text-sm">
            {data.comparison_analysis.final_recommendation.expected_outcomes.map(
              (outcome, index) => (
                <li key={index}>{outcome}</li>
              )
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
