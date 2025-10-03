"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { report } from "@/data/content";
import Image from "next/image";
import { useMemo } from "react";

interface ReportsToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function ReportsToggle({ isVisible, onToggle }: ReportsToggleProps) {
  const totalReports = report.length;

  const chartData = useMemo(() => {
    const dateCounts = report.reduce((acc, item) => {
      const date = item.date;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort by date
    const sortedDates = Object.keys(dateCounts).sort();

    return sortedDates.map((date) => ({
      date,
      count: dateCounts[date],
      fill: "#3F83DB",
    }));
  }, []);

  return (
    <div className="bg-[#eeeeee] rounded-xl border border-[#e2e2e2]">
      <div className="pb-2 py-1.5 px-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Image
            src="/icons/information.svg"
            alt="Information"
            width={14}
            height={14}
            className="opacity-70"
          />
          <span className="text-xs font-medium">User Reports</span>
        </div>
        <span className="text-xs font-semibold text-orange-600">
          Total: {totalReports}
        </span>
      </div>

      <Card className="border-x-0">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <MapPin className="h-4 w-4 text-orange-500" />
            </div>
            <CardTitle className="text-base">Drainage Reports</CardTitle>
          </div>
        </CardHeader>
        <Separator className="mb-3" />
        <CardContent className="pt-0 space-y-4">
          {/* Bar Chart */}
          <div className="h-[200px]"></div>

          <Separator />

          {/* Toggle Control */}
          <div
            className={`
            flex items-center justify-between p-2.5 rounded-lg
            transition-all duration-200 ease-in-out
            hover:bg-accent/50 cursor-pointer
            ${isVisible ? "bg-accent/30" : ""}
          `}
            onClick={onToggle}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`
                w-3 h-3 rounded-full border-2
                transition-all duration-200
                ${
                  isVisible
                    ? "border-white shadow-md scale-110"
                    : "border-gray-300"
                }
              `}
                style={{
                  backgroundColor: "#ff6b00",
                  boxShadow: isVisible ? "0 0 8px #ff6b0040" : "none",
                }}
              />
              <Label
                htmlFor="reports-toggle"
                className={`
                text-sm cursor-pointer transition-all duration-200
                ${
                  isVisible
                    ? "font-medium text-foreground"
                    : "font-normal text-muted-foreground"
                }
              `}
              >
                Show Reports
              </Label>
            </div>
            <Switch
              id="reports-toggle"
              checked={isVisible}
              onCheckedChange={onToggle}
              size="sm"
              className="ml-auto"
            />
          </div>
          <p className="text-xs text-muted-foreground px-2.5">
            Toggle visibility of drainage issue reports on the map
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
