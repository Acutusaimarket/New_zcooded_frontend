import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import type { SimulationFilters } from "../types/simulation.types";

/**
 * Custom hook for managing simulation history URL query state
 * Used across SimulationHistoryList and SimulationHistoryFilters components
 */
export const useSimulationFilters = () => {
  const [state, setState] = useQueryStates({
    simulation_type: parseAsStringEnum(["overview", "detailed"]),
    date_from: parseAsString,
    date_to: parseAsString,
  });

  const getFilters = (): SimulationFilters => ({
    // @ts-expect-error some
    simulation_type: state.simulation_type || null,
    date_from: state.date_from || null,
    date_to: state.date_to || null,
  });

  const clearFilters = () => {
    setState({
      simulation_type: null,
      date_from: null,
      date_to: null,
    });
  };

  return {
    // State values
    simulationType: state.simulation_type,
    dateFrom: state.date_from,
    dateTo: state.date_to,

    // Setters
    setSimulationType: (value: "overview" | "detailed" | null) =>
      setState({ simulation_type: value }),
    setDateFrom: (value: string | null) => setState({ date_from: value }),
    setDateTo: (value: string | null) => setState({ date_to: value }),

    // Utilities
    getFilters,
    clearFilters,
  };
};
