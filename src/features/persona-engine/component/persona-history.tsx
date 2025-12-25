import { type ElementType, useMemo } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Menu,
  RefreshCw,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobsListByStatus } from "@/features/simulation-history/components/jobs-list-by-status";
import { cn } from "@/lib/utils";

type HistoryTab = "active" | "completed" | "failed" | "pending";

interface PersonaHistoryProps {
  activeTab: HistoryTab;
  onTabChange: (tab: HistoryTab) => void;
}

const PersonaHistory = ({ activeTab, onTabChange }: PersonaHistoryProps) => {
  const tabs: { value: HistoryTab; label: string; icon: ElementType }[] =
    useMemo(
      () => [
        { value: "active", label: "Active", icon: RefreshCw },
        { value: "completed", label: "Completed", icon: CheckCircle2 },
        { value: "failed", label: "Failed", icon: AlertTriangle },
        { value: "pending", label: "Pending", icon: Clock },
      ],
      []
    );

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-primary text-3xl font-bold tracking-tight">
              Persona Engine History
            </h1>
            <p className="text-muted-foreground">
              Browse and manage your media simulation history.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input type="search" placeholder="Search" className="w-64 pl-9" />
            </div>
            {/* Filter Button */}
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => onTabChange(val as HistoryTab)}
      >
        <TabsList className="h-auto w-full justify-start gap-0 bg-transparent p-0">
          {tabs.map(({ value, label, icon: Icon }) => {
            const isActive = activeTab === value;
            const isActiveTab = value === "active";
            return (
              <TabsTrigger
                key={value}
                value={value}
                className={cn(
                  "text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium transition-all data-[state=active]:shadow-none",
                  isActive && isActiveTab
                    ? "border-b-green-600 bg-transparent text-green-600"
                    : isActive
                      ? "text-foreground border-b-primary bg-transparent"
                      : "bg-transparent"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive && isActiveTab ? "text-green-600" : ""
                  )}
                />
                {label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="active" className="mt-0">
            <JobsListByStatus
              status="in_progress"
              jobType="persona_clustering"
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            <JobsListByStatus status="completed" jobType="persona_clustering" />
          </TabsContent>
          <TabsContent value="failed" className="mt-0">
            <JobsListByStatus status="failed" jobType="persona_clustering" />
          </TabsContent>
          <TabsContent value="pending" className="mt-0">
            <JobsListByStatus status="pending" jobType="persona_clustering" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default PersonaHistory;
