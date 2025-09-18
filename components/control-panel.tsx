import { Search, MoreHorizontal, Edit, Plus } from "lucide-react";
import { OverlayToggle } from "./overlay-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ControlPanelProps {
  overlaysVisible: boolean;
  onToggle: (visible: boolean) => void;
}

export function ControlPanel({ overlaysVisible, onToggle }: ControlPanelProps) {
  return (
    <div className="absolute m-5 flex flex-row h-[600px] w-sm bg-white rounded-2xl">
      {/* Sidebar */}
      <div className="flex flex-col h-full bg-[#FFF8F5] border-r border-[#E5DFDC] px-2 py-3 justify-between rounded-l-2xl items-center">
        {/* Z Logo */}
        <div className="w-8 h-8 bg-[#B2ADAB] hover:bg-black rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">Z</span>
        </div>
        <div className="flex flex-col gap-5 items-center">
          {/* Edit Icon */}
          <button className="w-7.5 h-7.5 bg-[#B2ADAB] rounded-full flex items-center justify-center hover:bg-black transition-colors">
            <Edit className="w-5 h-5 text-white" />
          </button>

          {/* Plus Icon */}
          <button className="w-7.5 h-7.5 bg-[#B2ADAB] rounded-full flex items-center justify-center hover:bg-black transition-colors">
            <Plus className="w-6 h-6 text-white" />
          </button>

          {/* Black Circle */}
          <div className="w-8.5 h-8.5 bg-black rounded-full" />
        </div>
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

          {/* Menu and View Button */}
          <button className="w-8.5 h-8.5 bg-[#EBEBEB] border border-[#DCDCDC] rounded-full flex items-center justify-center transition-colors">
            <MoreHorizontal className="w-5 h-5 text-[#8D8D8D] hover:text-black" />
          </button>
          <OverlayToggle
            overlaysVisible={overlaysVisible}
            onToggle={onToggle}
          />
        </div>

        <div className="flex flex-1 gap-4">
          {/* Main Content Area */}
          <div className="flex-1 bg-white">{/* Empty content area */}</div>
        </div>

        {/* Bottom Blue Button */}
        <div className="w-full mt-4 p-3">
          <Button className="w-full bg-[#4b72f3] border border-[#2b3ea7] text-white py-6 rounded-xl font-medium text-base hover:bg-blue-600 transition-colors">
            Button
          </Button>
        </div>
      </div>
    </div>
  );
}
