"use client";

import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { getInitials } from "@/lib/initials";
import { X, Image as ImageIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { History } from "lucide-react";
import type mapboxgl from "mapbox-gl";
import { ImageViewer } from "@/components/image-viewer";

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
  map: mapboxgl.Map | null;
  coordinates: [number, number];
  onOpen?: () => void;
}

export interface ReportBubbleRef {
  close: () => void;
}

export const ReportBubble = forwardRef<ReportBubbleRef, Props>(
  function ReportBubble({ report, map, coordinates, onOpen }, ref) {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showImageViewer, setShowImageViewer] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const initials = getInitials(report.reporterName);

    const handleOpen = () => {
      // Close other popups by calling the parent's onOpen callback
      onOpen?.();

      // Open this popup
      setIsClosing(false);
      setIsOpen(true);

      // Fly to this location with zoom with smooth easing
      if (map) {
        map.flyTo({
          center: coordinates,
          zoom: 18,
          duration: 1500,
          easing: (t) => t * (2 - t), // easeOutQuad for smoother deceleration
          essential: true,
        });
      }
    };

    const onClose = () => {
      setIsClosing(true);
      // Wait for animation to complete before actually closing
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 200);
    };

    // Expose close method to parent
    useImperativeHandle(ref, () => ({
      close: onClose,
    }));

    // Toggle active-popup class on the Mapbox popup container
    useEffect(() => {
      if (!containerRef.current) return;

      // Find the parent Mapbox popup container
      const mapboxPopup = containerRef.current.closest(".mapboxgl-popup");

      if (mapboxPopup) {
        if (isOpen) {
          mapboxPopup.classList.add("active-popup");
        } else {
          mapboxPopup.classList.remove("active-popup");
        }
      }
    }, [isOpen]);

    // Close popup when zooming out
    useEffect(() => {
      if (!map || !isOpen) return;

      const handleZoom = () => {
        const currentZoom = map.getZoom();
        // Close popup if zoom level is below 16
        if (currentZoom < 17) {
          setIsOpen(false);
        }
      };

      map.on("zoom", handleZoom);

      return () => {
        map.off("zoom", handleZoom);
      };
    }, [map, isOpen]);

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

    // Component colors (for component color)
    const getComponentColor = (type: string) => {
      switch (type) {
        case "pipe":
          return "bg-[#8B008B]"; // purple
        case "drain":
          return "bg-[#0088ff]"; // blue
        case "inlet":
          return "bg-[#00cc44]"; // green
        case "outlet":
          return "bg-[#cc0000]"; // red
        default:
          return "bg-gray-400";
      }
    };

    return (
      <div ref={containerRef} className="relative">
        {/* Clickable initials button */}
        <button
          onClick={handleOpen}
          className={`relative w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 ${getComponentColor(
            report.componentType
          )}`}
        >
          {initials}
        </button>

        {/* Popup */}
        {isOpen && (
          <div
            className={`absolute left-10 top-0 w-2xs p-4 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-200 ${
              isClosing
                ? "animate-out fade-out slide-out-to-left-2"
                : "animate-in fade-in slide-in-from-left-2"
            }`}
          >
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
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm ${getComponentColor(
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

            {/* Report description with optional image link */}
            <div className="ml-[52px] mb-4">
              <p className="text-xs text-gray-800">
                {report.description}{" "}
                {report.image && (
                  <button
                    onClick={() => setShowImageViewer(true)}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                  >
                    <ImageIcon className="w-3 h-3" />
                    Image Attached
                  </button>
                )}
              </p>
            </div>

            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-1">
                <span className="font-bold text-[#7e7e7e]">
                  {report.componentId}
                </span>

                <span className="text-[#7e7e7e]">has 5 reports</span>
              </div>

              <div className="rounded-full bg-[#b3b3b3] p-1">
                <History className="w-4 h-4 text-white justify-center items-center" />
              </div>
            </div>
          </div>
        )}

        {/* Image Viewer Modal */}
        {showImageViewer && report.image && (
          <ImageViewer
            imageUrl={report.image}
            reporterName={report.reporterName}
            date={report.date}
            category={report.category}
            description={report.description}
            coordinates={coordinates}
            componentType={report.componentType}
            componentId={report.componentId}
            onClose={() => setShowImageViewer(false)}
          />
        )}
      </div>
    );
  }
);
