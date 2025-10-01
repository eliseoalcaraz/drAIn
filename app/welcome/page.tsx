"use client";

import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-gray-800">drAIn</h1>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl font-bold mb-4">Welcome to drAIn</h2>
        <p className="text-lg text-gray-600 max-w-xl mb-6">
          An intelligent platform designed to make learning and collaboration
          smarter, faster, and more interactive.
        </p>
        <button
          onClick={() => router.push("/signup")}
          className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
        >
          Get Started
        </button>
      </section>
    </main>
  );
}
