"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  DEFAULT_STYLE,
  MAP_BOUNDS,
  MAPBOX_ACCESS_TOKEN,
} from "@/lib/map/config";
import { addCustomLayers } from "@/lib/map/layers";

export function useMapbox() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    if (mapContainerRef.current && !mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: DEFAULT_STYLE,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        maxBounds: MAP_BOUNDS,
      });

      mapRef.current = map;

      const handleLayerLoad = () => addCustomLayers(map);

      map.on("load", handleLayerLoad);
      map.on("style.load", handleLayerLoad);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return {
    map: mapRef.current,
    mapContainerRef,
  };
}
