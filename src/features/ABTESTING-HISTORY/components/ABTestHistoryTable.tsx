import React from "react";

import { formatDate } from "date-fns";
import { Calendar, CheckCircle, Eye, TestTube, TrendingUp } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { ABTestHistoryItem } from "../types";

interface ABTestHistoryTableProps {
  tests: ABTestHistoryItem[];
  isLoading?: boolean;
}

const formatMoney = (amount?: number, currency?: string) => {
  if (typeof amount !== "number") return "-";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
};

// Helper function to get winning variant name
const getWinningVariantName = (test: ABTestHistoryItem) => {
  if (!test.statistical_results.winning_variant) {
    return "No Winner Yet";
  }

  const winningId = test.statistical_results.winning_variant;

  // Try to find variant name from product fit analysis
  if (test.product_fit_analysis) {
    const analysis = test.product_fit_analysis.find(
      (item) =>
        item.product_id?.id === winningId ||
        item.variant_name?.toLowerCase().includes(winningId.toLowerCase())
    );
    if (analysis?.variant_name) {
      return analysis.variant_name;
    }
  }

  // Fallback to generic naming
  if (winningId.toLowerCase() === "control") return "Control";
  return `Variant ${winningId}`;
};

export const ABTestHistoryTable: React.FC<ABTestHistoryTableProps> = ({
  tests,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tests.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative">
              <div className="from-white-100 to-white-100 rounded-full bg-gradient-to-r p-8">
                <TestTube className="h-16 w-16 text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 rounded-full bg-yellow-100 p-2">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="max-w-md space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">
                Ready to Start Testing?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                No A/B tests found yet. Create your first experiment to discover
                what works best for your users and optimize your conversion
                rates.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button size="lg" asChild>
                <Link to="/dashboard/ab-testing">
                  <TestTube className="mr-2 h-5 w-5" />
                  Create Your First Test
                </Link>
              </Button>
            </div>
            <div className="w-full max-w-md border-t border-gray-100 pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-semibold text-blue-600">Easy Setup</div>
                  <div className="text-muted-foreground text-xs">
                    5 min to launch
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-green-600">
                    Real-time Data
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Live updates
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-blue-600">AI Insights</div>
                  <div className="text-muted-foreground text-xs">
                    Smart analysis
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const ABTestHistoryCard: React.FC<{
    test: ABTestHistoryItem;
    index: number;
  }> = ({ test, index }) => {
    const primaryProduct = test.products?.[0];

    return (
      <Card
        key={test._id}
        className="group dark:bg-black-100 overflow-hidden border bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-2">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                <div className="absolute -top-1 -right-1 rounded-full border-2 border-white bg-white px-1.5 py-0.5 text-xs font-semibold text-black">
                  #{index + 1}
                </div>
              </div>
              <div>
                <CardTitle className="line-clamp-1 text-xl">
                  {test.test_name}
                </CardTitle>
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(test.created_at, "dd MMMM yyyy")}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-3 w-3 rounded-full",
                  test.statistical_results.is_significant
                    ? "bg-green-500"
                    : "bg-gray-300"
                )}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Persona */}
          <div className="space-y-2">
            <div className="text-sm font-semibold">Primary Persona</div>
            <div className="flex items-start justify-between gap-3 rounded-lg border p-3">
              <div>
                <div className="font-semibold">{test.persona?.name || "—"}</div>
                <div className="text-muted-foreground line-clamp-2 text-sm">
                  {test.persona?.description || "No description"}
                </div>
              </div>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-2">
            <div className="text-sm font-semibold">Product</div>
            <div className="rounded-lg border p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="line-clamp-1 font-semibold">
                    {primaryProduct?.name || "—"}
                  </div>
                  <div className="text-muted-foreground line-clamp-2 text-sm">
                    {primaryProduct?.description || "No description"}
                  </div>
                </div>
                <div className="shrink-0 text-right text-sm">
                  <div className="font-semibold">
                    {formatMoney(
                      primaryProduct?.price,
                      primaryProduct?.currency
                    )}
                  </div>
                  <div className="text-muted-foreground">
                    {primaryProduct?.city && primaryProduct?.country
                      ? `${primaryProduct.city}, ${primaryProduct.country}`
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Winning variant & CTA */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Winning Variant:</span>
              <span className="font-semibold">
                {getWinningVariantName(test)}
              </span>
            </div>
            <Separator />
            <Button className="w-full" size="sm" asChild>
              <Link to={`/dashboard/ab-testing/history/${test._id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-semibold tracking-tight">
            Price Simulator History
          </h2>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((test, index) => (
          <ABTestHistoryCard key={test._id} test={test} index={index} />
        ))}
      </div>
    </div>
  );
};
