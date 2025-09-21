"use client";

import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { generatePopupContent } from "@/lib/map/popup";
import type { MapFeature } from "@/lib/map/types";

export function useMapInteractions(
  map: mapboxgl.Map | null,
  layerIds: string[]
) {
  useEffect(() => {
    if (!map) return;

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: layerIds,
      }) as MapFeature[];

      if (!features.length) return;

      const feature = features[0];
      const props = feature.properties || {};

      if (!feature.layer) return;

      const html = generatePopupContent(feature.layer.id, props);

      if (html) {
        new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(html).addTo(map);
      }
    };

    const setupCursorEvents = () => {
      layerIds.forEach((layerId) => {
        map.on("mouseenter", layerId, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = "";
        });
      });
    };

    map.on("click", handleMapClick);
    setupCursorEvents();

    return () => {
      map.off("click", handleMapClick);
      layerIds.forEach((layerId) => {
        map.on("mouseenter", layerId, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = "";
        });
      });
    };
  }, [map, layerIds]);
}
