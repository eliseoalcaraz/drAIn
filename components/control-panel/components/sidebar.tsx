"use client";

import { SideNavigation } from "@/components/side-navigation";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="flex flex-col w-11 h-full bg-[#FFF8F5] border-r border-[#E5DFDC] py-3 justify-between rounded-l-2xl items-center">
      {/* Logo */}
      <div className="flex h-8.5 items-center">
        <div className="w-7 h-7 bg-[#B2ADAB] hover:bg-black rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">Z</span>
        </div>
      </div>

      <SideNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
