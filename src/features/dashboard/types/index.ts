export interface DashboardStats {
  activeSimulations: number;
  personasInUse: number;
  avgSimulationAccuracy: number;
  recentOutcome: string;
}

export interface DashboardAction {
  id: string;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
}

export interface SimulationData {
  id: string;
  name: string;
  status: "running" | "completed" | "failed";
  accuracy: number;
  startTime: Date;
  endTime?: Date;
}
