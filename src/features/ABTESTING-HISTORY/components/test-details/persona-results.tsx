import React from "react";

import { TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { ABTestHistoryItem } from "../../types";

interface PersonaResultsProps {
  test: ABTestHistoryItem;
}

export const PersonaResults: React.FC<PersonaResultsProps> = ({ test }) => {
  const formatConversionRate = (rate: number) => {
    return `${(rate * 100).toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Persona Information */}
      {/* {test.persona && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Target Persona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">{test.persona.name}</h4>
              <p className="text-muted-foreground text-sm">
                {test.persona.description}
              </p>
            </div>
            <Separator />
            <div className="text-muted-foreground text-xs">
              Persona ID: {test.persona._id}
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Product Results - Enhanced */}
      {test.product_fit_analysis && test.product_fit_analysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Product Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Overall Performance Summary */}
              {/* <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                <h4 className="mb-3 text-lg font-semibold text-blue-900">
                  Performance Overview
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      {test.product_fit_analysis.length}
                    </div>
                    <div className="text-sm text-blue-600">Variants Tested</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {Math.round(
                        Math.max(
                          ...test.product_fit_analysis.map(
                            (a) => a.compatibility_score * 100
                          )
                        )
                      )}%
                    </div>
                    <div className="text-sm text-green-600">Best Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-700">
                      {formatConversionRate(
                        Math.max(
                          ...test.product_fit_analysis.map(
                            (a) => a.conversion_probability
                          )
                        )
                      )}
                    </div>
                    <div className="text-sm text-purple-600">Best Conversion</div>
                  </div>
                </div>
              </div> */}

              {/* Individual Variant Analysis */}
              {test.product_fit_analysis.map((analysis, index) => (
                <div
                  key={index}
                  className="space-y-4 rounded-lg border-2 border-gray-100 p-6 transition-colors hover:border-blue-200"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-semibold text-gray-800">
                      {analysis.variant_name}
                    </h4>
                    <div className="flex gap-3">
                      <Badge variant="default" className="px-3 py-1 text-sm">
                        Compatibility:{" "}
                        {Math.round(analysis.compatibility_score * 100)}%
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1 text-sm">
                        Conversion:{" "}
                        {formatConversionRate(analysis.conversion_probability)}
                      </Badge>
                    </div>
                  </div>

                  {/* Enhanced Performance Metrics */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <div className="text-muted-foreground mb-1 text-xs">
                        Price Fit
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        {Math.round(analysis.price_fit_score * 100)}%
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <div className="text-muted-foreground mb-1 text-xs">
                        Engagement
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        {Math.round(analysis.engagement_potential * 100)}%
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <div className="text-muted-foreground mb-1 text-xs">
                        Usability
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        {Math.round(analysis.usability_score * 100)}%
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <div className="text-muted-foreground mb-1 text-xs">
                        Features
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        {Math.round(analysis.feature_relevance * 100)}%
                      </div>
                    </div>
                  </div>

                  {analysis.summary && (
                    <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
                      <div className="mb-2 text-sm font-semibold text-blue-900">
                        Analysis Summary
                      </div>
                      <p className="text-sm leading-relaxed text-blue-800">
                        {analysis.summary}
                      </p>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <div className="mb-2 text-sm font-semibold text-green-800">
                        Key Strengths
                      </div>
                      <ul className="space-y-1 text-sm text-green-700">
                        {(analysis?.strengths ?? []).map((strength, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1 text-green-500">✓</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <div className="mb-2 text-sm font-semibold text-red-800">
                        Areas for Improvement
                      </div>
                      <ul className="space-y-1 text-sm text-red-700">
                        {(analysis?.weaknesses ?? []).map((weakness, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1 text-red-500">⚠</span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 text-sm font-semibold text-gray-800">
                      Detailed Reasoning
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700">
                      {analysis.reasoning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
