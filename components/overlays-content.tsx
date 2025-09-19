"use client";

import { OverlayLegend } from "./overlay-legend";

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
    <div className="flex-col flex-1 gap-4 px-6 py-3">
      <OverlayLegend overlays={overlays} onToggleOverlay={onToggleOverlay} />
    </div>
  );
}
