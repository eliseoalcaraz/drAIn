"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  fetchReports,
  subscribeToNewReports,
  type Report,
} from "@/lib/supabase/report";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SpinnerEmpty } from "@/components/spinner-empty";
import { format, subDays, subWeeks, subMonths, startOfDay } from "date-fns";
import type { DateFilterValue } from "./date-sort";

interface AllReportsListProps {
  dateFilter?: DateFilterValue;
}

export default function AllReportsList({
  dateFilter = "all",
}: AllReportsListProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const fetchedReports = await fetchReports();
        setReports(fetchedReports);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();

    // Subscribe to new reports
    const unsubscribe = subscribeToNewReports((newReport) => {
      setReports((prev) => [newReport, ...prev]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getCategoryVariant = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes("clog") || lowerCategory.includes("block")) {
      return "default";
    }
    if (
      lowerCategory.includes("damage") ||
      lowerCategory.includes("collapse") ||
      lowerCategory.includes("corrosion")
    ) {
      return "destructive";
    }
    if (lowerCategory.includes("overflow")) {
      return "secondary";
    }
    return "outline";
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "unresolved":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  // Filter reports based on date filter
  const filteredReports = useMemo(() => {
    if (dateFilter === "all") {
      return reports;
    }

    const now = new Date();
    let cutoffDate: Date;

    switch (dateFilter) {
      case "today":
        cutoffDate = startOfDay(now);
        break;
      case "week":
        cutoffDate = subWeeks(now, 1);
        break;
      case "2weeks":
        cutoffDate = subWeeks(now, 2);
        break;
      case "3weeks":
        cutoffDate = subWeeks(now, 3);
        break;
      case "month":
        cutoffDate = subMonths(now, 1);
        break;
      default:
        return reports;
    }

    return reports.filter((report) => new Date(report.date) >= cutoffDate);
  }, [reports, dateFilter]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <SpinnerEmpty />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col pb-5 pl-5 pr-3 pt-3 gap-6">
      <CardHeader className="py-0 px-1">
        <CardTitle>All Reports</CardTitle>
        <CardDescription className="text-xs">
          View all submitted reports from the community
        </CardDescription>
      </CardHeader>

      <ScrollArea className="flex-1">
        {filteredReports.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">
            No reports found for the selected time period.
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="flex flex-row gap-3 border rounded-lg p-3 hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Image Thumbnail with Badges */}
                  {report.image ? (
                    <Image
                      src={report.image}
                      alt={report.category}
                      width={80}
                      height={80}
                      className="w-21 h-25 object-cover rounded"
                      unoptimized
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}

                  {/* Report Details */}
                  <div className="flex-1 flex flex-col gap-3 min-w-0">
                    <div className="flex-1">
                      {/* Description */}
                      <p className="text-sm text-foreground line-clamp-2 mb-2">
                        {report.description}
                      </p>

                      {/* Metadata */}
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">
                            {report.reporterName || "Anonymous"}
                          </span>
                          <span>on</span>
                          <span>{report.componentId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>
                            {format(new Date(report.date), "MMM dd, yyyy")}
                          </span>
                          {/*Apply Geocoding Here */}
                          {/* <span>
                            ({report.coordinates[1].toFixed(4)},{" "}
                            {report.coordinates[0].toFixed(4)})
                          </span> */}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row gap-2">
                      <Badge
                        variant={getCategoryVariant(report.category)}
                        className="text-[10px] font-normal px-3 py-0 h-5 justify-center"
                      >
                        {report.category}
                      </Badge>
                      <div
                        className={`text-[10px] font-normal px-3 py-0.5 h-5 rounded-md border font-medium flex items-center justify-center ${getStatusStyle(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
