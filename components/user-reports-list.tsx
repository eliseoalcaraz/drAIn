"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { report } from "@/data/content";

interface UserReportsListProps {
  userId?: string;
}

export default function UserReportsList({ userId }: UserReportsListProps) {
  // For now, display all reports. In production, you'd filter by userId from database
  const userReports = report;

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

  return (
    <Card className="max-h-[350px] py-0 rounded-none h-full border-none flex flex-col gap-0 overflow-hidden">
      <CardContent className="flex-1 overflow-hidden px-6 py-4">
        <ScrollArea className="h-full">
          {userReports.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              You haven&apos;t submitted any reports yet.
            </div>
          ) : (
            <div className="space-y-3 pr-4">
              {userReports.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 border rounded-lg py-3 px-5 hover:bg-accent transition-colors"
                >
                  {/* Report Details */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex-1">
                      {/* Description */}
                      <p className="text-xs text-foreground line-clamp-2 mb-2">
                        {item.description}
                      </p>

                      {/* Metadata */}
                      <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>{item.date}</span>
                          <span>
                            ({item.geocode.lat.toFixed(4)},{" "}
                            {item.geocode.lng.toFixed(4)})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-row gap-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-normal px-3 py-0 h-5 justify-center"
                      >
                        asd
                      </Badge>
                      {/* Status badge - assuming pending for now since data doesn't have status */}
                      <div
                        className={`text-[10px] px-3 py-0.5 h-5 rounded-md border flex items-center justify-center ${getStatusStyle(
                          "pending"
                        )}`}
                      >
                        pending
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
