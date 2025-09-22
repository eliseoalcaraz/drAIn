"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { OverlayToggle } from "./overlay-toggle";
import { Button } from "@/components/ui/button";
import { ComboboxForm } from "./combobox-form";
import OverlaysContent from "./overlays-content";
import { SideNavigation } from "./side-navigation";
import { DrainageTable } from "./drainage-table";
import { useManPipes } from "@/hooks/useManPipes"; // wherever you put the hook
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
}

export function ControlPanel({
  overlaysVisible,
  onToggle,
  overlays,
  onToggleOverlay,
}: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState("overlays");
  const renderContent = () => {
    switch (activeTab) {
      case "overlays":
        return (
          <OverlaysContent
            overlays={overlays}
            onToggleOverlay={onToggleOverlay}
          />
        );

      case "stats":
        return (
          <DrainageTable
            data={pipes}
            searchTerm={searchTerm}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        );

      case "simualations":
        return null;
      case "report":
        return <ReportForm />;
      case "data":
        return <ReportForm />;
      default:
        return null;
    }
  };

  const { pipes, loading } = useManPipes();
  const [sortField, setSortField] = useState<
    "id" | "TYPE" | "Pipe_Shape" | "Pipe_Lngth" | "ClogPer"
  >("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (loading) return <p>Loading...</p>;

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
          <SearchBar onSearch={handleSearch} />
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
          {(activeTab === "data" || activeTab === "stats") && <ComboboxForm />}
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
