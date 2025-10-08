"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Session } from "@supabase/supabase-js";

interface EditProfileProps {
  profile: any;
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
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!session) return;
    setErrorMessage(null);
    setIsSaving(true);

    try {
      await onSave(fullName, avatarFile);
      setAvatarFile(null);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to update profile.");
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setAvatarFile(null);
    setFullName(profile?.full_name || "");
    setErrorMessage(null);
    onCancel();
  };

  return (
    <Card className="rounded-t-none">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium mb-2"
            >
              Full Name
            </label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              disabled={isSaving}
            />
          </div>

          <div>
            <label
              htmlFor="avatarFile"
              className="block text-sm font-medium mb-2"
            >
              Upload Avatar
            </label>
            <Input
              id="avatarFile"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setAvatarFile(e.target.files[0]);
                }
              }}
              disabled={isSaving}
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
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
        </div>
      </CardContent>
    </Card>
  );
}
