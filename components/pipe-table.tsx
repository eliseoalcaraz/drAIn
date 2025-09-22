"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";

interface ManPipe {
  id: string; // we'll map from properties.Name
  TYPE: string;
  Pipe_Shape: string;
  Pipe_Lngth: number;
  Height: number;
  Width: number;
  Barrels: number;
  ClogPer: number;
  ClogTime: number;
  Mannings: number;
}

interface PipeTableProps {
  data: ManPipe[];
  searchTerm: string;
  onSort: (field: PipeSortField) => void;
  sortField: PipeSortField;
  sortDirection: SortDirection;
}

export type PipeSortField =
  | "id"
  | "TYPE"
  | "Pipe_Shape"
  | "Pipe_Lngth"
  | "ClogPer";
type SortDirection = "asc" | "desc";

export function PipeTable({
  data,
  searchTerm,
  onSort,
  sortField,
  sortDirection,
}: PipeTableProps) {
  // --- Filtering ---
  const filteredData = useMemo(() => {
    return data.filter((pipe) => {
      return (
        pipe.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pipe.TYPE.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
  const renderSortIcon = (field: PipeSortField) => {
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
        <CardTitle>Mandaue Pipes Inventory</CardTitle>
        <p className="text-sm text-muted-foreground">
          Showing {sortedData.length} of {data.length} pipes
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
                    Pipe ID {renderSortIcon("id")}
                  </Button>
                </th>
                {/* <th className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("TYPE")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Type {renderSortIcon("TYPE")}
                  </Button>
                </th> */}
                {/* <th className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("Pipe_Shape")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Shape {renderSortIcon("Pipe_Shape")}
                  </Button>
                </th> */}
                <th className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("Pipe_Lngth")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Length (m) {renderSortIcon("Pipe_Lngth")}
                  </Button>
                </th>
                {/* <th className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("ClogPer")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Clog % {renderSortIcon("ClogPer")}
                  </Button>
                </th> */}
              </tr>
            </thead>
            <tbody>
              <tr className="h-5"></tr>
              {sortedData.map((pipe) => (
                <tr key={pipe.id} className="group">
                  <td className="p-2 text-center font-mono text-sm">
                    {pipe.id}
                  </td>
                  {/* <td className="p-2 text-center">{pipe.TYPE}</td> */}
                  {/* <td className="p-2 text-center">{pipe.Pipe_Shape}</td> */}
                  <td className="p-2 text-center">
                    {pipe.Pipe_Lngth.toFixed(2)}
                  </td>
                  {/* <td className="p-2 text-center">{pipe.ClogPer}%</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </div>
  );
}
