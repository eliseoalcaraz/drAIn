"use client";

import { useAuth } from "@/components/context/AuthProvider";
import { useRouter } from "next/navigation";
import { UserCircle2 } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WelcomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { setOpen, isMobile, setOpenMobile } = useSidebar();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleIconClick = () => {
    if (!user) {
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Greeting Section */}
      <div className="flex flex-col items-center gap-3 mb-4">
        {loading ? (
          <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
        ) : user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name || "Profile"}
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <TooltipProvider>
            <Tooltip open={showTooltip && !user}>
              <TooltipTrigger
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={handleIconClick}
                className="cursor-pointer"
              >
                <UserCircle2 className="w-10 h-10 text-gray-600 hover:text-gray-800 transition" />
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
          Hello{user?.name ? `, ${user.name}` : ""}! Welcome to{" "}
          <span className="font-bold text-green-600">drAIn</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-xl text-center mb-6">
          An intelligent platform designed to make learning and collaboration
          smarter, faster, and more interactive.
        </p>
      </div>

      {/* Explore Button */}
      <button
        onClick={() => {
          // Close sidebar for smooth transition
          if (isMobile) {
            setOpenMobile(false);
          } else {
            setOpen(false);
          }
          // Navigate to map
          router.push("/map");
        }}
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
      >
        Go to Map
      </button>
    </main>
  );
}
