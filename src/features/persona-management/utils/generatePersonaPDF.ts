import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import type { PersonaData } from "@/types/persona.type";

const cleanupClonedNode = (clonedNode: HTMLElement | null) => {
  if (clonedNode?.parentNode) {
    clonedNode.parentNode.removeChild(clonedNode);
  }
};

export const generatePersonaPDF = async (
  persona: PersonaData,
  sourceElement?: HTMLElement | null
): Promise<void> => {
  if (!sourceElement) {
    console.warn("Persona details element not found for PDF generation.");
    return;
  }

  const element = sourceElement.cloneNode(true) as HTMLElement;
  element.style.width = `${sourceElement.scrollWidth}px`;
  element.style.maxHeight = "none";
  element.style.overflow = "visible";
  element.style.position = "absolute";
  element.style.left = "-9999px";
  element.style.top = "0";

  document.body.appendChild(element);

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: window.devicePixelRatio || 2,
      useCORS: true,
    });

    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    const widthRatio = maxWidth / canvas.width;
    const heightRatio = maxHeight / canvas.height;
    const ratio = Math.min(widthRatio, heightRatio);

    const finalWidth = canvas.width * ratio;
    const finalHeight = canvas.height * ratio;
    const offsetX = (pageWidth - finalWidth) / 2;
    const offsetY = (pageHeight - finalHeight) / 2;

    pdf.addImage(
      imageData,
      "PNG",
      offsetX,
      offsetY,
      finalWidth,
      finalHeight,
      undefined,
      "FAST"
    );

    const fileName = `persona-${
      persona?.name?.replace(/\s+/g, "-").toLowerCase() || "details"
    }-${new Date().toISOString().split("T")[0]}.pdf`;

    pdf.save(fileName);
  } finally {
    cleanupClonedNode(element);
  }
};

