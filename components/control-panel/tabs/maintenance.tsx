"use client";

import { useState, useEffect } from "react";
import {
  recordInletMaintenance,
  getInletMaintenanceHistory,
  recordManPipeMaintenance,
  getManPipeMaintenanceHistory,
  recordOutletMaintenance,
  getOutletMaintenanceHistory,
  recordStormDrainMaintenance,
  getStormDrainMaintenanceHistory,
} from "@/app/actions/clientMaintenanceActions";
import { fetchReports } from "@/lib/supabase/report";
import type { Inlet, Outlet, Pipe, Drain } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type HistoryItem = {
  last_cleaned_at: string;
  agencies: { name: string }[] | null;
  profiles: { full_name: string }[] | null;
  status: string | null;
  addressed_report_id: string | null;
};

export type MaintenanceProps = {
  selectedInlet?: Inlet | null;
  selectedOutlet?: Outlet | null;
  selectedPipe?: Pipe | null;
  selectedDrain?: Drain | null;
};

const getStatusStyles = (status: string | null) => {
  switch (status) {
    case "resolved":
      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
    case "in-progress":
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
  }
};

export default function Maintenance({
  selectedInlet,
  selectedOutlet,
  selectedPipe,
  selectedDrain,
}: MaintenanceProps) {
  const [selectedAsset, setSelectedAsset] = useState<{
    type: string;
    id: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[] | null>(null);
  const [maintenanceStatus, setMaintenanceStatus] = useState<
    "in-progress" | "resolved"
  >("in-progress");
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    let assetType = "";
    let assetId = "";

    if (selectedInlet) {
      assetType = "inlets";
      assetId = selectedInlet.id;
    } else if (selectedOutlet) {
      assetType = "outlets";
      assetId = selectedOutlet.id;
    } else if (selectedPipe) {
      assetType = "man_pipes";
      assetId = selectedPipe.id;
    } else if (selectedDrain) {
      assetType = "storm_drains";
      assetId = selectedDrain.id;
    }

    if (assetType && assetId) {
      setSelectedAsset({ type: assetType, id: assetId });
      handleViewHistory(assetType, assetId);
      loadReports(assetId);
    } else {
      setSelectedAsset(null);
      setHistory(null);
      setReports([]);
      setMessage("");
    }
  }, [selectedInlet, selectedOutlet, selectedPipe, selectedDrain]);

  const loadReports = async (componentId: string) => {
    const allReports = await fetchReports();
    const assetReports = allReports.filter(
      (report) => report.componentId === componentId
    );
    setReports(assetReports);
  };

  const handleViewHistory = async (assetType: string, assetId: string) => {
    setIsLoading(true);
    setMessage("");
    setHistory(null);

    let result;
    switch (assetType) {
      case "inlets":
        result = await getInletMaintenanceHistory(assetId);
        break;
      case "man_pipes":
        result = await getManPipeMaintenanceHistory(assetId);
        break;
      case "outlets":
        result = await getOutletMaintenanceHistory(assetId);
        break;
      case "storm_drains":
        result = await getStormDrainMaintenanceHistory(assetId);
        break;
      default:
        result = { error: "Unknown asset type." };
    }

    setIsLoading(false);

    if (result.error) {
      setMessage(`Error fetching history: ${result.error}`);
    } else if (result.data && result.data.length > 0) {
      setHistory(result.data as HistoryItem[]);
    } else {
      setMessage("No maintenance history found for this asset.");
    }
  };

  const handleRecordMaintenance = async () => {
    if (!selectedAsset) {
      setMessage("No asset selected.");
      return;
    }
    setIsLoading(true);
    setMessage("");

    const { type, id } = selectedAsset;
    const sortedReports = [...reports].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const mostRecentReport =
      sortedReports.length > 0 ? sortedReports[0] : undefined;

    let result;
    switch (type) {
      case "inlets":
        result = await recordInletMaintenance(
          id,
          mostRecentReport?.id,
          maintenanceStatus
        );
        break;
      case "man_pipes":
        result = await recordManPipeMaintenance(
          id,
          mostRecentReport?.id,
          maintenanceStatus
        );
        break;
      case "outlets":
        result = await recordOutletMaintenance(
          id,
          mostRecentReport?.id,
          maintenanceStatus
        );
        break;
      case "storm_drains":
        result = await recordStormDrainMaintenance(
          id,
          mostRecentReport?.id,
          maintenanceStatus
        );
        break;
      default:
        result = { error: "Unknown asset type." };
    }

    setIsLoading(false);

    if (result.error) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage(
        `Maintenance recorded successfully for ${type} with ID ${id}.`
      );
      handleViewHistory(type, id);
      loadReports(id); // Reload reports to reflect any deletions or changes
      if (mostRecentReport) {
      }
    }
  };

  const mostRecentReport = reports.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pt-3 pb-5 pl-5 pr-3">
        <CardHeader className="py-0 flex px-1 mb-6 items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <CardTitle>Maintenance History</CardTitle>
            <CardDescription className="text-xs">
              {selectedAsset
                ? `Displaying ${selectedAsset.id.slice(
                    0,
                    8
                  )} from ${selectedAsset.type.replace(/_/g, " ")}`
                : "Select an asset to view details"}
            </CardDescription>
          </div>
          <button
            className="w-8 h-8 bg-[#EBEBEB] border border-[#DCDCDC] rounded-full flex items-center justify-center transition-colors hover:bg-[#E0E0E0] disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh reports"
          >
            <RefreshCw className="w-4 h-4 text-[#8D8D8D]" />
          </button>
        </CardHeader>

        <div className="flex flex-col flex-1">
          <div className="relative h-full min-h-[300px]">
            {!selectedAsset ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-900">
                    No Asset Selected
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Select an asset on the map
                  </p>
                </div>
              </div>
            ) : isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  </div>
                  <p className="text-xs text-gray-500">Loading...</p>
                </div>
              </div>
            ) : history && history.length > 0 ? (
              <div className="space-y-2 overflow-y-auto">
                {history.map((record, index) => (
                  <div
                    key={index}
                    className="duration-200  border rounded-lg p-3 hover:bg-accent transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        {record.status && (
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${getStatusStyles(
                              record.status
                            )}`}
                          >
                            {record.status}
                          </span>
                        )}
                        <span className="text-xs text-gray-900">
                          {new Date(record.last_cleaned_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>

                      <span className="text-gray-900 text-xs font-medium pl-1">
                        {record.profiles?.[0]?.full_name || "N/A"}
                      </span>

                      <div className="flex ml-2 items-center text-xs gap-1">
                        <CornerDownRight className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground font-medium">
                          {record.agencies?.[0]?.name || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-900">
                    No History
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    No maintenance records yet
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky bottom section */}
      {selectedAsset && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="text-sm font-medium text-gray-900"
              >
                Maintenance Status
              </Label>
              <Select
                onValueChange={(value: "in-progress" | "resolved") =>
                  setMaintenanceStatus(value)
                }
                value={maintenanceStatus}
              >
                <SelectTrigger
                  id="status"
                  className="h-11 rounded-xl border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 shadow-lg">
                  <SelectItem value="in-progress" className="rounded-lg">
                    In Progress
                  </SelectItem>
                  <SelectItem value="resolved" className="rounded-lg">
                    Resolved
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleRecordMaintenance}
              disabled={isLoading || !selectedAsset}
              className="w-full h-11 rounded-xl bg-blue-600 text-white font-medium shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:active:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Recording...
                </span>
              ) : (
                "Record New Maintenance"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
