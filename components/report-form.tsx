"use client";

import { useState } from "react";
import ImageUploader from "./image-uploader";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";

export default function ReportForm() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    console.log({
      category,
      description,
      image,
    });
    setIsModalOpen(false);
    setTermsAccepted(false);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setTermsAccepted(false);
  };

  return (
    <>
      <form
        onSubmit={handleOpenModal}
        className="w-full h-full p-2.5 bg-white rounded-xl space-y-4"
      >
      {/* Image Uploader */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Image to Report
        </label>
        {/* The ImageUploader component itself must be updated to remove 'max-w-xs'
            so it can inherit the full 'w-full' width here. */}
        <div className="w-full">
          <ImageUploader onImageChange={setImage} />
        </div>
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

        <Button
          disabled={!category.trim() || !description.trim() || !image}
          className="w-full bg-[#4b72f3] border border-[#2b3ea7] text-white py-6 rounded-xl font-medium text-base hover:bg-blue-600 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </Button>
      </form>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Report Submission</DialogTitle>
            <DialogDescription>
              Please review your report details before submitting
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Category Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50">
                {category || <span className="text-gray-400">No category entered</span>}
              </div>
            </div>

            {/* Description Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 min-h-[100px]">
                {description || <span className="text-gray-400">No description entered</span>}
              </div>
            </div>

            {/* Image Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50">
                {image ? (
                  <span className="text-green-600">Image attached</span>
                ) : (
                  <span className="text-gray-400">No image uploaded</span>
                )}
              </div>
            </div>

            {/* Terms Acceptance Checkbox */}
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-relaxed cursor-pointer"
              >
                I accept the terms and conditions and confirm that the information provided is accurate
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelModal}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSubmit}
              disabled={!termsAccepted}
              className="w-full sm:w-auto bg-[#4b72f3] border border-[#2b3ea7] text-white hover:bg-blue-600"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
