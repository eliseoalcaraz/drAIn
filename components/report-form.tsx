"use client";

import { useState } from "react";
import ImageUploader from "./image-uploader";

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
          Upload Image
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

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Submit Report
      </button>
    </form>
  );
}
