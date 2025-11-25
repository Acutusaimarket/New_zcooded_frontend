import type {
  PersonaResult,
  SimulationHistoryItem,
} from "../types/simulation.types";

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format date for API (YYYY-MM-DD format)
 */
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * Get simulation type badge variant
 */
export const getSimulationTypeVariant = (
  type: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (type.toLowerCase()) {
    case "overview":
      return "default";
    case "detailed":
      return "secondary";
    default:
      return "outline";
  }
};

/**
 * Get interest level color
 */
export const getInterestLevelColor = (level: number): string => {
  if (level >= 8) return "text-green-600";
  if (level >= 5) return "text-[#f7c64a]";
  return "text-red-600";
};

/**
 * Get purchase intent color
 */
export const getPurchaseIntentColor = (intent: number): string => {
  if (intent >= 8) return "text-green-600";
  if (intent >= 5) return "text-[#f7c64a]";
  return "text-red-600";
};

/**
 * Get PMF Index color
 */
export const getPmfIndexColor = (pmfIndex: number): string => {
  if (pmfIndex >= 8) return "text-green-600";
  if (pmfIndex >= 5) return "text-[#f7c64a]";
  return "text-red-600";
};

/**
 * Get price perception color
 */
export const getPricePerceptionColor = (perception: string): string => {
  switch (perception) {
    case "too high":
      return "text-red-600";
    case "too low":
      return "text-green-600";
    case "just right":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

/**
 * Get decision timeline color
 */
export const getDecisionTimelineColor = (timeline: string): string => {
  switch (timeline) {
    case "very quick (same day)":
      return "text-green-600";
    case "quick (within a week)":
      return "text-blue-600";
    case "medium (within a month)":
      return "text-yellow-600";
    case "slow (more than a month)":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

/**
 * Calculate progress percentage for interest level or purchase intent
 */
export const calculateProgress = (value: number): number => {
  return Math.min(Math.max((value / 10) * 100, 0), 100);
};

/**
 * Get persona count text
 */
export const getPersonaCountText = (count: number): string => {
  if (count === 0) return "No personas";
  if (count === 1) return "1 persona";
  return `${count} personas`;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (
  text: string = "unknown",
  maxLength: number
): string => {
  if (text?.length <= maxLength) return text;
  return text?.substring(0, maxLength) + "...";
};

/**
 * Sort simulations by date (newest first)
 */
export const sortSimulationsByDate = (
  simulations: SimulationHistoryItem[]
): SimulationHistoryItem[] => {
  return [...simulations].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

/**
 * Filter simulations by date range
 */
export const filterSimulationsByDateRange = (
  simulations: SimulationHistoryItem[],
  dateFrom: string | null,
  dateTo: string | null
): SimulationHistoryItem[] => {
  if (!dateFrom && !dateTo) return simulations;

  return simulations.filter((simulation) => {
    const simulationDate = new Date(simulation.created_at);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    if (fromDate && simulationDate < fromDate) return false;
    if (toDate && simulationDate > toDate) return false;

    return true;
  });
};

/**
 * Get average interest level from persona results
 */
export const getAverageInterestLevel = (
  personaResults: PersonaResult[]
): number => {
  if (personaResults.length === 0) return 0;
  const total = personaResults.reduce(
    (sum, result) => sum + result.result.interest_level,
    0
  );
  return Math.round((total / personaResults.length) * 10) / 10;
};

/**
 * Get average purchase intent from persona results
 */
export const getAveragePurchaseIntent = (
  personaResults: PersonaResult[]
): number => {
  if (personaResults.length === 0) return 0;
  const total = personaResults.reduce(
    (sum, result) => sum + result.result.purchase_intent,
    0
  );
  return Math.round((total / personaResults.length) * 10) / 10;
};
