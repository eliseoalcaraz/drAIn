"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SimulationGateway } from "@/components/simulation-gateway";
import { ModelSelector, type ModelType } from "./model-selector";
import Model2 from "./simulation-models/model2";
import Model3 from "./simulation-models/model3";
import type { Inlet, Outlet, Pipe, Drain } from "../types";

interface SimulationsContentProps {
  isSimulationMode?: boolean;
  selectedPointId?: string | null;
  selectedInlet?: Inlet | null;
  selectedOutlet?: Outlet | null;
  selectedPipe?: Pipe | null;
  selectedDrain?: Drain | null;
  // Model 2 props
  selectedYear?: number | null;
  onYearChange?: (year: number | null) => void;
  onGenerateTable?: () => void;
  isLoadingTable?: boolean;
  onCloseTable?: () => void;
  hasTable?: boolean;
  // Model 3 props
  onGenerateTable3?: () => void;
  isLoadingTable3?: boolean;
  onCloseTable3?: () => void;
  hasTable3?: boolean;
  // Model3 panel props
  selectedComponentIds?: string[];
  onComponentIdsChange?: (ids: string[]) => void;
  selectedPipeIds?: string[];
  onPipeIdsChange?: (ids: string[]) => void;
  componentParams?: Map<string, any>;
  onComponentParamsChange?: (params: Map<string, any>) => void;
  pipeParams?: Map<string, any>;
  onPipeParamsChange?: (params: Map<string, any>) => void;
  showNodePanel?: boolean;
  onToggleNodePanel?: () => void;
  showLinkPanel?: boolean;
  onToggleLinkPanel?: () => void;
}

export default function SimulationsContent({
  isSimulationMode = false,
  selectedPointId = null,
  selectedInlet = null,
  selectedOutlet = null,
  selectedPipe = null,
  selectedDrain = null,
  selectedYear = null,
  onYearChange = () => {},
  onGenerateTable = () => {},
  isLoadingTable = false,
  onCloseTable = () => {},
  hasTable = false,
  onGenerateTable3 = () => {},
  isLoadingTable3 = false,
  onCloseTable3 = () => {},
  hasTable3 = false,
  selectedComponentIds = [],
  onComponentIdsChange = () => {},
  selectedPipeIds = [],
  onPipeIdsChange = () => {},
  componentParams = new Map(),
  onComponentParamsChange = () => {},
  pipeParams = new Map(),
  onPipeParamsChange = () => {},
  showNodePanel = false,
  onToggleNodePanel = () => {},
  showLinkPanel = false,
  onToggleLinkPanel = () => {},
}: SimulationsContentProps) {
  const [selectedModel, setSelectedModel] = useState<ModelType | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // helper to update the simModel query param while preserving other params
  const updateSimModelParam = (model: ModelType | null) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (model) {
      params.set("simModel", model);
    } else {
      params.delete("simModel");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  // Sync local selectedModel with simModel query param so external clears work
  useEffect(() => {
    const sm = searchParams?.get("simModel");
    setSelectedModel((prev) => {
      // Avoid unnecessary state updates if same
      return sm ? (sm as ModelType) : null;
    });
  }, [searchParams]);

  const handleModelSelect = (model: ModelType) => {
    // set state + update query param (keeps behavior when selecting here)
    setSelectedModel(model);
    updateSimModelParam(model);
  };

  // Show gateway if not in simulation mode
  if (!isSimulationMode) {
    return <SimulationGateway />;
  }

  // Show model selector if no model selected
  if (!selectedModel) {
    // wrap ModelSelector so it can occupy full available height.
    // ModelSelector should be implemented as a column (flex flex-col) and put the confirm button
    // with `mt-auto` (or absolute bottom within a relative parent) so it appears at the bottom.
    return (
      <div className="flex flex-col flex-1 min-h-0 h-full">
        <div className="flex-1 min-h-0 flex flex-col">
          <ModelSelector onModelSelect={handleModelSelect} />
        </div>
        {/* Optional: if you want a confirm button outside ModelSelector, place it here and use mt-auto on the inner area.
            Otherwise update ModelSelector to include a confirm button like the snippet below. */}
      </div>
    );
  }

  // Render the selected model with back button
  const renderModel = () => {
    const modelProps = {
      selectedPointId,
      selectedInlet,
      selectedOutlet,
      selectedPipe,
      selectedDrain,
    };

    const model2Props = {
      ...modelProps,
      selectedYear,
      onYearChange,
      onGenerateTable,
      isLoading: isLoadingTable,
      onCloseTable,
      hasTable,
    };

    const model3Props = {
      ...modelProps,
      selectedComponentIds,
      onComponentIdsChange,
      selectedPipeIds,
      onPipeIdsChange,
      componentParams,
      onComponentParamsChange,
      pipeParams,
      onPipeParamsChange,
      showNodePanel,
      onToggleNodePanel,
      showLinkPanel,
      onToggleLinkPanel,
      onGenerateTable: onGenerateTable3,
      isLoadingTable: isLoadingTable3,
      onCloseTable: onCloseTable3,
      hasTable: hasTable3,
    };

    switch (selectedModel) {
      case "model2":
        return <Model2 {...model2Props} />;
      case "model3":
        return <Model3 {...model3Props} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full">
      {/* Render Selected Model */}
      {renderModel()}
    </div>
  );
}
