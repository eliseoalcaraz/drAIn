"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface OverlayLegendProps {
  overlays: {
    id: string;
    name: string;
    color: string;
    visible: boolean;
  }[];
  onToggleOverlay: (id: string) => void;
}

export function OverlayLegend({
  overlays,
  onToggleOverlay,
}: OverlayLegendProps) {
  return (
    <>
      <h3 className="font-semibold text-sm mb-3">Map Overlays</h3>
      <div className="space-y-2">
        {overlays.map((overlay) => (
          <div key={overlay.id} className="flex items-center space-x-2">
            <Checkbox
              id={overlay.id}
              checked={overlay.visible}
              onCheckedChange={() => onToggleOverlay(overlay.id)}
            />
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: overlay.color }}
            />
            <Label
              htmlFor={overlay.id}
              className="text-sm font-medium cursor-pointer"
            >
              {overlay.name}
            </Label>
          </div>
        ))}
      </div>
    </>
  );
}
