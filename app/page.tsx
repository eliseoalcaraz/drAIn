"use client";

import { ContributorsButton } from "@/components/contributors-button";
import { useAuth } from "@/components/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/welcome");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Home</h1>
        </div>
      </header>
      <div className="flex flex-col items-center flex-1 p-8">
        <ContributorsButton />
      </div>
    </div>
  );
}
