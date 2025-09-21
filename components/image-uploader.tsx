"use client";
import React, { useState, useRef } from "react";

export default function ImageUploader() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (file && file.type.startsWith("image/")) {
      // Clean up previous URL to prevent memory leaks
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
      setFileName(file.name);
      setFileUrl(URL.createObjectURL(file));
      setIsDragging(false);
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
      URL.revokeObjectURL(fileUrl); // cleanup memory
    }
    setFileUrl(null);
    // Reset file input to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const UploadCloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 mb-2 transition-colors ${isDragging ? "text-blue-500" : "text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a5 5 0 0 1 0 10h-2.5" />
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
    </svg>
  );

  const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg w-full max-w-xs font-sans">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`w-full h-32 flex flex-col items-center justify-center border-2 rounded-2xl transition-all duration-300 ease-in-out
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : fileName
              ? "border-gray-200"
              : "border-gray-300 border-dashed hover:border-blue-400 cursor-pointer"
          }
        `}
      >
        {!fileName ? (
          <div className="flex flex-col items-center text-center p-3">
            <UploadCloudIcon />
            <p className={`text-sm font-medium transition-colors ${isDragging ? "text-blue-600" : "text-gray-600"}`}>
              Drag & Drop your image here
            </p>
            <p className="text-gray-400 text-xs mt-1 mb-2">or</p>
            <label className="px-4 py-1 text-white bg-blue-500 rounded-lg shadow-md cursor-pointer hover:bg-blue-600 transition-colors duration-200">
              Browse Files
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                ref={fileInputRef}
              />
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-32 h-32 relative rounded-xl overflow-hidden shadow-lg">
              <img src={fileUrl || ""} alt="Uploaded preview" className="object-cover w-full h-full" />
              <button
                onClick={handleReset}
                className="absolute top-1 right-1 p-1 text-white bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200"
              >
                <XCircleIcon />
              </button>
            </div>
          </div>
        )}
      </div>

      {fileName && (
        <div className="flex items-center justify-between w-full mt-3 p-2 bg-gray-50 rounded-lg">
          <a
            href={fileUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-xs font-medium truncate hover:text-blue-800 transition-colors"
          >
            {fileName}
          </a>
        </div>
      )}
    </div>
  );
}
