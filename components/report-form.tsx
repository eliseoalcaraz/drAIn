"use client";

import { useState } from "react";
import ImageUploader from "./image-uploader";
import { Button } from "./ui/button";

export default function ReportForm() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      category,
      description,
      image,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full mx-auto p-6 bg-white rounded-xl shadow space-y-4"
    >
      {/* Image Uploader */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Image to Report
        </label>
        <ImageUploader />
      </div>

      {/* Category Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Enter category"
        />
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Enter description"
          rows={4}
        />
      </div>

      <Button className="w-full bg-[#4b72f3] border border-[#2b3ea7] text-white py-6 rounded-xl font-medium text-base hover:bg-blue-600 transition-colors">
          Submit
      </Button>
    </form>
  );
}
