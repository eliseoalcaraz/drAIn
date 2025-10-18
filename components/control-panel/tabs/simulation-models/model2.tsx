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
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
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
}

type YearOption = 2 | 5 | 10 | 15 | 20 | 25 | 50 | 100;

const YEAR_OPTIONS: YearOption[] = [2, 5, 10, 15, 20, 25, 50, 100];

export default function Model2({
  selectedPointId = null,
  selectedInlet = null,
  selectedOutlet = null,
  selectedPipe = null,
  selectedDrain = null,
  selectedYear,
  onYearChange,
  onGenerateTable,
  isLoading,
}: Model2Props) {

  return (
    <div className="flex flex-col flex-1 pt-3 pb-5 pl-5 pr-4 space-y-4">
      <CardHeader className="py-0 px-1 mb-3">
        <CardTitle>Hydraulic Capacity Model</CardTitle>
        <CardDescription className="text-xs">
          Analyze drainage system capacity and flow rates under various storm
          return periods
        </CardDescription>
      </CardHeader>

      <div className="space-y-4">
        {/* Year Selector */}
        <div className="space-y-2">
          <Label htmlFor="year-select" className="text-sm font-medium">
            Select Storm Return Period
          </Label>
          <Select
            value={selectedYear?.toString() || ""}
            onValueChange={(value) => onYearChange(Number(value) as YearOption)}
          >
            <SelectTrigger id="year-select" className="w-full">
              <SelectValue placeholder="Choose a return period..." />
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

        {/* Generate Button */}
        <Button
          onClick={onGenerateTable}
          disabled={!selectedYear || isLoading}
          className="w-full"
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

        <p className="text-xs text-muted-foreground">
          The vulnerability data table will appear on the map and can be dragged to reposition.
        </p>
      </div>
    </div>
  );
}
