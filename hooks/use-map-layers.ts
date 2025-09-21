"use client";

import { useState, useEffect } from "react";
import type { LayerVisibility } from "@/lib/map/types";
import type mapboxgl from "mapbox-gl";

export function useMapLayers(map: mapboxgl.Map | null, layerIds: string[]) {
  const [overlayVisibility, setOverlayVisibility] = useState<LayerVisibility>({
    "man_pipes-layer": true,
    "storm_drains-layer": true,
    "inlets-layer": true,
    "outlets-layer": true,
  });

  useEffect(() => {
    if (map) {
      layerIds.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(
            layerId,
            "visibility",
            overlayVisibility[layerId as keyof LayerVisibility]
              ? "visible"
              : "none"
          );
        }
      });
    }
  }, [map, overlayVisibility, layerIds]);

  const handleOverlayToggle = (layerId: string) => {
    setOverlayVisibility((prev) => ({
      ...prev,
      [layerId]: !prev[layerId as keyof LayerVisibility],
    }));
  };

  const handleToggleAllOverlays = () => {
    const someVisible = Object.values(overlayVisibility).some(Boolean);
    const newVisibility = !someVisible;

    setOverlayVisibility({
      "man_pipes-layer": newVisibility,
      "storm_drains-layer": newVisibility,
      "inlets-layer": newVisibility,
      "outlets-layer": newVisibility,
    });
  };

  return {
    overlayVisibility,
    handleOverlayToggle,
    handleToggleAllOverlays,
  };
}
