"use client";

import SubmitTab from "../../submit-tab";
import AllReportsList from "../../all-reports-list";
import type { DateFilterValue } from "../../date-sort";

interface ReportsTabProps {
  activeReportTab?: "submission" | "reports";
  dateFilter?: DateFilterValue;
}

export function ReportsTab({
  activeReportTab = "submission",
  dateFilter = "all",
}: ReportsTabProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {activeReportTab === "submission" ? (
        <SubmitTab />
      ) : (
        <AllReportsList dateFilter={dateFilter} />
      )}
    </div>
  );
}
