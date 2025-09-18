"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface OverlayToggleProps {
  overlaysVisible: boolean;
  onToggle: (visible: boolean) => void;
}

export function OverlayToggle({
  overlaysVisible,
  onToggle,
}: OverlayToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="overlay-toggle"
        checked={overlaysVisible}
        onCheckedChange={onToggle}
        size="lg"
      />
      <Label htmlFor="overlay-toggle" className="text-sm font-medium">
        View
      </Label>
    </div>
  );
}
