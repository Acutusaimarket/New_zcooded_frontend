import jsPDF from "jspdf";

import type { ABTestHistoryItem } from "../types";
import type { ProductFitAnalysis } from "@/features/ABTESTING/types";

const formatDateTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatDecimal = (value: number | null | undefined): string => {
  if (value === null || value === undefined || typeof value !== "number" || Number.isNaN(value))
    return "—";
  const fraction = Math.abs(value % 1);
  return fraction === 0 ? value.toFixed(0) : value.toFixed(2);
};

// KPI metrics to display (same as in the component)
const KPI_METRICS = [
  { key: "compatibility_score", label: "Compatibility Score" },
  { key: "conversion_probability", label: "Conversion Probability" },
  { key: "predicted_purchase_rate", label: "Predicted Purchase Rate" },
  { key: "estimated_user_satisfaction", label: "Estimated User Satisfaction" },
  { key: "predicted_return_probability", label: "Predicted Return Probability" },
  { key: "long_term_retention_score", label: "Long Term Retention Score" },
  { key: "price_fit_score", label: "Price Fit Score" },
  { key: "engagement_potential", label: "Engagement Potential" },
  { key: "usability_score", label: "Usability Score" },
  { key: "feature_relevance", label: "Feature Relevance" },
  { key: "emotional_appeal_score", label: "Emotional Appeal Score" },
  { key: "social_influence_score", label: "Social Influence Score" },
] as const;

const getKPIValue = (variant: ProductFitAnalysis, kpiKey: string): string => {
  const rawValue = (variant as unknown as Record<string, unknown>)[kpiKey] as number | undefined;
  
  if (rawValue === undefined || rawValue === null) {
    return "—";
  }

  // Convert 0-1 scale to percentage
  const percentage =
    rawValue <= 1 && rawValue >= 0
      ? Math.round(rawValue * 100)
      : Math.round(rawValue);
  
  return `${percentage}%`;
};

export const generateABTestPDF = (test: ABTestHistoryItem): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredHeight: number): boolean => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper to wrap text
  const addWrappedText = (
    text: string,
    x: number,
    fontSize = 10,
    maxWidth = contentWidth
  ) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      checkPageBreak(6);
      doc.text(line, x, yPosition);
      yPosition += 6;
    });
  };

  // Title
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("AB Testing Report", margin, yPosition);
  yPosition += 15;

  // Metadata header
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  const created = formatDateTime(test.created_at);
  doc.text(`Test Name: ${test.test_name}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Created: ${created}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Sample Size: ${test.sample_size}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Confidence Level: ${test.confidence_level}%`, margin, yPosition);
  yPosition += 6;
  if (test.persona?.name) {
    doc.text(`Persona: ${test.persona.name}`, margin, yPosition);
    yPosition += 6;
  }
  doc.text(
    `Statistical Significance: ${test.statistical_results.is_significant ? "Yes" : "No"}`,
    margin,
    yPosition
  );
  yPosition += 6;
  if (test.statistical_results.p_value !== null) {
    doc.text(
      `P-Value: ${formatDecimal(test.statistical_results.p_value)}`,
      margin,
      yPosition
    );
    yPosition += 6;
  }
  yPosition += 10;

  doc.setTextColor(0, 0, 0);

  // KPI Summary Section
  if (test.product_fit_analysis && test.product_fit_analysis.length > 0) {
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("KPI Summary", margin, yPosition);
    yPosition += 10;

    // For each KPI metric
    KPI_METRICS.forEach((kpi) => {
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(kpi.label, margin, yPosition);
      yPosition += 8;

      // Create a table for variants
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Variant", margin, yPosition);
      doc.text("Value", margin + 100, yPosition);
      yPosition += 6;

      // Draw line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition - 2, margin + contentWidth, yPosition - 2);
      yPosition += 3;

      // Variant rows
      doc.setFont("helvetica", "normal");
      test.product_fit_analysis.forEach((variant) => {
        checkPageBreak(8);
        const value = getKPIValue(variant, kpi.key);
        doc.text(variant.variant_name || "Unknown", margin, yPosition);
        doc.text(value, margin + 100, yPosition);
        yPosition += 6;
      });

      yPosition += 5;
    });
  }

  // Recommendations Section
  if (test.product_fit_analysis && test.product_fit_analysis.length > 0) {
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Recommendations", margin, yPosition);
    yPosition += 10;

    test.product_fit_analysis.forEach((variant) => {
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(variant.variant_name || "Unknown Variant", margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      // Strengths
      if (variant.strengths && variant.strengths.length > 0) {
        checkPageBreak(15);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 100, 0);
        doc.text("Strengths:", margin + 5, yPosition);
        yPosition += 6;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        variant.strengths.forEach((strength) => {
          addWrappedText(`• ${strength}`, margin + 10, 9, contentWidth - 15);
        });
        yPosition += 3;
      }

      // Weaknesses
      if (variant.weaknesses && variant.weaknesses.length > 0) {
        checkPageBreak(15);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(200, 0, 0);
        doc.text("Weaknesses:", margin + 5, yPosition);
        yPosition += 6;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        variant.weaknesses.forEach((weakness) => {
          addWrappedText(`• ${weakness}`, margin + 10, 9, contentWidth - 15);
        });
        yPosition += 3;
      }

      // Reasoning
      if (variant.reasoning) {
        checkPageBreak(15);
        doc.setFont("helvetica", "bold");
        doc.text("Reasoning:", margin + 5, yPosition);
        yPosition += 6;
        doc.setFont("helvetica", "normal");
        addWrappedText(variant.reasoning, margin + 10, 9, contentWidth - 15);
        yPosition += 3;
      }

      // Improvements
      if (variant.improvements && variant.improvements.length > 0) {
        checkPageBreak(15);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 200);
        doc.text("Improvements:", margin + 5, yPosition);
        yPosition += 6;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        variant.improvements.forEach((improvement) => {
          addWrappedText(`• ${improvement}`, margin + 10, 9, contentWidth - 15);
        });
        yPosition += 3;
      }

      // Key Concerns
      if (variant.key_concerns && variant.key_concerns.length > 0) {
        checkPageBreak(15);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(200, 100, 0);
        doc.text("Key Concerns:", margin + 5, yPosition);
        yPosition += 6;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        variant.key_concerns.forEach((concern) => {
          addWrappedText(`• ${concern}`, margin + 10, 9, contentWidth - 15);
        });
        yPosition += 3;
      }

      yPosition += 10;
    });
  }

  // Statistical Results Section
  checkPageBreak(20);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Statistical Results", margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Effect Size: ${formatDecimal(test.statistical_results.effect_size)}`, margin, yPosition);
  yPosition += 6;
  doc.text(
    `Control Conversion Rate: ${formatDecimal(test.statistical_results.control_conversion_rate * 100)}%`,
    margin,
    yPosition
  );
  yPosition += 6;
  if (test.statistical_results.confidence_interval) {
    doc.text(
      `Confidence Interval: [${test.statistical_results.confidence_interval[0]}, ${test.statistical_results.confidence_interval[1]}]`,
      margin,
      yPosition
    );
    yPosition += 6;
  }

  // Save the PDF
  const fileName = `ab-test-${test.test_name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${test.created_at.replace(/[:.]/g, "-")}.pdf`;
  doc.save(fileName);
};

