"use client";

import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Edit, Link2, MessageSquare, BadgeCheck } from "lucide-react";
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
        <div className="flex items-center justify-center p-4 pt-0">
          {/* Profile Card */}
          <div className="w-full max-w-xl  rounded-2xl bg-[#eeeeee] border border-[#e2e2e2] overflow-hidden">
            {/* Header Section */}
            <div className="relative p-1">
              <Card className="flex flex-row p-1 gap-2">
                {/* Avatar */}
                <Avatar className="w-20 h-20 rounded-lg overflow-hidden bg-amber-100 flex-shrink-0">
                  <AvatarImage
                    src={publicAvatarUrl || undefined}
                    alt="User Avatar"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-amber-100">
                    <User className="h-12 w-12 text-zinc-900" />
                  </AvatarFallback>
                </Avatar>

                {/* Profile Info */}
                <div className="flex-1 flex-col self-center min-w-0">
                  <h1 className="text-base font-semibold text-black truncate">
                    {profile?.full_name || "No name set"}
                  </h1>

                  <div className="flex flex-col ">
                    <p className="text-zinc-400 text-xs truncate">
                      {session?.user?.email || "No email"}
                    </p>
                    {/* Metadata
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      {profile?.agency_id && (
                        <span>Agency ID: {profile.agency_id}</span>
                      )}
                      {profile?.agency_id && profile?.created_at && (
                        <span>•</span>
                      )}
                      {profile?.created_at && (
                        <span>
                          Joined{" "}
                          {new Date(profile.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      )}
                    </div> */}
                  </div>
                </div>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="p-2 pt-1">
              <div className="flex gap-2">
                <Button size="icon" onClick={handleEdit}>
                  <Edit className="h-5 w-5" />
                </Button>
                <Button size="icon" disabled>
                  <Link2 className="h-5 w-5" />
                </Button>
                <Button size="icon">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
