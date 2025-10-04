"use client";

import { OverlayLegend } from "./overlay-legend";
import { ChartPieDonutText } from "./chart-pie";
import { ReportsToggle } from "./reports-toggle";

interface OverlayContentProps {
  overlays: {
    id: string;
    name: string;
    color: string;
    visible: boolean;
  }[];
  onToggleOverlay: (id: string) => void;
  onNavigateToTable?: (dataset: "inlets" | "outlets" | "storm_drains" | "man_pipes") => void;
  onNavigateToReportForm?: () => void;
}

export default function OverlaysContent({
  overlays,
  onToggleOverlay,
  onNavigateToTable,
  onNavigateToReportForm,
}: OverlayContentProps) {
  return (
    <div className="flex flex-col gap-4 pl-3.5 pr-5">
      <ChartPieDonutText onNavigate={onNavigateToTable} />
      <OverlayLegend overlays={overlays} onToggleOverlay={onToggleOverlay} />
      <ReportsToggle
        isVisible={overlays.find(o => o.id === "reports-layer")?.visible ?? true}
        onToggle={() => onToggleOverlay("reports-layer")}
        onNavigateToReportForm={onNavigateToReportForm}
      />
    </div>
  );
}
