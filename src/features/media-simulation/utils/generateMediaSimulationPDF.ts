import jsPDF from "jspdf";

interface MediaSimulationData {
  _id: string;
  job: string;
  simulation_type: string;
  simulation_analysis: {
    metadata: {
      generated_at: string;
      total_responses: number;
      numeric_responses: number;
      excluded_kpis: string[];
      unique_agents: number;
      unique_kpis: number;
      num_questions: number;
    };
    kpi_summary: Array<{
      kpi_metric: string;
      metric_type: string;
      num_responses: number | null;
      total_response: number | null;
      average_response: number | null;
      std_dev: number | null;
      min_response: number | null;
      max_response: number | null;
    }>;
  };
  visual_analysis?: Array<Record<string, any>>;
  recommendation?: {
    media_file_modifications?: Array<{
      modification_area: string;
      current_state: string;
      recommended_state: string;
      expected_impact?: Array<{
        metric_name: string;
        expected_change: string;
        confidence_level: string;
      }>;
      specific_changes?: {
        visuals?: {
          add?: string[];
          remove?: string[];
          modify?: string[];
        };
        script_rewrite?: {
          current_hook?: string;
          recommended_hook?: string;
          key_messages_to_add?: string[];
        };
        audio_modifications?: {
          voiceover_tone?: string;
          background_music?: string;
        };
        opening_frame?: string;
        disclaimer_addition?: string;
        platform_optimization?: string;
        video_structure?: Array<{
          timestamp: string;
          content: string;
        }>;
        trust_indicators_to_add?: string[];
      };
    }>;
    alternative_strategy?: {
      scenario?: string;
      recommendation?: string;
      targeting_refinements?: {
        negative_audience_exclusions?: string[];
        positive_targeting?: Record<string, any>;
      };
      justification?: string;
    };
  };
  answered_questions?: Array<{
    question: string;
    answer: string;
  }>;
  simulation_status?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

const formatDateTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatDecimal = (value: number | null): string => {
  if (value === null || typeof value !== "number" || Number.isNaN(value))
    return "—";
  const fraction = Math.abs(value % 1);
  return fraction === 0 ? value.toFixed(0) : value.toFixed(2);
};

const titleCase = (value: string): string =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const generateMediaSimulationPDF = (
  data: MediaSimulationData
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
  doc.text("Media Simulation Report", margin, yPosition);
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
  yPosition += 6;
  doc.text(
    `Number of Questions: ${data.simulation_analysis.metadata.num_questions}`,
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

    // Handle different response formats (0-1 scale or 0-100 scale)
    const rawAvg = kpi.average_response ?? 0;
    const avg =
      rawAvg <= 1 && rawAvg >= 0
        ? Math.round(rawAvg * 100)
        : Math.round(rawAvg);

    const rawMin = kpi.min_response;
    const min =
      rawMin !== null
        ? rawMin <= 1 && rawMin >= 0
          ? rawMin * 100
          : rawMin
        : null;

    const rawMax = kpi.max_response;
    const max =
      rawMax !== null
        ? rawMax <= 1 && rawMax >= 0
          ? rawMax * 100
          : rawMax
        : null;

    doc.text(
      `Average: ${avg}${rawAvg <= 1 && rawAvg >= 0 ? "%" : ""} | Min: ${formatDecimal(min)}${min !== null && min <= 1 && min >= 0 ? "%" : ""} | Max: ${formatDecimal(max)}${max !== null && max <= 1 && max >= 0 ? "%" : ""}`,
      margin + 5,
      yPosition
    );
    yPosition += 6;
    doc.text(
      `Responses: ${kpi.num_responses ?? "N/A"} | Std Dev: ${formatDecimal(kpi.std_dev)}`,
      margin + 5,
      yPosition
    );
    yPosition += 10;
    doc.setTextColor(0, 0, 0);
  });

