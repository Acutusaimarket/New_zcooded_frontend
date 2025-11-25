import { useState } from "react";

import { createStore } from "zustand";

import type { PersonaEngineStore, State } from "../types/persona-engine.types";
import { PersonaEngineStoreContext } from "./persona-engine.store-context";

export const PersonaEngineProvider = ({
  children,
  initialState = {},
}: {
  children: React.ReactNode;
  initialState?: Partial<State>;
}) => {
  const [store] = useState(() =>
    createStore<PersonaEngineStore>((set) => ({
      // State with defaults
      uploadFileResponse: initialState.uploadFileResponse || null,
      isFileUploadOpen: initialState.isFileUploadOpen ?? true,
      isGeneratePersonaOpen: initialState.isGeneratePersonaOpen ?? false,

      // Actions directly in the store (not nested)
      setUploadFileResponse: (uploadId) =>
        set((state) => ({ ...state, uploadFileResponse: uploadId })),
      setIsFileUploadOpen: (isOpen) =>
        set((state) => ({ ...state, isFileUploadOpen: isOpen })),
      setIsGeneratePersonaOpen: (isOpen) =>
        set((state) => ({ ...state, isGeneratePersonaOpen: isOpen })),
    }))
  );

  return (
    <PersonaEngineStoreContext.Provider value={store}>
      {children}
    </PersonaEngineStoreContext.Provider>
  );
};
