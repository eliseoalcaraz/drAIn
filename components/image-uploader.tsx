"use client";
import React, { useState, useRef } from "react";
import { Image as IconImage } from "lucide-react";
import Image from "next/image";
import { AddIcon } from "./add-icon";

interface ImageUploaderProps {
  onImageChange?: (file: File | null) => void;
}

export default function ImageUploader({ onImageChange }: ImageUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (file && file.type.startsWith("image/")) {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
      setFileName(file.name);
      setFileUrl(URL.createObjectURL(file));
      setIsDragging(false);
      onImageChange?.(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  const handleReset = () => {
    setFileName(null);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setFileUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageChange?.(null);
  };

  const XCircleIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );

  return (
    <div className="flex flex-col items-center p-1 rounded-lg w-full max-w-xs font-sans">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`w-full h-40 flex flex-col items-center justify-center border-2 rounded-lg transition-all duration-300 ease-in-out
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : fileName
              ? "border-gray-200 "
              : "border-gray-300 border-dashed bg-[#f1f3ff] hover:border-blue-400 cursor-pointer"
          }
        `}
      >
        {!fileName ? (
          <div className="flex flex-col gap-3 items-center text-center p-6">
            {/* MODIFIED LABEL CLASSNAME: */}
            <label className="w-12 h-12 flex items-center justify-center bg-[#4b72f3] border border-[#2b3ea7] text-white rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
              <AddIcon className="w-5 h-5" /> {/* icon inside the circle */}
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                ref={fileInputRef}
              />
            </label>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Drag Your Files Here</span>
              <span className="text-xs text-muted-foreground ">
                Upload files with maximum 20mb
              </span>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {fileUrl && (
              <Image
                src={fileUrl}
                alt="Uploaded preview"
                fill
                className="object-cover w-full h-full rounded-xl"
              />
            )}
            <div className="absolute inset-0 flex items-end justify-between p-2">
              <span className="bg-white bg-opacity-70 text-gray-800 text-xs font-medium px-2 py-1 rounded-lg max-w-[80%] truncate">
                {fileName}
              </span>
              <button
                onClick={handleReset}
                className="p-1 text-white bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200"
              >
                <XCircleIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
