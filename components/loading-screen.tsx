"use client";

import type React from "react";

import { useEffect, useState } from "react";

interface LoadingScreenProps {
  title?: string;
  messages?: string[];
  iconContent?: React.ReactNode;
  isLoading?: boolean;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export function LoadingScreen({
  title = "Preparing your plan",
  messages = [
    "Setting up your nutrition plan and analyzing your goals...",
    "Calculating your personalized recommendations...",
    "Optimizing your meal schedule...",
    "Finalizing your custom plan...",
  ],
  iconContent,
  isLoading = true,
  position = "bottom-right",
}: LoadingScreenProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [messages.length]);

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  if (!isLoading) return null;

  return (
    <div
      className={`fixed z-50 ${positionClasses[position]} transition-all duration-300`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/50 px-5 py-4 shadow-2xl backdrop-blur-md">
        <div className="relative flex-shrink-0">
          <div className="h-12 w-12 animate-spin">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-white/20"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="70 212"
                className="text-emerald-500"
                style={{
                  transformOrigin: "center",
                  transform: "rotate(-90deg)",
                }}
              />
            </svg>
          </div>

          <div className="absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
            {iconContent || (
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-sm font-semibold text-white">{title}</h3>

          <div className="relative h-5 overflow-hidden">
            {messages.map((message, index) => (
              <p
                key={index}
                className={`absolute left-0 right-0 text-xs text-gray-300 transition-all duration-500 ${
                  index === currentMessageIndex
                    ? "translate-y-0 opacity-100"
                    : index < currentMessageIndex
                    ? "-translate-y-full opacity-0"
                    : "translate-y-full opacity-0"
                }`}
              >
                {message}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
