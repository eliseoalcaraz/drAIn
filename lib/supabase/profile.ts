import client from "@/app/api/client";
import { Session } from "@supabase/supabase-js";

export const updateUserProfile = async (
  session: Session,
  fullName: string,
  avatarFile: File | null,
  currentProfile: any
) => {
  try {
    const user = session.user;

    // Basic input validation
    if (!fullName.trim()) {
      throw new Error("Full name cannot be empty.");
    }

    let avatar_url = currentProfile?.avatar_url || "";
    let newAvatarPath: string | null = null;

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      // New file path to align with RLS policies (user_id/avatar.ext)
      const filePath = `${user.id}/avatar.${fileExt}`;
      newAvatarPath = filePath;

      const { error: uploadError } = await client.storage
        .from("Avatars")
        .upload(filePath, avatarFile, {
          cacheControl: "3600",
          upsert: true,
          contentType: avatarFile.type,
        });

      if (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        throw uploadError;
      }

      // Store the file path (not the full URL) in the database
      avatar_url = filePath;
    }

    let data, error;

    if (currentProfile) {
      // Update existing profile
      ({ data, error } = await client
        .from("profiles")
        .update({
          full_name: fullName,
          avatar_url: avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single());
    } else {
      // Create new profile
      ({ data, error } = await client
        .from("profiles")
        .insert({
          id: user.id,
          full_name: fullName,
          avatar_url: avatar_url,
          role: "user", // Explicitly set role for new users
        })
        .select()
        .single());
    }

    if (error) {
      console.error("Error updating profile:", error);
      // If the profile update fails, delete the newly uploaded avatar
      if (newAvatarPath) {
        await client.storage.from("Avatars").remove([newAvatarPath]);
      }
      throw error;
    }

    return data;
  } catch (error: any) {
    const errorMessage = error.message || "An unknown error occurred.";
    console.error("Error in updateUserProfile:", errorMessage, error);
    throw new Error(errorMessage);
  }
};
