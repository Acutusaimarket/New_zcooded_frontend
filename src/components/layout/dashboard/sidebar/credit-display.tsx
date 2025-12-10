"use client";

import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";

import { useTokenUsage } from "@/api/query/use-token-usage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CreditDisplay() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useTokenUsage();

  const scrollToPricing = () => {
    navigate("/");
    setTimeout(() => {
      const pricingSection = document.getElementById("pricing-section");
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const usagePercentage = useMemo(() => {
    if (!data || data.total_credits === 0) return 0;
    return (data.credits_consumed / data.total_credits) * 100;
  }, [data]);

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500/80";
    if (percentage >= 75) return "bg-orange-500/80";
    if (percentage >= 50) return "bg-amber-500/80";
    return "bg-primary/60";
  };

  if (isLoading) {
    return (
      <div className="mx-2 space-y-3 rounded-md border border-sidebar-border bg-sidebar p-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-1 w-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const isLowCredits = usagePercentage >= 75;

  return (
    <div
      className={cn(
        "mx-2 rounded-md border border-sidebar-border bg-sidebar p-3",
        isLowCredits && "border-orange-500/30"
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={scrollToPricing}
              variant="ghost"
              size="sm"
              className="h-6 border border-[#42BD00] px-2 text-xs hover:bg-sidebar-accent"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add credits
            </Button>
            <span className="text-xs font-medium text-sidebar-foreground/80">
              Credits
            </span>
          </div>
          {isLowCredits && (
            <span className="text-[10px] font-medium text-orange-500">
              Low
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-sidebar-accent">
            <div
              className={cn(
                "h-full transition-all duration-300",
                getUsageColor(usagePercentage)
              )}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-semibold text-sidebar-foreground">
                {data.credits_consumed.toFixed(1)}
              </span>
              <span className="text-xs text-sidebar-foreground/50">/</span>
              <span className="text-xs font-medium text-sidebar-foreground/60">
                {data.total_credits.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] font-medium text-sidebar-foreground/50">
              {usagePercentage.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

