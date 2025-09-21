"use client";

import { ControlPanel } from "@/components/control-panel";
import { CameraControls } from "@/components/camera-controls";
import { useMemo } from "react";
import { OVERLAY_CONFIG, LAYER_IDS } from "@/lib/map/config";
import { useMapbox } from "@/hooks/use-mapbox";
import { useMapLayers } from "@/hooks/use-map-layers";
import { useMapControls } from "@/hooks/use-map-controls";
import { useMapInteractions } from "@/hooks/use-map-interactions";

import "mapbox-gl/dist/mapbox-gl.css";

export default function MapPage() {
  const { map, mapContainerRef } = useMapbox();
  const layerIds = useMemo(() => LAYER_IDS, []);

  const { overlayVisibility, handleOverlayToggle, handleToggleAllOverlays } =
    useMapLayers(map, layerIds);
  const {
    handleZoomIn,
    handleZoomOut,
    handleResetPosition,
    handleChangeStyle,
  } = useMapControls(map);

  useMapInteractions(map, layerIds);

  const overlayData = OVERLAY_CONFIG.map((config) => ({
    ...config,
    visible: overlayVisibility[config.id as keyof typeof overlayVisibility],
  }));

  const someVisible = Object.values(overlayVisibility).some(Boolean);

  return (
    <main className="relative min-h-screen flex flex-col bg-blue-200">
      <div className="w-full h-screen" ref={mapContainerRef} />
      <ControlPanel
        overlaysVisible={someVisible}
        onToggle={handleToggleAllOverlays}
        overlays={overlayData}
        onToggleOverlay={handleOverlayToggle}
      />
      <CameraControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetPosition={handleResetPosition}
        onChangeStyle={handleChangeStyle}
      />
    </main>
  );
}
