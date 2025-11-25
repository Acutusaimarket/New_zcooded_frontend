import React from "react";

import { Award, Lightbulb } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { ABTestHistoryItem } from "../../types";

interface TestSummaryProps {
  test: ABTestHistoryItem;
}

export const TestSummary: React.FC<TestSummaryProps> = ({ test }) => {
  const formatConversionRate = (rate: number) => {
    return `${(rate * 100).toFixed(2)}%`;
  };

  // Helper function to get variant name from ID
  const getVariantDisplayName = (variantId: string) => {
    if (!variantId) return "Unknown";
    if (variantId.toLowerCase() === "control") return "Control";

    // Try to find the variant name from product fit analysis first
    if (test?.product_fit_analysis) {
      const analysis = test.product_fit_analysis.find(
        (item) =>
          item.product_id?.id === variantId ||
          item.variant_name?.toLowerCase().includes(variantId.toLowerCase())
      );
      if (analysis?.variant_name) {
        return analysis.variant_name;
      }
    }

    return `Variant ${variantId}`;
  };

  const recommendedDisplay = (() => {
    const ref = test.recommended_variant;
    if (!ref || !ref.id) return "No Recommendation";
    const byId = test.product_fit_analysis?.find(
      (a) => a.product_id?.id === ref.id
    );
    return byId?.variant_name || `Variant ${ref.id}`;
  })();

  // Get all concerns and improvements from analysis
  // const allConcerns =
  //   test.product_fit_analysis?.flatMap(
  //     (analysis) => analysis.key_concerns || []
  //   ) || [];

  // const allImprovements =
  //   test.product_fit_analysis?.flatMap(
  //     (analysis) => analysis.improvements || []
  //   ) || [];

  // Get winning variant analysis
  // const winningVariantAnalysis = test.product_fit_analysis?.find(
  //   (analysis) => analysis.variant_name === getVariantDisplayName(test.statistical_results.winning_variant || "")
  // );

  return (
    <div className="space-y-6">
      {/* Test Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Test Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="text-center">
              <div className="text-muted-foreground mb-1 text-sm">
                Winning Variant
              </div>
              <div className="text-lg font-semibold">
                {test.statistical_results.winning_variant
                  ? getVariantDisplayName(
                      test.statistical_results.winning_variant
                    )
                  : "No Clear Winner"}
              </div>
              <div className="text-muted-foreground mt-2 text-xs">
                Recommended:{" "}
                <span className="font-medium">{recommendedDisplay}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Summary with Winning Variant Strengths */}
      {test.product_fit_analysis && test.product_fit_analysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-purple-600" />
              Summary & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Test Summary */}
            {/* <div className="rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-4">
              <h4 className="mb-3 text-lg font-semibold text-purple-900">
                Test Overview
              </h4>
              <p className="text-purple-800">
                {test.statistical_results.is_significant
                  ? `The test achieved statistical significance with a ${Math.round(test.confidence_level * 100)}% confidence level. The winning variant "${getVariantDisplayName(test.statistical_results.winning_variant || "")}" showed superior performance with an effect size of ${test.statistical_results.effect_size.toFixed(3)}.`
                  : `The test did not achieve statistical significance. All variants performed within similar ranges, suggesting the need for further optimization or a longer testing period.`}
              </p>
            </div> */}

            {/* Individual Product Summaries */}
            <div className="space-y-4">
              {/* <h4 className="text-lg font-semibold text-gray-800">
                Product Analysis Summary
              </h4> */}
              {test.product_fit_analysis.map((analysis, index) => (
                <div
                  key={index}
                  className="rounded-lg border-2 border-gray-100 p-4 transition-colors hover:border-purple-200"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h5 className="text-lg font-semibold text-gray-800">
                      {analysis.variant_name}
                    </h5>
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        Score:{" "}
                        {Math.round((analysis.compatibility_score ?? 0) * 100)}%
                      </Badge>
                      <Badge variant="outline">
                        Conversion:{" "}
                        {formatConversionRate(
                          analysis.conversion_probability ?? 0
                        )}
                      </Badge>
                    </div>
                  </div>

                  {/* Product Summary */}
                  <div className="mb-4">
                    <h6 className="mb-2 font-medium text-gray-700">
                      Product Summary:
                    </h6>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {analysis.summary ||
                        `This variant achieved a compatibility score of ${Math.round((analysis.compatibility_score ?? 0) * 100)}% with a conversion probability of ${formatConversionRate(analysis.conversion_probability ?? 0)}.`}
                    </p>
                  </div>

                  {/* Winning Variant Strengths (if this is the winning variant) */}
                  {analysis.variant_name ===
                    getVariantDisplayName(
                      test.statistical_results.winning_variant || ""
                    ) && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <h6 className="mb-2 flex items-center gap-2 font-semibold text-green-800">
                        <Award className="h-4 w-4" />
                        Winning Variant Strengths
                      </h6>
                      <ul className="space-y-1 text-sm text-green-700">
                        {(analysis?.strengths ?? []).map((strength, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1 text-green-500">✓</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                      {/* <div className="mt-3 p-3 bg-white rounded border border-green-200">
                        <p className="text-sm text-green-800">
                          <strong>Recommendation:</strong> This variant should be implemented as the primary option based on its superior performance and key strengths. Monitor its long-term performance and consider it as a baseline for future optimizations.
                        </p>
                      </div> */}
                    </div>
                  )}

                  {/* Non-winning variant recommendations */}
                  {analysis.variant_name !==
                    getVariantDisplayName(
                      test.statistical_results.winning_variant || ""
                    ) && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <h6 className="mb-2 font-semibold text-blue-800">
                        Improvement Opportunities
                      </h6>
                      <ul className="space-y-1 text-sm text-blue-700">
                        {(analysis?.weaknesses ?? [])
                          .slice(0, 3)
                          .map((weakness, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="mt-1 text-blue-500">⚠</span>
                              {weakness}
                            </li>
                          ))}
                      </ul>
                      {/* <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <strong>Recommendation:</strong> Consider addressing the identified weaknesses and re-testing this variant, or use insights from this analysis to inform future product development.
                        </p>
                      </div> */}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
