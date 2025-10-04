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
}: ControlPanelProps) {
  const { sortField, sortDirection, searchTerm, handleSort, handleSearch } =
    useControlPanelState();

  // Data hooks
  const { inlets, loading: loadingInlets } = useInlets();
  const { outlets, loading: loadingOutlets } = useOutlets();
  const { pipes, loading: loadingPipes } = usePipes();
  const { drains, loading: loadingDrains } = useDrain();

  const selectedItem =
    selectedInlet || selectedPipe || selectedOutlet || selectedDrain;
  const selectedItemTitle = selectedItem ? DETAIL_TITLES[dataset] : "";

  const handleNavigateToTable = (dataset: "inlets" | "outlets" | "storm_drains" | "man_pipes") => {
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
