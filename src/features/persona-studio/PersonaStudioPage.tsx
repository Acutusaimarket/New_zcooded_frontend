import { StatsCards } from "./components";

const PersonaStudio = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          Persona Studio
        </h1>
        <p className="text-muted-foreground text-sm">
          Design and manage personas for your synthetic data-driven digital twin
          simulator.
        </p>
      </div>

      {/* Stats Overview */}
      <StatsCards />
    </div>
  );
};

export default PersonaStudio;
