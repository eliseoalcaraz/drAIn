"use client";

import {
  BarChart3,
  Bot,
  Layers,
  PlayCircle,
  MessageCircleWarning,
} from "lucide-react";
import Person from "@/public/icons/person.svg";

const tabs = [
  { id: "chatbot", label: "Chatbot", icon: Bot },
  { id: "overlays", label: "Overlay", icon: Layers },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "simulations", label: "Simulations", icon: PlayCircle },
  { id: "report", label: "Report", icon: MessageCircleWarning },
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
  };

  return (
    <div className="flex w-full h-full flex-col items-center">
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
