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
}

export default function OverlaysContent({
  overlays,
  onToggleOverlay,
}: OverlayContentProps) {
  return (
    <div className="flex flex-col gap-4 pl-3.5 pr-5">
      <ChartPieDonutText />
      <OverlayLegend overlays={overlays} onToggleOverlay={onToggleOverlay} />
      <ReportsToggle
        isVisible={overlays.find(o => o.id === "reports-layer")?.visible ?? true}
        onToggle={() => onToggleOverlay("reports-layer")}
      />
    </div>
  );
}
