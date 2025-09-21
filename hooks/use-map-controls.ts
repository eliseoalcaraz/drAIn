"use client";

import { useCallback } from "react";
import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLES } from "@/lib/map/config";

export function useMapControls(map: mapboxgl.Map | null) {
  const handleZoomIn = useCallback(() => {
    map?.zoomIn();
  }, [map]);

  const handleZoomOut = useCallback(() => {
    map?.zoomOut();
  }, [map]);

  const handleResetPosition = useCallback(() => {
    map?.flyTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
  }, [map]);

  const handleChangeStyle = useCallback(() => {
    if (!map) return;

    const currentStyle = map.getStyle().name;
    let newStyle = "";

    if (currentStyle === "Mapbox Streets") {
      newStyle = MAP_STYLES.SATELLITE;
    } else if (currentStyle === "Mapbox Satellite Streets") {
      newStyle = MAP_STYLES.STREETS;
    }

    if (newStyle) {
      map.setStyle(newStyle);
    }
  }, [map]);

  return {
    handleZoomIn,
    handleZoomOut,
    handleResetPosition,
    handleChangeStyle,
  };
}
