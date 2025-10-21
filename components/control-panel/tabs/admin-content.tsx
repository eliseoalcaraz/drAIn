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
import {
  fetchReports,
  Report,
  deleteReportsByComponentId,
} from "@/lib/supabase/report";
import type { Inlet, Outlet, Pipe, Drain } from "../types";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const ASSET_TYPES = ["inlets", "man_pipes", "outlets", "storm_drains"];

type HistoryItem = {
  last_cleaned_at: string;
  agencies: { name: string }[] | null;
  profiles: { full_name: string }[] | null;
  status: string | null;
  addressed_report_id: string | null;
};

export type AdminContentProps = {
  selectedInlet?: Inlet | null;
  selectedOutlet?: Outlet | null;
  selectedPipe?: Pipe | null;
  selectedDrain?: Drain | null;
};

export default function AdminContent({
  selectedInlet,
  selectedOutlet,
  selectedPipe,
  selectedDrain,
}: AdminContentProps) {
  const [selectedAsset, setSelectedAsset] = useState<{
    type: string;
    id: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[] | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [maintenanceStatus, setMaintenanceStatus] = useState<
    "in-progress" | "resolved"
  >("in-progress");

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
    <div className="p-4">
      <CardHeader>
        <CardTitle>Asset Maintenance</CardTitle>
        <CardDescription>
          {selectedAsset
            ? `Viewing asset ${selectedAsset.id} of type ${selectedAsset.type}`
            : "Select an asset on the map to view its maintenance history."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {selectedAsset && mostRecentReport && (
          <div>
            <h3 className="font-semibold">Most Recent Report</h3>
            <p className="text-sm text-muted-foreground">
              {mostRecentReport.description}
            </p>
            <p className="text-sm text-muted-foreground">
              Status: {mostRecentReport.status}
            </p>
          </div>
        )}
        <Separator />
        <h3 className="font-semibold">Maintenance History</h3>

        <div className="relative" style={{ minHeight: "240px" }}>
          {message && (
            <p className="text-sm text-muted-foreground mb-4">{message}</p>
          )}

          {!selectedAsset ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-muted-foreground">
              <p>Click on an inlet, outlet, pipe, or storm drain on the map.</p>
            </div>
          ) : isLoading ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-muted-foreground">
              <p>Fetching history...</p>
            </div>
          ) : history && history.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5 text-sm">
              {history.map((record, index) => (
                <li key={index}>
                  <span className="font-semibold">
                    {new Date(record.last_cleaned_at).toLocaleString()}
                  </span>
                  <br />
                  Agency: {record.agencies?.[0]?.name || "N/A"}
                  <br />
                  Recorded by: {record.profiles?.[0]?.full_name || "N/A"}
                  <br />
                  Status: {record.status || "N/A"}
                  <br />
                  Addressed Report: {record.addressed_report_id || "N/A"}
                </li>
              ))}
            </ul>
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-muted-foreground">
              <p>No history found.</p>
            </div>
          )}
        </div>
        {selectedAsset && (
          <div>
            <Label htmlFor="status">Maintenance Status</Label>
            <Select
              onValueChange={(value: "in-progress" | "resolved") =>
                setMaintenanceStatus(value)
              }
              value={maintenanceStatus}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleRecordMaintenance}
              disabled={isLoading || !selectedAsset}
              size="sm"
              className="w-full mt-4"
            >
              {isLoading ? "Recording..." : "Record New Maintenance"}
            </Button>
          </div>
        )}
      </CardContent>
    </div>
  );
}
