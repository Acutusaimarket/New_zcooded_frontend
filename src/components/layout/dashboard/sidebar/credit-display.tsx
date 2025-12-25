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
    return "bg-[#42bd00]";
  };

  if (isLoading) {
    return (
      <div className="border-sidebar-border bg-sidebar mx-2 space-y-2 rounded-lg border p-2 shadow-sm">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-1.5 w-full" />
        <Skeleton className="h-3 w-28" />
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const creditsConsumed = data.credits_consumed.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
  const totalCredits = data.total_credits.toLocaleString();

  return (
    <div className="mx-2 space-y-2 sm:space-y-1.5">
      {/* Credit Calculator Button */}
      <Button
        onClick={handleCalculatorClick}
        variant="outline"
        size="sm"
        className="flex h-7 w-full items-center justify-between border border-[#42bd00]/30 bg-white/30 text-[11px] font-medium text-black backdrop-blur-sm transition-all hover:border-[#42bd00]/50 hover:bg-[#42bd00]/10 sm:h-6 sm:text-[10px]"
      >
        <div className="flex items-center gap-1.5">
          <Calculator className="h-3 w-3 sm:h-2.5 sm:w-2.5" />
          <span>Credit Calculator</span>
        </div>
        <span className="text-[10px] font-semibold sm:text-[9px]">
          {creditsConsumed}
        </span>
      </Button>

      {/* Credits Card */}
      <div className="group bg-background/30 border-border/20 relative overflow-hidden rounded-md border p-2 shadow-sm backdrop-blur-md transition-all sm:p-1.5">
        {/* Credit Amount Display */}
        <div className="mb-2 sm:mb-1">
          <div className="flex items-baseline gap-1">
            <span className="text-sidebar-foreground text-base font-bold sm:text-sm">
              {creditsConsumed}
            </span>
            <span className="text-sidebar-foreground/50 text-[10px] font-medium sm:text-[9px]">
              / {totalCredits}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2 space-y-1 sm:mb-1 sm:space-y-0.5">
          <div className="flex items-center justify-between text-[9px] sm:text-[8px]">
            <span className="text-sidebar-foreground/70 font-medium">
              Usage
            </span>
            <span className="text-sidebar-foreground font-semibold">
              {usagePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="bg-sidebar-accent/50 relative h-1.5 w-full overflow-hidden rounded-full sm:h-1">
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
          className="h-7 w-full bg-[#000000] text-[10px] font-semibold text-white transition-all hover:bg-[#808080] hover:shadow-md sm:h-6 sm:text-[9px]"
        >
          <Plus className="mr-1 h-3 w-3 sm:h-2.5 sm:w-2.5" />
          Add Credits
        </Button>
      </div>
    </div>
  );
}
