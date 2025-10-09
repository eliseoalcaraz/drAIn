"use client";

import { cn } from "@/lib/utils";

interface ReportsTabControlProps {
  activeTab: "submission" | "reports";
  onTabChange: (tab: "submission" | "reports") => void;
}

export function ReportsTabControl({
  activeTab,
  onTabChange,
}: ReportsTabControlProps) {
  return (
    <div className="flex items-center gap-0 bg-[#f7f7f7] rounded-full p-0.5 border border-[#DCDCDC] h-8.5">
      <button
        onClick={() => onTabChange("submission")}
        className={cn(
          "px-5 py-1 text-xs font-medium transition-all rounded-full flex-1 whitespace-nowrap h-full flex items-center justify-center",
          activeTab === "submission"
            ? "bg-white text-gray-900 shadow-sm"
            : "bg-transparent text-gray-500 hover:text-gray-700"
        )}
      >
        Submit Report
      </button>
      <button
        onClick={() => onTabChange("reports")}
        className={cn(
          "px-5 py-1 text-xs font-medium transition-all rounded-full flex-1 whitespace-nowrap h-full flex items-center justify-center",
          activeTab === "reports"
            ? "bg-white text-gray-900 shadow-sm"
            : "bg-transparent text-gray-500 hover:text-gray-700"
        )}
      >
        View Reports
      </button>
    </div>
  );
}
