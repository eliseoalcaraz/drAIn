"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Map } from "lucide-react";
import { IconArticleFilled } from "@tabler/icons-react";
import { HomeIcon, MapIcon, BookOpenIcon } from "@heroicons/react/24/solid";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuth } from "@/components/context/AuthProvider";
import client from "@/app/api/client";

// This is the data structure for the sidebar
const data = {
  team: {
    name: "Project Drain",
    logo: Map,
    plan: "Drainage Monitoring System",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: HomeIcon,
      items: [
        { title: "Welcome", url: "/" },
        { title: "Overlays", url: "/map?activetab=overlays" },
        { title: "Inventory", url: "/map?activetab=stats" },
        { title: "Report", url: "/map?activetab=report" },
        { title: "Profile", url: "/map?activetab=profile" },
      ],
    },
    {
      title: "Map",
      url: "/map",
      icon: MapIcon,
      items: [
        { title: "Simulation", url: "/simulation?active=true" },
        { title: "View", url: "/map" },
      ],
    },
    {
      title: "Documentation",
      url: "/docs",
      icon: BookOpenIcon,
      items: [
        { title: "Introduction", url: "/docs/introduction" },
        { title: "Tutorials", url: "/docs/tutorials" },
        { title: "Changelog", url: "/docs/changelog" },
      ],
    },
    {
      title: "About",
      url: "/about",
      icon: IconArticleFilled,
      items: [
        { title: "Project", url: "/about/project" },
        { title: "Creators", url: "/about/creators" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await client.auth.signOut();
    router.push("/login");
  };

  const userData = user
    ? {
        name: user.email?.split("@")[0] || "User",
        email: user.email || "No email",
        avatar: undefined,
      }
    : {
        name: "Guest",
        email: "Not logged in",
        avatar: undefined,
      };

  return (
    <Sidebar className="border" collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <TeamSwitcher team={data.team} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <NavUser user={userData} onLogout={handleLogout} />
      </SidebarFooter>
    </Sidebar>
  );
}
