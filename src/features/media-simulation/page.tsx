import React, { useState } from "react";

import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { JobsListByStatus } from "@/features/simulation-history/components/jobs-list-by-status";
import type { SimulationJob } from "@/features/simulation-history/types/job.types";

type TabValue = "active" | "completed" | "failed" | "interrupted";

export const MediaHistoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("active");

  const getStatusForTab = (tab: TabValue): SimulationJob["status"] => {
    switch (tab) {
      case "active":
        return "in_progress";
      case "completed":
        return "completed";
      case "failed":
        return "failed";
      case "interrupted":
      default:
        return "pending";
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header Section */}
      <div className="bg-card/50 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Media History</h1>
              <p className="text-muted-foreground mt-2">
                Browse and manage your media simulation history
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabValue)}
        >
          {/* Tabs Navigation */}
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
              <Clock className="h-4 w-4" />
              Pending
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <div className="mt-6">
            <TabsContent value="active" className="mt-0">
              <JobsListByStatus
                status="active"
                jobType="media_simulation"
              />
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <JobsListByStatus
                status={getStatusForTab("completed")}
                jobType="media_simulation"
              />
            </TabsContent>

            <TabsContent value="failed" className="mt-0">
              <JobsListByStatus
                status={getStatusForTab("failed")}
                jobType="media_simulation"
              />
            </TabsContent>

            <TabsContent value="interrupted" className="mt-0">
              <JobsListByStatus
                status={getStatusForTab("interrupted")}
                jobType="media_simulation"
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
