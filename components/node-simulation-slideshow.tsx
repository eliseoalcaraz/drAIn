"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchNodeDeets } from "@/lib/Vulnerabilities/FetchDeets";

interface NodeDetails {
  Node_ID: string;
  Vulnerability_Category: string;
  Vulnerability_Rank: number;
  Cluster: number;
  Cluster_Score: number;
  YR: number;
  Time_Before_Overflow: number;
  Hours_Flooded: number;
  Maximum_Rate: number;
  Time_Of_Max_Occurence: number;
  Total_Flood_Volume: number;
}

interface NodeSimulationSlideshowProps {
  nodeId: string;
  onClose: () => void;
  tableData: NodeDetails[] | null;
}

const LOADING_PHASES = [
  {
    title: "Fetching Environmental Data",
    subtitle: "Gathering comprehensive information about your location's climate, biodiversity, and environmental factors...",
    duration: 2500,
  },
  {
    title: "Analyzing Drainage Network",
    subtitle: "Processing node connections and flow patterns...",
    duration: 2000,
  },
  {
    title: "Calculating Flow Metrics",
    subtitle: "Computing maximum rates and flood volumes...",
    duration: 2000,
  },
  {
    title: "Generating Results",
    subtitle: "Finalizing simulation data...",
    duration: 1500,
  },
];

export function NodeSimulationSlideshow({
  nodeId,
  onClose,
  tableData,
}: NodeSimulationSlideshowProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [nodeDetails, setNodeDetails] = useState<NodeDetails | null>(null);

  // Fetch node details
  useEffect(() => {
    const fetchDetails = async () => {
      if (tableData) {
        const details = await fetchNodeDeets(nodeId, tableData);
        setNodeDetails(details);
      }
    };
    fetchDetails();
  }, [nodeId, tableData]);

  // Auto-advance through loading phases
  useEffect(() => {
    if (currentPhase >= LOADING_PHASES.length) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentPhase((prev) => prev + 1);
    }, LOADING_PHASES[currentPhase].duration);

    return () => clearTimeout(timer);
  }, [currentPhase]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const phase = LOADING_PHASES[currentPhase] || LOADING_PHASES[LOADING_PHASES.length - 1];

  // Calculate fixed position - always display on the right side, vertically centered
  const getFixedPosition = () => {
    const dialogWidth = 550;
    const dialogHeight = 500;
    const padding = 20;

    // Fixed position: right side of screen with padding, vertically centered
    const x = window.innerWidth - dialogWidth - padding;
    const y = (window.innerHeight - dialogHeight) / 2;

    return { x, y };
  };

  const { x, y } = getFixedPosition();

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-[100]"
        onClick={onClose}
      />

      {/* Loading screen dialog */}
      <div
        className="fixed z-[101] bg-background border rounded-lg shadow-2xl flex flex-col"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          width: "550px",
          height: "500px",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Node: {nodeId}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
          {isLoading ? (
            <>
              {/* Spinner */}
              <div className="relative">
                <Spinner className="h-16 w-16 text-primary" />
              </div>

              {/* Loading text */}
              <div className="text-center space-y-2 max-w-[400px]">
                <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-green-500/20 border-2 border-green-500"></span>
                  {phase.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {phase.subtitle}
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-2">
                {LOADING_PHASES.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all duration-300",
                      index < currentPhase
                        ? "bg-primary"
                        : index === currentPhase
                        ? "bg-primary animate-pulse"
                        : "bg-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Results */}
              <div className="w-full space-y-4 max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold text-center mb-4">
                  Simulation Results
                </h2>

                {nodeDetails ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Time Before Overflow</span>
                        <span className="text-sm font-semibold text-foreground">
                          {nodeDetails.Time_Before_Overflow.toFixed(2)} min
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Hours Flooded</span>
                        <span className="text-sm font-semibold text-foreground">
                          {nodeDetails.Hours_Flooded.toFixed(2)} hrs
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Maximum Rate</span>
                        <span className="text-sm font-semibold text-foreground">
                          {nodeDetails.Maximum_Rate.toFixed(3)} CMS
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Time of Max</span>
                        <span className="text-sm font-semibold text-foreground">
                          {nodeDetails.Time_Of_Max_Occurence.toFixed(2)} hr
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Flood Volume</span>
                        <span className="text-sm font-semibold text-foreground">
                          {nodeDetails.Total_Flood_Volume.toFixed(3)} × 10⁶ L
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-muted-foreground">
                            Vulnerability Category
                          </span>
                          <span className="text-sm font-semibold text-primary">
                            {nodeDetails.Vulnerability_Category}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-muted-foreground">
                            Vulnerability Rank
                          </span>
                          <span className="text-sm font-semibold text-primary">
                            {nodeDetails.Vulnerability_Rank}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-muted-foreground">
                            Cluster Score
                          </span>
                          <span className="text-sm font-semibold text-primary">
                            {nodeDetails.Cluster_Score.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <p className="text-sm text-muted-foreground">
                      No data available for this node.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Please generate a vulnerability table first.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
