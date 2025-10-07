"use client";

import { Toggle } from "@/components/ui/toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info, Power } from "lucide-react";
import Flag from "@/public/icons/flag.svg";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ReportsToggleProps {
  isVisible: boolean;
  onToggle: () => void;
  onNavigateToReportForm?: () => void;
  reports: any[];
}

const chartConfig = {
  count: {
    label: "Reports",
    color: "#3F83DB",
  },
} satisfies ChartConfig;

export function ReportsToggle({
  isVisible,
  onToggle,
  onNavigateToReportForm,
  reports = [],
}: ReportsToggleProps) {
  const totalReports = reports.length;

  const chartData = useMemo(() => {
    const dateCounts = reports.reduce((acc, item) => {
      const date = new Date(item.date).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort by date
    const sortedDates = Object.keys(dateCounts).sort();

    return sortedDates.map((date) => ({
      date,
      count: dateCounts[date],
    }));
  }, [reports]);

  return (
    <div className="bg-[#eeeeee] rounded-xl border border-[#e2e2e2]">
      <div
        className="py-2 px-4 flex flex-row items-center justify-between cursor-pointer hover:bg-[#e8e8e8] transition-colors rounded-t-xl"
        onClick={onNavigateToReportForm}
      >
        <span className="text-xs">User Reports</span>
        <Info className="h-3.5 w-3.5 opacity-70" />
      </div>

      <Card className="border-x-0 gap-3 pb-4">
        <CardHeader className="flex-col gap-3 pb-0">
          <CardTitle className="flex flex-row">
            <div className="flex flex-row items-center gap-2">
              <Flag className="w-4 h-4" />
              <span>{totalReports} reports</span>
            </div>

            <Toggle
              id="reports-toggle"
              pressed={isVisible}
              onPressedChange={() => onToggle()}
              onClick={(e: any) => e.stopPropagation()}
              variant="outline"
              size="sm"
              aria-label="Toggle reports visibility"
              className="ml-auto"
            >
              <Power className="h-4 w-4" />
            </Toggle>
          </CardTitle>
          <CardDescription className="text-xs">
            Toggle visibility of drainage issue reports on the map
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {/* Bar Chart */}

          <ChartContainer
            config={chartConfig}
            className="flex h-[100px] w-full max-w-[240px]"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 0,
                right: 0,
                top: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <div className="flex justify-end py-2 px-4 items-center gap-2">
        <div className="bg-[#3F83DB] w-4 h-1.5 rounded-lg" />
        <span className="text-xs">Report</span>
      </div>
    </div>
  );
}
