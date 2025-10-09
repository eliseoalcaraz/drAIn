"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Spinner } from "@/components/ui/spinner";

export interface ProfileStep {
  title: string;
  description?: string;
  completed: boolean;
}

interface ProfileProgressProps {
  current: number;
  total: number;
  percentage?: number;
  steps?: ProfileStep[];
}

export function ProfileProgress({
  current,
  total,
  percentage,
  steps,
}: ProfileProgressProps) {
  const [isOpen, setIsOpen] = useState(false);
  const calculatedPercentage =
    percentage ?? Math.round((current / total) * 100);
  const hasSteps = steps && steps.length > 0;

  const progressBar = (
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

  if (!hasSteps) {
    return progressBar;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex-1 relative">
      <CollapsibleTrigger asChild>
        <div className="cursor-pointer">{progressBar}</div>
      </CollapsibleTrigger>
      <CollapsibleContent className="absolute top-full left-0 right-0 mt-2 z-50">
        <div className="bg-white border border-[#DCDCDC] rounded-lg p-3 space-y-2 shadow-lg">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="mt-0.5">
                {step.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                ) : (
                  <Spinner className="w-4 h-4 text-[#8D8D8D]" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    step.completed ? "text-[#22C55E]" : "text-[#666666]"
                  }`}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-[#8D8D8D] mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
