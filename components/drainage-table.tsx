// components/drainage-table.tsx
"use client";

import { useMemo } from "react";
import type { DrainagePipe } from "@/lib/drainage";
import { VulnerabilityBadge } from "./vulnerability-badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";

interface DrainageTableProps {
  data: DrainagePipe[];
  searchTerm: string;
  vulnerabilityFilter: string;
  onSort: (field: SortField) => void;
  sortField: SortField;
  sortDirection: SortDirection;
}

type SortField =
  | "geocode"
  | "vulnerabilityRating"
  | "location"
  | "installDate"
  | "lastInspection";

type SortDirection = "asc" | "desc";

export function DrainageTable({
  data,
  searchTerm,
  vulnerabilityFilter,
  onSort,
  sortField,
  sortDirection,
}: DrainageTableProps) {
  // --- Filtering ---
  const filteredData = useMemo(() => {
    return data.filter((pipe) => {
      const matchesSearch =
        pipe.geocode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pipe.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesVulnerability =
        vulnerabilityFilter === "all" ||
        pipe.vulnerabilityRating === vulnerabilityFilter;

      return matchesSearch && matchesVulnerability;
    });
  }, [data, searchTerm, vulnerabilityFilter]);

  // --- Sorting ---
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];

    sorted.sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      if (sortField === "vulnerabilityRating") {
        const ratingOrder = { high: 3, moderate: 2, low: 1 };
        aValue = ratingOrder[a.vulnerabilityRating];
        bValue = ratingOrder[b.vulnerabilityRating];
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [filteredData, sortField, sortDirection]);

  // --- Helpers ---
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return (
      <ArrowUpDown
        className={`w-4 h-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
      />
    );
  };

  return (
    <div className="flex flex-col flex-1 pb-5 gap-8">
      <CardHeader>
        <CardTitle>Drainage Pipe Inventory</CardTitle>
        <p className="text-sm text-muted-foreground">
          Showing {sortedData.length} of {data.length} pipes
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-[#808080">
              <tr>
                <th className="text-center ">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("geocode")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Geocode {renderSortIcon("geocode")}
                  </Button>
                </th>
                <th className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("vulnerabilityRating")}
                    className="h-auto p-0 text-sm hover:bg-transparent"
                  >
                    Vulnerability {renderSortIcon("vulnerabilityRating")}
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-5"></tr>
              {sortedData.map((pipe) => (
                <tr key={pipe.id} className="group">
                  <td colSpan={2} className="p-1">
                    <div className="flex justify-between items-center p-4 rounded-lg border border-transparent hover:border-[#DCDCDC] group-hover:bg-muted/50">
                      <span className="font-mono text-sm font-medium">
                        {pipe.geocode}
                      </span>
                      <VulnerabilityBadge rating={pipe.vulnerabilityRating} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </div>
  );
}
