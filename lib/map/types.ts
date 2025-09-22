interface InletProperties {
  X: number;
  Y: number;
  Inv_Elev: number;
  MaxDepth: number;
  Length: number;
  Height: number;
  Weir_Coeff: number;
  In_Type: number;
  In_Name: string;
  ClogFac: number;
  ClogTime: number;
  FPLAIN_080: number;
}

interface InletFeature {
  type: "Feature";
  properties: InletProperties;
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
}

interface InletGeoJSON {
  type: "FeatureCollection";
  name: string;
  crs: { type: string; properties: { name: string } };
  features: InletFeature[];
}
