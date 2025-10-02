"use client";

import { useAuth } from "@/components/context/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = ["/login", "/signup", "/welcome", "/map"].includes(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.replace("/welcome");
    }
  }, [user, loading, pathname, isPublic, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user && !isPublic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting...</p>
      </div>
    );
  }

  return <>{children}</>;
}
