import { createContext } from "react";

import type { StoreApi } from "zustand";

import type { PersonaEngineStore } from "../types/persona-engine.types";

// Create a properly typed context
export const PersonaEngineStoreContext =
  createContext<StoreApi<PersonaEngineStore> | null>(null);
