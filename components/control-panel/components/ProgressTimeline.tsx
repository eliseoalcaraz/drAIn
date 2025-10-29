import { motion } from "framer-motion";

interface ProgressTimelineProps {
  fieldCount: number;
  activeIndex: number;
}

export function ProgressTimeline({
  fieldCount,
  activeIndex,
}: ProgressTimelineProps) {
  return (
    <div className="flex flex-col gap-4 relative" style={{ minWidth: "20px" }}>
      {/* Background vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gray-200" />

      {/* Animated progress line */}
      <motion.div
        className="absolute left-1/2 top-0 w-[2px] -translate-x-1/2 origin-top"
        initial={{ height: "0%" }}
        animate={{
          height: activeIndex >= 0
            ? `calc(${((activeIndex + 0.5) / fieldCount) * 100}%)`
            : "0%",
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        style={{
          backgroundColor: "#3b82f6",
        }}
      />

      {Array.from({ length: fieldCount }).map((_, index) => {
        const isActive = index <= activeIndex;
        const isCurrent = index === activeIndex;

        return (
          <div
            key={index}
            className="relative flex items-center justify-center flex-shrink-0"
            style={{
              minHeight: "64px", // Approximate card height
              flex: "1 1 auto",
            }}
          >
            {/* Dot */}
            <motion.div
              className={`w-3 h-3 rounded-full border-2 z-10 relative ${
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
  );
}
