"use client";

import { useState } from "react";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import { OverlayToggle } from "./overlay-toggle";
import { Button } from "@/components/ui/button";
import { ComboboxForm } from "./combobox-form";
import OverlaysContent from "./overlays-content";
import { SideNavigation } from "./side-navigation";
import {
  PipeTable,
  InletTable,
  OutletTable,
  DrainTable,
  PipeSortField,
  InletSortField,
  OutletSortField,
  DrainSortField,
} from "./tables";
import { usePipes, useInlets, useOutlets, useDrain } from "@/hooks";
import type { Pipe, Inlet, Outlet, Drain } from "@/hooks";
import { SearchBar } from "./search-bar";
import ReportForm from "./report-form";
import ModelViewer from "./ModelViewer";

const DetailView = ({
  item,
  fields,
}: {
  item: any;
  fields: { label: string; key: string }[];
}) => (
  <div className="p-4 space-y-4">
    <div className="text-sm space-y-2">
      {fields.map((f) => (
        <p key={f.key}>
          <strong>{f.label}:</strong> {item[f.key]}
        </p>
      ))}
    </div>
  </div>
);

const fieldConfigs = {
  inlets: [
    { label: "ID", key: "id" },
    { label: "Elevation", key: "Inv_Elev" },
    { label: "Max Depth", key: "MaxDepth" },
    { label: "Length", key: "Length" },
    { label: "Clog Factor", key: "ClogFac" },
  ],
  man_pipes: [
    // Assuming 'man_pipes' maps to 'pipes' data structure
    { label: "ID", key: "id" },
    { label: "Type", key: "TYPE" },
    { label: "Shape", key: "Pipe_Shape" },
    { label: "Length", key: "Pipe_Lngth" },
    { label: "Height", key: "Height" },
    { label: "Width", key: "Width" },
    { label: "Barrels", key: "Barrels" },
    { label: "Clog %", key: "ClogPer" },
    { label: "Clog Time", key: "ClogTime" },
    { label: "Manning’s n", key: "Mannings" },
  ],
  outlets: [
    { label: "ID", key: "id" },
    { label: "Elevation", key: "Inv_Elev" },
    { label: "AllowQ", key: "AllowQ" },
    { label: "Flap Gate", key: "FlapGate" },
  ],
  storm_drains: [
    // Assuming 'storm_drains' maps to 'drains' data structure
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

interface ControlPanelProps {
  overlaysVisible: boolean;
  onToggle: (visible: boolean) => void;
  overlays: {
    id: string;
    name: string;
    color: string;
    visible: boolean;
  }[];
  onToggleOverlay: (id: string) => void;
  onSelectInlet: (inlet: Inlet) => void;
  onSelectOutlet: (outlet: Outlet) => void;
  onSelectDrain: (drain: Drain) => void;
  onSelectPipe: (pipe: Pipe) => void;
}

const getFieldsForDataset = (dataset: keyof typeof fieldConfigs) => {
  return fieldConfigs[dataset] || [];
};

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
  const [activeTab, setActiveTab] = useState("overlays");

  const renderContent = () => {
    // Check for loading states first
    if (loadingInlets) {
      return <div className="p-4 text-center">Loading inlets...</div>;
    }
    if (loadingPipes) {
      return <div className="p-4 text-center">Loading pipes...</div>;
    }
    if (loadingOutlets) {
      return <div className="p-4 text-center">Loading outlets...</div>;
    }
    if (loadingDrains) {
      return <div className="p-4 text-center">Loading drains...</div>;
    }

    switch (activeTab) {
      case "overlays":
        return (
          <OverlaysContent
            overlays={overlays}
            onToggleOverlay={onToggleOverlay}
          />
        );

      case "stats":
        if (dataset === "inlets") {
          if (selectedInlet) {
            return (
              <div className="px-4 space-y-4">
                <div className="flex justify-center">
                  <ModelViewer
                    url="/models/inlet.glb"
                    defaultRotationX={0}
                    defaultRotationY={0}
                    autoRotate
                    width={250}
                    height={250}
                    defaultZoom={1.3}
                    showScreenshotButton={false}
                    enableManualZoom={false}
                    autoFrame
                  />
                </div>
                <DetailView
                  item={selectedInlet}
                  fields={getFieldsForDataset("inlets")}
                />
              </div>
            );
          }
          return (
            <InletTable
              data={inlets}
              searchTerm={searchTerm}
              onSort={(field) => handleSort(field)}
              sortField={sortField as InletSortField}
              sortDirection={sortDirection}
              onSelectInlet={(inlet) => {
                onSelectInlet(inlet); // parent callback
                setSelectedInlet(inlet); // local state update
              }}
            />
          );
        }
        if (dataset === "man_pipes") {
          if (selectedPipe) {
            return (
              <div className="px-4 space-y-4">
                <div className="flex justify-center">
                  <ModelViewer
                    url="/models/pipe.glb"
                    defaultRotationX={0}
                    defaultRotationY={0}
                    autoRotate
                    width={250}
                    height={250}
                    defaultZoom={1.3}
                    showScreenshotButton={false}
                    enableManualZoom={false}
                    autoFrame
                  />
                </div>
                <DetailView
                  item={selectedPipe}
                  fields={getFieldsForDataset("man_pipes")}
                />
              </div>
            );
          }

          return (
            <PipeTable
              data={pipes}
              searchTerm={searchTerm}
              onSort={(field) => handleSort(field)}
              sortField={sortField as PipeSortField}
              sortDirection={sortDirection}
              onSelectPipe={(pipe) => {
                onSelectPipe(pipe); // parent callback
                setSelectedPipe(pipe); // local state update
              }}
            />
          );
        }
        if (dataset === "outlets") {
          if (selectedOutlet) {
            return (
              <div className="px-4 space-y-4">
                <div className="flex justify-center">
                  <ModelViewer
                    url="/models/outlet.glb"
                    defaultRotationX={0}
                    defaultRotationY={0}
                    autoRotate
                    width={250}
                    height={250}
                    defaultZoom={1.3}
                    showScreenshotButton={false}
                    enableManualZoom={false}
                    autoFrame
                  />
                </div>
                <DetailView
                  item={selectedOutlet}
                  fields={getFieldsForDataset("outlets")}
                />
              </div>
            );
          }
          return (
            <OutletTable
              data={outlets}
              searchTerm={searchTerm}
              onSort={(field) => handleSort(field)}
              sortField={sortField as OutletSortField}
              sortDirection={sortDirection}
              onSelectOutlet={(outlet) => {
                onSelectOutlet(outlet); // parent callback
                setSelectedOutlet(outlet); // local state update
              }}
            />
          );
        }
        if (dataset === "storm_drains") {
          if (selectedDrain) {
            return (
              <div className="px-4 space-y-4">
                <div className="flex justify-center">
                  <ModelViewer
                    url="/models/storm_drain.glb"
                    defaultRotationX={0}
                    defaultRotationY={0}
                    autoRotate
                    width={250}
                    height={250}
                    defaultZoom={1.3}
                    showScreenshotButton={false}
                    enableManualZoom={false}
                    autoFrame
                  />
                </div>
                <DetailView
                  item={selectedDrain}
                  fields={getFieldsForDataset("storm_drains")}
                />
              </div>
            );
          }
          return (
            <DrainTable
              data={drains}
              searchTerm={searchTerm}
              onSort={(field) => handleSort(field)}
              sortField={sortField as DrainSortField}
              sortDirection={sortDirection}
              onSelectDrain={(drain) => {
                onSelectDrain(drain); // parent callback
                setSelectedDrain(drain); // local state update
              }}
            />
          );
        }

      case "simulations":
        return null;
      case "report":
        return <ReportForm />;
      case "thread":
        return <ReportForm />;
      default:
        return null;
    }
  };

  const { inlets, loading: loadingInlets } = useInlets();
  const { outlets, loading: loadingOutlets } = useOutlets();
  const { pipes, loading: loadingPipes } = usePipes();
  const { drains, loading: loadingDrains } = useDrain();
  const [dataset, setDataset] = useState<
    "inlets" | "man_pipes" | "outlets" | "storm_drains"
  >("inlets");

  type SortField =
    | InletSortField
    | PipeSortField
    | OutletSortField
    | DrainSortField;
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleBack = () => {
    if (selectedInlet) setSelectedInlet(null);
    else if (selectedPipe) setSelectedPipe(null);
    else if (selectedOutlet) setSelectedOutlet(null);
    else if (selectedDrain) setSelectedDrain(null);
  };

  const [selectedInlet, setSelectedInlet] = useState<Inlet | null>(null);
  const [selectedPipe, setSelectedPipe] = useState<Pipe | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [selectedDrain, setSelectedDrain] = useState<Drain | null>(null);

  return (
    <div className="absolute m-5 flex flex-row h-[600px] w-sm bg-white rounded-2xl">
      {/* Sidebar */}
      <div className="flex flex-col w-11 h-full bg-[#FFF8F5] border-r border-[#E5DFDC] py-3 justify-between rounded-l-2xl items-center">
        {/* Logo */}
        <div className="flex h-8.5 items-center">
          <div className="w-7 h-7 bg-[#B2ADAB] hover:bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Z</span>
          </div>
        </div>

        <SideNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="flex flex-1 flex-col bg-red">
        {/* Top Bar */}
        <div className="flex items-center gap-2 p-3 ">
          {/* Search Bar */}
          {((activeTab === "stats" &&
            !(
              selectedInlet ||
              selectedPipe ||
              selectedOutlet ||
              selectedDrain
            )) ||
            activeTab === "thread") && <SearchBar onSearch={handleSearch} />}

          {/* Settings Button */}
          {activeTab === "overlays" && (
            <button className="w-8.5 h-8.5 bg-[#EBEBEB] border border-[#DCDCDC] rounded-full flex items-center justify-center transition-colors">
              <MoreHorizontal className="w-5 h-5 text-[#8D8D8D] hover:text-black" />
            </button>
          )}
          {/* Toggle Button */}
          {activeTab === "overlays" && (
            <OverlayToggle
              overlaysVisible={overlaysVisible}
              onToggle={onToggle}
            />
          )}
          {activeTab === "stats" &&
            !(
              selectedInlet ||
              selectedPipe ||
              selectedOutlet ||
              selectedDrain
            ) && (
              <ComboboxForm
                value={dataset}
                onSelect={(value) =>
                  setDataset(
                    value as "inlets" | "man_pipes" | "outlets" | "storm_drains"
                  )
                }
              />
            )}
          {(selectedInlet || selectedPipe || selectedOutlet || selectedDrain) &&
            activeTab === "stats" && (
              <button
                className="w-8.5 h-8.5 bg-[#EBEBEB] border border-[#DCDCDC] rounded-full flex items-center justify-center transition-colors"
                onClick={handleBack}
              >
                <ChevronLeft className="w-5 h-5 text-[#8D8D8D] hover:text-black" />
              </button>
            )}
          {(selectedInlet || selectedPipe || selectedOutlet || selectedDrain) &&
            activeTab === "stats" && (
              <div className="flex relative bg-red-500 w-9/12 h-5">
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {selectedInlet
                    ? "Inlet Details"
                    : selectedPipe
                    ? "Pipe Details"
                    : selectedOutlet
                    ? "Outlet Details"
                    : selectedDrain
                    ? "Drain Details"
                    : ""}
                </span>
              </div>
            )}
        </div>

        {/* Main Content */}
        <div className="relative overflow-auto flex-1">{renderContent()}</div>

        {/* Bottom Blue Button */}
        {activeTab == "simulations" && (
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
