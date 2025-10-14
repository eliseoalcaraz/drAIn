"use client";

import AgencyLink from "./agency-link";
import AgencyInfo from "./agency-info";

interface UserLinksProps {
  isGuest?: boolean;
  profile: any; // TODO: Replace with a proper profile type
  onLink: (agencyId: string, agencyName: string) => void;
  onUnlink: () => void;
}

export default function UserLinks({
  isGuest = false,
  profile,
  onLink,
  onUnlink,
}: UserLinksProps) {
  if (isGuest) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          You must be logged in to link an agency.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {profile?.agency_id ? (
        <AgencyInfo
          agencyName={profile.agency_name || "Linked Agency"}
          onUnlink={onUnlink}
        />
      ) : (
        <AgencyLink onLink={onLink} />
      )}
    </div>
  );
}
