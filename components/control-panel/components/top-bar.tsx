"use client";

import { useState } from "react";
import {
  ChevronLeft,
  MoreHorizontal,
  Lock,
  LockOpen,
  LogOut,
  Bell,
  BellRing,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { SearchBar } from "../../search-bar";
import { ComboboxForm } from "../../combobox-form";
import { OverlayToggle } from "../../overlay-toggle";
import {
  ProfileProgress,
  type ProfileStep,
} from "@/components/ui/profile-progress";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { DatasetType } from "../types";
import { LinkBar } from "@/components/link-bar";
import { ReportsTabControl } from "./reports-tab-control";

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
  isDragEnabled?: boolean;
  onToggleDrag?: (enabled: boolean) => void;
  onSignOut?: () => void;
  activeReportTab?: "submission" | "reports";
  onReportTabChange?: (tab: "submission" | "reports") => void;
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
  isDragEnabled = true,
  onToggleDrag,
  onSignOut,
  activeReportTab = "submission",
  onReportTabChange,
}: TopBarProps) {
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Example profile setup steps - replace with actual data
  const profileSteps: ProfileStep[] = [
    {
      title: "Basic Information",
      description: "Complete your name",
      completed: true,
    },
    {
      title: "Profile Picture",
      description: "Upload a profile picture",
      completed: true,
    },
    {
      title: "Verification",
      description: "Verify your email address",
      completed: false,
    },
    {
      title: "Link",
      description: "Link your account to an agency for admin features",
      completed: false,
    },
  ];

  const showSearchBar =
    (activeTab === "stats" && !hasSelectedItem) ||
    activeTab === "thread" ||
    activeTab === "overlays";
  const showSettings = activeTab === "overlays";
  const showToggle = activeTab === "overlays";
  const showCombobox = activeTab === "stats" && !hasSelectedItem;
  const showBackButton = hasSelectedItem && activeTab === "stats";
  const showSignOut = activeTab === "profile";
  const showNotification = activeTab === "profile";
  const showProfileProgress = activeTab === "profile";
  const showLinkBar = activeTab === "simulations";
  const showReportTabs = activeTab === "report";

  const handleNotificationToggle = (pressed: boolean) => {
    setNotificationsEnabled(pressed);
    if (pressed) {
      toast.success("Notifications turned on");
    } else {
      toast("Notifications turned off");
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 px-4">
      {/* Search Bar */}
      {showSearchBar && <SearchBar onSearch={onSearch} />}

      {/* Settings Button */}
      {showSettings && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8.5 h-8.5 bg-[#EBEBEB] border border-[#DCDCDC] rounded-full flex items-center justify-center transition-colors hover:bg-[#E0E0E0]">
              <MoreHorizontal className="w-5 h-5 text-[#8D8D8D]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => onToggleDrag?.(!isDragEnabled)}
              className="gap-2"
            >
              {isDragEnabled ? (
                <Lock className="h-4 w-4" />
              ) : (
                <LockOpen className="h-4 w-4" />
              )}
              <span>{isDragEnabled ? "Lock Layout" : "Unlock Layout"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Toggle Button */}
      {showToggle && (
        <OverlayToggle
          overlaysVisible={overlaysVisible}
          onToggle={onToggleOverlays}
        />
      )}

      {/* Profile Progress */}
      {showProfileProgress && (
        <ProfileProgress
          current={profileSteps.filter((step) => step.completed).length}
          total={profileSteps.length}
          steps={profileSteps}
        />
      )}

      {/* Dataset Selector */}
      {showCombobox && (
        <div className="w-24">
          <ComboboxForm
            value={dataset}
            onSelect={(value) =>
              onDatasetChange(
                value as "inlets" | "man_pipes" | "outlets" | "storm_drains"
              )
            }
            showSearch={false}
          />
        </div>
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

      {/* Notification Button */}
      {showNotification && (
        <Toggle
          pressed={notificationsEnabled}
          onPressedChange={handleNotificationToggle}
          className="w-8.5 h-8.5 bg-[#EBEBEB] border border-[#DCDCDC] rounded-full flex items-center justify-center transition-colors hover:bg-[#E0E0E0] data-[state=on]:bg-[#D0D0D0]"
        >
          {notificationsEnabled ? (
            <BellRing className="w-4 h-4 text-[#8D8D8D]" />
          ) : (
            <Bell className="w-4 h-4 text-[#8D8D8D]" />
          )}
        </Toggle>
      )}

      {/* Sign Out Button */}
      {showSignOut && (
        <>
          <button
            onClick={() => setShowSignOutDialog(true)}
            className="w-8.5 h-8.5 bg-[#EBEBEB] border border-[#DCDCDC] rounded-full flex items-center justify-center transition-colors hover:bg-[#E0E0E0]"
          >
            <LogOut className="w-4 h-4 text-[#8D8D8D]" />
          </button>

          <AlertDialog
            open={showSignOutDialog}
            onOpenChange={setShowSignOutDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign Out</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to sign out? You&apos;ll need to log in
                  again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setShowSignOutDialog(false);
                    onSignOut?.();
                  }}
                >
                  Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {/* Reports Tab */}
      {showReportTabs && onReportTabChange && (
        <ReportsTabControl
          activeTab={activeReportTab}
          onTabChange={onReportTabChange}
        />
      )}

      {/* Profile Progress */}
      {showLinkBar && <LinkBar link="example.com" />}
    </div>
  );
}
