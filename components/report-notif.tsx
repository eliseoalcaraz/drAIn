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
        console.log("🔔 NotificationBell new report:", newReport);
      },
      (updatedReport) => {
        setNotifications((prev) =>
          prev.map((r) => (r.id === updatedReport.id ? updatedReport : r))
        );
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
                className="border rounded-lg p-2 hover:bg-gray-50 transition"
              >
                <p className="font-medium text-sm">
                  New report: {n.title || "Untitled"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(n.created_at || Date.now()).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
