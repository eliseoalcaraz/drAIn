"use client";

import { OverlayLegend } from "./overlay-legend";
import { ChartPieDonutText } from "./chart-pie";

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
    </div>
  );
}
