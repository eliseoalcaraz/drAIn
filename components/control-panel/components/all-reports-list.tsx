"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchReports, subscribeToNewReports } from "@/lib/supabase/report";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SpinnerEmpty } from "@/components/spinner-empty";
import { format } from "date-fns";

interface Report {
  id: string;
  date: string;
  category: string;
  description: string;
  image: string;
  reporterName: string;
  status: "pending" | "in-progress" | "resolved";
  componentId: string;
  coordinates: [number, number];
}

export default function AllReportsList() {
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "resolved":
        return "default";
      case "in-progress":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

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
        {reports.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">
            No reports have been submitted yet.
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="border rounded-lg p-3 hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Image Thumbnail */}
                  {report.image ? (
                    <img
                      src={report.image}
                      alt={report.category}
                      className="w-20 h-20 object-cover rounded flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}

                  {/* Report Details */}
                  <div className="flex-1 min-w-0">
                    {/* Header with badges */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant={getCategoryVariant(report.category)}>
                        {report.category}
                      </Badge>
                      <Badge variant={getStatusVariant(report.status)}>
                        {report.status}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-foreground line-clamp-2 mb-2">
                      {report.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Reporter:</span>
                        <span>{report.reporterName || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Component:</span>
                        <span>{report.componentId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Date:</span>
                        <span>
                          {format(new Date(report.date), "MMM dd, yyyy HH:mm")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Location:</span>
                        <span>
                          {report.coordinates[1].toFixed(4)},{" "}
                          {report.coordinates[0].toFixed(4)}
                        </span>
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
