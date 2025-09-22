"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";

interface Drain {
  id: number;
  In_Name: string;
  InvElev: number;
  clog_per: number;
  clogtime: number;
  Weir_coeff: number;
  Length: number;
  Height: number;
  Max_Depth: number;
  ClogFac: number;
  NameNum: number;
  FPLAIN_080: number;
}

interface DrainTableProps {
  data: Drain[];
  searchTerm: string;
  onSort: (field: DrainSortField) => void;
  sortField: DrainSortField;
  sortDirection: SortDirection;
}

export type DrainSortField = "id" | "In_Name" | "InvElev" | "clog_per";
type SortDirection = "asc" | "desc";

export function DrainTable({
  data,
  searchTerm,
  onSort,
  sortField,
  sortDirection,
}: DrainTableProps) {
  // --- Filtering ---
  const filteredData = useMemo(() => {
    return data.filter((drain) => {
      return (
        drain.In_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drain.id.toString().includes(searchTerm.toLowerCase())
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
  const renderSortIcon = (field: DrainSortField) => {
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
        <CardTitle>Storm Drains Inventory</CardTitle>
        <p className="text-sm text-muted-foreground">
          Showing {sortedData.length} of {data.length} drains
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
                    Drain ID {renderSortIcon("id")}
                  </Button>
                </th>
                <th className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("InvElev")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Inv. Elev (m) {renderSortIcon("InvElev")}
                  </Button>
                </th>
                {/* <th className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("clog_per")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Clog % {renderSortIcon("clog_per")}
                  </Button>
                </th> */}
              </tr>
            </thead>
            <tbody>
              <tr className="h-5"></tr>
              {sortedData.map((drain) => (
                <tr key={drain.In_Name} className="group">
                  <td className="p-2 text-center">{drain.In_Name}</td>
                  <td className="p-2 text-center">
                    {drain.InvElev.toFixed(2)}
                  </td>
                  {/* <td className="p-2 text-center">{drain.clog_per}%</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </div>
  );
}
