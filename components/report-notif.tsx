"use client";

import { IconBellFilled } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useReports } from "./context/ReportProvider";

export default function NotificationBell() {
  const { notifications, unreadCount, handleOpenNotifications } = useReports();

  return (
    <Popover onOpenChange={(open) => open && handleOpenNotifications()}>
      <PopoverTrigger className="relative p-2 hover:bg-gray-100 rounded-full transition">
        <IconBellFilled className="w-4.5 h-4.5 text-[#b2adab]" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {unreadCount}
          </Badge>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-72 p-4" side="right" align="end">
        <h4 className="text-sm font-semibold mb-3">Notifications</h4>

        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">No new notifications.</p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-auto">
            {notifications.slice(0, 5).map((n) => (
              <li
                key={n.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition flex flex-col gap-1"
              >
                <p className="text-sm text-gray-800">
                  <span className=" w-full">
                    <span className="font-medium">
                      {n.status === "pending"
                        ? "New Report Added"
                        : `Report Updated`}
                    </span>
                    <span className="font-normal text-xs"> ({n.status})</span>
                  </span>
                </p>
                <span className="font-normal text-xs mb-2">
                  {n.category || "report"} from {n.reporterName || "Unknown"}
                </span>

                <p className="text-sm text-gray-600">
                  {n.address || "No address provided"}
                </p>

                {/* {n.description && (
                  <p className="text-xs text-gray-500 italic">
                    “
                    {n.description.length > 60
                      ? n.description.slice(0, 60) + "..."
                      : n.description}
                    ”
                  </p>
                )} */}

                <div className="flex mt-2 justify-between items-center text-xs text-gray-400">
                  <span>
                    {new Date(n.date || Date.now()).toLocaleString()}
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
