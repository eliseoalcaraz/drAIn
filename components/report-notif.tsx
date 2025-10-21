"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { subscribeToReportChanges } from "@/lib/supabase/report";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToReportChanges(
      (newReport) => {
        setNotifications((prev) => [newReport, ...prev]);
        setUnreadCount((c) => c + 1);
        console.log("New report inserted:", newReport);
      },
      (updatedReport) => {
        setNotifications((prev) => {
          const index = prev.findIndex((r) => r.id === updatedReport.id);
          if (index !== -1) {
            const newList = [...prev];
            newList[index] = { ...updatedReport };
            return newList;
          }
          return [updatedReport, ...prev];
        });

        setUnreadCount((c) => c + 1);
        console.log("Report updated:", updatedReport);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleOpen = () => setUnreadCount(0);

  return (
    <Popover onOpenChange={(open) => open && handleOpen()}>
      <PopoverTrigger className="relative p-2 hover:bg-gray-100 rounded-full transition">
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {unreadCount}
          </Badge>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-72 p-2">
        <h4 className="font-semibold mb-2">Notifications</h4>

        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">No new notifications.</p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-auto">
            {notifications.slice(0, 5).map((n) => (
              <li
                key={n.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition flex flex-col gap-1"
              >
                <p className="font-medium text-sm text-gray-800">
                  {n.status === "pending"
                    ? "New Report Added"
                    : `Report Updated (${n.status})`}{" "}
                  — {n.category || "report"} from {n.reporter_name || "Unknown"}
                </p>

                <p className="text-sm text-gray-600">
                  {n.address || "No address provided"}
                </p>

                {n.description && (
                  <p className="text-xs text-gray-500 italic">
                    “
                    {n.description.length > 60
                      ? n.description.slice(0, 60) + "..."
                      : n.description}
                    ”
                  </p>
                )}

                <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                  <span>Status: {n.status || "pending"}</span>
                  <span>
                    {new Date(n.updated_at || n.created_at || Date.now()).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
