import React from "react";

import { SimulationWizard } from "../features/persona-simulation";

const SimulationOverviewPage: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      <div className="space-y-6 p-6">
        <SimulationWizard />
      </div>
    </div>
  );
};

export default SimulationOverviewPage;
