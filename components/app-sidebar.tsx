"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Home, Map, BookOpen, Info } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
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
      icon: Home,
      items: [
        { title: "Overlays", url: "/map" },
        { title: "Inventory", url: "/map" },
        { title: "Report", url: "/map" },
      ],
    },
    {
      title: "Map",
      url: "/map",
      icon: Map,
      items: [
        { title: "Simulation", url: "/simulation" },
        { title: "View", url: "/map" },
      ],
    },
    {
      title: "Documentation",
      url: "/docs",
      icon: BookOpen,
      items: [
        { title: "Introduction", url: "/docs/introduction" },
        { title: "Tutorials", url: "/docs/tutorials" },
        { title: "Changelog", url: "/docs/changelog" },
      ],
    },
    {
      title: "About",
      url: "/about",
      icon: Info,
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <TeamSwitcher team={data.team} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} onLogout={handleLogout} />
      </SidebarFooter>
    </Sidebar>
  );
}
