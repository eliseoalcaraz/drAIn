"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AgencyLink from "@/components/agency-link";

interface UserLinksProps {
  isGuest?: boolean;
  profile?: any;
  onLink?: (agencyId: string, agencyName: string) => Promise<void>;
  onUnlink?: () => Promise<void>;
}

export default function UserLinks({
  isGuest = false,
  profile,
  onLink,
  onUnlink,
}: UserLinksProps) {
  return (
    <Card className="rounded-none h-full pt-0 pb-14 border-none">
      <CardContent className="flex-1 flex items-center justify-center">
        {profile?.agency_id ? (
          <div className="space-y-2 flex flex-col justify-center text-center">
            <div className="text-sm text-muted-foreground py-8">
              You are linked to {profile.agency_name}.
            </div>
            <Button className="self-center" onClick={onUnlink} disabled={isGuest}>
              Unlink Agency
            </Button>
          </div>
        ) : (
          <div className="space-y-2 flex flex-col justify-center">
            <div className="text-sm text-muted-foreground text-center py-8">
              No agency linked yet. Connect your agency account to gain admin
              controls and respond to user reports.
            </div>
            <AgencyLink onLink={onLink} disabled={isGuest} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
