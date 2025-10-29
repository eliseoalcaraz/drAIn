"use client";

import { FC } from "react";
import { Plus, Minus, Crosshair, Map as MapIcon, X } from "lucide-react";

type CameraControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetPosition: () => void;
  onChangeStyle: () => void;
  isSimulationActive?: boolean;
  onExitSimulation?: () => void;
};

export const CameraControls: FC<CameraControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetPosition,
  onChangeStyle,
  isSimulationActive,
  onExitSimulation,
}) => {
  return (
    <div className="absolute right-0 mx-5 flex h-full py-5 flex-col justify-between z-30">
      <div className="flex flex-col gap-2">
        {/* Exit button when simulation is active */}
        {isSimulationActive && onExitSimulation && (
          <button
            onClick={onExitSimulation}
            className="bg-white p-2 rounded-sm shadow-md hover:bg-gray-100 border border-transparent active:bg-gray-200 active:border active:border-gray-300 active:text-black"
          >
            <X className="h-4 w-4 cursor-pointer" />
          </button>
        )}
        {/* Zoom In / Zoom Out */}
        <div className="flex flex-col bg-white rounded-sm shadow-md overflow-hidden">
          <button
            onClick={onZoomIn}
            className="p-2 rounded-t-sm rounded-x-md hover:bg-gray-100 border border-transparent border-b-gray-200 active:bg-gray-300 active:border active:border-gray-300 active:text-black"
          >
            <Plus className="w-4 h-4 cursor-pointer" />
          </button>
          <button
            onClick={onZoomOut}
            className="p-2 rounded-t-sm rounded-x-md hover:bg-gray-100 border border-transparent border-b-gray-200 active:bg-gray-300 active:border active:border-gray-300 active:text-black"
          >
            <Minus className="w-4 h-4 cursor-pointer" />
          </button>
        </div>

        {/* Reset Position */}
        <button
          onClick={onResetPosition}
          className="bg-white p-2 rounded-sm shadow-md hover:bg-gray-100 border border-transparent active:bg-gray-200 active:border active:border-gray-300 active:text-black"
        >
          <Crosshair className="w-4 h-4 cursor-pointer" />
        </button>
      </div>

      <button
        onClick={() => {
          onChangeStyle();
        }}
        className="bg-white p-2 rounded-sm shadow-md hover:bg-gray-100 border border-transparent active:bg-gray-300 active:border active:border-gray-400 active:text-black"
      >
        <MapIcon className="w-4 h-4 cursor-pointer" />
      </button>
    </div>
  );
};
