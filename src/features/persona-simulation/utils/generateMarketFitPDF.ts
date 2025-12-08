import jsPDF from "jspdf";

import type { MarketFitSimulationPayload } from "../types";


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
  data: MarketFitSimulationPayload,
  productName?: string
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

  // Add logo at the top (centered)
  try {
    const logoPath = "/hea.png";
    const logoWidth = 40;
    const logoHeight = 15;
    const logoX = (pageWidth - logoWidth) / 2; // Center horizontally
    doc.addImage(logoPath, "PNG", logoX, yPosition, logoWidth, logoHeight);
    yPosition += logoHeight + 15;
  } catch (error) {
    console.error("Error loading logo:", error);
    yPosition += 20;
  }

  // Product Name Section (centered)
  if (productName) {
    checkPageBreak(20);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    const productTitle = "Product";
    const productTitleWidth = doc.getTextWidth(productTitle);
    doc.text(productTitle, (pageWidth - productTitleWidth) / 2, yPosition);
    yPosition += 8;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    // Wrap product name if it's too long
    const productNameLines = doc.splitTextToSize(productName, contentWidth);
    productNameLines.forEach((line: string) => {
      checkPageBreak(7);
      const lineWidth = doc.getTextWidth(line);
      doc.text(line, (pageWidth - lineWidth) / 2, yPosition);
      yPosition += 7;
    });
    yPosition += 8;
    
    doc.setTextColor(0, 0, 0);
  }

  // Helper to wrap text with better spacing and page break handling
  const addWrappedText = (
    text: string,
    x: number,
    fontSize = 10,
    maxWidth = contentWidth,
    lineHeight = 6
  ) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      // Check if we need a new page before adding each line
      if (yPosition + lineHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, x, yPosition);
      yPosition += lineHeight;
    });
    return lines.length;
  };


  // KPI Summary Section
  checkPageBreak(20);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("KPI Summary", margin, yPosition);
  yPosition += 10;

  // Filter out ROAS and calculated metrics
  const filteredKpiSummary = data.simulation_analysis.kpi_summary.filter(
    (kpi) =>
      !(
        kpi.kpi_metric.toLowerCase() === "roas" ||
        kpi.metric_type.toLowerCase() === "calculated"
      )
  );

  filteredKpiSummary.forEach((kpi) => {
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
      // Wrap segment name if it's too long
      const segmentNameLines = doc.splitTextToSize(segment.segment_name, contentWidth);
      segmentNameLines.forEach((line: string) => {
        checkPageBreak(7);
        doc.text(line, margin, yPosition);
        yPosition += 7;
      });

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
          checkPageBreak(8);
          addWrappedText(`• ${str}`, margin + 10, 9, contentWidth - 20, 5);
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
        doc.setFontSize(9);
        segment.weaknesses.forEach((weak) => {
          checkPageBreak(8);
          addWrappedText(`• ${weak}`, margin + 10, 9, contentWidth - 20, 5);
        });
        yPosition += 3;
        doc.setFontSize(10);
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
          const categoryText = `${rec.category} [${rec.priority}]:`;
          const categoryLines = doc.splitTextToSize(categoryText, contentWidth - 20);
          categoryLines.forEach((line: string) => {
            checkPageBreak(6);
            doc.text(line, margin + 10, yPosition);
            yPosition += 6;
          });
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          addWrappedText(rec.recommendation, margin + 10, 9, contentWidth - 25, 5);
          yPosition += 3;
          doc.setFontSize(10);
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
      // Wrap title if it's too long
      const titleLines = doc.splitTextToSize(issue.title, contentWidth);
      titleLines.forEach((line: string) => {
        checkPageBreak(7);
        doc.text(line, margin, yPosition);
        yPosition += 7;
      });

      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const severityText = `Severity: ${issue.severity} | Category: ${issue.category}`;
      const severityLines = doc.splitTextToSize(severityText, contentWidth - 10);
      severityLines.forEach((line: string) => {
        checkPageBreak(6);
        doc.text(line, margin + 5, yPosition);
        yPosition += 6;
      });
      doc.setTextColor(0, 0, 0);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      addWrappedText(issue.description, margin + 5, 9, contentWidth - 15, 5);
      yPosition += 5;
      doc.setFontSize(10);

      if (issue.affected_segments?.length) {
        checkPageBreak(10);
        doc.setFont("helvetica", "bold");
        doc.text("Affected Segments:", margin + 5, yPosition);
        yPosition += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        addWrappedText(
          issue.affected_segments.join(", "),
          margin + 10,
          9,
          contentWidth - 20,
          5
        );
        yPosition += 5;
        doc.setFontSize(10);
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
      // Wrap modification area if it's too long
      const modAreaLines = doc.splitTextToSize(mod.modification_area, contentWidth);
      modAreaLines.forEach((line: string) => {
        checkPageBreak(7);
        doc.text(line, margin, yPosition);
        yPosition += 7;
      });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text("Current State:", margin + 5, yPosition);
      yPosition += 6;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      addWrappedText(mod.current_state, margin + 10, 9, contentWidth - 20, 5);
      yPosition += 3;
      doc.setFontSize(10);

      doc.setTextColor(80, 80, 80);
      doc.text("Recommended State:", margin + 5, yPosition);
      yPosition += 6;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      addWrappedText(mod.recommended_state, margin + 10, 9, contentWidth - 20, 5);
      yPosition += 5;
      doc.setFontSize(10);
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
        doc.setFontSize(11);
        // Wrap segment name if it's too long
        const segNameLines = doc.splitTextToSize(segRec.segment_name, contentWidth - 15);
        segNameLines.forEach((line: string) => {
          checkPageBreak(6);
          doc.text(line, margin + 5, yPosition);
          yPosition += 6;
        });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        const hookText = `Hook: ${segRec.primary_hook}`;
        const hookLines = doc.splitTextToSize(hookText, contentWidth - 20);
        hookLines.forEach((line: string) => {
          checkPageBreak(6);
          doc.text(line, margin + 10, yPosition);
          yPosition += 6;
        });
        doc.setTextColor(0, 0, 0);

        segRec.key_messages_to_add.forEach((msg) => {
          checkPageBreak(8);
          addWrappedText(`• ${msg}`, margin + 10, 9, contentWidth - 25, 5);
        });
        yPosition += 5;
        doc.setFontSize(10);
      });

      yPosition += 10;
    });
  }

  // Save the PDF with product name
  let fileName = "market-fit-simulation-report.pdf";
  if (productName) {
    // Sanitize product name for filename (remove special characters)
    const sanitizedName = productName
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50); // Limit length
    fileName = `${sanitizedName}.pdf`;
  }
  doc.save(fileName);
};

