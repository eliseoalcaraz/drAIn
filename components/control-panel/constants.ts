import type { FieldConfig, DatasetType } from "./types";

export const FIELD_CONFIGS: Record<DatasetType, FieldConfig[]> = {
  inlets: [
    { label: "ID", key: "id" },
    { label: "Inverted Elevation", key: "Inv_Elev" },
    { label: "Max Depth", key: "MaxDepth" },
    { label: "Length", key: "Length" },
    { label: "Height", key: "Height" },
    { label: "Weir Coefficient", key: "Weir_Coeff" },
    { label: "Inlet Type", key: "In_Type" },
    { label: "Clog Factor", key: "ClogFac" },
    { label: "Clog Time", key: "ClogTime" },
  ],
  man_pipes: [
    { label: "ID", key: "id" },
    { label: "Type", key: "TYPE" },
    { label: "Shape", key: "Pipe_Shape" },
    { label: "Length", key: "Pipe_Lngth" },
    { label: "Height", key: "Height" },
    { label: "Width", key: "Width" },
    { label: "Barrels", key: "Barrels" },
    { label: "Clog %", key: "ClogPer" },
    { label: "Clog Time", key: "ClogTime" },
    { label: "Manning's n", key: "Mannings" },
  ],
  outlets: [
    { label: "ID", key: "id" },
    { label: "Elevation", key: "Inv_Elev" },
    { label: "AllowQ", key: "AllowQ" },
    { label: "Flap Gate", key: "FlapGate" },
  ],
  storm_drains: [
    { label: "ID", key: "id" },
    { label: "Inlet Name", key: "In_Name" },
    { label: "Elevation", key: "InvElev" },
    { label: "Clog %", key: "clog_per" },
    { label: "Clog Time", key: "clogtime" },
    { label: "Weir Coefficient", key: "Weir_coeff" },
    { label: "Length", key: "Length" },
    { label: "Height", key: "Height" },
    { label: "Max Depth", key: "Max_Depth" },
  ],
};

export const MODEL_URLS: Record<DatasetType, string> = {
  inlets: "/models/inlet.glb",
  man_pipes: "/models/pipe.glb",
  outlets: "/models/outlet.glb",
  storm_drains: "/models/storm_drain.glb",
};

export const DETAIL_TITLES: Record<DatasetType, string> = {
  inlets: "Inlet Details",
  man_pipes: "Pipe Details",
  outlets: "Outlet Details",
  storm_drains: "Drain Details",
};
