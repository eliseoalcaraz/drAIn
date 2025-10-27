"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Session } from "@supabase/supabase-js";
import ImageUploader from "@/components/image-uploader";
import { Label } from "@/components/ui/label";
import { IconInfoCircleFilled } from "@tabler/icons-react";

interface EditProfileProps {
  profile: Record<string, unknown> | null;
  session: Session | null | undefined;
  onSave: (fullName: string, avatarFile: File | null) => Promise<void>;
  onCancel: () => void;
}

export default function EditProfile({
  profile,
  session,
  onSave,
  onCancel,
}: EditProfileProps) {
  const [fullName, setFullName] = useState(String(profile?.full_name || ""));
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isGuest = !session;

  const handleSave = async () => {
    if (!session) return;
    setErrorMessage(null);
    setIsSaving(true);

    try {
      await onSave(fullName, avatarFile);
      setAvatarFile(null);
      setErrorMessage(null);
    } catch (error) {
      const err = error as Error;
      setErrorMessage(err.message || "Failed to update profile.");
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setAvatarFile(null);
    setFullName(String(profile?.full_name || ""));
    setErrorMessage(null);
    onCancel();
  };

  // Check if there are any changes
  const hasChanges =
    fullName !== String(profile?.full_name || "") || avatarFile !== null;

  return (
    <Card className="rounded-none border-none h-full">
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-3 mb-4">
          <div className="px-1 flex flex-row justify-between items-center">
            <Label htmlFor="fullName" className="block font-normal">
              Display Name
            </Label>
            <span className="text-xs text-muted-foreground">Visible</span>
          </div>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            disabled={isSaving || isGuest}
          />
        </div>

        <div className="space-y-2">
          <ImageUploader
            onImageChange={(file) => setAvatarFile(file)}
            placeholder="Upload an Avatar"
            disabled={isGuest}
          />
          <div className="flex flex-row items-center gap-1">
            <span className="text-xs items-center ml-1 text-center text-muted-foreground">
              Most recent uploads are saved
            </span>
            <IconInfoCircleFilled className="w-3.5 h-3.5 text-[#8D8D8D]/50 hover:text-[#8D8D8D] cursor-help" />
          </div>
        </div>

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <div className="flex gap-3 pt-2">
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
