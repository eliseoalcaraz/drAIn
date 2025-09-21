"use client";

import { useState } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import { OverlayToggle } from "./overlay-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OverlaysContent from "./overlays-content";
import { SideNavigation } from "./side-navigation";
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
        return null;
      case "simulations":
        return null;
      case "report":
        return <ReportForm />;
      default:
        return null;
    }
  };

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
          <div className="flex-1 relative">
            <Search className="absolute left-3 gap-2 top-1/2 transform -translate-y-1/2 text-[#8D8D8D] w-4 h-4 " />
            <Input
              placeholder="Search"
              className="pl-10 bg-[#EBEBEB] rounded-full border border-[#DCDCDC] h-8.5 flex-1 focus-visible:ring-0 focus-visible:border-[#DCDCDC] shadow-none"
            />
          </div>

          {/* Settings Button */}
          {(activeTab === "overlays" || activeTab === "stats") && (
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
        </div>

        {/* Main Content */}
        <div className="relative flex-1">{renderContent()}</div>

        {/* Bottom Blue Button */}
        {activeTab !== "report" && <div className="w-full mt-4 p-3">
          <Button className="w-full bg-[#4b72f3] border border-[#2b3ea7] text-white py-6 rounded-xl font-medium text-base hover:bg-blue-600 transition-colors">
            Button
          </Button>
        </div>}
      </div>
    </div>
  );
}
