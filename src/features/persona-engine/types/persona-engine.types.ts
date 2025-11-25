import type { UploadAnalysisData } from "@/types/metadata.type";

export type State = {
  uploadFileResponse: UploadAnalysisData | null;
  isFileUploadOpen: boolean;
  isGeneratePersonaOpen: boolean;
};

export type Actions = {
  setUploadFileResponse: (uploadId: UploadAnalysisData | null) => void;
  setIsFileUploadOpen: (isOpen: boolean) => void;
  setIsGeneratePersonaOpen: (isOpen: boolean) => void;
};

// Define the full store type
export type PersonaEngineStore = State & Actions;
