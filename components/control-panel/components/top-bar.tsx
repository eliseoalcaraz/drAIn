"use client";

import { ChevronLeft, MoreHorizontal } from "lucide-react";
import { SearchBar } from "../../search-bar";
import { ComboboxForm } from "../../combobox-form";
import { OverlayToggle } from "../../overlay-toggle";
import type { DatasetType } from "../types";

interface TopBarProps {
  activeTab: string;
  dataset: DatasetType;
  onDatasetChange: (dataset: DatasetType) => void;
  onSearch: (term: string) => void;
  onBack: () => void;
  hasSelectedItem: boolean;
  selectedItemTitle: string;
  overlaysVisible: boolean;
  onToggleOverlays: (visible: boolean) => void;
}

export function TopBar({
  activeTab,
  dataset,
  onDatasetChange,
  onSearch,
  onBack,
  hasSelectedItem,
  selectedItemTitle,
  overlaysVisible,
  onToggleOverlays,
}: TopBarProps) {
  const showSearchBar =
    (activeTab === "stats" && !hasSelectedItem) ||
    activeTab === "thread" ||
    activeTab === "overlays";
  const showSettings = activeTab === "overlays";
  const showToggle = activeTab === "overlays";
  const showCombobox = activeTab === "stats" && !hasSelectedItem;
  const showBackButton = hasSelectedItem && activeTab === "stats";

  return (
    <div className="flex items-center gap-2 p-3">
      {/* Search Bar */}
      {showSearchBar && <SearchBar onSearch={onSearch} />}

      {/* Settings Button */}
      {showSettings && (
        <button className="w-8.5 h-8.5 bg-[#EBEBEB] border border-[#DCDCDC] rounded-full flex items-center justify-center transition-colors">
          <MoreHorizontal className="w-5 h-5 text-[#8D8D8D] hover:text-black" />
        </button>
      )}

      {/* Toggle Button */}
      {showToggle && (
        <OverlayToggle
          overlaysVisible={overlaysVisible}
          onToggle={onToggleOverlays}
        />
      )}

      {/* Dataset Selector */}
      {showCombobox && (
        <ComboboxForm
          value={dataset}
          onSelect={(value) =>
            onDatasetChange(
              value as "inlets" | "man_pipes" | "outlets" | "storm_drains"
            )
          }
        />
      )}

      {/* Back Button */}
      {showBackButton && (
        <button
          className="w-8.5 h-8.5 bg-[#EBEBEB] border border-[#DCDCDC] rounded-full flex items-center justify-center transition-colors"
          onClick={onBack}
        >
          <ChevronLeft className="w-5 h-5 text-[#8D8D8D] hover:text-black" />
        </button>
      )}

      {/* Selected Item Title */}
      {showBackButton && (
        <div className="flex relative w-9/12 h-5">
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {selectedItemTitle}
          </span>
        </div>
      )}
    </div>
  );
}
