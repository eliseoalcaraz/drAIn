import type { DatasetType, Pipe, Inlet, Outlet, Drain } from "../types";
import { FIELD_CONFIGS, MODEL_URLS } from "../constants";
import { DetailView } from "./detail-view";
import OverlaysContent from "../../overlays-content";
import ReportForm from "../../report-form";
import {
  PipeTable,
  InletTable,
  OutletTable,
  DrainTable,
  PipeSortField,
  InletSortField,
  OutletSortField,
  DrainSortField,
} from "@/components/tables";

interface ContentRendererProps {
  activeTab: string;
  dataset: DatasetType;
  searchTerm: string;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;

  // Data and loading states
  inlets: Inlet[];
  pipes: Pipe[];
  outlets: Outlet[];
  drains: Drain[];
  loadingInlets: boolean;
  loadingPipes: boolean;
  loadingOutlets: boolean;
  loadingDrains: boolean;

  // Selected items
  selectedInlet: Inlet | null;
  selectedPipe: Pipe | null;
  selectedOutlet: Outlet | null;
  selectedDrain: Drain | null;

  // Selection handlers
  onSelectInlet: (inlet: Inlet) => void;
  onSelectPipe: (pipe: Pipe) => void;
  onSelectOutlet: (outlet: Outlet) => void;
  onSelectDrain: (drain: Drain) => void;

  // Overlay props
  overlays: Array<{
    id: string;
    name: string;
    color: string;
    visible: boolean;
  }>;
  onToggleOverlay: (id: string) => void;

  // Navigation props
  onNavigateToTable?: (
    dataset: "inlets" | "outlets" | "storm_drains" | "man_pipes"
  ) => void;
  onNavigateToReportForm?: () => void;

  // Drag control props
  isDragEnabled?: boolean;
  onToggleDrag?: (enabled: boolean) => void;
}

export function ContentRenderer({
  activeTab,
  dataset,
  searchTerm,
  sortField,
  sortDirection,
  onSort,
  inlets,
  pipes,
  outlets,
  drains,
  loadingInlets,
  loadingPipes,
  loadingOutlets,
  loadingDrains,
  selectedInlet,
  selectedPipe,
  selectedOutlet,
  selectedDrain,
  onSelectInlet,
  onSelectPipe,
  onSelectOutlet,
  onSelectDrain,
  overlays,
  onToggleOverlay,
  onNavigateToTable,
  onNavigateToReportForm,
  isDragEnabled,
  onToggleDrag,
}: ContentRendererProps) {
  // Check for loading states first
  if (loadingInlets)
    return <div className="p-4 text-center">Loading inlets...</div>;
  if (loadingPipes)
    return <div className="p-4 text-center">Loading pipes...</div>;
  if (loadingOutlets)
    return <div className="p-4 text-center">Loading outlets...</div>;
  if (loadingDrains)
    return <div className="p-4 text-center">Loading drains...</div>;

  switch (activeTab) {
    case "overlays":
      return (
        <OverlaysContent
          overlays={overlays}
          onToggleOverlay={onToggleOverlay}
          onNavigateToTable={onNavigateToTable}
          onNavigateToReportForm={onNavigateToReportForm}
          searchTerm={searchTerm}
          isDragEnabled={isDragEnabled}
          onToggleDrag={onToggleDrag}
        />
      );

    case "stats":
      return renderStatsContent();

    case "simulations":
      return null;

    case "report":
      return <ReportForm />;

    case "chatbot":
      return null;

    default:
      return null;
  }

  function renderStatsContent() {
    const selectedItem =
      selectedInlet || selectedPipe || selectedOutlet || selectedDrain;

    if (selectedItem) {
      return (
        <DetailView
          item={selectedItem}
          fields={FIELD_CONFIGS[dataset]}
          modelUrl={MODEL_URLS[dataset]}
        />
      );
    }

    // Render appropriate table based on dataset
    switch (dataset) {
      case "inlets":
        return (
          <InletTable
            data={inlets}
            searchTerm={searchTerm}
            onSort={onSort}
            sortField={sortField as InletSortField}
            sortDirection={sortDirection}
            onSelectInlet={(inlet) => {
              onSelectInlet(inlet);
            }}
          />
        );

      case "man_pipes":
        return (
          <PipeTable
            data={pipes}
            searchTerm={searchTerm}
            onSort={onSort}
            sortField={sortField as PipeSortField}
            sortDirection={sortDirection}
            onSelectPipe={(pipe) => {
              onSelectPipe(pipe);
            }}
          />
        );

      case "outlets":
        return (
          <OutletTable
            data={outlets}
            searchTerm={searchTerm}
            onSort={onSort}
            sortField={sortField as OutletSortField}
            sortDirection={sortDirection}
            onSelectOutlet={(outlet) => {
              onSelectOutlet(outlet);
            }}
          />
        );

      case "storm_drains":
        return (
          <DrainTable
            data={drains}
            searchTerm={searchTerm}
            onSort={onSort}
            sortField={sortField as DrainSortField}
            sortDirection={sortDirection}
            onSelectDrain={(drain) => {
              onSelectDrain(drain);
            }}
          />
        );

      default:
        return null;
    }
  }
}
