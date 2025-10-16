"use client";

import { useAuth } from "@/components/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import client from "@/app/api/client";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import DataFlowPipeline from "@/components/data-flow";
import { StoryRingAvatar } from "@/components/story-ring";

export default function WelcomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { setOpen, isMobile, setOpenMobile } = useSidebar();
  const supabase = client;
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [publicAvatarUrl, setPublicAvatarUrl] = useState<string | null>(null);
  const [isNavigatingToMap, setIsNavigatingToMap] = useState(false);

  useEffect(() => {
    if (user) {
      const cacheKey = `profile-${user.id}`;
      const cachedProfile = localStorage.getItem(cacheKey);

      if (cachedProfile) {
        const { profile: cachedData, publicAvatarUrl: cachedAvatarUrl } =
          JSON.parse(cachedProfile);
        setProfile(cachedData);
        setPublicAvatarUrl(cachedAvatarUrl);
        setProfileLoading(false);
      } else {
        const fetchProfile = async () => {
          setProfileLoading(true);
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
          setProfileLoading(false);
        };
        fetchProfile();
      }
    } else {
      setProfileLoading(false);
    }
  }, [user, supabase]);

  const handleNavigateToMap = () => {
    // Close sidebar for smooth transition
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }

    // Show loading UI
    setIsNavigatingToMap(true);

    // Small delay to ensure loading UI renders before heavy navigation
    setTimeout(() => {
      router.push("/map");
    }, 100);
  };

  // If navigating to map, show loading screen
  if (isNavigatingToMap) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 animate-in fade-in duration-300">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-8 text-[#3F83DB]" />
          <p className="text-lg font-medium text-gray-700">Loading Map...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gray-50">
      {/* Background pipeline with map SVG — absolute and full-size of main */}
      {/* Adjust mapOpacity (0-1) to control background visibility */}
      {/* enableHover makes map paths interactive - entire shape area is hoverable, fills with color on hover */}
      <DataFlowPipeline
        background
        cover
        showMap
        mapOpacity={1}
        enableHover={true}
        hoverColor="#3b82f6"
        fillOnHover={true} // Makes entire shape area hoverable, not just thin border
        fillOpacity={0.2} // 20% opacity on hover fill
        onPathClick={(pathId) => console.log('✅ Clicked:', pathId)}
        onPathHover={(pathId) => pathId && console.log('🖱️ Hovering:', pathId)}
        debug={false}
      />
    </main>
  );
}
