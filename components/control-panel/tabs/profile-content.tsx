"use client";

import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Share2, User } from "lucide-react";
import { AuthContext } from "@/components/context/AuthProvider";
import client from "@/app/api/client";
import { updateUserProfile } from "@/lib/supabase/profile";

export default function ProfileContent() {
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
            const avatarUrl = data.avatar_url;
            console.log(avatarUrl);
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

  useEffect(() => {
    console.log(publicAvatarUrl);
  }, [publicAvatarUrl]);

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
    <div className="h-full overflow-y-auto">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      ) : isEditing ? (
        <Card className="m-4">
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
                />
              </div>

              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              <div className="flex gap-3 pt-2">
                <Button className="flex-1" onClick={handleSave}>
                  Save Changes
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
          </CardContent>
        </Card>
      ) : (
        <div className="relative px-5">
          {/* Header Banner */}
          <div className="h-30 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 relative rounded-2xl">
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-white/90 hover:bg-white"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Avatar - positioned to overlap header */}
          <div className="flex justify-center -mt-16 mb-4">
            <Avatar className="w-28 h-28 border-4 border-background">
              <AvatarImage
                src={publicAvatarUrl || undefined}
                alt="User Avatar"
              />
              <AvatarFallback>
                <User className="h-12 w-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Content */}
          <div className="px-6 pb-6 text-center">
            {/* Full Name */}
            <h1 className="text-2xl font-bold mb-1">
              {profile?.full_name || "No name set"}
            </h1>

            <div className="flex justify-center">
              {/* Username/Email */}
              <p className="text-sm text-muted-foreground mb-1">
                @{session?.user?.email?.split("@")[0] || "user"}
              </p>
              {/* Metadata
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
                {profile?.agency_id && (
                  <span>Agency ID: {profile.agency_id}</span>
                )}
                {profile?.agency_id && profile?.created_at && <span>•</span>}
                {profile?.created_at && (
                  <span>
                    Joined{" "}
                    {new Date(profile.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div> */}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 max-w-md mx-auto">
              <Button
                className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold"
                onClick={handleEdit}
              >
                {profile ? "Edit profile" : "Add Profile"}
              </Button>
              <Button
                className="flex-1 font-semibold"
                variant="outline"
                disabled
              >
                Link Agency
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
