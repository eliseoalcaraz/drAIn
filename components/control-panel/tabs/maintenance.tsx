"use client";

import { useState, useEffect, useCallback } from "react";
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
import { fetchAllReports } from "@/lib/supabase/report";
import type { Report } from "@/lib/supabase/report";
import type { Inlet, Outlet, Pipe, Drain } from "../types";
import {
  CornerDownRight,
  MapPin,
  History,
  ChevronDown,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RefreshCw } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldContent } from "@/components/ui/field";

type HistoryItem = {
  last_cleaned_at: string;
  agencies: { name: string }[] | null;
  profiles: { full_name: string }[] | null;
  status: string | null;
  addressed_report_id: string | null;
  description: string | null;
};

const assetActions = {
  inlets: {
    getHistory: getInletMaintenanceHistory,
    record: recordInletMaintenance,
  },
  man_pipes: {
    getHistory: getManPipeMaintenanceHistory,
    record: recordManPipeMaintenance,
  },
  outlets: {
    getHistory: getOutletMaintenanceHistory,
    record: recordOutletMaintenance,
  },
  storm_drains: {
    getHistory: getStormDrainMaintenanceHistory,
    record: recordStormDrainMaintenance,
  },
};

export type MaintenanceProps = {
  selectedInlet?: Inlet | null;
  selectedOutlet?: Outlet | null;
  selectedPipe?: Pipe | null;
  selectedDrain?: Drain | null;
  profile?: Record<string, unknown> | null;
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
  profile,
}: MaintenanceProps) {
  const [selectedAsset, setSelectedAsset] = useState<{
    type: string;
    id: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [_message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[] | null>(null);
  const [agencyComments, setAgencyComments] = useState<string>("");
  const [_reports, setReports] = useState<Report[]>([]);

  const loadReports = useCallback(async (componentId: string) => {
    const allReports = await fetchAllReports();
    const assetReports = allReports.filter(
      (report) => report.componentId === componentId,
    );
    setReports(assetReports);
  }, []);

  const handleViewHistory = useCallback(async (assetType: string, assetId: string) => {
    setIsLoading(true);
    setMessage("");
    setHistory(null);

    const actions =
      assetActions[assetType as keyof typeof assetActions];
    if (!actions) {
      setMessage("Unknown asset type.");
      setIsLoading(false);
      return;
    }

    const result = await actions.getHistory(assetId);

    setIsLoading(false);

    if (result.error) {
      setMessage(`Error fetching history: ${result.error}`);
    } else if (result.data && (result.data as HistoryItem[]).length > 0) {
      setHistory(result.data as HistoryItem[]);
    } else {
      setMessage("No maintenance history found for this asset.");
    }
  }, []);

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
  }, [selectedInlet, selectedOutlet, selectedPipe, selectedDrain, handleViewHistory, loadReports]);

  const handleRecordWithStatus = async (status: "in-progress" | "resolved") => {
    if (!selectedAsset) {
      setMessage("No asset selected.");
      return;
    }
    setIsLoading(true);
    setMessage("");

    const { type, id } = selectedAsset;

    const commentsToSubmit = agencyComments.trim() === "" ? "" : agencyComments;
    
    const actions = assetActions[type as keyof typeof assetActions];
    if (!actions) {
      setMessage("Unknown asset type.");
      setIsLoading(false);
      return;
    }

    const result = await actions.record(id, status, commentsToSubmit);

    setIsLoading(false);

    if (result.error) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage(`Maintenance recorded successfully as ${status}.`);
      handleViewHistory(type, id);
      loadReports(id);
    }
  };

  // Check if user is admin
  const isAdmin = !!profile?.agency_id;

  // If not admin, show admin privileges message
  if (!isAdmin) {
    return (
      <div className="flex flex-col pl-5 pr-2.5 h-full overflow-y-auto maintenance-scroll-hidden">
        <div className="flex-1 overflow-y-auto pt-3 px-3 maintenance-scroll-hidden">
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
              disabled
            >
              <RefreshCw className="w-4 h-4 text-[#8D8D8D]" />
            </button>
          </CardHeader>

          <div className="flex flex-col flex-1">
            <div className="relative h-full min-h-[350px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center items-center flex flex-col">
                  <div className="w-12 h-12 flex justify-center items-center bg-[#EBEBEB] border border-[#DCDCDC] rounded-full  mb-3">
                    <Lock className="self-center w-6 h-6 text-[#8D8D8D]" />
                  </div>

                  <p className="text-sm font-medium text-gray-900">
                    Admin Privileges Required
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Link an agency account for access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pl-2 h-full overflow-y-auto maintenance-scroll-hidden">
      <div className="flex-1 overflow-y-auto pt-3 pb-20 px-3 maintenance-scroll-hidden">
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
          <div className="relative h-full min-h-[350px]">
            {!selectedAsset ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center items-center flex flex-col">
                  <div className="w-12 h-12 flex justify-center items-center bg-[#EBEBEB] border border-[#DCDCDC] rounded-full  mb-3">
                    <MapPin className="self-center w-6 h-6 text-[#8D8D8D]" />
                  </div>

                  <p className="text-sm font-medium text-gray-900">
                    No Asset Selected
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Select an asset on the map
                  </p>
                </div>
              </div>
            ) : isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center flex flex-col items-center">
                  <div className="w-12 h-12 flex justify-center items-center bg-[#EBEBEB] border border-[#DCDCDC] rounded-full  mb-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    Loading...
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Fetching the maintenance history
                  </p>
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

                      {record.description && (
                        <p className="text-xs text-gray-700 mt-1 p-2 pb-0  rounded-md">
                          {record.description}
                        </p>
                      )}

                      <span className="text-muted-foreground text-xs font-medium pl-1">
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
                <div className="text-center items-center flex flex-col">
                  <div className="w-12 h-12 flex justify-center items-center bg-[#EBEBEB] border border-[#DCDCDC] rounded-full  mb-3">
                    <History className="self-center w-6 h-6 text-[#8D8D8D]" />
                  </div>

                  <p className="text-sm font-medium text-gray-900">
                    Empty History
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

      {/* Sticky bottom section - updated positioning */}
      {selectedAsset && (
        <div className="px-3 pb-5 pt-0">
          <Field className="mb-4">
            <FieldContent>
              <Textarea
                value={agencyComments}
                onChange={(e) => setAgencyComments(e.target.value)}
                placeholder="Agency Comments Here"
                rows={1}
                style={{ height: "56px", minHeight: "56px", maxHeight: "56px" }}
                className="resize-none bg-transparent !h-14"
              />
            </FieldContent>
          </Field>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={isLoading || !selectedAsset}
                className="w-full h-11 rounded-lg bg-[#4b72f3] border border-[#2b3ea7] text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-0 flex items-center justify-between"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2  mx-auto">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span className="text-sm">Recording...</span>
                  </span>
                ) : (
                  <>
                    <span className="text-sm px-3">Record Maintenance</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs font-semibold text-gray-700">
                Select Status
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleRecordWithStatus("in-progress")}
                className="cursor-pointer focus:bg-blue-50"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      In Progress
                    </p>
                    <p className="text-xs text-gray-500">Work is ongoing</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRecordWithStatus("resolved")}
                className="cursor-pointer focus:bg-green-50"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="h-2 w-2 rounded-full bg-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Resolved
                    </p>
                    <p className="text-xs text-gray-500">Work is complete</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
