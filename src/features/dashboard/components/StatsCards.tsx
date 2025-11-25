import { Activity, Brain, Target, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import type { DashboardStats } from "../types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const statItems = [
    {
      id: "active-simulations",
      label: "Active Simulations",
      value: stats.activeSimulations,
      icon: Activity,
      className: "text-4xl font-bold text-blue-600",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      id: "personas-in-use",
      label: "Personas in Use",
      value: stats.personasInUse,
      icon: Brain,
      className: "text-4xl font-bold text-purple-600",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      id: "avg-accuracy",
      label: "Avg. Simulation Acc.",
      value: `${stats.avgSimulationAccuracy}%`,
      icon: Target,
      className: "text-4xl font-bold text-green-600",
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      id: "recent-outcome",
      label: "Recent Outcome",
      value: stats.recentOutcome,
      icon: TrendingUp,
      className: "text-base font-medium text-gray-700 break-words",
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
      isLongText: true,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <Card
          key={item.id}
          className="group relative overflow-hidden border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2 ${item.bgColor}`}>
                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div
                className={`${item.className} ${item.isLongText ? "leading-tight" : ""}`}
              >
                {item.value}
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                {item.label}
              </p>
            </div>
          </CardContent>

          {/* Subtle gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Card>
      ))}
    </div>
  );
};
