import { AlertCircle, X } from "lucide-react";
import { Report } from "@/data/dummy-reports";
import { formatDistanceToNow } from "date-fns";

interface ReportBubbleProps {
  report: Report;
  onClose?: () => void;
}

export function ReportBubble({ report, onClose }: ReportBubbleProps) {
  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yello    w-100 text-yellow-800 border-yellow-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getComponentIcon = (type: Report["componentType"]) => {
    const colors = {
      inlet: "bg-green-500",
      outlet: "bg-red-500",
      pipe: "bg-purple-500",
      drain: "bg-blue-500",
    };
    return colors[type] || "bg-gray-500";
  };

  const getComponentLabel = (type: Report["componentType"]) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {/* Header with avatar and reporter info */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full ${getComponentIcon(
            report.componentType
          )} flex items-center justify-center flex-shrink-0`}
        >
          <AlertCircle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{report.reporterName}</h3>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(report.date), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Status badge */}
      <div className="ml-[52px] mb-2">
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            report.status
          )}`}
        >
          {report.status.replace("-", " ").toUpperCase()}
        </span>
      </div>

      {/* Component info */}
      <div className="mb-3">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">Component:</span>{" "}
          {getComponentLabel(report.componentType)} ({report.componentId})
        </p>
        <p className="text-xs text-gray-600">
          <span className="font-semibold">Category:</span> {report.category}
        </p>
      </div>

      {/* Report description */}
      <div className="ml-[52px] mb-4">
        <p className="text-sm text-gray-800">{report.description}</p>
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
  );
}
