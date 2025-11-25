import type {
  MediaSimulationData,
  Persona,
  Product,
} from "../types/media-simulation.types";

export const formatMediaSize = (sizeInBytes: number): string => {
  const units = ["B", "KB", "MB", "GB"];
  let size = sizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatPersonaTitle = (persona: Persona): string => {
  return `${persona.name} (${persona.demographic.age_range}, ${persona.demographic.gender})`;
};

export const formatProductTitle = (product: Product): string => {
  return `${product.name} - ${formatCurrency(product.price, product.currency)}`;
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export const formatList = (items: string[], maxItems: number = 3): string => {
  if (items.length <= maxItems) {
    return items.join(", ");
  }

  const visibleItems = items.slice(0, maxItems);
  const remainingCount = items.length - maxItems;

  return `${visibleItems.join(", ")} and ${remainingCount} more`;
};

export const formatAnalysisId = (analysisId: string): string => {
  // Take first 8 characters for display
  return analysisId.substring(0, 8).toUpperCase();
};

export const formatScoreWithLabel = (
  score: number,
  maxScore: number,
  label: string
): string => {
  return `${label}: ${score.toFixed(1)}/${maxScore}`;
};

export const formatPercentageChange = (
  oldValue: number,
  newValue: number
): string => {
  const change = ((newValue - oldValue) / oldValue) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
};

export const extractInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, 2);
};

export const formatDuration = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

// Note: getMediaTypeIcon has been moved to component-specific implementations using Lucide icons

export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
};

const uuidRegex =
  /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

export function replaceUUIDs(text: string, data: MediaSimulationData) {
  const strArr = text.split(" ");

  const newStr = strArr.map((val) => {
    const match = val.match(uuidRegex); // works even if wrapped in backticks
    if (match) {
      const analysis = data.individual_analysis.find(
        (analysis) => analysis.analysis_id === match[0]
      );
      const persona = data.participated_personas.find(
        (persona) => persona._id === analysis?.persona_id
      );
      return persona?.name && analysis?.metadata?.file_name
        ? `\`${persona.name} v/s ${analysis.metadata.file_name}\``
        : val;
    }
    return val;
  });

  return newStr.join(" ");
}
