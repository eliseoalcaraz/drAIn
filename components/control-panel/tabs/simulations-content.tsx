"use client";

import React, { useState, useEffect } from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ComboboxForm } from "@/components/combobox-form";
import { predict } from "@/lib/predictions/predict";
import { AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconInfoCircleFilled } from "@tabler/icons-react";
import { useInlets } from "@/hooks/useInlets";
import { useOutlets } from "@/hooks/useOutlets";
import { usePipes } from "@/hooks/usePipes";
import { useDrain } from "@/hooks/useDrain";
import {
  calculateDistanceToOutlet,
  calculateDistanceToOutletForDrain,
} from "@/lib/distance-calculator";
import { SimulationGateway } from "@/components/simulation-gateway";
import type { Inlet, Outlet, Pipe, Drain } from "../types";

type EndpointType = "predict-100yr" | "predict-50yr" | "predict-25yr";

interface PredictionParams {
  floodDepth: number;
  pipeDiameter: number;
  distToOutlet: number;
  inletDensity: number;
}

interface PredictionResult {
  prediction?: number;
  probability?: number;
  timestamp?: string;
  [key: string]: any;
}

const DEFAULT_PARAMS: PredictionParams = {
  floodDepth: 2.5,
  pipeDiameter: 0.5,
  distToOutlet: 200,
  inletDensity: 25,
};

interface SimulationsContentProps {
  isSimulationMode?: boolean;
  selectedPointId?: string | null;
  selectedInlet?: Inlet | null;
  selectedOutlet?: Outlet | null;
  selectedPipe?: Pipe | null;
  selectedDrain?: Drain | null;
}

