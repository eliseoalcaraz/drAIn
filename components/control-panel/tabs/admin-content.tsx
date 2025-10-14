"use client";

import { useState } from "react";
import {
  recordMaintenance,
  getMaintenanceHistory,
} from "@/app/actions/maintenanceActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const ASSET_TYPES = ["inlets", "man_pipes", "outlets", "storm_drains"];

type HistoryItem = {
  last_cleaned_at: string;
  agencies: { name: string }[] | null;
  profiles: { full_name: string }[] | null;
};

export default function AdminContent() {
  // State for recording maintenance
  const [assetType, setAssetType] = useState<string>("");
  const [assetId, setAssetId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // State for viewing history
  const [historyAssetType, setHistoryAssetType] = useState<string>("");
  const [historyAssetId, setHistoryAssetId] = useState<string>("");
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[] | null>(null);
  const [historyMessage, setHistoryMessage] = useState<string>("");

  const handleRecordMaintenance = async () => {
    if (!assetType || !assetId) {
      setMessage("Please select an asset type and provide an asset ID.");
      return;
    }
    setIsLoading(true);
    setMessage("");

    const result = await recordMaintenance(assetType, assetId);

    setIsLoading(false);

    if (result.error) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage(
        `Maintenance recorded successfully for ${assetType} with ID ${assetId}.`
      );
      setAssetId("");
      setAssetType("");
    }
  };

  const handleViewHistory = async () => {
    if (!historyAssetType || !historyAssetId) {
      setHistoryMessage("Please select an asset type and provide an asset ID.");
      return;
    }
    setIsHistoryLoading(true);
    setHistoryMessage("");
    setHistory(null);

    const result = await getMaintenanceHistory(historyAssetType, historyAssetId);

    setIsHistoryLoading(false);

    if (result.error) {
      setHistoryMessage(`Error: ${result.error}`);
    } else if (result.data && result.data.length > 0) {
      setHistory(result.data as HistoryItem[]);
    } else {
      setHistoryMessage("No maintenance history found for this asset.");
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Administrator Controls</CardTitle>
          <CardDescription>
            Use this panel to manage drainage assets and their maintenance
            records.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Record Maintenance Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Record New Maintenance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="asset-type">Asset Type</Label>
                <Select value={assetType} onValueChange={setAssetType}>
                  <SelectTrigger id="asset-type">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSET_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="asset-id">Asset GID</Label>
                <Input
                  id="asset-id"
                  placeholder="Enter asset GID"
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleRecordMaintenance} disabled={isLoading}>
                {isLoading ? "Recording..." : "Record Maintenance"}
              </Button>
            </div>
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
          </div>

          <Separator />

          {/* View History Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">View Maintenance History</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="history-asset-type">Asset Type</Label>
                <Select
                  value={historyAssetType}
                  onValueChange={setHistoryAssetType}
                >
                  <SelectTrigger id="history-asset-type">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSET_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="history-asset-id">Asset GID</Label>
                <Input
                  id="history-asset-id"
                  placeholder="Enter asset GID"
                  value={historyAssetId}
                  onChange={(e) => setHistoryAssetId(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleViewHistory} disabled={isHistoryLoading}>
                {isHistoryLoading ? "Fetching..." : "View History"}
              </Button>
            </div>
            {historyMessage && (
              <p className="text-sm text-muted-foreground">{historyMessage}</p>
            )}
            {history && (
              <div className="space-y-2">
                <h4 className="font-medium">History Results</h4>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {history.map((record, index) => (
                    <li key={index}>
                      <span className="font-semibold">
                        {new Date(record.last_cleaned_at).toLocaleString()}
                      </span>
                      <br />
                      Agency: {record.agencies?.[0]?.name || "N/A"}
                      <br />
                      Recorded by: {record.profiles?.[0]?.full_name || "N/A"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
