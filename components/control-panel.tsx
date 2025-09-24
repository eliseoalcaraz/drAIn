"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { OverlayToggle } from "./overlay-toggle";
import { Button } from "@/components/ui/button";
import { ComboboxForm } from "./combobox-form";
import OverlaysContent from "./overlays-content";
import { SideNavigation } from "./side-navigation";
import { PipeTable } from "./pipe-table";
import { InletTable } from "./inlet-table";
import { OutletTable } from "./outlet-table";
import { DrainTable } from "./drain-table";
import { usePipes } from "@/hooks/usePipes";
import { useInlets } from "@/hooks/useInlets";
import { useOutlets } from "@/hooks/useOutlets";
import { useDrain } from "@/hooks/useDrain";
import { PipeSortField } from "./pipe-table";
import { InletSortField } from "./inlet-table";
import { OutletSortField } from "./outlet-table";
import { DrainSortField } from "./drain-table";
import { Inlet } from "@/hooks/useInlets";
import { Outlet } from "@/hooks/useOutlets";
import { Drain } from "@/hooks/useDrain";
import { Pipe } from "@/hooks/usePipes";
import { SearchBar } from "./search-bar";
import ReportForm from "./report-form";

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
              <div className="p-4 space-y-4">
                <h2 className="text-lg font-semibold">Inlet Details</h2>
                <div className="text-sm space-y-2">
                  <p>
                    <strong>ID:</strong> {selectedInlet.id}
                  </p>
                  <p>
                    <strong>Elevation:</strong> {selectedInlet.Inv_Elev}
                  </p>
                  <p>
                    <strong>Max Depth:</strong> {selectedInlet.MaxDepth}
                  </p>
                  <p>
                    <strong>Length:</strong> {selectedInlet.Length}
                  </p>
                  <p>
                    <strong>Clog Factor:</strong> {selectedInlet.ClogFac}
                  </p>
                </div>
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
              <div className="p-4 space-y-4">
                <h2 className="text-lg font-semibold">Pipe Details</h2>
                <div className="text-sm space-y-2">
                  <p>
                    <strong>ID:</strong> {selectedPipe.id}
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedPipe.TYPE}
                  </p>
                  <p>
                    <strong>Shape:</strong> {selectedPipe.Pipe_Shape}
                  </p>
                  <p>
                    <strong>Length:</strong> {selectedPipe.Pipe_Lngth}
                  </p>
                  <p>
                    <strong>Height:</strong> {selectedPipe.Height}
                  </p>
                  <p>
                    <strong>Width:</strong> {selectedPipe.Width}
                  </p>
                  <p>
                    <strong>Barrels:</strong> {selectedPipe.Barrels}
                  </p>
                  <p>
                    <strong>Clog %:</strong> {selectedPipe.ClogPer}
                  </p>
                  <p>
                    <strong>Clog Time:</strong> {selectedPipe.ClogTime}
                  </p>
                  <p>
                    <strong>Manning’s n:</strong> {selectedPipe.Mannings}
                  </p>
                </div>
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
              <div className="p-4 space-y-4">
                <h2 className="text-lg font-semibold">Outlet Details</h2>
                <div className="text-sm space-y-2">
                  <p>
                    <strong>ID:</strong> {selectedOutlet.id}
                  </p>
                  <p>
                    <strong>Elevation:</strong> {selectedOutlet.Inv_Elev}
                  </p>
                  <p>
                    <strong>AllowQ:</strong> {selectedOutlet.AllowQ}
                  </p>
                  <p>
                    <strong>Flap Gate:</strong> {selectedOutlet.FlapGate}
                  </p>
                </div>
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
              <div className="p-4 space-y-4">
                <h2 className="text-lg font-semibold">Storm Drain Details</h2>
                <div className="text-sm space-y-2">
                  <p>
                    <strong>ID:</strong> {selectedDrain.id}
                  </p>
                  <p>
                    <strong>Inlet Name:</strong> {selectedDrain.In_Name}
                  </p>
                  <p>
                    <strong>Elevation:</strong> {selectedDrain.InvElev}
                  </p>
                  <p>
                    <strong>Clog %:</strong> {selectedDrain.clog_per}
                  </p>
                  <p>
                    <strong>Clog Time:</strong> {selectedDrain.clogtime}
                  </p>
                  <p>
                    <strong>Weir Coefficient:</strong>{" "}
                    {selectedDrain.Weir_coeff}
                  </p>
                  <p>
                    <strong>Length:</strong> {selectedDrain.Length}
                  </p>
                  <p>
                    <strong>Height:</strong> {selectedDrain.Height}
                  </p>
                  <p>
                    <strong>Max Depth:</strong> {selectedDrain.Max_Depth}
                  </p>
                </div>
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
        <div className="flex items-center gap-2 p-3">
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
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
        </div>

        {/* Main Content */}
        <div className="relative overflow-auto pt-3 flex-1">
          {renderContent()}
        </div>

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
