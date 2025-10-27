"use client";

import { useState, useEffect } from "react";
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
import { useAuth } from "@/components/context/AuthProvider";
import { ComboboxForm } from "./combobox-form";
import { Field, FieldContent } from "./ui/field";
import { Textarea } from "./ui/textarea";
import { CardDescription, CardHeader, CardTitle } from "./ui/card";
import { SpinnerEmpty } from "./spinner-empty";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { clear } from "console";
import { set } from "zod";
import { Combobox, ComboboxOption } from "./ui/combobox";
import client from "@/app/api/client";

interface CategoryData {
  name: string;
  lat: number;
  long: number;
  distance?: number;
}

export default function SubmitTab() {
  const { user, profile } = useAuth();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [manualAccepted, setManualAccepted] = useState(false);
  const [categoryLabel, setCategoryLabel] = useState("");
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [comboOption, setComboOptions] = useState<ComboboxOption[]>([]);
  const [category, setCategory] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(-1);
  const [errorCode, setErrorCode] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isManual, setIsManual] = useState(false);
  
  const isDisabled = isManual ? !manualAccepted || !termsAccepted || categoryIndex<0 : !termsAccepted || categoryIndex<0;

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

  const clearInputs = () => {
    setDescription("");
    setImage(null);
    setCategory("");
    setCategoryLabel("");
    setCategoryData([]);
    setCategoryIndex(0);
  }

  const handlePreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!image) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitting(false);
      setIsErrorModalOpen(true);
      setErrorCode("Not a valid image");
    } else {

      const location = await extractExifLocation(image);
      // const location = {
      //   latitude: 10.360832542295604,
      //   longitude: 123.927200298236968,
      // };
      //need to fix bug
      console.log("Extracted Location:", location);
      if (!location.latitude || !location.longitude) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        setIsErrorModalOpen(true);
        setErrorCode("No GPS data found in image");
        return;
      }

      //mock location for testing yes
      //const location = { latitude: 10.3263275618157, longitude: 123.925696045157 };

      try {
        const Pipedata = await getClosestPipes(
          { lat: location.latitude, lon: location.longitude },
          category
        );

        if (Pipedata.length === 0){
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setIsSubmitting(false);
          setIsErrorModalOpen(true);
          setErrorCode("No component found within your location!");
          return;
        }

        const options : ComboboxOption[]= Pipedata.map((item, index) => ({
          value: index.toString(),
          label: index === 0? item.name + "    - " + item.distance.toFixed(0) + "m away (BEST MATCH)" : item.name + "    - " + item.distance.toFixed(0) + "m away"
        }));
        setComboOptions(options);

        console.log("Closest Pipes:", Pipedata);
        setCategoryData(Pipedata);
        setIsModalOpen(true);
        setIsSubmitting(false);
        return;
      } catch (error) {
        setIsErrorModalOpen(true);
        setErrorCode(String(error));
        setIsSubmitting(false);
        return;
      }
    }
  };

  const handleConfirmSubmit = async () => {
    const userID = user?.id ?? null;
    const profileName = profile?.full_name ?? "Anonymous";

    const long = categoryData[categoryIndex].long;
    const lat = categoryData[categoryIndex].lat;
    const component_id = categoryData[categoryIndex].name;
    await uploadReport(
      image!,
      category,
      description,
      component_id,
      long,
      lat,
      userID,
      profileName
    );

    setIsModalOpen(false);
    setTermsAccepted(false);
    clearInputs();
  };

  const handleManual = async () => {
    const { data, error } = await client.rpc('get_component_by_category', { category_name: category });

    if (error) { 
      console.log(error);
      return;
    }

    const options : ComboboxOption[]= data.map((item: any, index: any) => ({
      value: index.toString(),
      label: item.name
    }));

    setComboOptions(options);
    setCategoryData(data)
    setIsErrorModalOpen(false);
    setIsModalOpen(true);
    setIsManual(true);
  }

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setTermsAccepted(false);
    setManualAccepted(false);
    setIsManual(false);
    setCategoryIndex(-1);
  };

  const handleCancel = () => {
    clearInputs();
  };

  if (isSubmitting) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <SpinnerEmpty 
          onCancel={() => {
            setIsSubmitting(false); setIsModalOpen(false);
            }}
        />
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handlePreSubmit}
        className="w-full h-full pb-5 pl-5 pr-2 pt-3 rounded-xl flex flex-col space-y-4"
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

        {/* Image Uploader */}
        <div className="w-full">
          <ImageUploader onImageChange={setImage} image={image} />
        </div>

        {/* Description Input */}
        <Field>
          <FieldContent className="max-h-44">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={4}
            />
          </FieldContent>
        </Field>

        {/* Buttons pinned at the bottom */}
        <div className="flex gap-3 min-w-0 mt-auto">
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
              <Combobox 
                value={categoryIndex.toString()}
                options={comboOption} 
                onValueChange={(value) => setCategoryIndex(parseInt(value))}
              />
              {/* <select
                value={categoryIndex}
                onChange={(e) => setCategoryIndex(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="-1">Please select the correct ID</option>

                {categoryData.map((pipe, index) => (
                  <option key={index} value={index}>
                    {pipe.name} - {pipe.distance?.toFixed(0)}m away
                    {index === 0 && " (Best Match)"}
                  </option>
                ))}
              </select> */}
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

            {/* Manual Acceptance Checkbox */}
            {isManual && ( 
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={manualAccepted}
                onCheckedChange={(checked) =>
                  setManualAccepted(checked as boolean)
                }
              />
              <label
                htmlFor="terms"
                className="text-sm leading-relaxed cursor-pointer"
              >
                I acknowledge that I am submitting this report without GPS
                verification and confirm that the information provided is
                accurate
              </label>
            </div>
            )}
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
              disabled={isDisabled}
              className="w-full sm:w-auto bg-[#4b72f3] border border-[#2b3ea7] text-white hover:bg-blue-600"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isErrorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-w-md mx-4 space-y-4">
            <Alert variant="destructive" className="p-5">
              <AlertCircle />
              <AlertTitle>{errorCode}</AlertTitle>
              <AlertDescription>
                Please ensure your photo was taken at the issue site.
                <ul className="mt-3 space-y-1.5 list-disc list-inside">
                  <li>Enable location services</li>
                  <li>Capture the photo directly from your camera</li>
                  <li>Ensure your device embeds location data in the image</li>
                </ul>
              </AlertDescription>
            </Alert>
            <Button
              type="button"
              onClick={handleManual}
              className="w-full"
            >
              Enter manually
            </Button>
            <Button
              type="button"
              onClick={() => setIsErrorModalOpen(false)}
              className="w-full"
            >
              Go Back
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
