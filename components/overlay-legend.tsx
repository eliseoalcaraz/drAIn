"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Layers } from "lucide-react";

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
    <Card className="flex gap-2 pb-0 flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Map Layers</CardTitle>
        <CardDescription className="text-xs">
          Click an item to toggle on or off
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {overlays.map((overlay, index) => (
          <div key={overlay.id}>
            <div
              className={`
                flex items-center space-x-3 py-2 rounded-lg
                transition-all duration-200 ease-in-out group cursor-pointer
              `}
              onClick={() => onToggleOverlay(overlay.id)}
            >
              <div className="flex items-center gap-2.5 flex-1">
                <div
                  className={`
                    w-3 h-3 rounded-full border-2
                    transition-all duration-200
                    ${
                      overlay.visible
                        ? "border-white shadow-md scale-110"
                        : "border-gray-300"
                    }
                  `}
                  style={{
                    backgroundColor: overlay.color,
                    boxShadow: overlay.visible
                      ? `0 0 8px ${overlay.color}40`
                      : "none",
                  }}
                />
                <Label
                  htmlFor={overlay.id}
                  className={`
                    text-sm cursor-pointer transition-all duration-200 font-normal
                    ${
                      overlay.visible
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                    group-hover:text-foreground
                  `}
                >
                  {overlay.name}
                </Label>
              </div>
              <Switch
                checked={overlay.visible}
                onCheckedChange={() => onToggleOverlay(overlay.id)}
                className="ml-auto"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
