"use client";

import { useState } from "react";
import { getInitials } from "@/lib/initials";
import { X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { History } from "lucide-react";

interface Report {
  reporterName: string;
  date: string;
  status: "pending" | "in-progress" | "resolved";
  componentType: "pipe" | "drain" | "inlet" | "outlet";
  componentId: string;
  category: string;
  description: string;
  image?: string | null;
}

interface Props {
  report: Report;
}

export function ReportBubble({ report }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const initials = getInitials(report.reporterName);

  const onClose = () => setIsOpen(false);

  // Status colors (for badge text + border)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "border-yellow-500 text-yellow-600";
      case "in-progress":
        return "border-blue-500 text-blue-600";
      case "resolved":
        return "border-green-500 text-green-600";
      default:
        return "border-gray-300 text-gray-600";
    }
  };

  // Component colors (for component border)
  const getComponentBorderColor = (type: string) => {
    switch (type) {
      case "pipe":
        return "border-[#8B008B]"; // purple
      case "drain":
        return "border-[#0088ff]"; // blue
      case "inlet":
        return "border-[#00cc44]"; // green
      case "outlet":
        return "border-[#cc0000]"; // red
      default:
        return "border-gray-400";
    }
  };

  const getComponentLabel = (type: string) => type;

  return (
    <div>
      {/* Clickable initials button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold border-2 ${getComponentBorderColor(
          report.componentType
        )}`}
      >
        {initials}
      </button>

      {/* Popup */}
      {isOpen && (
        <div className="absolute left-10 z-100 w-2xs p-4 bg-white rounded-lg shadow-lg">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {/* Header with avatar and reporter info */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-600 text-white font-bold text-sm border-2 ${getComponentBorderColor(
                report.componentType
              )}`}
            >
              {initials}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {report.reporterName}
              </h3>
              <div className="flex flex-row gap-3">
                <p className="text-2xs text-gray-500">
                  {formatDistanceToNow(new Date(report.date), {
                    addSuffix: true,
                  })}
                </p>

                <span
                  className={`justify-center h-5 inline-block px-3 rounded-full text-[7px] font-medium border ${getStatusColor(
                    report.status
                  )}`}
                >
                  {report.status.replace("-", " ").toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Report description */}
          <div className="ml-[52px] mb-4">
            <p className="text-xs text-gray-800">{report.description}</p>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-1">
              <span
                className={`font-bold text-[#7e7e7e] ${getComponentBorderColor(
                  report.componentType
                )}`}
              >
                {report.componentId}
              </span>

              <span className="text-[#7e7e7e]">has 5 reports</span>
            </div>

            <div className="rounded-full bg-[#b3b3b3] p-1">
              <History className="w-4 h-4 text-white justify-center items-center" />
            </div>
          </div>

          {/* Image preview if available */}
          {report.image && (
            <div className="ml-[52px] mb-3">
              <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={report.image}
                  alt="Report evidence"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
