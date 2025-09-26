"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthProvider";
import client from "@/api/client";

export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await client.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
        <div className="w-72 items-center text-xl font-semibold">
          <Link href={"/"}>pjdsc</Link>
        </div>

        <div className="flex gap-10 font-medium">
          <Link href={"/map"} className="hover:text-primary transition-colors">
            Map
          </Link>
          <Link
            href={"/timeline"}
            className="hover:text-primary transition-colors"
          >
            Timeline
          </Link>
          <Link
            href={"/about"}
            className="hover:text-primary transition-colors"
          >
            About
          </Link>
        </div>

        <div className="w-72 flex justify-end">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Log out
            </button>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
