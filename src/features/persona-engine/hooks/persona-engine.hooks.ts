import { useContext } from "react";

import { useStore } from "zustand";

import { PersonaEngineStoreContext } from "../context/persona-engine.store-context";
import type { PersonaEngineStore } from "../types/persona-engine.types";

// Custom hook to use the persona engine store
export const usePersonaEngineStore = <T>(
  selector: (state: PersonaEngineStore) => T
): T => {
  const store = useContext(PersonaEngineStoreContext);

  if (!store) {
    throw new Error(
      "usePersonaEngineStore must be used within a PersonaEngineProvider"
    );
  }

  return useStore(store, selector);
};

// For convenience, also export a hook that returns the entire store
export const usePersonaEngine = () => usePersonaEngineStore((state) => state);
