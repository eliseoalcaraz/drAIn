"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";

interface Inlet {
  id: string;
  Inv_Elev: number;
  MaxDepth: number;
  Length: number;
  Height: number;
  Weir_Coeff: number;
  In_Type: number;
  ClogFac: number;
  ClogTime: number;
  FPLAIN_080: number;
  coordinates: [number, number];
}

interface InletTableProps {
  data: Inlet[];
  searchTerm: string;
  onSort: (field: InletSortField) => void;
  sortField: InletSortField;
  sortDirection: SortDirection;
}

export type InletSortField =
  | "id"
  | "Inv_Elev"
  | "MaxDepth"
  | "Length"
  | "ClogFac";
type SortDirection = "asc" | "desc";

export function InletTable({
  data,
  searchTerm,
  onSort,
  sortField,
  sortDirection,
}: InletTableProps) {
  // --- Filtering ---
  const filteredData = useMemo(() => {
    return data.filter((inlet) => {
      return inlet.id.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm]);

  // --- Sorting ---
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];

    sorted.sort((a, b) => {
      const aValue: string | number = a[sortField];
      const bValue: string | number = b[sortField];

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
  const renderSortIcon = (field: InletSortField) => {
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
        <CardTitle>Inlets Inventory</CardTitle>
        <p className="text-sm text-muted-foreground">
          Showing {sortedData.length} of {data.length} inlets
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
                    Inlet ID {renderSortIcon("id")}
                  </Button>
                </th>
                <th className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("Inv_Elev")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Elevation {renderSortIcon("Inv_Elev")}
                  </Button>
                </th>
                {/* <th className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("MaxDepth")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Max Depth {renderSortIcon("MaxDepth")}
                  </Button>
                </th> */}
                {/* <th className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("Length")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Length {renderSortIcon("Length")}
                  </Button>
                </th> */}
              </tr>
            </thead>
            <tbody>
              <tr className="h-5"></tr>
              {sortedData.map((inlet) => (
                <tr key={inlet.id} className="group">
                  <td className="p-2 text-center font-mono text-sm">
                    {inlet.id}
                  </td>
                  <td className="p-2 text-center">
                    {inlet.Inv_Elev.toFixed(2)}
                  </td>
                  {/* <td className="p-2 text-center">
                    {inlet.MaxDepth.toFixed(2)}
                  </td> */}
                  {/* <td className="p-2 text-center">{inlet.Length.toFixed(2)}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </div>
  );
}
