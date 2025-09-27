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
  overlaysVisible,
  onToggle,
  overlays,
  onToggleOverlay,
  onSelectInlet,
  onSelectOutlet,
  onSelectDrain,
  onSelectPipe,
}: ControlPanelProps) {
  const {
    activeTab,
    setActiveTab,
    sortField,
    sortDirection,
    searchTerm,
    selectedInlet,
    selectedPipe,
    selectedOutlet,
    selectedDrain,
    setSelectedInlet,
    setSelectedPipe,
    setSelectedOutlet,
    setSelectedDrain,
    handleSort,
    handleSearch,
    handleBack,
    getSelectedItem,
  } = useControlPanelState();

  const [dataset, setDataset] = useState<DatasetType>("inlets");

  // Data hooks
  const { inlets, loading: loadingInlets } = useInlets();
  const { outlets, loading: loadingOutlets } = useOutlets();
  const { pipes, loading: loadingPipes } = usePipes();
  const { drains, loading: loadingDrains } = useDrain();

  const selectedItem = getSelectedItem();
  const selectedItemTitle = selectedItem ? DETAIL_TITLES[dataset] : "";

  const handleInletSelect = (inlet: Inlet) => {
    onSelectInlet(inlet);
    setSelectedInlet(inlet);
  };

  const handlePipeSelect = (pipe: Pipe) => {
    onSelectPipe(pipe);
    setSelectedPipe(pipe);
  };

  const handleOutletSelect = (outlet: Outlet) => {
    onSelectOutlet(outlet);
    setSelectedOutlet(outlet);
  };

  const handleDrainSelect = (drain: Drain) => {
    onSelectDrain(drain);
    setSelectedDrain(drain);
  };

  return (
    <div className="absolute m-5 flex flex-row h-[600px] w-sm bg-white rounded-2xl">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <TopBar
          activeTab={activeTab}
          dataset={dataset}
          onDatasetChange={setDataset}
          onSearch={handleSearch}
          onBack={handleBack}
          hasSelectedItem={!!selectedItem}
          selectedItemTitle={selectedItemTitle}
          overlaysVisible={overlaysVisible}
          onToggleOverlays={onToggle}
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
            onSelectInlet={handleInletSelect}
            onSelectPipe={handlePipeSelect}
            onSelectOutlet={handleOutletSelect}
            onSelectDrain={handleDrainSelect}
            overlays={overlays}
            onToggleOverlay={onToggleOverlay}
          />
        </div>

        {/* Bottom Blue Button */}
        {activeTab === "simulations" && (
          <div className="w-full mt-4 p-3">
            <Button className="w-full bg-[#4b72f3] border border-[#2b3ea7] text-white py-6 rounded-xl font-medium text-base hover:bg-blue-600 transition-colors">
              Simulate
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