  // Recommendations Section
  if (data.recommendation?.media_file_modifications?.length) {
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Media File Modifications", margin, yPosition);
    yPosition += 10;

    data.recommendation.media_file_modifications.forEach((modification) => {
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(modification.modification_area, margin, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text("Current State:", margin + 5, yPosition);
      yPosition += 6;
      doc.setTextColor(0, 0, 0);
      addWrappedText(
        modification.current_state,
        margin + 10,
        9,
        contentWidth - 15
      );
      yPosition += 3;

      doc.setTextColor(80, 80, 80);
      doc.text("Recommended State:", margin + 5, yPosition);
      yPosition += 6;
      doc.setTextColor(0, 0, 0);
      addWrappedText(
        modification.recommended_state,
        margin + 10,
        9,
        contentWidth - 15
      );
      yPosition += 5;

      // Expected Impact
      if (modification.expected_impact?.length) {
        checkPageBreak(15);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Expected Impact:", margin + 5, yPosition);
        yPosition += 7;
        doc.setFont("helvetica", "normal");
        modification.expected_impact.forEach((impact) => {
          checkPageBreak(10);
          doc.setFontSize(10);
          doc.text(
            `${impact.metric_name}: ${impact.expected_change} [${impact.confidence_level}]`,
            margin + 10,
            yPosition
          );
          yPosition += 6;
        });
        yPosition += 3;
      }

      // Specific Changes
      if (modification.specific_changes) {
        checkPageBreak(15);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Specific Changes:", margin + 5, yPosition);
        yPosition += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        // Visuals
        if (modification.specific_changes.visuals) {
          if (
            modification.specific_changes.visuals.add?.length ||
            modification.specific_changes.visuals.remove?.length ||
            modification.specific_changes.visuals.modify?.length
          ) {
            checkPageBreak(10);
            doc.setFont("helvetica", "bold");
            doc.text("Visuals:", margin + 10, yPosition);
            yPosition += 6;
            doc.setFont("helvetica", "normal");

            if (modification.specific_changes.visuals.add?.length) {
              doc.text("Add:", margin + 15, yPosition);
              yPosition += 6;
              modification.specific_changes.visuals.add.forEach((item) => {
                addWrappedText(`• ${item}`, margin + 15, 9, contentWidth - 20);
              });
              yPosition += 3;
            }

            if (modification.specific_changes.visuals.remove?.length) {
              doc.text("Remove:", margin + 15, yPosition);
              yPosition += 6;
              modification.specific_changes.visuals.remove.forEach((item) => {
                addWrappedText(`• ${item}`, margin + 15, 9, contentWidth - 20);
              });
              yPosition += 3;
            }

            if (modification.specific_changes.visuals.modify?.length) {
              doc.text("Modify:", margin + 15, yPosition);
              yPosition += 6;
              modification.specific_changes.visuals.modify.forEach((item) => {
                addWrappedText(`• ${item}`, margin + 15, 9, contentWidth - 20);
              });
              yPosition += 3;
            }
          }
        }

        // Script Rewrite
        if (modification.specific_changes.script_rewrite) {
          checkPageBreak(10);
          doc.setFont("helvetica", "bold");
          doc.text("Script Rewrite:", margin + 10, yPosition);
          yPosition += 6;
          doc.setFont("helvetica", "normal");

          if (modification.specific_changes.script_rewrite.current_hook) {
            doc.text(
              `Current Hook: ${modification.specific_changes.script_rewrite.current_hook}`,
              margin + 15,
              yPosition
            );
            yPosition += 6;
          }

          if (modification.specific_changes.script_rewrite.recommended_hook) {
            doc.setFont("helvetica", "bold");
            doc.text(
              `Recommended Hook: ${modification.specific_changes.script_rewrite.recommended_hook}`,
              margin + 15,
              yPosition
            );
            yPosition += 6;
            doc.setFont("helvetica", "normal");
          }

          if (
            modification.specific_changes.script_rewrite.key_messages_to_add
              ?.length
          ) {
            doc.text("Key Messages to Add:", margin + 15, yPosition);
            yPosition += 6;
            modification.specific_changes.script_rewrite.key_messages_to_add.forEach(
              (msg) => {
                addWrappedText(`• ${msg}`, margin + 15, 9, contentWidth - 20);
              }
            );
            yPosition += 3;
          }
        }

        // Audio Modifications
        if (modification.specific_changes.audio_modifications) {
          checkPageBreak(10);
          doc.setFont("helvetica", "bold");
          doc.text("Audio Modifications:", margin + 10, yPosition);
          yPosition += 6;
          doc.setFont("helvetica", "normal");

          if (
            modification.specific_changes.audio_modifications.voiceover_tone
          ) {
            doc.text(
              `Voiceover Tone: ${modification.specific_changes.audio_modifications.voiceover_tone}`,
              margin + 15,
              yPosition
            );
            yPosition += 6;
          }

          if (
            modification.specific_changes.audio_modifications.background_music
          ) {
            doc.text(
              `Background Music: ${modification.specific_changes.audio_modifications.background_music}`,
              margin + 15,
              yPosition
            );
            yPosition += 6;
          }
        }

        // Other specific changes
        if (modification.specific_changes.opening_frame) {
          checkPageBreak(10);
          doc.setFont("helvetica", "bold");
          doc.text("Opening Frame:", margin + 10, yPosition);
          yPosition += 6;
          doc.setFont("helvetica", "normal");
          addWrappedText(
            modification.specific_changes.opening_frame,
            margin + 15,
            9,
            contentWidth - 20
          );
          yPosition += 3;
        }

        if (modification.specific_changes.disclaimer_addition) {
          checkPageBreak(10);
          doc.setFont("helvetica", "bold");
          doc.text("Disclaimer Addition:", margin + 10, yPosition);
          yPosition += 6;
          doc.setFont("helvetica", "normal");
          addWrappedText(
            modification.specific_changes.disclaimer_addition,
            margin + 15,
            9,
            contentWidth - 20
          );
          yPosition += 3;
        }

        if (modification.specific_changes.platform_optimization) {
          checkPageBreak(10);
          doc.setFont("helvetica", "bold");
          doc.text("Platform Optimization:", margin + 10, yPosition);
          yPosition += 6;
          doc.setFont("helvetica", "normal");
          addWrappedText(
            modification.specific_changes.platform_optimization,
            margin + 15,
            9,
            contentWidth - 20
          );
          yPosition += 3;
        }

        if (modification.specific_changes.trust_indicators_to_add?.length) {
          checkPageBreak(10);
          doc.setFont("helvetica", "bold");
          doc.text("Trust Indicators to Add:", margin + 10, yPosition);
          yPosition += 6;
          doc.setFont("helvetica", "normal");
          modification.specific_changes.trust_indicators_to_add.forEach(
            (indicator) => {
              addWrappedText(
                `• ${indicator}`,
                margin + 15,
                9,
                contentWidth - 20
              );
            }
          );
          yPosition += 3;
        }
      }

      yPosition += 10;
    });
  }

  // Alternative Strategy Section
  if (data.recommendation?.alternative_strategy) {
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Alternative Strategy", margin, yPosition);
    yPosition += 10;

    const altStrategy = data.recommendation.alternative_strategy;

    if (altStrategy.scenario) {
      checkPageBreak(15);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Scenario:", margin, yPosition);
      yPosition += 7;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      addWrappedText(altStrategy.scenario, margin + 5, 10);
      yPosition += 5;
    }

    if (altStrategy.recommendation) {
      checkPageBreak(15);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Recommendation:", margin, yPosition);
      yPosition += 7;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      addWrappedText(altStrategy.recommendation, margin + 5, 10);
      yPosition += 5;
    }

    if (altStrategy.justification) {
      checkPageBreak(15);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Justification:", margin, yPosition);
      yPosition += 7;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      addWrappedText(altStrategy.justification, margin + 5, 10);
      yPosition += 5;
    }

    if (altStrategy.targeting_refinements) {
      checkPageBreak(15);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Targeting Refinements:", margin, yPosition);
      yPosition += 7;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      if (
        altStrategy.targeting_refinements.negative_audience_exclusions?.length
      ) {
        doc.text("Negative Exclusions:", margin + 5, yPosition);
        yPosition += 6;
        altStrategy.targeting_refinements.negative_audience_exclusions.forEach(
          (exclusion) => {
            addWrappedText(`• ${exclusion}`, margin + 10, 9, contentWidth - 15);
          }
        );
        yPosition += 3;
      }
    }

    yPosition += 10;
  }

  // Answered Questions Section
  if (data.answered_questions?.length) {
    checkPageBreak(20);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Questions & Answers from Simulation", margin, yPosition);
    yPosition += 10;

    data.answered_questions.forEach((qa) => {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Q: ${qa.question}`, margin, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text("A:", margin + 5, yPosition);
      yPosition += 6;
      doc.setTextColor(0, 0, 0);
      addWrappedText(qa.answer, margin + 10, 9, contentWidth - 15);
      yPosition += 10;
    });
  }

  // Save the PDF
  const fileName = `media-simulation-${data.simulation_analysis.metadata.generated_at.replace(/[:.]/g, "-")}.pdf`;
  doc.save(fileName);
};

