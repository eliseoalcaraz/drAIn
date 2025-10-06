"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ControlPanelProps } from "./types";
import { DETAIL_TITLES } from "./constants";
import { useControlPanelState } from "./hooks/use-control-panel-state";
import { Sidebar } from "./components/sidebar";
import { TopBar } from "./components/top-bar";
import { ContentRenderer } from "./components/content-renderer";
import type { Inlet, Pipe, Outlet, Drain, DatasetType } from "./types";
import { usePipes, useInlets, useOutlets, useDrain } from "@/hooks";

export function ControlPanel({
  reports,
  activeTab,
  dataset,
  selectedInlet,
  selectedOutlet,
  selectedDrain,
  selectedPipe,
  onTabChange,
  onDatasetChange,
  onSelectInlet,
  onSelectOutlet,
  onSelectDrain,
  onSelectPipe,
  onBack,
  overlaysVisible,
  onToggle,
  overlays,
  onToggleOverlay,
  isSimulationMode = false,
  selectedPointForSimulation = null,
}: ControlPanelProps & { reports: any[] }) {
  const { sortField, sortDirection, searchTerm, handleSort, handleSearch } =
    useControlPanelState();

  // Drag control state
  const [isDragEnabled, setIsDragEnabled] = useState(false);

  const handleToggleDrag = (enabled: boolean) => {
    setIsDragEnabled(enabled);
  };

  // Data hooks
  const { inlets, loading: loadingInlets } = useInlets();
  const { outlets, loading: loadingOutlets } = useOutlets();
  const { pipes, loading: loadingPipes } = usePipes();
  const { drains, loading: loadingDrains } = useDrain();

  const selectedItem =
    selectedInlet || selectedPipe || selectedOutlet || selectedDrain;
  const selectedItemTitle = selectedItem ? DETAIL_TITLES[dataset] : "";

  const handleNavigateToTable = (
    dataset: "inlets" | "outlets" | "storm_drains" | "man_pipes"
  ) => {
    onDatasetChange(dataset);
    onTabChange("stats");
  };

  const handleNavigateToReportForm = () => {
    onTabChange("report");
  };

  return (
    <div className="absolute m-5 flex flex-row h-[600px] w-sm bg-white rounded-2xl">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />

      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <TopBar
          activeTab={activeTab}
          dataset={dataset}
          onDatasetChange={onDatasetChange}
          onSearch={handleSearch}
          onBack={onBack}
          hasSelectedItem={!!selectedItem}
          selectedItemTitle={selectedItemTitle}
          overlaysVisible={overlaysVisible}
          onToggleOverlays={onToggle}
          isDragEnabled={isDragEnabled}
          onToggleDrag={handleToggleDrag}
        />

        {/* Main Content */}
        <div className="relative overflow-auto flex-1">
          <ContentRenderer
            activeTab={activeTab}
            dataset={dataset}
            searchTerm={searchTerm}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            inlets={inlets}
            pipes={pipes}
            outlets={outlets}
            drains={drains}
            loadingInlets={loadingInlets}
            loadingPipes={loadingPipes}
            loadingOutlets={loadingOutlets}
            loadingDrains={loadingDrains}
            selectedInlet={selectedInlet}
            selectedPipe={selectedPipe}
            selectedOutlet={selectedOutlet}
            selectedDrain={selectedDrain}
            onSelectInlet={onSelectInlet}
            onSelectPipe={onSelectPipe}
            onSelectOutlet={onSelectOutlet}
            onSelectDrain={onSelectDrain}
            overlays={overlays}
            onToggleOverlay={onToggleOverlay}
            onNavigateToTable={handleNavigateToTable}
            onNavigateToReportForm={handleNavigateToReportForm}
            isDragEnabled={isDragEnabled}
            onToggleDrag={handleToggleDrag}
            isSimulationMode={isSimulationMode}
            selectedPointForSimulation={selectedPointForSimulation}
            reports={reports}
          />
        </div>
      </div>
    </div>
  );
}
