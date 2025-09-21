import type {
  CircleLayerSpecification,
  LineLayerSpecification,
} from "mapbox-gl";

export type LayerPaint =
  | CircleLayerSpecification["paint"]
  | LineLayerSpecification["paint"];

export interface LayerConfig {
  id: string;
  sourceId: string;
  dataUrl: string;
  type: "line" | "circle";
  paint: LayerPaint;
}

export const LAYER_CONFIGS: LayerConfig[] = [
  {
    id: "man_pipes-layer",
    sourceId: "man_pipes",
    dataUrl: "/man_pipes.geojson",
    type: "line",
    paint: {
      "line-color": "#8B008B",
      "line-width": 2.5,
    },
  },
  {
    id: "storm_drains-layer",
    sourceId: "storm_drains",
    dataUrl: "/storm_drains.geojson",
    type: "circle",
    paint: {
      "circle-radius": 4,
      "circle-color": "#0088ff",
      "circle-stroke-color": "#000000",
      "circle-stroke-width": 0.5,
    },
  },
  {
    id: "inlets-layer",
    sourceId: "inlets",
    dataUrl: "/inlets.geojson",
    type: "circle",
    paint: {
      "circle-radius": 6,
      "circle-color": "#00cc44",
      "circle-stroke-color": "#000000",
      "circle-stroke-width": 0.5,
    },
  },
  {
    id: "outlets-layer",
    sourceId: "outlets",
    dataUrl: "/outlets.geojson",
    type: "circle",
    paint: {
      "circle-radius": 6,
      "circle-color": "#cc0000",
      "circle-stroke-color": "#000000",
      "circle-stroke-width": 0.5,
    },
  },
];

export function addCustomLayers(map: mapboxgl.Map) {
  LAYER_CONFIGS.forEach(({ id, sourceId, dataUrl, type, paint }) => {
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: dataUrl,
      });
      map.addLayer({
        id,
        type,
        source: sourceId,
        paint,
      });
    }
  });
}
