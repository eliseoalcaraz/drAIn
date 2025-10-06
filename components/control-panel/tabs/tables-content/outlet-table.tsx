"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";
import type { Outlet } from "@/hooks/useOutlets";

export type OutletSortField = "id" | "Inv_Elev" | "AllowQ" | "FlapGate";
export type SortDirection = "asc" | "desc";

export interface OutletTableProps {
  data: Outlet[];
  searchTerm: string;
  onSort: (field: OutletSortField) => void;
  sortField: OutletSortField;
  sortDirection: SortDirection;
  onSelectOutlet: (outlet: Outlet) => void;
}

export function OutletTable({
  data,
  searchTerm,
  onSort,
  sortField,
  sortDirection,
  onSelectOutlet,
}: OutletTableProps) {
  // --- Filtering ---
  const filteredData = useMemo(() => {
    return data.filter((outlet) => {
      return outlet.id.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm]);

  // --- Sorting ---
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

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

  const renderSortIcon = (field: OutletSortField) => {
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
        <CardTitle>Outlets Inventory</CardTitle>
        <p className="text-sm text-muted-foreground">
          Showing {sortedData.length} of {data.length} outlets
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-[#808080]">
              <tr>
                <th className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("id")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Outlet ID {renderSortIcon("id")}
                  </Button>
                </th>
                <th className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("Inv_Elev")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Invert Elev {renderSortIcon("Inv_Elev")}
                  </Button>
                </th>
                {/* <th className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("AllowQ")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Allow Q {renderSortIcon("AllowQ")}
                  </Button>
                </th> */}
                {/* <th className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("FlapGate")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Flap Gate {renderSortIcon("FlapGate")}
                  </Button>
                </th> */}
              </tr>
            </thead>
            <tbody>
              <tr className="h-5"></tr>
              {sortedData.map((outlet) => (
                <tr
                  key={outlet.id}
                  onClick={() => onSelectOutlet(outlet)}
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <td className="p-2 text-center font-mono text-sm rounded-l-xl">
                    {outlet.id}
                  </td>
                  <td className="p-2 text-center rounded-r-xl">
                    {outlet.Inv_Elev}
                  </td>
                  {/* <td className="p-2 text-center">{outlet.AllowQ}</td> */}
                  {/* <td className="p-2 text-center">{outlet.FlapGate}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </div>
  );
}
