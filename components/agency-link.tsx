"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AgencyLinkProps {
  onLink: (agencyId: string, agencyName: string) => void;
}

export default function AgencyLink({ onLink }: AgencyLinkProps) {
  const [selectedAgency, setSelectedAgency] = useState("");
  const [selectedAgencyName, setSelectedAgencyName] = useState("");

  const handleLinkAgency = () => {
    onLink(selectedAgency, selectedAgencyName);
  };

  const handleValueChange = (value: string) => {
    setSelectedAgency(value);
    // This is a simplified mapping. In a real app, you'd get this from the data source.
    const agencyMap: { [key: string]: string } = {
      agency1: "Agency 1",
      agency2: "Agency 2",
      agency3: "Agency 3",
    };
    setSelectedAgencyName(agencyMap[value]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link Agency</CardTitle>
        <CardDescription>
          Select your agency to gain admin controls and respond to user reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="agency">Agency</Label>
            <Select onValueChange={handleValueChange}>
              <SelectTrigger id="agency">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                {/* TODO: Fetch and populate agencies from Supabase */}
                <SelectItem value="agency1">Agency 1</SelectItem>
                <SelectItem value="agency2">Agency 2</SelectItem>
                <SelectItem value="agency3">Agency 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleLinkAgency} disabled={!selectedAgency}>
          Link Agency
        </Button>
      </CardFooter>
    </Card>
  );
}
