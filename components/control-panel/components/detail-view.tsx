import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { DetailItem, FieldConfig } from "../types";
import ModelViewer from "../../ModelViewer";
import { DataFieldCard } from "./DataFieldCard";

interface DetailViewProps {
  item: DetailItem;
  fields: FieldConfig[];
  modelUrl: string;
}

export function DetailView({ item, fields, modelUrl }: DetailViewProps) {
  const [showModel, setShowModel] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track which card is currently in view
  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        },
        {
          threshold: 0.6, // Card needs to be 60% visible
          rootMargin: "-20% 0px -20% 0px", // Focus on center of viewport
        }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [fields.length]);

  return (
    <div className="px-4 space-y-4 pb-8">
      <div className="space-y-2">
        <div className="flex border border-[#ced1cd] rounded-md">
          {!showModel ? (
            <button
              type="button"
              onClick={() => setShowModel(true)}
              className="flex-1 h-[250px] border-none rounded-lg flex flex-col items-center justify-center gap-3 hover:bg-[#f5f5f5] !cursor-pointer"
            >
              <svg
                className="w-15 h-15 text-muted-foreground/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                />
              </svg>
              <span className="text-sm font-medium">
                Click to Load 3D Model
              </span>
            </button>
          ) : (
            <ModelViewer
              url={modelUrl}
              defaultRotationX={0}
              defaultRotationY={0}
              autoRotate
              width={290}
              height={250}
              defaultZoom={1.3}
              showScreenshotButton={false}
              enableManualZoom={false}
              autoFrame
            />
          )}
        </div>
        <div className="flex items-start gap-2 px-2 py-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-md">
          <svg
            className="w-4 h-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
            The 3D model shown is a generic visual guide and not specifications
            of this specific component.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        {/* Timeline column with background line */}
        <div className="relative flex flex-col gap-4" style={{ width: "20px" }}>
          {/* Vertical connecting line - starts from first dot center to last dot center with padding */}
          <div
            className="absolute left-1/2 w-[2px] -translate-x-1/2 bg-gray-200"
            style={{
              top: `calc(${(0.5 / fields.length) * 100}% - 4px)`, // 4px padding for pulse expansion
              bottom: `calc(${(0.5 / fields.length) * 100}% - 4px)`,
            }}
          />

          {/* Animated blue line that grows with scroll with padding */}
          <motion.div
            className="absolute left-1/2 w-[2px] -translate-x-1/2"
            animate={{
              height:
                activeIndex >= 0
                  ? `calc(${((activeIndex + 0.5) / fields.length) * 100}% - ${
                      (0.5 / fields.length) * 100
                    }% + 8px)`
                  : "0%",
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            style={{
              top: `calc(${(0.5 / fields.length) * 100}% - 4px)`, // Start 4px earlier
              backgroundColor: "#3b82f6",
            }}
          />

          {/* Timeline dots */}
          {fields.map((_, index) => {
            const isActive = index <= activeIndex;
            const isCurrent = index === activeIndex;

            return (
              <div
                key={index}
                className="relative flex items-center justify-center"
                style={{ flex: "1 1 0px", minHeight: "40px" }}
              >
                <motion.div
                  className={`w-3 h-3 rounded-full border-2 z-10 ${
                    isActive
                      ? "bg-[#3b82f6] border-[#3b82f6]"
                      : "bg-white border-gray-300"
                  }`}
                  animate={{
                    scale: isCurrent ? [1, 1.3, 1] : 1,
                    boxShadow: isCurrent
                      ? [
                          "0 0 0 0 rgba(59, 130, 246, 0)",
                          "0 0 0 8px rgba(59, 130, 246, 0.2)",
                          "0 0 0 0 rgba(59, 130, 246, 0)",
                        ]
                      : "0 0 0 0 rgba(59, 130, 246, 0)",
                  }}
                  transition={{
                    scale: {
                      duration: 0.6,
                      repeat: isCurrent ? Infinity : 0,
                      repeatType: "loop",
                    },
                    boxShadow: {
                      duration: 1.5,
                      repeat: isCurrent ? Infinity : 0,
                      repeatType: "loop",
                    },
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Cards column */}
        <div className="flex-1 flex flex-col gap-4">
          {fields.map((field, index) => (
            <DataFieldCard
              key={field.key}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              label={field.label}
              value={String(item[field.key as keyof typeof item])}
              description={field.description}
              unit={field.unit}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
