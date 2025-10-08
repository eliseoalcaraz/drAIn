"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { report } from "@/data/content";

interface UserReportsListProps {
  userId?: string;
}

export default function UserReportsList({ userId }: UserReportsListProps) {
  // For now, display all reports. In production, you'd filter by userId from database
  const userReports = report;

  return (
    <Card className="max-h-[350px] pt-0 pb-0 flex flex-col border gap-0 border-[#e1e1e1] overflow-hidden">
      <div className="border-b py-4 px-8 border-[#e1e1e1] bg-[#f7f7f7] flex-shrink-0">
        <CardTitle className="p-0">Reports</CardTitle>
      </div>

      <CardContent className="flex-1 overflow-y-auto px-6 py-4">
        {userReports.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">
            You haven&apos;t submitted any reports yet.
          </div>
        ) : (
          <>
            {userReports.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 mb-4 last:mb-0 hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={
                          item.category === "Clogged"
                            ? "default"
                            : item.category === "Damage Drain"
                            ? "destructive"
                            : item.category === "Overflow"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {item.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-sm text-foreground line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.geocode.lat.toFixed(4)},{" "}
                      {item.geocode.lng.toFixed(4)}
                    </p>
                  </div>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.category}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
