import { useMemo, type ElementType } from "react";

import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobsListByStatus } from "@/features/simulation-history/components/jobs-list-by-status";

type HistoryTab = "active" | "completed" | "failed" | "pending";

interface PersonaHistoryProps {
  activeTab: HistoryTab;
  onTabChange: (tab: HistoryTab) => void;
}

const PersonaHistory = ({ activeTab, onTabChange }: PersonaHistoryProps) => {
  const tabs: { value: HistoryTab; label: string; icon: ElementType }[] =
    useMemo(
      () => [
        { value: "active", label: "Active", icon: Clock },
        { value: "completed", label: "Completed", icon: CheckCircle2 },
        { value: "failed", label: "Failed", icon: AlertTriangle },
        { value: "pending", label: "Pending", icon: Clock },
      ],
      []
    );

  return (
    <div className="space-y-4">
      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-muted-foreground text-sm">
          Track your Persona Status
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => onTabChange(val as HistoryTab)}>
        <TabsList className="bg-muted/50 h-auto w-full justify-start gap-2 rounded-lg p-2">
          {tabs.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="text-foreground flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-md"
            >
              <Icon className="h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="active" className="mt-0">
            <JobsListByStatus status="in_progress" jobType="persona_clustering" />
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

