"use client";

import { useAuth } from "@/components/context/AuthProvider";
import { useState, useEffect } from "react";
import client from "@/app/api/client";
import DataFlowPipeline from "@/components/data-flow";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePageTransition } from "@/hooks/usePageTransition";

export default function WelcomePage() {
  const { user } = useAuth();
  const { navigateTo, isNavigating } = usePageTransition();
  const supabase = client;
  const [_profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [_profileLoading, setProfileLoading] = useState(true);
  const [_publicAvatarUrl, setPublicAvatarUrl] = useState<string | null>(null);

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
    navigateTo("/map");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#e8e8e8]/50">
      {/* Background pipeline with map SVG — absolute and full-size of main */}
      {/* Adjust mapOpacity (0-1) to control background visibility */}
      {/* enableHover makes map paths interactive - entire shape area is hoverable, fills with color on hover */}
      {/* <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(to left, #ffffff 40%, #c0ecff 100%)",
        }}
      /> */}

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
        onPathClick={(pathId) => { /* console.log("✅ Clicked:", pathId) */ }}
        onPathHover={(pathId) => pathId && { /* console.log("🖱️ Hovering:", pathId) */ }}
        debug={false}
      />

      {/* Foreground Content  */}
      <div className="relative z-10 flex flex-1 h-full flex-col items-center justify-center text-center px-4 pointer-events-none">
        <div className="flex flex-col max-w-3xl gap-20">
          <h1 className="text-5xl font-bold text-[#34332e] leading-2 flex flex-wrap items-center justify-center gap-4 font-[family-name:var(--font-century-gothic)]">
            <span>a blueprint</span>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={80}
              height={60}
              className="pointer-events-auto rotate-0 mb-1 transition-transform duration-300 hover:rotate-12 animate-rotate-in"
            />
            <span>for efficient</span>
            <span className="text-shine">drainage management system</span>
          </h1>

          <div>
            <Button
              size="lg"
              className="text-md bg-[#3B82F6] hover:bg-[#2563EB] pointer-events-auto"
              onClick={handleNavigateToMap}
              disabled={isNavigating}
            >
              Explore Map
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
