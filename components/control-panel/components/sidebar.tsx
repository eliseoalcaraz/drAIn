"use client";

import { SideNavigation } from "@/components/side-navigation";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  profile: Record<string, unknown> | null;
}

export function Sidebar({ activeTab, onTabChange, profile }: SidebarProps) {
  return (
    <div className="flex flex-col w-11 h-full bg-[#FFF8F5] border-r border-[#E5DFDC] py-3 justify-between rounded-l-2xl items-center">
      {/* Logo */}

      <SideNavigation
        activeTab={activeTab}
        onTabChange={onTabChange}
        profile={profile}
      />
    </div>
  );
}
