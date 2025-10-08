"use client";

import { CheckCircle2 } from "lucide-react";

interface ProfileProgressProps {
  current: number;
  total: number;
  percentage?: number;
}

export function ProfileProgress({
  current,
  total,
  percentage,
}: ProfileProgressProps) {
  const calculatedPercentage =
    percentage ?? Math.round((current / total) * 100);

  return (
    <div className="flex flex-1 items-center gap-2 px-3 py-1.5 bg-white border border-[#DCDCDC] rounded-full">
      {/* Check icon */}
      <CheckCircle2 className="w-4 h-4 text-[#8D8D8D]" />

      {/* Progress text */}
      <span className="text-sm text-[#666666] font-medium">
        {current} of {total}
      </span>

      {/* Progress bar */}
      <div className="relative w-20 h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#4ADE80] to-[#22C55E] rounded-full transition-all duration-300"
          style={{ width: `${calculatedPercentage}%` }}
        />
      </div>

      {/* Percentage text */}
      <span className="text-sm text-[#666666] font-medium">
        {calculatedPercentage}%
      </span>
    </div>
  );
}
