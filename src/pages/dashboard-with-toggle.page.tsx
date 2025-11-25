import { useState } from "react";

import { BarChart3, Minimize2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ActionButtons,
  RecentActivity,
  SimulationRunner,
  SimulationRunnerAnalytics,
  StatsCards,
  useDashboardData,
} from "@/features/dashboard";

const DashboardPageWithToggle = () => {
  const { stats, isLoading } = useDashboardData();
  const [isAnalyticsView, setIsAnalyticsView] = useState(false);
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your simulations and manage behavioral analysis workflows
        </p>
      </div>

      {/* Stats Cards Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Key Metrics</h2>
        <StatsCards stats={stats} />
      </section>

      {/* Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Main Actions */}
        <div className="space-y-8 lg:col-span-2">
          {/* Quick Actions Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Quick Actions
            </h2>
            <ActionButtons />
          </section>

          {/* Simulation Control Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Simulation Control
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant={!isAnalyticsView ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsAnalyticsView(false)}
                  className="h-9"
                >
                  <Minimize2 className="mr-2 h-4 w-4" />
                  Minimal
                </Button>
                <Button
                  variant={isAnalyticsView ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsAnalyticsView(true)}
                  className="h-9"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </div>
            </div>
            {isAnalyticsView ? (
              <SimulationRunnerAnalytics />
            ) : (
              <SimulationRunner />
            )}
          </section>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="lg:col-span-1">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Activity Feed
            </h2>
            <RecentActivity />
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPageWithToggle;
