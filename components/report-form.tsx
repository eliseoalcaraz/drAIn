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
import { ComboboxForm } from "./combobox-form";
import { Field, FieldLabel, FieldContent } from "./ui/field";
import { Textarea } from "./ui/textarea";
import { CardDescription, CardHeader, CardTitle } from "./ui/card";

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

  const handleCategory = (value: string) => {
    setCategory(value);

    if (value === "inlets") {
      setCategoryLabel("Inlet");
    } else if (value === "storm_drains") {
      setCategoryLabel("Storm Drain");
    } else if (value === "man_pipes") {
      setCategoryLabel("Manduae Pipe");
    } else if (value === "outlets") {
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

  const handleCancel = () => {
    setDescription("");
    setImage(null);
    setCategory("");
    setCategoryLabel("");
    setCategoryData([]);
    setCategoryIndex(0);
  };

  return (
    <>
      <form
        onSubmit={handlePreSubmit}
        className="w-full h-full gap-0 p-5 bg-white rounded-xl space-y-4"
      >
        <CardHeader className="py-0 px-1 mb-3">
          <CardTitle>Report an issue</CardTitle>
          <CardDescription className="text-xs">
            Pick which category to submit a report in
          </CardDescription>
        </CardHeader>

        {/* Category Combobox */}
        <div className="flex flex-col w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1"></label>
          <ComboboxForm onSelect={handleCategory} value={category} />
        </div>

        {/* The ImageUploader component itself must be updated to remove 'max-w-xs'
            so it can inherit the full 'w-full' width here. */}
        <div className="w-full">
          <ImageUploader onImageChange={setImage} />
        </div>

        {/* Description Input */}
        <Field>
          <FieldContent>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={4}
            />
          </FieldContent>
        </Field>

        <div className="flex gap-3 min-w-0">
          <Button
            type="button"
            onClick={handleCancel}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!category.trim() || !description.trim() || !image}
            className="flex-1"
          >
            Submit
          </Button>
        </div>
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
