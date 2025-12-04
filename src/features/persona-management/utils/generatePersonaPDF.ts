import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

import type { PersonaData } from "@/types/persona.type";

const cleanupClonedNode = (clonedNode: HTMLElement | null) => {
  if (clonedNode?.parentNode) {
    clonedNode.parentNode.removeChild(clonedNode);
  }
};

/**
 * Converts modern color functions (oklch, oklab) to RGB by reading computed styles
 * This is necessary because html2canvas doesn't support these modern color functions
 * The browser's getComputedStyle automatically converts them to rgb
 */
const convertModernColorsToRgb = (element: HTMLElement, doc: Document = document): void => {
  const allElements = [element, ...Array.from(element.querySelectorAll("*"))];

  allElements.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;

    const win = doc.defaultView || window;
    if (!win) return;
    
    const computedStyle = win.getComputedStyle(el);
    const inlineStyle = el.style;

    try {
      // Get all color-related properties and convert to RGB
      const colorProps = [
        "color", "backgroundColor", "borderColor", "borderTopColor",
        "borderRightColor", "borderBottomColor", "borderLeftColor",
        "outlineColor", "boxShadow", "textShadow"
      ];

      colorProps.forEach((prop) => {
        try {
          const value = (computedStyle as any)[prop];
          if (value && value !== "none" && value !== "transparent" && 
              value !== "rgba(0, 0, 0, 0)" && 
              !String(value).toLowerCase().includes("oklch") &&
              !String(value).toLowerCase().includes("oklab")) {
            (inlineStyle as any)[prop] = value;
          }
        } catch (e) {
          // Ignore individual property errors
        }
      });

      // Handle border shorthand
      const borderWidth = computedStyle.borderWidth;
      const borderStyle = computedStyle.borderStyle;
      const borderColor = computedStyle.borderColor;
      if (borderWidth && borderWidth !== "0px" && borderStyle && borderStyle !== "none") {
        inlineStyle.border = `${borderWidth} ${borderStyle} ${borderColor}`;
      }
    } catch (e) {
      // Ignore errors
    }
  });
};

/**
 * Converts ALL computed styles to inline styles to prevent html2canvas from parsing CSS rules
 * This is the most aggressive approach - we inline everything so html2canvas never sees stylesheets
 */
const inlineAllComputedStyles = (element: HTMLElement): void => {
  const allElements = [element, ...Array.from(element.querySelectorAll("*"))];
  
  allElements.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    
    const computedStyle = getComputedStyle(el);
    const inlineStyle = el.style;
    
    // Get ALL CSS properties that might be relevant
    const allStyleProps = [
      // Colors
      "color", "backgroundColor", "borderColor", "borderTopColor",
      "borderRightColor", "borderBottomColor", "borderLeftColor",
      "outlineColor", "fill", "stroke",
      // Layout
      "width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight",
      "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
      "margin", "marginTop", "marginRight", "marginBottom", "marginLeft",
      "display", "position", "top", "right", "bottom", "left",
      "flex", "flexDirection", "flexWrap", "justifyContent", "alignItems", "alignSelf",
      "grid", "gridTemplateColumns", "gridTemplateRows", "gridColumn", "gridRow",
      "gap", "rowGap", "columnGap",
      // Borders
      "border", "borderWidth", "borderStyle", "borderRadius",
      "borderTop", "borderRight", "borderBottom", "borderLeft",
      // Typography
      "fontFamily", "fontSize", "fontWeight", "fontStyle", "lineHeight",
      "textAlign", "textDecoration", "textTransform", "letterSpacing",
      // Effects
      "boxShadow", "textShadow", "opacity", "transform", "transition",
      // Other
      "overflow", "overflowX", "overflowY", "zIndex", "cursor",
      "visibility", "pointerEvents", "whiteSpace", "wordWrap"
    ];
    
    // Convert all computed styles to inline styles
    allStyleProps.forEach((prop) => {
      try {
        const computedValue = (computedStyle as any)[prop];
        if (computedValue && 
            computedValue !== "none" && 
            computedValue !== "normal" &&
            computedValue !== "auto" &&
            computedValue !== "transparent" &&
            computedValue !== "rgba(0, 0, 0, 0)" &&
            computedValue !== "0px" &&
            !String(computedValue).toLowerCase().includes("oklch") &&
            !String(computedValue).toLowerCase().includes("oklab")) {
          // Only set if it's different from default
          try {
            (inlineStyle as any)[prop] = computedValue;
          } catch (e) {
            // Some properties might be read-only, ignore
          }
        }
      } catch (e) {
        // Ignore errors
      }
    });
  });
};

export const generatePersonaPDF = async (
  persona: PersonaData,
  sourceElement?: HTMLElement | null
): Promise<void> => {
  if (!sourceElement) {
    console.warn("Persona details element not found for PDF generation.");
    return;
  }

  // Clone the element
  const element = sourceElement.cloneNode(true) as HTMLElement;
  element.style.width = `${sourceElement.scrollWidth}px`;
  element.style.maxHeight = "none";
  element.style.overflow = "visible";
  element.style.position = "absolute";
  element.style.left = "-9999px";
  element.style.top = "0";

  document.body.appendChild(element);

  // Wait for styles to be computed - ensure all CSS is loaded
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => setTimeout(resolve, 100));

  // html2canvas-pro supports oklch colors natively, so we don't need complex workarounds
  // But we still convert styles to inline for better rendering quality
  inlineAllComputedStyles(element);
  convertModernColorsToRgb(element);

  // Wait a bit more for inline styles to be applied
  await new Promise((resolve) => requestAnimationFrame(resolve));

  let canvas: HTMLCanvasElement;
  
  try {
    canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: window.devicePixelRatio || 2,
      useCORS: true,
      logging: false,
      foreignObjectRendering: false,
    });
  } catch (error: unknown) {
    cleanupClonedNode(element);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // If it's still an oklch error, html2canvas-pro might not be loaded correctly
    if (errorMessage.includes("oklch") || errorMessage.includes("oklab")) {
      console.error("html2canvas-pro oklch error detected:", error);
      throw new Error(
        `PDF generation failed: html2canvas-pro should support oklch colors. ` +
        `Please restart your dev server to ensure html2canvas-pro is loaded correctly. ` +
        `Original error: ${errorMessage}`
      );
    }
    throw error;
  }

  // Create PDF from canvas
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
  
  // Cleanup
  cleanupClonedNode(element);
};

