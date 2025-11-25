import { useEffect, useState } from "react";

import type { DashboardStats, SimulationData } from "../types";

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeSimulations: 2,
    personasInUse: 8,
    avgSimulationAccuracy: 85,
    recentOutcome: "Outcome las - Anomalies Flagged",
  });

  const [simulations, _setSimulations] = useState<SimulationData[]>([
    {
      id: "1",
      name: "Customer Behavior Analysis",
      status: "running",
      accuracy: 87,
      startTime: new Date(),
    },
    {
      id: "2",
      name: "Market Trend Prediction",
      status: "completed",
      accuracy: 92,
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        activeSimulations: Math.floor(Math.random() * 5) + 1,
        avgSimulationAccuracy: Math.floor(Math.random() * 20) + 80,
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return {
    stats,
    simulations,
    isLoading,
    refreshData,
  };
};
