import { forwardRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface DataFieldCardProps {
  label: string;
  value: string | number;
  description?: string;
  unit?: string;
}

export const DataFieldCard = forwardRef<HTMLDivElement, DataFieldCardProps>(
  ({ label, value, description, unit }, ref) => {
    return (
      <Card ref={ref} className="overflow-hidden border-none p-0 py-3 ">
        <CardContent>
          <div className="space-y-1">
            <div className="flex flex-row items-center justify-between">
              {/* Row 1: Data Type/Label */}
              <div className="text-xs font-semibold text-muted-foreground tracking-wider">
                {label}
              </div>
              {/* Row 2: Value */}
              <div className="flex flex-row items-baseline gap-1">
                <div className="text-xl font-bold text-foreground">{value}</div>
                {unit && (
                  <span className="text-sm text-muted-foreground">{unit}</span>
                )}
              </div>
            </div>

            {/* Row 3: Description */}
            {description && (
              <div className="text-[11px] text-muted-foreground leading-relaxed">
                {description}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

DataFieldCard.displayName = "DataFieldCard";
