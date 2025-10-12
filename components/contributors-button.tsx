"use client";

import { contributors } from "@/lib/contributors-list";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useState } from "react";

export function ContributorsButton() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  return (
    <div className="relative flex w-[270px] items-end">
      <button
        onClick={handleClick}
        className={`p-1 pr-3 flex flex-1 flex-row items-center border-gray-300 gap-2 rounded-full border transition-all duration-200 cursor-pointer ${
          isExpanded ? "bg-white " : "bg-white"
        }`}
      >
        <div className="relative w-full h-14">
          {contributors.map((member, index) => (
            <div
              key={member.id}
              className="absolute"
              style={{
                left: `${index * 40}px`,
                zIndex: contributors.length - index,
              }}
            >
              <div className="relative w-14 h-14">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={`${member.name} - ${member.role}`}
                  fill
                  className="rounded-full object-cover border-4 border-white hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-row items-center">
          {isExpanded ? (
            <ChevronUp color="#8e8d92" className="mr-1" />
          ) : (
            <ChevronDown color="#8e8d92" className="mr-1" />
          )}
        </div>
      </button>

      {/* Dropdown Panel */}
      {isExpanded && (
        <div className="absolute top-full mt-2 left-0 bg-white rounded-2xl border border-gray-300 w-xs z-50 overflow-hidden">
          {/* Header with close button */}
          <div className="relative flex items-center justify-end p-2 bg-gray-100 border-b border-gray-300 ">
            <h3 className="absolute left-1/2 transform -translate-x-1/2 text-md font-medium self-center text-gray-600">
              Contributors
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Close panel"
            >
              <X size={18} />
            </button>
          </div>

          {/* Contributors Grid */}
          <div className="px-4 py-4">
            <div className="grid grid-cols-4 gap-4 mb-4">
              {contributors.map((member) => (
                <Link
                  key={member.id}
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                  <div className="relative w-14 h-14">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover transition-all duration-200"
                    />
                  </div>
                  <span className="text-xs text-gray-600 text-center truncate w-full hover:text-blue-600 transition-colors">
                    {member.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Join Button */}
            <Button
              asChild
              className="w-full bg-[#4b72f3] border border-[#2b3ea7] text-white py-6 rounded-xl font-medium text-base hover:bg-gray-800 transition-colors mb-3"
            >
              <Link
                href="https://github.com/eliseoalcaraz/pjdsc"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Repository
              </Link>
            </Button>
            {/* Footer Text */}
            <p className="text-xs text-gray-500 text-center">
              Source code available on GitHub
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
