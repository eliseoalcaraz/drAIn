"use client";

import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { getInitials } from "@/lib/user-initials";
import { X, Image as ImageIcon, History } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type mapboxgl from "mapbox-gl";
import { ImageViewer } from "@/components/image-viewer";

interface Report {
  reporterName: string;
  date: string;
  status: string;
  componentId: string;
  category: string;
  description: string;
  image?: string | null;
}

interface Props {
  reportSize: Promise<number>;
  report: Report;
  map: mapboxgl.Map | null;
  coordinates: [number, number];
  onOpen?: () => void;
  count: number;
}

export interface ReportBubbleRef {
  close: () => void;
}


export const ReportBubble = forwardRef<ReportBubbleRef, Props>(
  function ReportBubble({reportSize, report, map, coordinates, onOpen }, ref) {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showImageViewer, setShowImageViewer] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const previousZoomRef = useRef<number | null>(null);
    const isAnimatingRef = useRef(false);

    const CLOSING_DURATION = 300; // Consistent fade-out duration
    const initials = getInitials(report.reporterName);

    const handleOpen = () => {
      onOpen?.();
      setIsClosing(false);
      setIsOpen(true);

      if (map) {
        isAnimatingRef.current = true;
        map.flyTo({
          center: coordinates,
          zoom: 18,
          duration: 1500,
          easing: (t) => t * (2 - t),
          essential: true,
        });

        map.once("moveend", () => {
          isAnimatingRef.current = false;
          previousZoomRef.current = map.getZoom();
        });
      }
    };

    const onClose = () => {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, CLOSING_DURATION);
    };

    useImperativeHandle(ref, () => ({
      close: onClose,
    }));

    useEffect(() => {
      if (!containerRef.current) return;
      const mapboxPopup = containerRef.current.closest(".mapboxgl-popup");

      if (mapboxPopup) {
        mapboxPopup.classList.toggle("active-popup", isOpen);
      }
    }, [isOpen]);

    // Close popup when zooming OUT
    useEffect(() => {
      if (!map || !isOpen) return;

      const handleZoom = () => {
        if (isAnimatingRef.current) return;

        const currentZoom = map.getZoom();
        const previousZoom = previousZoomRef.current;

        if (previousZoom !== null && currentZoom < previousZoom) {
          onClose();
        }

        previousZoomRef.current = currentZoom;
      };

      map.on("zoom", handleZoom);
      return () => {
        map.off("zoom", handleZoom);
      };
    }, [map, isOpen]);

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

    const getComponentColor = (type: string) => {
      switch (type) {
        case "pipe":
          return "bg-[#8B008B]";
        case "drain":
          return "bg-[#0088ff]";
        case "inlet":
          return "bg-[#00cc44]";
        case "outlet":
          return "bg-[#cc0000]";
        default:
          return "bg-gray-400";
      }
    };

    return (
      <div ref={containerRef} className="relative">
        {/* Initials button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className={`relative w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 ${getComponentColor(
            report.category
          )}`}
        >
          {initials}
        </button>

        {/* Popup */}
        {isOpen && (
          <div
            className={`absolute left-10 top-0 w-2xs p-4 bg-white rounded-lg shadow-lg border border-gray-200 ${
              isClosing
                ? "animate-out fade-out duration-300"
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

            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm ${getComponentColor(
                  report.category
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

            {/* Description */}
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

            {/* Footer */}
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-1">
                <span className="font-bold text-[#7e7e7e]">
                  {report.componentId}
                </span>
                <span className="text-[#7e7e7e]">has {reportSize} {reportSize > 1 ? "reports": "report"}</span>
              </div>
              <div className="rounded-full bg-[#b3b3b3] p-1">
                <History className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Image Viewer */}
        {showImageViewer && report.image && (
          <ImageViewer
            imageUrl={report.image}
            reporterName={report.reporterName}
            date={report.date}
            category={report.category}
            description={report.description}
            coordinates={coordinates}
            componentId={report.componentId}
            onClose={() => setShowImageViewer(false)}
          />
        )}
      </div>
    );
  }
);
