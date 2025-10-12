"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function TeamSwitcher({
  team,
}: {
  team: {
    name: string;
    logo: React.ElementType;
    plan: string;
  };
}) {
  return (
    <SidebarMenu className="bg-[#fafafa] border border-[#dbdbdb] rounded-md p-1">
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <div className="flex flex-row gap-4">
            <div className="flex size-8 items-center justify-center rounded-lg text-primary-foreground">
              <SidebarTrigger />
            </div>
            <div className="flex flex-col gap-0.5 leading-none pt-1">
              <span className="font-semibold">{team.name}</span>
              <span className="text-xs text-muted-foreground">{team.plan}</span>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
