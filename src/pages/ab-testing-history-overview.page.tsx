import React from "react";

import ABTestingHistoryPage from "./ab-testing-history.page";

const ABTestingHistoryOverviewPage: React.FC = () => {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="space-y-6">
        <ABTestingHistoryPage />
      </div>
    </div>
  );
};

export default ABTestingHistoryOverviewPage;
