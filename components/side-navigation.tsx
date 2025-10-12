"use client";

import { Bot } from "lucide-react";
import Person from "@/public/icons/person.svg";
import Play from "@/public/icons/play.svg";
import {
  IconSquaresFilled,
  IconFolderFilled,
  IconShieldHalfFilled,
  IconAnalyzeFilled,
} from "@tabler/icons-react";

const tabs = [
  { id: "chatbot", label: "Chatbot", icon: IconAnalyzeFilled },
  { id: "overlays", label: "Overlay", icon: IconSquaresFilled },
  { id: "stats", label: "Stats", icon: IconFolderFilled },
  { id: "simulations", label: "Simulations", icon: Play },
  { id: "report", label: "Report", icon: IconShieldHalfFilled },
  { id: "profile", label: "Profile", icon: Person },
];
interface SideNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SideNavigation({
  activeTab,
  onTabChange,
}: SideNavigationProps) {
  const chatbotTab = tabs.find((tab) => tab.id === "chatbot");
  const otherTabs = tabs.filter((tab) => tab.id !== "chatbot");

  const renderTab = (tab: (typeof tabs)[0]) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className="relative flex items-center justify-center"
      >
        <Icon className="w-5 h-5 text-[#B2ADAB] hover:text-black" />

        {isActive && (
          <div className="absolute w-0.5 h-9 rounded-l-lg right-0 bg-[#B2ADAB]" />
        )}
      </button>
    );
  };

  return (
    <div className="flex w-full h-full flex-col items-center pt-1.5">
      {/* Chatbot tab at the top */}
      <div className="flex w-full flex-col">
        {chatbotTab && renderTab(chatbotTab)}
      </div>

      {/* Spacer to push other tabs to bottom */}
      <div className="flex-1" />

      {/* Other tabs at the bottom */}
      <div className="flex w-full flex-col gap-5">
        {otherTabs.map((tab) => renderTab(tab))}
      </div>
    </div>
  );
}
