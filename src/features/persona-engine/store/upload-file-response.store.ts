import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import type { UploadAnalysisData } from "@/types/metadata.type";

type State = {
  uploadFileResponse: UploadAnalysisData | null;
  isFileUploadOpen: boolean;
  isGeneratePersonaOpen: boolean;
};

type Actions = {
  setUploadFileResponse: (uploadId: UploadAnalysisData | null) => void;
  setIsFileUploadOpen: (isOpen: boolean) => void;
  setIsGeneratePersonaOpen: (isOpen: boolean) => void;
};

export const useUploadFileStore = create<State & Actions>()(
  immer((set) => ({
    uploadFileResponse: null,
    isFileUploadOpen: true,
    isGeneratePersonaOpen: false,
    setUploadFileResponse: (uploadFileResponse: UploadAnalysisData | null) =>
      set((state) => {
        state.uploadFileResponse = uploadFileResponse;
      }),
    setIsFileUploadOpen: (isOpen: boolean) =>
      set((state) => {
        state.isFileUploadOpen = isOpen;
      }),
    setIsGeneratePersonaOpen(isOpen) {
      return set((state) => {
        state.isGeneratePersonaOpen = isOpen;
      });
    },
  }))
);
