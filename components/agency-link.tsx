"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getAgencies } from "@/lib/supabase/profile";
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
  const [agencies, setAgencies] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const fetchedAgencies = await getAgencies();
        if (fetchedAgencies) {
          setAgencies(fetchedAgencies);
        }
      } catch (error) {
        console.error("Failed to fetch agencies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  const handleLinkAgency = () => {
    onLink(selectedAgency, selectedAgencyName);
  };

  const handleValueChange = (value: string) => {
    setSelectedAgency(value);
    const agency = agencies.find((a) => a.id === value);
    setSelectedAgencyName(agency ? agency.name : "");
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
              <SelectTrigger id="agency" disabled={loading}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                {loading ? (
                  <SelectItem value="loading" disabled>
                    Loading agencies...
                  </SelectItem>
                ) : agencies.length === 0 ? (
                  <SelectItem value="no-agencies" disabled>
                    No agencies available
                  </SelectItem>
                ) : (
                  agencies.map((agency) => (
                    <SelectItem key={agency.id} value={agency.id}>
                      {agency.name}
                    </SelectItem>
                  ))
                )}
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
