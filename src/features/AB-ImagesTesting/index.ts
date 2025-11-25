// Main container component
export { MediaSimulationContainer } from "./containers/MediaSimulationContainer";

// Wizard component
export { MediaSimulationWizard } from "./components/MediaSimulationWizard";

// Form components
export { ImprovedMediaSimulationForm } from "./components/ImprovedMediaSimulationForm";

// Results components
export { ImprovedMediaSimulationResults } from "./components/ImprovedMediaSimulationResults";

// API hooks
export { useMediaSimulationMutation } from "./api";

// Types from main types folder
export type {
  MediaSimulationRequest,
  MediaSimulationResponse,
  MediaSimulationData,
  MediaSimulationFormData,
  MediaFile,
  PersonaOption,
  ProductOption,
  ModelOption,
  IndividualAnalysis,
  ParticipatedPersona,
  ProductInfo,
  KPIMetrics,
  AnalysisInsights,
  ComparisonData,
  MediaRecommendationsData,
} from "@/types/media-simulation.type";
