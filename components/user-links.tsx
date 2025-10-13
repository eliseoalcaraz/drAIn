"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserLinksProps {
  isGuest?: boolean;
}

export default function UserLinks({ isGuest = false }: UserLinksProps) {
  return (
    <Card className="rounded-none h-full pt-0 pb-14 border-none">
      <CardContent className="flex-1 flex items-center">
        <div className="space-y-2 flex flex-col justify-center">
          <div className="text-sm text-muted-foreground text-center py-8">
            No agency linked yet. Connect your agency account to gain admin
            controls and respond to user reports.
          </div>

          <Button className="w-5/6 self-center" disabled={isGuest}>
            Add Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
