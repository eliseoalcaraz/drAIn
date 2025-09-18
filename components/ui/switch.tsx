"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: {
    root: "h-4 w-7",
    thumb: "size-3",
  },
  md: {
    root: "h-5 w-9",
    thumb: "size-4",
  },
  lg: {
    root: "h-8.5 w-15",
    thumb: "size-5",
  },
};

function Switch({ className, size = "md", ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-[#3F83DB] data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        sizes[size].root,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
          sizes[size].thumb
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
