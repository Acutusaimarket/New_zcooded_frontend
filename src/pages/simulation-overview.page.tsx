import React from "react";

import { SimulationWizard } from "../features/persona-simulation";

const SimulationOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <SimulationWizard />
    </div>
  );
};

export default SimulationOverviewPage;
