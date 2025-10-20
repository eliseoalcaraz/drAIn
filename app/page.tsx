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

export default function WelcomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { setOpen, isMobile, setOpenMobile } = useSidebar();
  const supabase = client;
  const [_profile, setProfile] = useState<any>(null);
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
    }, 200);
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
    <main className="relative min-h-screen overflow-hidden bg-white">
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
        hoverTrailDelay={300} // 300ms delay creates a trailing effect following the cursor
        onPathClick={(pathId) => console.log("✅ Clicked:", pathId)}
        onPathHover={(pathId) => pathId && console.log("🖱️ Hovering:", pathId)}
        debug={false}
      />

      {/* Foreground Content  */}
      <div className="relative z-10 flex flex-1 h-full flex-col items-center justify-center text-center px-4 pointer-events-none">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="relative w-32 h-32 pointer-events-auto rounded-2xl border border-[#7b7d7c]/50 p-4 overflow-hidden">
            <Image
              src="/images/logo6.png"
              alt="drAIn Logo"
              fill
              className="object-contain"
            />
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-1">
            project drain
          </h1>

          <p className="text-lg text-gray-600 max-w-xl text-center mb-3">
            The blueprint for efficient drainage system management
          </p>
        </div>

        <Button
          onClick={handleNavigateToMap}
          disabled={loading}
          size="lg"
          className="text-md bg-[#3B82F6] hover:bg-[#2563EB] pointer-events-auto"
        >
          Explore Map
        </Button>
      </div>
    </main>
  );
}
