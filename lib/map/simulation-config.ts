export const SIMULATION_MAP_STYLE = "mapbox://styles/mapbox/dark-v11";
export const SIMULATION_PITCH = 60;
export const SIMULATION_BEARING = -17.6;

export const SIMULATION_LAYERS = [
  { id: "man_pipes-layer", name: "Pipes", color: "#8B008B" },
  { id: "storm_drains-layer", name: "Storm Drains", color: "#0088ff" },
  { id: "inlets-layer", name: "Inlets", color: "#00cc44" },
  { id: "outlets-layer", name: "Outlets", color: "#cc0000" },
];

export const SIMULATION_LAYER_IDS = SIMULATION_LAYERS.map((layer) => layer.id);
