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
import { useState, useEffect } from "react";

import NotificationBell from "@/components/report-notif";

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
      items: [{ title: "Project", url: "/about/project" }],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = client;
  const [profile, setProfile] = useState<any>(null);
  const [publicAvatarUrl, setPublicAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const cacheKey = `profile-${user.id}`;
      const cachedProfile = localStorage.getItem(cacheKey);

      if (cachedProfile) {
        const { profile: cachedData, publicAvatarUrl: cachedAvatarUrl } =
          JSON.parse(cachedProfile);
        setProfile(cachedData);
        setPublicAvatarUrl(cachedAvatarUrl);
      } else {
        const fetchProfile = async () => {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error && error.code !== "PGRST116") {
            console.error("Error fetching profile:", error);
          } else if (data) {
            const avatarUrl = data.avatar_url;
            setProfile(data);
            setPublicAvatarUrl(avatarUrl);
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ profile: data, publicAvatarUrl: avatarUrl })
            );
          }
        };
        fetchProfile();
      }
    }
  }, [user, supabase]);

  const handleLogout = async () => {
    await client.auth.signOut();
    router.push("/");
  };

  const userData = user
    ? {
        name: profile?.full_name || user.email?.split("@")[0] || "User",
        email: user.email || "No email",
        avatar: publicAvatarUrl || undefined,
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
      <div className="border-t px-3 py-2 flex justify-center">
        <NotificationBell />
      </div>
      <SidebarFooter className="border-t">
        <NavUser user={userData} onLogout={handleLogout} />
      </SidebarFooter>
    </Sidebar>
  );
}
