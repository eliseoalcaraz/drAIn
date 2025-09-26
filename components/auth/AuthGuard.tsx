"use client";

import { useAuth } from "@/components/context/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/login" && pathname !== "/signup") {
        router.replace("/login");
      } else {
        setChecked(true);
      }
    }
  }, [user, loading, pathname, router]);

  if (loading || !checked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
