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
import { uploadReport } from "@/lib/supabase/report";
import { extractExifLocation } from "@/lib/report/extractEXIF";
import { getClosestPipes } from "@/lib/report/getClosestPipe";

interface CategoryData {
  name: string;
  lat: number;
  long: number;
  distance: number;
}

export default function ReportForm() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [categoryLabel, setCategoryLabel] = useState("");
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [category, setCategory] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [errorCode, setErrorCode] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategory(value);

    if (value === "inlet") {
      setCategoryLabel("Inlet");
    } else if (value === "storm_drain") {
      setCategoryLabel("Storm Drain");
    } else if (value === "man_pipe") {
      setCategoryLabel("Manduae Pipe");
    } else if (value === "outlet") {
      setCategoryLabel("Outlet");
    }
  };

  const handlePreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      setIsErrorModalOpen(true);
      setErrorCode("No valid image");
    } else {
      // const location = await extractExifLocation(image);

      // if (!location.latitude || !location.longitude) {
      //     setIsErrorModalOpen(true);
      //     setErrorCode("No GPS data found in image");
      //     return;
      // }
      const location = {
        latitude: 10.328531541760796,
        longitude: 123.924274242405161,
      };

      try {
        const Pipedata = await getClosestPipes(
          { lat: location.latitude, lon: location.longitude },
          category
        );
        console.log("Closest Pipes:", Pipedata);
        setCategoryData(Pipedata);
        setIsModalOpen(true);
        return;
      } catch (error) {
        setIsErrorModalOpen(true);
        setErrorCode(String(error));
        return;
      }
    }
  };

  const handleConfirmSubmit = async () => {
    const long = categoryData[categoryIndex].long;
    const lat = categoryData[categoryIndex].lat;
    const component_id = categoryData[categoryIndex].name;
    await uploadReport(image!, category, description, component_id, long, lat);

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
        onSubmit={handlePreSubmit}
        className="w-full h-full p-2.5 bg-white rounded-xl space-y-4"
      >
        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={handleCategory}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Please select a category</option>
            <option value="inlet">Inlet</option>
            <option value="Storm_drain">Storm Drain</option>
            <option value="man_pipe">Mandaue Pipe</option>
            <option value="outlet">Outlet</option>
          </select>
        </div>

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
                {categoryLabel}
              </div>
            </div>

            {/*  Category ID  Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category ID
              </label>
              <select
                value={categoryIndex}
                onChange={(e) => setCategoryIndex(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="">Please select the correct ID</option>

                {categoryData.map((pipe, index) => (
                  <option key={index} value={index}>
                    {pipe.name} - {pipe.distance?.toFixed(0)}m away
                    {index === 0 && " (Best Match)"}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 min-h-[100px]">
                {description || (
                  <span className="text-gray-400">No description entered</span>
                )}
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
                onCheckedChange={(checked) =>
                  setTermsAccepted(checked as boolean)
                }
              />
              <label
                htmlFor="terms"
                className="text-sm leading-relaxed cursor-pointer"
              >
                I accept the terms and conditions and confirm that the
                information provided is accurate
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
              disabled={!termsAccepted && !categoryIndex}
              className="w-full sm:w-auto bg-[#4b72f3] border border-[#2b3ea7] text-white hover:bg-blue-600"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Error</DialogTitle>
            <DialogDescription>
              {errorCode || "An unexpected error occurred."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsErrorModalOpen(false)}
              className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Go Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
