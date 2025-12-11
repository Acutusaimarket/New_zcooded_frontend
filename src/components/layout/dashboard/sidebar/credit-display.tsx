"use client";

import { useMemo } from "react";

import { Calculator, Plus } from "lucide-react";
import { useNavigate } from "react-router";

import { useTokenUsage } from "@/api/query/use-token-usage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CreditDisplay() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useTokenUsage();

  const handleAddCredits = () => {
    navigate("/add-credits");
  };

  const handleCalculatorClick = () => {
    navigate("/credit-calculator");
  };

  const usagePercentage = useMemo(() => {
    if (!data || data.total_credits === 0) return 0;
    return (data.credits_consumed / data.total_credits) * 100;
  }, [data]);

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-orange-500";
    if (percentage >= 50) return "bg-amber-500";
    return "bg-[#42BD00]";
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) return { text: "Critical", color: "text-red-500" };
    if (percentage >= 75) return { text: "Low", color: "text-orange-500" };
    if (percentage >= 50) return { text: "Moderate", color: "text-amber-500" };
    return { text: "Good", color: "text-[#42BD00]" };
  };

  if (isLoading) {
    return (
      <div className="border-sidebar-border bg-sidebar mx-2 space-y-3 rounded-lg border p-4 shadow-sm">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const isLowCredits = usagePercentage >= 75;
  const status = getUsageStatus(usagePercentage);

  return (
    <div className="mx-2 space-y-2">
      {/* Credit Calculator Button */}
      <Button
        onClick={handleCalculatorClick}
        variant="outline"
        size="sm"
        className="h-7 w-full border border-[#42BD00]/30 bg-[#42BD00]/5 text-[10px] font-medium text-[#42BD00] hover:border-[#42BD00]/50 hover:bg-[#42BD00]/10"
      >
        <Calculator className="mr-1.5 h-3 w-3" />
        Credit Calculator
      </Button>

      {/* Credits Card */}
      <div
        className={cn(
          "from-sidebar to-sidebar-accent/30 group relative overflow-hidden rounded-md border bg-gradient-to-br p-2.5 shadow-sm transition-all hover:shadow-md",
          isLowCredits &&
            "from-sidebar border-orange-500/40 bg-gradient-to-br to-orange-500/5"
        )}
      >
        {/* Header */}
        <div className="mb-2 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {/* <div className="rounded-md bg-[#42BD00]/10 p-1.5">
              <Coins className="h-4 w-4 text-[#42BD00]" />
            </div> */}
            {/* <div>
              <h3 className="text-sidebar-foreground text-xs font-semibold">
                Credits Balance
              </h3>
              <p className="text-sidebar-foreground/60 text-[10px]">
                {status.text}
              </p>
            </div> */}
          </div>
          {isLowCredits && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                status.color,
                "bg-orange-500/10"
              )}
            >
              {status.text}
            </span>
          )}
        </div>

        {/* Credit Amount Display */}
        <div className="mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-sidebar-foreground text-lg font-bold">
              {data.credits_consumed.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </span>
            <span className="text-sidebar-foreground/50 text-[10px] font-medium">
              / {data.total_credits.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2 space-y-1">
          <div className="flex items-center justify-between text-[9px]">
            <span className="text-sidebar-foreground/70 font-medium">
              Usage
            </span>
            <span className="text-sidebar-foreground font-semibold">
              {usagePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="bg-sidebar-accent/50 relative h-1.5 w-full overflow-hidden rounded-full">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500 ease-out",
                getUsageColor(usagePercentage)
              )}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleAddCredits}
          size="sm"
          className="h-7 w-full bg-[#000000] text-[10px] font-semibold text-white hover:bg-[#808080] hover:shadow-md"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Credits
        </Button>
      </div>
    </div>
  );
}
