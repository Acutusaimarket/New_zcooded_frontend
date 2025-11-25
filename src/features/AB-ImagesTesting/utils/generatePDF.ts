import jsPDF from "jspdf";
import type { FilteredMediaSimulationResponse } from "@/types/media-simulation.type";

// Helper function to format KPI name
const formatKPIName = (kpiMetric: string): string => {
  return kpiMetric
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper function to format value as percentage
const formatAsPercentage = (value: number | null): string => {
  if (value === null || value === undefined) return "N/A";
  const percentage = value > 1 ? value : value * 100;
  return `${percentage.toFixed(1)}%`;
};

// Helper function to get color based on percentage
const getColorByPercentage = (percentage: number): [number, number, number] => {
  if (percentage <= 30) return [239, 68, 68]; // red
  if (percentage <= 75) return [249, 115, 22]; // orange
  return [34, 197, 94]; // green
};

export const generateMediaSimulationPDF = (
  data: FilteredMediaSimulationResponse
): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Title
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Media Simulation Results", margin, yPosition);
  yPosition += 15;

  // Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
    margin,
    yPosition
  );
  yPosition += 20;

  // KPI Summary Section
  if (data.kpi_summary && data.kpi_summary.length > 0) {
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("KPI Summary", margin, yPosition);
    yPosition += 15;

    // Table header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition - 5, contentWidth, 10, "F");
    doc.text("KPI Metric", margin + 5, yPosition + 2);
    doc.text("Average Response", pageWidth - margin - 50, yPosition + 2, {
      align: "right",
    });
    yPosition += 12;

    // KPI rows
    doc.setFont("helvetica", "normal");
    data.kpi_summary.forEach((kpi, index) => {
      checkPageBreak(10);
      const percentage = kpi.average_response !== null
        ? (kpi.average_response > 1 ? kpi.average_response : kpi.average_response * 100)
        : 0;
      const [r, g, b] = getColorByPercentage(percentage);

      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, yPosition - 5, contentWidth, 10, "F");
      }

      // KPI name
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(formatKPIName(kpi.kpi_metric), margin + 5, yPosition + 2);

      // Percentage value with color
      doc.setTextColor(r, g, b);
      doc.setFont("helvetica", "bold");
      doc.text(
        formatAsPercentage(kpi.average_response),
        pageWidth - margin - 5,
        yPosition + 2,
        { align: "right" }
      );

      yPosition += 10;
    });

    yPosition += 10;
  }

  // Recommendations Section
  if (
    data.recommendation?.media_file_modifications &&
    data.recommendation.media_file_modifications.length > 0
  ) {
    checkPageBreak(30);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Recommendations", margin, yPosition);
    yPosition += 15;

    data.recommendation.media_file_modifications.forEach((mod, index) => {
      checkPageBreak(50);

      // Recommendation title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(
        `${index + 1}. ${mod.modification_area || `Recommendation ${index + 1}`}`,
        margin,
        yPosition
      );
      yPosition += 10;

      // Current State
      if (mod.current_state) {
        checkPageBreak(20);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Current State:", margin, yPosition);
        yPosition += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const currentStateLines = doc.splitTextToSize(
          mod.current_state,
          contentWidth
        );
        currentStateLines.forEach((line: string) => {
          checkPageBreak(6);
          doc.text(line, margin, yPosition);
          yPosition += 6;
        });
        yPosition += 5;
      }

      // Recommended State
      if (mod.recommended_state) {
        checkPageBreak(25);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Recommended State:", margin, yPosition);
        yPosition += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const recommendedStateLines = doc.splitTextToSize(
          mod.recommended_state,
          contentWidth - 5
        );
        recommendedStateLines.forEach((line: string) => {
          checkPageBreak(7);
          doc.text(line, margin, yPosition);
          yPosition += 6;
        });
        yPosition += 5;
      }

      // Specific Changes
      if (mod.specific_changes) {
        checkPageBreak(30);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Specific Changes:", margin, yPosition);
        yPosition += 7;
        doc.setFont("helvetica", "normal");

        if (mod.specific_changes.visuals?.add && mod.specific_changes.visuals.add.length > 0) {
          checkPageBreak(15);
          doc.setFont("helvetica", "bold");
          doc.text("Add:", margin + 5, yPosition);
          yPosition += 6;
          doc.setFont("helvetica", "normal");
          mod.specific_changes.visuals.add.forEach((item) => {
            const itemLines = doc.splitTextToSize(`• ${item}`, contentWidth - 15);
            itemLines.forEach((line: string) => {
              checkPageBreak(7);
              doc.text(line, margin + 10, yPosition);
              yPosition += 6;
            });
            yPosition += 2;
          });
        }

        if (mod.specific_changes.visuals?.remove && mod.specific_changes.visuals.remove.length > 0) {
          checkPageBreak(15);
          yPosition += 3;
          doc.setFont("helvetica", "bold");
          doc.text("Remove:", margin + 5, yPosition);
          yPosition += 6;
          doc.setFont("helvetica", "normal");
          mod.specific_changes.visuals.remove.forEach((item) => {
            const itemLines = doc.splitTextToSize(`• ${item}`, contentWidth - 15);
            itemLines.forEach((line: string) => {
              checkPageBreak(7);
              doc.text(line, margin + 10, yPosition);
              yPosition += 6;
            });
            yPosition += 2;
          });
        }

        if (mod.specific_changes.visuals?.modify && mod.specific_changes.visuals.modify.length > 0) {
          checkPageBreak(10);
          yPosition += 3;
          doc.text("Modify:", margin + 5, yPosition);
          yPosition += 6;
          mod.specific_changes.visuals.modify.forEach((item) => {
            const itemLines = doc.splitTextToSize(`• ${item}`, contentWidth - 10);
            itemLines.forEach((line: string) => {
              checkPageBreak(6);
              doc.text(line, margin + 10, yPosition);
              yPosition += 6;
            });
          });
        }

        if (mod.specific_changes.opening_frame) {
          checkPageBreak(20);
          yPosition += 3;
          doc.setFont("helvetica", "bold");
          doc.text("Opening Frame:", margin + 5, yPosition);
          yPosition += 6;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          const frameLines = doc.splitTextToSize(
            mod.specific_changes.opening_frame,
            contentWidth - 15
          );
          frameLines.forEach((line: string) => {
            checkPageBreak(7);
            doc.text(line, margin + 10, yPosition);
            yPosition += 6;
          });
          yPosition += 3;
        }

        if (mod.specific_changes.platform_optimization) {
          checkPageBreak(20);
          yPosition += 3;
          doc.setFont("helvetica", "bold");
          doc.text("Platform Optimization:", margin + 5, yPosition);
          yPosition += 6;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          const platformLines = doc.splitTextToSize(
            mod.specific_changes.platform_optimization,
            contentWidth - 15
          );
          platformLines.forEach((line: string) => {
            checkPageBreak(7);
            doc.text(line, margin + 10, yPosition);
            yPosition += 6;
          });
          yPosition += 3;
        }

        if (mod.specific_changes.video_structure && mod.specific_changes.video_structure.length > 0) {
          checkPageBreak(20);
          yPosition += 3;
          doc.setFont("helvetica", "bold");
          doc.text("Video Structure:", margin + 5, yPosition);
          yPosition += 6;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          mod.specific_changes.video_structure.forEach((item) => {
            checkPageBreak(15);
            // Combine timestamp and content, then split
            const structureText = `${item.timestamp}: ${item.content}`;
            const structureLines = doc.splitTextToSize(
              structureText,
              contentWidth - 15
            );
            structureLines.forEach((line: string) => {
              checkPageBreak(7);
              doc.text(line, margin + 10, yPosition);
              yPosition += 6;
            });
            yPosition += 3;
          });
        }
      }

      // Script Rewrite
      if (mod.script_rewrite) {
        checkPageBreak(30);
        yPosition += 5;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Script Rewrite:", margin, yPosition);
        yPosition += 7;

        if (mod.script_rewrite.current_hook) {
          checkPageBreak(15);
          doc.setFont("helvetica", "normal");
          doc.text("Current Hook:", margin + 5, yPosition);
          yPosition += 6;
          const hookLines = doc.splitTextToSize(
            mod.script_rewrite.current_hook,
            contentWidth - 10
          );
          hookLines.forEach((line: string) => {
            checkPageBreak(6);
            doc.text(line, margin + 10, yPosition);
            yPosition += 6;
          });
          yPosition += 3;
        }

        if (mod.script_rewrite.recommended_hook) {
          checkPageBreak(15);
          doc.setFont("helvetica", "normal");
          doc.text("Recommended Hook:", margin + 5, yPosition);
          yPosition += 6;
          const hookLines = doc.splitTextToSize(
            mod.script_rewrite.recommended_hook,
            contentWidth - 10
          );
          hookLines.forEach((line: string) => {
            checkPageBreak(6);
            doc.text(line, margin + 10, yPosition);
            yPosition += 6;
          });
          yPosition += 3;
        }

        if (mod.script_rewrite.key_messages_to_add && mod.script_rewrite.key_messages_to_add.length > 0) {
          checkPageBreak(15);
          doc.text("Key Messages to Add:", margin + 5, yPosition);
          yPosition += 6;
          mod.script_rewrite.key_messages_to_add.forEach((msg) => {
            const msgLines = doc.splitTextToSize(msg, contentWidth - 15);
            msgLines.forEach((line: string) => {
              checkPageBreak(6);
              doc.text(line, margin + 10, yPosition);
              yPosition += 6;
            });
            yPosition += 2;
          });
        }
      }

      yPosition += 10;
    });
  }

  // Visual Analysis Section
  if (data.visual_analysis && data.visual_analysis.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Visual Analysis", margin, yPosition);
    yPosition += 15;

    data.visual_analysis.forEach((analysis, index) => {
      checkPageBreak(40);

      // Visual Analysis title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Visual Analysis ${index + 1}`, margin, yPosition);
      yPosition += 10;

      // Summary
      if (analysis.summary) {
        checkPageBreak(20);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Summary:", margin, yPosition);
        yPosition += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const summaryLines = doc.splitTextToSize(
          analysis.summary,
          contentWidth
        );
        summaryLines.forEach((line: string) => {
          checkPageBreak(6);
          doc.text(line, margin, yPosition);
          yPosition += 6;
        });
        yPosition += 5;
      }

      // Detailed Description
      if (analysis.detailed_description) {
        checkPageBreak(20);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Detailed Description:", margin, yPosition);
        yPosition += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const descLines = doc.splitTextToSize(
          analysis.detailed_description,
          contentWidth
        );
        descLines.forEach((line: string) => {
          checkPageBreak(6);
          doc.text(line, margin, yPosition);
          yPosition += 6;
        });
        yPosition += 5;
      }

      // Marketing Insights
      if (analysis.marketing_insights) {
        checkPageBreak(20);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Marketing Insights:", margin, yPosition);
        yPosition += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const insightsLines = doc.splitTextToSize(
          analysis.marketing_insights,
          contentWidth
        );
        insightsLines.forEach((line: string) => {
          checkPageBreak(6);
          doc.text(line, margin, yPosition);
          yPosition += 6;
        });
        yPosition += 5;
      }

      // Key Elements
      if (analysis.key_elements && analysis.key_elements.length > 0) {
        checkPageBreak(15);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Key Elements:", margin, yPosition);
        yPosition += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        analysis.key_elements.forEach((element) => {
          const elementLines = doc.splitTextToSize(
            `• ${element}`,
            contentWidth - 5
          );
          elementLines.forEach((line: string) => {
            checkPageBreak(6);
            doc.text(line, margin + 5, yPosition);
            yPosition += 6;
          });
        });
        yPosition += 5;
      }

      yPosition += 10;
    });
  }

  // Save the PDF
  const fileName = `media-simulation-report-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
};

