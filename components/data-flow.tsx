// components/DataFlowPipeline.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

type Props = {
  /** render as absolutely-positioned background filling its parent */
  background?: boolean;
  /** when true -> preserveAspectRatio = 'xMidYMid slice' (cover); else 'meet' (fit) */
  cover?: boolean;
  /** debug visual background to confirm element exists (remove in prod) */
  debug?: boolean;
  className?: string;
};

export default function DataFlowPipeline({
  background = false,
  cover = true,
  debug = false,
  className = "",
}: Props) {
  const preserve = cover ? "xMidYMid slice" : "xMidYMid meet";

  // Outer wrapper: if used as background, make it absolute inset-0 and full size of parent.
  const outerClasses = background
    ? `absolute inset-0 w-full h-full ${className}`
    : `relative w-full ${className}`;

  // debugBg helps you see the element while debugging — set debug={true} to show.
  const debugBg = debug ? "bg-red-200" : "";

  return (
    <div
      className={`${outerClasses} ${debugBg} overflow-hidden pointer-events-none`}
    >
      {/* Make inner container full size so svg 100%/100% works */}
      <div className="w-full h-full">
        <svg
          className="w-full h-full block"
          viewBox="0 0 1920 1080"
          preserveAspectRatio={preserve}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          <defs>
            <filter
              id="innerShadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
              <feOffset in="blur" dx="0" dy="0" result="offsetBlur" />
              <feFlood floodColor="#000000" floodOpacity="0.3" result="color" />
              <feComposite
                in="color"
                in2="offsetBlur"
                operator="in"
                result="shadow"
              />
              <feComposite
                in="shadow"
                in2="SourceAlpha"
                operator="in"
                result="innerShadow"
              />
            </filter>
          </defs>

          {/* base gray pipe */}
          <motion.path
            d="M 968.6944 466.7309 L 968.6944 227.6736 Q 968.6944 170.7552 1025.6128 170.7552 L 1745.3472 171.0016 Q 1802.0192 170.7552 1802.0192 227.4272 L 1802.0192 443.52 Q 1802.0192 500.192 1858.6912 500.192 L 2042.5056 500.192 Q 2099.1776 500.192 2099.1776 556.864 L 2107.0624 1213.2736 L 1265.36 1213.2736 L 1265.36 1023 Q 1265.36 967 1208.688 967 L 171 967 Q 114.9184 967 114.9184 911 L 114.9184 341.5104 Q 114.9184 284.592 171.8368 284.592 L 464 285 Q 520 285 520 229 L 522 0"
            fill="none"
            stroke="#d1d5db"
            strokeWidth="20"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />

          {/* blue flowing stroke */}
          <motion.path
            d="M 968.6944 466.7309 L 968.6944 227.6736 Q 968.6944 170.7552 1025.6128 170.7552 L 1745.3472 171.0016 Q 1802.0192 170.7552 1802.0192 227.4272 L 1802.0192 443.52 Q 1802.0192 500.192 1858.6912 500.192 L 2042.5056 500.192 Q 2099.1776 500.192 2099.1776 556.864 L 2107.0624 1213.2736 L 1265.36 1213.2736 L 1265.36 1023 Q 1265.36 967 1208.688 967 L 171 967 Q 114.9184 967 114.9184 911 L 114.9184 341.5104 Q 114.9184 284.592 171.8368 284.592 L 464 285 Q 520 285 520 229 L 522 0"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="18"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 8, ease: "linear" }}
          />
        </svg>
      </div>
    </div>
  );
}
