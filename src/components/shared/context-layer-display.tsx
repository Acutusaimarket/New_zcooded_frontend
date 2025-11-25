import React, { useState } from "react";

import { Layers } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { buttonVariants } from "../ui/button";

interface ContextLayerDisplayProps {
  /**
   * Context layer data structure: Record<string, Array<Record<string, unknown>>>
   * Where keys are category names and values are arrays of context variable objects
   */
  contextLayer?: Record<string, Array<Record<string, unknown>>>;
  /**
   * Optional title for the component
   */
  title?: string;
  /**
   * Optional className for styling
   */
  className?: string;
  /**
   * Whether to show the component even if contextLayer is empty
   */
  showEmpty?: boolean;
}

export const ContextLayerDisplay: React.FC<ContextLayerDisplayProps> = ({
  contextLayer,
  title = "Context Layer",
  className,
  showEmpty = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Return null if contextLayer is empty and showEmpty is false
  if (!contextLayer || Object.keys(contextLayer).length === 0) {
    if (!showEmpty) {
      return null;
    }
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Layers className="h-4 w-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-muted-foreground rounded border border-dashed p-3 text-center text-xs">
            No context layer data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const categoryCount = Object.keys(contextLayer).length;
  const categories = Object.entries(contextLayer);
  const defaultShowCount = 3;
  const hasMore = categoryCount > defaultShowCount;
  const visibleCategories = categories.slice(0, defaultShowCount);
  const hiddenCategories = categories.slice(defaultShowCount);

  const renderCategory = (
    [category, variables]: [string, Array<Record<string, unknown>>],
    index: number,
    totalCount: number
  ) => (
    <div key={category}>
      {/* Category Header */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-muted-foreground text-xs font-medium">
          {category}
        </span>
        <Badge variant="outline" className="h-5 text-xs">
          {variables.length}
        </Badge>
      </div>

      {/* Variables List */}
      <div className="ml-2 space-y-1.5">
        {variables.length > 0 ? (
          variables.map((variable, varIndex) => (
            <div
              key={varIndex}
              className="bg-muted/30 rounded border p-2 text-xs"
            >
              {Object.entries(variable).map(([key, value]) => (
                <div key={key} className="flex items-start gap-2 py-0.5">
                  <span className="text-muted-foreground min-w-[100px] shrink-0 font-medium capitalize">
                    {key.replace(/_/g, " ")}:
                  </span>
                  <span className="text-foreground break-words">
                    {typeof value === "object" && value !== null
                      ? JSON.stringify(value)
                      : String(value)}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-muted-foreground rounded border border-dashed p-2 text-center text-xs">
            No variables
          </div>
        )}
      </div>

      {index < totalCount - 1 && <Separator className="my-3" />}
    </div>
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="h-4 w-4" />
              {title}
              <Badge variant="secondary" className="ml-1 text-xs">
                {categoryCount}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative pt-0">
          <div className="space-y-3">
            {/* Show first 3 categories by default */}
            {visibleCategories.map((category, index) =>
              renderCategory(category, index, visibleCategories.length)
            )}

            {/* Show remaining categories in collapsible */}
            {hasMore && (
              <>
                {visibleCategories.length > 0 && <Separator className="my-3" />}
                <CollapsibleContent>
                  <div className="space-y-3">
                    {hiddenCategories.map((category, index) =>
                      renderCategory(category, index, hiddenCategories.length)
                    )}
                  </div>
                </CollapsibleContent>
              </>
            )}
          </div>
          {/* Gradient overlay - only show when collapsed and has more content */}
          {hasMore && !isOpen && (
            <div className="from-card via-card/80 pointer-events-none absolute inset-x-0 bottom-0 h-50 bg-gradient-to-t to-transparent" />
          )}
          {hasMore && (
            <CollapsibleTrigger
              showIcon={false}
              className={cn(
                buttonVariants({
                  size: "sm",
                  className:
                    "from-primary/80 via-primary to-primary/80 hover:from-primary hover:via-primary/90 hover:to-primary text-primary-foreground absolute right-1/2 bottom-5 z-10 cursor-pointer bg-gradient-to-r shadow-sm transition-all",
                })
              )}
            >
              {isOpen ? "Hide All" : `View All (${hiddenCategories.length})`}
            </CollapsibleTrigger>
          )}
        </CardContent>
      </Card>
    </Collapsible>
  );
};
