"use client";

import { useState } from "react";

interface FloodScenarioSelectorProps {
  selectedScenario?: string;
  onScenarioChange?: (scenario: string) => void;
}

export function FloodScenarioSelector({
  selectedScenario,
  onScenarioChange,
}: FloodScenarioSelectorProps) {
  const scenarios = [
    { id: "5YR", label: "5-Year", probability: "20%" },
    { id: "15YR", label: "15-Year", probability: "10%" },
    { id: "25YR", label: "25-Year", probability: "4%" },
    { id: "50YR", label: "50-Year", probability: "2%" },
    { id: "100YR", label: "100-Year", probability: "1%" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-gray-700">Return Period</h4>
        <span className="text-xs text-gray-500">
          {scenarios.find((s) => s.id === selectedScenario)?.label}
        </span>
      </div>
      
      {/* Scenario selector */}
      <select
        value={selectedScenario}
        onChange={(e) => onScenarioChange?.(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
      >
        {scenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.label} Return Period ({scenario.probability} annual chance)
          </option>
        ))}
      </select>

      {/* Color legend */}
      <div className="pt-2 border-t border-gray-200">
        <h4 className="text-xs font-semibold mb-2 text-gray-700">Hazard Level</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#d73027" }} />
            <span className="text-xs text-gray-600">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#fc8d59" }} />
            <span className="text-xs text-gray-600">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#fee090" }} />
            <span className="text-xs text-gray-600">Low Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}