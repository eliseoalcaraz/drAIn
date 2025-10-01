"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ImageViewerProps {
  imageUrl: string;
  reporterName: string;
  date: string;
  category: string;
  description: string;
  coordinates: [number, number];
  componentType: string;
  componentId: string;
  onClose: () => void;
}

export function ImageViewer({
  imageUrl,
  reporterName,
  date,
  category,
  description,
  coordinates,
  componentType,
  componentId,
  onClose,
}: ImageViewerProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when viewer is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return createPortal(
    // This is the element creating the dark background overlay
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop - clicking closes viewer */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close image viewer"
      />

      {/* Main viewer container */}
      <div className="relative z-10 flex max-h-[90vh] max-w-[90vw] gap-4 animate-in zoom-in-95 duration-300">
        {/* Image section */}
        <div className="relative flex items-center justify-center bg-black rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt="Report evidence"
            className="max-h-[90vh] max-w-[60vw] object-contain"
          />
        </div>

        {/* Metadata sidebar */}
        <div className="w-80 bg-white rounded-lg p-6 shadow-2xl overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-20"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <h2 className="text-xl font-bold text-gray-900 mb-4 pr-8">
            Image Details
          </h2>

          {/* Reporter Info */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">
              Reported By
            </h3>
            <p className="text-sm text-gray-900">{reporterName}</p>
          </div>

          {/* Date */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">
              Date
            </h3>
            <p className="text-sm text-gray-900">
              {new Date(date).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Category */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">
              Category
            </h3>
            <p className="text-sm text-gray-900">{category}</p>
          </div>

          {/* Component Info */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">
              Component
            </h3>
            <p className="text-sm text-gray-900">
              {componentType.charAt(0).toUpperCase() + componentType.slice(1)} -{" "}
              {componentId}
            </p>
          </div>

          {/* Coordinates */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">
              Coordinates
            </h3>
            <p className="text-sm text-gray-900 font-mono">
              {coordinates[1].toFixed(6)}, {coordinates[0].toFixed(6)}
            </p>
            <p className="text-xs text-gray-500 mt-1">(Lat, Lon)</p>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">
              Description
            </h3>
            <p className="text-sm text-gray-900 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4" />

          {/* Tips */}
          <div className="text-xs text-gray-500">
            <p className="mb-1">• Press ESC to close</p>
            <p>• Click outside to close</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
