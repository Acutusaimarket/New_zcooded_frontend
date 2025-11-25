import { SimulationHistoryFilters } from "../components";
import { SimulationHistoryList } from "../components/simulation-history-list";

export const SimulationHistoryPage = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Header Section */}
      <div className="bg-card/50 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Simulation History
              </h1>
              <p className="text-muted-foreground mt-2">
                Review and analyze your past simulation results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Desktop Filters Sidebar */}
        <SimulationHistoryFilters />

        <div>
          {/* Main Content Area */}
          <SimulationHistoryList />
        </div>
      </div>
    </div>
  );
};
