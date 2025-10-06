export interface Pipe {
  id: string;
  TYPE: string;
  Pipe_Shape: string;
  Pipe_Lngth: number;
  Height: number;
  Width: number;
  Barrels: number;
  ClogPer: number;
  ClogTime: number;
  Mannings: number;
  coordinates: [number, number][];
}

export interface Inlet {
  id: string;
  Inv_Elev: number;
  MaxDepth: number;
  Length: number;
  Height: number;
  Weir_Coeff: number;
  In_Type: number;
  ClogFac: number;
  ClogTime: number;
  FPLAIN_080: number;
  coordinates: [number, number];
}

export interface Outlet {
  id: string;
  Inv_Elev: number;
  AllowQ: number;
  FlapGate: number;
  coordinates: [number, number];
}

export interface Drain {
  id: string; // Changed from number to string to match In_Name
  In_Name: string;
  InvElev: number;
  clog_per: number;
  clogtime: number;
  Weir_coeff: number;
  Length: number;
  Height: number;
  Max_Depth: number;
  ClogFac: number;
  NameNum: number;
  FPLAIN_080: number;
  coordinates: [number, number]; // [lng, lat]
}

export type DetailItem = Pipe | Inlet | Outlet | Drain;

export type DatasetType = "inlets" | "man_pipes" | "outlets" | "storm_drains";

export type SortField = string;

export interface FieldConfig {
  label: string;
  key: string;
}

export interface ControlPanelProps {
  // Control panel state
  activeTab: string;
  dataset: DatasetType;
  // Selected items
  selectedInlet: Inlet | null;
  selectedOutlet: Outlet | null;
  selectedDrain: Drain | null;
  selectedPipe: Pipe | null;
  // Callbacks
  onTabChange: (tab: string) => void;
  onDatasetChange: (dataset: DatasetType) => void;
  onSelectInlet: (inlet: Inlet) => void;
  onSelectOutlet: (outlet: Outlet) => void;
  onSelectDrain: (drain: Drain) => void;
  onSelectPipe: (pipe: Pipe) => void;
  onBack: () => void;
  // Overlay props
  overlaysVisible: boolean;
  onToggle: (visible: boolean) => void;
  overlays: {
    id: string;
    name: string;
    color: string;
    visible: boolean;
  }[];
  onToggleOverlay: (id: string) => void;
  // Simulation mode
  isSimulationMode?: boolean;
}
