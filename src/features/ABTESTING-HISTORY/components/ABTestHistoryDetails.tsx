import React from "react";

import { formatDate } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { ABTestHistoryItem } from "../types";
import { ABTestResults } from "./test-details/ab-test-results";

interface ABTestHistoryDetailsProps {
  test: ABTestHistoryItem;
  onRestart?: () => void;
}

export const ABTestHistoryDetails: React.FC<ABTestHistoryDetailsProps> = ({
  test,
  onRestart,
}) => {
  return (
    <div className="bg-background min-h-screen">
      {/* Header Section */}
      <div className="bg-card/50 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            {/* Navigation */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/ab-testing/history">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to History
                </Link>
              </Button>
            </div>

            {/* Title and Basic Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  {test.test_name}
                </h1>
                <Badge
                  variant={
                    test.statistical_results.is_significant
                      ? "default"
                      : "secondary"
                  }
                >
                  {test.statistical_results.is_significant
                    ? "Significant"
                    : "Not Significant"}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Test created on{" "}
                {formatDate(new Date(test.created_at), "dd/MM/yyyy")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <ABTestResults test={test} onRestart={onRestart} />
      </div>
    </div>
  );
};
