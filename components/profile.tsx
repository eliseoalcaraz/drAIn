"use client";

import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/components/context/AuthProvider";
import client from "@/app/api/client";
import { updateUserProfile } from "@/lib/supabase/profile";

export default function ProfilePage() {
  const authContext = useContext(AuthContext);
  const session = authContext?.session;
  const supabase = client;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [publicAvatarUrl, setPublicAvatarUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      const cacheKey = `profile-${session.user.id}`;
      const cachedProfile = localStorage.getItem(cacheKey);

      if (cachedProfile) {
        const { profile: cachedData, publicAvatarUrl: cachedAvatarUrl } =
          JSON.parse(cachedProfile);
        setProfile(cachedData);
        setPublicAvatarUrl(cachedAvatarUrl);
        setLoading(false);
      } else {
        const fetchProfile = async () => {
          setLoading(true);
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error && error.code !== "PGRST116") {
            console.error("Error fetching profile:", error);
          } else if (data) {
            let avatarUrl = null;
            if (data.avatar_url) {
              const { data: urlData } = supabase.storage
                .from("Avatars")
                .getPublicUrl(data.avatar_url);
              avatarUrl = urlData.publicUrl;
            }
            setProfile(data);
            setPublicAvatarUrl(avatarUrl);
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ profile: data, publicAvatarUrl: avatarUrl })
            );
          }
          setLoading(false);
        };
        fetchProfile();
      }
    } else {
      setLoading(false);
    }
  }, [session, supabase]);

  const handleSignOut = async () => {
    if (session) {
      const cacheKey = `profile-${session.user.id}`;
      localStorage.removeItem(cacheKey);
    }
    await supabase.auth.signOut();
  };

  const handleEdit = () => {
    setFullName(profile?.full_name || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setAvatarFile(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!session) return;
    setErrorMessage(null);

    try {
      const updatedProfile = await updateUserProfile(
        session,
        fullName,
        avatarFile,
        profile
      );
      let newPublicAvatarUrl = null;
      if (updatedProfile.avatar_url) {
        const { data: urlData } = supabase.storage
          .from("Avatars")
          .getPublicUrl(updatedProfile.avatar_url);
        newPublicAvatarUrl = urlData.publicUrl;
      }
      setProfile(updatedProfile);
      setPublicAvatarUrl(newPublicAvatarUrl);

      const cacheKey = `profile-${session.user.id}`;
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          profile: updatedProfile,
          publicAvatarUrl: newPublicAvatarUrl,
        })
      );

      setAvatarFile(null);
      setIsEditing(false);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to update profile.");
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading profile...</p>
          ) : isEditing ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="avatarFile"
                  className="block text-sm font-medium text-gray-700"
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
                  className="mt-1"
                />
              </div>


              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              <div className="flex space-x-2">
                <Button className="flex-1" onClick={handleSave}>
                  Done
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {publicAvatarUrl ? (
                  <img
                    src={publicAvatarUrl}
                    alt="User Avatar"
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-300" />
                )}
                <div>
                  <h2 className="text-xl font-semibold">
                    {profile?.full_name || "No name set"}
                  </h2>
                  {profile?.agency_id && (
                    <p className="text-sm text-gray-500">
                      Agency ID: {profile.agency_id}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full" onClick={handleEdit}>
                  {profile ? "Edit Profile" : "Add Profile"}
                </Button>
                {/* TODO: Implement agency linking functionality in the future */}
                <Button className="w-full" disabled>
                  Link Agency
                </Button>
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
