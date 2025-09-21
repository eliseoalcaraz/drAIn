export interface LayerVisibility {
  "man_pipes-layer": boolean;
  "storm_drains-layer": boolean;
  "inlets-layer": boolean;
  "outlets-layer": boolean;
}

export interface FeatureProperties {
  [key: string]: string | number | undefined;
}

export interface MapFeature {
  layer: { id: string };
  properties: FeatureProperties | null;
}
