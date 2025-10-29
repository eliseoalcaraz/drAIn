"use client";

import React from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconInfoCircleFilled } from "@tabler/icons-react";
import { Loader2, Minimize2, Maximize2 } from "lucide-react";
import { LoadingScreen } from "@/components/loading-screen";
import type { Inlet, Outlet, Pipe, Drain } from "../../types";

interface Model2Props {
  selectedPointId?: string | null;
  selectedInlet?: Inlet | null;
  selectedOutlet?: Outlet | null;
  selectedPipe?: Pipe | null;
  selectedDrain?: Drain | null;
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
  onGenerateTable: () => void;
  isLoading: boolean;
  onCloseTable?: () => void;
  hasTable?: boolean;
  isTableMinimized?: boolean;
  onToggleMinimize?: () => void;
}

type YearOption = 2 | 5 | 10 | 15 | 20 | 25 | 50 | 100;

const YEAR_OPTIONS: YearOption[] = [2, 5, 10, 15, 20, 25, 50, 100];

export default function Model2({
  selectedPointId: _selectedPointId = null,
  selectedInlet: _selectedInlet = null,
  selectedOutlet: _selectedOutlet = null,
  selectedPipe: _selectedPipe = null,
  selectedDrain: _selectedDrain = null,
  selectedYear,
  onYearChange,
  onGenerateTable,
  isLoading,
  onCloseTable: _onCloseTable,
  hasTable = false,
  isTableMinimized = false,
  onToggleMinimize,
}: Model2Props) {
  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen
        title="Analyzing Hydraulic Capacity"
        messages={[
          "Fetching vulnerability data...",
          "Analyzing drainage system...",
          "Calculating flow rates...",
          "Preparing results table...",
        ]}
        isLoading={isLoading}
        position="bottom-right"
      />

      {/* expand to full available height and allow inner flex children to size correctly */}
      <div className="flex flex-col flex-1 h-full min-h-0 pt-3 pb-5 pl-5 pr-4">
        <CardHeader className="py-0 px-1 mb-6">
          <CardTitle>Hydraulic Capacity Model</CardTitle>
          <CardDescription className="text-xs">
            Analyze drainage system capacity and flow rates under various storm
            return periods
          </CardDescription>
        </CardHeader>

        {/* main content grows */}
        <div className="space-y-4 flex-1">
          {/* Year Selector (row with tooltip) */}
          <div className="flex flex-row justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">Return Period</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconInfoCircleFilled className="w-3.5 h-3.5 text-[#8D8D8D]/50 hover:text-[#8D8D8D] cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">
                      Choose a storm return period to generate vulnerability
                      results for that event frequency.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Select
              value={selectedYear?.toString() || ""}
              onValueChange={(value) => onYearChange(Number(value) as YearOption)}
            >
              <SelectTrigger id="year-select" className="min-w-[120px]">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year} Year Storm
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* other content can go here and will scroll if necessary */}
          <div><span className="text-sm">Vulnerability Indicator</span></div>
          <div className="flex justify-end py-1 px-5 items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="bg-[#D32F2F] w-4 h-1.5 rounded-lg" />
              <span className="text-xs">High Risk</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="bg-[#FFA000] w-4 h-1.5 rounded-lg" />
              <span className="text-xs">Medium Risk</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="bg-[#FFF176] w-4 h-1.5 rounded-lg" />
              <span className="text-xs">Low Risk</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="bg-[#388E3C] w-4 h-1.5 rounded-lg" />
              <span className="text-xs">No risk</span>
            </div>
          </div>
        </div>

        {/* footer anchored to bottom */}
        {/* Generate and Close Buttons (side-by-side) placed at bottom */}
        <div className="mt-auto">
          <div className="flex gap-2">
            <Button
              onClick={onGenerateTable}
              disabled={!selectedYear || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Data...
                </>
              ) : (
                "Generate Table on Map"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => onToggleMinimize && onToggleMinimize()}
              disabled={isLoading || !hasTable}
              className="flex-none"
              aria-label={isTableMinimized ? "Show table" : "Hide table"}
            >
              {isTableMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
          </div>

          <p className="text-[10px] text-muted-foreground mt-3">
            The vulnerability data table will appear on the map and can be sorted
            and dragged to reposition.
          </p>
        </div>
      </div>
    </>
  );
}
