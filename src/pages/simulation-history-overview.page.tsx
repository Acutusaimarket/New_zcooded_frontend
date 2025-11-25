import React from "react";

import { SimulationHistoryPage } from "../features/simulation-history";

const SimulationHistoryOverviewPage: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      <div className="space-y-6 p-6">
        {/* <div className="space-y-2">
          <h1 className="text-primary text-3xl font-bold tracking-tight">
            Simulation History
          </h1>
          <p className="text-muted-foreground">
            Review and analyze your past simulation results.
          </p>
        </div> */}

        <SimulationHistoryPage />
      </div>
    </div>
  );
};

export default SimulationHistoryOverviewPage;
