"use client";

import { useState, useEffect, useContext } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Edit, Link2, MessageSquare } from "lucide-react";
import { AuthContext } from "@/components/context/AuthProvider";
import client from "@/app/api/client";
import { updateUserProfile } from "@/lib/supabase/profile";
import EditProfile from "@/components/edit-profile";
import UserLinks from "@/components/user-links";
import UserReportsList from "@/components/user-reports-list";
import type { ProfileView } from "../hooks/use-control-panel-state";

interface ProfileContentProps {
  profileView: ProfileView;
  onProfileViewChange: (view: ProfileView) => void;
}

export default function ProfileContent({
  profileView,
  onProfileViewChange,
}: ProfileContentProps) {
  const authContext = useContext(AuthContext);
  const session = authContext?.session;
  const supabase = client;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [publicAvatarUrl, setPublicAvatarUrl] = useState<string | null>(null);

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

  const handleSave = async (fullName: string, avatarFile: File | null) => {
    if (!session) return;

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
  };

  return (
    <div className="flex flex-col px-4 gap-4 h-full overflow-y-auto">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center flex-shrink-0">
            {/* Profile Card */}
            <div className="w-full max-w-xl  rounded-2xl bg-[#f7f7f7] border border-[#e2e2e2] overflow-hidden">
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
                    </div>
                  </div>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="p-2 pt-1">
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    className="rounded-lg"
                    variant={profileView === "edit" ? "default" : "outline"}
                    onClick={() =>
                      onProfileViewChange(
                        profileView === "edit" ? "main" : "edit"
                      )
                    }
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    className="rounded-lg"
                    variant={profileView === "links" ? "default" : "outline"}
                    onClick={() =>
                      onProfileViewChange(
                        profileView === "links" ? "main" : "links"
                      )
                    }
                  >
                    <Link2 className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    className="rounded-lg"
                    variant={
                      profileView === "reports" || profileView === "main"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      onProfileViewChange(
                        profileView === "reports" ? "main" : "reports"
                      )
                    }
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="pb-4 flex-shrink-0">
            {profileView === "edit" && (
              <EditProfile
                profile={profile}
                session={session}
                onSave={handleSave}
                onCancel={() => onProfileViewChange("main")}
              />
            )}

            {profileView === "links" && <UserLinks />}

            {(profileView === "reports" || profileView === "main") && (
              <UserReportsList userId={session?.user?.id} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
