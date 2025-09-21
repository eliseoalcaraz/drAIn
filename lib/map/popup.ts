import type { FeatureProperties } from "./types";

export function generatePopupContent(
  layerId: string,
  props: FeatureProperties
): string {
  const getValue = (key: string) => props[key] ?? "N/A";

  switch (layerId) {
    case "man_pipes-layer":
      return `
        <strong>Man Pipe (${getValue("Name")})</strong><br/>
        Type: ${getValue("TYPE")}<br/>
        Shape: ${getValue("Pipe_Shape")}<br/>
        Length: ${getValue("Pipe_Lngth")}<br/>
        Height: ${getValue("Height")}
        Manning's n: ${getValue("Mannings")}<br/>
        Barrels: ${getValue("Barrels")}<br/>
        Clog %: ${getValue("ClogPer")}<br/>
        Clog Time: ${getValue("ClogTime")}
      `;

    case "inlets-layer":
      return `
        <strong>Inlet (${getValue("In_Name")})</strong><br/>
        Type: ${getValue("In_Type")}<br/>
        Inv Elev: ${getValue("Inv_Elev")}<br/>
        Max Depth: ${getValue("MaxDepth")}
        Length: ${getValue("Length")} m<br/>
        Height: ${getValue("Height")} m<br/>
        Weir Coeff: ${getValue("Weir_Coeff")}<br/>
        Clog %: ${getValue("ClogFac")}<br/>
        Clog Time: ${getValue("ClogTime")}
      `;

    case "outlets-layer":
      return `
        <strong>Outlet (${getValue("Out_Name")})</strong><br/>
        Inv Elev: ${getValue("Inv_Elev")}<br/>
        AllowQ: ${getValue("AllowQ")}<br/>
        FlapGate: ${getValue("FlapGate")}
      `;

    case "storm_drains-layer":
      return `
        <strong>Storm Drain (${getValue("In_Name")})</strong><br/>
        Inv Elev: ${getValue("InvElev")}<br/>
        Max Depth: ${getValue("Max_Depth")}
        Length: ${getValue("Length")}<br/>
        Height: ${getValue("Height")}<br/>
        Clog %: ${getValue("clog_per")}
      `;

    default:
      return "";
  }
}
