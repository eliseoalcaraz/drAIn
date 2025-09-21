"use client";

import { BarChart3, Layers, PlayCircle } from "lucide-react";
const tabs = [
  { id: "overlays", label: "Overlay", icon: Layers },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "simulations", label: "Simulations", icon: PlayCircle },
  { id: "report", label: "Report", icon: Layers }
];
interface SideNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SideNavigation({
  activeTab,
  onTabChange,
}: SideNavigationProps) {
  return (
    <div className="flex w-full flex-col gap-5 items-center">
      <div className="flex w-full flex-col gap-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex items-center justify-center"
            >
              <button className="w-6.5 h-6.5 bg-[#B2ADAB] rounded-full flex items-center justify-center hover:bg-black transition-colors">
                <Icon className="w-3 h-3 text-white" />
              </button>

              {isActive && (
                <div className="absolute w-0.5 h-9 rounded-l-lg right-0 bg-[#B2ADAB]" />
              )}
            </div>
          );
        })}
      </div>

      <div className="w-7.5 h-7.5 bg-black rounded-full" />
    </div>
  );
}
