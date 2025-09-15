"use client";

import { FC } from "react";
import { Plus, Minus, Crosshair, Map as MapIcon } from "lucide-react";

type CameraControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetPosition: () => void;
  onChangeStyle: () => void;
};

export const CameraControls: FC<CameraControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetPosition,
  onChangeStyle,
}) => {
  return (
    <div className="absolute right-0 mx-5 flex h-full py-5 flex-col justify-between">
      <div className="flex flex-col gap-2">
        {/* Zoom In / Zoom Out */}
        <div className="flex flex-col bg-white rounded-sm shadow-md overflow-hidden">
          <button
            onClick={onZoomIn}
            className="p-2 rounded-t-sm rounded-x-md hover:bg-gray-100 border border-transparent border-b-gray-200 active:bg-[#4b72f3] active:border active:border-[#2b3ea7] active:text-white"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onZoomOut}
            className="p-2 rounded-b-sm rounded-x-md hover:bg-gray-100 border border-transparent active:bg-[#4b72f3] active:border active:border-[#2b3ea7] active:text-white"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Reset Position */}
        <button
          onClick={onResetPosition}
          className="p-2 bg-white rounded shadow-md hover:bg-gray-100 border border-transparent active:bg-[#4b72f3] active:border active:border-[#2b3ea7] active:text-white"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={() => {
          onChangeStyle();
        }}
        className="p-2 bg-white rounded shadow-md hover:bg-gray-100 border border-transparent active:bg-[#4b72f3] active:border active:border-[#2b3ea7] active:text-white"
      >
        <MapIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
