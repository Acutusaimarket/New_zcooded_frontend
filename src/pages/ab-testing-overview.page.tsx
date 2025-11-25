import React from "react";

import ABTestingPage from "./ab-testing.page";

const ABTestingOverviewPage: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          {/* Optional heading intentionally omitted to match Simulation pages */}
        </div>

        <ABTestingPage />
      </div>
    </div>
  );
};

export default ABTestingOverviewPage;
