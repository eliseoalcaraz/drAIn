"use client";

import ReportContent from "../tabs/report-content";
import AllReportsList from "./all-reports-list";

interface ReportsTabProps {
  activeReportTab?: "submission" | "reports";
}

export function ReportsTab({ activeReportTab = "submission" }: ReportsTabProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {activeReportTab === "submission" ? (
        <ReportContent />
      ) : (
        <AllReportsList />
      )}
    </div>
  );
}
