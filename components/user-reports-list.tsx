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
    <Card className="max-h-[350px] flex flex-col border gap-0  border-[#e1e1e1] p-0">
      <div className="border-b py-4 rounded-t-xl px-8 border-[#e1e1e1] bg-[#f7f7f7]">
        <CardTitle className="p-0">Reports</CardTitle>
      </div>

      <CardContent className="flex-1 h-full bg-red-500 overflow-hidden  mt-0 pt-0 pr-0">
        {userReports.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">
            You haven&apos;t submitted any reports yet.
          </div>
        ) : (
          <div className="max-h-[320px] overflow-y-auto pr-2">
            {userReports.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 my-4 hover:bg-accent transition-colors"
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
