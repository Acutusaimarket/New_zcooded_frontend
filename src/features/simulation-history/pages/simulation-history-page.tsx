import { useState } from "react";

import { AlertTriangle, CheckCircle2, Clock, Pause } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SimulationHistoryFilters } from "../components";
import { JobsListByStatus } from "../components/jobs-list-by-status";

type TabValue = "active" | "completed" | "failed" | "interrupted";

export const SimulationHistoryPage = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("active");

  return (
    <div className="bg-background min-h-screen">
      {/* Header Section */}
      <div className="bg-card/50 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Simulation History
              </h1>
              <p className="text-muted-foreground mt-2">
                Review and analyze your past simulation results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Advanced Filters - Above all tabs */}
        <div className="mb-6">
          <SimulationHistoryFilters />
        </div>

        {/* Tabs Navigation and Content */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabValue)}
        >
          <TabsList className="bg-muted/50 h-auto w-full justify-start gap-2 rounded-lg p-2">
            <TabsTrigger
              value="active"
              className="text-foreground flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-md"
            >
              <Clock className="h-4 w-4" />
              Active
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="text-foreground flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-md"
            >
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="failed"
              className="text-foreground flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-md"
            >
              <AlertTriangle className="h-4 w-4" />
              Failed
            </TabsTrigger>
            <TabsTrigger
              value="interrupted"
              className="text-foreground flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-md"
            >
              <Pause className="h-4 w-4" />
              Interrupted
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <div className="mt-6">
            <TabsContent value="active" className="mt-0">
              <JobsListByStatus status="in_progress" />
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <JobsListByStatus status="completed" />
            </TabsContent>

            <TabsContent value="failed" className="mt-0">
              <JobsListByStatus status="failed" />
            </TabsContent>

            <TabsContent value="interrupted" className="mt-0">
              <JobsListByStatus status="pending" />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
