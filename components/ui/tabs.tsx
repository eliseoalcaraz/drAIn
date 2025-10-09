"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-start gap-0 text-muted-foreground border-b border-gray-200 w-full bg-gray-50/50",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 relative outline-none flex-1",
      "bg-[#f7f7f7] text-gray-500",
      "data-[state=active]:bg-white data-[state=active]:text-gray-900",
      "border-t border-t-[#ced1cd] border-r border-r-[#ced1cd] border-b border-b-[#ced1cd] border-l border-l-[#ced1cd]",
      "first:border-l-0 last:border-r-0 [&:not(:first-child):not(:last-child)]:border-r-0 [&:not(:first-child):not(:last-child)]:border-l-0",
      "data-[state=active]:border-t-[#3F83DB] data-[state=active]:border-t-[3px] data-[state=active]:border-b-0",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
