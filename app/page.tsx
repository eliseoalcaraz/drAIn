"use client";

import { Header } from "@/components/main-header";
import { ContributorsButton } from "@/components/contributors-button";
import { useAuth } from "@/components/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <ContributorsButton />
    </div>
  );
}
