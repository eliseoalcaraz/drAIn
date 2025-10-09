"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function UserLinks() {
  return (
    <Card className="rounded-t-none border-none">
      <CardHeader>
        <CardTitle>Links & Connections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground text-center py-8">
            No links or connections yet. Add your social profiles, websites, or
            other connections.
          </div>

          <Button className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
