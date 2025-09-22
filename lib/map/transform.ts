export interface DrainagePipe {
  id: string;
  geocode: string;
  vulnerabilityRating: "low" | "moderate" | "high";
  location: string;
  installDate: string;
  lastInspection: string;
}

export function mapInletsToDrainagePipes(
  geojson: InletGeoJSON
): DrainagePipe[] {
  return geojson.features.map((feature, index) => {
    const props = feature.properties;
    const [lng, lat] = feature.geometry.coordinates;

    return {
      id: props.In_Name || `inlet-${index}`,
      geocode: props.In_Name || `inlet-${index}`,
      vulnerabilityRating:
        props.Inv_Elev > 30 ? "high" : props.Inv_Elev > 20 ? "moderate" : "low",
      location: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      installDate: "2020-01-01", // placeholder
      lastInspection: "2025-01-01", // placeholder
    };
  });
}
