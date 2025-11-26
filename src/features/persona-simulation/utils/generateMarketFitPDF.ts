import jsPDF from "jspdf";

import type { MarketFitSimulationPayload } from "../types";

const formatDateTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatDecimal = (value: number): string => {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  const fraction = Math.abs(value % 1);
  return fraction === 0 ? value.toFixed(0) : value.toFixed(2);
};

const titleCase = (value: string): string =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const generateMarketFitPDF = (
  data: MarketFitSimulationPayload
): void => {
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
  doc.text("Market Fit Simulation Report", margin, yPosition);
  yPosition += 15;

  // Metadata header
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  const generated = formatDateTime(
    data.simulation_analysis.metadata.generated_at
  );
  doc.text(`Generated: ${generated}`, margin, yPosition);
  yPosition += 6;
  doc.text(
    `Total Responses: ${data.simulation_analysis.metadata.total_responses}`,
    margin,
    yPosition
  );
  yPosition += 6;
  doc.text(
    `Unique KPIs: ${data.simulation_analysis.metadata.unique_kpis}`,
    margin,
    yPosition
  );
  yPosition += 6;
  doc.text(
    `Unique Agents: ${data.simulation_analysis.metadata.unique_agents}`,
    margin,
    yPosition
  );
  yPosition += 20;

  doc.setTextColor(0, 0, 0);

  // KPI Summary Section
  checkPageBreak(20);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("KPI Summary", margin, yPosition);
  yPosition += 10;

  data.simulation_analysis.kpi_summary.forEach((kpi) => {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(titleCase(kpi.kpi_metric), margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Type: ${kpi.metric_type}`, margin + 5, yPosition);
    yPosition += 6;

    const avg = Math.round((kpi.average_response ?? 0) * 100);
    doc.text(
      `Average: ${avg}% | Min: ${formatDecimal(kpi.min_response * 100)}% | Max: ${formatDecimal(kpi.max_response * 100)}%`,
      margin + 5,
      yPosition
    );
    yPosition += 6;
    doc.text(
      `Responses: ${kpi.num_responses} | Std Dev: ${formatDecimal(kpi.std_dev)}`,
      margin + 5,
      yPosition
    );
    yPosition += 10;
    doc.setTextColor(0, 0, 0);
  });

  // Segment Analysis Section
  if (data.recommendation.segment_analysis?.length) {
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Segment Analysis", margin, yPosition);
    yPosition += 10;

    data.recommendation.segment_analysis.forEach((segment) => {
      checkPageBreak(40);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(segment.segment_name, margin, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      addWrappedText(segment.segment_size, margin + 5, 10);
      doc.text(`Fit Level: ${segment.fit_level}`, margin + 5, yPosition);
      yPosition += 10;
      doc.setTextColor(0, 0, 0);

      if (segment.strengths?.length) {
        checkPageBreak(15);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Strengths:", margin + 5, yPosition);
        yPosition += 7;
        doc.setFont("helvetica", "normal");
        segment.strengths.forEach((str) => {
          addWrappedText(`• ${str}`, margin + 10, 10, contentWidth - 15);
        });
        yPosition += 3;
      }

      if (segment.weaknesses?.length) {
        checkPageBreak(15);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Weaknesses:", margin + 5, yPosition);
        yPosition += 7;
        doc.setFont("helvetica", "normal");
        segment.weaknesses.forEach((weak) => {
          addWrappedText(`• ${weak}`, margin + 10, 10, contentWidth - 15);
        });
        yPosition += 3;
      }

      if (segment.specific_recommendations?.length) {
        checkPageBreak(15);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Recommendations:", margin + 5, yPosition);
        yPosition += 7;
        doc.setFont("helvetica", "normal");
        segment.specific_recommendations.forEach((rec) => {
          checkPageBreak(10);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text(
            `${rec.category} [${rec.priority}]:`,
            margin + 10,
            yPosition
          );
          yPosition += 6;
          doc.setFont("helvetica", "normal");
          addWrappedText(rec.recommendation, margin + 10, 9, contentWidth - 15);
          yPosition += 3;
        });
      }

      yPosition += 10;
    });
  }

  // Critical Issues Section
  if (data.recommendation.critical_issues?.length) {
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Critical Issues", margin, yPosition);
    yPosition += 10;

    data.recommendation.critical_issues.forEach((issue) => {
      checkPageBreak(30);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(issue.title, margin, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(
        `Severity: ${issue.severity} | Category: ${issue.category}`,
        margin + 5,
        yPosition
      );
      yPosition += 6;
      doc.setTextColor(0, 0, 0);

      doc.setFont("helvetica", "normal");
      addWrappedText(issue.description, margin + 5, 10);
      yPosition += 5;

      if (issue.affected_segments?.length) {
        doc.setFont("helvetica", "bold");
        doc.text("Affected Segments:", margin + 5, yPosition);
        yPosition += 6;
        doc.setFont("helvetica", "normal");
        addWrappedText(
          issue.affected_segments.join(", "),
          margin + 10,
          9,
          contentWidth - 15
        );
        yPosition += 5;
      }

      yPosition += 10;
    });
  }

  // Product Modifications Section
  if (data.recommendation.product_modification?.length) {
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Product & Experience Modifications", margin, yPosition);
    yPosition += 10;

    data.recommendation.product_modification.forEach((mod) => {
      checkPageBreak(25);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(mod.modification_area, margin, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text("Current State:", margin + 5, yPosition);
      yPosition += 6;
      doc.setTextColor(0, 0, 0);
      addWrappedText(mod.current_state, margin + 10, 9, contentWidth - 15);
      yPosition += 3;

      doc.setTextColor(80, 80, 80);
      doc.text("Recommended State:", margin + 5, yPosition);
      yPosition += 6;
      doc.setTextColor(0, 0, 0);
      addWrappedText(mod.recommended_state, margin + 10, 9, contentWidth - 15);
      yPosition += 5;
    });
  }

  // Value Proposition Rewrites Section
  if (data.recommendation.value_proposition_rewrite?.length) {
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Value Proposition Recommendations", margin, yPosition);
    yPosition += 10;

    data.recommendation.value_proposition_rewrite.forEach((vp) => {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Current Messaging:", margin, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      addWrappedText(vp.current_messaging, margin + 5, 10);
      yPosition += 5;

      vp.recommendation_by_segment.forEach((segRec) => {
        checkPageBreak(15);
        doc.setFont("helvetica", "bold");
        doc.text(segRec.segment_name, margin + 5, yPosition);
        yPosition += 6;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        doc.text(`Hook: ${segRec.primary_hook}`, margin + 10, yPosition);
        yPosition += 6;
        doc.setTextColor(0, 0, 0);

        segRec.key_messages_to_add.forEach((msg) => {
          addWrappedText(`• ${msg}`, margin + 10, 9, contentWidth - 15);
        });
        yPosition += 5;
      });

      yPosition += 10;
    });
  }

  // Save the PDF
  const fileName = `market-fit-simulation-${data.simulation_analysis.metadata.generated_at}.pdf`;
  doc.save(fileName);
};

