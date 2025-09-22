export const DEFAULT_CENTER: [number, number] = [123.926, 10.337];
export const DEFAULT_ZOOM = 12;
export const DEFAULT_STYLE = "mapbox://styles/mapbox/streets-v11";

export const MAP_BOUNDS: [[number, number], [number, number]] = [
  [123.86601, 10.30209],
  [124.02689, 10.37254],
];

export const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoia2lsb3VraWxvdSIsImEiOiJjbWZsMmc5dWMwMGlxMmtwdXgxaHE0ZjVnIn0.TFZP0T-4zrLdI0Be-u0t3Q";

export const OVERLAY_CONFIG = [
  { id: "man_pipes-layer", name: "Man Pipes", color: "#8B008B" },
  { id: "storm_drains-layer", name: "Storm Drains", color: "#0088ff" },
  { id: "inlets-layer", name: "Inlets", color: "#00cc44" },
  { id: "outlets-layer", name: "Outlets", color: "#cc0000" },
];

export const LAYER_IDS: string[] = [
  "man_pipes-layer",
  "storm_drains-layer",
  "inlets-layer",
  "outlets-layer",
];

export const MAP_STYLES = {
  STREETS: "mapbox://styles/mapbox/streets-v11",
  SATELLITE: "mapbox://styles/mapbox/satellite-streets-v11",
} as const;