export default function SimulationsContent({
  isSimulationMode = false,
  selectedPointId: externalSelectedPointId = null,
  selectedInlet = null,
  selectedOutlet = null,
  selectedPipe = null,
  selectedDrain = null,
}: SimulationsContentProps) {
  const [endpoint, setEndpoint] = useState<EndpointType | "">("");
  const [params, setParams] = useState<PredictionParams>(DEFAULT_PARAMS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedPointId, setSelectedPointId] = useState<string>("");
  const [calculatingDistance, setCalculatingDistance] = useState(false);

  // Load data from hooks
  const { inlets, loading: inletsLoading } = useInlets();
  const { outlets, loading: outletsLoading } = useOutlets();
  const { pipes, loading: pipesLoading } = usePipes();
  const { drains, loading: drainsLoading } = useDrain();

  // Update selected point when external prop changes (from map click)
  useEffect(() => {
    if (externalSelectedPointId) {
      setSelectedPointId(externalSelectedPointId);
    }
  }, [externalSelectedPointId]);

  // Calculate distance when inlet or drain is selected
  useEffect(() => {
    if (
      !selectedPointId ||
      inlets.length === 0 ||
      drains.length === 0 ||
      outlets.length === 0 ||
      pipes.length === 0
    ) {
      return;
    }

    setCalculatingDistance(true);
    try {
      // Check if it's an inlet (starts with "I-") or a drain (starts with "ISD-")
      const isInlet = inlets.some((i) => i.id === selectedPointId);
      const isDrain = drains.some((d) => d.id === selectedPointId);

      let distanceResult;

      if (isInlet) {
        distanceResult = calculateDistanceToOutlet(
          selectedPointId,
          inlets,
          outlets,
          pipes
        );
      } else if (isDrain) {
        distanceResult = calculateDistanceToOutletForDrain(
          selectedPointId,
          drains,
          outlets,
          pipes
        );
      }

      if (distanceResult && distanceResult.distanceToOutlet !== null) {
        setParams({
          ...params,
          distToOutlet: Math.round(distanceResult.distanceToOutlet),
        });
      }
    } catch (err) {
      console.error("Error calculating distance:", err);
    } finally {
      setCalculatingDistance(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPointId, inlets, drains, outlets, pipes]);

  const handlePredict = async () => {
    if (!endpoint) {
      setError("Please select a return period model");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const inputData = {
        point: [
          params.floodDepth,
          params.pipeDiameter,
          params.distToOutlet,
          params.inletDensity,
        ] as [number, number, number, number],
      };

      const response = await predict(endpoint as EndpointType, inputData);
      setResult({
        ...response,
        timestamp: new Date().toISOString(),
      });
      setShowResults(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Prediction failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    setEndpoint("predict-100yr");
    setResult(null);
    setError(null);
    setShowResults(false);
    setSelectedPointId("");
  };

  const getRiskLevel = (value: number): { color: string; label: string } => {
    if (value >= 0.7) return { color: "destructive", label: "High Risk" };
    if (value >= 0.4) return { color: "default", label: "Medium Risk" };
    return { color: "secondary", label: "Low Risk" };
  };

  // Show gateway if not in simulation mode
  if (!isSimulationMode) {
    return <SimulationGateway />;
  }

  return (
    <div className="flex flex-col flex-1 pt-3 pb-5 px-5 space-y-4">
      <CardHeader className="py-0 px-1 mb-3">
        <CardTitle>Flood Prediction Simulation</CardTitle>
        <CardDescription className="text-xs">
          Configure parameters and select a return period model to predict flood
          risk
        </CardDescription>
      </CardHeader>

      {/* Inlet/Drain Selector */}
      <div className="space-y-2">
        <ComboboxForm
          options={[
            ...inlets.map((inlet) => ({
              value: inlet.id,
              label: `${inlet.id} (Inlet)`,
            })),
            ...drains.map((drain) => ({
              value: drain.id,
              label: `${drain.id} (Storm Drain)`,
            })),
          ]}
          value={selectedPointId}
          onSelect={setSelectedPointId}
          placeholder="Component"
          searchPlaceholder="Search ID"
          emptyText="No inlets or drains found."
          disabled={
            inletsLoading || drainsLoading || outletsLoading || pipesLoading
          }
        />
        {calculatingDistance && selectedPointId && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Spinner className="h-3 w-3" />
            Calculating distance...
          </p>
        )}
        {selectedPointId && !calculatingDistance && (
          <p className="text-xs pl-1 text-muted-foreground">
            Distance auto-calculated for {selectedPointId}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Model Selection */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">Return Model</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconInfoCircleFilled className="w-3.5 h-3.5 text-[#8D8D8D]/50 hover:text-[#8D8D8D] cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    Return periods indicate the statistical probability of a
                    rainfall event of a given magnitude occurring in any given
                    year.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Select
            value={endpoint}
            onValueChange={(value) => setEndpoint(value as EndpointType)}
          >
            <SelectTrigger id="endpoint">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="predict-100yr">100-Year Period</SelectItem>
              <SelectItem value="predict-50yr">50-Year Period</SelectItem>
              <SelectItem value="predict-25yr">25-Year Period</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Parameter Controls */}
        <div className="space-y-6 px-1">
          {/* Flood Depth */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="font-normal">Flood Depth</Label>
              <span className="text-xs text-muted-foreground">
                {params.floodDepth.toFixed(1)} m
              </span>
            </div>
            <Slider
              value={[params.floodDepth]}
              onValueChange={(value) =>
                setParams({ ...params, floodDepth: value[0] })
              }
              min={0}
              max={10}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 m</span>
              <span>10 m</span>
            </div>
          </div>

          {/* Pipe Diameter */}
          <div className="space-y-3">
            <div className="flex justify-between items-center ">
              <Label className="font-normal">Pipe Diameter</Label>
              <span className="text-xs text-muted-foreground">
                {params.pipeDiameter.toFixed(2)} m
              </span>
            </div>
            <Slider
              value={[params.pipeDiameter]}
              onValueChange={(value) =>
                setParams({ ...params, pipeDiameter: value[0] })
              }
              min={0}
              max={2}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 m</span>
              <span>2 m</span>
            </div>
          </div>

          {/* Distance to Outlet */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="font-normal">Distance to Outlet</Label>
              <span className="text-xs text-muted-foreground">
                {params.distToOutlet.toFixed(0)} m
              </span>
            </div>
            <Slider
              value={[params.distToOutlet]}
              onValueChange={(value) =>
                setParams({ ...params, distToOutlet: value[0] })
              }
              min={0}
              max={1000}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 m</span>
              <span>1000 m</span>
            </div>
          </div>

          {/* Inlet Density */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="font-normal">Inlet Density</Label>
              <span className="text-xs text-muted-foreground">
                {params.inletDensity.toFixed(0)}
              </span>
            </div>
            <Slider
              value={[params.inletDensity]}
              onValueChange={(value) =>
                setParams({ ...params, inletDensity: value[0] })
              }
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 items-center">
          <Button
            onClick={handlePredict}
            disabled={loading}
            className="flex-1 h-full"
          >
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Running Prediction...
              </>
            ) : (
              "Run Prediction"
            )}
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            size="icon"
            disabled={loading}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Prediction Results
              </DialogTitle>
              <Badge variant="secondary">
                {endpoint === "predict-100yr"
                  ? "100-Year"
                  : endpoint === "predict-50yr"
                  ? "50-Year"
                  : "25-Year"}
              </Badge>
            </div>
            <DialogDescription>
              Generated at {new Date(result?.timestamp || "").toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Main Result */}
            <div className="bg-muted rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">
                Prediction Value
              </div>
              <div className="text-3xl font-bold">
                {typeof result?.prediction === "number"
                  ? result.prediction.toFixed(4)
                  : JSON.stringify(result)}
              </div>
              {typeof result?.probability === "number" && (
                <div className="mt-2">
                  <Badge
                    variant={getRiskLevel(result.probability).color as any}
                  >
                    {getRiskLevel(result.probability).label} (
                    {(result.probability * 100).toFixed(1)}%)
                  </Badge>
                </div>
              )}
            </div>

            {/* Input Parameters Used */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Input Parameters</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="text-muted-foreground">Flood Depth:</span>
                  <span className="font-medium">
                    {params.floodDepth.toFixed(1)} m
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="text-muted-foreground">Pipe Diameter:</span>
                  <span className="font-medium">
                    {params.pipeDiameter.toFixed(2)} m
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="text-muted-foreground">
                    Distance to Outlet:
                  </span>
                  <span className="font-medium">
                    {params.distToOutlet.toFixed(0)} m
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="text-muted-foreground">Inlet Density:</span>
                  <span className="font-medium">
                    {params.inletDensity.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
