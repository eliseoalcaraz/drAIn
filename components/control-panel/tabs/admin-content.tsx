"use client";

import type { Inlet, Outlet, Pipe, Drain } from "../types";
import AllReportsList from "../../all-reports-list";
import type { DateFilterValue } from "../../date-sort";
import Maintenance from "./maintenance";

export type AdminContentProps = {
  activeAdminTab?: "maintenance" | "reports";
  dateFilter?: DateFilterValue;
  selectedInlet?: Inlet | null;
  selectedOutlet?: Outlet | null;
  selectedPipe?: Pipe | null;
  selectedDrain?: Drain | null;
  reports?: any[];
  onRefreshReports?: () => Promise<void>;
  isRefreshingReports?: boolean;
  isSimulationMode?: boolean;
};

export default function AdminContent({
  activeAdminTab = "maintenance",
  dateFilter = "all",
  selectedInlet,
  selectedOutlet,
  selectedPipe,
  selectedDrain,
  reports = [],
  onRefreshReports,
  isRefreshingReports = false,
  isSimulationMode = false,
}: AdminContentProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {activeAdminTab === "maintenance" ? (
        <Maintenance
          selectedInlet={selectedInlet}
          selectedOutlet={selectedOutlet}
          selectedPipe={selectedPipe}
          selectedDrain={selectedDrain}
        />
      ) : (
        <AllReportsList
          dateFilter={dateFilter}
          reports={reports}
          onRefresh={onRefreshReports}
          isRefreshing={isRefreshingReports}
          isSimulationMode={isSimulationMode}
          selectedInlet={selectedInlet}
          selectedOutlet={selectedOutlet}
          selectedPipe={selectedPipe}
          selectedDrain={selectedDrain}
        />
      )}
    </div>
  );
}
