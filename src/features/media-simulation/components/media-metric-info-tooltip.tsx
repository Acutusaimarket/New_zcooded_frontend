import { Info } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MediaMetricInfoTooltipProps {
  metric: string;
  className?: string;
}

const MEDIA_METRIC_DESCRIPTIONS: Record<string, string> = {
  // KPI Metrics
  engagement:
    "Measures the likelihood of audience interaction with the content. Higher values indicate more compelling and interactive media.",
  clarity:
    "Evaluates how clearly the message is communicated to the target audience. Higher scores mean better message comprehension.",
  "brand consistency":
    "Assesses how well the content aligns with brand identity and messaging standards. Higher values indicate better brand alignment.",
  conversion:
    "Predicts the likelihood of the content driving desired actions (purchases, sign-ups, etc.). Higher scores suggest better conversion potential.",

  // Behavioral Metrics
  sentiment:
    "The emotional response the content evokes in the audience (Positive, Negative, or Neutral).",
  click:
    "The probability that a user will click on the content when exposed to it.",
  "conversion prob":
    "The likelihood that exposure to the content will result in a conversion action.",
  attention:
    "The average time (in seconds) users are expected to focus on the content.",
  resonance:
    "How well the content connects with the specific persona's interests and preferences (0-100 scale).",
  "persona resonance":
    "How well the content connects with the specific persona's interests and preferences (0-100 scale).",
  audience:
    "The percentage weight of how representative this persona is of the target audience.",
  "audience weight":
    "The percentage weight of how representative this persona is of the target audience.",
  "exposure prob":
    "The probability that the content will be seen by the target audience in a typical campaign.",
  "click probability":
    "The probability that a user will click on the content when exposed to it.",
  "conversion probability":
    "The likelihood that exposure to the content will result in a conversion action.",

  // Campaign Management
  "frequency cap":
    "Maximum number of times the same user should see this content to avoid ad fatigue.",
  "max touchpoints":
    "Maximum number of interaction points recommended for optimal campaign performance.",
  "cooldown days":
    "Recommended waiting period (in days) before re-targeting the same user with similar content.",
  "memory half-life":
    "Number of days before the content's impact on user memory is reduced by half.",
  "fatigue rate":
    "The rate at which repeated exposure to the content reduces its effectiveness (as a percentage).",

  // New KPI counts (lines 23-37)
  "ad recall":
    "Number of simulated users who remember seeing the ad after exposure.",
  "message recall":
    "Number of simulated users who recall the main message communicated.",
  "brand linkage":
    "Number of users who correctly associate the ad with the brand.",
  consideration:
    "Number of users who report considering buying after exposure.",
  "brand trust":
    "Number of users who agree that they trust the brand after exposure.",
  "creative appeal": "Number of users who found the creative appealing.",
  "clarity of message": "Number of users who understood the message clearly.",
  distinctiveness:
    "Number of users who felt the ad was distinctive versus competitors.",
  "share intent": "Number of users who would consider sharing the ad.",

  // New KPI rates (lines 39-50)
  "ad recall rate":
    "Percentage of users who remember seeing the ad after exposure.",
  "message recall rate":
    "Percentage of users who recall the main message communicated.",
  "brand linkage rate":
    "Percentage of users who correctly associate the ad with the brand.",
  "affective uplift":
    "Change in emotional valence induced by the content (higher is more positive).",
  "brand favorability rate":
    "Percentage of users with positive brand favorability after exposure.",
  "brand consideration uplift":
    "Increase in users considering the brand after exposure (percentage points).",
  "brand trust index":
    "Index representing trust in the brand among exposed users (percentage).",
  "creative appeal rate":
    "Percentage of users who found the creative appealing.",
  "clarity of message rate":
    "Percentage of users who understood the message clearly.",
  "distinctiveness score rate":
    "Percentage of users who felt the ad was distinctive.",
  "simulated share intent rate":
    "Percentage of users who would consider sharing the ad.",

  // Composite items
  nps: "Net Promoter Score before and after exposure; higher post-exposure indicates stronger advocacy.",
  "emotional valence":
    "Emotional tone before and after exposure; higher values indicate more positive affect.",
};

export const MediaMetricInfoTooltip = ({
  metric,
  className,
}: MediaMetricInfoTooltipProps) => {
  const description = MEDIA_METRIC_DESCRIPTIONS[metric.toLowerCase()];

  if (!description) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info
            className={`text-muted-foreground h-3 w-3 cursor-help ${className}`}
          />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
