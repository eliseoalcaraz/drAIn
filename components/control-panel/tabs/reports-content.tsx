"use client";

import SubmitTab from "../../submit-tab";
import AllReportsList from "../../all-reports-list";
import type { DateFilterValue } from "../../date-sort";

interface ReportsTabProps {
  activeReportTab?: "submission" | "reports";
  dateFilter?: DateFilterValue;
  reports?: any[];
  onRefreshReports?: () => Promise<void>;
  isRefreshingReports?: boolean;
  isSimulationMode?: boolean;
}

export function ReportsTab({
  activeReportTab = "submission",
  dateFilter = "all",
  reports = [],
  onRefreshReports,
  isRefreshingReports = false,
  isSimulationMode = false,
}: ReportsTabProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {activeReportTab === "submission" ? (
        <SubmitTab />
      ) : (
        <AllReportsList
          dateFilter={dateFilter}
          reports={reports}
          onRefresh={onRefreshReports}
          isRefreshing={isRefreshingReports}
          isSimulationMode={isSimulationMode}
        />
      )}
    </div>
  );
}
