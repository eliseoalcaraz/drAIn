"use client";

import { useState, useEffect, useContext } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs-modified";
import { Pencil, Link2, FileText } from "lucide-react";
import { AuthContext } from "@/components/context/AuthProvider";
import client from "@/app/api/client";
import {
  updateUserProfile,
  linkAgencyToProfile,
  unlinkAgencyFromProfile,
} from "@/lib/supabase/profile";
import EditProfile from "@/components/edit-profile";
import UserLinks from "@/components/user-links";
import UserReportsList from "@/components/user-reports-list";
import type { ProfileView } from "../hooks/use-control-panel-state";
import Image from "next/image";

interface ProfileContentProps {
  profileView: ProfileView;
  onProfileViewChange: (view: ProfileView) => void;
  profile: any;
  publicAvatarUrl: string | null;
  setProfile: (profile: any) => void;
  setPublicAvatarUrl: (url: string | null) => void;
}

export default function ProfileContent({
  profileView,
  onProfileViewChange,
  profile,
  publicAvatarUrl,
  setProfile,
  setPublicAvatarUrl,
}: ProfileContentProps) {
  const authContext = useContext(AuthContext);
  const session = authContext?.session;
  const isGuest = !session;
  const supabase = client;
  const loading = !profile && !isGuest;

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

  const handleLinkAgency = async (agencyId: string, agencyName: string) => {
    if (!profile || !session) return;
    await linkAgencyToProfile(session.user.id, agencyId); // Persist to Supabase
    const updatedProfile = {
      ...profile,
      agency_id: agencyId,
      agency_name: agencyName,
    };
    setProfile(updatedProfile);
    // Also update the cache
    const cacheKey = `profile-${session.user.id}`;
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        profile: updatedProfile,
        publicAvatarUrl: publicAvatarUrl,
      })
    );
  };

  const handleUnlinkAgency = async () => {
    if (!profile || !session) return;
    await unlinkAgencyFromProfile(session.user.id); // Persist to Supabase
    const { agency_id, agency_name, ...rest } = profile;
    const updatedProfile = { ...rest };
    setProfile(updatedProfile);
    // Also update the cache
    const cacheKey = `profile-${session.user.id}`;
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        profile: updatedProfile,
        publicAvatarUrl: publicAvatarUrl,
      })
    );
  };

  return (
    <div className="flex flex-col pl-5 pr-2.5 h-full overflow-y-auto">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      ) : (
        <>
          {/* Profile Card */}
          <div className="flex flex-col gap-2 mb-4 justify-center flex-shrink-0">
            <div className="w-full max-w-xl rounded-2xl bg-[#f7f7f7] border border-[#e2e2e2] overflow-hidden">
              {/* Header Section */}
              <div className="relative p-1">
                <Card className="flex flex-row p-1 gap-4">
                  {/* Avatar */}
                  <Avatar className="w-20 h-20 rounded-lg overflow-hidden bg-[#f2f2f2] flex-shrink-0">
                    <AvatarImage
                      src={publicAvatarUrl || undefined}
                      alt="User Avatar"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-[#f2f2f2]">
                      <Image
                        src="/images/placeholder.jpg"
                        alt="Unknown User"
                        fill
                        className="object-cover transition-all duration-200"
                      />
                    </AvatarFallback>
                  </Avatar>

                  {/* Profile Info */}
                  <div className="flex-1 flex-col self-center min-w-0">
                    <h1 className="text-base font-semibold text-black truncate">
                      {profile?.full_name || "No name set"}
                    </h1>

                    <div className="flex flex-col">
                      <p className="text-zinc-400 text-xs truncate">
                        {session?.user?.email || "No email"}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <Tabs
            value={profileView === "main" ? "reports" : profileView}
            onValueChange={(value) => onProfileViewChange(value as ProfileView)}
            className="flex-1 flex flex-col min-h-0 space-y-0 gap-0"
          >
            <TabsList className="flex-shrink-0 border-x-1 border-b-0 pb-0.5 border-[#ced1cd]">
              <TabsTrigger value="edit">
                <Pencil className="h-4 w-4" />
                <span className="font-normal text-xs">Edit</span>
              </TabsTrigger>
              <TabsTrigger value="links">
                <Link2 className="h-4 w-4" />
                <span className="font-normal text-xs">Links</span>
              </TabsTrigger>
              <TabsTrigger value="reports">
                <FileText className="h-4 w-4" />
                <span className="font-normal text-xs">Reports</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="edit"
              className="flex-1 mb-5 rounded-b-xl border border-[#ced1cd] border-t-0 overflow-y-auto"
            >
              <EditProfile
                profile={profile}
                session={session}
                onSave={handleSave}
                onCancel={() => onProfileViewChange("reports")}
              />
            </TabsContent>

            <TabsContent
              value="links"
              className="flex-1 mb-5 rounded-b-xl border border-[#ced1cd] border-t-0 overflow-y-auto"
            >
              <UserLinks
                isGuest={isGuest}
                profile={profile}
                onLink={handleLinkAgency}
                onUnlink={handleUnlinkAgency}
              />
            </TabsContent>

            <TabsContent
              value="reports"
              className="flex-1 mb-5 rounded-b-xl border border-[#ced1cd] border-t-0 overflow-y-auto"
            >
              <UserReportsList userId={session?.user?.id} isGuest={isGuest} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
