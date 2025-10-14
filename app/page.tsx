"use client";

import { useAuth } from "@/components/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import client from "@/app/api/client";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import DataFlowPipeline from "@/components/data-flow";

export default function WelcomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { setOpen, isMobile, setOpenMobile } = useSidebar();
  const [showTooltip, setShowTooltip] = useState(false);
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

  const handleIconClick = () => {
    if (!user) {
      router.push("/login");
    }
  };

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
      {/* Background pipeline — absolute and full-size of main */}
      {/* Use debug={true} if you want to visually confirm the div exists */}
      <DataFlowPipeline background cover debug={false} />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-1 h-full flex-col items-center justify-center text-center px-4">
        {/* Greeting Section */}
        <div className="flex flex-col items-center gap-3 mb-6">
          {loading || profileLoading ? (
            <div className="w-10 h-10 rounded-full animate-pulse" />
          ) : publicAvatarUrl ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-300">
              <Image
                src={publicAvatarUrl}
                alt={profile?.full_name || "Profile"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <TooltipProvider>
              <Tooltip open={showTooltip && !user}>
                <TooltipTrigger
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={handleIconClick}
                  className="cursor-pointer"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src="/images/placeholder.jpg"
                      alt="Unknown User"
                      fill
                      className="object-cover"
                    />
                  </div>
                </TooltipTrigger>
                {!user && (
                  <TooltipContent
                    side="top"
                    className="bg-white border text-sm text-gray-700 shadow-sm rounded-md px-3 py-2"
                  >
                    Your personalized experience begins once you log in.
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}

          <h1 className="text-4xl font-bold text-gray-800">
            Hello{profile?.full_name ? `, ${profile.full_name}` : ""}! Welcome
            to <span className="font-bold text-[#3B82F6]">drAIn</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-xl text-center mb-6">
            An intelligent platform designed to make learning and collaboration
            smarter, faster, and more interactive.
          </p>
        </div>

        {/* Explore Button */}
        <Button
          onClick={handleNavigateToMap}
          disabled={loading}
          size="lg"
          className="text-md bg-[#3B82F6] hover:bg-[#2563EB]"
        >
          Explore Map
        </Button>
      </div>
    </main>
  );
}
