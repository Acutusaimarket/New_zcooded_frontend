import React, { useState } from "react";

import { AlertTriangle, CheckCircle2, Clock, Loader2 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Media Simulation History
              </h1>
              <p className="text-gray-600 mt-2 text-base">
                Review and analyze your past simulation results
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
          <TabsList className="bg-transparent h-auto w-full justify-start gap-0 p-0 border-b border-gray-200">
            <TabsTrigger
              value="active"
              className={cn(
                "text-gray-600 flex items-center gap-2 rounded-none px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent",
                "data-[state=active]:border-[#42bd00] data-[state=active]:text-[#42bd00] data-[state=active]:bg-transparent",
                "[&[data-state=active]_div]:bg-[#42bd00] [&[data-state=active]_div]:text-white",
                "[&[data-state=inactive]_div]:bg-gray-200 [&[data-state=inactive]_div]:text-gray-600"
              )}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full transition-colors">
                <Loader2 className={cn(
                  "h-3.5 w-3.5",
                  activeTab === "active" && "animate-spin"
                )} />
              </div>
              <span>Active</span>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className={cn(
                "text-gray-600 flex items-center gap-2 rounded-none px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent",
                "data-[state=active]:border-[#42bd00] data-[state=active]:text-[#42bd00] data-[state=active]:bg-transparent",
                "[&[data-state=active]_div]:bg-[#42bd00] [&[data-state=active]_div]:text-white",
                "[&[data-state=inactive]_div]:bg-gray-200 [&[data-state=inactive]_div]:text-gray-600"
              )}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full transition-colors">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <span>Completed</span>
            </TabsTrigger>
            <TabsTrigger
              value="failed"
              className={cn(
                "text-gray-600 flex items-center gap-2 rounded-none px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent",
                "data-[state=active]:border-[#42bd00] data-[state=active]:text-[#42bd00] data-[state=active]:bg-transparent",
                "[&[data-state=active]_div]:bg-[#42bd00] [&[data-state=active]_div]:text-white",
                "[&[data-state=inactive]_div]:bg-gray-200 [&[data-state=inactive]_div]:text-gray-600"
              )}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full transition-colors">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
              <span>Failed</span>
            </TabsTrigger>
            <TabsTrigger
              value="interrupted"
              className={cn(
                "text-gray-600 flex items-center gap-2 rounded-none px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent",
                "data-[state=active]:border-[#42bd00] data-[state=active]:text-[#42bd00] data-[state=active]:bg-transparent",
                "[&[data-state=active]_div]:bg-[#42bd00] [&[data-state=active]_div]:text-white",
                "[&[data-state=inactive]_div]:bg-gray-200 [&[data-state=inactive]_div]:text-gray-600"
              )}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full transition-colors">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <span>Pending</span>
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
