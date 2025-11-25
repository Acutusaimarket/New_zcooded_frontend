export const PERFORMANCE_THRESHOLDS = {
  KPI_SCORE: {
    EXCELLENT: 80,
    GOOD: 60,
    AVERAGE: 40,
    POOR: 0,
  },
  OVERALL_EFFECTIVENESS: {
    EXCELLENT: 80,
    GOOD: 60,
    AVERAGE: 40,
    POOR: 0,
  },
  CONFIDENCE_SCORE: {
    HIGH: 0.8,
    MEDIUM: 0.6,
    LOW: 0.4,
  },
  RISK_LEVEL: {
    HIGH: "High",
    MEDIUM: "Medium",
    LOW: "Low",
  },
} as const;

export const SCORE_CATEGORIES = {
  EXCELLENT: "excellent",
  GOOD: "good",
  AVERAGE: "average",
  POOR: "poor",
} as const;

export const getScoreCategory = (score: number, maxScore: number = 100) => {
  const normalizedScore = (score / maxScore) * 100;

  if (normalizedScore >= PERFORMANCE_THRESHOLDS.KPI_SCORE.EXCELLENT) {
    return SCORE_CATEGORIES.EXCELLENT;
  }
  if (normalizedScore >= PERFORMANCE_THRESHOLDS.KPI_SCORE.GOOD) {
    return SCORE_CATEGORIES.GOOD;
  }
  if (normalizedScore >= PERFORMANCE_THRESHOLDS.KPI_SCORE.AVERAGE) {
    return SCORE_CATEGORIES.AVERAGE;
  }
  return SCORE_CATEGORIES.POOR;
};

export const getConfidenceLevel = (score: number) => {
  if (score >= PERFORMANCE_THRESHOLDS.CONFIDENCE_SCORE.HIGH) {
    return "High";
  }
  if (score >= PERFORMANCE_THRESHOLDS.CONFIDENCE_SCORE.MEDIUM) {
    return "Medium";
  }
  return "Low";
};
