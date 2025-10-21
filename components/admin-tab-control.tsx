"use client";

import { cn } from "@/lib/utils";

interface AdminTabControlProps {
  activeTab: "maintenance" | "reports";
  onTabChange: (tab: "maintenance" | "reports") => void;
}

export function AdminTabControl({
  activeTab,
  onTabChange,
}: AdminTabControlProps) {
  return (
    <div className="flex w-full items-center gap-0 bg-[#f7f7f7] rounded-full p-0.5 border border-[#DCDCDC] h-8.5">
      <button
        onClick={() => onTabChange("maintenance")}
        className={cn(
          "px-5 py-1 text-xs transition-all border rounded-full flex-1 whitespace-nowrap h-full flex items-center justify-center",
          activeTab === "maintenance"
            ? "bg-white text-gray-900 border-[#DCDCDC]"
            : "bg-transparent text-gray-500 hover:text-gray-700 border-transparent"
        )}
      >
        Fix
      </button>
      <button
        onClick={() => onTabChange("reports")}
        className={cn(
          "px-5 py-1 text-xs transition-all border rounded-full flex-1 whitespace-nowrap h-full flex items-center justify-center",
          activeTab === "reports"
            ? "bg-white text-gray-900 border-[#DCDCDC]"
            : "bg-transparent text-gray-500 hover:text-gray-700 border-transparent"
        )}
      >
        View
      </button>
    </div>
  );
}
