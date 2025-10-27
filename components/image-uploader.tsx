"use client";
import React, { useState, useRef, useEffect } from "react";
import { Trash, X } from "lucide-react";
import Image from "next/image";
import { AddIcon } from "./add-icon";

interface ImageUploaderProps {
  onImageChange?: (file: File | null) => void;
  image?: File | null;
  placeholder?: string;
  disabled?: boolean;
}

export default function ImageUploader({
  onImageChange,
  image,
  placeholder = "Drag Your Files Here",
  disabled = false,
}: ImageUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  useEffect(() => {
    if (image) {
      setFileName(image.name);
      setFileUrl(URL.createObjectURL(image));
    } else {
      setFileName(null);
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [image, fileUrl]);

  const handleFile = (file: File | undefined) => {
    if (!file || disabled) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 10 MB limit.");
      return;
    }

    setError(null);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    setFileName(file.name);
    setFileUrl(URL.createObjectURL(file));
    setIsDragging(false);
    onImageChange?.(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  const handleReset = () => {
    if (disabled) return;
    setFileName(null);
    setError(null);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setFileUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageChange?.(null);
  };

  return (
    <div className="flex flex-col items-center rounded-lg w-full max-w-xs font-sans">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`w-full h-40 flex flex-col items-center justify-center border-2 rounded-lg transition-all duration-300 ease-in-out
          ${
            disabled
              ? "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"
              : isDragging
              ? "border-blue-500 bg-blue-50"
              : fileName
              ? "border-gray-200 "
              : "border-gray-300 border-dashed bg-[#f1f3ff] hover:border-blue-400 cursor-pointer"
          }
        `}
      >
        {!fileName ? (
          <div className="flex flex-col gap-3 items-center text-center p-6">
            <label
              className={`w-12 h-12 flex items-center justify-center bg-[#4b72f3] border border-[#2b3ea7] text-white rounded-full transition-colors ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600 cursor-pointer"
              }`}
            >
              <AddIcon className="w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                ref={fileInputRef}
                disabled={disabled}
              />
            </label>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">{placeholder}</span>
              <span className="text-xs text-muted-foreground ">
                Upload files with maximum 10 MB
              </span>
            </div>
            {error && (
              <span className="text-xs text-red-500 mt-2">{error}</span>
            )}
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {fileUrl && (
              <Image
                src={fileUrl}
                alt="Uploaded preview"
                fill
                className="object-cover w-full h-full rounded-md"
              />
            )}
            <div className="absolute inset-0 flex items-end justify-between p-2">
              <span className="bg-white bg-opacity-70 text-muted-foreground text-[11px] px-3 py-1.5 rounded-md max-w-[80%] truncate">
                {fileName}
              </span>
              <button
                onClick={handleReset}
                disabled={disabled}
                className={`p-1.5 text-white bg-[#f34445] border border-[#cd152b] rounded-full shadow-lg transition-colors duration-200 ${
                  disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#dc2b35]"
                }`}
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
