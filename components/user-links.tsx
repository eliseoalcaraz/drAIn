"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AgencyLink from "@/components/agency-link";
import { toast } from "sonner";

interface UserLinksProps {
  isGuest?: boolean;
  profile?: Record<string, unknown> | null;
  onLink?: (agencyId: string, agencyName: string) => Promise<void>;
  onUnlink?: () => Promise<void>;
}

export default function UserLinks({
  isGuest = false,
  profile,
  onLink,
  onUnlink,
}: UserLinksProps) {
  const handleUnlink = async () => {
    if (onUnlink) {
      await onUnlink();
      toast.success("Agency unlinked successfully");
    }
  };

  const handleLink = async (agencyId: string, agencyName: string) => {
    if (onLink) {
      await onLink(agencyId, agencyName);
      toast.success(`Successfully linked to ${agencyName}`);
    }
  };

  return (
    <Card className="rounded-none h-full border-none flex flex-col pb-12">
      <CardContent className="flex-1 flex  justify-center">
        {profile?.agency_id ? (
          <div className="space-y-6 flex flex-col justify-center text-center">
            <div className="text-sm text-muted-foreground">
              You are linked to {(profile.agency_name as string) || "an agency"}. You can now respond to
              reports.
            </div>
            <Button
              className="self-center"
              onClick={handleUnlink}
              disabled={isGuest}
            >
              Unlink Agency
            </Button>
          </div>
        ) : (
          <div className="space-y-2 flex flex-col justify-center w-full">
            <AgencyLink onLink={handleLink} disabled={isGuest} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
